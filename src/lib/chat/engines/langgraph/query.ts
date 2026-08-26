import type { PipelineCallbacks } from '../../../rag/state'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import { buildLangGraphNativeTrace } from './trace'
import { runLangGraphQueryGraph } from './query-graph'

export async function runLangGraphQuery(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<RagLifecycleOutput> {
  const state = await runLangGraphQueryGraph(input, callbacks)
  return { ...state, native_trace: buildLangGraphNativeTrace(state) }
}
