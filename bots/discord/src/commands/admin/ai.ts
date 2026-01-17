import { ApplicationCommandOptionType, MessageFlags } from 'discord.js'
import { GuildAdminCommand } from '$/classes/Command'
import { createErrorEmbed, createInfoEmbed, createSuccessEmbed } from '$/utils/discord/embeds'

export default new GuildAdminCommand({
    name: 'ai',
    description: 'AI analysis and training commands',
    allowMessageCommand: false,
    options: {
        parse: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Parse a message through the full AI pipeline',
            options: {
                text: {
                    description: 'The text to parse',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        intent: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Classify the intent of a message',
            options: {
                text: {
                    description: 'The text to classify',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        relevance: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Check product relevance of text',
            options: {
                text: {
                    description: 'The text to check',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        validate: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Validate if an answer addresses a question',
            options: {
                question: {
                    description: 'The question',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                answer: {
                    description: 'The answer to validate',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        ocr: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Extract text from an image (OCR)',
            options: {
                url: {
                    description: 'The image URL',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            },
        },
        train: {
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Train product relevance',
            options: {
                text: {
                    description: 'The text to train on',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                type: {
                    description: 'Training type',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'positive', value: 'positive' },
                        { name: 'negative', value: 'negative' },
                    ],
                },
            },
        },
    },
    async execute(context, trigger, options) {
        const { api, config } = context
        const subcommand = Object.keys(options)[0] as keyof typeof options
        const args = options[subcommand] as Record<string, unknown>
        const adminIds = config?.admin?.users || []
        const isAdmin = adminIds.includes(trigger.user.id)

        switch (subcommand) {
            case 'parse': {
                const { text } = args as { text: string }
                console.log(text)
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.parseMessage(text)

                    const lines = [
                        `Should Respond: ${result.shouldRespond ? 'Yes' : 'No'}`,
                        `Skip Reason: ${result.skipReason ?? 'None'}`,
                        '',
                        `Question certainty: ${(result.intent.scores.question * 100).toFixed(1)}%`,
                        `Problem certainty: ${(result.intent.scores.problem * 100).toFixed(1)}%`,
                        '',
                        `Context completeness certainty: ${(result.intent.scores.complete * 100).toFixed(1)}%`,
                        '',
                        `Is Relevant: ${result.relevance.isRelevant ? 'Yes' : 'No'}`,
                        `Relevance score: ${(result.relevance.score * 100).toFixed(1)}%`,
                    ]

                    if (result.ragResults) {
                        lines.push('', `Top QA Matches: ${result.ragResults.qa.length}`)
                        if (result.ragResults.qa[0]) {
                            lines.push(
                                `Best: ${(result.ragResults.qa[0].score * 100).toFixed(1)}% - ${result.ragResults.qa[0].question.slice(0, 50)}...`,
                            )
                        }
                        lines.push(`Top Doc Matches: ${result.ragResults.docs.length}`)
                        if (result.ragResults.docs[0]) {
                            lines.push(
                                `Best: ${(result.ragResults.docs[0].score * 100).toFixed(1)}% - ${result.ragResults.docs[0].title || result.ragResults.docs[0].text.slice(0, 50)}...`,
                            )
                        }
                    }

                    if (result.llmResponse) {
                        lines.push('', 'LLM Response:', result.llmResponse.slice(0, 500))
                    }

                    await trigger.editReply({
                        embeds: [createInfoEmbed('Parse Result', lines.join('\n').slice(0, 4000))],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Parse Failed', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }

            case 'intent': {
                const { text } = args as { text: string }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.classifyIntent(text)

                    await trigger.editReply({
                        embeds: [
                            createInfoEmbed(
                                'Intent Classification',
                                [
                                    `Is Actionable: ${result.isActionable ? 'Yes' : 'No'}`,
                                    '',
                                    `Question: ${(result.scores.question * 100).toFixed(1)}%`,
                                    `Problem: ${(result.scores.problem * 100).toFixed(1)}%`,
                                    `Complete: ${(result.scores.complete * 100).toFixed(1)}%`,
                                ].join('\n'),
                            ),
                        ],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Intent Classification Failed', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }

            case 'relevance': {
                const { text } = args as { text: string }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.checkRelevance(text)

                    await trigger.editReply({
                        embeds: [
                            createInfoEmbed(
                                'Product Relevance',
                                [
                                    `Is Relevant: ${result.isRelevant ? 'Yes' : 'No'}`,
                                    `Certainty: ${(result.score * 100).toFixed(1)}%`,
                                    `Similarity: ${result.similarity.toFixed(4)}`,
                                ].join('\n'),
                            ),
                        ],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Relevance Check Failed', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }

            case 'validate': {
                const { question, answer } = args as { question: string; answer: string }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.validateAnswer(question, answer)

                    await trigger.editReply({
                        embeds: [
                            createInfoEmbed(
                                'Answer Validation',
                                [
                                    `Predicted: ${result.predicted ?? 'Unknown'}`,
                                    `Confidence: ${(result.confidence * 100).toFixed(1)}%`,
                                    '',
                                    'Scores:',
                                    `Answer: ${(result.scores.answer * 100).toFixed(1)}%`,
                                    `Partial: ${(result.scores.partial * 100).toFixed(1)}%`,
                                    `Counter: ${(result.scores.counter * 100).toFixed(1)}%`,
                                    `Backchannel: ${(result.scores.backchannel * 100).toFixed(1)}%`,
                                    '',
                                    'Topic Relevance:',
                                    `Score: ${(result.topicRelevance.score * 100).toFixed(1)}%`,
                                    `Is Relevant: ${result.topicRelevance.isRelevant ? 'Yes' : 'No'}`,
                                ].join('\n'),
                            ),
                        ],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('Validation Failed', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }

            case 'ocr': {
                const { url } = args as { url: string }
                await trigger.deferReply({ flags: MessageFlags.Ephemeral })

                try {
                    const result = await api.client.parseImage(url)

                    await trigger.editReply({
                        embeds: [
                            createInfoEmbed(
                                'OCR Result',
                                result.text.length > 0
                                    ? `\`\`\`\n${result.text.slice(0, 3900)}\n\`\`\``
                                    : 'No text detected in image.',
                            ),
                        ],
                    })
                } catch (e) {
                    await trigger.editReply({
                        embeds: [createErrorEmbed('OCR Failed', `\`\`\`${e}\`\`\``)],
                    })
                }
                break
            }

            case 'train': {
                if (!isAdmin) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Permission Denied', 'Only bot admins can train product relevance.')],
                        flags: MessageFlags.Ephemeral,
                    })
                    break
                }
                const { text, type } = args as { text: string; type: 'positive' | 'negative' }
                try {
                    await api.client.trainRelevance(text, type)
                    await trigger.reply({
                        embeds: [
                            createSuccessEmbed(
                                'Product Relevance Training Complete',
                                `Trained as **${type}** relevance:\n${text.slice(0, 200)}${text.length > 200 ? '...' : ''}`,
                            ),
                        ],
                        flags: MessageFlags.Ephemeral,
                    })
                } catch (e) {
                    await trigger.reply({
                        embeds: [createErrorEmbed('Training Failed', `\`\`\`${e}\`\`\``)],
                        flags: MessageFlags.Ephemeral,
                    })
                }
                break
            }
        }
    },
})
