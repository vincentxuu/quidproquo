import type { Critique, GraphState } from '../state'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../model'
export { shouldRetry } from './critic-routing'

export async function criticNode(
  state: GraphState,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
  }
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 512
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const sourceUrls = state.search_results.map(r => r.source_url)

  const systemPrompt = `You are a strict quality evaluator for a RAG system.
Evaluate the draft response and return JSON only, no markdown:
{
  "confidence": 0.0-1.0,
  "answer_relevance": 0.0-1.0,
  "intent_alignment": 0.0-1.0,
  "drift_detected": boolean,
  "ungrounded_claims": ["claim not supported by sources"],
  "gaps": ["what question left unanswered"]
}

Available source URLs: ${sourceUrls.join(', ')}
Validation status before review: ${state.validation.passed ? 'passed' : `failed - ${state.validation.errors.join('; ')}`}
Original plan intent: ${state.plan.intent}
Original plan complexity: ${state.plan.complexity}
Confidence guide: 1.0=fully grounded, 0.6=mostly ok, below 0.6=needs retry
Answer relevance guide: below 0.75 means the answer does not directly answer the user's question.
Intent alignment guide: below 0.75 or drift_detected=true means the response wandered away from the requested task.`

  const { response, route } = await invokeModel(
    state.config,
    'critic',
    [
    new SystemMessage(systemPrompt),
    new HumanMessage(`Question: ${query}\n\nDraft: ${state.draft}`),
    ],
    maxTokens,
    options?.apiKeys
  )

  let critique: Critique = {
    confidence: 0.8,
    answer_relevance: 1,
    intent_alignment: 1,
    drift_detected: false,
    ungrounded_claims: [],
    gaps: [],
  }
  try {
    const raw = JSON.parse(String(response.content))
    critique = {
      confidence: raw.confidence ?? 0.8,
      answer_relevance: raw.answer_relevance ?? 1,
      intent_alignment: raw.intent_alignment ?? 1,
      drift_detected: raw.drift_detected ?? false,
      ungrounded_claims: Array.isArray(raw.ungrounded_claims) ? raw.ungrounded_claims : [],
      gaps: Array.isArray(raw.gaps) ? raw.gaps : [],
    }
  } catch { /* use default */ }

  return {
    critique,
    token_usage: {
      input: (response.usage_metadata?.input_tokens ?? 0) + state.token_usage.input,
      output: (response.usage_metadata?.output_tokens ?? 0) + state.token_usage.output,
    },
    model_usage: [...state.model_usage, { stage: 'critic', ...route }],
  }
}
