import { validateToolAllowlist } from '../tool-registry'
import type { GuardResult, PipelineDefinition } from '../types'

export function validatePipelineTools(definition: PipelineDefinition): GuardResult[] {
  return validateToolAllowlist(definition)
}
