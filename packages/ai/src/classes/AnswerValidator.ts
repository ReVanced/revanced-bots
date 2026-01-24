import { pipeline, type TextClassificationPipeline, type TextClassificationSingle } from '@huggingface/transformers'
import { AnswerValidationLabel } from '@revanced/bot-shared'

export interface AnswerValidationScores {
    [AnswerValidationLabel.Answer]: number
    [AnswerValidationLabel.Partial]: number
    [AnswerValidationLabel.Counter]: number
    [AnswerValidationLabel.Backchannel]: number
}

export interface AnswerValidationResult {
    predicted: AnswerValidationLabel | null
    confidence: number
    scores: AnswerValidationScores
}

export interface AnswerValidatorConfig {
    modelPath: string
    quant: string
    thresholds: Record<AnswerValidationLabel, number>
}

export class AnswerValidator {
    private pipeline: TextClassificationPipeline | null = null

    constructor(private readonly config: AnswerValidatorConfig) {}

    async load(): Promise<void> {
        if (this.pipeline) return

        // @ts-expect-error very complex union trust me bro
        this.pipeline = (await pipeline('text-classification', this.config.modelPath, {
            // @ts-expect-error god shall forgive me
            dtype: this.config.quant,
        })) as TextClassificationPipeline
    }

    async validate(question: string, answer: string): Promise<AnswerValidationResult> {
        if (!this.pipeline) {
            throw new Error('Answer validator has not been loaded, cant validate')
        }

        /** NOTE: this is model specific
         * we have to have a separator token between the question and the answer */
        const input = `${question} [SEP] ${answer}`

        const results = (await this.pipeline(input, { top_k: 4 })) as TextClassificationSingle[]
        const thresholds = this.config.thresholds

        const scores: AnswerValidationScores = {
            [AnswerValidationLabel.Answer]: 0,
            [AnswerValidationLabel.Partial]: 0,
            [AnswerValidationLabel.Counter]: 0,
            [AnswerValidationLabel.Backchannel]: 0,
        }

        let predicted: AnswerValidationLabel | null = null
        let maxScore = 0

        for (const { label, score } of results) {
            const key = label as AnswerValidationLabel
            if (key && key in scores) {
                scores[key] = score
                if (score > maxScore && score > thresholds[key]) {
                    predicted = key
                    maxScore = score
                }
            }
        }

        return { predicted, confidence: maxScore, scores }
    }
}
