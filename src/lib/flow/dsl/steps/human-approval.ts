import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

export function validateHumanApprovalStep(raw: Record<string, unknown>): FlowStep {
  if (typeof raw.reason !== 'string' || !raw.reason) {
    throw new FlowStepValidationError(['reason'], 'human_approval step requires reason: string')
  }
  if (raw.ttlSeconds !== undefined && typeof raw.ttlSeconds !== 'number') {
    throw new FlowStepValidationError(['ttlSeconds'], 'ttlSeconds must be a number')
  }
  if (raw.assignees !== undefined) {
    if (!Array.isArray(raw.assignees)) {
      throw new FlowStepValidationError(['assignees'], 'assignees must be an array of strings')
    }
    for (let i = 0; i < raw.assignees.length; i++) {
      if (typeof raw.assignees[i] !== 'string') {
        throw new FlowStepValidationError(['assignees', String(i)], 'each assignee must be a string')
      }
    }
  }
  return raw as unknown as FlowStep
}
