import { initialState, type GraphState, type PipelineCallbacks, type RagRuntimeConfig } from './state'
import { normalizeRagLifecycleOutput } from './engines/normalizers'
import { resolveRagEngine } from './engines/registry'

export async function runPipeline(
  input: {
    message: string
    traceId: string
    threadId?: string
    conversationSummary?: string
    config?: RagRuntimeConfig
  },
  callbacks: PipelineCallbacks
): Promise<GraphState> {
  const engine = input.config?.pipelineEngine ?? 'langgraph'
  const engineConfig = input.config ?? initialState().config
  const effectiveConfig = { ...engineConfig, pipelineEngine: engine }
  const resolver = resolveRagEngine(effectiveConfig.pipelineEngine)
  const output = await resolver.query(
    {
      message: input.message,
      traceId: input.traceId,
      threadId: input.threadId,
      conversationSummary: input.conversationSummary,
      config: effectiveConfig,
    },
    callbacks
  )

  return normalizeRagLifecycleOutput(
    {
      message: input.message,
      traceId: input.traceId,
      threadId: input.threadId,
      conversationSummary: input.conversationSummary,
      config: effectiveConfig,
    },
    output
  )
}
