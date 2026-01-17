import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const addQAEventHandler: EventHandler<ClientOperation.AddQA> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { question, answer, url, timestamp },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to add QA:`, question.slice(0, 50))

    try {
        await ai.addQAItem(question, answer, url ?? '', timestamp ?? '')

        client.send(
            {
                op: ServerOperation.AddedQA,
                d: true,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.AddQAFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to add QA (${nextSeq}):`, e)
    }
}

export default addQAEventHandler
