import type { D1Database } from '@cloudflare/workers-types'
import type { PolicyBindingBackend, PolicyViolationBackend } from '../../storage/types'

export interface PolicyContext {
  flowRunId: number | string
  db: D1Database
  violations?: Pick<PolicyViolationBackend, 'insert'>
}

export interface BudgetCheckDbResult {
  passed: boolean
  ruleKey?: string
  observed?: number
  limit?: number
}

/**
 * Check the actual accumulated cost (from D1) against the frozen policy for this flow run.
 * Inserts a policy_violations row if the budget is breached.
 */
export async function checkBudget(
  flowRunId: number | string,
  ctx: {
    db: D1Database
    bindings: PolicyBindingBackend
    violations?: Pick<PolicyViolationBackend, 'insert'>
  },
): Promise<BudgetCheckDbResult> {
  // 1. Load frozen policy for this run via storage backend
  const binding = await ctx.bindings.getByFlowRun(Number(flowRunId))

  // 2. If no policy or no budget rule, return passed
  if (!binding?.frozenEffective?.budget?.max_cost_usd) {
    return { passed: true }
  }

  const limit = binding.frozenEffective.budget.max_cost_usd

  // 3. Check current cost against policy.budget.max_cost_usd
  const row = await ctx.db
    .prepare(
      `SELECT sum(cost_usd) as total FROM agent_tool_calls WHERE run_id IN (
        SELECT run_id FROM agent_runs WHERE flow_run_id=?
      )`,
    )
    .bind(String(flowRunId))
    .first<{ total: number | null }>()

  const observed = row?.total ?? 0

  if (observed <= limit) {
    return { passed: true }
  }

  // 4. Budget breached — insert policy_violations row
  if (ctx.violations) {
    try {
      await ctx.violations.insert({
        flowRunId: Number(flowRunId),
        policyId: binding.policyId,
        category: 'budget',
        ruleKey: 'budget.maxCostUsd',
        severity: 'kill',
        observedValue: observed,
        limitValue: limit,
        actionTaken: 'run_killed',
      })
    } catch {
      // Table may not exist if migration hasn't run; non-fatal
    }
  }

  return { passed: false, ruleKey: 'budget.maxCostUsd', observed, limit }
}
