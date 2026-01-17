import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import type { EventHandler } from '.'

const validateAnswerEventHandler: EventHandler<ClientOperation.ValidateAnswer> = async (packet, { ai, logger }) => {
    const {
        client,
        d: { questionText, answerText },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to validate answer`)

    try {
        const result = await ai.validateAnswer(questionText, answerText)

        client.send(
            {
                op: ServerOperation.ValidatedAnswer,
                d: result,
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.ValidateAnswerFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to validate answer (${nextSeq}):`, e)
    }
}

export default validateAnswerEventHandler
