/**
 * Client operation codes for the gateway
 */
export enum ClientOperation {
    /**
     * Client's request to parse text
     */
    ParseText = 100,
    /**
     * Client's request to parse image
     */
    ParseImage = 101,
    /**
     * Client's request to train a message
     */
    TrainMessage = 102,
}

/**
 * Server operation codes for the gateway
 */
export enum ServerOperation {
    /**
     * Server's initial response to a client's connection
     */
    Hello = 1,

    /**
     * Server's response to client's request to parse text
     */
    ParsedText = 10,
    /**
     * Server's response to client's request to parse image
     */
    ParsedImage = 11,
    /**
     * Server's failure response to client's request to parse text
     */
    ParseTextFailed = 12,
    /**
     * Server's failure response to client's request to parse image
     */
    ParseImageFailed = 13,
    /**
     * Server's response to client's request to train a message
     */
    TrainedMessage = 14,
    /**
     * Server's failure response to client's request to train a message
     */
    TrainMessageFailed = 15,

    /**
     * Server's disconnect message
     */
    Disconnect = 20,
}

export const Operation = { ...ClientOperation, ...ServerOperation } as const
export type Operation = ClientOperation | ServerOperation
