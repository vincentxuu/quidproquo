import { describe, it, expect } from 'vitest'
import { detectSubFlowCycles } from './cycle-check'
import type { FlowDefinition } from './ast'

function makeDef(id: string, subFlowIds: string[] = []): FlowDefinition {
  return {
    id,
    name: id,
    version: 1,
    inputs: [],
    steps: subFlowIds.map((flowId, i) => ({ id: `step-${i}`, type: 'sub_flow', flowId })),
    edges: [],
  } as unknown as FlowDefinition
}

describe('dsl/cycle-check', () => {
  it('passes for a standalone flow with no sub-flows', () => {
    const def = makeDef('parent')
    expect(() => detectSubFlowCycles(def, new Map())).not.toThrow()
  })

  it('passes for a flow referencing a known sub-flow without a cycle', () => {
    const child = makeDef('child')
    const parent = makeDef('parent', ['child'])
    const registry = new Map([['child', child]])
    expect(() => detectSubFlowCycles(parent, registry)).not.toThrow()
  })

  it('throws FlowCycleError when a flow references itself directly', () => {
    const self = makeDef('self', ['self'])
    const registry = new Map([['self', self]])
    expect(() => detectSubFlowCycles(self, registry)).toThrow()
  })

  it('throws FlowCycleError on indirect A → B → A cycle', () => {
    const a = makeDef('a', ['b'])
    const b = makeDef('b', ['a'])
    const registry = new Map([['a', a], ['b', b]])
    expect(() => detectSubFlowCycles(a, registry)).toThrow()
  })

  it('passes for a linear A → B → C chain without cycles', () => {
    const c = makeDef('c')
    const b = makeDef('b', ['c'])
    const a = makeDef('a', ['b'])
    const registry = new Map([['a', a], ['b', b], ['c', c]])
    expect(() => detectSubFlowCycles(a, registry)).not.toThrow()
  })

  it('skips sub-flow steps that reference unknown flow ids', () => {
    const def = makeDef('parent', ['unknown-flow'])
    expect(() => detectSubFlowCycles(def, new Map())).not.toThrow()
  })
})
