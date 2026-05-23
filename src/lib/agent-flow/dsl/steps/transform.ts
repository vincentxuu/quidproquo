import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

export function validateTransformStep(raw: Record<string, unknown>): FlowStep {
  if (typeof raw.expression !== 'string' || !raw.expression.trim()) {
    throw new FlowStepValidationError(['expression'], 'transform step requires expression: non-empty string')
  }
  return raw as unknown as FlowStep
}
