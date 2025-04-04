import parse from 'parse-duration'

parse[''] = parse['s']!
parse['mo'] = parse['M'] = parse['month']!

export const parseDuration = (duration: string, defaultUnit?: parse.Units) => {
    const defaultUnitValue = parse['']!
    if (defaultUnit) parse[''] = parse[defaultUnit]!
    const result = parse(duration, 'ms') ?? Number.NaN
    parse[''] = defaultUnitValue
    return result
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
