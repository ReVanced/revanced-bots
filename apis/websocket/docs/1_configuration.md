# ⚙️ Configuration

This is the default configuration (provided in [config.json](../config.json)):

```json
{
    "address": "127.0.0.1",
    "port": 3000,
    "ocrConcurrentQueues": 1,
    "consoleLogLevel": "log"
}
```

---

### `config.address` & `config.port`

The address and port for the server to listen on.

### `config.ocrConcurrentQueues`

Amount of concurrent queues that can be run at a time.

> [!WARNING]
> Setting this too high may cause performance issues.

### `config.logLevel`

The level of logs to print to console. If the level is more important or equally important to set level, it will be forwarded to the console.

The possible levels (sorted by their importance descendingly) are:

-   `none` (no messages)
-   `fatal`
-   `error`
-   `warn`
-   `info`
-   `log`
-   `debug`

## ⏭️ What's next

The next page will tell you how to run and bundle the server.

Continue: [🏃🏻‍♂️ Running the server](./2_running_and_deploying.md)
