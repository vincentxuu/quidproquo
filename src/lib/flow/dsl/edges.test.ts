import { describe, it, expect } from 'vitest'
import { validateEdges } from './edges'
import type { FlowDefinition } from './ast'

function makeDef(stepIds: string[], edges: { from: string; to: string }[] = []): FlowDefinition {
  return {
    id: 'test',
    name: 'Test',
    version: 1,
    inputs: [],
    steps: stepIds.map(id => ({ id, type: 'agent' })),
    edges,
  } as unknown as FlowDefinition
}

describe('dsl/edges', () => {
  it('returns empty array for a flow with no edges', () => {
    const def = makeDef(['a', 'b'])
    expect(validateEdges(def)).toEqual([])
  })

  it('validates a single valid edge', () => {
    const def = makeDef(['a', 'b'], [{ from: 'a', to: 'b' }])
    const result = validateEdges(def)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ from: 'a', to: 'b' })
  })

  it('validates multiple valid edges', () => {
    const def = makeDef(['a', 'b', 'c'], [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }])
    const result = validateEdges(def)
    expect(result).toHaveLength(2)
    expect(result.map(e => `${e.from}->${e.to}`)).toEqual(['a->b', 'b->c'])
  })

  it('throws for an edge referencing an unknown from-step', () => {
    const def = makeDef(['a', 'b'], [{ from: 'unknown', to: 'b' }])
    expect(() => validateEdges(def)).toThrow()
  })

  it('throws for an edge referencing an unknown to-step', () => {
    const def = makeDef(['a', 'b'], [{ from: 'a', to: 'unknown' }])
    expect(() => validateEdges(def)).toThrow()
  })

  it('handles a flow with no edges field gracefully', () => {
    const def = { id: 'test', name: 'Test', version: 1, inputs: [], steps: [{ id: 'a', type: 'agent' }] } as unknown as FlowDefinition
    expect(() => validateEdges(def)).not.toThrow()
  })
})
