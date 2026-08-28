import type { FlowStep } from '../ast'
import { FlowStepValidationError, FlowLoopBoundsError } from '../errors'

export function validateLoopStep(
  raw: Record<string, unknown>,
  validateStep: (raw: Record<string, unknown>) => unknown,
): FlowStep {
  if (!Array.isArray(raw.body) || raw.body.length === 0) {
    throw new FlowStepValidationError(['body'], 'loop step requires body: non-empty array of steps')
  }
  if (
    typeof raw.maxIterations !== 'number' ||
    !Number.isInteger(raw.maxIterations) ||
    raw.maxIterations < 1 ||
    raw.maxIterations > 100
  ) {
    throw new FlowLoopBoundsError(['maxIterations'], 'maxIterations must be an integer between 1 and 100')
  }
  for (let i = 0; i < raw.body.length; i++) {
    if (typeof raw.body[i] !== 'object' || raw.body[i] === null) {
      throw new FlowStepValidationError(['body', String(i)], 'each step must be an object')
    }
    validateStep(raw.body[i] as Record<string, unknown>)
  }
  return raw as unknown as FlowStep
}
