import type { StepExecutor } from '../step-executor'
import { getState } from '../state'
import { registerStepExecutor } from '../step-executor'

const ALLOWED_OPS = new Set(['var', '==', '!=', '>', '<', '>=', '<=', 'and', 'or', 'not', 'if', 'cat', 'substr', '+', '-', '*', '/', '%', 'missing', 'missing_some', 'in', 'all', 'some', 'none', 'filter', 'map', 'reduce'])

function validateExpression(expr: unknown): void {
  if (typeof expr !== 'object' || expr === null) return
  for (const key of Object.keys(expr as Record<string, unknown>)) {
    if (!ALLOWED_OPS.has(key)) {
      throw new Error(`Unsafe expression operator: "${key}"`)
    }
    validateExpression((expr as Record<string, unknown>)[key])
  }
}

const transformExecutor: StepExecutor = async (step, _ctx, state) => {
  if (step.type !== 'transform') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

  const expression = (step as unknown as { expression: string }).expression
  const stepId = (step as unknown as { id: string }).id

  // Guard against unsafe JSON Logic operators before evaluation
  validateExpression(expression)

  // Simple template literal evaluation — real Jsonata in Phase 3
  const stateSnapshot = getState(state, stepId) ?? {}
  const result = expression.replace(/\{\{([^}]+)\}\}/g, (_match: string, key: string) => {
    const k = key.trim()
    return String((stateSnapshot as Record<string, unknown>)[k] ?? '')
  })

  return { outputs: { result }, status: 'done' }
}

registerStepExecutor('transform', transformExecutor)
export { transformExecutor }
