import type { QueryResult } from 'vectra'
import type { DocumentationMetadata, QAMetadata } from './VectorStore'

export interface RagConfig {
    confidence: {
        high: number
        medium: number
    }
    thresholds: {
        qa: number
        docs: number
    }
}

export interface RagThresholdOptions {
    qa?: number
    docs?: number
}

export interface RagRawData {
    qa: QueryResult<QAMetadata>[]
    docs: QueryResult<DocumentationMetadata>[]
}

export interface RagConfidenceResult {
    hasHighConfidence: boolean
    hasMediumConfidence: boolean
    topScore: number
}

export interface RagFormattedResult extends RagConfidenceResult {
    qa: Array<{ question: string; answer: string; url: string; timestamp: string; score: number }>
    docs: Array<{ text: string; url: string; title: string; score: number }>
}

export class Rag {
    constructor(public readonly config: RagConfig) {}

    process({ qa, docs }: RagRawData, options?: RagThresholdOptions): RagFormattedResult | undefined {
        const filtered = this.filter({ qa, docs }, options)

        const formattedQA = filtered.qa.map(r => ({
            question: r.item.metadata.question,
            answer: r.item.metadata.answer,
            url: r.item.metadata.url,
            timestamp: r.item.metadata.timestamp,
            score: r.score,
        }))

        const formattedDocs = filtered.docs.map(r => ({
            text: r.item.metadata.text,
            url: r.item.metadata.url,
            title: r.item.metadata.title,
            score: r.score,
        }))

        if (formattedQA.length === 0 && formattedDocs.length === 0) return undefined

        const confidence = this.evaluate(filtered)

        return { qa: formattedQA, docs: formattedDocs, ...confidence }
    }

    filter(data: RagRawData, options?: RagThresholdOptions): RagRawData {
        const qaThreshold = options?.qa ?? this.config.thresholds.qa
        const docThreshold = options?.docs ?? this.config.thresholds.docs

        return {
            qa: data.qa.filter(r => r.score >= qaThreshold),
            docs: data.docs.filter(r => r.score >= docThreshold),
        }
    }

    evaluate(data: RagRawData): RagConfidenceResult {
        const topQAScore = data.qa[0]?.score ?? 0
        const topDocScore = data.docs[0]?.score ?? 0
        const topScore = Math.max(topQAScore, topDocScore)

        return {
            topScore,
            hasHighConfidence: topScore >= this.config.confidence.high,
            hasMediumConfidence: topScore >= this.config.confidence.medium,
        }
    }
}
