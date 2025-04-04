import { ApplicationCommandOptionType } from 'discord.js'

import { AdminCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'

export default new AdminCommand({
    name: 'exception-test',
    description: 'Makes the bot intentionally hate you by throwing an exception',
    options: {
        type: {
            description: 'The type of exception to throw',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Process', value: 'Process' },
                ...Object.keys(CommandErrorType).map(k => ({ name: k, value: k })),
            ],
        },
    },
    async execute(_, __, { type }) {
        if (type === 'Process') throw new Error('Intentional process exception')
        throw new CommandError(CommandErrorType[type as keyof typeof CommandErrorType], 'Intentional bot design') // ;)
    },
})
