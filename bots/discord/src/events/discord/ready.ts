import { database, logger } from '$/context'
import { appliedPresets } from '$/database/schemas'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'
import { on, withContext } from '$/utils/discord/events'
import { removeRolePreset } from '$/utils/discord/rolePresets'
import { and, eq, lt } from 'drizzle-orm'

import { type Client, DiscordAPIError } from 'discord.js'

export default withContext(on, 'ready', async ({ config, discord, logger }, client) => {
    logger.info(`Connected to Discord API, logged in as ${client.user.displayName} (@${client.user.tag})!`)
    logger.info(`Bot is in ${client.guilds.cache.size} guilds`)

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

    if (config.rolePresets) {
        removeExpiredPresets(client)
        setTimeout(() => removeExpiredPresets(client), config.rolePresets.checkExpiredEvery)
    }
})

const removeExpiredPresets = async (client: Client) => {
    logger.debug('Checking for expired role presets...')

    const expireds = await database.query.appliedPresets.findMany({
        where: lt(appliedPresets.until, Math.floor(Date.now() / 1000)),
    })

    for (const expired of expireds) {
        try {
            logger.debug(`Removing role preset for ${expired.memberId} in ${expired.guildId}`)

            const guild = await client.guilds.fetch(expired.guildId)
            const member = await guild.members.fetch(expired.memberId)

            await removeRolePreset(member, expired.preset)
        } catch (e) {
            // Unknown Member: https://discord.com/developers/docs/topics/opcodes-and-status-codes#json
            if (!(e instanceof DiscordAPIError) || e.code !== 10007) {
                logger.error(`Error while removing role preset for ${expired.memberId} in ${expired.guildId}: ${e}`)
                continue
            }
        }

        await database
            .delete(appliedPresets)
            .where(and(eq(appliedPresets.guildId, expired.guildId), eq(appliedPresets.memberId, expired.memberId)))
    }
}
