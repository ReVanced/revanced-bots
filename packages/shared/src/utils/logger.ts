import { Chalk, supportsColor, supportsColorStderr } from 'chalk'
import { type Tracer, colorConsole, console as uncoloredConsole } from 'tracer'

const chalk = new Chalk()
const DefaultConfig = {
    dateformat: 'dd/mm/yyyy HH:mm:ss.sss Z',
    format: [
        '{{message}}',
        {
            error: `${chalk.bgRedBright.whiteBright(' ERROR ')} {{message}}\n${chalk.gray('{{stack}}')}`,
            debug: chalk.gray('DEBUG: {{message}}'),
            warn: `${chalk.bgYellowBright.whiteBright(' WARN ')} ${chalk.yellowBright('{{message}}')}`,
            info: `${chalk.bgBlueBright.whiteBright(' INFO ')} ${chalk.cyanBright('{{message}}')}`,
            fatal: `${chalk.bgRedBright.whiteBright(' FATAL ')} ${chalk.redBright('{{message}}')}\n${chalk.white(
                '{{stack}}',
            )}`,
            log: '{{message}}',
        },
    ],
    methods: ['debug', 'log', 'info', 'warn', 'error', 'fatal'],
    filters: [],
} satisfies Tracer.LoggerConfig

export function createLogger(config?: Omit<Tracer.LoggerConfig, keyof typeof DefaultConfig>) {
    const combinedConfig = { ...DefaultConfig, ...config }

    if (
        // biome-ignore lint/complexity/useOptionalChain: No Biome, this isn't a nullable check
        supportsColor &&
        supportsColor.hasBasic &&
        supportsColorStderr &&
        supportsColorStderr.hasBasic
    )
        return colorConsole(combinedConfig)
    return uncoloredConsole(combinedConfig)
}

export type Logger = ReturnType<typeof createLogger>
