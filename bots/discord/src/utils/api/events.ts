import type { ClientWebSocketEvents } from '@revanced/bot-api'
import * as context from '../../context'

const { client } = context.api

export const withContext = <Event extends EventName>(
    fn: typeof on | typeof once,
    event: Event,
    listener: ListenerWithContextOf<Event>,
    // @ts-expect-error: Not smart enough, sorry!
) => fn(event, (...args) => listener(context, ...args))

export const on = <Event extends EventName>(event: Event, listener: ListenerOf<Event>) => client.on(event, listener)
export const once = <Event extends EventName>(event: Event, listener: ListenerOf<Event>) => client.once(event, listener)

export type EventName = keyof ClientWebSocketEvents
export type ListenerOf<Event extends EventName> = ClientWebSocketEvents[Event]
export type ListenerWithContextOf<Event extends EventName> = (
    ...args: [typeof import('../../context'), ...Parameters<ClientWebSocketEvents[Event]>]
) => void | Promise<void>
