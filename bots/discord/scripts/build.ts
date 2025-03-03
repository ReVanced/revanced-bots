import { createLogger } from '@revanced/bot-shared'
import { cp, exists, rm } from 'fs/promises'

const logger = createLogger()

logger.warn('Cleaning previous build...')
if (await exists('./dist')) await rm('./dist', { recursive: true })

logger.info('Building bot...')
await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist/src',
    target: 'bun',
    external: ['./config.js'],
    sourcemap: 'external',
})

logger.info('Copying config...')
await cp('./config.js', './dist/config.js')

logger.info('Copying database schema...')
await cp('./.drizzle', './dist/.drizzle', { recursive: true })
await rm('./.drizzle', { recursive: true })
