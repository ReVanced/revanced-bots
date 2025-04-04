import { on, withContext } from '$utils/api/events'

withContext(on, 'ready', ({ api, logger }) => {
    // Reset disconnect count, so it doesn't meet the threshold for an accidental disconnect
    api.disconnectCount = 0
    logger.info('Connected to the bot API')
})
