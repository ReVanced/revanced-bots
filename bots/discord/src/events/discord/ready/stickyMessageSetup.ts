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

                // Set up the store
                // biome-ignore lint/suspicious/noAssignInExpressions: don't care
                const store = (discord.stickyMessages[guildId]![channelId] = {
                    forceTimerActive: false,
                    timerActive: false,
                    forceTimerMs: forceSendTimeout,
                    timerMs: timeout,
                    async send() {
                        try {
                            await Promise.all([
                                channel
                                    .send({
                                        ...message,
                                        embeds: message.embeds?.map(it => applyCommonEmbedStyles(it, true, true, true)),
                                    })
                                    .then(msg => {
                                        this.currentMessage = msg
                                        logger.debug(`Sent sticky message to channel ${channelId} in guild ${guildId}`)
                                    }),
                                this.currentMessage
                                    ?.delete()
                                    ?.then(() =>
                                        logger.debug(
                                            `Deleted old sticky message from channel ${channelId} in guild ${guildId}`,
                                        ),
                                    ),
                            ])
                        } catch (e) {
                            logger.error(
                                `Error while managing sticky message of channel ${channelId} in guild ${guildId}:`,
                                e,
                            )
                        } finally {
                            // Clear any remaining timers
                            clearTimeout(this.timer)
                            clearTimeout(this.forceTimer)
                            this.forceTimerActive = this.timerActive = false

                            logger.debug(`Cleared sticky message timer for channel ${channelId} in guild ${guildId}`)
                        }
                    },
                    // If the store exists before the configuration refresh, take its current message
                    currentMessage: oldStore?.[channelId]?.currentMessage,
                })

                // Send a new sticky message immediately, as well as deleting the old/outdated message, if it exists
                await store.send()
            }
        }
})
