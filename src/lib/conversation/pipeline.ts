import { initialState, type GraphState, type PipelineCallbacks, type RagRuntimeConfig } from '../retrieval/state'
import { normalizeRagLifecycleOutput } from './engines/normalizers'
import { resolveRagEngine } from './engines/registry'
import type { ProviderApiKeys } from '../retrieval/model'

export async function runPipeline(
  input: {
    message: string
    traceId: string
    threadId?: string
    conversationSummary?: string
    config?: RagRuntimeConfig
  },
  callbacks: PipelineCallbacks
,
  options?: {
    providerApiKeys?: ProviderApiKeys
  }
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
      providerApiKeys: options?.providerApiKeys,
    },
    { ...callbacks, onToken: () => {} }
  )

  const finalState = normalizeRagLifecycleOutput(
    {
      message: input.message,
      traceId: input.traceId,
      threadId: input.threadId,
      conversationSummary: input.conversationSummary,
      config: effectiveConfig,
    },
    output
  )

  // Backstop: the UI renders whatever arrives via onToken, and an empty
  // final_response produces a permanently blank answer (steps with no text).
  // This covers the planner early exits (off-topic / needs_clarification,
  // both engines) and any residual empty draft that slipped past validation.
  if (!finalState.final_response?.trim()) {
    const fallback = buildEmptyFinalResponse(finalState)
    finalState.draft = fallback
    finalState.final_response = fallback
  }

  if (finalState.final_response) callbacks.onToken(finalState.final_response)
  return finalState
}

function buildEmptyFinalResponse(state: GraphState): string {
  const english = state.language === 'en'
  if (state.plan.intent === 'off-topic') {
    return english
      ? 'This question seems unrelated to this blog. I can only answer questions about articles on this site — try rephrasing?'
      : '這個問題跟這個部落格的內容不太相關，我只能回答跟站內文章有關的問題。換個問法試試？'
  }
  if (state.plan.needs_clarification) {
    return english
      ? 'Your question is a bit ambiguous — could you share more detail, e.g. which topic you are looking for?'
      : '你的問題有點模糊，可以多給一點線索嗎？例如你想找哪一方面的文章。'
  }
  return english
    ? 'Sorry, I could not generate an answer this time. Please try again or rephrase.'
    : '抱歉，這次沒能產生回答，請再試一次或換個問法。'
}
