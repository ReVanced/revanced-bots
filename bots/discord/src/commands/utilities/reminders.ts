import { EmbedBuilder, MessageFlags } from 'discord.js'
import { eq, or } from 'drizzle-orm'
import Command from '$/classes/Command'
import { config, database } from '$/context'
import { reminders } from '$/database/schemas'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'

export default new Command({
    name: 'reminders',
    description: 'View reminders',
    type: Command.Type.ChatGuild,
    requirements: {
        roles: config.utilities?.roles,
        mode: 'any',
    },
    options: {
        user: {
            description: 'The user to see reminders of (defaults to yourself)',
            required: false,
            type: Command.OptionType.User,
        },
    },
    async execute(_, interaction, { user }) {
        const targetId = user?.id ?? interaction.user.id
        const userReminders = await database.query.reminders.findMany({
            where: or(eq(reminders.creatorId, targetId), eq(reminders.targetId, targetId)),
        })

        if (userReminders.length === 0) {
            const embed = applyCommonEmbedStyles(
                new EmbedBuilder().setTitle('No Reminders').setDescription('You have no active reminders.'),
                false,
                true,
                true,
            )

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            })
            return
        }

        const reminderList = userReminders
            .map(
                r =>
                    `**${r.id}.** ${r.message.substring(0, 50)}${r.message.length > 50 ? '...' : ''}\n` +
                    [
                        `For ${r.targetId === targetId ? 'yourself' : `<@${r.targetId}>`}`,
                        r.creatorId !== targetId && `Set by <@${r.creatorId}>`,
                        `<t:${r.remindAt}:R>`,
                        `Reminded ${r.count} times`,
                    ]
                        .filter(Boolean)
                        .join(' • '),
            )

            .join('\n\n')

        const embed = applyCommonEmbedStyles(
            new EmbedBuilder().setTitle('Your Reminders').setDescription(reminderList),
            false,
            true,
            true,
        )

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        })
    },
})
