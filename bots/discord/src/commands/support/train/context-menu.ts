import Command from '$/classes/Command'
import CommandError, { CommandErrorType } from '$/classes/CommandError'
import type { ConfigMessageScanResponseLabelConfig } from 'config.schema'
import { type APIStringSelectComponent, ComponentType, MessageFlags } from 'discord.js'
import { config } from '../../../context'

const msRcConfig = config.messageScan?.humanCorrections?.allow

export default new Command({
    name: 'Train Message',
    type: Command.Type.ContextMenuGuildMessage,
    requirements: {
        users: msRcConfig?.users,
        roles: msRcConfig?.members?.roles,
        permissions: msRcConfig?.members?.permissions,
        mode: 'any',
        memberRequirementsForUsers: 'fail',
        defaultCondition: 'fail',
    },
    async execute(context, trigger) {
        const { logger, config } = context
        const { messageScan: msConfig } = config

        // If there's no config, we can't do anything
        if (!msConfig?.humanCorrections) throw new CommandError(CommandErrorType.Generic, 'Response correction is off.')

        logger.debug(`User ${context.executor.id} is training message ${trigger.targetId}`)

        const labels = msConfig.responses.flatMap(r =>
            r.triggers.text!.filter((t): t is ConfigMessageScanResponseLabelConfig => 'label' in t).map(t => t.label),
        )

        await trigger.reply({
            content: 'Select a label to train this message as:',
            components: [
                {
                    components: [
                        {
                            custom_id: `tr_${trigger.targetMessage.channelId}_${trigger.targetId}`,
                            options: labels.map(label => ({ label, value: label })),
                            type: ComponentType.StringSelect,
                        } satisfies APIStringSelectComponent,
                    ],
                    type: ComponentType.ActionRow,
                },
            ],
            flags: MessageFlags.Ephemeral,
        })
    },
})
