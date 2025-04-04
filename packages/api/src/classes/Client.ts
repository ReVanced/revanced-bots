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

    /**
     * Requests the API to parse the given text
     * @param text The text to parse
     * @returns An object containing the ID of the request and the labels
     */
    async parseText(text: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.ParseText,
            d: {
                text,
            },
        })

        // Since we don't have heartbeats anymore, this is fine.
        // But if we add anything similar, this will cause another race condition
        // To fix this, we can try adding a instanced function that would return the currentSequence
        // and it would be updated every time a "heartbeat ack" packet is received
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.ParsedText, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.ParseTextFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.ParsedText) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to parse text, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to parse text, the API encountered an error')
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
            d: {
                image_url: url,
            },
        })

        // See line 50

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

    async trainMessage(text: string, label: string) {
        this.#throwIfNotReady()

        this.ws.send({
            op: ClientOperation.TrainMessage,
            d: {
                label,
                text,
            },
        })

        // See line 50
        const packet = await Promise.race([
            this.#awaiter.await(ServerOperation.TrainedMessage, this.ws.currentSequence),
            this.#awaiter.await(ServerOperation.TrainMessageFailed, this.ws.currentSequence, this.ws.timeout + 5000),
        ])
            .then(pkt => {
                if (pkt.op === ServerOperation.TrainedMessage) return pkt.d
                return null
            })
            .catch(() => {
                throw new Error('Failed to train message, the API did not respond in time')
            })

        if (!packet) throw new Error('Failed to train message, the API encountered an error')
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
