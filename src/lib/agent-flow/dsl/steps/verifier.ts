import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

const ALLOWED_VERIFIERS = ['coverage', 'citation', 'freshness', 'conflict', 'policy'] as const

export function validateVerifierStep(raw: Record<string, unknown>): FlowStep {
  if (typeof raw.verifier !== 'string' || !(ALLOWED_VERIFIERS as readonly string[]).includes(raw.verifier)) {
    throw new FlowStepValidationError(
      ['verifier'],
      `verifier must be one of: ${ALLOWED_VERIFIERS.join(', ')}`,
    )
  }
  if (raw.threshold !== undefined) {
    if (typeof raw.threshold !== 'number' || raw.threshold < 0 || raw.threshold > 1) {
      throw new FlowStepValidationError(['threshold'], 'threshold must be a number between 0 and 1')
    }
  }
  return raw as unknown as FlowStep
}
