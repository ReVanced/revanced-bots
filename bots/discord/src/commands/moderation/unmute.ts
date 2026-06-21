import { and, eq } from 'drizzle-orm'
import { ModerationCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { appliedPresets } from '$/database/schemas'
import { createModerationActionEmbed } from '$/utils/discord/embeds'
import { sendModerationReplyAndLogs } from '$/utils/discord/moderation'
import { removeRolePreset, removeRolePresetForUser } from '$/utils/discord/rolePresets'

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
        const guildId = interaction.guildId

        if (
            !(await database.query.appliedPresets.findFirst({
                where: and(
                    eq(appliedPresets.memberId, user.id),
                    eq(appliedPresets.preset, 'mute'),
                    eq(appliedPresets.guildId, guildId),
                ),
            }))
        )
            throw new CommandError(CommandErrorType.Generic, 'This user is not muted.')

        const member = await interaction.guild!.members.fetch(user.id).catch(() => null)
        if (member) {
            await removeRolePreset(member, 'mute')
        } else {
            await removeRolePresetForUser(user.id, guildId, 'mute')
        }

        await sendModerationReplyAndLogs(interaction, createModerationActionEmbed('Unmuted', user, executor.user))

        logger.info(`Moderator ${executor.user.tag} (${executor.id}) unmuted ${user.tag} (${user.id})`)
    },
})
