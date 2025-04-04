import type { InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

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
    table => ({
        uniqueComposite: uniqueIndex('unique_composite').on(table.memberId, table.preset, table.guildId),
    }),
)

export type Response = InferSelectModel<typeof responses>
export type AppliedPreset = InferSelectModel<typeof appliedPresets>
