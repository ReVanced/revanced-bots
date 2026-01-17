import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const removeQAEventHandler: EventHandler<ClientOperation.RemoveQA> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { id },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to remove QA:`, id)

    try {
        await ai.removeQAItem(id)

        client.send(
            {
                op: ServerOperation.RemovedQA,
                d: true,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.RemoveQAFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to remove QA (${nextSeq}):`, e)
    }
}

export default removeQAEventHandler
