import { GuildMember, type User } from 'discord.js'
import { config } from '../../context'

export const isAdmin = (userOrMember: User | GuildMember) => {
    return (
        config.admin?.users?.includes(userOrMember.id) ||
        (userOrMember instanceof GuildMember && isMemberAdmin(userOrMember))
    )
}

export const isMemberAdmin = (member: GuildMember) => {
    const roles = new Set(member.roles.cache.keys())
    return Boolean(config?.admin?.roles?.[member.guild.id]?.some(role => roles.has(role)))
}
