import { EmbedBuilder, MessageFlags } from 'discord.js'
import { eq } from 'drizzle-orm'
import Command from '$/classes/Command'
import { config, database } from '$/context'
import { reminders } from '$/database/schemas'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'
import { durationToString, parseDuration } from '$/utils/duration'
import CommandError, { CommandErrorType } from '$/classes/CommandError'

const MIN_DURATION = parseDuration('1m')
const MAX_DURATION = parseDuration('1y')

export default new Command({
    name: 'remind',
    description: 'Set a reminder or list your reminders',
    type: Command.Type.ChatGuild,
    requirements: {
        roles: config.utilities?.roles,
    },
    options: {
        message: {
            description: 'The reminder message',
            required: false,
            type: Command.OptionType.String,
            maxLength: 1000,
        },
        interval: {
            description: 'When to remind (e.g., 1d, 2h30m, 1w). Default: 1 day. Min: 1 minute. Max: 1 year.',
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

        if (durationMs < MIN_DURATION || durationMs > MAX_DURATION)
            throw new CommandError(CommandErrorType.InvalidArgument, 'Interval must be between 1 minute and 1 year.')

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

        const reminderId = inserted?.id
        if (!reminderId) throw new CommandError(CommandErrorType.Generic, 'Failed to create reminder.')

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
