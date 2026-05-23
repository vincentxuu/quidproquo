import { describe, it, expect, vi } from 'vitest'
import { checkBudget } from './check-db'
import type { PolicyBindingBackend } from '../../storage/types'

function makeDb(total: number | null): D1Database {
  return {
    prepare: vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnValue({
        first: vi.fn().mockResolvedValue({ total }),
      }),
    }),
  } as unknown as D1Database
}

function makeBindings(policy: { budget?: { max_cost_usd?: number } } | null): PolicyBindingBackend {
  return {
    getByFlowRun: vi.fn().mockResolvedValue(
      policy ? { policyId: 1, frozenEffective: policy } : null,
    ),
  } as unknown as PolicyBindingBackend
}

describe('budget enforcement', () => {
  it('passes when accumulated cost is below limit', async () => {
    const db = makeDb(0.0005)
    const bindings = makeBindings({ budget: { max_cost_usd: 0.001 } })

    const result = await checkBudget('run-1', { db, bindings })

    expect(result).toEqual({ passed: true })
  })

  it('kills run when cost exceeds max_cost_usd', async () => {
    const db = makeDb(0.005)
    const bindings = makeBindings({ budget: { max_cost_usd: 0.001 } })

    const result = await checkBudget('run-1', { db, bindings })

    expect(result.passed).toBe(false)
    expect(result.ruleKey).toBe('budget.maxCostUsd')
    expect(result.observed).toBe(0.005)
    expect(result.limit).toBe(0.001)
  })

  it('passes when no policy is bound to the run', async () => {
    const db = makeDb(0.005)
    const bindings = makeBindings(null)

    const result = await checkBudget('run-1', { db, bindings })

    expect(result).toEqual({ passed: true })
  })

  it('passes when policy has no budget rule', async () => {
    const db = makeDb(0.005)
    const bindings = makeBindings({ budget: undefined })

    const result = await checkBudget('run-1', { db, bindings })

    expect(result).toEqual({ passed: true })
  })

  it('inserts a violations row when budget is breached and violations backend provided', async () => {
    const db = makeDb(0.01)
    const bindings = makeBindings({ budget: { max_cost_usd: 0.001 } })
    const violations = { insert: vi.fn().mockResolvedValue(undefined) }

    const result = await checkBudget('run-42', { db, bindings, violations })

    expect(result.passed).toBe(false)
    expect(violations.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'budget',
        ruleKey: 'budget.maxCostUsd',
        severity: 'kill',
        actionTaken: 'run_killed',
      }),
    )
  })

  it('treats null D1 total as zero cost', async () => {
    const db = makeDb(null)
    const bindings = makeBindings({ budget: { max_cost_usd: 0.001 } })

    const result = await checkBudget('run-1', { db, bindings })

    expect(result).toEqual({ passed: true })
  })
})
