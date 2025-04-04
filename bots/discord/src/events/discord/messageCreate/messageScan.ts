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
    } = context

    if (!config || !config.responses) return
    if (msg.author.bot && !config.scanBots) return
    if (!msg.inGuild() && !config.scanOutsideGuilds) return
    if (msg.inGuild() && msg.member?.partial) await msg.member.fetch()

    const filteredResponses = config.responses.filter(x => messageMatchesFilter(msg, x.filterOverride ?? config.filter))
    if (!filteredResponses.length) return

    if (msg.content.length) {
        try {
            logger.debug(`Classifying message ${msg.id}, possible responses is ${filteredResponses.length}`)

            const { response, label, respondToReply } = await getResponseFromText(
                msg.content,
                filteredResponses,
                context,
            )

            if (response) {
                logger.debug('Response found')

                const toReply = respondToReply ? (msg.reference?.messageId ? await msg.fetchReference() : msg) : msg
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
                        content: msg.content,
                    })
                }
            }
        } catch (e) {
            logger.error('Failed to classify message:', e)
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
