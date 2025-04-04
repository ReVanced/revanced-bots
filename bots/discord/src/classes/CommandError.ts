import { createErrorEmbed } from '../utils/discord/embeds'

export default class CommandError extends Error {
    type: CommandErrorType

    constructor(type: CommandErrorType, message: string = ErrorMessageMap[type]) {
        super(message)
        this.name = 'CommandError'
        this.type = type
    }

    toEmbed() {
        return createErrorEmbed(ErrorTitleMap[this.type], this.message ?? '')
    }
}

export enum CommandErrorType {
    Generic = 1,
    InteractionNotInGuild,
    InteractionDataMismatch,
    FetchManagerNotFound,
    FetchNotFound,
    RequirementsNotMet = 100,
    MissingArgument,
    InvalidArgument,
}

const ErrorTitleMap: Record<CommandErrorType, string> = {
    [CommandErrorType.Generic]: 'An exception was thrown',
    [CommandErrorType.InteractionNotInGuild]: 'This command can only be used in servers',
    [CommandErrorType.InteractionDataMismatch]: 'Command data mismatch',
    [CommandErrorType.FetchManagerNotFound]: 'Cannot fetch data (manager not found)',
    [CommandErrorType.FetchNotFound]: 'Cannot fetch data (source not found)',
    [CommandErrorType.RequirementsNotMet]: 'Command requirements not met',
    [CommandErrorType.MissingArgument]: 'Missing argument',
    [CommandErrorType.InvalidArgument]: 'Invalid argument',
}

const ErrorMessageMap: Record<CommandErrorType, string> = {
    [CommandErrorType.Generic]: 'An generic exception was thrown.',
    [CommandErrorType.InteractionNotInGuild]: 'This command can only be used in servers.',
    [CommandErrorType.InteractionDataMismatch]: 'Interaction command data does not match the expected command data.',
    [CommandErrorType.FetchManagerNotFound]: 'Cannot fetch required data.',
    [CommandErrorType.FetchNotFound]: 'Cannot fetch target.',
    [CommandErrorType.RequirementsNotMet]: 'You do not meet the requirements to use this command.',
    [CommandErrorType.MissingArgument]: 'You are missing a required argument.',
    [CommandErrorType.InvalidArgument]: 'You provided an invalid argument.',
}
