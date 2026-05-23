import { defineSyscall } from '../../agent-os/tools/define'

export interface KnowledgeSqlReadInput {
  connectionId: string
  query: string
  params?: unknown[]
}

export interface KnowledgeSqlReadOutput {
  rows: unknown[]
  rowCount: number
}

export interface KnowledgeSqlWriteInput {
  connectionId: string
  query: string
  params?: unknown[]
}

export interface KnowledgeSqlWriteOutput {
  rowsAffected: number
}

export const knowledgeSqlReadSyscall = defineSyscall<KnowledgeSqlReadInput, KnowledgeSqlReadOutput>({
  name: 'knowledge.sql.read',
  description: 'Execute a SELECT query against a configured SQL connection.',
  inputSchema: {
    type: 'object',
    required: ['connectionId', 'query'],
    properties: {
      connectionId: { type: 'string' },
      query: { type: 'string' },
      params: { type: 'array', items: {} },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['rows', 'rowCount'],
    properties: {
      rows: { type: 'array', items: {} },
      rowCount: { type: 'number' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: false,
  async handler(_ctx, input) {
    if (!/^\s*SELECT/i.test(input.query)) {
      throw new Error('knowledge.sql.read only allows SELECT queries')
    }
    return { rows: [], rowCount: 0 }
  },
})

export const knowledgeSqlWriteSyscall = defineSyscall<KnowledgeSqlWriteInput, KnowledgeSqlWriteOutput>({
  name: 'knowledge.sql.write',
  description: 'Execute an INSERT, UPDATE, or DELETE query against a configured SQL connection.',
  inputSchema: {
    type: 'object',
    required: ['connectionId', 'query'],
    properties: {
      connectionId: { type: 'string' },
      query: { type: 'string' },
      params: { type: 'array', items: {} },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['rowsAffected'],
    properties: {
      rowsAffected: { type: 'number' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  async handler(_ctx, _input) {
    return { rowsAffected: 0 }
  },
})
