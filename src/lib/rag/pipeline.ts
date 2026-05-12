import type { GraphState, PipelineCallbacks, RagRuntimeConfig } from './state'
import { runManualPipeline } from './pipelines/manual'

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
  if (engine === 'langgraph') {
    const { runPipeline: runLangGraphPipeline } = await import('./graph')
    return runLangGraphPipeline(input, callbacks)
  }

  // LlamaIndex is exposed as a selectable engine for contract testing while the
  // implementation is still a manual pipeline adapter. This keeps runtime output
  // stable before introducing another orchestration dependency.
  return runManualPipeline(input, callbacks, engine)
}
