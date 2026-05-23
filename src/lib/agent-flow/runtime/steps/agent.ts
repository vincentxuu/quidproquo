import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

const agentStepExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'agent') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

  // Kernel dispatch (Phase 3 wires real kernel; Phase 2 stub)
  const kernel = ctx.kernel as { scheduler?: { dispatch: (opts: unknown) => Promise<unknown> } } | undefined
  if (kernel?.scheduler?.dispatch) {
    try {
      const result = await kernel.scheduler.dispatch({
        agentId: (step as unknown as { agentId: string }).agentId,
        trigger: 'sub-agent',
        parentRunId: ctx.flowRunId,
        input: (step as unknown as { input?: unknown }).input ?? {},
      })
      return { outputs: { result }, status: 'done' }
    } catch (err) {
      return { outputs: {}, status: 'failed', errorJson: { kind: 'agent_dispatch_failed', error: String(err) } }
    }
  }
  // Stub: no kernel available
  return { outputs: { stubbed: true, stepType: 'agent' }, status: 'done' }
}

registerStepExecutor('agent', agentStepExecutor)
export { agentStepExecutor }
