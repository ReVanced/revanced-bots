// @ts-check

/**
 * @type {import('./config.schema').Config}
 */
export default {
    prefix: '!',
    admin: {
        users: ['USER_ID_HERE'],
        roles: {
            GUILD_ID_HERE: ['ROLE_ID_HERE'],
        },
    },
    stickyMessages: {
        GUILD_ID_HERE: {
            CHANNEL_ID_HERE: {
                message: {
                    content: 'This is a sticky message!',
                },
                timeout: 60000,
                forceSendTimeout: 300000,
            },
        },
    },
    moderation: {
        cure: {
            minimumNameLength: 3,
            removeCharactersRegex: /[^a-zA-Z0-9 \-_]/g,
            defaultName: 'Server member',
        },
        roles: ['ROLE_ID_HERE'],
        log: {
            channel: 'CHANNEL_ID_HERE',
            // Optional
            thread: 'THREAD_ID_HERE',
        },
    },
    rolePresets: {
        guilds: {
            GUILD_ID_HERE: {
                preset: {
                    give: ['ROLE_ID_HERE'],
                    take: ['ROLE_ID_HERE'],
                },
                anotherPreset: {
                    give: ['ROLE_ID_HERE'],
                    take: ['ROLE_ID_HERE'],
                },
            },
        },
        checkExpiredEvery: 3600,
    },
    messageScan: {
        scanBots: false,
        scanOutsideGuilds: false,
        filter: {
            whitelist: {
                channels: ['CHANNEL_ID_HERE'],
                roles: ['ROLE_ID_HERE'],
                users: ['USER_ID_HERE'],
            },
            blacklist: {
                channels: ['CHANNEL_ID_HERE'],
                roles: ['ROLE_ID_HERE'],
                users: ['USER_ID_HERE'],
            },
        },
        humanCorrections: {
            allow: {
                members: {
                    permissions: 8n,
                    roles: ['ROLE_ID_HERE'],
                },
            },
        },
        attachments: {
            scanAttachments: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'text/plain'],
            maxTextFileSize: 512000,
        },
        responses: [
            {
                filterOverride: {
                    whitelist: {
                        channels: ['CHANNEL_ID_HERE'],
                        roles: ['ROLE_ID_HERE'],
                        users: ['USER_ID_HERE'],
                    },
                    blacklist: {
                        channels: ['CHANNEL_ID_HERE'],
                        roles: ['ROLE_ID_HERE'],
                        users: ['USER_ID_HERE'],
                    },
                },
                triggers: {
                    text: [/^regexp?$/, { label: 'label', threshold: 0.85 }],
                },
                response: {
                    embeds: [
                        {
                            title: 'Embed title',
                            description: 'Embed description',
                            fields: [
                                {
                                    name: 'Field name',
                                    value: 'Field value',
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
    logLevel: 'log',
    api: {
        url: 'ws://127.0.0.1:3000',
        disconnectLimit: 3,
        disconnectRetryInterval: 10000,
    },
}
