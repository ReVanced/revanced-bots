import { SkipReason } from '@revanced/bot-shared'
import { MessageScanLabeledResponseReactions } from '$/constants'
import { responses } from '$/database/schemas'
import { getResponseFromText, messageMatchesFilter } from '$/utils/discord/messageScan'
import { createMessageScanResponseEmbed } from '$utils/discord/embeds'
import { on, withContext } from '$utils/discord/events'

withContext(on, 'messageCreate', async (context, msg) => {
    const {
        api,
        config: { messageScan: config },
        database: db,
        logger,
        conversationContext,
        conversationContextConfig,
    } = context

    if (!config || !config.responses) return
    if (msg.author.bot && !config.scanBots) return
    if (!msg.inGuild() && !config.scanOutsideGuilds) return
    if (msg.inGuild() && msg.member?.partial) await msg.member.fetch()

    const filteredResponses = config.responses.filter(x => messageMatchesFilter(msg, x.filterOverride ?? config.filter))
    if (!filteredResponses.length) return

    const userId = msg.author.id

    if (msg.content.length) {
        try {
            logger.debug(`Classifying message ${msg.id}, possible responses is ${filteredResponses.length}`)

            let textToProcess = msg.content
            let aiResult: Awaited<ReturnType<typeof api.client.parseMessage>> | undefined

            if (conversationContextConfig.enabled) {
                const fullText = conversationContext.add(msg.channel.id, userId, msg.content)

                aiResult = await api.client.parseMessage(fullText)

                const { intent, skipReason } = aiResult

                if (!intent.isActionable) {
                    logger.debug(`Buffer incomplete (${intent?.scores?.complete?.toFixed(2)}), waiting...`)
                    return
                }

                if (skipReason === SkipReason.NotActionable || skipReason === SkipReason.NotRelevant) {
                    logger.debug(`Buffer dropped: ${skipReason}`)
                    conversationContext.clear(msg.channel.id, userId)
                    return
                }
                textToProcess = fullText
                conversationContext.clear(msg.channel.id, userId)
            }

            const { response, label, respondToReply } = await getResponseFromText(
                textToProcess,
                filteredResponses,
                context,
            )

            if (response) {
                logger.debug('Regex response found')
                const toReply =
                    msg.reference?.messageId &&
                    (respondToReply === true ||
                        (label === undefined ? respondToReply === 'only_regex' : respondToReply === 'only_labeled'))
                        ? await msg.fetchReference()
                        : msg

                const reply = await toReply.reply({
                    ...response,
                    embeds: response.embeds?.map(createMessageScanResponseEmbed),
                })

                if (label) {
                    await db.insert(responses).values({
                        replyId: reply.id,
                        channelId: reply.channel.id,
                        guildId: reply.guild!.id,
                        referenceId: msg.id,
                        label,
                        content: textToProcess,
                    })

                    await Promise.all(Object.values(MessageScanLabeledResponseReactions).map(name => reply.react(name)))
                }
            } else if (aiResult?.shouldRespond) {
                logger.debug('Lets try the fallback we might already have?')

                const aiContent = aiResult.llmResponse ?? aiResult.ragResults?.qa?.[0]?.answer

                if (aiContent) {
                    await msg.reply({
                        content: aiContent,
                    })
                }
            }
        } catch (e) {
            logger.error('Failed to classify message:', e)
            conversationContext.clear(msg.channel.id, userId)
        }
    }

    if (msg.attachments.size && config.attachments?.scanAttachments) {
        logger.debug(`Classifying message attachments for ${msg.id}, possible responses is ${filteredResponses.length}`)

        for (const attachment of msg.attachments.values()) {
            const mimeType = attachment.contentType?.split(';')?.[0]
            if (!mimeType) return void logger.warn(`No MIME type for attachment: ${attachment.url}`)

            if (config.attachments.allowedMimeTypes && !config.attachments.allowedMimeTypes.includes(mimeType)) {
                logger.debug(`Disallowed MIME type for attachment: ${attachment.url}, ${mimeType}`)
                continue
            }

            const isTextFile = mimeType.startsWith('text/')

            if (isTextFile && attachment.size > (config.attachments.maxTextFileSize ?? 512 * 1000)) {
                logger.debug(`Attachment ${attachment.url} is too large be to scanned, size is ${attachment.size}`)
                continue
            }

            try {
                let response: Awaited<ReturnType<typeof getResponseFromText>>['response'] | undefined

                if (isTextFile) {
                    const content = await (await fetch(attachment.url)).text()
                    response = await getResponseFromText(content, filteredResponses, context, {
                        textRegexesOnly: true,
                    }).then(it => it.response)
                } else {
                    const { text: content } = await api.client.parseImage(attachment.url)
                    response = await getResponseFromText(content, filteredResponses, context, {
                        imageTriggersOnly: true,
                    }).then(it => it.response)
                }

                if (response) {
                    logger.debug(`Response found for attachment: ${attachment.url}`)
                    await msg.reply({
                        ...response,
                        embeds: response.embeds?.map(createMessageScanResponseEmbed),
                    })

                    break
                }
            } catch (e) {
                logger.error(`Failed to parse attachment: ${attachment.url}`, e)
            }
        }
    }
})
