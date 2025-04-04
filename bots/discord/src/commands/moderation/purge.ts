import { EmbedBuilder } from 'discord.js'

import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'

export default new ModerationCommand({
    name: 'purge',
    description: 'Purge messages from a channel',
    options: {
        amount: {
            description: 'The amount of messages to remove',
            required: false,
            type: ModerationCommand.OptionType.Integer,
            min: 1,
            max: 100,
        },
        user: {
            description: 'The user to remove messages from (needs `until`)',
            required: false,
            type: ModerationCommand.OptionType.User,
        },
        until: {
            description: 'The message ID to remove messages until (overrides `amount`)',
            required: false,
            type: ModerationCommand.OptionType.String,
        },
    },
    async execute({ logger, executor }, interaction, { amount, user, until }) {
        if (!amount && !until)
            throw new CommandError(CommandErrorType.MissingArgument, 'Either `amount` or `until` must be provided.')

        const channel = interaction.channel!
        if (!channel.isTextBased())
            throw new CommandError(CommandErrorType.InvalidArgument, 'The supplied channel is not a text channel.')

        const embed = applyCommonEmbedStyles(
            new EmbedBuilder({
                title: 'Purging messages',
                description: 'Accumulating messages...',
            }),
            true,
            true,
            true,
        )

        const msgsPromise = channel.messages.fetch(until ? { after: until } : { limit: amount! })
        const reply = await interaction.reply({ embeds: [embed] }).then(it => it.fetch())

        const messages = (
            user ? (await msgsPromise).filter(msg => msg.author.id === user.id) : await msgsPromise
        ).filter(msg => msg.id !== reply.id)

        await channel.bulkDelete(messages, true)

        logger.info(
            `Moderator ${executor.user.tag} (${executor.id}) purged ${messages.size} messages in #${channel.name} (${channel.id})`,
        )

        await reply.edit({
            embeds: [
                embed.setTitle('Purged messages').setDescription(null).addFields({
                    name: 'Deleted messages',
                    value: messages.size.toString(),
                }),
            ],
        })
    },
})
