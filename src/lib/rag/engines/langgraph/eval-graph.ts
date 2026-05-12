import type { PipelineCallbacks } from '../../state'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import { buildLangGraphNativeTrace } from './trace'
import { runLangGraphQueryGraph } from './query-graph'

export async function runLangGraphEvalCase(
  input: RagLifecycleInput,
  callbacks: PipelineCallbacks
): Promise<RagLifecycleOutput> {
  const state = await runLangGraphQueryGraph(input, {
    onStep: (agent, extra) => {
      callbacks.onStep(`eval:${agent}`, extra)
    },
    onToken: callbacks.onToken,
    onRelated: callbacks.onRelated,
  })

  return {
    ...state,
    native_trace: buildLangGraphNativeTrace({ ...state, trace_steps: state.trace_steps }),
  }
}
