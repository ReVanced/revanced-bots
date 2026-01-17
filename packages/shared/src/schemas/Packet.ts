import {
    boolean,
    custom,
    type InferOutput,
    null_,
    parse,
    // merge
} from 'valibot'
import { ClientOperation, Operation, ServerOperation } from '../constants'
import {
    AddDocumentationDataSchema,
    AddDocumentationFromUrlDataSchema,
    AddQADataSchema,
    CheckRelevanceDataSchema,
    ClassifyIntentDataSchema,
    ListDocsDataSchema,
    ParseImageDataSchema,
    ParseMessageDataSchema,
    RemoveDocumentationDataSchema,
    RemoveQADataSchema,
    SearchDocsDataSchema,
    TrainRelevanceDataSchema,
    ValidateAnswerDataSchema,
} from './client'
import {
    AddedDocumentationFromUrlDataSchema,
    CheckedRelevanceDataSchema,
    ClassifiedIntentDataSchema,
    DisconnectDataSchema,
    ListedDocsDataSchema,
    ParsedImageDataSchema,
    ParsedMessageDataSchema,
    SearchedDocsDataSchema,
    ValidatedAnswerDataSchema,
} from './server'

/**
 * Schema to validate packets
 */
export const PacketSchema = custom<Packet>(input => {
    if (
        typeof input === 'object' &&
        input &&
        'op' in input &&
        typeof input.op === 'number' &&
        input.op in Operation &&
        'd' in input
    ) {
        if (input.op in ServerOperation && !('s' in input && typeof input.s === 'number')) return false

        try {
            parse(PacketDataSchemas[input.op as Operation], input.d)
            return true
        } catch {
            return false
        }
    }
    return false
}, 'Invalid packet data')

/**
 * Schema to validate packet data for each possible operations
 */
export const PacketDataSchemas = {
    /** Server operations */
    [ServerOperation.Hello]: null_(),
    [ServerOperation.ParsedMessage]: ParsedMessageDataSchema,
    [ServerOperation.ParseMessageFailed]: null_(),
    [ServerOperation.ClassifiedIntent]: ClassifiedIntentDataSchema,
    [ServerOperation.ClassifyIntentFailed]: null_(),
    [ServerOperation.ValidatedAnswer]: ValidatedAnswerDataSchema,
    [ServerOperation.ValidateAnswerFailed]: null_(),
    [ServerOperation.CheckedRelevance]: CheckedRelevanceDataSchema,
    [ServerOperation.CheckRelevanceFailed]: null_(),
    [ServerOperation.ParsedImage]: ParsedImageDataSchema,
    [ServerOperation.ParseImageFailed]: null_(),
    [ServerOperation.SearchedDocs]: SearchedDocsDataSchema,
    [ServerOperation.SearchDocsFailed]: null_(),
    [ServerOperation.ListedDocs]: ListedDocsDataSchema,
    [ServerOperation.ListDocsFailed]: null_(),
    [ServerOperation.AddedQA]: boolean(),
    [ServerOperation.AddQAFailed]: null_(),
    [ServerOperation.AddedDocumentation]: boolean(),
    [ServerOperation.AddDocumentationFailed]: null_(),
    [ServerOperation.AddedDocumentationFromUrl]: AddedDocumentationFromUrlDataSchema,
    [ServerOperation.AddDocumentationFromUrlFailed]: null_(),
    [ServerOperation.RemovedQA]: boolean(),
    [ServerOperation.RemoveQAFailed]: null_(),
    [ServerOperation.RemovedDocumentation]: boolean(),
    [ServerOperation.RemoveDocumentationFailed]: null_(),
    [ServerOperation.TrainedRelevance]: boolean(),
    [ServerOperation.TrainRelevanceFailed]: null_(),
    [ServerOperation.Disconnect]: DisconnectDataSchema,

    /** Client operations */
    [ClientOperation.ParseMessage]: ParseMessageDataSchema,
    [ClientOperation.ClassifyIntent]: ClassifyIntentDataSchema,
    [ClientOperation.ValidateAnswer]: ValidateAnswerDataSchema,
    [ClientOperation.CheckRelevance]: CheckRelevanceDataSchema,
    [ClientOperation.ParseImage]: ParseImageDataSchema,
    [ClientOperation.SearchDocs]: SearchDocsDataSchema,
    [ClientOperation.ListDocs]: ListDocsDataSchema,
    [ClientOperation.AddQA]: AddQADataSchema,
    [ClientOperation.AddDocumentation]: AddDocumentationDataSchema,
    [ClientOperation.AddDocumentationFromUrl]: AddDocumentationFromUrlDataSchema,
    [ClientOperation.RemoveQA]: RemoveQADataSchema,
    [ClientOperation.RemoveDocumentation]: RemoveDocumentationDataSchema,
    [ClientOperation.TrainRelevance]: TrainRelevanceDataSchema,
} as const

export type Packet<TOp extends Operation = Operation> = TOp extends ServerOperation
    ? PacketWithSequenceNumber<TOp>
    : Omit<PacketWithSequenceNumber<TOp>, 's'>

type PacketWithSequenceNumber<TOp extends Operation> = {
    op: TOp
    d: InferOutput<(typeof PacketDataSchemas)[TOp]>
    s: number
}
