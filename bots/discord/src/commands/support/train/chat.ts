import { type FetchMessageOptions, MessageFlags, type MessageResolvable } from 'discord.js'
import Command from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import { createSuccessEmbed } from '$/utils/discord/embeds'
import { config } from '../../../context'
import type { ConfigMessageScanResponseLabelConfig } from 'config.schema'

const msRcConfig = config.messageScan?.humanCorrections?.allow

export default new Command({
    name: 'train',
    description: 'Train a specific message to a specific label',
    type: Command.Type.ChatGuild,
    requirements: {
        users: msRcConfig?.users,
        roles: msRcConfig?.members?.roles,
        permissions: msRcConfig?.members?.permissions,
        mode: 'any',
        memberRequirementsForUsers: 'fail',
        defaultCondition: 'fail',
    },
    options: {
        message: {
            description: 'The message to train (use `latest` to train the latest message)',
            type: Command.OptionType.String,
            required: true,
        },
        label: {
            description: 'The label to train the message as (leave empty for out of scope)',
            type: Command.OptionType.String,
            required: false,
        },
    },
    allowMessageCommand: true,
    async execute(context, trigger, { label, message: ref }) {
        const { logger, config } = context
        const { messageScan: msConfig } = config

        // If there's no config, we can't do anything
        if (!msConfig?.humanCorrections) throw new CommandError(CommandErrorType.Generic, 'Response correction is off.')
        const labels = msConfig.responses?.flatMap(r =>
            r.triggers.text!.filter((t): t is ConfigMessageScanResponseLabelConfig => 'label' in t).map(t => t.label),
        )

        const channel = await trigger.guild!.channels.fetch(trigger.channelId)
        if (!channel?.isTextBased())
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                'This command can only be used in or on text channels',
            )

        if (label && !labels.includes(label))
            throw new CommandError(
                CommandErrorType.InvalidArgument,
                `The provided label is invalid.\nValid labels are:${labels.map(l => `\n- \`${l}\``).join('')}`,
            )

        const refMsg = await channel.messages.fetch(
            (ref.startsWith('latest') ? { limit: 1 } : ref) as MessageResolvable | FetchMessageOptions,
        )
        if (!refMsg) throw new CommandError(CommandErrorType.InvalidArgument, 'The provided message does not exist.')

        logger.debug(`User ${context.executor.id} is training message ${refMsg?.id} as ${label ?? 'out of scope'}`)

        await context.api.client.trainMessage(refMsg.content, label)
        await trigger.reply({
            embeds: [
                createSuccessEmbed(
                    'Message trained',
                    `The provided message has been trained as ${label ? `\`${label}\`` : 'out of scope'}. Thank you for your contribution!`,
                ),
            ],
            flags: MessageFlags.Ephemeral,
        })
    },
})
