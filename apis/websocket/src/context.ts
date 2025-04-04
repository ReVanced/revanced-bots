import { OEM, createWorker as createTesseractWorker } from 'tesseract.js'

import { join as joinPath } from 'path'
import { createLogger } from '@revanced/bot-shared'
import { exists as pathExists } from 'fs/promises'
import { getConfig } from './utils/config'

export const config = getConfig()

export const logger = createLogger({
    level: config.logLevel === 'none' ? Number.MAX_SAFE_INTEGER : config.logLevel,
})

export const wit = {
    token: process.env['WIT_AI_TOKEN']!,
    async fetch(route: string, options?: RequestInit) {
        const res = await fetch(`https://api.wit.ai${route}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            ...options,
        })

        if (!res.ok) throw new Error(`Failed to fetch from Wit.ai: ${res.statusText} (${res.status})`)

        return await res.json()
    },
    message(text: string) {
        return this.fetch(`/message?q=${encodeURIComponent(text)}&n=8`) as Promise<WitMessageResponse>
    },
    async train(text: string, label: string) {
        await this.fetch('/utterances', {
            body: JSON.stringify([
                {
                    text,
                    intent: label,
                    entities: [],
                    traits: [],
                },
            ]),
            method: 'POST',
        })
    },
} as const

export interface WitMessageResponse {
    text: string
    intents: Array<{
        id: string
        name: string
        confidence: number
    }>
}

const TesseractWorkerDirPath = joinPath(import.meta.dir, 'worker')
const TesseractWorkerPath = joinPath(TesseractWorkerDirPath, 'index.js')

export const tesseract = await createTesseractWorker(
    'eng',
    OEM.DEFAULT,
    (await pathExists(TesseractWorkerDirPath)) ? { workerPath: TesseractWorkerPath } : undefined,
)
