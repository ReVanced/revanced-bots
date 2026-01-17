import { ApplicationCommandOptionType, MessageFlags } from 'discord.js'
import { inspect } from 'util'
import { GuildAdminCommand } from '$/classes/Command'
import { createErrorEmbed, createInfoEmbed, createSuccessEmbed } from '$/utils/discord/embeds'

export default new GuildAdminCommand({
    name: 'docs',
    description: 'Documentation management commands',
    allowMessageCommand: false,
    options: {
        add: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Add documentation from text',
            options: {
                text: {
                    description: 'The documentation text',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                url: {
                    description: 'The reference URL',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                title: {
                    description: 'Optional title',
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
            },
        },
        url: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Add documentation from a URL (auto-fetch, parse, chunk)',
            options: {
                link: {
                    description: 'The URL to fetch documentation from',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        remove: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Remove documentation by ID',
            options: {
                id: {
                    description: 'The documentation ID to remove',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        list: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'List all documentation entries',
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
        search: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Search documentation and QA',
            options: {
                query: {
                    description: 'Search query',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                limit: {
                    description: 'Maximum results to return',
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                },
            },
        },
    },
    async execute(context, trigger, options) {
        const { api, config } = context
        const subcommand = Object.keys(options)[0] as keyof typeof options
        const args = options[subcommand] as Record<string, unknown>

        const adminIds = config.admin?.users || []
        const isAdmin = adminIds.includes(trigger.user.id)

        switch (subcommand) {
            case 'add': {
                if (!isAdmin) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Permission Denied', 'Only bot admins can add documentation.')],
                        flags: MessageFlags.Ephemeral,
                    })
                    break
                }
                const { text, url, title } = args as { text: string; url: string; title?: string }
                try {
                    await api.client.addDocumentation(text, url, title)
                    await trigger.reply({
                        embeds: [
                            createSuccessEmbed('Documentation Added', `Successfully added documentation for: ${url}`),
                        ],
                        flags: MessageFlags.Ephemeral,
                    })
                } catch (e) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Failed to Add', `\`\`\`${e}\`\`\``)],
                        flags: MessageFlags.Ephemeral,
                    })
                }
                break
            }

            case 'url': {
                if (!isAdmin) {
                    await trigger.reply({
                        embeds: [
                            createErrorEmbed('Permission Denied', 'Only bot admins can add documentation from a URL.'),
                        ],
                        flags: MessageFlags.Ephemeral,
                    })
                    break
                }
                const { link } = args as { link: string }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.addDocumentationFromUrl(link)

                    if (result.success) {
                        await trigger.editReply({
                            embeds: [
                                createSuccessEmbed(
                                    'Documentation Added from URL',
                                    [
                                        `URL: ${result.url}`,
                                        `Title: ${result.title}`,
                                        `Chunks: ${result.chunksAdded}`,
                                    ].join('\n'),
                                ),
                            ],
                        })
                    } else {
                        await trigger.editReply({
                            embeds: [
                                createErrorEmbed(
                                    'Failed to Add',
                                    [`URL: ${result.url}`, `Error: ${result.error || 'Unknown error'}`].join('\n'),
                                ),
                            ],
                        })
                    }
                } catch (e) {
                    const msg = e instanceof Error ? e.message : inspect(e, { depth: 3 })
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Failed', `\`\`\`${msg.slice(0, 4000)}\`\`\``)],
                    })
                }
                break
            }

            case 'remove': {
                if (!isAdmin) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Permission Denied', 'Only bot admins can remove documentation.')],
                        flags: MessageFlags.Ephemeral,
                    })
                    break
                }
                const { id } = args as { id: string }
                try {
                    await api.client.removeDocumentation(id)
                    await trigger.reply({
                        embeds: [
                            createSuccessEmbed('Documentation Removed', `Removed documentation with ID: \`${id}\``),
                        ],
                        flags: MessageFlags.Ephemeral,
                    })
                } catch (e) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Failed to Remove', `\`\`\`${e}\`\`\``)],
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
                    const docsText =
                        result.docs.length > 0
                            ? result.docs
                                  .map((d, i) => `${i + 1}. \`${d.id}\`\n${d.title || d.text.slice(0, 50)}...`)
                                  .join('\n\n')
                            : 'No documentation entries found.'

                    await trigger.editReply({
                        embeds: [
                            createInfoEmbed(`Documentation (${result.docs.length} entries)`, docsText.slice(0, 4000)),
                        ],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Failed to List', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }

            case 'search': {
                const { query, limit } = args as { query: string; limit?: number }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.searchDocs(query, limit)

                    const docsText =
                        result.docs.length > 0
                            ? result.docs
                                  .slice(0, 5)
                                  .map(
                                      (d, i) =>
                                          `${i + 1}. (${(d.score * 100).toFixed(1)}%) ${d.title || d.text.slice(0, 50)}...`,
                                  )
                                  .join('\n')
                            : 'No matching docs.'

                    const qaText =
                        result.qa.length > 0
                            ? result.qa
                                  .slice(0, 5)
                                  .map(
                                      (q, i) =>
                                          `${i + 1}. (${(q.score * 100).toFixed(1)}%) ${q.question.slice(0, 50)}...`,
                                  )
                                  .join('\n')
                            : 'No matching QA.'

                    await trigger.editReply({
                        embeds: [
                            createInfoEmbed(
                                `Search Results for "${query}"`,
                                `Documentation:\n${docsText}\n\nQ&A:\n${qaText}`,
                            ),
                        ],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Search Failed', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }
        }
    },
})
