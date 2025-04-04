import { readdirSync, writeFileSync } from 'fs'
import { join, sep as pathSep, relative } from 'path'
import { sep as posixPathSep } from 'path/posix'

export const listAllFilesRecursive = (dir: string): string[] =>
    readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter(x => x.isFile())
        .map(x => join(x.parentPath, x.name).replaceAll(pathSep, posixPathSep))

export const generateCommandsIndex = (dirPath: string) =>
    generateIndexes(dirPath, (x, i) => `export { default as C${i} } from './${x}'`)

export const generateEventsIndex = (dirPath: string) => generateIndexes(dirPath)

const generateIndexes = async (
    dirPath: string,
    customMap?: (path: string, index: number) => string,
    pathFilter?: (path: string) => boolean,
) => {
    const files = listAllFilesRecursive(dirPath)
        .filter(x => x.endsWith('.ts') && !x.endsWith('index.ts') && (pathFilter ? pathFilter(x) : true))
        .map(x => relative(dirPath, x).replaceAll(pathSep, posixPathSep))

    writeFileSync(
        join(dirPath, 'index.ts'),
        `// AUTO-GENERATED BY A SCRIPT, DON'T TOUCH\n\n${files
            .map((c, i) => {
                const path = c.split('.').at(-2)!
                return customMap ? customMap(path, i) : `import './${path}'`
            })
            .join('\n')}`,
    )
}
