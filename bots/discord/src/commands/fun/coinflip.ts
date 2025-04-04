import { EmbedBuilder } from 'discord.js'

import Command from '$/classes/Command'
import { applyCommonEmbedStyles } from '$/utils/discord/embeds'

export default new Command({
    name: 'coinflip',
    description: 'Do a coinflip!',
    type: Command.Type.ChatGlobal,
    requirements: {
        defaultCondition: 'pass',
    },
    allowMessageCommand: true,
    async execute(_, trigger) {
        const result = Math.random() < 0.5 ? ('heads' as const) : ('tails' as const)
        const embed = applyCommonEmbedStyles(new EmbedBuilder().setTitle('Flipping... 🪙'), false, false, true)

        const reply = await trigger
            .reply({
                embeds: [embed.toJSON()],
            })
            .then(it => it.fetch())

        embed.setTitle(`The coin landed on... **${result.toUpperCase()}**! ${EmojiMap[result]}`)

        setTimeout(
            () =>
                reply.edit({
                    embeds: [embed.toJSON()],
                }),
            1500,
        )
    },
})

const EmojiMap: Record<'heads' | 'tails', string> = {
    heads: '🤯',
    tails: '🐈',
}
