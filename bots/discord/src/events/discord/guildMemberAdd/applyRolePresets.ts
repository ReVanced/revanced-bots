import { appliedPresets } from '$/database/schemas'
import { on, withContext } from '$/utils/discord/events'
import { applyRolesUsingPreset } from '$/utils/discord/rolePresets'
import { and, eq, gt } from 'drizzle-orm'

withContext(on, 'guildMemberAdd', async ({ database }, member) => {
    const applieds = await database.query.appliedPresets.findMany({
        where: and(
            eq(appliedPresets.memberId, member.id),
            eq(appliedPresets.guildId, member.guild.id),
            gt(appliedPresets.until, Date.now() / 1000),
        ),
    })

    for (const { preset } of applieds) await applyRolesUsingPreset(preset, member)
})
