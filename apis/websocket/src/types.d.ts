declare global {
    namespace NodeJS {
        interface ProcessEnv {
            WIT_AI_TOKEN?: string
        }
    }
}

declare type NodeEnvironment = 'development' | 'production'
