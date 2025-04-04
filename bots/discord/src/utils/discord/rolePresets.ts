import { config, database } from '$/context'
import { appliedPresets } from '$/database/schemas'
import type { GuildMember } from 'discord.js'
import { and, eq } from 'drizzle-orm'

// TODO: Fix this type
type PresetKey = string

export const applyRolePreset = async (member: GuildMember, presetName: PresetKey, expires: number) => {
    const { removed, callback } = await applyRolesUsingPreset(presetName, member)
    const until = expires === Infinity ? null : Math.ceil(expires / 1000)

    await database
        .insert(appliedPresets)
        .values({
            memberId: member.id,
            guildId: member.guild.id,
            preset: presetName,
            removedRoles: removed,
            until,
        })
        .onConflictDoUpdate({
            target: [appliedPresets.memberId, appliedPresets.preset, appliedPresets.guildId],
            set: { until },
        })
        .then(callback)
}

export const removeRolePreset = async (member: GuildMember, presetName: PresetKey) => {
    const where = and(
        eq(appliedPresets.memberId, member.id),
        eq(appliedPresets.preset, presetName),
        eq(appliedPresets.guildId, member.guild.id),
    )

    const data = await database.query.appliedPresets.findFirst({ where })
    if (!data) return false

    const { callback } = await applyRolesUsingPreset(presetName, member, data.removedRoles)
    await database.delete(appliedPresets).where(where).execute().then(callback)

    return true
}

export const applyRolesUsingPreset = async (
    presetName: string,
    member: GuildMember,
    removePresetGiveRoles?: string[],
) => {
    const preset = config.rolePresets?.guilds[member.guild.id]?.[presetName]
    if (!preset) throw new Error(`The preset "${presetName}" does not exist for this server`)

    const roles = new Set(member.roles.cache.keys())
    const removed: string[] = []

    // If removePresetGiveRoles is not provided, we're applying a preset
    if (!removePresetGiveRoles) {
        for (const role of preset.give) roles.add(role)
        for (const role of preset.take) {
            if (roles.has(role)) {
                roles.delete(role)
                removed.push(role)
            }
        }
    } else {
        const guildRoles = await member.guild.roles.fetch()
        for (const role of preset.give) roles.delete(role)
        for (const role of removePresetGiveRoles) if (guildRoles.has(role)) roles.add(role)
    }

    return {
        removed,
        callback: () => member.roles.set(Array.from(roles)),
    }
}
