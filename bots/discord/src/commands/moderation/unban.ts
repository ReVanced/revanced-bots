import { ModerationCommand } from '$/classes/Command'
import { createModerationActionEmbed } from '$/utils/discord/embeds'
import { sendModerationReplyAndLogs } from '$/utils/discord/moderation'

export default new ModerationCommand({
    name: 'unban',
    description: 'Unban a user',
    options: {
        user: {
            description: 'The user to unban',
            required: true,
            type: ModerationCommand.OptionType.User,
        },
    },
    async execute({ logger, executor }, interaction, { user }) {
        await interaction.guild!.members.unban(user, `Unbanned by moderator ${executor.user.tag} (${executor.id})`)

        await sendModerationReplyAndLogs(interaction, createModerationActionEmbed('Unbanned', user, executor.user))
        logger.info(`${executor.user.tag} (${executor.id}) unbanned ${user.tag} (${user.id})`)
    },
})
