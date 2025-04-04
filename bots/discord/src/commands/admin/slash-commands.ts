import { ApplicationCommandOptionType, Routes } from 'discord.js'

import { AdminCommand } from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'

import { createSuccessEmbed } from '$/utils/discord/embeds'

const SubcommandOptions = {
    where: {
        description: 'Where to register the commands',
        type: ApplicationCommandOptionType.String,
        choices: [
            { name: 'globally', value: 'global' },
            { name: 'this server', value: 'server' },
        ],
        required: true,
    },
} as const

export default new AdminCommand({
    name: 'slash-commands',
    description: 'Register or delete slash commands',
    options: {
        register: {
            description: 'Register slash commands',
            type: ApplicationCommandOptionType.Subcommand,
            options: SubcommandOptions,
        },
        delete: {
            description: 'Delete slash commands',
            type: ApplicationCommandOptionType.Subcommand,
            options: SubcommandOptions,
        },
    },
    allowMessageCommand: true,
    async execute(context, trigger, { delete: deleteOption, register }) {
        const action = register ? 'register' : 'delete'
        const { where } = (deleteOption ?? register)!

        if (!trigger.inGuild())
            throw new CommandError(CommandErrorType.Generic, 'This command can only be used in a server.')

        const { global: globalCommands, guild: guildCommands } = Object.groupBy(
            Object.values(context.discord.commands),
            cmd => (cmd.isGuildSpecific() ? 'guild' : 'global'),
        )

        const {
            client,
            client: { rest },
        } = trigger

        let response: string | undefined

        switch (action) {
            case 'register':
                if (where === 'global') {
                    response = 'Registered global slash commands'

                    await rest.put(Routes.applicationCommands(client.application.id), {
                        body: globalCommands?.map(c => c.json),
                    })
                } else {
                    response = 'Registered slash commands on this server'

                    await rest.put(Routes.applicationGuildCommands(client.application.id, trigger.guildId), {
                        body: guildCommands?.map(c => c.json),
                    })
                }

                break

            case 'delete':
                if (where === 'global') {
                    response = 'Deleted global slash commands'

                    await rest.put(Routes.applicationCommands(client.application.id), {
                        body: [],
                    })
                } else {
                    response = 'Deleted slash commands on this server'

                    await rest.put(Routes.applicationGuildCommands(client.application.id, trigger.guildId), {
                        body: [],
                    })
                }

                break
        }

        await trigger.reply({ embeds: [createSuccessEmbed(response!)] })
    },
})
