import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from 'discord.js'
import { eq } from 'drizzle-orm'
import { MessageScanLabeledResponseReactions as Reactions } from '$/constants'
import { responses } from '$/database/schemas'
import { createErrorEmbed, createStackTraceEmbed, createSuccessEmbed } from '$/utils/discord/embeds'
import { on, withContext } from '$/utils/discord/events'
import { handleUserResponseCorrection } from '$/utils/discord/messageScan'
import { isAdmin } from '$/utils/discord/permissions'
import type { ConfigMessageScanResponseLabelConfig } from '$/../config.schema'

const PossibleReactions = Object.values(Reactions) as string[]

withContext(on, 'messageReactionAdd', async (context, rct, user) => {
    if (user.bot) return

    const { database: db, logger, config } = context
    const { messageScan: msConfig } = config

    // If there's no config, we can't do anything
    if (!msConfig?.humanCorrections) return

    const reaction = await rct.fetch()
    const reactionMessage = await reaction.message.fetch()

    if (reactionMessage.author.id !== reaction.client.user!.id) return
    if (!PossibleReactions.includes(reaction.emoji.name!)) return
    await rct.users.remove(user.id)

    if (!isAdmin(reactionMessage.member || reactionMessage.author)) {
        // User is in guild, and config has member requirements
        if (reactionMessage.inGuild() && msConfig.humanCorrections.allow) {
            const {
                allow: { users: allowedUsers, members: allowedMembers },
            } = msConfig.humanCorrections

            if (allowedMembers) {
                const member = await reactionMessage.guild.members.fetch(user.id)
                const { permissions, roles } = allowedMembers

                if (
                    !(
                        (permissions ? member.permissions.has(permissions) : false) ||
                        roles?.some(role => member.roles.cache.has(role))
                    )
                )
                    return
            } else if (!allowedUsers?.includes(user.id)) return
        } else
            return void logger.warn(
                'No member or user requirements set for human corrections, all requests will be ignored',
            )
    }

    // Sanity check
    const response = await db.query.responses.findFirst({ where: eq(responses.replyId, rct.message.id) })
    if (!response || response.correctedById) return

    logger.debug(`User ${user.id} is trying to correct the response ${rct.message.id}`)

    const handleCorrection = (label?: string) =>
        handleUserResponseCorrection(context, response, reactionMessage, user, label)

    try {
        if (reaction.emoji.name === Reactions.train) {
            // Bot is right, nice!

            await handleCorrection(response.label)
            await user.send({ embeds: [createSuccessEmbed('Trained message', 'Thank you for your feedback.')] })
        } else if (reaction.emoji.name === Reactions.edit) {
            // Bot is wrong :(

            const labels = msConfig.responses!.flatMap(r =>
                r.triggers
                    .text!.filter((t): t is ConfigMessageScanResponseLabelConfig => 'label' in t)
                    .map(t => t.label),
            )

            const componentPrefix = `cr_${reactionMessage.id}`
            const select = new StringSelectMenuBuilder().setCustomId(`${componentPrefix}_select`)

            for (const label of labels) {
                const opt = new StringSelectMenuOptionBuilder().setLabel(label).setValue(label)

                if (label === response.label) {
                    opt.setDefault(true)
                    opt.setLabel(`${label} (current)`)
                    opt.setDescription('This is the current label of the message')
                }

                select.addOptions(opt)
            }

            const rows = [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select),
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setEmoji('⬅️')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(`${componentPrefix}_cancel`),
                    new ButtonBuilder()
                        .setEmoji(Reactions.delete)
                        .setLabel('Delete (mark as out of scope)')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId(`${componentPrefix}_delete`),
                ),
            ]

            await user.send({
                content: 'Please pick the right label for the message (you can only do this once!)',
                components: rows,
            })
        } else if (reaction.emoji.name === Reactions.delete) {
            await handleCorrection()
            await user.send({ content: 'The response has been deleted and marked as out of scope.' })
        }
    } catch (e) {
        logger.error('Failed to correct response:', e)
        user.send({
            embeds: [createStackTraceEmbed(e)],
        }).catch(() => {
            reactionMessage.reply({
                content: `<@${user.id}>`,
                embeds: [
                    createErrorEmbed(
                        'Enable your DMs!',
                        'I cannot send you messages. Please enable your DMs to use this feature.',
                    ),
                ],
            })
        })
    }
})
