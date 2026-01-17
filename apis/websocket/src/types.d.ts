declare global {
    namespace NodeJS {
        interface ProcessEnv {
            LLM_API_KEY?: string
        }
    }
}

declare type NodeEnvironment = 'development' | 'production'
