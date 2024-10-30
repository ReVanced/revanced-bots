import parse from 'parse-duration'

parse['mo'] = parse['M'] = parse['month']!

const defaultUnitValue = parse['']!

export const parseDuration = (duration: string, defaultUnit?: parse.Units) => {
    if (defaultUnit) parse[''] = parse[defaultUnit]!
    return (
        // biome-ignore lint/suspicious/noAssignInExpressions: Expression is ignored
        // biome-ignore lint/style/noCommaOperator: The last expression (parse call) is returned, it is not confusing
        (parse[''] = defaultUnitValue), parse(duration, 'ms') ?? Number.NaN
    )
}

export const durationToString = (duration: number) => {
    if (duration === 0) return '0s'

    const days = Math.floor(duration / (24 * 60 * 60 * 1000))
    const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((duration % (60 * 1000)) / 1000)

    return `${days ? `${days}d` : ''}${hours ? `${hours}h` : ''}${minutes ? `${minutes}m` : ''}${
        seconds ? `${seconds}s` : ''
    }`
}
