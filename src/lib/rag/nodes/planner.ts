import type { GraphState, Plan } from '../state'
import { HumanMessage } from '@langchain/core/messages'
import { createModel } from '../model'

const INTENT_PROMPT = `You are a query planner for a personal blog RAG system.
Analyze the user's query and respond with JSON only, no markdown.

Response format:
{
  "intent": "factual" | "summary" | "code" | "comparison" | "exploratory" | "off-topic",
  "language": "zh-TW" | "en",
  "needs_clarification": boolean,
  "subtasks": string[],
  "specialists": ("summarizer" | "code_explainer")[]
}

Respond in the same language as the query.
Mark "off-topic" if the question is unrelated to the blog content (e.g., weather, sports).
Mark "needs_clarification" only if the query is genuinely ambiguous.`

export async function plannerNode(state: GraphState): Promise<Partial<GraphState>> {
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const model = createModel()
  const response = await model.invoke([
    new HumanMessage(`${INTENT_PROMPT}\n\nQuery: ${query}`),
  ])

  let plan: Plan = {
    intent: 'factual',
    needs_clarification: false,
    subtasks: [],
    specialists: [],
  }
  let language = 'zh-TW'

  try {
    const parsed = JSON.parse(String(response.content))
    language = parsed.language ?? 'zh-TW'
    plan = {
      intent: parsed.intent ?? 'factual',
      needs_clarification: parsed.needs_clarification ?? false,
      subtasks: parsed.subtasks ?? [],
      specialists: parsed.specialists ?? [],
    }
  } catch {
    // fallback to defaults
  }

  return { plan, language }
}
