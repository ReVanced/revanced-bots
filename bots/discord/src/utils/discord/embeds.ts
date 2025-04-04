import { DefaultEmbedColor, ReVancedLogoURL } from '$/constants'
import { type APIEmbed, EmbedBuilder, type EmbedField, type JSONEncodable, type User } from 'discord.js'
import type { ConfigMessageScanResponseMessage } from '../../../config.schema'

export const createErrorEmbed = (title: string | null, description?: string) =>
    applyCommonEmbedStyles(
        new EmbedBuilder()
            .setTitle(title)
            .setDescription(description ?? null)
            .setAuthor({ name: 'Error' })
            .setColor('Red'),
    )

export const createStackTraceEmbed = (stack: unknown) =>
    // biome-ignore lint/style/useTemplate: shut
    createErrorEmbed('An exception was thrown', '```js\n' + stack + '```')

export const createSuccessEmbed = (title: string | null, description?: string) =>
    applyCommonEmbedStyles(
        new EmbedBuilder()
            .setTitle(title)
            .setDescription(description ?? null)
            .setColor('Green'),
    )

export const createMessageScanResponseEmbed = (
    response: NonNullable<ConfigMessageScanResponseMessage['embeds']>[number],
) => applyCommonEmbedStyles(response, true, true, true)

export const createModerationActionEmbed = (
    action: string,
    user: User,
    moderator: User,
    reason?: string,
    expires?: number | null,
    extraFields?: EmbedField[][],
) => {
    const fields: EmbedField[] = []
    if (extraFields?.[0]) fields.push(...extraFields[0])
    if (reason) fields.push({ name: 'Reason', value: reason, inline: true })
    if (Number.isInteger(expires) || expires === null)
        fields.push({
            name: 'Expires',
            value: Number.isInteger(expires) ? `<t:${expires}:F>` : 'Never',
            inline: true,
        })
    if (extraFields?.[1]) fields.push(...extraFields[1])

    const embed = new EmbedBuilder()
        .setTitle(`${action} ${user.tag}`)
        .setDescription(`${user.toString()} was ${action.toLowerCase()} by ${moderator.toString()}`)
        .addFields(fields)
        .setThumbnail(user.displayAvatarURL({ forceStatic: true }))

    return applyCommonEmbedStyles(embed, true, true, true)
}

export const applyReferenceToModerationActionEmbed = (embed: EmbedBuilder, reference: string) => {
    embed.addFields({ name: 'Reference', value: `[Jump to message](${reference})`, inline: true })
    return embed
}

export const applyCommonEmbedStyles = (
    embed: EmbedBuilder | JSONEncodable<APIEmbed> | APIEmbed,
    setThumbnail = false,
    setFooter = false,
    setColor = false,
) => {
    // biome-ignore lint/style/noParameterAssign: While this is confusing, it is fine for this purpose
    if ('toJSON' in embed) embed = embed.toJSON()
    const builder = new EmbedBuilder(embed)

    if (setFooter)
        builder.setFooter({
            text: 'ReVanced',
            iconURL: ReVancedLogoURL,
        })

    if (setColor) builder.setColor(DefaultEmbedColor)
    if (setThumbnail) builder.setThumbnail(ReVancedLogoURL)

    return builder
}
