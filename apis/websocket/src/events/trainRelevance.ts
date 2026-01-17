import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const trainRelevanceEventHandler: EventHandler<ClientOperation.TrainRelevance> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { text, type },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to train ${type} relevance:`, text.slice(0, 50))

    try {
        if (type === 'positive') {
            await ai.trainPositiveRelevance(text)
        } else {
            await ai.trainNegativeRelevance(text)
        }

        client.send(
            {
                op: ServerOperation.TrainedRelevance,
                d: true,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.TrainRelevanceFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to train ${type} relevance (${nextSeq}):`, e)
    }
}

export default trainRelevanceEventHandler
