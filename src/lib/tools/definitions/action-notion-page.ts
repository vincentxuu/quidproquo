import { defineSyscall } from '../../agent-os/tools/define'

export interface ActionNotionPageInput {
  parentDatabaseId?: string
  parentPageId?: string
  title: string
  blocks: unknown[]
}

export interface ActionNotionPageOutput {
  pageId: string
  url: string
}

export const actionNotionPageSyscall = defineSyscall<ActionNotionPageInput, ActionNotionPageOutput>({
  name: 'action.notion.create-page',
  description: 'Create a new Notion page inside a database or parent page.',
  inputSchema: {
    type: 'object',
    required: ['title', 'blocks'],
    properties: {
      parentDatabaseId: { type: 'string' },
      parentPageId: { type: 'string' },
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
