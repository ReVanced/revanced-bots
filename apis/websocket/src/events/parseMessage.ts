import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const parseMessageEventHandler: EventHandler<ClientOperation.ParseMessage> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { text },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to parse message:`, text.slice(0, 100))

    try {
        const result = await ai.parseMessage(text)

        client.send(
            {
                op: ServerOperation.ParsedMessage,
                d: result,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.ParseMessageFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to parse message (${nextSeq}):`, e)
    }
}

export default parseMessageEventHandler
