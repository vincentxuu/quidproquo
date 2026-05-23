import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

const toolGroupExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'tool_group') return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }

  const tools = (step as unknown as { tools: string[] }).tools
  const parallel = (step as unknown as { parallel?: boolean }).parallel ?? false
  const kernel = ctx.kernel as { syscall?: (name: string, input: unknown) => Promise<unknown> } | undefined

  if (!kernel?.syscall) {
    return { outputs: { stubbed: true, tools }, status: 'done' }
  }

  const outputs: Record<string, unknown> = {}
  try {
    if (parallel) {
      const results = await Promise.all(tools.map((t) => kernel.syscall!(t, {})))
      for (let i = 0; i < tools.length; i++) outputs[tools[i]] = results[i]
    } else {
      for (const tool of tools) {
        outputs[tool] = await kernel.syscall(tool, {})
      }
    }
    return { outputs, status: 'done' }
  } catch (err) {
    return { outputs, status: 'failed', errorJson: { kind: 'tool_call_failed', error: String(err) } }
  }
}

registerStepExecutor('tool_group', toolGroupExecutor)
export { toolGroupExecutor }
