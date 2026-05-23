import { describe, it, expect } from 'vitest'
import { verifierExecutor } from './verifier'
import { createFlowState } from '../state'

const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }
const state = createFlowState('run-1')

describe('runtime/steps/verifier', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const result = await verifierExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('citation verifier returns passed=true', async () => {
    const result = await verifierExecutor({ id: 's', type: 'verifier', verifier: 'citation' }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.passed).toBe(true)
  })

  it('freshness verifier returns passed=true', async () => {
    const result = await verifierExecutor({ id: 's', type: 'verifier', verifier: 'freshness' }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.passed).toBe(true)
  })

  it('coverage verifier without kernel passes through', async () => {
    const result = await verifierExecutor({ id: 's', type: 'verifier', verifier: 'coverage' }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.passed).toBe(true)
  })

  it('coverage verifier with kernel that approves returns passed=true', async () => {
    const kernel = {
      evidence: {
        verifyFlowRun: async () => ({ passed: true }),
      },
    }
    const result = await verifierExecutor(
      { id: 's', type: 'verifier', verifier: 'coverage' },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.passed).toBe(true)
  })

  it('coverage verifier with block enforcement returns failed on coverage gap', async () => {
    const kernel = {
      evidence: {
        verifyFlowRun: async () => ({ passed: false, gaps: ['missing-citation'] }),
      },
    }
    const result = await verifierExecutor(
      { id: 's', type: 'verifier', verifier: 'coverage', policy: { enforcement: 'block' } },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('quality_policy_violation')
  })

  it('unknown verifier type returns passed=false', async () => {
    const result = await verifierExecutor({ id: 's', type: 'verifier', verifier: 'unknown_type' }, ctx, state)
    expect(result.status).toBe('done')
    expect(result.outputs.passed).toBe(false)
  })
})
