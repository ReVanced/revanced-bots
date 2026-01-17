import { and, eq, gt } from 'drizzle-orm'
import { appliedPresets } from '$/database/schemas'
import { on, withContext } from '$/utils/discord/events'
import { applyRolesUsingPreset } from '$/utils/discord/rolePresets'
import { logger } from '$/context'

withContext(on, 'guildMemberAdd', async ({ database }, member) => {
    const applieds = await database.query.appliedPresets.findMany({
        where: and(
            eq(appliedPresets.memberId, member.id),
            eq(appliedPresets.guildId, member.guild.id),
            gt(appliedPresets.until, Date.now() / 1000),
        ),
    })

    if (!applieds.length) return

    logger.info(
        `Re-applying role presets for member ${member.id} in guild ${member.guild.id}:`,
        applieds.map(x => x.preset),
    )

    for (const { preset } of applieds) await applyRolesUsingPreset(preset, member)
})
