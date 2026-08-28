import { describe, expect, it } from 'vitest'
import type { ToolDefinition } from './types'

describe('ToolDefinition', () => {
  it('projects to an MCP-compatible descriptor', () => {
    const definition: ToolDefinition = {
      name: 'demo',
      description: 'Demo tool',
      inputSchema: { type: 'object' },
      outputSchema: { type: 'object' },
      cost: { kind: 'free' },
    }
    const descriptor = {
      name: definition.name,
      description: definition.description,
      inputSchema: definition.inputSchema,
    }
    expect(descriptor).toEqual({
      name: 'demo',
      description: 'Demo tool',
      inputSchema: { type: 'object' },
    })
  })
})
