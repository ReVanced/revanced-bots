import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { createModerationActionEmbed } from '$/utils/discord/embeds'
import { sendModerationReplyAndLogs } from '$/utils/discord/moderation'
import { parseDuration } from '$/utils/duration'

export default new ModerationCommand({
    name: 'ban',
    description: 'Ban a user',
    options: {
        user: {
            description: 'The user to ban',
            required: true,
            type: ModerationCommand.OptionType.User,
        },
        reason: {
            description: 'The reason for banning the user',
            required: false,
            type: ModerationCommand.OptionType.String,
        },
        dmt: {
            description:
                'Time duration to delete messages (default time unit is days, must be from 0s to 7d, default is 0s)',
            required: false,
            type: ModerationCommand.OptionType.String,
        },
    },
    async execute({ logger, executor }, interaction, { user, reason, dmt }) {
        const guild = await interaction.client.guilds.fetch(interaction.guildId)
        const member = await guild.members.fetch(user).catch(() => {})
        const moderator = await guild.members.fetch(executor.user)

        if (member) {
            if (!member.bannable)
                throw new CommandError(CommandErrorType.Generic, 'This user cannot be banned by the bot.')

            if (moderator.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                throw new CommandError(
                    CommandErrorType.InvalidArgument,
                    'You cannot ban a user with a role equal to or higher than yours.',
                )
        }

        const dms = Math.floor((dmt ? parseDuration(dmt, 'd') : 0) / 1000)
        await interaction.guild!.members.ban(user, {
            reason: `Banned by moderator ${executor.user.tag} (${executor.id}): ${reason}`,
            deleteMessageSeconds: dms,
        })

        await sendModerationReplyAndLogs(
            interaction,
            createModerationActionEmbed('Banned', user, executor.user, reason),
        )

        logger.info(
            `${executor.user.tag} (${executor.id}) banned ${user.tag} (${user.id}) because ${reason}, deleting their messages sent in the previous ${dms}s`,
        )
    },
})
