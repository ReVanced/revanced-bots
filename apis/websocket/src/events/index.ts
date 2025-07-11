import type { ClientOperation, Logger } from '@revanced/bot-shared'
import type { Worker as TesseractWorker } from 'tesseract.js'
import type { ClientPacketObject } from '../classes/Client'
import type { Wit } from '../context'
import type { Config } from '../utils/config'

export { default as parseImageEventHandler } from './parseImage'
export { default as parseTextEventHandler } from './parseText'
export { default as trainMessageEventHandler } from './trainMessage'

export type EventHandler<POp extends ClientOperation> = (
    packet: ClientPacketObject<POp>,
    context: EventContext,
) => void | Promise<void>

export type EventContext = {
    wit: Wit
    tesseract: TesseractWorker
    logger: Logger
    config: Config
}
