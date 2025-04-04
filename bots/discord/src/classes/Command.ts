import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js'
import { isAdmin } from '../utils/discord/permissions'

import CommandError, { CommandErrorType } from './CommandError'

import type {
    APIApplicationCommandChannelOption,
    CacheType,
    Channel,
    ChatInputCommandInteraction,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
    Message,
    MessageContextMenuCommandInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Role,
    User,
    UserContextMenuCommandInteraction,
    UserResolvable,
} from 'discord.js'
import { config } from '../context'

export enum CommandType {
    ChatGlobal = 1,
    ChatGuild,
    ContextMenuUser,
    ContextMenuMessage,
    ContextMenuGuildMessage,
    ContextMenuGuildMember,
}

export default class Command<
    const Type extends CommandType = CommandType.ChatGuild,
    const Options extends If<IsContextMenu<Type>, undefined, CommandOptionsOptions | undefined> = undefined,
    const AllowMessageCommand extends If<IsContextMenu<Type>, false, boolean> = false,
> {
    name: string
    description: string
    requirements?: CommandRequirements
    options?: Options
    type: Type
    allowMessageCommand: AllowMessageCommand
    #execute: CommandExecuteFunction<Type, Options, AllowMessageCommand>

    static OptionType = ApplicationCommandOptionType
    static Type = CommandType

    constructor({
        name,
        description,
        requirements,
        options,
        type,
        allowMessageCommand,
        execute,
    }: CommandOptions<Type, Options, AllowMessageCommand>) {
        this.name = name
        this.description = description!
        this.requirements = requirements
        this.options = options
        // @ts-expect-error: Default is `CommandType.GuildOnly`, it makes sense
        this.type = type ?? CommandType.ChatGuild
        // @ts-expect-error: Default is `false`, it makes sense
        this.allowMessageCommand = allowMessageCommand ?? false
        this.#execute = execute
    }

    isGuildSpecific(): this is Command<
        CommandType.ChatGuild | CommandType.ContextMenuGuildMember | CommandType.ContextMenuGuildMessage,
        Options,
        AllowMessageCommand
    > {
        return [
            CommandType.ChatGuild,
            CommandType.ContextMenuGuildMessage,
            CommandType.ContextMenuGuildMember,
        ].includes(this.type)
    }

    isContextMenuSpecific(): this is Command<
        | CommandType.ContextMenuGuildMessage
        | CommandType.ContextMenuGuildMember
        | CommandType.ContextMenuUser
        | CommandType.ContextMenuMessage,
        undefined,
        false
    > {
        return [
            CommandType.ContextMenuMessage,
            CommandType.ContextMenuUser,
            CommandType.ContextMenuGuildMessage,
            CommandType.ContextMenuGuildMember,
        ].includes(this.type)
    }

    isGuildContextMenuSpecific(): this is Command<
        CommandType.ContextMenuGuildMessage | CommandType.ContextMenuGuildMember,
        undefined,
        false
    > {
        return [CommandType.ContextMenuGuildMessage, CommandType.ContextMenuGuildMember].includes(this.type)
    }

    async onContextMenuInteraction(
        context: typeof import('../context'),
        interaction: If<
            Extends<Type, CommandType.ContextMenuGuildMessage>,
            MessageContextMenuCommandInteraction<ToCacheType<Type>>,
            UserContextMenuCommandInteraction<ToCacheType<Type>>
        >,
    ): Promise<unknown> {
        if (!this.isGuildSpecific() && !interaction.inGuild())
            throw new CommandError(CommandErrorType.InteractionNotInGuild)

        const executor = await this.#fetchInteractionExecutor(interaction)
        const target =
            this.type === CommandType.ContextMenuGuildMember
                ? this.isGuildSpecific()
                    ? fetchMember(interaction as CommandInteraction<'raw' | 'cached'>, interaction.targetId)
                    : interaction.client.users.fetch(interaction.targetId)
                : interaction.channel?.messages.fetch(interaction.targetId)

        if (!target) throw new CommandError(CommandErrorType.FetchManagerNotFound)

        // @ts-expect-error: Type mismatch (again!) because TypeScript is not smart enough
        return await this.#execute({ ...context, executor, target }, interaction, undefined)
    }

    async onMessage(
        context: typeof import('../context'),
        msg: Message<IsGuildSpecific<Type>>,
        args: CommandArguments,
    ): Promise<unknown> {
        if (!this.allowMessageCommand) return
        if (!this.isGuildSpecific() && !msg.guildId) throw new CommandError(CommandErrorType.InteractionNotInGuild)

        const executor = this.isGuildSpecific()
            ? await msg.guild?.members.fetch(msg.author)!
            : await msg.client.users.fetch(msg.author)
        if (!(await this.canExecute(executor))) throw new CommandError(CommandErrorType.RequirementsNotMet)

        const options = this.options
            ? ((await this.#resolveMessageOptions(msg, this.options, args)) as CommandExecuteFunctionOptionsParameter<
                  NonNullable<Options>
              >)
            : undefined

        // @ts-expect-error: Type mismatch (again!) because TypeScript is not smart enough
        return await this.#execute({ ...context, executor }, msg, options)
    }

    async #resolveMessageOptions(msg: Message, options: CommandOptionsOptions, args: CommandArguments) {
        const iterableOptions = Object.entries(options)
        const _options = {} as unknown

        for (let i = 0; i < iterableOptions.length; i++) {
            const [name, option] = iterableOptions[i]!
            const { type, required, description } = option
            const isSubcommandLikeOption =
                type === ApplicationCommandOptionType.Subcommand ||
                type === ApplicationCommandOptionType.SubcommandGroup

            const arg = args[i]

            const expectedType = `${ApplicationCommandOptionType[type]}${required ? '' : '?'}`
            const argExplainationString = `\n-# **${name}**: ${description}`
            const choicesString =
                'choices' in option && option.choices
                    ? `\n\n-# **AVAILABLE CHOICES**\n${option.choices.map(({ value }) => `- ${value}`).join('\n')}`
                    : ''

            if (isSubcommandLikeOption && !arg)
                throw new CommandError(
                    CommandErrorType.MissingArgument,
                    `Missing required subcommand.\n\n-# **AVAILABLE SUBCOMMANDS**\n${iterableOptions.map(([name, { description }]) => `- **${name}**: ${description}`).join('\n')}`,
                )

            if (required && !arg)
                throw new CommandError(
                    CommandErrorType.MissingArgument,
                    `Missing required argument **${name}** with type **${expectedType}**.${argExplainationString}${choicesString}`,
                )

            if (typeof arg === 'object' && arg.type !== type)
                throw new CommandError(
                    CommandErrorType.InvalidArgument,
                    `Invalid type for argument **${name}**.${argExplainationString}\n\nExpected type: **${expectedType}**\nGot type: **${ApplicationCommandOptionType[arg.type]}**${choicesString}`,
                )

            const argValue = typeof arg === 'string' ? arg : arg?.id

            if (
                'choices' in option &&
                option.choices &&
                !option.choices.some(({ value }) => value === (typeof value === 'number' ? Number(argValue) : argValue))
            )
                throw new CommandError(
                    CommandErrorType.InvalidArgument,
                    `Invalid choice for argument **${name}**.\n${argExplainationString}${choicesString}\n`,
                )

            if (argValue && arg) {
                if (isSubcommandLikeOption) {
                    const [subcommandName, subcommandOption] = iterableOptions.find(([name]) => name === argValue)!

                    // @ts-expect-error: Not smart enough, TypeScript :(
                    _options[subcommandName] = await this.#resolveMessageOptions(
                        msg,
                        (subcommandOption as CommandSubcommandLikeOption).options,
                        args.slice(i + 1),
                    )

                    break
                }

                if (
                    type === ApplicationCommandOptionType.String &&
                    ((typeof option.minLength === 'number' && argValue.length < option.minLength) ||
                        (typeof option.maxLength === 'number' && argValue.length > option.maxLength))
                )
                    throw new CommandError(
                        CommandErrorType.InvalidArgument,
                        `Invalid string length for argument **${name}**.\nLengths allowed: ${option.minLength ?? '(any)'} - ${option.maxLength ?? '(any)'}.${argExplainationString}`,
                    )

                if (
                    (type === ApplicationCommandOptionType.Channel ||
                        type === ApplicationCommandOptionType.User ||
                        type === ApplicationCommandOptionType.Role) &&
                    Number.isNaN(Number(argValue))
                )
                    throw new CommandError(
                        CommandErrorType.InvalidArgument,
                        `Malformed ID for argument **${name}**.${argExplainationString}`,
                    )

                if (type === ApplicationCommandOptionType.Number || type === ApplicationCommandOptionType.Integer) {
                    if (Number.isNaN(Number(argValue)))
                        throw new CommandError(
                            CommandErrorType.InvalidArgument,
                            `Invalid number for argument **${name}**.${argExplainationString}`,
                        )

                    if (
                        (typeof option.min === 'number' && Number(argValue) < option.min) ||
                        (typeof option.max === 'number' && Number(argValue) > option.max)
                    )
                        throw new CommandError(
                            CommandErrorType.InvalidArgument,
                            `Number out of range for argument **${name}**.\nRange allowed: ${option.min ?? '(any)'} - ${option.max ?? '(any)'}.${argExplainationString}`,
                        )
                }

                if (
                    type === ApplicationCommandOptionType.Boolean &&
                    !['true', 'false', 'yes', 'no', 'y', 'n', 't', 'f'].includes(argValue)
                )
                    throw new CommandError(
                        CommandErrorType.InvalidArgument,
                        `Invalid boolean for argument **${name}**.${argExplainationString}`,
                    )

                // @ts-expect-error: Not smart enough, TypeScript :(
                _options[name] =
                    type === ApplicationCommandOptionType.Number || type === ApplicationCommandOptionType.Integer
                        ? Number(argValue)
                        : type === ApplicationCommandOptionType.Boolean
                          ? ['t', 'y', 'yes', 'true'].some(value => value === argValue.toLowerCase())
                          : type === ApplicationCommandOptionType.Channel
                            ? await msg.client.channels.fetch(argValue)
                            : type === ApplicationCommandOptionType.User
                              ? await msg.client.users.fetch(argValue)
                              : type === ApplicationCommandOptionType.Role
                                ? await msg.guild?.roles.fetch(argValue)
                                : argValue
            }
        }

        return _options
    }

    #fetchInteractionExecutor(interaction: CommandInteraction) {
        return this.isGuildSpecific()
            ? fetchMember(interaction as CommandInteraction<'raw' | 'cached'>)
            : fetchUser(interaction)
    }

    async onInteraction(
        context: typeof import('../context'),
        interaction: ChatInputCommandInteraction,
    ): Promise<unknown> {
        if (interaction.commandName !== this.name)
            throw new CommandError(
                CommandErrorType.InteractionDataMismatch,
                'The interaction command name does not match the expected command name.',
            )

        if (!this.isGuildSpecific() && !interaction.inGuild())
            throw new CommandError(CommandErrorType.InteractionNotInGuild)

        const executor = await this.#fetchInteractionExecutor(interaction)
        if (!(await this.canExecute(executor))) throw new CommandError(CommandErrorType.RequirementsNotMet)

        const options = this.options
            ? ((await this.#resolveInteractionOptions(interaction)) as CommandExecuteFunctionOptionsParameter<
                  NonNullable<Options>
              >)
            : undefined

        if (options === null)
            throw new CommandError(
                CommandErrorType.InteractionDataMismatch,
                'The registered interaction command option type does not match the expected command option type.',
            )

        // @ts-expect-error: Type mismatch (again!) because TypeScript is not smart enough
        return await this.#execute({ ...context, executor }, interaction, options)
    }

    async #resolveInteractionOptions(
        interaction: ChatInputCommandInteraction,
        options: readonly CommandInteractionOption[] = interaction.options.data,
    ) {
        const _options = {} as unknown

        if (this.options)
            for (const { name, type, value } of options) {
                if (this.options[name]?.type !== type) return null

                if (
                    type === ApplicationCommandOptionType.Subcommand ||
                    type === ApplicationCommandOptionType.SubcommandGroup
                ) {
                    const subOptions = Object.entries((this.options[name] as CommandSubcommandLikeOption).options)

                    // @ts-expect-error: Not smart enough, TypeScript :(
                    _options[name] = await this.#resolveInteractionOptions(interaction, subOptions)

                    break
                }

                if (!value) continue

                // @ts-expect-error: Not smart enough, TypeScript :(
                _options[name] =
                    type === ApplicationCommandOptionType.Channel
                        ? await interaction.client.channels.fetch(value as string)
                        : type === ApplicationCommandOptionType.User
                          ? await interaction.client.users.fetch(value as string)
                          : type === ApplicationCommandOptionType.Role
                            ? await interaction.guild?.roles.fetch(value as string)
                            : value
            }

        return _options
    }

    async canExecute(executor: User | GuildMember): Promise<boolean> {
        if (!this.requirements) return false

        const isExecutorAdmin = isAdmin(executor)
        if (isExecutorAdmin) return true

        const {
            adminOnly,
            roles,
            permissions,
            users,
            mode = 'all',
            defaultCondition = 'fail',
            memberRequirementsForUsers = 'pass',
        } = this.requirements

        const member = this.isGuildSpecific() ? (executor as GuildMember) : null
        const boolDefaultCondition = defaultCondition !== 'fail'
        const boolMemberRequirementsForUsers = memberRequirementsForUsers !== 'fail'

        const conditions = [
            adminOnly ? isExecutorAdmin : boolDefaultCondition,
            users ? users.includes(executor.id) : boolDefaultCondition,
            member
                ? roles
                    ? roles.some(role => member.roles.cache.has(role))
                    : boolDefaultCondition
                : boolMemberRequirementsForUsers,
            member
                ? permissions
                    ? member.permissions.has(permissions)
                    : boolDefaultCondition
                : boolMemberRequirementsForUsers,
        ]

        if (mode === 'all' && conditions.some(condition => !condition)) return false
        if (mode === 'any' && conditions.every(condition => !condition)) return false

        return true
    }

    get json(): RESTPostAPIApplicationCommandsJSONBody {
        // @ts-expect-error: I hate union types in TypeScript
        const base: RESTPostAPIApplicationCommandsJSONBody = {
            name: this.name,
            type:
                this.type === CommandType.ContextMenuGuildMessage || this.type === CommandType.ContextMenuMessage
                    ? ApplicationCommandType.Message
                    : this.type === CommandType.ContextMenuGuildMember || this.type === CommandType.ContextMenuUser
                      ? ApplicationCommandType.User
                      : ApplicationCommandType.ChatInput,
        }

        if (this.isContextMenuSpecific()) return base

        return {
            ...base,
            description: this.description,
            options: this.options ? this.#transformOptions(this.options) : undefined,
            // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
            contexts: this.isGuildSpecific() ? [0] : [0, 1, 2],
        } as RESTPostAPIChatInputApplicationCommandsJSONBody & { contexts: Array<0 | 1 | 2> }
    }

    #transformOptions(optionsObject: Record<string, CommandOption>) {
        const options: RESTPostAPIChatInputApplicationCommandsJSONBody['options'] = []

        for (const [name, option] of Object.entries(optionsObject)) {
            options.push({
                // biome-ignore lint/suspicious/noExplicitAny: Good enough work here
                type: option.type as any,
                name,
                description: option.description,
                required: option.required,
                ...(option.type === ApplicationCommandOptionType.Subcommand ||
                option.type === ApplicationCommandOptionType.SubcommandGroup
                    ? {
                          options: this.#transformOptions((option as CommandSubcommandLikeOption).options),
                      }
                    : {}),
                ...(option.type === ApplicationCommandOptionType.Channel ? { channel_types: option.types } : {}),
                ...(option.type === ApplicationCommandOptionType.Integer ||
                option.type === ApplicationCommandOptionType.Number
                    ? {
                          min_value: option.min,
                          max_value: option.max,
                          choices: option.choices,
                          autocomplete: option.autocomplete,
                      }
                    : {}),
                ...(option.type === ApplicationCommandOptionType.String
                    ? {
                          min_length: option.minLength,
                          max_length: option.maxLength,
                          choices: option.choices,
                          autocomplete: option.autocomplete,
                      }
                    : {}),
            })
        }

        return options
    }
}

export class ModerationCommand<
    Options extends CommandOptionsOptions,
    AllowMessageCommand extends boolean = true,
> extends Command<CommandType.ChatGuild, Options, AllowMessageCommand> {
    constructor(options: ExtendedCommandOptions<CommandType.ChatGuild, Options, AllowMessageCommand>) {
        super({
            ...options,
            requirements: {
                ...options.requirements,
                defaultCondition: 'pass',
                roles: (config.moderation?.roles ?? []).concat(options.requirements?.roles ?? []),
            },
            // @ts-expect-error: No thanks
            allowMessageCommand: options.allowMessageCommand ?? true,
            type: CommandType.ChatGuild,
        })
    }
}

export class AdminCommand<
    Options extends CommandOptionsOptions,
    AllowMessageCommand extends boolean = true,
> extends Command<CommandType.ChatGlobal, Options, AllowMessageCommand> {
    constructor(options: ExtendedCommandOptions<CommandType.ChatGlobal, Options, AllowMessageCommand>) {
        super({
            ...options,
            requirements: {
                ...options.requirements,
                adminOnly: true,
                defaultCondition: 'pass',
            },
            allowMessageCommand: options.allowMessageCommand ?? (true as AllowMessageCommand),
            type: CommandType.ChatGlobal,
        })
    }
}

const fetchMember = async (
    interaction: CommandInteraction<'raw' | 'cached'>,
    source: UserResolvable = interaction.user,
    manager = interaction.guild?.members,
) => {
    const _manager = manager ?? (await interaction.client.guilds.fetch(interaction.guildId).then(it => it.members))
    if (!_manager) throw new CommandError(CommandErrorType.FetchManagerNotFound, 'Cannot fetch member.')
    return await _manager.fetch(source)
}

const fetchUser = (interaction: CommandInteraction, source: UserResolvable = interaction.user) => {
    return interaction.client.users.fetch(source)
}

/* TODO: 
    APIApplicationCommandAttachmentOption
    APIApplicationCommandMentionableOption
    APIApplicationCommandRoleOption
*/

export type CommandOptions<
    Type extends CommandType,
    Options extends CommandOptionsOptions | undefined,
    AllowMessageCommand extends boolean,
> = {
    name: string
    requirements?: CommandRequirements
    options?: Options
    execute: CommandExecuteFunction<Type, Options, AllowMessageCommand>
    type?: Type
    allowMessageCommand?: AllowMessageCommand
} & If<IsContextMenu<Type>, { description?: never }, { description: string }>

export type CommandArguments = Array<string | CommandSpecialArgument>
export type CommandSpecialArgument = {
    type: (typeof CommandSpecialArgumentType)[keyof typeof CommandSpecialArgumentType]
    id: string
}

//! If things ever get minified, this will most likely break property access via string names
export const CommandSpecialArgumentType = {
    Channel: ApplicationCommandOptionType.Channel,
    Role: ApplicationCommandOptionType.Role,
    User: ApplicationCommandOptionType.User,
}

type ExtendedCommandOptions<
    Type extends CommandType,
    Options extends CommandOptionsOptions,
    AllowMessageCommand extends boolean,
> = Omit<CommandOptions<Type, Options, AllowMessageCommand>, 'type'> & {
    requirements?: Omit<CommandOptions<Type, Options, AllowMessageCommand>['requirements'], 'defaultCondition'>
}

export type CommandOptionsOptions = Record<string, CommandOption>

type ToCacheType<Type extends CommandType> = If<IsGuildSpecific<Type>, 'raw' | 'cached', CacheType>

type CommandExecuteFunction<
    Type extends CommandType,
    Options extends CommandOptionsOptions | undefined,
    AllowMessageCommand extends boolean,
> = (
    context: CommandContext<Type>,
    trigger: If<
        AllowMessageCommand,
        Message<IsGuildSpecific<Type>> | CommandTypeToInteractionMap<ToCacheType<Type>>[Type],
        CommandTypeToInteractionMap<ToCacheType<Type>>[Type]
    >,
    options: Options extends CommandOptionsOptions ? CommandExecuteFunctionOptionsParameter<Options> : never,
) => Promise<unknown> | unknown

type CommandTypeToInteractionMap<CT extends CacheType> = {
    [CommandType.ChatGlobal]: ChatInputCommandInteraction<CT>
    [CommandType.ChatGuild]: ChatInputCommandInteraction<CT>
    [CommandType.ContextMenuUser]: UserContextMenuCommandInteraction<CT>
    [CommandType.ContextMenuMessage]: MessageContextMenuCommandInteraction<CT>
    [CommandType.ContextMenuGuildMessage]: MessageContextMenuCommandInteraction<CT>
    [CommandType.ContextMenuGuildMember]: MessageContextMenuCommandInteraction<CT>
}

type IsContextMenu<Type extends CommandType> = Extends<
    Type,
    | CommandType.ContextMenuGuildMessage
    | CommandType.ContextMenuGuildMember
    | CommandType.ContextMenuMessage
    | CommandType.ContextMenuUser
>

type IsGuildSpecific<Type extends CommandType> = Extends<
    Type,
    CommandType.ChatGuild | CommandType.ContextMenuGuildMember | CommandType.ContextMenuGuildMessage
>

type Extends<T, U> = T extends U ? true : false
type If<T extends boolean | undefined, U, V> = T extends true ? U : V
// type InvertBoolean<T extends boolean> = If<T, false, true>

type CommandExecuteFunctionOptionsParameter<Options extends CommandOptionsOptions> = {
    [K in keyof Options]: Options[K]['type'] extends
        | ApplicationCommandOptionType.Subcommand
        | ApplicationCommandOptionType.SubcommandGroup
        ? // @ts-expect-error: Shut up, it works
          CommandExecuteFunctionOptionsParameter<Options[K]['options']> | undefined
        : If<
              Options[K]['required'],
              CommandOptionValueMap[Options[K]['type']],
              CommandOptionValueMap[Options[K]['type']] | undefined
          >
}

type CommandContext<Type extends CommandType> = typeof import('../context') & {
    executor: CommandExecutor<Type>
    target: If<
        Extends<Type, CommandType.ContextMenuGuildMember>,
        GuildMember,
        If<Extends<Type, CommandType.ContextMenuGuildMessage>, Message<true>, never>
    >
}

type CommandOptionValueMap = {
    [ApplicationCommandOptionType.Boolean]: boolean
    [ApplicationCommandOptionType.Channel]: Channel
    [ApplicationCommandOptionType.Integer]: number
    [ApplicationCommandOptionType.Number]: number
    [ApplicationCommandOptionType.String]: string
    [ApplicationCommandOptionType.User]: User
    [ApplicationCommandOptionType.Role]: Role
    [ApplicationCommandOptionType.Subcommand]: never
    [ApplicationCommandOptionType.SubcommandGroup]: never
}

type CommandOption =
    | CommandBooleanOption
    | CommandChannelOption
    | CommandIntegerOption
    | CommandNumberOption
    | CommandStringOption
    | CommandUserOption
    | CommandRoleOption
    | CommandSubcommandOption
    | CommandSubcommandGroupOption

type CommandExecutor<Type extends CommandType> = If<IsGuildSpecific<Type>, GuildMember, User>

type CommandOptionBase<Type extends ApplicationCommandOptionType> = {
    type: Type
    description: string
    required?: boolean
}

type CommandBooleanOption = CommandOptionBase<ApplicationCommandOptionType.Boolean>

type CommandChannelOption = CommandOptionBase<ApplicationCommandOptionType.Channel> & {
    types: APIApplicationCommandChannelOption['channel_types']
}

interface CommandOptionChoice<ValueType = number | string> {
    name: string
    value: ValueType
}

type CommandOptionWithAutocompleteOrChoicesWrapper<
    Base extends CommandOptionBase<ApplicationCommandOptionType>,
    ChoiceType extends CommandOptionChoice,
> =
    | (Base & {
          autocomplete: true
          choices?: never
      })
    | (Base & {
          autocomplete?: false
          choices?: ChoiceType[] | readonly ChoiceType[]
      })

type CommandIntegerOption = CommandOptionWithAutocompleteOrChoicesWrapper<
    CommandOptionBase<ApplicationCommandOptionType.Integer>,
    CommandOptionChoice<number>
> & {
    min?: number
    max?: number
}

type CommandNumberOption = CommandOptionWithAutocompleteOrChoicesWrapper<
    CommandOptionBase<ApplicationCommandOptionType.Number>,
    CommandOptionChoice<number>
> & {
    min?: number
    max?: number
}

type CommandStringOption = CommandOptionWithAutocompleteOrChoicesWrapper<
    CommandOptionBase<ApplicationCommandOptionType.String>,
    CommandOptionChoice<string>
> & {
    minLength?: number
    maxLength?: number
}

type CommandUserOption = CommandOptionBase<ApplicationCommandOptionType.User>

type CommandRoleOption = CommandOptionBase<ApplicationCommandOptionType.Role>

type SubcommandLikeApplicationCommandOptionType =
    | ApplicationCommandOptionType.Subcommand
    | ApplicationCommandOptionType.SubcommandGroup

interface CommandSubcommandLikeOption<
    Type extends SubcommandLikeApplicationCommandOptionType = SubcommandLikeApplicationCommandOptionType,
> extends CommandOptionBase<Type> {
    options: CommandOptionsOptions
    required?: never
}

type CommandSubcommandOption = CommandSubcommandLikeOption<ApplicationCommandOptionType.Subcommand>
type CommandSubcommandGroupOption = CommandSubcommandLikeOption<ApplicationCommandOptionType.SubcommandGroup>

export type CommandRequirements = {
    users?: string[]
    roles?: string[]
    permissions?: bigint
    adminOnly?: boolean
    defaultCondition?: 'fail' | 'pass'
    memberRequirementsForUsers?: 'fail' | 'pass'
    mode?: 'all' | 'any'
}
