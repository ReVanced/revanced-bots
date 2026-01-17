import { LocalIndex, type MetadataTypes, type QueryResult } from 'vectra'
import type { Config } from '../utils/config'
import type { Embedder } from './Embedder'

export interface QAMetadata extends Record<string, MetadataTypes> {
    question: string
    answer: string
    url: string
    timestamp: string
}

export interface DocumentationMetadata extends Record<string, MetadataTypes> {
    text: string
    url: string
    title: string
}

export interface ProductRelevanceMetadata extends Record<string, MetadataTypes> {
    text: string
    isPositive: boolean
}

export interface ProductRelevanceResult {
    score: number
    similarity: number
    isRelevant: boolean
}

export class VectorStore {
    private questionAnswerIndex: LocalIndex<QAMetadata> | null = null
    private productRelevanceIndex: LocalIndex<ProductRelevanceMetadata> | null = null
    private documentationIndex: LocalIndex<DocumentationMetadata> | null = null

    constructor(
        private readonly config: Config,
        private readonly embedder: Embedder,
    ) {}

    async load(): Promise<void> {
        this.questionAnswerIndex = new LocalIndex<QAMetadata>(this.config.ai.indexes.qa)
        this.productRelevanceIndex = new LocalIndex<ProductRelevanceMetadata>(this.config.ai.indexes.productRelevance)
        this.documentationIndex = new LocalIndex<DocumentationMetadata>(this.config.ai.indexes.documentation)

        // its okay if you don't have them yet, we're not strict about it
        // i dont think i would even warn you about it
        if (!(await this.questionAnswerIndex.isIndexCreated())) {
            await this.questionAnswerIndex.createIndex()
        }
        if (!(await this.productRelevanceIndex.isIndexCreated())) {
            await this.productRelevanceIndex.createIndex()
        }
        if (!(await this.documentationIndex.isIndexCreated())) {
            await this.documentationIndex.createIndex()
        }
    }

    async queryQADocs(
        text: string,
        topK = 25,
    ): Promise<{ qa: QueryResult<QAMetadata>[]; docs: QueryResult<DocumentationMetadata>[] } | undefined> {
        if (!this.questionAnswerIndex || !this.documentationIndex) return

        const vector = await this.embedder.embed(text)
        const [questionAnswerResults, documentationResults] = await Promise.all([
            this.questionAnswerIndex.queryItems(vector, text, topK),
            this.documentationIndex.queryItems(vector, text, topK),
        ])

        return { qa: questionAnswerResults, docs: documentationResults }
    }

    async addQAItem(question: string, answer: string, url = '', timestamp = ''): Promise<void> {
        if (!this.questionAnswerIndex) return

        await this.questionAnswerIndex.insertItem({
            vector: await this.embedder.embed(question),
            metadata: { question, answer, url, timestamp },
        })
    }

    async addDocumentation(text: string, url: string, title = ''): Promise<void> {
        if (!this.documentationIndex) return

        await this.documentationIndex.insertItem({
            vector: await this.embedder.embed(text),
            metadata: { text, url, title },
        })
    }

    async addPositiveRelevance(text: string): Promise<void> {
        if (!this.productRelevanceIndex) return

        await this.productRelevanceIndex.insertItem({
            vector: await this.embedder.embed(text),
            metadata: { text, isPositive: true },
        })
    }

    async addNegativeRelevance(text: string): Promise<void> {
        if (!this.productRelevanceIndex) return

        await this.productRelevanceIndex.insertItem({
            vector: await this.embedder.embed(text),
            metadata: { text, isPositive: false },
        })
    }

    async listQAItems(offset = 0, size = 100) {
        const items = this.questionAnswerIndex?.listItems() ?? []
        return (await items).slice(offset, offset + size)
    }

    async listDocumentation(offset = 0, size = 100) {
        const items = this.documentationIndex?.listItems() ?? []
        return (await items).slice(offset, offset + size)
    }

    async listProductRelevance(offset = 0, size = 100) {
        const items = this.productRelevanceIndex?.listItems() ?? []
        return (await items).slice(offset, offset + size)
    }

    async removeQAItem(id: string): Promise<void> {
        await this.questionAnswerIndex?.deleteItem(id)
    }

    async removeDocumentation(id: string): Promise<void> {
        await this.documentationIndex?.deleteItem(id)
    }

    async removeProductRelevance(id: string): Promise<void> {
        await this.productRelevanceIndex?.deleteItem(id)
    }

    // TODO: i think i need this GONE out of here to AI.ts
    // ts is high level
    async checkProductRelevance(text: string, topK = 10): Promise<ProductRelevanceResult> {
        if (!this.productRelevanceIndex) {
            // TODO: this isnt really good semantics
            return { score: 0, similarity: 0, isRelevant: false }
        }

        const vector = await this.embedder.embed(text)
        const results = await this.productRelevanceIndex.queryItems(vector, text, topK)

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
}
