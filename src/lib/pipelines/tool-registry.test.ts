// Audited for agent-pipelines-unify Phase 7 — no stale pipeline imports found
import { afterEach, describe, expect, it } from 'vitest'
import { clear, register } from '../tools/registry'
import { getToolDefinition, listTools, toolDefinitions, validateToolAllowlist } from './tool-registry'
import type { PipelineDefinition } from './types'

describe('pipeline tool registry adapter', () => {
  afterEach(() => clear())

  it('returns pipeline definitions plus default agent-os syscalls when central registry is empty', () => {
    expect(listTools().length).toBeGreaterThan(toolDefinitions.length)
    expect(getToolDefinition('search.external')).toMatchObject({
      id: 'search.external',
      kind: 'api',
      runtime: 'worker',
    })
    expect(getToolDefinition('post.get-detail')).toMatchObject({
      id: 'post.get-detail',
      kind: 'cloud_read',
      runtime: 'worker',
    })
  })

  it('adapts central registry definitions to the legacy pipeline shape', () => {
    register({
      name: 'test.tool',
      description: 'Central test tool',
      inputSchema: { type: 'object' },
      outputSchema: { type: 'object' },
      cost: { kind: 'free' },
      outboundDomains: ['example.com'],
    })

    expect(getToolDefinition('test.tool')).toEqual({
      id: 'test.tool',
      title: 'test.tool',
      kind: 'api',
      runtime: 'worker',
      description: 'Central test tool',
      requiresExternalAccess: true,
    })
    expect(listTools().some((tool) => tool.id === 'test.tool')).toBe(true)
  })

  it('validates allowlists against adapted central tools', () => {
    register({
      name: 'test.tool',
      description: 'Central test tool',
      inputSchema: { type: 'object' },
      cost: { kind: 'free' },
    })
    const definition: PipelineDefinition = {
      id: 'demo',
      title: 'Demo',
      description: 'Demo pipeline',
      category: 'ops',
      risk: 'low',
      inputs: [],
      tools: ['test.tool'],
      stages: [{ id: 'run', title: 'Run', kind: 'api', tool: 'test.tool' }],
      artifacts: [],
      guards: [],
      budget: { maxRetries: 0, maxRuntimeMs: 1000 },
      requiresAdmin: true,
      writesMarkdown: false,
      usesExternalResearch: false,
      runtime: 'worker',
    }

    expect(validateToolAllowlist(definition).every((result) => result.status === 'pass')).toBe(true)
  })
})
