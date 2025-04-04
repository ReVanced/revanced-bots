import { on, withContext } from '$utils/api/events'
import { DisconnectReason, HumanizedDisconnectReason } from '@revanced/bot-shared'

withContext(on, 'disconnect', ({ api, config, logger }, reason, msg) => {
    if (reason === DisconnectReason.PlannedDisconnect && api.intentionallyDisconnecting) return

    const ws = api.client.ws
    if (!ws.disconnected) ws.disconnect()

    logger.fatal(
        `Disconnected from the bot API ${
            reason in HumanizedDisconnectReason
                ? `because ${HumanizedDisconnectReason[reason as keyof typeof HumanizedDisconnectReason]}`
                : 'for an unknown reason'
        }`,
    )

    if (api.disconnectCount >= (config.api.disconnectLimit ?? 3)) {
        logger.fatal('Disconnected from bot API too many times')
        // We don't want the process hanging
        process.exit(1)
    }

    logger.info(
        `Disconnected from bot API ${++api.disconnectCount} times (this time because: ${reason}, ${msg}), reconnecting again...`,
    )

    setTimeout(() => api.client.connect(), config.api.disconnectRetryInterval)
})
