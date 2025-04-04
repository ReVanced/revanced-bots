import { createSuccessEmbed } from '$/utils/discord/embeds'
import { durationToString, parseDuration } from '$/utils/duration'

import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { ChannelType } from 'discord.js'

export default new ModerationCommand({
    name: 'slowmode',
    description: 'Set a slowmode for a channel',
    options: {
        duration: {
            description: 'The duration to set (default time unit is seconds)',
            required: true,
            type: ModerationCommand.OptionType.String,
        },
        channel: {
            description: 'The channel to set the slowmode on (defaults to current channel)',
            required: false,
            type: ModerationCommand.OptionType.Channel,
            types: [ChannelType.GuildText],
        },
    },
    async execute({ logger, executor }, interaction, { duration: durationInput, channel: channelInput }) {
        const channel = channelInput ?? (await interaction.guild!.channels.fetch(interaction.channelId))
        const duration = parseDuration(durationInput, 's')

        if (!channel?.isTextBased() || channel.isDMBased())
            throw new CommandError(CommandErrorType.InvalidArgument, 'The supplied channel is not a text channel.')

        if (Number.isNaN(duration)) throw new CommandError(CommandErrorType.InvalidArgument, 'Invalid duration.')
        if (duration < 0 || duration > 36e4)
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'Duration out of range, must be between 0s and 6h.',
            )

        await channel.setRateLimitPerUser(duration / 1000, `Set by ${executor.user.tag} (${executor.id})`)
        await interaction.reply({
            embeds: [
                createSuccessEmbed(
                    `Slowmode ${duration ? `set to ${durationToString(duration)}` : 'removed'} on ${channel.toString()}`,
                ),
            ],
        })

        logger.info(
            `${executor.user.tag} (${executor.id}) set the slowmode on ${channel.name} (${channel.id}) to ${duration}ms`,
        )
    },
})
