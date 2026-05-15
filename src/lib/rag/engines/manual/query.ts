import type { PipelineCallbacks } from '../../state'
import { runManualPipeline } from '../../pipelines/manual'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import { buildManualNativeTrace } from './trace'

export async function runManualQuery(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<RagLifecycleOutput> {
  const state = await runManualPipeline(
    {
      message: input.message,
      traceId: input.traceId,
      threadId: input.threadId,
      conversationSummary: input.conversationSummary,
      config: input.config,
    },
    callbacks,
    'manual',
    { providerApiKeys: input.providerApiKeys }
  )
  return { ...state, native_trace: buildManualNativeTrace(state) }
}
