import { initialState, type GraphState } from '../state'
import type { RagLifecycleInput, RagLifecycleOutput } from './contract'

export function normalizeRagLifecycleOutput(
  input: RagLifecycleInput,
  output: RagLifecycleOutput
): GraphState {
  const base = initialState()

  return {
    ...base,
    ...output,
    thread_id: input.threadId ?? output.thread_id ?? base.thread_id,
    conversation_summary: input.conversationSummary ?? output.conversation_summary,
    langfuse_trace_id: output.langfuse_trace_id || input.traceId,
    config: output.config || input.config,
  } satisfies GraphState
}
