import { AdminCommand } from '$/classes/Command'

export default new AdminCommand({
    name: 'stop',
    description: "You don't want to run this unless the bot starts to go insane, and like, you really need to stop it.",
    async execute({ api, logger, executor }, trigger) {
        api.intentionallyDisconnecting = true

        logger.fatal('Stopping bot...')
        trigger.reply({
            content: 'Stopping... (I will go offline once done)',
            ephemeral: true,
        })

        if (!api.client.disconnected) api.client.disconnect()
        logger.warn('Disconnected from API')

        trigger.client.destroy()
        logger.warn('Disconnected from Discord API')

        logger.info(`Bot stopped, requested by ${executor.id}`)
        process.exit(0)
    },
})
