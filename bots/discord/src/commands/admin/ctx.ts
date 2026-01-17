import { ApplicationCommandOptionType, MessageFlags } from 'discord.js'
import { GuildAdminCommand } from '$/classes/Command'
import { createErrorEmbed, createInfoEmbed, createSuccessEmbed } from '$/utils/discord/embeds'

export default new GuildAdminCommand({
    name: 'ctx',
    description: 'Per-user conversation context management',
    allowMessageCommand: false,
    options: {
        view: {
            type: ApplicationCommandOptionType.Subcommand,
            description: "View a user's conversation context",
            options: {
                user: {
                    description: 'The user whose context to view',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            },
        },
        clear: {
            type: ApplicationCommandOptionType.Subcommand,
            description: "Clear a user's conversation context",
            options: {
                user: {
                    description: 'The user whose context to clear',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            },
        },
        stats: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Show conversation context statistics',
            options: {},
        },
        'clear-all': {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Clear all conversation contexts',
            options: {},
        },
    },
    async execute(context, trigger, options) {
        const { conversationContext, conversationContextConfig, config } = context
        const subcommand = Object.keys(options)[0] as keyof typeof options
        const args = options[subcommand] as Record<string, unknown>
        const adminIds = config.admin?.users || []
        const isAdmin = adminIds.includes(trigger.user.id)

        if (!conversationContextConfig.enabled) {
            await trigger.reply({
                embeds: [createErrorEmbed('Disabled', 'Conversation context tracking is disabled.')],
                flags: MessageFlags.Ephemeral,
            })
            return
        }

        switch (subcommand) {
            case 'view': {
                const { user } = args as { user: { id: string; username: string } }

                const buffer = conversationContext.get(trigger.channelId, user.id)

                if (!buffer) {
                    await trigger.reply({
                        embeds: [createInfoEmbed(`Context: ${user.username}`, 'Buffer is empty')],
                        flags: MessageFlags.Ephemeral,
                    })
                    return
                }

                await trigger.reply({
                    embeds: [
                        createInfoEmbed(`Context: ${user.username}`, `Accumulated Text:\n${buffer.substring(0, 4000)}`),
                    ],
                    flags: MessageFlags.Ephemeral,
                })
                break
            }

            case 'clear': {
                if (!isAdmin) {
                    await trigger.reply({
                        embeds: [
                            createErrorEmbed(
                                'Permission Denied',
                                "Only bot admins can clear another user's conversation context.",
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    })
                    break
                }

                const { user } = args as { user: { id: string; username: string } }
                const count = conversationContext.get(trigger.channelId, user.id)?.split(' ').length || 0
                conversationContext.clear(trigger.channelId, user.id)

                await trigger.reply({
                    embeds: [
                        createSuccessEmbed(
                            'Context Cleared',
                            count > 0
                                ? `Cleared ${count} messages from ${user.username}'s context.`
                                : `${user.username} had no context.`,
                        ),
                    ],
                    flags: MessageFlags.Ephemeral,
                })
                break
            }

            case 'stats': {
                const snapshot = conversationContext.getSnapshot()
                const count = snapshot.length

                let statsText = 'No active conversations.'

                if (count > 0) {
                    const oldest = snapshot.reduce((prev, curr) => (prev.ageMs > curr.ageMs ? prev : curr))
                    const avgLines = (snapshot.reduce((acc, curr) => acc + curr.lineCount, 0) / count).toFixed(1)

                    statsText = [
                        `Active Buffers: ${count}`,
                        `Avg Buffer Size: ${avgLines} lines`,
                        `Oldest Active: ${Math.floor(oldest.ageMs / 1000)}s ago (<@${oldest.userId}>)`,
                    ].join('\n')
                }

                await trigger.reply({
                    embeds: [createInfoEmbed('Buffer Stats', statsText)],
                    flags: MessageFlags.Ephemeral,
                })
                break
            }

            case 'clear-all': {
                if (!isAdmin) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Permission Denied', 'Only bot admins can clear all.')],
                        flags: MessageFlags.Ephemeral,
                    })
                    return
                }

                const count = conversationContext.size
                conversationContext.dispose()

                await trigger.reply({
                    embeds: [createSuccessEmbed('All Contexts Cleared', `Wiped ${count} active buffers.`)],
                    flags: MessageFlags.Ephemeral,
                })
                break
            }
        }
    },
})
