/**
 * Operation codes for the gateway
 *
 * ClientOperation: codes >= 100
 * ServerOperation: codes < 100
 */

export enum ClientOperation {
    /** Client's request to parse/process a message (main entry point) */
    ParseMessage = 100,
    /** Client's request to classify intent from text */
    ClassifyIntent = 101,
    /** Client's request to validate an answer */
    ValidateAnswer = 102,
    /** Client's request to check product relevance */
    CheckRelevance = 103,
    /** Client's request to parse an image */
    ParseImage = 104,

    /** Client's request to search documentation and QA */
    SearchDocs = 200,
    /** Client's request to list documents and QA */
    ListDocs = 201,
    /** Client's request to add a QA item */
    AddQA = 202,
    /** Client's request to add documentation */
    AddDocumentation = 203,
    /** Client's request to remove a QA item */
    RemoveQA = 204,
    /** Client's request to remove documentation */
    RemoveDocumentation = 205,
    /** Client's request to add documentation from a URL (auto-fetch and chunk) */
    AddDocumentationFromUrl = 206,

    /** Client's request to train product relevance (positive or negative) */
    TrainRelevance = 300,
}

export enum ServerOperation {
    /** Server's initial response to a client's connection */
    Hello = 1,

    /** Server's response to parse message request */
    ParsedMessage = 10,
    /** Server's failure response to parse message request */
    ParseMessageFailed = 20,
    /** Server's response to classify intent request */
    ClassifiedIntent = 11,
    /** Server's failure response to classify intent request */
    ClassifyIntentFailed = 21,
    /** Server's response to validate answer request */
    ValidatedAnswer = 12,
    /** Server's failure response to validate answer request */
    ValidateAnswerFailed = 22,
    /** Server's response to check relevance request */
    CheckedRelevance = 13,
    /** Server's failure response to check relevance request */
    CheckRelevanceFailed = 23,
    /** Server's response to parse image request */
    ParsedImage = 14,
    /** Server's failure response to parse image request */
    ParseImageFailed = 24,

    /** Server's response to search docs request */
    SearchedDocs = 40,
    /** Server's failure response to search docs request */
    SearchDocsFailed = 50,
    /** Server's response to list docs request */
    ListedDocs = 41,
    /** Server's failure response to list docs request */
    ListDocsFailed = 51,
    /** Server's response to add QA request */
    AddedQA = 42,
    /** Server's failure response to add QA request */
    AddQAFailed = 52,
    /** Server's response to add documentation request */
    AddedDocumentation = 43,
    /** Server's failure response to add documentation request */
    AddDocumentationFailed = 53,
    /** Server's response to remove QA request */
    RemovedQA = 44,
    /** Server's failure response to remove QA request */
    RemoveQAFailed = 54,
    /** Server's response to remove documentation request */
    RemovedDocumentation = 45,
    /** Server's failure response to remove documentation request */
    RemoveDocumentationFailed = 55,
    /** Server's response to add documentation from URL request */
    AddedDocumentationFromUrl = 46,
    /** Server's failure response to add documentation from URL request */
    AddDocumentationFromUrlFailed = 56,

    /** Server's response to train relevance request */
    TrainedRelevance = 60,
    /** Server's failure response to train relevance request */
    TrainRelevanceFailed = 70,

    /** Server's disconnect message */
    Disconnect = 67,
}

/**
 * Union of all operation codes
 */
export const Operation = { ...ClientOperation, ...ServerOperation } as const
export type Operation = ClientOperation | ServerOperation
