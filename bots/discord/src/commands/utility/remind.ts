import { EmbedBuilder, MessageFlags } from 'discord.js'
import { eq } from 'drizzle-orm'
import Command from '$/classes/Command'
import { database } from '$/context'
import { reminders } from '$/database/schemas'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'
import { durationToString, parseDuration } from '$/utils/duration'

export default new Command({
    name: 'remind',
    description: 'Set a reminder or list your reminders',
    type: Command.Type.ChatGuild,
    requirements: {
        defaultCondition: 'pass',
    },
    options: {
        message: {
            description: 'The reminder message',
            required: false,
            type: Command.OptionType.String,
            maxLength: 1000,
        },
        interval: {
            description: 'When to remind (e.g., 1d, 2h30m, 1w). Default: 1 day',
            required: false,
            type: Command.OptionType.String,
        },
        user: {
            description: 'The user to remind (defaults to yourself)',
            required: false,
            type: Command.OptionType.User,
        },
    },
    async execute({ logger }, interaction, { message, interval, user }) {
        // If no message is provided, list all reminders
        if (!message) {
            const userReminders = await database.query.reminders.findMany({
                where: eq(reminders.creatorId, interaction.user.id),
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
                .map(r => {
                    const targetStr = r.targetId === r.creatorId ? 'yourself' : `<@${r.targetId}>`
                    return (
                        `**${r.id}.** ${r.message.substring(0, 50)}${r.message.length > 50 ? '...' : ''}\n` +
                        `-# For ${targetStr} • <t:${r.remindAt}:R> • Reminded ${r.count}x`
                    )
                })
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
            return
        }

        // Create a new reminder
        const targetUser = user ?? interaction.user
        const durationMs = parseDuration(interval ?? '1d', 'd')

        if (durationMs <= 0 || !Number.isFinite(durationMs)) {
            const embed = applyCommonEmbedStyles(
                new EmbedBuilder()
                    .setTitle('Invalid duration')
                    .setDescription('Please provide a valid duration (e.g., 1d, 2h30m, 1w).')
                    .setColor('Red'),
                false,
                false,
                false,
            )

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            })
            return
        }

        const now = Math.floor(Date.now() / 1000)
        const remindAt = now + Math.floor(durationMs / 1000)

        const intervalSeconds = Math.floor(durationMs / 1000)
        const [inserted] = await database
            .insert(reminders)
            .values({
                creatorId: interaction.user.id,
                targetId: targetUser.id,
                guildId: interaction.guildId!,
                channelId: interaction.channelId,
                message: message,
                createdAt: now,
                remindAt: remindAt,
                intervalSeconds: intervalSeconds,
                count: 0,
            })
            .returning()

        const reminderId = inserted?.id ?? 'unknown'

        const targetStr = targetUser.id === interaction.user.id ? 'You' : targetUser.toString()

        const embed = applyCommonEmbedStyles(
            new EmbedBuilder()
                .setTitle('Reminder set')
                .setDescription(
                    `${targetStr} will be reminded <t:${remindAt}:R>.\n\n` +
                        `**Message:** ${message}\n` +
                        `-# Reminder ID: ${reminderId}`,
                ),
            false,
            true,
            true,
        )

        await interaction.reply({
            embeds: [embed],
        })

        logger.info(
            `User ${interaction.user.tag} (${interaction.user.id}) set reminder #${reminderId} ` +
                `for ${targetUser.tag} (${targetUser.id}) in ${durationToString(durationMs)}`,
        )
    },
})
