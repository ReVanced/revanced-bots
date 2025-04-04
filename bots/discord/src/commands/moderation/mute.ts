import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { createModerationActionEmbed } from '$/utils/discord/embeds'
import { sendModerationReplyAndLogs } from '$/utils/discord/moderation'
import { applyRolePreset, removeRolePreset } from '$/utils/discord/rolePresets'
import { parseDuration } from '$/utils/duration'

export default new ModerationCommand({
    name: 'mute',
    description: 'Mute a member',
    options: {
        member: {
            description: 'The member to mute',
            required: true,
            type: ModerationCommand.OptionType.User,
        },
        duration: {
            description: 'The duration of the mute (default time unit is minutes)',
            required: false,
            type: ModerationCommand.OptionType.String,
        },
        reason: {
            description: 'The reason for muting the member',
            required: false,
            type: ModerationCommand.OptionType.String,
        },
    },
    async execute(
        { logger, executor },
        interaction,
        { member: user, reason = 'No reason provided', duration: durationInput },
    ) {
        const guild = await interaction.client.guilds.fetch(interaction.guildId)
        const member = await guild.members.fetch(user.id)
        const moderator = await guild.members.fetch(executor.id)
        const duration = durationInput ? parseDuration(durationInput, 'm') : Infinity

        if (Number.isInteger(duration) && duration! < 1)
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'The duration must be at least 1 millisecond long.',
            )

        const expires = Math.max(duration, Date.now() + duration)
        if (!member)
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'The provided member is not in the server or does not exist.',
            )

        if (!member.manageable)
            throw new CommandError(CommandErrorType.Generic, 'This user cannot be managed by the bot.')

        if (moderator.roles.highest.comparePositionTo(member.roles.highest) <= 0)
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'You cannot mute a user with a role equal to or higher than yours.',
            )

        await applyRolePreset(member, 'mute', expires)
        await sendModerationReplyAndLogs(
            interaction,
            createModerationActionEmbed('Muted', user, executor.user, reason, Math.ceil(expires / 1000)),
        )

        if (duration)
            setTimeout(() => {
                removeRolePreset(member, 'mute')
            }, duration)

        logger.info(
            `Moderator ${executor.user.tag} (${executor.user.id}) muted ${user.tag} (${user.id}) until ${expires} because ${reason}`,
        )
    },
})
