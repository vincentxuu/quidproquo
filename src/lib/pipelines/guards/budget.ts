import type { GuardResult, PipelineDefinition } from '../types'

export function validateBudgetPolicy(definition: PipelineDefinition): GuardResult[] {
  const results: GuardResult[] = []
  const { budget } = definition

  results.push({
    id: 'budget:max_runtime',
    status: Number.isInteger(budget.maxRuntimeMs) && budget.maxRuntimeMs > 0 ? 'pass' : 'fail',
    message: budget.maxRuntimeMs > 0 ? undefined : 'maxRuntimeMs must be positive',
  })

  results.push({
    id: 'budget:max_retries',
    status: Number.isInteger(budget.maxRetries) && budget.maxRetries >= 0 ? 'pass' : 'fail',
    message: budget.maxRetries >= 0 ? undefined : 'maxRetries must be zero or positive',
  })

  if (definition.risk === 'high' && budget.maxRetries > 1) {
    results.push({
      id: 'budget:high_risk_retry_cap',
      status: 'warn',
      message: 'High risk pipelines should keep automatic retries low.',
    })
  }

  return results
}
