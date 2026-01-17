import { object, optional, picklist, pipe, string, url } from 'valibot'
import { PositiveInt } from './shared'

const ParseMessageDataSchema = object({
    text: string(),
})

const ClassifyIntentDataSchema = object({
    text: string(),
})

const ValidateAnswerDataSchema = object({
    questionText: string(),
    answerText: string(),
})

const CheckRelevanceDataSchema = object({
    text: string(),
})

const ParseImageDataSchema = object({
    imageUrl: pipe(string(), url()),
})

const SearchDocsDataSchema = object({
    query: string(),
    limit: optional(PositiveInt),
})

const ListDocsDataSchema = object({
    offset: optional(PositiveInt),
    size: optional(PositiveInt),
})

const AddQADataSchema = object({
    question: string(),
    answer: string(),
    url: optional(string()),
    timestamp: optional(string()),
})

const AddDocumentationDataSchema = object({
    text: string(),
    url: string(),
    title: optional(string()),
})

const AddDocumentationFromUrlDataSchema = object({
    /** The URL to fetch documentation from (will be auto-parsed and chunked) */
    url: pipe(string(), url()),
})

const RemoveQADataSchema = object({
    id: string(),
})

const RemoveDocumentationDataSchema = object({
    id: string(),
})

const TrainRelevanceDataSchema = object({
    text: string(),
    type: picklist(['positive', 'negative']),
})

export {
    ParseMessageDataSchema,
    ClassifyIntentDataSchema,
    ValidateAnswerDataSchema,
    CheckRelevanceDataSchema,
    ParseImageDataSchema,
    SearchDocsDataSchema,
    ListDocsDataSchema,
    AddQADataSchema,
    AddDocumentationDataSchema,
    AddDocumentationFromUrlDataSchema,
    RemoveQADataSchema,
    RemoveDocumentationDataSchema,
    TrainRelevanceDataSchema,
}
