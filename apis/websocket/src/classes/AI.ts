import { SkipReason } from '@revanced/bot-shared'
import { type AnswerValidationResult, AnswerValidator } from './AnswerValidator'
import { DocumentParser } from './DocumentParser'
import { Embedder } from './Embedder'
import { type IntentClassificationResult, IntentClassifier } from './IntentClassifier'
import { LLM } from './LLM'
import { Rag } from './RAG'
import { type ProductRelevanceResult, VectorStore } from './VectorStore'
import type { AnswerValidationLabel, IntentClassificationLabel } from '@revanced/bot-shared'
import type { Config } from '../utils/config'

export interface ParseMessageResult {
    intent: IntentClassificationResult
    relevance: ProductRelevanceResult
    shouldRespond: boolean
    ragResults?:
        | {
              qa: Array<{ question: string; answer: string; url: string; timestamp: string; score: number }>
              docs: Array<{ text: string; url: string; title: string; score: number }>
          }
        | undefined
    llmResponse?: string | undefined
    skipReason?: SkipReason | undefined
}

export interface ValidateAnswerResult extends AnswerValidationResult {
    topicRelevance: ProductRelevanceResult
}

export interface SearchResult {
    qa: Array<{ id: string; question: string; answer: string; url: string; timestamp: string; score: number }>
    docs: Array<{ id: string; text: string; url: string; title: string; score: number }>
}

export interface AddDocumentationFromUrlResult {
    success: boolean
    url: string
    title: string
    chunksAdded: number
    error?: string
}

interface AIRuntimeConfig {
    useLLM: boolean
    llmSystemPrompt: string
}

export class AI {
    private readonly intentClassifier: IntentClassifier
    private readonly answerValidator: AnswerValidator
    private readonly embedder: Embedder
    private readonly vectorStore: VectorStore
    private readonly llm: LLM | null
    private readonly runtimeConfig: AIRuntimeConfig
    private readonly rag: Rag
    private readonly documentParser: DocumentParser

    constructor(config: Config) {
        this.runtimeConfig = {
            llmSystemPrompt: config.ai.llm.systemPrompt,
            useLLM: config.ai.llm.enabled,
        }

        this.embedder = new Embedder({
            modelPath: config.ai.embeddings.modelPath,
            quant: config.ai.embeddings.quant,
        })

        this.vectorStore = new VectorStore(config, this.embedder)

        this.rag = new Rag(config.ai.rag)

        this.intentClassifier = new IntentClassifier({
            modelPath: config.ai.intentClassification.modelPath,
            quant: config.ai.intentClassification.quant,
            thresholds: config.ai.intentClassification.thresholds as Record<IntentClassificationLabel, number>,
        })

        this.answerValidator = new AnswerValidator({
            modelPath: config.ai.answerValidation.modelPath,
            quant: config.ai.answerValidation.quant,
            thresholds: config.ai.answerValidation.thresholds as Record<AnswerValidationLabel, number>,
        })

        this.documentParser = new DocumentParser({
            maxChunkSize: config.ai.documentParser.maxChunkSize,
            chunkOverlap: config.ai.documentParser.chunkOverlap,
            timeout: config.ai.documentParser.timeout,
        })

        const llmApiKey = process.env['LLM_API_KEY']
        if (config.ai.llm?.enabled && llmApiKey) {
            this.llm = new LLM({
                apiKey: llmApiKey,
                baseURL: config.ai.llm.baseURL,
                model: config.ai.llm.model,
                temperature: config.ai.llm.temperature,
                llmSystemPrompt: config.ai.llm.systemPrompt,
            })
            this.runtimeConfig.useLLM = true
        } else {
            this.llm = null
            this.runtimeConfig.useLLM = false
        }
    }

    async load(): Promise<void> {
        await Promise.all([
            this.intentClassifier.load(),
            this.answerValidator.load(),
            this.embedder.load(),
            this.vectorStore.load(),
        ])
    }

    async parseMessage(text: string): Promise<ParseMessageResult> {
        const intent = await this.intentClassifier.classify(text)
        const relevance = await this.checkProductRelevance(text)

        if (!intent.isActionable) {
            // TODO: i dont like these semantics
            return {
                intent,
                relevance,
                shouldRespond: false,
                skipReason: SkipReason.NotActionable,
            }
        }

        if (!relevance.isRelevant) {
            // TODO: i dont like these semantics
            return {
                intent,
                relevance,
                shouldRespond: false,
                skipReason: SkipReason.NotRelevant,
            }
        }

        const rawResults = await this.vectorStore.queryQADocs(text)
        if (!rawResults) {
            // TODO: i dont like these semantics
            return {
                intent,
                relevance,
                shouldRespond: false,
                skipReason: SkipReason.NoRagMatch,
            }
        }

        const ragResults = this.rag.process(rawResults)

        if (!ragResults) {
            // TODO: i dont like these semantics
            return {
                intent,
                relevance,
                shouldRespond: false,
                skipReason: SkipReason.NoRagMatch,
            }
        }

        if (!ragResults.hasMediumConfidence) {
            // TODO: i dont like these semantics
            return {
                intent,
                relevance,
                shouldRespond: false,
                ragResults,
                skipReason: SkipReason.NoRagMatch,
            }
        }

        let llmResponse: string | undefined
        if (this.llm && this.runtimeConfig.useLLM && ragResults.hasHighConfidence === false) {
            // TODO: use llm
        }

        return {
            intent,
            relevance,
            shouldRespond: ragResults.hasHighConfidence || !!llmResponse,
            ragResults,
            llmResponse,
        }
    }

    async classifyIntent(text: string): Promise<IntentClassificationResult> {
        return this.intentClassifier.classify(text)
    }

    async validateAnswer(question: string, answer: string): Promise<ValidateAnswerResult> {
        const [validation, topicRelevance] = await Promise.all([
            this.answerValidator.validate(question, answer),
            this.checkProductRelevance(`${question} ${answer}`),
        ])

        return { ...validation, topicRelevance }
    }

    async searchDocs(query: string, limit = 25): Promise<SearchResult> {
        const results = await this.vectorStore.queryQADocs(query, limit)
        if (!results) {
            return { qa: [], docs: [] }
        }

        // TODO: ids omgggg uhahuguhauh
        const filtered = this.rag.filter(results)

        return {
            qa: filtered.qa.map(r => ({
                id: r.item.id,
                question: r.item.metadata.question,
                answer: r.item.metadata.answer,
                url: r.item.metadata.url,
                timestamp: r.item.metadata.timestamp,
                score: r.score,
            })),
            docs: filtered.docs.map(r => ({
                id: r.item.id, // Now valid
                text: r.item.metadata.text,
                url: r.item.metadata.url,
                title: r.item.metadata.title,
                score: r.score,
            })),
        }
    }

    async listQAItems(offset = 0, size = 100) {
        const items = await this.vectorStore.listQAItems(offset, size)
        return items.map(item => ({
            id: item.id,
            question: item.metadata.question,
            answer: item.metadata.answer,
            url: item.metadata.url,
            timestamp: item.metadata.timestamp,
        }))
    }

    async listDocumentation(offset = 0, size = 100) {
        const items = await this.vectorStore.listDocumentation(offset, size)
        return items.map(item => ({
            id: item.id,
            text: item.metadata.text,
            url: item.metadata.url,
            title: item.metadata.title,
        }))
    }

    async addQAItem(question: string, answer: string, url = '', timestamp = ''): Promise<void> {
        await this.vectorStore.addQAItem(question, answer, url, timestamp)
    }

    async addDocumentation(text: string, url: string, title = ''): Promise<void> {
        await this.vectorStore.addDocumentation(text, url, title)
    }

    async addDocumentationFromUrl(url: string): Promise<AddDocumentationFromUrlResult> {
        try {
            const parsed = await this.documentParser.parseFromUrl(url)

            if (parsed.chunks.length === 0) {
                return {
                    success: false,
                    url,
                    title: parsed.title,
                    chunksAdded: 0,
                    error: 'No content could be extracted from the document',
                }
            }

            for (const chunk of parsed.chunks) {
                const chunkTitle = `${parsed.title} (Part ${chunk.index + 1})`

                await this.vectorStore.addDocumentation(chunk.content, url, chunkTitle)
            }

            return {
                success: true,
                url,
                title: parsed.title,
                chunksAdded: parsed.chunks.length,
            }
        } catch (error) {
            return {
                success: false,
                url,
                title: '',
                chunksAdded: 0,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            }
        }
    }

    async removeQAItem(id: string): Promise<void> {
        await this.vectorStore.removeQAItem(id)
    }

    async removeDocumentation(id: string): Promise<void> {
        await this.vectorStore.removeDocumentation(id)
    }

    async checkProductRelevance(text: string): Promise<ProductRelevanceResult> {
        const results = await this.vectorStore.queryProductRelevance(text)

        if (!results) {
            throw new Error('Failed to retrieve results for product relevance')
        }

        if (results.length === 0) {
            // TODO: this isnt really good semantics
            return { score: 0.5, similarity: 0, isRelevant: false }
        }

        const bestPositive = results.find(r => r.item.metadata.isPositive)
        const bestNegative = results.find(r => !r.item.metadata.isPositive)

        const posScore = bestPositive?.score ?? 0
        const negScore = bestNegative?.score ?? 0

        const diff = posScore - negScore

        // TODO: gotta be tweaked better with constants
        const isRelevant = diff > 0.02
        const similarity = diff > 0 && diff <= 0.02 ? 0 : diff

        const score = isRelevant ? 0.5 + posScore / 2 : 0.5 - negScore / 2

        return { score, similarity, isRelevant }
    }

    async trainPositiveRelevance(text: string): Promise<void> {
        await this.vectorStore.addPositiveRelevance(text)
    }

    async trainNegativeRelevance(text: string): Promise<void> {
        await this.vectorStore.addNegativeRelevance(text)
    }

    getResponseThresholds(): Readonly<{ qa: number; docs: number }> {
        return { ...this.rag.config.thresholds }
    }

    // private buildContext(qa: QueryResult<QAMetadata>[], docs: QueryResult<DocumentationMetadata>[]): string {
    //     // TODO: sooon™
    //     return 'not implemented yet'
    // }
}
