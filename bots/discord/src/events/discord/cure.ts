import { on } from '$/utils/discord/events'
import { cureNickname } from '$/utils/discord/moderation'

on('guildMemberUpdate', (_, newMember) => {
    if (newMember.user.bot) return
    cureNickname(newMember)
})

on('guildMemberAdd', member => {
    if (member.user.bot) return
    cureNickname(member)
})

on('messageCreate', msg => {
    if (msg.author.bot || !msg.member) return
    cureNickname(msg.member)
})
