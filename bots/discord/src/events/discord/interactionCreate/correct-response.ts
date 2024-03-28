import { handleUserResponseCorrection } from '$/utils/discord/messageScan'
import { createErrorEmbed, createStackTraceEmbed, createSuccessEmbed } from '$utils/discord/embeds'
import { on } from '$utils/discord/events'

import type { ButtonInteraction, StringSelectMenuInteraction, TextBasedChannel } from 'discord.js'

// No permission check required as it is already done when the user reacts to a bot response
export default on('interactionCreate', async (context, interaction) => {
    const {
        logger,
        database: db,
        config: { messageScan: msConfig },
    } = context

    if (!msConfig?.humanCorrections) return
    if (!interaction.isStringSelectMenu() && !interaction.isButton()) return
    if (!interaction.customId.startsWith('cr_')) return

    const [, key, action] = interaction.customId.split('_') as ['cr', string, 'select' | 'cancel' | 'delete']
    if (!key || !action) return

    const response = db.labeledResponses.get(key)
    // If the message isn't saved in my DB (unrelated message)
    if (!response)
        return void (await interaction.reply({
            content: "I don't recall having sent this response, so I cannot correct it.",
            ephemeral: true,
        }))

    try {
        // We're gonna pretend reactionChannel is a text-based channel, but it can be many more
        // But `messages` should always exist as a property
        const reactionGuild = await interaction.client.guilds.fetch(response.guild)
        const reactionChannel = (await reactionGuild.channels.fetch(response.channel)) as TextBasedChannel | null
        const reactionMessage = await reactionChannel?.messages.fetch(key)

        if (!reactionMessage) {
            await interaction.deferUpdate()
            await interaction.message.edit({
                content: null,
                embeds: [
                    createErrorEmbed(
                        'Response not found',
                        'Thank you for your feedback! Unfortunately, the response message could not be found (most likely deleted).',
                    ),
                ],
                components: [],
            })

            return
        }

        const editMessage = (content: string, description?: string) =>
            editInteractionMessage(interaction, reactionMessage.url, content, description)
        const handleCorrection = (label: string) =>
            handleUserResponseCorrection(context, response, reactionMessage, label, interaction.user)

        if (response.correctedBy)
            return await editMessage(
                'Response already corrected',
                'Thank you for your feedback! Unfortunately, this response has already been corrected by someone else.',
            )

        // We immediately know that the action is `select`
        if (interaction.isStringSelectMenu()) {
            const selectedLabel = interaction.values[0]!

            await handleCorrection(selectedLabel)
            await editMessage(
                'Message being trained',
                `Thank you for your feedback! I've edited the response according to the selected label (\`${selectedLabel}\`). The message is now being trained. 🎉`,
            )
        } else {
            switch (action) {
                case 'cancel':
                    await editMessage('Canceled', 'You canceled this interaction. 😞')
                    break
                case 'delete':
                    await handleCorrection(msConfig.humanCorrections.falsePositiveLabel)
                    await editMessage(
                        'Marked as false positive',
                        'The response has been deleted and marked as a false positive. Thank you for your feedback. 🎉',
                    )

                    break
            }
        }
    } catch (e) {
        logger.error('Failed to handle correct response interaction:', e)
        await interaction.reply({
            embeds: [createStackTraceEmbed(e)],
            ephemeral: true,
        })
    }
})

const editInteractionMessage = async (
    interaction: StringSelectMenuInteraction | ButtonInteraction,
    replyUrl: string,
    title: string,
    description?: string,
) => {
    if (!interaction.deferred) await interaction.deferUpdate()
    await interaction.message.edit({
        content: null,
        embeds: [
            createSuccessEmbed(title, `${description ?? ''}\n\n**⬅️ Back to bot response**: ${replyUrl}`.trimStart()),
        ],
        components: [],
    })
}
