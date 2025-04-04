import { ModerationCommand } from '$/classes/Command'
import { createSuccessEmbed } from '$/utils/discord/embeds'
import { cureNickname } from '$/utils/discord/moderation'

export default new ModerationCommand({
    name: 'cure',
    description: "Cure a member's nickname",
    options: {
        member: {
            description: 'The member to cure',
            required: true,
            type: ModerationCommand.OptionType.User,
        },
    },
    async execute(_, interaction, { member: user }) {
        const guild = await interaction.client.guilds.fetch(interaction.guildId)
        const member = await guild.members.fetch(user)
        await cureNickname(member)
        await interaction.reply({
            embeds: [createSuccessEmbed(null, `Cured nickname for ${member.toString()}`)],
            ephemeral: true,
        })
    },
})
