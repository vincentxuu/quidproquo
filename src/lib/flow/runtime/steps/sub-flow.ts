import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'
import { FlowCycleError } from '../../dsl/errors'

const MAX_SUB_FLOW_DEPTH = Number(
  typeof process !== 'undefined'
    ? (process.env.AGENT_FLOW_MAX_SUB_FLOW_DEPTH ?? '5')
    : '5'
)

const subFlowExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'sub_flow') {
    return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }
  }

  const s = step as Record<string, unknown>
  const targetFlowId = s.flowId as string | undefined
  if (!targetFlowId) {
    return { outputs: {}, status: 'failed', errorJson: { kind: 'sub_flow_missing_flow_id' } }
  }

  // Depth limit — check via depth counter on ctx
  const ctxExtra = ctx as unknown as Record<string, unknown>
  const depth = ctxExtra.depth as number | undefined ?? 0
  if (depth >= MAX_SUB_FLOW_DEPTH) {
    throw new FlowCycleError([targetFlowId, `depth:${depth}`])
  }

  // Check for static cycles (current flowId === target)
  const currentFlowId = ctxExtra.flowId as string | undefined
  if (currentFlowId === targetFlowId) {
    throw new FlowCycleError([currentFlowId, targetFlowId])
  }

  // Stub: actual runFlow call would go here once runFlow is exported from run.ts
  // For now, return a placeholder that marks the step done
  return {
    outputs: { result: null, subFlowId: targetFlowId },
    status: 'done',
  }
}

registerStepExecutor('sub_flow', subFlowExecutor)
export { subFlowExecutor }
