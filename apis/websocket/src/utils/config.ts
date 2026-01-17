import { existsSync } from 'fs'
import { resolve as resolvePath } from 'path'
import { pathToFileURL } from 'url'

const configPath = resolvePath(process.cwd(), 'config.json')

const userConfig: Partial<Config> = existsSync(configPath)
    ? (
          await import(pathToFileURL(configPath).href, {
              with: {
                  type: 'json',
              },
          })
      ).default
    : {}

type BaseTypeOf<T> = T extends (infer U)[]
    ? U[]
    : T extends (...args: unknown[]) => infer U
      ? (...args: unknown[]) => U
      : T extends object
        ? { [K in keyof T]: T[K] }
        : T

export type Config = Omit<BaseTypeOf<typeof import('../../config.json')>, '$schema'>

export const defaultConfig: Config = {
    address: '127.0.0.1',
    port: 8080,
    ocrConcurrentQueues: 1,
    logLevel: 'info',
    ai: {
        indexes: {
            documentation: './indexes/documentation',
            qa: './indexes/qa',
            productRelevance: './indexes/product-relevance',
        },
        embeddings: {
            modelPath: 'Xenova/all-MiniLM-L6-v2',
            quant: 'q8',
        },
        intentClassification: {
            modelPath: './models/intent-classification',
            quant: 'q4',
            thresholds: {
                question: 0.7,
                problem: 0.7,
                complete: 0.7,
            },
        },
        productRelevance: {
            threshold: 0.7,
        },
        answerValidation: {
            modelPath: './models/answer-validation',
            quant: 'q4',
            thresholds: {
                answer: 0.7,
                partial: 0.7,
                counter: 0.7,
                backchannel: 0.7,
            },
        },
        llm: {
            enabled: false,
            baseURL: '',
            model: '',
            temperature: 0.7,
            systemPrompt:
                'You are a helpful assistant for ReVanced, an open-source project that provides patches for Android apps.',
        },
        rag: {
            confidence: {
                high: 0.85,
                medium: 0.5,
            },
            thresholds: {
                qa: 0.5,
                docs: 0.5,
            },
        },
        documentParser: {
            maxChunkSize: 1000,
            chunkOverlap: 100,
            timeout: 30000,
        },
    },
}

function merge(target: Record<string, unknown>, source: Record<string, unknown>) {
    const result = { ...target }
    for (const key in source) {
        const targetValue = target[key]
        const sourceValue = source[key]

        const isObjectInfo =
            targetValue &&
            sourceValue &&
            typeof targetValue === 'object' &&
            typeof sourceValue === 'object' &&
            (targetValue as Record<string, unknown>).constructor === Object &&
            (sourceValue as Record<string, unknown>).constructor === Object

        if (isObjectInfo) {
            result[key] = merge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>)
        } else {
            result[key] = sourceValue
        }
    }

    return result
}

const mergedConfig: Config = merge(
    defaultConfig as Record<string, unknown>,
    userConfig as Record<string, unknown>,
) as unknown as Config

export function getConfig(): Config {
    return mergedConfig
}
