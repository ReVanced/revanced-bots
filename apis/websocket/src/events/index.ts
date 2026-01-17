import type { ClientOperation, Logger } from '@revanced/bot-shared'
import type { Worker as TesseractWorker } from 'tesseract.js'
import type { AI } from '../classes/AI'
import type { ClientPacketObject } from '../classes/Client'
import type { Config } from '../utils/config'

export { default as addDocumentationEventHandler } from './addDocumentation'
export { default as addDocumentationFromUrlEventHandler } from './addDocumentationFromUrl'
export { default as addQAEventHandler } from './addQA'
export { default as checkRelevanceEventHandler } from './checkRelevance'
export { default as classifyIntentEventHandler } from './classifyIntent'
export { default as listDocsEventHandler } from './listDocs'
export { default as parseImageEventHandler } from './parseImage'
export { default as parseMessageEventHandler } from './parseMessage'
export { default as removeDocumentationEventHandler } from './removeDocumentation'
export { default as removeQAEventHandler } from './removeQA'
export { default as searchDocsEventHandler } from './searchDocs'
export { default as trainRelevanceEventHandler } from './trainRelevance'
export { default as validateAnswerEventHandler } from './valdiateAnswer'

export type EventHandler<POp extends ClientOperation> = (
    packet: ClientPacketObject<POp>,
    context: EventContext,
) => void | Promise<void>

export type EventContext = {
    ai: AI
    tesseract: TesseractWorker
    logger: Logger
    config: Config
}
