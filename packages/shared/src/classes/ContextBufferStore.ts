type Timer = ReturnType<typeof setTimeout>

/**
 * Represents a single user's context buffer
 */
interface UserContext {
    lines: string[]
    createdAt: number
    lastUpdated: number
    timer: Timer
}

/**
 * Options for configuring the ContextBufferStore
 */
export interface ContextBufferOptions {
    maxMessages: number
    ttlMs: number
}

/**
 * Stores and manages temporary context buffers for conversations
 * handles with forced TTL
 */
export class ContextBufferStore {
    private store = new Map<string, UserContext>()
    private readonly maxMessages: number
    private readonly ttlMs: number

    constructor(options: ContextBufferOptions) {
        this.maxMessages = options.maxMessages
        this.ttlMs = options.ttlMs
    }

    /**
     * Adds text to a specific user's context
     * resets the expiration timer for that user
     *
     * @returns The full accumulated text string for that user
     */
    add(channelId: string, userId: string, text: string): string {
        const key = `${channelId}:${userId}`
        let context = this.store.get(key)

        if (context) {
            clearTimeout(context.timer)
            context.lastUpdated = Date.now()
            context.timer = setTimeout(() => this.store.delete(key), this.ttlMs)
        } else {
            context = {
                lines: [],
                createdAt: Date.now(),
                lastUpdated: Date.now(),
                timer: setTimeout(() => this.store.delete(key), this.ttlMs),
            }
            this.store.set(key, context)
        }

        context.lines.push(text)

        if (context.lines.length > this.maxMessages) {
            context.lines.shift()
        }

        return context.lines.join(' ')
    }

    /**
     * Get the current buffer for a user in a channel
     */
    get(channelId: string, userId: string): string | undefined {
        return this.store.get(`${channelId}:${userId}`)?.lines.join(' ')
    }

    /**
     * Removes a specific user's context
     */
    clear(channelId: string, userId: string): void {
        const key = `${channelId}:${userId}`
        const context = this.store.get(key)

        if (context) {
            clearTimeout(context.timer)
            this.store.delete(key)
        }
    }

    /**
     * Clears all contexts and stops all timers
     */
    dispose(): void {
        for (const context of this.store.values()) {
            clearTimeout(context.timer)
        }
        this.store.clear()
    }

    /**
     * Gets the number of active conversation threads
     */
    get size(): number {
        return this.store.size
    }

    /**
     * Returns a snapshot of active contexts
     */
    getSnapshot() {
        const now = Date.now()
        return Array.from(this.store.entries()).map(([key, ctx]) => {
            const [channelId, userId] = key.split(':')
            return {
                key,
                channelId,
                userId,
                startTime: ctx.createdAt,
                lineCount: ctx.lines.length,
                lastActive: ctx.lastUpdated,
                ageMs: now - ctx.createdAt,
            }
        })
    }
}
