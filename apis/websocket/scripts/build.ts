import { createLogger } from '@revanced/bot-shared'
import { cp, exists, rm } from 'fs/promises'

const logger = createLogger()

logger.info('Cleaning previous build...')
if (await exists('./dist')) await rm('./dist', { recursive: true })

logger.info('Building WebSocket API...')
await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'bun',
    sourcemap: 'external',
})

logger.info('Building Tesseract.js worker...')
await Bun.build({
    entrypoints: ['../../node_modules/tesseract.js/src/worker-script/node/index.js'],
    external: ['tesseract.js-core/*'],
    target: 'bun',
    outdir: './dist/worker',
    sourcemap: 'external',
})

// Tesseract.js is really bad for minification
// It forcefully requires this core module to be present which contains the WASM files
logger.info('Copying Tesseract.js Core...')
await cp('../../node_modules/tesseract.js-core', './dist/node_modules/tesseract.js-core', { recursive: true })

logger.info('Copying config...')
await cp('config.json', 'dist/config.json')
