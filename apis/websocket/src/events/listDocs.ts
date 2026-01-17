import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const listDocsEventHandler: EventHandler<ClientOperation.ListDocs> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { offset, size },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to list docs (offset: ${offset ?? 0}, size: ${size ?? 100})`)

    try {
        const [qa, docs] = await Promise.all([
            ai.listQAItems(offset ?? 0, size ?? 100),
            ai.listDocumentation(offset ?? 0, size ?? 100),
        ])

        client.send(
            {
                op: ServerOperation.ListedDocs,
                d: { qa, docs },
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.ListDocsFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to list docs (${nextSeq}):`, e)
    }
}

export default listDocsEventHandler
