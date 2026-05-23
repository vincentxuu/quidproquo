import type { FlowStep } from '../ast'
import { FlowStepValidationError } from '../errors'

export function validateArtifactStep(raw: Record<string, unknown>): FlowStep {
  if (typeof raw.artifactType !== 'string' || !raw.artifactType) {
    throw new FlowStepValidationError(['artifactType'], 'artifact step requires artifactType: string')
  }
  if (raw.template !== undefined && typeof raw.template !== 'string') {
    throw new FlowStepValidationError(['template'], 'template must be a string')
  }
  return raw as unknown as FlowStep
}
