import { defineSyscall } from '../../agent-os/tools/define'

export interface KnowledgeDriveReadInput {
  sub: 'files.list' | 'files.get'
  fileId?: string
  mimeType?: string
  limit?: number
}

export interface KnowledgeDriveReadOutput {
  items: unknown[]
}

export interface KnowledgeDriveWriteInput {
  sub: 'files.create' | 'files.update'
  fileId?: string
  name: string
  content: string
  mimeType: string
}

export interface KnowledgeDriveWriteOutput {
  fileId: string
  url: string
}

export const knowledgeDriveReadSyscall = defineSyscall<KnowledgeDriveReadInput, KnowledgeDriveReadOutput>({
  name: 'knowledge.drive.read',
  description: 'List or retrieve files from Google Drive.',
  inputSchema: {
    type: 'object',
    required: ['sub'],
    properties: {
      sub: { type: 'string', enum: ['files.list', 'files.get'] },
      fileId: { type: 'string' },
      mimeType: { type: 'string' },
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

export const knowledgeDriveWriteSyscall = defineSyscall<KnowledgeDriveWriteInput, KnowledgeDriveWriteOutput>({
  name: 'knowledge.drive.write',
  description: 'Create or update a file in Google Drive.',
  inputSchema: {
    type: 'object',
    required: ['sub', 'name', 'content', 'mimeType'],
    properties: {
      sub: { type: 'string', enum: ['files.create', 'files.update'] },
      fileId: { type: 'string' },
      name: { type: 'string' },
      content: { type: 'string' },
      mimeType: { type: 'string' },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['fileId', 'url'],
    properties: {
      fileId: { type: 'string' },
      url: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { fileId: '', url: '' }
  },
})
