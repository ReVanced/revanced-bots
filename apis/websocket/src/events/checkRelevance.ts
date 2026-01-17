import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const checkRelevanceEventHandler: EventHandler<ClientOperation.CheckRelevance> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { text },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to check relevance:`, text.slice(0, 100))

    try {
        const result = await ai.checkProductRelevance(text)

        client.send(
            {
                op: ServerOperation.CheckedRelevance,
                d: result,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.CheckRelevanceFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to check relevance (${nextSeq}):`, e)
    }
}

export default checkRelevanceEventHandler
