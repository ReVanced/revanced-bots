import type { AnswerValidationLabel, IntentClassificationLabel } from '@revanced/bot-shared'
import type { RagConfig } from './classes/RAG'

export type { RagConfig }

export interface AIConfig {
    embeddings: EmbeddingsConfig
    intentClassification: IntentClassificationConfig
    answerValidation: AnswerValidationConfig
    llm: LLMConfig
    rag: RagConfig
    documentParser: DocumentParserConfig
    indexes: IndexesConfig
}

export interface EmbeddingsConfig {
    modelPath: string
    quant: string
}

export interface IntentClassificationConfig {
    modelPath: string
    quant: string
    thresholds: Record<IntentClassificationLabel, number>
}

export interface AnswerValidationConfig {
    modelPath: string
    quant: string
    thresholds: Record<AnswerValidationLabel, number>
}

export interface LLMConfig {
    enabled: boolean
    baseURL: string
    model: string
    temperature: number
    systemPrompt: string
}

export interface DocumentParserConfig {
    maxChunkSize: number
    chunkOverlap: number
    timeout: number
}

export interface IndexesConfig {
    qa: string
    documentation: string
    productRelevance: string
}
