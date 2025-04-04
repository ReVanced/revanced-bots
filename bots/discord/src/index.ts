import { api, discord, logger } from '$/context'
import { getMissingEnvironmentVariables } from '@revanced/bot-shared'

import './events/register'

// Check if token exists
const missingEnvs = getMissingEnvironmentVariables(['DISCORD_TOKEN', 'DATABASE_PATH'])
if (missingEnvs.length) {
    for (const env of missingEnvs) logger.fatal(`${env} is not defined in environment variables`)
    process.exit(1)
}

// Handle uncaught exceptions

process.on('uncaughtException', error => console.error('Uncaught exception:', error))
process.on('unhandledRejection', reason => console.error('Unhandled rejection:', reason))

api.client.connect()
discord.client.login()
