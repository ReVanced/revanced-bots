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
}

export function getConfig() {
    return Object.assign(defaultConfig, userConfig) satisfies Config
}
