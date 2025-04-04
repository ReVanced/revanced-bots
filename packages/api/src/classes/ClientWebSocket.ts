import { EventEmitter } from 'events'
import {
    type ClientOperation,
    DisconnectReason,
    type Packet,
    ServerOperation,
    deserializePacket,
    isServerPacket,
    serializePacket,
    uncapitalize,
} from '@revanced/bot-shared'
import type TypedEmitter from 'typed-emitter'
import { type RawData, WebSocket } from 'ws'

/**
 * The class that handles the WebSocket connection to the server.
 * This is the only relevant class for the time being. But in the future, there may be more classes to handle different protocols of the API.
 */
export class ClientWebSocketManager {
    url: string
    timeout: number

    connecting = false
    ready = false
    disconnected: false | DisconnectReason = false
    currentSequence = 0

    #socket: WebSocket = null!
    #emitter = new EventEmitter() as TypedEmitter<ClientWebSocketEvents>

    constructor(options: ClientWebSocketManagerOptions) {
        this.url = options.url
        this.timeout = options.timeout ?? 10000
    }

    /**
     * Sets the URL to connect to
     *
     * **Requires a reconnect to take effect**
     */
    async setOptions({ url, timeout }: Partial<ClientWebSocketManagerOptions>, autoReconnect = true) {
        if (url) this.url = url
        this.timeout = timeout ?? this.timeout

        if (autoReconnect) {
            this.disconnect(true)
            await this.connect()
        }
    }

    /**
     * Connects to the WebSocket API
     * @returns A promise that resolves when the client is ready
     */
    async connect() {
        if (this.connecting) throw new Error('Cannot connect when already connecting to the server')

        this.connecting = true

        await new Promise<void>((rs, rj) => {
            try {
                this.#socket = new WebSocket(this.url)

                const timeout = setTimeout(() => {
                    if (!this.ready) {
                        this.#socket?.close(DisconnectReason.TooSlow)
                        this._handleDisconnect(DisconnectReason.TooSlow, 'WebSocket connection was not readied in time')
                    }
                }, this.timeout)

                const closeBeforeReadyHandler = (code: number, reason: Buffer) => {
                    this._handleDisconnect(code, reason.toString())
                    cleanup()
                }

                const readyHandler = () => {
                    this.disconnected = false
                    cleanup()
                    this.#listen()
                    rs()
                }

                const socket = this.#socket
                const cleanup = () => {
                    socket.off('open', readyHandler)
                    socket.off('close', closeBeforeReadyHandler)
                    clearTimeout(timeout)
                }

                this.#socket.on('open', readyHandler)
                this.#socket.on('close', closeBeforeReadyHandler)
            } catch (e) {
                rj(e)
            }
        })
            .then(() => {
                this.#socket.on('close', (code, reason) => this._handleDisconnect(code, reason.toString()))
            })
            .finally(() => {
                this.connecting = false
            })
    }

    /**
     * Adds an event listener
     * @param name The event name to listen for
     * @param handler The event handler
     * @returns The event handler function
     */
    on<TOpName extends keyof ClientWebSocketEvents>(name: TOpName, handler: ClientWebSocketEvents[typeof name]) {
        this.#emitter.on(name, handler)
    }

    /**
     * Removes an event listener
     * @param name The event name to remove a listener from
     * @param handler The event handler to remove
     * @returns The removed event handler function
     */
    off<TOpName extends keyof ClientWebSocketEvents>(name: TOpName, handler: ClientWebSocketEvents[typeof name]) {
        this.#emitter.off(name, handler)
    }

    /**
     * Adds an event listener that will only be called once
     * @param name The event name to listen for
     * @param handler The event handler
     * @returns The event handler function
     */
    once<TOpName extends keyof ClientWebSocketEvents>(name: TOpName, handler: ClientWebSocketEvents[typeof name]) {
        this.#emitter.once(name, handler)
    }

    /**
     * Sends a packet to the server
     * @param packet The packet to send
     * @returns A promise that resolves when the packet has been sent
     */
    send<TOp extends ClientOperation>(packet: Packet<TOp>) {
        this.#throwIfDisconnected('Cannot send a packet when already disconnected from the server')

        this.currentSequence++

        this.#socket.send(serializePacket(packet), err => {
            if (err) throw err
        })
    }

    /**
     * Disconnects from the WebSocket API
     */
    disconnect(force?: boolean) {
        if (!force) this.#throwIfDisconnected('Cannot disconnect when already disconnected from the server')
        this._handleDisconnect(DisconnectReason.PlannedDisconnect)
    }

    /**
     * Checks whether the client is ready
     * @returns Whether the client is ready
     */
    isReady(): this is ReadiedClientWebSocketManager {
        return this.ready
    }

    #listen() {
        this.#socket.on('message', data => {
            const packet = deserializePacket(this._toBuffer(data))

            if (!isServerPacket(packet)) return this.#emitter.emit('invalidPacket', packet)

            this.currentSequence = packet.s
            this.#emitter.emit('packet', packet)

            switch (packet.op) {
                case ServerOperation.Hello: {
                    this.#emitter.emit('hello')
                    this.ready = true
                    this.#emitter.emit('ready')
                    break
                }
                case ServerOperation.Disconnect:
                    return this._handleDisconnect((packet as Packet<ServerOperation.Disconnect>).d.reason)
                default:
                    return this.#emitter.emit(
                        uncapitalize(ServerOperation[packet.op] as ClientWebSocketEventName),
                        // @ts-expect-error: TS at it again
                        packet,
                    )
            }
        })
    }

    #throwIfDisconnected(errorMessage: string) {
        if (this.disconnected !== false) throw new Error(errorMessage)
        if (this.#socket.readyState !== this.#socket.OPEN) throw new Error(errorMessage)
    }

    protected _handleDisconnect(reason: DisconnectReason | number, message?: string) {
        this.disconnected = reason in DisconnectReason ? reason : DisconnectReason.Generic
        this.connecting = false
        this.#socket?.close(reason)
        this.#socket = null!

        this.#emitter.emit('disconnect', reason, message)
    }

    protected _toBuffer(data: RawData) {
        if (data instanceof Buffer) return data
        if (data instanceof ArrayBuffer) return Buffer.from(data)
        return Buffer.concat(data as Uint8Array[])
    }
}

export interface ClientWebSocketManagerOptions {
    /**
     * The URL to connect to
     */
    url: string
    /**
     * The timeout for the connection
     * @default 10000
     */
    timeout?: number
}

export type ClientWebSocketEventName = keyof typeof ServerOperation

type ClientWebSocketPredefinedEvents = {
    hello: () => Promise<void> | void
    ready: () => Promise<void> | void
    packet: (packet: Packet<ServerOperation>) => Promise<void> | void
    invalidPacket: (packet: Packet) => Promise<void> | void
    disconnect: (reason: DisconnectReason | number, message?: string) => Promise<void> | void
}

export type ClientWebSocketEvents = {
    [K in Exclude<Uncapitalize<ClientWebSocketEventName>, keyof ClientWebSocketPredefinedEvents>]: (
        packet: Packet<(typeof ServerOperation)[Capitalize<K>]>,
    ) => Promise<void> | void
} & ClientWebSocketPredefinedEvents

export type ReadiedClientWebSocketManager = RequiredProperty<InstanceType<typeof ClientWebSocketManager>>
