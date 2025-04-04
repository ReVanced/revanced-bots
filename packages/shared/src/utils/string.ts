/**
 * Uncapitalizes the first letter of a string
 * @param str The string to uncapitalize
 * @returns The uncapitalized string
 */
export function uncapitalize<T extends string>(str: T): Uncapitalize<T> {
    return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>
}
