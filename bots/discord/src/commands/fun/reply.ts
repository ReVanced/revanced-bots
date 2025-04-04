import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { ApplicationCommandOptionType, Message } from 'discord.js'
import { ModerationCommand } from '../../classes/Command'

export default new ModerationCommand({
    name: 'reply',
    description: 'Send a message as the bot',
    options: {
        message: {
            description: 'The message to send',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        reference: {
            description: 'The message ID to reply to (use `latest` to reply to the latest message)',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    },
    allowMessageCommand: false,
    async execute({ logger, executor }, trigger, { reference: ref, message: msg }) {
        if (trigger instanceof Message) return

        const channel = await trigger.guild!.channels.fetch(trigger.channelId)
        if (!channel?.isTextBased())
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'This command can only be used in or on text channels',
            )
        const refMsg = ref?.startsWith('latest')
            ? await channel.messages.fetch({ limit: 1 }).then(it => it.first())
            : ref

        await channel.send({
            content: msg,
            reply: refMsg ? { messageReference: refMsg, failIfNotExists: true } : undefined,
        })

        logger.info(`User ${executor.user.tag} made the bot say: ${msg}`)

        await trigger.reply({
            content: 'OK!',
            ephemeral: true,
        })
    },
})
