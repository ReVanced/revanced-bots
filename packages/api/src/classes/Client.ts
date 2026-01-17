import { ClientOperation, type Packet, ServerOperation } from '@revanced/bot-shared'
import {
    type ClientWebSocketEvents,
    ClientWebSocketManager,
    type ClientWebSocketManagerOptions,
} from './ClientWebSocket'

/**
 * The client that connects to the API.
 */
export default class Client {
    ready = false
    ws: ClientWebSocketManager
    #awaiter: ClientWebSocketPacketAwaiter

    constructor(options: ClientOptions) {
        this.ws = new ClientWebSocketManager(options.api.websocket)
        this.ws.on('ready', () => {
            this.ready = true
        })
        this.ws.on('disconnect', () => {
            this.ready = false
        })

        this.#awaiter = new ClientWebSocketPacketAwaiter(this.ws)
    }

    /**
     * Checks whether the client is ready
     * @returns Whether the client is ready
     */
    isReady(): this is ReadiedClient {
        return this.ready
    }

    async parseMessage(text: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.ParseMessage,
            d: { text },
        })

        // Since we don't have heartbeats anymore, this is fine.
        // But if we add anything similar, this will cause another race condition
        // To fix this, we can try adding a instanced function that would return the currentSequence
        // and it would be updated every time a "heartbeat ack" packet is received
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.ParsedMessage, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.ParseMessageFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.ParsedMessage) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to parse message, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to parse message, the API encountered an error')
        return packet
    }

    /**
     * Requests the API to parse the given text
     * @param text The text to parse
     * @returns An object containing the ID of the request and the labels
     */
    async classifyIntent(text: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.ClassifyIntent,
            d: { text },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.ClassifiedIntent, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.ClassifyIntentFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.ClassifiedIntent) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to classify intent, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to classify intent, the API encountered an error')
        return packet
    }

    async validateAnswer(questionText: string, answerText: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.ValidateAnswer,
            d: { questionText, answerText },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.ValidatedAnswer, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.ValidateAnswerFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.ValidatedAnswer) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to validate answer, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to validate answer, the API encountered an error')
        return packet
    }

    async checkRelevance(text: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.CheckRelevance,
            d: { text },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.CheckedRelevance, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.CheckRelevanceFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.CheckedRelevance) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to check relevance, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to check relevance, the API encountered an error')
        return packet
    }

    /**
     * Requests the API to parse the given image and return the text
     * @param url The URL of the image
     * @returns An object containing the ID of the request and the parsed text
     */
    async parseImage(url: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.ParseImage,
            d: { imageUrl: url },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.ParsedImage, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.ParseImageFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.ParsedImage) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to parse image, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to parse image, the API encountered an error')
        return packet
    }

    async searchDocs(query: string, limit?: number) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.SearchDocs,
            d: { query, limit },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.SearchedDocs, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.SearchDocsFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.SearchedDocs) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to search docs, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to search docs, the API encountered an error')
        return packet
    }

    async listDocs(offset?: number, size?: number) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.ListDocs,
            d: { offset, size },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.ListedDocs, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.ListDocsFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.ListedDocs) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to list docs, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to list docs, the API encountered an error')
        return packet
    }

    async addQA(question: string, answer: string, url?: string, timestamp?: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.AddQA,
            d: { question, answer, url, timestamp },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.AddedQA, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.AddQAFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.AddedQA) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to add QA, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to add QA, the API encountered an error')
        return packet
    }

    async addDocumentation(text: string, url: string, title?: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.AddDocumentation,
            d: { text, url, title },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.AddedDocumentation, this.ws.currentSequence),
            this.#awaiter.await(
                ServerOperation.AddDocumentationFailed,
                this.ws.currentSequence,
                this.ws.timeout + 5000,
            ),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.AddedDocumentation) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to add documentation, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to add documentation, the API encountered an error')
        return packet
    }

    /**
     * Requests the API to fetch a document from a URL, parse it, chunk it, and add to the documentation index
     * @param url The URL to fetch documentation from
     * @returns An object containing the result of the operation including chunks added
     */
    async addDocumentationFromUrl(url: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.AddDocumentationFromUrl,
            d: { url },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.AddedDocumentationFromUrl, this.ws.currentSequence),
            this.#awaiter.await(
                ServerOperation.AddDocumentationFromUrlFailed,
                this.ws.currentSequence,
                this.ws.timeout + 30000,
            ), // Longer timeout for URL fetch
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.AddedDocumentationFromUrl) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to add documentation from URL, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to add documentation from URL, the API encountered an error')
        return packet
    }

    async removeQA(id: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.RemoveQA,
            d: { id },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.RemovedQA, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.RemoveQAFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.RemovedQA) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to remove QA, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to remove QA, the API encountered an error')
        return packet
    }

    async removeDocumentation(id: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.RemoveDocumentation,
            d: { id },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.RemovedDocumentation, this.ws.currentSequence),
            this.#awaiter.await(
                ServerOperation.RemoveDocumentationFailed,
                this.ws.currentSequence,
                this.ws.timeout + 5000,
            ),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.RemovedDocumentation) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to remove documentation, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to remove documentation, the API encountered an error')
        return packet
    }

    async trainRelevance(text: string, type: 'positive' | 'negative') {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.TrainRelevance,
            d: { text, type },
        })

        // See line 44
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.TrainedRelevance, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.TrainRelevanceFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.TrainedRelevance) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to train relevance, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to train relevance, the API encountered an error')
        return packet
    }

    /**
     * Adds an event listener
     * @param name The event name to listen for
     * @param handler The event handler
     * @returns The event handler function
     */
    on<TOpName extends keyof ClientWebSocketEvents>(name: TOpName, handler: ClientWebSocketEvents[TOpName]) {
        this.ws.on(name, handler)
        return handler
    }

    /**
     * Removes an event listener
     * @param name The event name to remove a listener from
     * @param handler The event handler to remove
     * @returns The removed event handler function
     */
    off<TOpName extends keyof ClientWebSocketEvents>(name: TOpName, handler: ClientWebSocketEvents[TOpName]) {
        this.ws.off(name, handler)
        return handler
    }

    /**
     * Adds an event listener that will only be called once
     * @param name The event name to listen for
     * @param handler The event handler
     * @returns The event handler function
     */
    once<TOpName extends keyof ClientWebSocketEvents>(name: TOpName, handler: ClientWebSocketEvents[TOpName]) {
        this.ws.once(name, handler)
        return handler
    }

    /**
     * Connects the client to the API
     */
    connect() {
        return this.ws.connect()
    }

    /**
     * Disconnects the client from the API
     */
    disconnect(force?: boolean) {
        this.ws.disconnect(force)
    }

    #throwIfNotReady() {
        if (!this.isReady()) throw new Error('Client is not ready')
    }

    get disconnected() {
        return this.ws.disconnected
    }
}

export class ClientWebSocketPacketAwaiter {
    #ws: ClientWebSocketManager
    #resolvers: Map<string, (packet: Packet<ServerOperation>) => void>

    constructor(ws: ClientWebSocketManager) {
        this.#ws = ws
        this.#resolvers = new Map()

        this.#ws.on('packet', packet => {
            const key = this.keyFor(packet.op, packet.s)
            const resolve = this.#resolvers.get(key)
            if (resolve) {
                resolve(packet)
                this.#resolvers.delete(key)
            }
        })
    }

    keyFor(op: ServerOperation, seq: number) {
        return `${op}-${seq}`
    }

    await<TOp extends ServerOperation>(
        op: TOp,
        expectedSeq: number,
        timeout = 10000,
    ): Promise<Packet<ServerOperation>> {
        return new Promise((resolve, reject) => {
            const key = this.keyFor(op, expectedSeq)
            this.#resolvers.set(key, resolve)

            setTimeout(() => {
                this.#resolvers.delete(key)
                reject('Awaiting packet timed out')
            }, timeout)
        })
    }
}

export type ReadiedClient = Client & { ready: true }

export interface ClientOptions {
    api: ClientApiOptions
}

export interface ClientApiOptions {
    websocket: ClientWebSocketManagerOptions
}
