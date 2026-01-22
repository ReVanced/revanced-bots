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
        if (!this.questionAnswerIndex) {
            throw new Error('QA index not loaded')
        }
        if (!this.documentationIndex) {
            throw new Error('Documentation index not loaded')
        }

        const vector = await this.embedder.embed(text)
        const [questionAnswerResults, documentationResults] = await Promise.all([
            this.questionAnswerIndex.queryItems(vector, text, topK),
            this.documentationIndex.queryItems(vector, text, topK),
        ])

        return { qa: questionAnswerResults, docs: documentationResults }
    }

    async addQAItem(question: string, answer: string, url = '', timestamp = ''): Promise<void> {
        if (!this.questionAnswerIndex) {
            throw new Error('QA index not loaded')
        }

        await this.questionAnswerIndex.insertItem({
            vector: await this.embedder.embed(question),
            metadata: { question, answer, url, timestamp },
        })
    }

    async addDocumentation(text: string, url: string, title = ''): Promise<void> {
        if (!this.documentationIndex) {
            throw new Error('Documentation index not loaded')
        }

        await this.documentationIndex.insertItem({
            vector: await this.embedder.embed(text),
            metadata: { text, url, title },
        })
    }

    async addPositiveRelevance(text: string): Promise<void> {
        if (!this.productRelevanceIndex) {
            throw new Error('Product relevance index not loaded')
        }

        await this.productRelevanceIndex.insertItem({
            vector: await this.embedder.embed(text),
            metadata: { text, isPositive: true },
        })
    }

    async addNegativeRelevance(text: string): Promise<void> {
        if (!this.productRelevanceIndex) {
            throw new Error('Product relevance index not loaded')
        }

        await this.productRelevanceIndex.insertItem({
            vector: await this.embedder.embed(text),
            metadata: { text, isPositive: false },
        })
    }

    async listQAItems(offset = 0, size = 100) {
        if (!this.questionAnswerIndex) {
            throw new Error('QA index not loaded')
        }

        const items = this.questionAnswerIndex.listItems() ?? []
        return (await items).slice(offset, offset + size)
    }

    async listDocumentation(offset = 0, size = 100) {
        if (!this.documentationIndex) {
            throw new Error('Documentation index not loaded')
        }

        const items = this.documentationIndex.listItems() ?? []
        return (await items).slice(offset, offset + size)
    }

    async listProductRelevance(offset = 0, size = 100) {
        if (!this.productRelevanceIndex) {
            throw new Error('Product relevance index not loaded')
        }

        const items = this.productRelevanceIndex.listItems() ?? []
        return (await items).slice(offset, offset + size)
    }

    async queryProductRelevance(text: string, topK = 10): Promise<QueryResult<ProductRelevanceMetadata>[] | undefined> {
        if (!this.productRelevanceIndex) {
            throw new Error('Product relevance index not loaded')
        }

        return await this.productRelevanceIndex.queryItems(await this.embedder.embed(text), text, topK)
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
}
