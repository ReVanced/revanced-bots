import { ClientOperation, type Operation, ServerOperation } from '../constants/Operation'
import type { Packet } from '../schemas/Packet'

/**
 * Checks whether a packet is trying to do the given operation
 * @param op Operation code to check
 * @param packet A packet
 * @returns Whether this packet is trying to do the operation given
 */
export function packetMatchesOperation<TOp extends Operation>(op: TOp, packet: Packet): packet is Packet<TOp> {
    return packet.op === op
}

/**
 * Checks whether this packet is a client packet **(this does NOT validate the data)**
 * @param packet A packet
 * @returns Whether this packet is a client packet
 */
export function isClientPacket(packet: Packet): packet is Packet<ClientOperation> {
    return packet.op in ClientOperation
}

/**
 * Checks whether this packet is a server packet **(this does NOT validate the data or the sequence number)**
 * @param packet A packet
 * @returns Whether this packet is a server packet
 */
export function isServerPacket(packet: Packet): packet is Packet<ServerOperation> {
    return packet.op in ServerOperation
}
