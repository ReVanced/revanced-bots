import {
    type AnySchema,
    array,
    type BooleanSchema,
    boolean,
    custom,
    enum_,
    type InferOutput,
    type NullSchema,
    null_,
    type ObjectSchema,
    object,
    parse,
    pipe,
    string,
    url,
    // merge
} from 'valibot'
import DisconnectReason from '../constants/DisconnectReason'
import { ClientOperation, Operation, ServerOperation } from '../constants/Operation'

/**
 * Schema to validate packets
 */
export const PacketSchema = custom<Packet>(input => {
    if (
        typeof input === 'object' &&
        input &&
        'op' in input &&
        typeof input.op === 'number' &&
        input.op in Operation &&
        'd' in input
    ) {
        if (input.op in ServerOperation && !('s' in input && typeof input.s === 'number')) return false

        try {
            parse(PacketDataSchemas[input.op as Operation], input.d)
            return true
        } catch {
            return false
        }
    }
    return false
}, 'Invalid packet data')

/**
 * Schema to validate packet data for each possible operations
 */
export const PacketDataSchemas = {
    [ServerOperation.Hello]: null_(),
    [ServerOperation.ParsedText]: object({
        labels: array(
            object({
                name: string(),
                confidence: custom<number>(input => typeof input === 'number' && input >= 0 && input <= 1),
            }),
        ),
    }),
    [ServerOperation.ParsedImage]: object({
        text: string(),
    }),
    [ServerOperation.ParseTextFailed]: null_(),
    [ServerOperation.ParseImageFailed]: null_(),
    [ServerOperation.Disconnect]: object({
        reason: enum_(DisconnectReason),
    }),
    [ServerOperation.TrainedMessage]: boolean(),
    [ServerOperation.TrainMessageFailed]: null_(),

    [ClientOperation.ParseText]: object({
        text: string(),
    }),
    [ClientOperation.ParseImage]: object({
        image_url: pipe(string(), url()),
    }),
    [ClientOperation.TrainMessage]: object({
        text: string(),
        label: string(),
    }),
} as const satisfies Record<
    Operation,
    // biome-ignore lint/suspicious/noExplicitAny: This is a schema, it's not possible to type it
    ObjectSchema<any, any> | AnySchema | NullSchema<any> | BooleanSchema<any>
>

export type Packet<TOp extends Operation = Operation> = TOp extends ServerOperation
    ? PacketWithSequenceNumber<TOp>
    : Omit<PacketWithSequenceNumber<TOp>, 's'>

type PacketWithSequenceNumber<TOp extends Operation> = {
    op: TOp
    d: InferOutput<(typeof PacketDataSchemas)[TOp]>
    s: number
}
