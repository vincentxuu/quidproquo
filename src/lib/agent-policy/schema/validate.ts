import type { PolicyBody } from './body'

export function validatePolicyBody(body: PolicyBody): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (body.budget) {
    if (body.budget.max_cost_usd !== undefined && body.budget.max_cost_usd <= 0)
      errors.push('budget.max_cost_usd must be > 0')
  }
  if (body.human) {
    if (body.human.risk_threshold !== undefined &&
        (body.human.risk_threshold < 0 || body.human.risk_threshold > 1))
      errors.push('human.risk_threshold must be in [0, 1]')
  }
  return { valid: errors.length === 0, errors }
}
