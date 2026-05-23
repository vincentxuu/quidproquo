import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

const artifactExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'artifact') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

  const artifactType = (step as unknown as { artifactType: string }).artifactType
  const artifactId = crypto.randomUUID()
  return {
    outputs: { artifactId, kind: artifactType, location: `artifact://${ctx.flowRunId}/${artifactId}` },
    status: 'done',
  }
}

registerStepExecutor('artifact', artifactExecutor)
export { artifactExecutor }
