import { describe, it, expect } from 'vitest'
import { humanApprovalExecutor } from './human-approval'
import { createFlowState } from '../state'

const state = createFlowState('run-1')
const ctx = { flowRunId: 'run-1', stepRunId: 'step-1' }

describe('runtime/steps/human-approval', () => {
  it('returns type_mismatch for wrong step type', async () => {
    const result = await humanApprovalExecutor({ id: 's', type: 'agent' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('type_mismatch')
  })

  it('expires gracefully when no kernel is present', async () => {
    const result = await humanApprovalExecutor({ id: 's', type: 'human_approval' }, ctx, state)
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('human_approval_expire')
  })

  it('returns done when kernel approves', async () => {
    const kernel = {
      access: {
        requestApproval: async () => ({ decision: 'approve' as const }),
      },
    }
    const result = await humanApprovalExecutor(
      { id: 's', type: 'human_approval', reason: 'test' },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('done')
    expect(result.outputs.decision).toBe('approve')
  })

  it('returns failed when kernel rejects', async () => {
    const kernel = {
      access: {
        requestApproval: async () => ({ decision: 'reject' as const }),
      },
    }
    const result = await humanApprovalExecutor(
      { id: 's', type: 'human_approval' },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('human_approval_reject')
  })

  it('returns human_approval_error when kernel throws', async () => {
    const kernel = {
      access: {
        requestApproval: async () => { throw new Error('timeout') },
      },
    }
    const result = await humanApprovalExecutor(
      { id: 's', type: 'human_approval' },
      { ...ctx, kernel },
      state,
    )
    expect(result.status).toBe('failed')
    expect(result.errorJson?.kind).toBe('human_approval_error')
  })
})
