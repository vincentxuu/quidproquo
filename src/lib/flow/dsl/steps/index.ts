import { FlowStepValidationError } from '../errors'
import { validateAgentStep } from './agent'
import { validateToolGroupStep } from './tool-group'
import { validateTransformStep } from './transform'
import { validateVerifierStep } from './verifier'
import { validateArtifactStep } from './artifact'
import { validateHumanApprovalStep } from './human-approval'
import { validateSubFlowStep } from './sub-flow'
import { validateParallelStep } from './parallel'
import { validateLoopStep } from './loop'

export function dispatchStepValidator(raw: Record<string, unknown>): unknown {
  const type = raw.type as string
  switch (type) {
    case 'agent':
      return validateAgentStep(raw)
    case 'tool_group':
      return validateToolGroupStep(raw)
    case 'transform':
      return validateTransformStep(raw)
    case 'verifier':
      return validateVerifierStep(raw)
    case 'artifact':
      return validateArtifactStep(raw)
    case 'human_approval':
      return validateHumanApprovalStep(raw)
    case 'sub_flow':
      return validateSubFlowStep(raw)
    case 'parallel':
      return validateParallelStep(raw, dispatchStepValidator)
    case 'loop':
      return validateLoopStep(raw, dispatchStepValidator)
    default:
      throw new FlowStepValidationError(['type'], `Unknown step type: ${type}`)
  }
}

export * from './agent'
export * from './tool-group'
export * from './transform'
export * from './verifier'
export * from './artifact'
export * from './human-approval'
export * from './sub-flow'
export * from './parallel'
export * from './loop'
