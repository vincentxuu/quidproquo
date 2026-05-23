import { defineSyscall } from '../../agent-os/tools/define'

export interface ReadUrlInput {
  url: string
  maxBytes?: number
  timeoutMs?: number
  includeMetadata?: boolean
}

export interface ReadUrlOutput {
  markdown: string
  title?: string
  sourceUrl: string
  contentType?: string
  statusCode?: number
  fetchedAt: string
}

export const readUrlSyscall = defineSyscall<ReadUrlInput, ReadUrlOutput>({
  name: 'read.url',
  description: 'Fetch a URL and return its content as markdown. Actual cost is computed per provider in the handler.',
  inputSchema: {
    type: 'object',
    required: ['url'],
    properties: {
      url: { type: 'string', format: 'uri' },
      maxBytes: { type: 'number', default: 256000 },
      timeoutMs: { type: 'number', default: 15000 },
      includeMetadata: { type: 'boolean', default: true },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['markdown', 'sourceUrl', 'fetchedAt'],
    properties: {
      markdown: { type: 'string' },
      title: { type: 'string' },
      sourceUrl: { type: 'string' },
      contentType: { type: 'string' },
      statusCode: { type: 'number' },
      fetchedAt: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: false,
  async handler(_ctx, input) {
    const { url, maxBytes = 256000, timeoutMs = 15000 } = input
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { signal: controller.signal })
      const statusCode = response.status
      const contentType = response.headers.get('content-type') ?? undefined
      const text = await response.text()
      const truncated = text.slice(0, maxBytes)
      return {
        markdown: truncated,
        sourceUrl: url,
        contentType,
        statusCode,
        fetchedAt: new Date().toISOString(),
      }
    } finally {
      clearTimeout(timer)
    }
  },
})
