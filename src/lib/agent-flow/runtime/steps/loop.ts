import type { StepExecutor } from '../step-executor'
import { registerStepExecutor, executeStep } from '../step-executor'
import { getState } from '../state'
import { FlowLoopBoundsError } from '../../dsl/errors'

const MAX_ITERATIONS = 100

const loopExecutor: StepExecutor = async (step, ctx, state) => {
  if (step.type !== 'loop') {
    return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }
  }

  const s = step as Record<string, unknown>
  const bodySteps = (s.body as unknown[]) ?? []
  const maxIterations = (s.maxIterations as number | undefined) ?? MAX_ITERATIONS
  const condition = s.condition as string | undefined

  if (maxIterations > MAX_ITERATIONS) {
    throw new FlowLoopBoundsError(
      [step.id],
      `maxIterations ${maxIterations} exceeds cap ${MAX_ITERATIONS}`,
    )
  }

  const iterationOutputs: unknown[] = []

  for (let i = 0; i < maxIterations; i++) {
    // Check condition (if provided, evaluate before each iteration after the first)
    if (i > 0 && condition !== undefined) {
      const condResult = getState(state, condition)
      if (condResult === 'false' || condResult === false) break
    }

    const iterResults: Record<string, unknown> = {}
    for (const bodyStep of bodySteps) {
      const bs = bodyStep as Parameters<StepExecutor>[0]
      // Scope state keys with loop.{i}. prefix by overriding stepId
      const scopedStep = { ...bs, id: `loop.${i}.${bs.id}` }
      const result = await executeStep(scopedStep, ctx, state)
      iterResults[bs.id] = result.outputs
      if (result.status === 'failed') {
        return {
          outputs: { iterations: iterationOutputs },
          status: 'failed',
          errorJson: { kind: 'loop_body_failed', iteration: i },
        }
      }
    }
    iterationOutputs.push(iterResults)
  }

  return {
    outputs: { iterations: iterationOutputs, count: iterationOutputs.length },
    status: 'done',
  }
}

registerStepExecutor('loop', loopExecutor)
export { loopExecutor }
