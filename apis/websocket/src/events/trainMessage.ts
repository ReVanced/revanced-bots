import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'

import type { EventHandler } from '.'

const trainMessageEventHandler: EventHandler<ClientOperation.TrainMessage> = async (packet, { wit, logger }) => {
    const {
        client,
        d: { text, label },
    } = packet

    const nextSeq = client.currentSequence++
    const actualText = text.slice(0, 279)

    logger.debug(`${client.id} requested to train label ${label} (${nextSeq}) with:`, actualText)

    try {
        await wit.train(actualText, label)
        client.send(
            {
                op: ServerOperation.TrainedMessage,
                d: true,
            },
            nextSeq,
        )

        logger.debug(`Trained label (${nextSeq})`)
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.TrainMessageFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client ${client.id} disconnected before the failed packet could be sent`)
        logger.error(`Failed to train (${nextSeq})`, e)
    }
}

export default trainMessageEventHandler
