import { array, boolean, enum_, nullable, number, object, optional, string } from 'valibot'
import { AnswerValidationLabel, DisconnectReason, SkipReason } from '../constants'
import { Probability } from './shared'

const IntentScoresSchema = object({
    question: Probability,
    problem: Probability,
    complete: Probability,
})

const IntentClassificationResultSchema = object({
    isActionable: boolean(),
    scores: IntentScoresSchema,
})

const ProductRelevanceResultSchema = object({
    score: number(),
    similarity: number(),
    isRelevant: boolean(),
})

const QAResultSchema = object({
    question: string(),
    answer: string(),
    url: string(),
    timestamp: string(),
    score: number(),
})

const DocResultSchema = object({
    text: string(),
    url: string(),
    title: string(),
    score: number(),
})

const ParsedMessageDataSchema = object({
    intent: IntentClassificationResultSchema,
    relevance: ProductRelevanceResultSchema,
    shouldRespond: boolean(),
    ragResults: optional(
        object({
            qa: array(QAResultSchema),
            docs: array(DocResultSchema),
        }),
    ),
    llmResponse: optional(string()),
    skipReason: optional(enum_(SkipReason)),
})

const ClassifiedIntentDataSchema = IntentClassificationResultSchema

const AnswerValidationScoresSchema = object({
    answer: Probability,
    partial: Probability,
    counter: Probability,
    backchannel: Probability,
})

const ValidatedAnswerDataSchema = object({
    predicted: nullable(enum_(AnswerValidationLabel)),
    confidence: Probability,
    scores: AnswerValidationScoresSchema,
    topicRelevance: ProductRelevanceResultSchema,
})

const CheckedRelevanceDataSchema = ProductRelevanceResultSchema

const ParsedImageDataSchema = object({
    text: string(),
})

const QAItemSchema = object({
    id: string(),
    question: string(),
    answer: string(),
    url: string(),
    timestamp: string(),
    score: number(),
})

const DocItemSchema = object({
    id: string(),
    text: string(),
    url: string(),
    title: string(),
    score: number(),
})

const SearchedDocsDataSchema = object({
    qa: array(QAItemSchema),
    docs: array(DocItemSchema),
})

const QAListItemSchema = object({
    id: string(),
    question: string(),
    answer: string(),
    url: string(),
    timestamp: string(),
})

const DocListItemSchema = object({
    id: string(),
    text: string(),
    url: string(),
    title: string(),
})

const ListedDocsDataSchema = object({
    qa: array(QAListItemSchema),
    docs: array(DocListItemSchema),
})

const DisconnectDataSchema = object({
    reason: enum_(DisconnectReason),
})

/**
 * Response schema for adding documentation from a URL.
 * Returns details about the fetch, parse, and chunk operation.
 */
const AddedDocumentationFromUrlDataSchema = object({
    /** Whether the operation was successful */
    success: boolean(),
    /** The source URL that was fetched */
    url: string(),
    /** The extracted or inferred title of the document */
    title: string(),
    /** Number of chunks that were added to the documentation index */
    chunksAdded: number(),
    /** Error message if the operation failed */
    error: optional(string()),
})

export {
    ParsedMessageDataSchema,
    ClassifiedIntentDataSchema,
    ValidatedAnswerDataSchema,
    CheckedRelevanceDataSchema,
    ParsedImageDataSchema,
    SearchedDocsDataSchema,
    ListedDocsDataSchema,
    DisconnectDataSchema,
    ProductRelevanceResultSchema,
    IntentClassificationResultSchema,
    AddedDocumentationFromUrlDataSchema,
}
