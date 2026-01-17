import { ApplicationCommandOptionType, MessageFlags } from 'discord.js'
import { GuildAdminCommand } from '$/classes/Command'
import { createErrorEmbed, createInfoEmbed, createSuccessEmbed } from '$/utils/discord/embeds'

export default new GuildAdminCommand({
    name: 'qa',
    description: 'Q&A management commands',
    allowMessageCommand: false,
    options: {
        add: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Add a new Q&A entry',
            options: {
                question: {
                    description: 'The question',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                answer: {
                    description: 'The answer',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                url: {
                    description: 'Optional reference URL',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                timestamp: {
                    description: 'Optional ISO timestamp (e.g., 2026-01-01T00:00:00Z)',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            },
        },
        remove: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Remove a Q&A entry by ID',
            options: {
                id: {
                    description: 'The Q&A ID to remove',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        list: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'List all Q&A entries',
            options: {
                offset: {
                    description: 'Offset for pagination',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
                size: {
                    description: 'Number of entries to show',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
            },
        },
    },
    async execute(context, trigger, options) {
        const { api } = context
        const subcommand = Object.keys(options)[0] as keyof typeof options
        const args = options[subcommand] as Record<string, unknown>

        switch (subcommand) {
            case 'add': {
                const { question, answer, url, timestamp } = args as {
                    question: string
                    answer: string
                    url?: string
                    timestamp?: string
                }
                try {
                    await api.client.addQA(question, answer, url, timestamp)
                    await trigger.reply({
                        embeds: [
                            createSuccessEmbed(
                                'Q&A Added',
                                [
                                    `Q: ${question.slice(0, 100)}${question.length > 100 ? '...' : ''}`,
                                    `A: ${answer.slice(0, 100)}${answer.length > 100 ? '...' : ''}`,
                                    url ? `URL: ${url}` : '',
                                ]
                                    .filter(Boolean)
                                    .join('\n'),
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    })
                } catch (e) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Failed to Add Q&A', `\`\`\`${e}\`\`\``)],
                        flags: MessageFlags.Ephemeral,
                    })
                }
                break
            }

            case 'remove': {
                const { id } = args as { id: string }
                try {
                    await api.client.removeQA(id)
                    await trigger.reply({
                        embeds: [createSuccessEmbed('Q&A Removed', `Removed Q&A with ID: \`${id}\``)],
                        flags: MessageFlags.Ephemeral,
                    })
                } catch (e) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Failed to Remove Q&A', `\`\`\`${e}\`\`\``)],
                        flags: MessageFlags.Ephemeral,
                    })
                }
                break
            }

            case 'list': {
                const { offset, size } = args as { offset?: number; size?: number }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.listDocs(offset, size)
                    const qaText =
                        result.qa.length > 0
                            ? result.qa
                                  .map(
                                      (q, i) =>
                                          `${i + 1}. \`${q.id}\`\nQ: ${q.question.slice(0, 80)}...\nA: ${q.answer.slice(0, 80)}...`,
                                  )
                                  .join('\n\n')
                            : 'No Q&A entries found.'

                    await trigger.editReply({
                        embeds: [createInfoEmbed(`Q&A Entries (${result.qa.length})`, qaText.slice(0, 4000))],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Failed to List Q&A', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }
        }
    },
})
