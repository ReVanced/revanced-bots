import { readdirSync, writeFileSync } from 'fs'
import { join, relative } from 'path'

export const listAllFilesRecursive = (dir: string): string[] =>
    readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter(x => x.isFile())
        .map(x => join(x.parentPath, x.name))

export const generateCommandsIndex = (dirPath: string) => generateIndexes(dirPath, x => !x.endsWith('types.ts'))

export const generateEventsIndex = (dirPath: string) => generateIndexes(dirPath)

const generateIndexes = async (dirPath: string, pathFilter?: (path: string) => boolean) => {
    const files = listAllFilesRecursive(dirPath)
        .filter(x => (x.endsWith('.ts') && !x.endsWith('index.ts') && pathFilter ? pathFilter(x) : true))
        .map(x => relative(dirPath, x))

    writeFileSync(
        join(dirPath, 'index.ts'),
        `// AUTO-GENERATED BY A SCRIPT, DON'T TOUCH\n\n${files.map(c => `import './${c.split('.').at(-2)}'`).join('\n')}`,
    )
}
