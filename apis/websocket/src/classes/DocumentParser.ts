import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

export interface DocumentParserOptions {
    maxChunkSize: number
    chunkOverlap: number
    timeout: number
}

export interface ParsedDocument {
    url: string
    title: string
    chunks: DocumentChunk[]
}

export interface DocumentChunk {
    content: string
    index: number
}

export class DocumentParser {
    constructor(private readonly options: DocumentParserOptions) {}

    async parseFromUrl(url: string): Promise<ParsedDocument> {
        const { content, contentType } = await this.fetchDocument(url)

        let parseableContent = ''
        let title = ''

        if (contentType.includes('text/html')) {
            const doc = new JSDOM(content, { url })
            const reader = new Readability(doc.window.document)
            const article = reader.parse()

            if (article) {
                title = article.title || ''
                const turndownService = new TurndownService({
                    headingStyle: 'atx',
                    codeBlockStyle: 'fenced',
                })
                parseableContent = turndownService.turndown(article.content || '')
            } else {
                title = doc.window.document.title || ''
                parseableContent = this.cleanText(doc.window.document.body.textContent || '')
            }
        } else {
            parseableContent = this.cleanText(content)
        }

        const chunks = await this.chunkContent(parseableContent)

        return { url, title, chunks }
    }

    private async chunkContent(text: string): Promise<DocumentChunk[]> {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: this.options.maxChunkSize,
            chunkOverlap: this.options.chunkOverlap,
        })

        const strings = await splitter.splitText(text)

        return strings.map((content, index) => ({
            content,
            index,
        }))
    }

    private async fetchDocument(url: string) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout)

        try {
            const response = await fetch(url, {
                headers: {
                    Accept: 'text/html,text/plain;q=0.9,*/*;q=0.5',
                },
                signal: controller.signal,
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
            }

            return {
                content: await response.text(),
                contentType: (response.headers.get('content-type') || '').toLowerCase(),
            }
        } finally {
            clearTimeout(timeoutId)
        }
    }

    private cleanText(text: string): string {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim()
    }
}
