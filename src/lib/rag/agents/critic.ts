import type { Critique, GraphState } from '../state'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createAnthropicModel } from '../model'
export { shouldRetry } from './critic-routing'

export async function criticNode(state: GraphState): Promise<Partial<GraphState>> {
  const model = createAnthropicModel()
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const sourceUrls = state.search_results.map(r => r.source_url)

  const systemPrompt = `You are a strict quality evaluator for a RAG system.
Evaluate the draft response and return JSON only, no markdown:
{
  "confidence": 0.0-1.0,
  "ungrounded_claims": ["claim not supported by sources"],
  "gaps": ["what question left unanswered"]
}

Available source URLs: ${sourceUrls.join(', ')}
Confidence guide: 1.0=fully grounded, 0.6=mostly ok, below 0.6=needs retry`

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Question: ${query}\n\nDraft: ${state.draft}`),
  ])

  let critique: Critique = { confidence: 0.5, ungrounded_claims: [], gaps: [] }
  try {
    critique = JSON.parse(String(response.content))
  } catch { /* use default */ }

  const newIteration = state.iteration + 1

  return {
    critique,
    iteration: newIteration,
    token_usage: {
      input: (response.usage_metadata?.input_tokens ?? 0) + state.token_usage.input,
      output: (response.usage_metadata?.output_tokens ?? 0) + state.token_usage.output,
    },
  }
}
