import { applyCommonEmbedStyles } from '$/utils/discord/embeds'
import { on, withContext } from '$/utils/discord/events'

export default withContext(on, 'ready', async ({ config, discord, logger }, client) => {
    if (config.stickyMessages)
        for (const [guildId, channels] of Object.entries(config.stickyMessages)) {
            const guild = await client.guilds.fetch(guildId)
            // In case of configuration refresh, this will not be nullable
            const oldStore = discord.stickyMessages[guildId]
            discord.stickyMessages[guildId] = {}

            for (const [channelId, { message, timeout, forceSendTimeout }] of Object.entries(channels)) {
                const channel = await guild.channels.fetch(channelId)
                if (!channel?.isTextBased())
                    return void logger.warn(
                        `Channel ${channelId} in guild ${guildId} is not a text channel, sticky messages will not be sent`,
                    )

                const send = async () => {
                    const store = discord.stickyMessages[guildId]![channelId]
                    if (!store) return

                    try {
                        const oldMsg = store.currentMessage

                        store.currentMessage = await channel.send({
                            ...message,
                            embeds: message.embeds?.map(it => applyCommonEmbedStyles(it, true, true, true)),
                        })

                        await oldMsg?.delete()
                    } catch (e) {
                        logger.error(
                            `Error while sending sticky message to channel ${channelId} in guild ${guildId}:`,
                            e,
                        )
                    } finally {
                        // Clear any remaining timers
                        clearTimeout(store.timer)
                        clearTimeout(store.forceTimer)
                        store.forceTimerActive = store.timerActive = false

                        logger.debug(`Sent sticky message to channel ${channelId} in guild ${guildId}`)
                    }
                }

                // Set up the store
                discord.stickyMessages[guildId]![channelId] = {
                    forceTimerActive: false,
                    timerActive: false,
                    forceTimerMs: forceSendTimeout,
                    timerMs: timeout,
                    send,
                    // If the store exists before the configuration refresh, take its current message
                    currentMessage: oldStore?.[channelId]?.currentMessage,
                }

                // Send a new sticky message immediately, as well as deleting the old/outdated message, if it exists
                await send()
            }
        }
})
