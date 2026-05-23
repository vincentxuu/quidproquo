import { describe, it, expect } from 'vitest'
import { agentStepExecutor } from './agent'
import { createFlowState } from '../state'

const state = createFlowState('run-1')
const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/agent', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const result = await agentStepExecutor({ id: 's', type: 'transform' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('returns stubbed=true when no kernel is present', async () => {
    const result = await agentStepExecutor({ id: 's', type: 'agent', agentId: 'planner' }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.stubbed).toBe(true)
  })

  it('dispatches via kernel scheduler when available', async () => {
    let dispatched: unknown
    const kernel = {
      scheduler: {
        dispatch: async (opts: unknown) => { dispatched = opts; return { runId: 'sub-run-1' } },
      },
    }
    const result = await agentStepExecutor(
      { id: 's', type: 'agent', agentId: 'writer' },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('done')
    expect((dispatched as Record<string, unknown>).agentId).toBe('writer')
  })

  it('returns agent_dispatch_failed when kernel dispatch throws', async () => {
    const kernel = {
      scheduler: {
        dispatch: async () => { throw new Error('queue full') },
      },
    }
    const result = await agentStepExecutor(
      { id: 's', type: 'agent', agentId: 'critic' },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('agent_dispatch_failed')
  })
})
