import { dirname, join } from 'path'
import _firstConfig from '../config.js'

let currentConfig = _firstConfig

// Other parts of the code will access properties of this proxy, they don't care what the target looks like
export const config = new Proxy(
    {
        INSPECTION_WARNING: 'Run `context.__getConfig()` to inspect the latest config.',
    } as unknown as typeof currentConfig,
    {
        get(_, p, receiver) {
            if (p === 'invalidate')
                return async () => {
                    const path = join(dirname(Bun.main), '..', 'config.js')
                    Loader.registry.delete(path)
                    currentConfig = (await import(path)).default
                }

            return Reflect.get(currentConfig, p, receiver)
        },
        set(_, p, newValue, receiver) {
            return Reflect.set(currentConfig, p, newValue, receiver)
        },
    },
) as typeof _firstConfig & { invalidate(): void }

export const __getConfig = () => currentConfig
