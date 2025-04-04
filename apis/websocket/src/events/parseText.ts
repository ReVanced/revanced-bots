import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'

import type { EventHandler } from '.'

const parseTextEventHandler: EventHandler<ClientOperation.ParseText> = async (packet, { wit, logger }) => {
    const {
        client,
        d: { text },
    } = packet

    const nextSeq = client.currentSequence++
    const actualText = text.slice(0, 279)

    logger.debug(`Client ${client.id} requested to parse text:`, actualText)

    try {
        const { intents } = await wit.message(actualText)
        const intentsWithoutIds = intents.map(({ id, ...rest }) => rest)

        client.send(
            {
                op: ServerOperation.ParsedText,
                d: {
                    labels: intentsWithoutIds,
                },
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.ParseTextFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to parse text (${nextSeq}):`, e)
    }
}

export default parseTextEventHandler
