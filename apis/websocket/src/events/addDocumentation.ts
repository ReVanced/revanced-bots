import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const addDocumentationEventHandler: EventHandler<ClientOperation.AddDocumentation> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { text, url, title },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to add documentation:`, text ? text.slice(0, 50) : url)

    try {
        await ai.addDocumentation(text, url, title ?? '')

        client.send(
            {
                op: ServerOperation.AddedDocumentation,
                d: true,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.AddDocumentationFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to add documentation (${nextSeq}):`, e)
    }
}

export default addDocumentationEventHandler
