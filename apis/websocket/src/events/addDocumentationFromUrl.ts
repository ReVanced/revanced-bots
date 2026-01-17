import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const addDocumentationFromUrlEventHandler: EventHandler<ClientOperation.AddDocumentationFromUrl> = async (
    packet,
    { ai, logger },
) => {
    const {
        client,
        d: { url },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to add documentation from URL:`, url)

    try {
        const result = await ai.addDocumentationFromUrl(url)

        client.send(
            {
                op: ServerOperation.AddedDocumentationFromUrl,
                d: result,
            },
            nextSeq,
        )

        if (result.success) {
            logger.info(`Successfully added ${result.chunksAdded} chunks from URL: ${url} (title: ${result.title})`)
        } else {
            logger.warn(`Failed to add documentation from URL: ${url} - ${result.error}`)
        }
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.AddDocumentationFromUrlFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to add documentation from URL (${nextSeq}):`, e)
    }
}

export default addDocumentationFromUrlEventHandler
