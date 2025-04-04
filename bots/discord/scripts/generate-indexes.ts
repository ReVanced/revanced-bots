import { join } from 'path'
import { generateCommandsIndex, generateEventsIndex } from '../src/utils/fs'

await generateCommandsIndex(join(import.meta.dir, '../src/commands'))
await generateEventsIndex(join(import.meta.dir, '../src/events/discord'))
await generateEventsIndex(join(import.meta.dir, '../src/events/api'))
