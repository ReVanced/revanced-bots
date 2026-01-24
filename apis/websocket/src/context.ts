import { AI } from '@revanced/bot-ai'
import { createLogger } from '@revanced/bot-shared'
import { exists as pathExists } from 'fs/promises'
import { join as joinPath } from 'path'
import { createWorker as createTesseractWorker, OEM } from 'tesseract.js'
import { getConfig } from './utils/config'

export const config = getConfig()

export const logger = createLogger({
    level: config.logLevel === 'none' ? Number.MAX_SAFE_INTEGER : config.logLevel,
})

export const ai = new AI(config.ai)

const TesseractWorkerDirPath = joinPath(import.meta.dir, 'worker')
const TesseractWorkerPath = joinPath(TesseractWorkerDirPath, 'index.js')

export const tesseract = await createTesseractWorker(
    'eng',
    OEM.DEFAULT,
    (await pathExists(TesseractWorkerDirPath)) ? { workerPath: TesseractWorkerPath } : undefined,
)
