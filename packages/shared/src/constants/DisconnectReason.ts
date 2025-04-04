/**
 * Disconnect reasons for clients
 */
enum DisconnectReason {
    /**
     * The client disconnected on its own (**CLIENT-ONLY**)
     */
    PlannedDisconnect = 1000,
    /**
     * The client sent an invalid packet (unserializable or invalid JSON)
     */
    InvalidPacket = 1007,
    /**
     * The server has encountered an internal error
     */
    ServerError = 1011,
    /**
     * Unknown reason
     */
    Generic = 4000,
    /**
     * The client did not respond with a heartbeat in time
     */
    TimedOut = 4001,
    /**
     * The receiving end didn't have an open socket
     */
    NoOpenSocket = 4003,
    /**
     * The client connected from another location
     */
    NewConnection = 4004,
    /**
     * The client was not ready in time (**CLIENT-ONLY**)
     */
    TooSlow = 4012,
}

export default DisconnectReason
