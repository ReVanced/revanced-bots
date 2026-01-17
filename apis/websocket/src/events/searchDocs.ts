import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const searchDocsEventHandler: EventHandler<ClientOperation.SearchDocs> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { query, limit },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to search docs:`, query.slice(0, 100))

    try {
        const result = await ai.searchDocs(query, limit ?? 25)

        client.send(
            {
                op: ServerOperation.SearchedDocs,
                d: result,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.SearchDocsFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to search docs (${nextSeq}):`, e)
    }
}

export default searchDocsEventHandler
