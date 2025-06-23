import {
    ClientOperation,
    DisconnectReason,
    deserializePacket,
    isClientPacket,
    type Packet,
    ServerOperation,
    serializePacket,
    uncapitalize,
} from '@revanced/bot-shared'
import { EventEmitter } from 'events'
import type TypedEmitter from 'typed-emitter'
import type { RawData, WebSocket } from 'ws'

export default class Client {
    id: string
    disconnected: DisconnectReason | false = false
    ready = false
    currentSequence = 0

    #emitter = new EventEmitter() as TypedEmitter<ClientEventHandlers>
    #socket: WebSocket

    constructor(options: ClientOptions) {
        this.#socket = options.socket
        this.id = options.id

        this.#socket.on('error', () => this.disconnect(DisconnectReason.ServerError))
        this.#socket.on('close', code => this._handleDisconnect(code))
        this.#socket.on('unexpected-response', () => this.disconnect(DisconnectReason.InvalidPacket))

        this.send({
            op: ServerOperation.Hello,
            d: null,
        })

        this._listen()
        this.ready = true
        this.#emitter.emit('ready')
    }

    on<T extends keyof ClientEventHandlers>(name: T, handler: ClientEventHandlers[typeof name]) {
        this.#emitter.on(name, handler)
    }

    once<T extends keyof ClientEventHandlers>(name: T, handler: ClientEventHandlers[typeof name]) {
        this.#emitter.once(name, handler)
    }

    off<T extends keyof ClientEventHandlers>(name: T, handler: ClientEventHandlers[typeof name]) {
        this.#emitter.off(name, handler)
    }

    send<T extends ServerOperation>(packet: Omit<Packet<T>, 's'>, sequence?: number) {
        this.#throwIfDisconnected('Cannot send packet to client that has already disconnected')
        this.#socket.send(serializePacket({ ...packet, s: sequence ?? this.currentSequence++ } as Packet<T>), err => {
            if (err) throw err
        })
    }

    async disconnect(reason: DisconnectReason | number = DisconnectReason.Generic) {
        this.#throwIfDisconnected('Cannot disconnect client that has already disconnected')

        this.#socket.close(reason)
        this._handleDisconnect(reason)
    }

    #throwIfDisconnected(errorMessage: string) {
        if (this.disconnected !== false) throw new Error(errorMessage)

        if (this.#socket.readyState !== this.#socket.OPEN) {
            this.#socket.close(DisconnectReason.NoOpenSocket)
            throw new Error(errorMessage)
        }
    }

    protected _handleDisconnect(code: number) {
        this.disconnected = code
        this.ready = false

        this.#emitter.emit('disconnect', code)
    }

    protected _listen() {
        this.#socket.on('message', data => {
            this.#emitter.emit('message', data)
            try {
                const rawPacket = deserializePacket(this._toBuffer(data))
                if (!isClientPacket(rawPacket)) throw null

                const packet: ClientPacketObject<ClientOperation> = {
                    ...rawPacket,
                    client: this,
                }

                this.#emitter.emit('packet', packet)
                this.#emitter.emit(
                    uncapitalize(ClientOperation[packet.op] as ClientEventName),
                    // @ts-expect-error TypeScript doesn't know that the above line will negate the type enough
                    packet,
                )
            } catch (_e) {
                // TODO: add error fields to sent packet so we can log what went wrong
                this.disconnect(DisconnectReason.InvalidPacket)
            }
        })
    }

    protected _toBuffer(data: RawData) {
        if (data instanceof Buffer) return data
        if (data instanceof ArrayBuffer) return Buffer.from(data)
        return Buffer.concat(data as Uint8Array[])
    }
}

export interface ClientOptions {
    id: string
    socket: WebSocket
}

export type ClientPacketObject<TOp extends ClientOperation> = Packet<TOp> & {
    client: Client
}

export type ClientEventName = keyof typeof ClientOperation

export type ClientEventHandlers = {
    [K in Uncapitalize<ClientEventName>]: (
        packet: ClientPacketObject<(typeof ClientOperation)[Capitalize<K>]>,
    ) => Promise<unknown> | unknown
} & {
    ready: () => Promise<unknown> | unknown
    packet: (packet: ClientPacketObject<ClientOperation>) => Promise<unknown> | unknown
    disconnect: (reason: DisconnectReason) => Promise<unknown> | unknown
    message: (data: RawData) => Promise<unknown> | unknown
}
