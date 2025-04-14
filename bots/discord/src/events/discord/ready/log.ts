import { on, withContext } from '$/utils/discord/events'

export default withContext(on, 'ready', async ({ logger }, client) => {
    logger.info(`Connected to Discord API, logged in as ${client.user.displayName} (@${client.user.tag})!`)
    logger.info(`Bot is in ${client.guilds.cache.size} guilds`)
})
