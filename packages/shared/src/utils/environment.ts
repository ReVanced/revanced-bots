export function getMissingEnvironmentVariables(keys: string[]) {
    return keys.filter(key => !process.env[key])
}

export function getEnvironmentType() {
    const environmentValue = process.env['NODE_ENV']
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/26255
    if (!NodeEnvironments.includes(environmentValue)) return null
    return process.env['NODE_ENV'] as NodeEnvironment
}

const NodeEnvironments = ['development', 'production'] as const
export type NodeEnvironment = (typeof NodeEnvironments)[number]
