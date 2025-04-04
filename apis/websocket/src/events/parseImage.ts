import { type ClientOperation, ServerOperation } from '@revanced/bot-shared'
import { AsyncQueue } from '@sapphire/async-queue'

import type { EventHandler } from '.'

const queue = new AsyncQueue()

const parseImageEventHandler: EventHandler<ClientOperation.ParseImage> = async (
    packet,
    { tesseract, logger, config },
) => {
    const {
        client,
        d: { image_url: imageUrl },
    } = packet

    const nextSeq = client.currentSequence++

    logger.debug(`Client ${client.id} requested to parse image from URL (${nextSeq})`, imageUrl)

    if (queue.remaining < config.ocrConcurrentQueues) queue.shift()
    await queue.wait()

    logger.debug(`Process queued (${nextSeq}), queue has ${queue.remaining} items`)

    try {
        const { data, jobId } = await tesseract.recognize(imageUrl)

        logger.debug(`Image parsed (job ${jobId}) (${nextSeq}):`, data.text)
        client.send(
            {
                op: ServerOperation.ParsedImage,
                d: {
                    text: data.text,
                },
            },
            nextSeq,
        )
    } catch (e) {
        if (!client.disconnected)
            client.send(
                {
                    op: ServerOperation.ParseImageFailed,
                    d: null,
                },
                nextSeq,
            )
        else logger.warn(`Client disconnected before the failed packet could be sent (${nextSeq})`)
        logger.error(`Failed to parse image (${nextSeq}):`, e)
    } finally {
        queue.shift()
        logger.debug(`Finished parsing image (${nextSeq}), queue has ${queue.remaining} items`)
    }
}

export default parseImageEventHandler
