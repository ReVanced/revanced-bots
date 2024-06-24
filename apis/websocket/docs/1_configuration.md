# ⚙️ Configuration

This is the default configuration:

```json
{
    "address": "127.0.0.1",
    "port": 3000,
    "ocrConcurrentQueues": 1,
    "clientHeartbeatInterval": 60000,
    "debugLogsInProduction": false
}
```

---

### `config.address` & `config.port`

The address and port for the server to listen on.

### `config.ocrConcurrentQueues`

Amount of concurrent queues that can be run at a time.

> Setting this too high may cause performance issues.

### `config.clientHeartbeatInterval`

Heartbeat interval for clients. See [**💓 Heartbeating**](./packets.md#💓-heartbeating).

### `config.debugLogsInProduction`

Whether to print debug logs at all in production mode (when `NODE_ENV` is `production`).

## ⏭️ What's next

The next page will tell you how to run and bundle the server.

Continue: [🏃🏻‍♂️ Running the server](./2_running.md)
