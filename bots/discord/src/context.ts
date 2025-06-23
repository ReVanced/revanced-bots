import { Database } from 'bun:sqlite'
import { Client as APIClient } from '@revanced/bot-api'
import { createLogger } from '@revanced/bot-shared'
import { Client as DiscordClient, type Message, Options, Partials } from 'discord.js'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { __getConfig, config } from './config'
import * as schemas from './database/schemas'
import type { default as Command, CommandOptionsOptions, CommandType } from './classes/Command'
export { config, __getConfig }

export const logger = createLogger({
    level: config.logLevel === 'none' ? Number.MAX_SAFE_INTEGER : config.logLevel,
})

// Export a few things before we initialize commands
import * as commands from './commands'

export const api = {
    client: new APIClient({
        api: {
            websocket: {
                url: config.api.url,
            },
        },
    }),
    intentionallyDisconnecting: false,
    disconnectCount: 0,
}

const DatabasePath = process.env['DATABASE_PATH']
const DatabaseSchemaDir = join(import.meta.dir, '..', '.drizzle')

let dbSchemaFileName: string | undefined

if (DatabasePath && !existsSync(DatabasePath)) {
    logger.warn('Database file not found, trying to create from schema...')

    try {
        const file = readdirSync(DatabaseSchemaDir, { withFileTypes: true })
            .filter(file => file.isFile() && file.name.endsWith('.sql'))
            .sort()
            .at(-1)

        if (!file) throw new Error('No schema file found')

        dbSchemaFileName = file.name
        logger.debug(`Using schema file: ${dbSchemaFileName}`)
    } catch (e) {
        logger.fatal('Could not create database from schema, check if the schema file exists and is accessible')
        logger.fatal(e)
        process.exit(1)
    }
}

const db = new Database(DatabasePath, { readwrite: true, create: true })
if (dbSchemaFileName) db.run(readFileSync(join(DatabaseSchemaDir, dbSchemaFileName)).toString())

export const database = drizzle(db, {
    schema: schemas,
})

export const discord = {
    client: new DiscordClient({
        intents: [
            'Guilds',
            'GuildMembers',
            'GuildModeration',
            'GuildMessages',
            'GuildMessageReactions',
            'DirectMessages',
            'DirectMessageReactions',
            'MessageContent',
        ],
        allowedMentions: {
            parse: ['users'],
            repliedUser: true,
        },
        sweepers: {
            ...Options.DefaultSweeperSettings,
            messages: {
                interval: 1_800, // Every 30m
                lifetime: 3_600, // Remove messages older than 1h
            },
        },
        makeCache: Options.cacheWithLimits({
            ...Options.DefaultMakeCacheSettings,
            UserManager: 50,
            GuildMemberManager: {
                maxSize: 50,
                // Always keep client guild member in cache
                keepOverLimit: member => member.id === member.client.user.id,
            },
            ThreadManager: {
                maxSize: 0,
                // Always keep threads that are used for moderation logging
                keepOverLimit: thread => config.moderation?.log?.thread === thread.id,
            },
            GuildMessageManager: {
                maxSize: 0,
                // Always keep messages posted by the client in cache
                keepOverLimit: message => message.author.id === message.client.user.id,
            },
            // Unneeded cache
            MessageManager: 0,
            ReactionManager: 0,
            VoiceStateManager: 0,
            ThreadMemberManager: 0,
            StageInstanceManager: 0,
            ReactionUserManager: 0,
            PresenceManager: 0,
            GuildTextThreadManager: 0,
            GuildStickerManager: 0,
            DMMessageManager: 0,
            GuildEmojiManager: 0,
            GuildBanManager: 0,
            GuildScheduledEventManager: 0,
            EntitlementManager: 0,
            AutoModerationRuleManager: 0,
            GuildForumThreadManager: 0,
            BaseGuildEmojiManager: 0,
            GuildInviteManager: 0,
        }),
        partials: [Partials.Message, Partials.Reaction, Partials.GuildMember],
    }),
    commands: Object.fromEntries(Object.values(commands).map(cmd => [cmd.name, cmd])) as Record<
        string,
        Command<CommandType, CommandOptionsOptions | undefined, boolean>
    >,
    stickyMessages: {} as Record<
        string,
        Record<
            string,
            {
                /**
                 * Chat is active, so force send timer is also active
                 */
                forceTimerActive: boolean
                /**
                 * There was a message sent, so the timer is active
                 */
                timerActive: boolean
                timerMs: number
                forceTimerMs?: number
                send: () => Promise<void>
                currentMessage?: Message<true>
                timer?: NodeJS.Timeout
                forceTimer?: NodeJS.Timeout
            }
        >
    >,
} as const
