import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

export function validateAgentStep(raw: Record<string, unknown>): FlowStep {
  if (typeof raw.agentId !== 'string' || !raw.agentId) {
    throw new FlowStepValidationError(['agentId'], 'agent step requires agentId: string')
  }
  if (raw.input !== undefined && (typeof raw.input !== 'object' || raw.input === null || Array.isArray(raw.input))) {
    throw new FlowStepValidationError(['input'], 'input must be an object')
  }
  if (raw.retryPolicy !== undefined) {
    const rp = raw.retryPolicy as Record<string, unknown>
    if (typeof rp !== 'object' || rp === null) {
      throw new FlowStepValidationError(['retryPolicy'], 'retryPolicy must be an object')
    }
    if (typeof rp.maxAttempts !== 'number' || !Number.isInteger(rp.maxAttempts) || rp.maxAttempts < 1) {
      throw new FlowStepValidationError(['retryPolicy', 'maxAttempts'], 'maxAttempts must be a positive integer')
    }
    if (typeof rp.backoffMs !== 'number' || rp.backoffMs < 0) {
      throw new FlowStepValidationError(['retryPolicy', 'backoffMs'], 'backoffMs must be a non-negative number')
    }
  }
  if (raw.timeoutSeconds !== undefined && typeof raw.timeoutSeconds !== 'number') {
    throw new FlowStepValidationError(['timeoutSeconds'], 'timeoutSeconds must be a number')
  }
  return raw as unknown as FlowStep
}
