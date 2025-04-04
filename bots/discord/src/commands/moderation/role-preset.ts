import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { sendPresetReplyAndLogs } from '$/utils/discord/moderation'
import { applyRolePreset, removeRolePreset } from '$/utils/discord/rolePresets'
import { parseDuration } from '$/utils/duration'

const SubcommandOptions = {
    member: {
        description: 'The member to manage',
        required: true,
        type: ModerationCommand.OptionType.User,
    },
    preset: {
        description: 'The preset to manage',
        required: true,
        type: ModerationCommand.OptionType.String,
    },
    duration: {
        description: 'The duration to apply the preset for (only for apply action, default time unit is minutes)',
        required: false,
        type: ModerationCommand.OptionType.String,
    },
} as const

export default new ModerationCommand({
    name: 'role-preset',
    description: 'Manage role presets for a member',
    options: {
        apply: {
            description: 'Apply a role preset to a member',
            type: ModerationCommand.OptionType.Subcommand,
            options: SubcommandOptions,
        },
        remove: {
            description: 'Remove a role preset from a member',
            type: ModerationCommand.OptionType.Subcommand,
            options: SubcommandOptions,
        },
    },
    async execute({ logger, executor }, trigger, { apply, remove }) {
        let expires: number | undefined
        const { member: user, duration: durationInput, preset } = (apply ?? remove)!
        const moderator = await trigger.guild!.members.fetch(executor.user.id)
        const member = await trigger.guild!.members.fetch(user.id)

        if (!member)
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'The provided member is not in the server or does not exist.',
            )

        if (!member.manageable)
            throw new CommandError(CommandErrorType.Generic, 'This user cannot be managed by the bot.')

        if (apply) {
            const duration = durationInput ? parseDuration(durationInput, 'm') : Infinity
            if (Number.isInteger(duration) && duration! < 1)
                throw new CommandError(
                    CommandErrorType.InvalidArgument,
                    'The duration must be at least 1 millisecond long.',
                )

            if (moderator.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                throw new CommandError(
                    CommandErrorType.InvalidArgument,
                    'You cannot apply a role preset to a user with a role equal to or higher than yours.',
                )

            expires = Math.max(duration, Date.now() + duration)
            await applyRolePreset(member, preset, expires)
            logger.info(
                `Moderator ${executor.user.tag} (${executor.user.id}) applied role preset ${preset} to ${user.id} until ${expires}`,
            )
        } else if (remove) {
            await removeRolePreset(member, preset)
            logger.info(
                `Moderator ${executor.user.tag} (${executor.user.id}) removed role preset ${preset} from ${user.id}`,
            )
        }

        if (expires)
            setTimeout(() => {
                removeRolePreset(member, preset)
            }, expires)

        await sendPresetReplyAndLogs(
            apply ? 'apply' : 'remove',
            trigger,
            executor,
            user,
            preset,
            expires ? Math.ceil(expires / 1000) : undefined,
        )
    },
})
