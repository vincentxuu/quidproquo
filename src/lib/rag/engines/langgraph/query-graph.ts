import type { PipelineCallbacks } from '../../state'
import { runPipeline as runLangGraphPipeline } from '../../graph'
import type { RagLifecycleInput } from '../contract'
import type { RagLifecycleOutput } from '../contract'

export async function runLangGraphQueryGraph(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<RagLifecycleOutput> {
  const state = await runLangGraphPipeline(
    {
      message: input.message,
      traceId: input.traceId,
      threadId: input.threadId,
      conversationSummary: input.conversationSummary,
      config: input.config,
    },
    callbacks
  )
  return { ...state }
}
