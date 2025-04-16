import { Duration, DurationFormatter } from '@sapphire/duration'

const fmt = new DurationFormatter({
    year: {
        DEFAULT: 'y',
    },
    month: {
        DEFAULT: 'M',
    },
    week: {
        DEFAULT: 'w',
    },
    day: {
        DEFAULT: 'd',
    },
    hour: {
        DEFAULT: 'h',
    },
    minute: {
        DEFAULT: 'm',
    },
    second: {
        DEFAULT: 's',
    },
})

export const parseDuration = (duration: string, defaultUnit = 's') => {
    // adds default unit to the end of the string if it doesn't have a unit
    // 100 -> 100s
    // 10m100 -> 10m100s
    // biome-ignore lint/style/noParameterAssign: this is fine
    if (/\d$/.test(duration)) duration += defaultUnit
    return new Duration(duration).offset
}

export const durationToString = (duration: number) => {
    return fmt.format(duration, undefined, {
        left: '',
    })
}
