import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

export function validateToolGroupStep(raw: Record<string, unknown>): FlowStep {
  if (!Array.isArray(raw.tools) || raw.tools.length === 0) {
    throw new FlowStepValidationError(['tools'], 'tool_group step requires tools: non-empty string[]')
  }
  for (let i = 0; i < raw.tools.length; i++) {
    if (typeof raw.tools[i] !== 'string') {
      throw new FlowStepValidationError(['tools', String(i)], 'each tool must be a string')
    }
  }
  if (raw.parallel !== undefined && typeof raw.parallel !== 'boolean') {
    throw new FlowStepValidationError(['parallel'], 'parallel must be a boolean')
  }
  return raw as unknown as FlowStep
}
