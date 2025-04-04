# 📨 Packets

Packets are BSON messages sent to the server. They're structured like the following when decoded:

```json
{
    "op": 12345,
    "d": {
        "some_field": "some data"
    }
}
```

### `packet.op`

Operation codes are numbers that communicate an action.

### `packet.d`

Data fields include additional information for the server to process. They are **either an object with specific fields or just `null`**.

### `packet.s` (server packets)

A sequence number, exclusively for server packets. The WebSocket server contacts other APIs and they may not be reliable at all times, this makes race conditions. A sequence number cleanly solves this issue by letting the client know what the next packet sequence number would be by giving the current number.

#### 📦 Schemas and constants

Schemas for packets and their respective data[^1], and the list of possible operation codes[^2] can be found in the `@revanced/bot-shared` package, with typings as well.

[^1]: [`@revanced/bot-shared/src/schemas/Packet.ts`](../../../packages/shared/src/schemas/Packet.ts)
[^2]: [`@revanced/bot-shared/src/constants/Operation`](../../../packages/shared/src/constants/Operation.ts)
