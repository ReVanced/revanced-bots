# 🏃🏻‍♂️ Running and deploying the server

There are many methods to run the server. Choose one that suits best for the situation.

## 👷🏻 Development mode

There will be no compilation step, and Bun will automatically watch changes and restart the server for you.

You can quickly start the server by running:

```sh
bun dev
```

## 📦 Building

If you're looking to build and host the server somewhere else, you can run:

```sh
bun run build
```

The distribution files will be placed inside the `dist` directory. Inside will include:

-   The default configuration for the API
-   Compiled source files of the API

## ✈️ Deploying

To deploy the API, you'll need to:

1. [Build the API as seen in the previous step](#-building)

2. Copy contents of the `dist` directory

    ```sh
    # For instance, we'll copy them both to /usr/src/api
    cp -R ./dist/* /usr/src/api
    ```

3. Replace the default configuration *(optional)*

4. Configure environment variables  
   As seen in [`.env.example`](../.env.example). You can also optionally use a `.env` file which **Bun will automatically load**.  
   It is recommended to set `NODE_ENV` to `production` when deploying production builds.

5. Finally, you can run the API using these commands

    ```sh
    cd /usr/src/api
    bun run index.js
    ```

## ⏭️ What's next

The next page will tell you about packets.

Continue: [📨 Packets](./3_packets.md)
