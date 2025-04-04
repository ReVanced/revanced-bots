import type { ClientOperation } from '@revanced/bot-shared'
import type { Logger } from '@revanced/bot-shared'
import type { Worker as TesseractWorker } from 'tesseract.js'
import type { ClientPacketObject } from '../classes/Client'
import type { WitMessageResponse } from '../context'
import type { Config } from '../utils/config'

export { default as parseTextEventHandler } from './parseText'
export { default as parseImageEventHandler } from './parseImage'
export { default as trainMessageEventHandler } from './trainMessage'

export type EventHandler<POp extends ClientOperation> = (
    packet: ClientPacketObject<POp>,
    context: EventContext,
) => void | Promise<void>

export type EventContext = {
    wit: {
        train(text: string, label: string): Promise<void>
        message(text: string): Promise<WitMessageResponse>
    }
    tesseract: TesseractWorker
    logger: Logger
    config: Config
}
