import { defineSyscall } from '../../agent-os/tools/define'

export interface KnowledgeGithubReadInput {
  sub: 'repo.contents' | 'repo.issues' | 'repo.pulls' | 'search.code'
  owner: string
  repo: string
  path?: string
  query?: string
  limit?: number
}

export interface KnowledgeGithubReadOutput {
  items: unknown[]
}

export interface KnowledgeGithubWriteInput {
  sub: 'repo.contents.put'
  owner: string
  repo: string
  path: string
  content: string
  message: string
  sha?: string
}

export interface KnowledgeGithubWriteOutput {
  url: string
  sha: string
}

export const knowledgeGithubReadSyscall = defineSyscall<KnowledgeGithubReadInput, KnowledgeGithubReadOutput>({
  name: 'knowledge.github.read',
  description: 'Read repository contents, issues, pull requests, or search code on GitHub.',
  inputSchema: {
    type: 'object',
    required: ['sub', 'owner', 'repo'],
    properties: {
      sub: {
        type: 'string',
        enum: ['repo.contents', 'repo.issues', 'repo.pulls', 'search.code'],
      },
      owner: { type: 'string' },
      repo: { type: 'string' },
      path: { type: 'string' },
      query: { type: 'string' },
      limit: { type: 'number', default: 10 },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['items'],
    properties: {
      items: { type: 'array', items: {} },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: false,
  async handler(_ctx, _input) {
    return { items: [] }
  },
})

export const knowledgeGithubWriteSyscall = defineSyscall<KnowledgeGithubWriteInput, KnowledgeGithubWriteOutput>({
  name: 'knowledge.github.write',
  description: 'Create or update a file in a GitHub repository.',
  inputSchema: {
    type: 'object',
    required: ['sub', 'owner', 'repo', 'path', 'content', 'message'],
    properties: {
      sub: { type: 'string', enum: ['repo.contents.put'] },
      owner: { type: 'string' },
      repo: { type: 'string' },
      path: { type: 'string' },
      content: { type: 'string' },
      message: { type: 'string' },
      sha: { type: 'string' },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['url', 'sha'],
    properties: {
      url: { type: 'string' },
      sha: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { url: '', sha: '' }
  },
})
