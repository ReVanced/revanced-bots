import {
    url,
    type AnySchema,
    type BooleanSchema,
    type NullSchema,
    type ObjectSchema,
    type Output,
    array,
    boolean,
    enum_,
    null_,
    object,
    parse,
    special,
    string,
    // merge
} from 'valibot'
import DisconnectReason from '../constants/DisconnectReason'
import { ClientOperation, Operation, ServerOperation } from '../constants/Operation'

/**
 * Schema to validate packets
 */
export const PacketSchema = special<Packet>(input => {
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
                confidence: special<number>(input => typeof input === 'number' && input >= 0 && input <= 1),
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
        image_url: string([url()]),
    }),
    [ClientOperation.TrainMessage]: object({
        text: string(),
        label: string(),
    }),
} as const satisfies Record<
    Operation,
    // biome-ignore lint/suspicious/noExplicitAny: This is a schema, it's not possible to type it
    ObjectSchema<any> | AnySchema | NullSchema | BooleanSchema
>

export type Packet<TOp extends Operation = Operation> = TOp extends ServerOperation
    ? PacketWithSequenceNumber<TOp>
    : Omit<PacketWithSequenceNumber<TOp>, 's'>

type PacketWithSequenceNumber<TOp extends Operation> = {
    op: TOp
    d: Output<(typeof PacketDataSchemas)[TOp]>
    s: number
}
