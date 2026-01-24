import OpenAI from 'openai'

export interface LLMConfig {
    apiKey: string
    baseURL: string
    model: string
    temperature: number
    llmSystemPrompt: string
}

export class LLM {
    private client: OpenAI | null = null

    constructor(private readonly config: LLMConfig) {
        this.client = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseURL,
        })
    }

    async chat(userPrompt: string, systemPrompt = this.config.llmSystemPrompt): Promise<string> {
        if (!this.client) {
            throw new Error('LLM not loaded')
        }

        const response = await this.client.chat.completions.create({
            model: this.config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: this.config.temperature,
        })

        return response.choices[0]?.message?.content || ''
    }

    async chatWithContext(
        userPrompt: string,
        context: string,
        systemPrompt = this.config.llmSystemPrompt,
    ): Promise<string> {
        if (!this.client) {
            throw new Error('LLM not loaded')
        }

        const fullPrompt = `Context:\n${context}\n\nUser Question:\n${userPrompt}`

        const response = await this.client.chat.completions.create({
            model: this.config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: fullPrompt },
            ],
            temperature: this.config.temperature,
        })

        return response.choices[0]?.message?.content || ''
    }
}
