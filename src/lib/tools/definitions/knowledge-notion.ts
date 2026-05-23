import { defineSyscall } from '../../agent-os/tools/define'

export interface KnowledgeNotionReadInput {
  query?: string
  pageId?: string
  databaseId?: string
  limit?: number
}

export interface KnowledgeNotionReadOutput {
  items: Array<{ id: string; title: string; content: string; url: string }>
}

export interface KnowledgeNotionWriteInput {
  pageId?: string
  parentId?: string
  title: string
  blocks: unknown[]
}

export interface KnowledgeNotionWriteOutput {
  pageId: string
  url: string
}

export const knowledgeNotionReadSyscall = defineSyscall<KnowledgeNotionReadInput, KnowledgeNotionReadOutput>({
  name: 'knowledge.notion.read',
  description: 'Read pages or database entries from Notion.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      pageId: { type: 'string' },
      databaseId: { type: 'string' },
      limit: { type: 'number', default: 10 },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'title', 'content', 'url'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            url: { type: 'string' },
          },
        },
      },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: false,
  async handler(_ctx, _input) {
    return { items: [] }
  },
})

export const knowledgeNotionWriteSyscall = defineSyscall<KnowledgeNotionWriteInput, KnowledgeNotionWriteOutput>({
  name: 'knowledge.notion.write',
  description: 'Create or update a Notion page with the given blocks.',
  inputSchema: {
    type: 'object',
    required: ['title', 'blocks'],
    properties: {
      pageId: { type: 'string' },
      parentId: { type: 'string' },
      title: { type: 'string' },
      blocks: { type: 'array', items: {} },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['pageId', 'url'],
    properties: {
      pageId: { type: 'string' },
      url: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { pageId: '', url: '' }
  },
})
