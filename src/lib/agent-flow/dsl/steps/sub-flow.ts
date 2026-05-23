import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

export function validateSubFlowStep(raw: Record<string, unknown>): FlowStep {
  if (typeof raw.flowId !== 'string' || !raw.flowId) {
    throw new FlowStepValidationError(['flowId'], 'sub_flow step requires flowId: string')
  }
  if (raw.version !== undefined && (typeof raw.version !== 'number' || !Number.isInteger(raw.version) || raw.version < 1)) {
    throw new FlowStepValidationError(['version'], 'version must be a positive integer')
  }
  if (raw.input !== undefined && (typeof raw.input !== 'object' || raw.input === null || Array.isArray(raw.input))) {
    throw new FlowStepValidationError(['input'], 'input must be an object')
  }
  return raw as unknown as FlowStep
}
