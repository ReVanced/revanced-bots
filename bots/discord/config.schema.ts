import type { BaseMessageOptions } from 'discord.js'

export type Config = {
    prefix?: string
    admin?: {
        users?: string[]
        roles?: Record<string, string[]>
    }
    stickyMessages?: Record<string, Record<string, StickyMessageConfig>>
    moderation?: {
        roles: string[]
        cure?: {
            minimumNameLength?: number
            removeCharactersRegex?: RegExp
            defaultName: string
        }
        log?: {
            channel: string
            thread?: string
        }
    }
    rolePresets?: {
        checkExpiredEvery: number
        guilds: Record<string, Record<string, RolePresetConfig>>
    }
    messageScan?: {
        scanBots?: boolean
        scanOutsideGuilds?: boolean
        attachments?: {
            scanAttachments?: boolean
            allowedMimeTypes?: string[]
            maxTextFileSize?: number
        }
        filter?: {
            whitelist?: Filter
            blacklist?: Filter
        }
        humanCorrections: {
            falsePositiveLabel: string
            allow?: {
                users?: string[]
                members?: {
                    permissions?: bigint
                    roles?: string[]
                }
            }
        }
        responses: ConfigMessageScanResponse[]
    }
    logLevel: 'none' | 'error' | 'warn' | 'info' | 'log' | 'trace' | 'debug'
    api: {
        url: string
        disconnectLimit?: number
        disconnectRetryInterval?: number
    }
}

export type StickyMessageConfig = {
    timeout: number
    forceSendTimeout?: number
    message: BaseMessageOptions
}

export type RolePresetConfig = {
    give: string[]
    take: string[]
}

export type ConfigMessageScanResponse = {
    triggers: {
        text?: Array<RegExp | ConfigMessageScanResponseLabelConfig>
        image?: Array<RegExp>
    }
    filterOverride?: NonNullable<Config['messageScan']>['filter']
    response: ConfigMessageScanResponseMessage | null
    respondToReply?: boolean
}

export type ConfigMessageScanResponseLabelConfig = {
    /**
     * Label name
     */
    label: string
    /**
     * Confidence threshold
     */
    threshold: number
}

export type Filter = {
    roles?: string[]
    users?: string[]
    channels?: string[]
}

export type ConfigMessageScanResponseMessage = BaseMessageOptions
