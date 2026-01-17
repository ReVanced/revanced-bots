import { boolean, custom, object, optional, record, string, unknown } from 'valibot'
import { AnswerValidationLabel, IntentClassificationLabel } from '../constants'

const Probability = custom<number>(
    input => typeof input === 'number' && input >= 0 && input <= 1,
    'Must be a number between 0 and 1',
)

const PositiveInt = custom<number>(
    input => typeof input === 'number' && Number.isInteger(input) && input > 0,
    'Must be a positive integer',
)

const Metadata = optional(record(string(), unknown()))

const IntentScoresSchema = object({
    [IntentClassificationLabel.Question]: Probability,
    [IntentClassificationLabel.Problem]: Probability,
    [IntentClassificationLabel.Complete]: Probability,
})

const IntentFlagsSchema = object({
    [IntentClassificationLabel.Question]: boolean(),
    [IntentClassificationLabel.Problem]: boolean(),
    [IntentClassificationLabel.Complete]: boolean(),
})

const ResponseScoresSchema = object({
    [AnswerValidationLabel.Answer]: Probability,
    [AnswerValidationLabel.Partial]: Probability,
    [AnswerValidationLabel.Counter]: Probability,
    [AnswerValidationLabel.Backchannel]: Probability,
})

export { Probability, PositiveInt, Metadata, IntentScoresSchema, IntentFlagsSchema, ResponseScoresSchema }
