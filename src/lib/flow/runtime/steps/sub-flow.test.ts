import { describe, it, expect } from 'vitest'
import { subFlowExecutor } from './sub-flow'
import { createFlowState } from '../state'

const state = createFlowState('run-1')
const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/sub-flow', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const result = await subFlowExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('returns sub_flow_missing_flow_id when flowId is absent', async () => {
    const result = await subFlowExecutor({ id: 's', type: 'sub_flow' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('sub_flow_missing_flow_id')
  })

  it('returns done with subFlowId when flowId is valid (stub path)', async () => {
    const result = await subFlowExecutor(
      { id: 's', type: 'sub_flow', flowId: 'child-flow' },
      ctx,
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.subFlowId).toBe('child-flow')
  })

  it('throws FlowCycleError when a sub-flow targets itself', async () => {
    await expect(
      subFlowExecutor(
        { id: 's', type: 'sub_flow', flowId: 'self-flow' },
        { ...ctx, flowId: 'self-flow' } as unknown as typeof ctx,
        state,
      )
    ).rejects.toThrow()
  })

  it('throws FlowCycleError when max sub-flow depth is exceeded', async () => {
    const deepCtx = { ...ctx, depth: 99 }
    await expect(
      subFlowExecutor(
        { id: 's', type: 'sub_flow', flowId: 'child' },
        deepCtx as unknown as typeof ctx,
        state,
      )
    ).rejects.toThrow()
  })
})
