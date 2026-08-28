import { describe, it, expect } from 'vitest'
import { parallelExecutor } from './parallel'
import './transform' // register transform executor for branch steps
import { createFlowState } from '../state'

const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/parallel', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const state = createFlowState('run-1')
    const result = await parallelExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('merge=all: all branches run and outputs are collected', async () => {
    const state = createFlowState('run-1')
    const result = await parallelExecutor({
      id: 's',
      type: 'parallel',
      merge: 'all',
      branches: [
        { id: 'b1', type: 'transform', expression: 'one' },
        { id: 'b2', type: 'transform', expression: 'two' },
      ],
    }, ctx, state)
    expect(result.status).toBe('done')
    expect((result.outputs.branches as unknown[]).length).toBe(2)
  })

  it('merge=all: fails when any branch fails', async () => {
    const state = createFlowState('run-1')
    const result = await parallelExecutor({
      id: 's',
      type: 'parallel',
      merge: 'all',
      branches: [
        { id: 'b1', type: 'transform', expression: 'ok' },
        { id: 'b2', type: 'unknown_type_that_fails' }, // unregistered = fails
      ],
    }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('parallel_branch_failed')
  })

  it('merge=firstSuccess: returns first successful branch result', async () => {
    const state = createFlowState('run-1')
    const result = await parallelExecutor({
      id: 's',
      type: 'parallel',
      merge: 'firstSuccess',
      branches: [
        { id: 'b1', type: 'transform', expression: 'winner' },
        { id: 'b2', type: 'transform', expression: 'other' },
      ],
    }, ctx, state)
    expect(result.status).toBe('done')
  })

  it('returns done for empty branches', async () => {
    const state = createFlowState('run-1')
    const result = await parallelExecutor({
      id: 's',
      type: 'parallel',
      merge: 'all',
      branches: [],
    }, ctx, state)
    expect(result.status).toBe('done')
  })
})
