import type { PipelineCallbacks } from '../../state'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import { buildLlamaIndexNativeTrace } from './trace'
import { runLlamaIndexQueryEngine } from './query-engine'

export async function runLlamaIndexQuery(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<RagLifecycleOutput> {
  const { state, nativeTraceEvents } = await runLlamaIndexQueryEngine(
    {
      message: input.message,
      traceId: input.traceId,
      threadId: input.threadId,
      conversationSummary: input.conversationSummary,
      config: input.config,
    },
    input.providerApiKeys,
    callbacks
  )

  return {
    ...state,
    native_trace: buildLlamaIndexNativeTrace(state, nativeTraceEvents),
  }
}
