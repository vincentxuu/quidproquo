import { describe, it, expect } from 'vitest'
import { loopExecutor } from './loop'
import './transform' // register transform executor for body steps
import { createFlowState } from '../state'

const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/loop', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const state = createFlowState('run-1')
    const result = await loopExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('runs body steps for each iteration', async () => {
    const state = createFlowState('run-1')
    const result = await loopExecutor({
      id: 's',
      type: 'loop',
      maxIterations: 3,
      body: [{ id: 'inner', type: 'transform', expression: 'val' }],
    }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.count).toBe(3)
    expect((result.outputs.iterations as unknown[]).length).toBe(3)
  })

  it('returns done for empty body', async () => {
    const state = createFlowState('run-1')
    const result = await loopExecutor({
      id: 's',
      type: 'loop',
      maxIterations: 2,
      body: [],
    }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.count).toBe(2)
  })

  it('throws FlowLoopBoundsError when maxIterations exceeds cap', async () => {
    const state = createFlowState('run-1')
    await expect(loopExecutor({
      id: 's',
      type: 'loop',
      maxIterations: 200,
      body: [],
    }, ctx, state)).rejects.toThrow()
  })
})
