import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/database/schemas.ts',
    out: './.drizzle',
    dbCredentials: {
        url: process.env['DATABASE_PATH'] ? `file:./${process.env['DATABASE_PATH']}` : 'file:./db.sqlite3',
    },
})
