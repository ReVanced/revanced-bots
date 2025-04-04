import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { appliedPresets } from '$/database/schemas'
import { createModerationActionEmbed } from '$/utils/discord/embeds'
import { sendModerationReplyAndLogs } from '$/utils/discord/moderation'
import { removeRolePreset } from '$/utils/discord/rolePresets'
import { and, eq } from 'drizzle-orm'

export default new ModerationCommand({
    name: 'unmute',
    description: 'Unmute a member',
    options: {
        member: {
            description: 'The member to unmute',
            required: true,
            type: ModerationCommand.OptionType.User,
        },
    },
    async execute({ logger, database, executor }, interaction, { member: user }) {
        const member = await interaction.guild!.members.fetch(user.id)
        if (!member)
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'The provided member is not in the server or does not exist.',
            )

        if (
            !(await database.query.appliedPresets.findFirst({
                where: and(eq(appliedPresets.memberId, member.id), eq(appliedPresets.preset, 'mute')),
            }))
        )
            throw new CommandError(CommandErrorType.Generic, 'This user is not muted.')

        await removeRolePreset(member, 'mute')
        await sendModerationReplyAndLogs(interaction, createModerationActionEmbed('Unmuted', user, executor.user))

        logger.info(`Moderator ${executor.user.tag} (${executor.id}) unmuted ${user.tag} (${user.id})`)
    },
})
