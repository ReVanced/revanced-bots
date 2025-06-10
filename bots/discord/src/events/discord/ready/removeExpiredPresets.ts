import { database, logger } from '$/context'
import { appliedPresets } from '$/database/schemas'
import { on, withContext } from '$/utils/discord/events'
import { removeRolePreset } from '$/utils/discord/rolePresets'
import { and, eq, lt } from 'drizzle-orm'

import { type Client, DiscordAPIError } from 'discord.js'

export default withContext(on, 'ready', async ({ config }, client) => {
    if (config.rolePresets) {
        removeExpiredPresets(client)
        setInterval(() => removeExpiredPresets(client), config.rolePresets.checkExpiredEvery)
    }
})

async function removeExpiredPresets(client: Client) {
    logger.debug('Checking for expired role presets...')

    const expireds = await database.query.appliedPresets.findMany({
        where: lt(appliedPresets.until, Math.floor(Date.now() / 1000)),
    })

    for (const expired of expireds) {
        try {
            logger.debug(`Removing role preset for ${expired.memberId} in ${expired.guildId}`)

            const guild = await client.guilds.fetch(expired.guildId)
            const member = await guild.members.fetch(expired.memberId)

            await removeRolePreset(member, expired.preset)
        } catch (e) {
            // Unknown Member: https://discord.com/developers/docs/topics/opcodes-and-status-codes#json
            if (!(e instanceof DiscordAPIError) || e.code !== 10007) {
                logger.error(`Error while removing role preset for ${expired.memberId} in ${expired.guildId}: ${e}`)
                continue
            }
        }

        await database
            .delete(appliedPresets)
            .where(and(eq(appliedPresets.guildId, expired.guildId), eq(appliedPresets.memberId, expired.memberId)))
    }
}
