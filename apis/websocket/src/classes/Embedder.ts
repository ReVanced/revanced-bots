import { type FeatureExtractionPipeline, pipeline } from '@huggingface/transformers'

export interface EmbedderConfig {
    modelPath: string
    quant: string
}

export class Embedder {
    private pipeline: FeatureExtractionPipeline | null = null

    constructor(private readonly config: EmbedderConfig) {}

    async load(): Promise<void> {
        if (this.pipeline) return

        this.pipeline = (await pipeline('feature-extraction', this.config.modelPath, {
            // @ts-expect-error i am very sorry
            dtype: this.config.quant,
        })) as FeatureExtractionPipeline
    }

    async embed(text: string): Promise<number[]> {
        if (!this.pipeline) {
            throw new Error('Embeddings have not been loaded, cant embed.')
        }

        const result = await this.pipeline(text, {
            pooling: 'mean',
            normalize: true,
        })
        return Array.from(result.data as Float32Array)
    }
}
