import { describe, it, expect } from 'vitest'
import { transformExecutor } from './transform'
import { createFlowState } from '../state'

const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/transform', () => {
  it('returns static string expression', async () => {
    const state = createFlowState('run-1')
    const result = await transformExecutor({ id: 'step-1', type: 'transform', expression: 'hello world' }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.result).toBe('hello world')
  })

  it('returns type_mismatch for wrong step type', async () => {
    const state = createFlowState('run-1')
    const result = await transformExecutor({ id: 'step-1', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('rejects unsafe expression operators', async () => {
    const state = createFlowState('run-1')
    await expect(
      transformExecutor({ id: 'step-1', type: 'transform', expression: { eval: 'malicious' } }, ctx, state)
    ).rejects.toThrow('Unsafe expression operator')
  })

  it('substitutes {{key}} template literals from state', async () => {
    const state = createFlowState('run-1')
    // setState stores data for a step; the transform reads getState(state, stepId)
    const { setState } = await import('../state')
    setState(state, 'step-1', { name: 'Alice' })
    const result = await transformExecutor(
      { id: 'step-1', type: 'transform', expression: 'Hello {{name}}' },
      ctx,
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.result).toBe('Hello Alice')
  })
})
