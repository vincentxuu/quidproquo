import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

const ALLOWED_MERGE = ['all', 'race', 'firstSuccess'] as const

export function validateParallelStep(
  raw: Record<string, unknown>,
  validateStep: (raw: Record<string, unknown>) => unknown,
): FlowStep {
  if (!Array.isArray(raw.branches) || raw.branches.length === 0) {
    throw new FlowStepValidationError(['branches'], 'parallel step requires branches: non-empty array of step arrays')
  }
  for (let i = 0; i < raw.branches.length; i++) {
    const branch = raw.branches[i]
    if (!Array.isArray(branch)) {
      throw new FlowStepValidationError(['branches', String(i)], 'each branch must be an array of steps')
    }
    for (let j = 0; j < branch.length; j++) {
      if (typeof branch[j] !== 'object' || branch[j] === null) {
        throw new FlowStepValidationError(['branches', String(i), String(j)], 'each step must be an object')
      }
      validateStep(branch[j] as Record<string, unknown>)
    }
  }
  if (raw.merge !== undefined && !(ALLOWED_MERGE as readonly string[]).includes(raw.merge as string)) {
    throw new FlowStepValidationError(['merge'], `merge must be one of: ${ALLOWED_MERGE.join(', ')}`)
  }
  return raw as unknown as FlowStep
}
