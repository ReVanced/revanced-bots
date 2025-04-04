# This file should be triggered from the monorepo root
FROM oven/bun:latest AS base

FROM base AS build

WORKDIR /build
COPY . .
RUN bun install --frozen-lockfile
RUN cd apis/websocket && bun run build

FROM base AS release

WORKDIR /app
COPY --from=build /build/apis/websocket/dist /app
USER 1000:1000

ENTRYPOINT [ "bun", "--bun", "run", "index.js" ]
