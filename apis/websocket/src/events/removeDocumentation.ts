import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const removeDocumentationEventHandler: EventHandler<ClientOperation.RemoveDocumentation> = async (
    packet,
    { ai, logger },
) => {
    const {
        client,
        d: { id },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to remove documentation:`, id)

    try {
        await ai.removeDocumentation(id)

        client.send(
            {
                op: ServerOperation.RemovedDocumentation,
                d: true,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.RemoveDocumentationFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to remove documentation (${nextSeq}):`, e)
    }
}

export default removeDocumentationEventHandler
