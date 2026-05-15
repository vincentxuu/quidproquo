import type { GraphState, Plan } from '../state'
import { HumanMessage } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../model'

const INTENT_PROMPT = `You are a query planner for a personal blog RAG system.
Analyze the user's query and respond with JSON only, no markdown.

Response format:
{
  "intent": "factual" | "summary" | "code" | "comparison" | "exploratory" | "recommendation" | "off-topic",
  "complexity": "simple" | "medium" | "complex",
  "language": "zh-TW" | "en",
  "needs_clarification": boolean,
  "subtasks": string[],
  "specialists": ("summarizer" | "code_explainer")[]
}

Respond in the same language as the query.
Mark "off-topic" if the question is unrelated to the blog content (e.g., weather, sports).
Mark "recommendation" for article discovery requests such as "找文章", "推薦文章", "閱讀路線", "what should I read", or "learning path".
Mark "needs_clarification" only if the query is genuinely ambiguous.`

export async function plannerNode(
  state: GraphState,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
  }
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 512
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const { response, route } = await invokeModel(
    state.config,
    'planner',
    [
    new HumanMessage(`${INTENT_PROMPT}\n\nConversation summary: ${state.conversation_summary ?? 'none'}\n\nQuery: ${query}`),
    ],
    maxTokens,
    options?.apiKeys
  )

  let plan: Plan = {
    intent: 'factual',
    complexity: 'medium',
    needs_clarification: false,
    subtasks: [],
    specialists: [],
  }
  let language = 'zh-TW'

  try {
    const parsed = JSON.parse(String(response.content))
    language = parsed.language ?? 'zh-TW'
    const intent = parsed.intent ?? 'factual'
    plan = {
      intent: intent === 'recommendation' ? 'recommendation' : parsed.intent ?? 'factual',
      complexity: parsed.complexity ?? 'medium',
      needs_clarification: parsed.needs_clarification ?? false,
      subtasks: parsed.subtasks ?? [],
      specialists: parsed.specialists ?? [],
    }
  } catch {
    // fallback to defaults
  }

  return {
    plan,
    language,
    model_usage: [...state.model_usage, { stage: 'planner', ...route }],
  }
}
