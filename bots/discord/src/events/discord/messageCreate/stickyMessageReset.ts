import { on, withContext } from '$utils/discord/events'

withContext(on, 'messageCreate', async ({ discord, logger }, msg) => {
    if (!msg.inGuild()) return
    if (msg.author.id === msg.client.user.id) return

    const store = discord.stickyMessages[msg.guildId]?.[msg.channelId]
    if (!store) return

    if (store.timerActive) {
        // Timer is already active, so we try to start the force timer
        if (store.forceTimerMs && !store.forceTimerActive) {
            // Force timer isn't active, so we start it
            logger.debug(
                `Channel ${msg.channelId} in guild ${msg.guildId} is active, starting force send timer and clearing existing timer`,
            )

            // Clear the timer
            clearTimeout(store.timer)
            store.timerActive = false

            // Start the force timer
            store.forceTimerActive = true
            // biome-ignore lint/suspicious/noAssignInExpressions: This works fine
            ;(store.forceTimer ??= setTimeout(store.send, store.forceTimerMs)).refresh()
        }
    } else if (store.forceTimerActive) {
        // Force timer is already active, so force send the message, and clear the force timer
        store.send(true)
    } else {
        // Both timers aren't active, so we start the timer
        store.timerActive = true
        if (!store.timer) store.timer = setTimeout(store.send, store.timerMs) as NodeJS.Timeout
    }
})
