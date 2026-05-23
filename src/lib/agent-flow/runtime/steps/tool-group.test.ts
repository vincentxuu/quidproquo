import { describe, it, expect } from 'vitest'
import { toolGroupExecutor } from './tool-group'
import { createFlowState } from '../state'

const state = createFlowState('run-1')
const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/tool-group', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const result = await toolGroupExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('returns stubbed=true when no kernel is present', async () => {
    const result = await toolGroupExecutor(
      { id: 's', type: 'tool_group', tools: ['search.web', 'read.url'] },
      ctx,
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.stubbed).toBe(true)
    expect(result.outputs.tools).toEqual(['search.web', 'read.url'])
  })

  it('calls kernel syscall sequentially by default', async () => {
    const calls: string[] = []
    const kernel = { syscall: async (name: string) => { calls.push(name); return `result-${name}` } }
    const result = await toolGroupExecutor(
      { id: 's', type: 'tool_group', tools: ['a', 'b'], parallel: false },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('done')
    expect(calls).toEqual(['a', 'b'])
    expect(result.outputs.a).toBe('result-a')
    expect(result.outputs.b).toBe('result-b')
  })

  it('calls kernel syscall in parallel when parallel=true', async () => {
    const kernel = { syscall: async (name: string) => `r-${name}` }
    const result = await toolGroupExecutor(
      { id: 's', type: 'tool_group', tools: ['x', 'y'], parallel: true },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.x).toBe('r-x')
    expect(result.outputs.y).toBe('r-y')
  })

  it('returns tool_call_failed when kernel syscall throws', async () => {
    const kernel = { syscall: async () => { throw new Error('unavailable') } }
    const result = await toolGroupExecutor(
      { id: 's', type: 'tool_group', tools: ['failing-tool'] },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('tool_call_failed')
  })
})
