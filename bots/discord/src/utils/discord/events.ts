import * as context from '$/context'
import type { ClientEvents } from 'discord.js'

const { client } = context.discord

export const withContext = <Event extends EventName>(
    fn: typeof on | typeof once,
    event: Event,
    listener: ListenerWithContextOf<Event>,
) => fn(event, (...args) => listener(context, ...args))

export const on = <Event extends EventName>(event: Event, listener: ListenerOf<Event>) => client.on(event, listener)
export const once = <Event extends EventName>(event: Event, listener: ListenerOf<Event>) => client.once(event, listener)

export type EventName = keyof ClientEvents
export type EventMap = {
    [K in EventName]: ListenerOf<K>
}

type ListenerOf<Event extends EventName> = (...args: ClientEvents[Event]) => void | Promise<void>
type ListenerWithContextOf<Event extends EventName> = (
    ...args: [typeof import('$/context'), ...ClientEvents[Event]]
) => void | Promise<void>
