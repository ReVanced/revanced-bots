import { ClientOperation, ServerOperation } from '@revanced/bot-shared'
import { AsyncQueue } from '@sapphire/async-queue'

import type { EventHandler } from './index.js'

const queue = new AsyncQueue()

const parseImageEventHandler: EventHandler<ClientOperation.ParseImage> = async (
    packet,
    { tesseractWorker, logger, config },
) => {
    const {
        client,
        d: { image_url: imageUrl, id },
    } = packet

    logger.debug(`Client ${client.id} requested to parse image from URL:`, imageUrl)
    logger.debug(`Queue currently has ${queue.remaining}/${config.ocrConcurrentQueues} items in it`)

    if (queue.remaining < config.ocrConcurrentQueues) queue.shift()
    await queue.wait()

    try {
        logger.debug(`Recognizing image from URL for client ${client.id}`)

        const { data, jobId } = await tesseractWorker.recognize(imageUrl)

        logger.debug(`Recognized image from URL for client ${client.id} (job ${jobId}):`, data.text)
        await client.send({
            op: ServerOperation.ParsedImage,
            d: {
                id,
                text: data.text,
            },
        })
    } catch {
        logger.error(`Failed to parse image from URL for client ${client.id}:`, imageUrl)
        await client.send({
            op: ServerOperation.ParseImageFailed,
            d: {
                id,
            },
        })
    } finally {
        queue.shift()
        logger.debug(
            `Finished processing image from URL for client ${client.id}, queue has ${queue.remaining}/${config.ocrConcurrentQueues} remaining items in it`,
        )
    }
}

export default parseImageEventHandler
