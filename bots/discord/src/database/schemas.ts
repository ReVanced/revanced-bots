import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import type { InferSelectModel } from 'drizzle-orm'

export const reminders = sqliteTable('reminders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creatorId: text('creator').notNull(),
    targetId: text('target').notNull(),
    guildId: text('guild').notNull(),
    channelId: text('channel').notNull(),
    message: text('message').notNull(),
    createdAt: integer('created_at').notNull(),
    remindAt: integer('remind_at').notNull(),
    intervalSeconds: integer('interval_seconds').notNull(),
    count: integer('count').notNull().default(0),
})

export type Reminder = InferSelectModel<typeof reminders>

export const responses = sqliteTable('responses', {
    replyId: text('reply').primaryKey().notNull(),
    channelId: text('channel').notNull(),
    guildId: text('guild').notNull(),
    referenceId: text('ref').notNull(),
    label: text('label').notNull(),
    content: text('text').notNull(),
    correctedById: text('by'),
})

export const appliedPresets = sqliteTable(
    'applied_presets',
    {
        memberId: text('member').notNull(),
        guildId: text('guild').notNull(),
        removedRoles: text('roles', { mode: 'json' }).notNull().$type<string[]>().default([]),
        preset: text('preset').notNull(),
        until: integer('until'),
    },
    table => [uniqueIndex('unique_composite').on(table.memberId, table.preset, table.guildId)],
)

export type Response = InferSelectModel<typeof responses>
export type AppliedPreset = InferSelectModel<typeof appliedPresets>
