# ⚙️ Configuration

This page tells you how to configure the bot.

## 📄 JSON config

See [`config.ts`](../config.ts).

---

#### `config.owners`

User IDs of the owners of the bot. Only add owners when needed.

#### `config.guilds`

Servers the bot is allowed to be and register commands in.

#### `config.logLevel`

The level of logs to print to console. If the level is more important or equally important to set level, it will be forwarded to the console.

The possible levels (sorted by their importance descendingly) are:

-   `none`
-   `fatal`
-   `error`
-   `warn`
-   `info`
-   `log`
-   `debug`

#### `config.api.url`

WebSocket URL to connect to (including port). Soon auto-discovery will be implemented.

#### `config.api.disconnectLimit`

Amount of times to allow disconnecting before exiting with code `1`.

#### `config.messageScan`

[Please see the next page.](./2_adding_autoresponses.md)

#### `config.moderation`

TBD.

#### `config.rolePresets`

TBD.

## 🟰 Environment variables

See [`.env.example`](../.env.example).  
You can set environment variables in your shell or use a `.env` file which **Bun will automatically load**.

---

#### `DISCORD_TOKEN`

The Discord bot token.

#### `DATABASE_PATH`

The database path.
Example values are: `./revanced.db`, `db.sqlite3`, `../some/path/discord_bot.sqlite`

## ⏭️ What's next

The next page will tell you how to configure auto-responses.

Continue: [🗣️ Adding auto-responses](./2_adding_autoresponses.md)
