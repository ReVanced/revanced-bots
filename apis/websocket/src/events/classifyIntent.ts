import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const classifyIntentEventHandler: EventHandler<ClientOperation.ClassifyIntent> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { text },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to classify intent:`, text.slice(0, 100))

    try {
        const result = await ai.classifyIntent(text)

        client.send(
            {
                op: ServerOperation.ClassifiedIntent,
                d: result,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.ClassifyIntentFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to classify intent (${nextSeq}):`, e)
    }
}

export default classifyIntentEventHandler
