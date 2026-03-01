import { type Client, EmbedBuilder } from 'discord.js'
import { eq, lte } from 'drizzle-orm'
import { database, logger } from '$/context'
import { reminders } from '$/database/schemas'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'
import { on, withContext } from '$/utils/discord/events'

const REMINDER_CHECK_INTERVAL = 30_000 // Check every 30 seconds

export default withContext(on, 'ready', async (_, client) => {
    checkReminders(client).catch(e => logger.error('Error during initial reminder check:', e))
    setInterval(
        () => checkReminders(client).catch(e => logger.error('Error in reminder check interval:', e)),
        REMINDER_CHECK_INTERVAL,
    )
})

async function checkReminders(client: Client) {
    logger.debug('Checking for due reminders...')

    const now = Math.floor(Date.now() / 1000)
    const dueReminders = await database.query.reminders.findMany({
        where: lte(reminders.remindAt, now),
    })

    for (const reminder of dueReminders) {
        try {
            logger.debug(`Processing reminder #${reminder.id} for ${reminder.targetId}`)

            const guild = await client.guilds.fetch(reminder.guildId)
            const channel = await guild.channels.fetch(reminder.channelId)

            if (!channel?.isTextBased()) {
                logger.warn(
                    `Channel ${reminder.channelId} for reminder #${reminder.id} is not text-based or doesn't exist`,
                )
                await database.delete(reminders).where(eq(reminders.id, reminder.id))
                continue
            }

            const newCount = reminder.count + 1
            const creatorMention = reminder.creatorId === reminder.targetId ? '' : ` (set by <@${reminder.creatorId}>)`

            const embed = applyCommonEmbedStyles(
                new EmbedBuilder()
                    .setTitle(`Reminder (#${newCount})`)
                    .setDescription(reminder.message)
                    .setFooter({
                        text: `Set on ${new Date(reminder.createdAt * 1000).toLocaleDateString()}`,
                    }),
                false,
                false,
                true,
            )

            await channel.send({
                content: `<@${reminder.targetId}>${creatorMention}`,
                embeds: [embed],
            })

            logger.info(
                `Sent reminder #${reminder.id} (count: ${newCount}) to ${reminder.targetId} in channel ${reminder.channelId}`,
            )

            // Update count and schedule next reminder
            const nextRemindAt = now + reminder.intervalSeconds
            await database
                .update(reminders)
                .set({
                    count: newCount,
                    remindAt: nextRemindAt,
                })
                .where(eq(reminders.id, reminder.id))
        } catch (e) {
            logger.error(`Error while processing reminder #${reminder.id}:`, e)
        }
    }
}
