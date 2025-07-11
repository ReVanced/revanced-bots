import { MessageFlags, type TextBasedChannel } from 'discord.js'
import { createErrorEmbed, createStackTraceEmbed, createSuccessEmbed } from '$utils/discord/embeds'
import { on, withContext } from '$utils/discord/events'

withContext(on, 'interactionCreate', async (context, interaction) => {
    const {
        logger,
        config: { messageScan: msConfig },
    } = context

    if (!msConfig?.humanCorrections) return
    if (!interaction.isStringSelectMenu()) return
    if (!interaction.customId.startsWith('tr_')) return

    const [, channelId, msgId] = interaction.customId.split('_') as ['tr', string, string]
    if (!channelId || !msgId) return

    try {
        const channel = (await interaction.client.channels.fetch(channelId)) as TextBasedChannel | null
        const msg = await channel?.messages.fetch(msgId)

        if (!msg)
            return void (await interaction.reply({
                embeds: [
                    createErrorEmbed(
                        'Message not found',
                        'Thank you for your contribution! Unfortunately, the message could not be found.',
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            }))

        // If selectedLabel is empty, it means "out of scope", so we pass undefined
        const selectedLabel = interaction.values[0] || undefined
        await context.api.client.trainMessage(msg.content, selectedLabel)
        await interaction.reply({
            embeds: [
                createSuccessEmbed(
                    'Message being trained',
                    `Thank you for your contribution! The selected message is being trained as \`${selectedLabel}\`. 🎉`,
                ),
            ],
            flags: MessageFlags.Ephemeral,
        })
    } catch (e) {
        logger.error('Failed to handle train message interaction:', e)
        await interaction.reply({
            embeds: [createStackTraceEmbed(e)],
            flags: MessageFlags.Ephemeral,
        })
    }
})
