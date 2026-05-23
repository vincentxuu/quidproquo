import { getPipelineDefinition } from './registry'

export interface RedirectedInput {
  flowId: string
  input: Record<string, unknown>
}

export function translatePipelineToFlowInput(
  pipelineId: string,
  body: { inputs?: Record<string, unknown>; options?: Record<string, unknown> },
): RedirectedInput | null {
  const def = getPipelineDefinition(pipelineId)
  if (!def) return null

  // Derive synthetic flow id per D6-synthetic-flow-id
  const flowId = `pipeline-${pipelineId}`
  const input: Record<string, unknown> = {
    ...(body.inputs ?? {}),
    ...(body.options ? { _options: body.options } : {}),
  }
  return { flowId, input }
}
