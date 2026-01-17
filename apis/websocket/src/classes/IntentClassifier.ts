import { pipeline, type TextClassificationPipeline, type TextClassificationSingle } from '@huggingface/transformers'
import { IntentClassificationLabel } from '@revanced/bot-shared'

export interface IntentClassificationScores {
    [IntentClassificationLabel.Question]: number
    [IntentClassificationLabel.Problem]: number
    [IntentClassificationLabel.Complete]: number
}

export interface IntentClassificationResult {
    isActionable: boolean
    scores: IntentClassificationScores
}

export interface IntentClassifierConfig {
    modelPath: string
    quant: string
    thresholds: Record<IntentClassificationLabel, number>
}

export class IntentClassifier {
    private pipeline: TextClassificationPipeline | null = null

    constructor(private readonly config: IntentClassifierConfig) {}

    async load(): Promise<void> {
        if (this.pipeline) return

        this.pipeline = (await pipeline('text-classification', this.config.modelPath, {
            // @ts-expect-error i genuinely hate this but there are no types
            dtype: this.config.quant,
        })) as TextClassificationPipeline
    }

    async classify(text: string): Promise<IntentClassificationResult> {
        if (!this.pipeline) {
            throw new Error('Intent classifier has not been loaded, cant classify.')
        }

        const results = (await this.pipeline!(text, { top_k: 3 })) as TextClassificationSingle[]
        const thresholds = this.config.thresholds as Record<IntentClassificationLabel, number>

        const scores: IntentClassificationScores = {
            [IntentClassificationLabel.Question]: 0,
            [IntentClassificationLabel.Problem]: 0,
            [IntentClassificationLabel.Complete]: 0,
        }

        for (const { label, score } of results) {
            const key = label as IntentClassificationLabel
            if (key && key in scores) scores[key] = score
        }

        const flags = {
            [IntentClassificationLabel.Question]:
                scores[IntentClassificationLabel.Question] > thresholds[IntentClassificationLabel.Question],
            [IntentClassificationLabel.Problem]:
                scores[IntentClassificationLabel.Problem] > thresholds[IntentClassificationLabel.Problem],
            [IntentClassificationLabel.Complete]:
                scores[IntentClassificationLabel.Complete] > thresholds[IntentClassificationLabel.Complete],
        }

        const isActionable =
            flags[IntentClassificationLabel.Complete] &&
            (flags[IntentClassificationLabel.Question] || flags[IntentClassificationLabel.Problem])

        return { isActionable, scores }
    }
}
