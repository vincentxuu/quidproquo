import type { BudgetPolicy } from '../../schema/categories/budget'
import { check as checkCostUsd } from './max-cost-usd'
import { check as checkTokens } from './max-tokens'
import { check as checkIterations } from './max-iterations'
import { check as checkParallelUnits } from './max-parallel-units'
import { check as checkRuntime } from './max-runtime-seconds'

export interface BudgetCheckResult {
  breached: boolean
  ruleKey?: string
  observed?: number
  limit?: number
}

export interface BudgetState {
  tokensIn: number
  tokensOut: number
  costUsd: number
  iterations: number
  parallelUnits: number
  runtimeMs: number
  startedAt: number
}

export class BudgetTracker {
  private state: BudgetState = {
    tokensIn: 0,
    tokensOut: 0,
    costUsd: 0,
    iterations: 0,
    parallelUnits: 0,
    runtimeMs: 0,
    startedAt: Date.now(),
  }

  recordTokenSpend(tokensIn: number, tokensOut: number, costUsd: number): void {
    this.state.tokensIn += tokensIn
    this.state.tokensOut += tokensOut
    this.state.costUsd += costUsd
  }

  recordIteration(): void {
    this.state.iterations++
  }

  recordParallelUnit(delta: number): void {
    this.state.parallelUnits += delta
  }

  tickRuntime(): void {
    this.state.runtimeMs = Date.now() - this.state.startedAt
  }

  check(policy: BudgetPolicy | undefined): BudgetCheckResult {
    if (!policy) return { breached: false }

    if (policy.max_cost_usd !== undefined) {
      const { breached } = checkCostUsd(this.state.costUsd, policy.max_cost_usd)
      if (breached) return { breached: true, ruleKey: 'max_cost_usd', observed: this.state.costUsd, limit: policy.max_cost_usd }
    }

    const totalTokens = this.state.tokensIn + this.state.tokensOut
    if (policy.max_tokens !== undefined) {
      const { breached } = checkTokens(totalTokens, policy.max_tokens)
      if (breached) return { breached: true, ruleKey: 'max_tokens', observed: totalTokens, limit: policy.max_tokens }
    }

    if (policy.max_iterations !== undefined) {
      const { breached } = checkIterations(this.state.iterations, policy.max_iterations)
      if (breached) return { breached: true, ruleKey: 'max_iterations', observed: this.state.iterations, limit: policy.max_iterations }
    }

    if (policy.max_parallel_units !== undefined) {
      const { breached } = checkParallelUnits(this.state.parallelUnits, policy.max_parallel_units)
      if (breached) return { breached: true, ruleKey: 'max_parallel_units', observed: this.state.parallelUnits, limit: policy.max_parallel_units }
    }

    if (policy.max_runtime_seconds !== undefined) {
      const runtimeSeconds = this.state.runtimeMs / 1000
      const { breached } = checkRuntime(runtimeSeconds, policy.max_runtime_seconds)
      if (breached) return { breached: true, ruleKey: 'max_runtime_seconds', observed: runtimeSeconds, limit: policy.max_runtime_seconds }
    }

    return { breached: false }
  }

  getState(): Readonly<BudgetState> {
    return { ...this.state }
  }
}
