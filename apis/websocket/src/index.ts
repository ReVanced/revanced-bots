import { inspect as inspectObject } from 'util'

import Client from './classes/Client'

import { type EventContext, parseImageEventHandler, parseTextEventHandler, trainMessageEventHandler } from './events'

import { DisconnectReason, HumanizedDisconnectReason } from '@revanced/bot-shared'

import { createServer } from 'http'
import { type WebSocket, WebSocketServer } from 'ws'
import { config, logger, tesseract, wit } from './context'

// Load config, init logger, check environment

if (!process.env['NODE_ENV']) logger.warn('NODE_ENV not set, defaulting to `development`')
const environment = (process.env['NODE_ENV'] ?? 'development') as NodeEnvironment

if (!['development', 'production'].includes(environment)) {
    logger.error('NODE_ENV is neither `development` nor `production`, unable to determine environment')
    logger.info('Set NODE_ENV to blank to use `development` mode')
    process.exit(1)
}

logger.info(`Running in ${environment} mode...`)

if (!process.env['WIT_AI_TOKEN']) {
    logger.error('WIT_AI_TOKEN is not defined in the environment variables')
    process.exit(1)
}

// Handle uncaught exceptions

process.on('uncaughtException', e => logger.error('Uncaught exception:', e))
process.on('unhandledRejection', e => logger.error('Unhandled rejection:', e))

// Server logic

const clientIds = new Set<string>()
const clientToSocket = new WeakMap<Client, WebSocket>()
const socketToClient = new WeakMap<WebSocket, Client>()
const eventContext: EventContext = {
    tesseract,
    logger,
    wit,
    config,
}

const server = createServer()
const wss = new WebSocketServer({
    // 16 KiB max payload
    // A Discord message can not be longer than 4000 characters
    // OCR should not be longer than 16000 characters
    maxPayload: 16 * 1024,
    server,
})

wss.on('connection', async (socket, request) => {
    try {
        const addrInfo = request.socket.address()
        if (!('address' in addrInfo)) {
            socket.close()
            return logger.warn('Connection failed because client is missing remote address. addrInfo =', addrInfo)
        }

        const id = `${addrInfo.address}:${addrInfo.port}`

        if (clientIds.has(id)) {
            logger.warn(`Client ${id} already connected, disconnecting old session`)
            const oldClient = socketToClient.get(socket)
            await oldClient?.disconnect(DisconnectReason.NewConnection)
        }

        const client = new Client({
            socket,
            id,
        })

        socketToClient.set(socket, client)
        clientToSocket.set(client, socket)

        logger.info(`New client connected with ID: ${id}`)

        client.on('disconnect', reason => {
            clientIds.delete(client.id)
            clientToSocket.delete(client)
            socketToClient.delete(socket)

            logger.info(
                `Client ${client.id} disconnected because client ${HumanizedDisconnectReason[reason]} (${reason})`,
            )
        })

        client.on('parseText', packet => parseTextEventHandler(packet, eventContext))
        client.on('parseImage', packet => parseImageEventHandler(packet, eventContext))
        client.on('trainMessage', packet => trainMessageEventHandler(packet, eventContext))

        if (['debug', 'trace'].includes(config.logLevel)) {
            logger.debug('Debug logs enabled, attaching debug events...')

            client.on('message', d => logger.debug(`Message from client ${client.id}:`, d))
            client.on('packet', ({ client, ...rawPacket }) =>
                logger.debug(`Packet received from client ${client.id}: ${inspectObject(rawPacket)}`),
            )
        }
    } catch (e) {
        if (e instanceof Error) logger.error(e.stack ?? e.message)
        else logger.error(inspectObject(e))

        const client = socketToClient.get(socket)

        if (!client) {
            logger.error(
                'Missing client instance when encountering an error. If the instance still exists in memory, it will NOT be removed!',
            )
            return socket.terminate()
        }

        if (client.disconnected === false) client.disconnect(DisconnectReason.ServerError)

        logger.debug(`Client ${client.id} disconnected because of an internal error`)
    }
})

// Start the server

server.listen(config.port, config.address)
logger.debug(`Starting with these configurations: ${inspectObject(config)}`)

const addressInfo = wss.address()
if (!addressInfo || typeof addressInfo !== 'object')
    logger.debug('Server started, but cannot determine address information')
else logger.info(`Server started at: ${addressInfo.address}:${addressInfo.port}`)
