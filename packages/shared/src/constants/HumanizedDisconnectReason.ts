import DisconnectReason from './DisconnectReason'

/**
 * Humanized disconnect reasons for logs
 */
const HumanizedDisconnectReason = {
    [1006]: 'the receiving end had unexpectedly closed the connection',
    [DisconnectReason.InvalidPacket]: 'the client has sent invalid packet',
    [DisconnectReason.Generic]: '(unknown reason)',
    [DisconnectReason.TimedOut]: 'the client did not respond with a heartbeat in time',
    [DisconnectReason.ServerError]: 'the server had an internal server error',
    [DisconnectReason.TooSlow]: 'the client was not ready in time',
    [DisconnectReason.PlannedDisconnect]: 'the client has disconnected on its own',
    [DisconnectReason.NoOpenSocket]: 'the receiving end did not have an open socket',
    [DisconnectReason.NewConnection]: 'the client connected from another location',
} as const satisfies Record<DisconnectReason | number, string>

export default HumanizedDisconnectReason
