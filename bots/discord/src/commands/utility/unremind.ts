import { EmbedBuilder, MessageFlags } from 'discord.js'
import { eq } from 'drizzle-orm'
import Command from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { database } from '$/context'
import { reminders } from '$/database/schemas'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'

export default new Command({
    name: 'unremind',
    description: 'Remove a reminder',
    type: Command.Type.ChatGuild,
    requirements: {
        defaultCondition: 'pass',
    },
    options: {
        id: {
            description: 'The reminder ID to remove',
            required: true,
            type: Command.OptionType.Integer,
            min: 1,
        },
    },
    async execute({ logger }, interaction, { id }) {
        const reminder = await database.query.reminders.findFirst({
            where: eq(reminders.id, id),
        })

        if (!reminder) {
            throw new CommandError(CommandErrorType.InvalidArgument, `Reminder with ID **${id}** was not found.`)
        }

        // Only the creator can remove the reminder
        if (reminder.creatorId !== interaction.user.id) {
            throw new CommandError(
                CommandErrorType.RequirementsNotMet,
                'You can only remove reminders that you created.',
            )
        }

        await database.delete(reminders).where(eq(reminders.id, id))

        const embed = applyCommonEmbedStyles(
            new EmbedBuilder()
                .setTitle('Reminder removed')
                .setDescription(
                    `Removed reminder **#${id}**.\n\n` +
                        `-# Message: ${reminder.message.substring(0, 100)}${reminder.message.length > 100 ? '...' : ''}`,
                ),
            false,
            true,
            true,
        )

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        })

        logger.info(`User ${interaction.user.tag} (${interaction.user.id}) removed reminder #${id}`)
    },
})
