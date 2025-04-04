import { unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { inspect } from 'util'
import { createContext, runInContext } from 'vm'
import { ApplicationCommandOptionType } from 'discord.js'

import { AdminCommand } from '$/classes/Command'
import { createSuccessEmbed } from '$/utils/discord/embeds'
import { parseDuration } from '$/utils/duration'

export default new AdminCommand({
    name: 'eval',
    description: 'Make the bot less sentient by evaluating code',
    options: {
        code: {
            description: 'The code to evaluate',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        ['show-hidden']: {
            description: 'Show hidden properties',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
        ['inspect-depth']: {
            description: 'How many times to recurse while formatting the object (default: 1)',
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        timeout: {
            description: 'Timeout for the evaluation (default: 10s)',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    },
    async execute(context, trigger, { code, 'show-hidden': showHidden, timeout, ['inspect-depth']: inspectDepth }) {
        const currentToken = context.discord.client.token
        const currentEnvToken = process.env['DISCORD_TOKEN']
        context.discord.client.token = null
        process.env['DISCORD_TOKEN'] = undefined

        // This allows developers to access and modify the context object to apply changes
        // to the bot while the bot is running, minus malicious actors getting the token to perform malicious actions
        const output = await runInContext(
            code,
            createContext({
                ...globalThis,
                context,
                trigger,
            }),
            {
                timeout: parseDuration(timeout ?? '10s'),
                filename: 'eval',
                displayErrors: true,
            },
        )

        context.discord.client.token = currentToken
        process.env['DISCORD_TOKEN'] = currentEnvToken

        const inspectedOutput = inspect(output, {
            depth: inspectDepth ?? 1,
            showHidden,
            getters: showHidden,
            numericSeparator: true,
            showProxy: showHidden,
        })

        const embed = createSuccessEmbed('Evaluate', `\`\`\`js\n${code}\`\`\``)
        const files: string[] = []
        const filepath = join(Bun.main, '..', `output-eval-${Date.now()}.js`)

        if (inspectedOutput.length > 1000) {
            writeFileSync(filepath, inspectedOutput)
            files.push(filepath)

            embed.addFields({
                name: 'Result',
                value: '```js\n// (output too long, file uploaded)```',
            })
        } else
            embed.addFields({
                name: 'Result',
                value: `\`\`\`js\n${inspectedOutput}\`\`\``,
            })

        await trigger.reply({
            ephemeral: true,
            embeds: [embed],
            files,
        })

        if (files.length) unlinkSync(filepath)
    },
})
