import { on, withContext } from '$utils/discord/events'

withContext(on, 'messageCreate', async ({ discord, logger }, msg) => {
    if (!msg.inGuild()) return
    if (msg.author.id === msg.client.user.id) return

    const store = discord.stickyMessages[msg.guildId]?.[msg.channelId]
    if (!store) return

    // Timer is already active from previous event, and force timer isn't active, so we start the latter
    if (store.timerActive && store.forceTimerMs && !store.forceTimerActive) {
        logger.debug(
            `Channel ${msg.channelId} in guild ${msg.guildId} is very active, starting sticky message force timer`,
        )

        // (Re)start the force timer
        store.forceTimerActive = true
        if (store.forceTimer) store.forceTimer.refresh()
        else store.forceTimer = setTimeout(store.send, store.forceTimerMs)
    }

    logger.debug(`Channel ${msg.channelId} in guild ${msg.guildId} is active, starting sticky message timer`)

    // (Re)start the timer
    store.timerActive = true
    if (store.timer) store.timer.refresh()
    else store.timer = setTimeout(store.send, store.timerMs) as NodeJS.Timeout
})
