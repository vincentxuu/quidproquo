import type { GraphState, Plan } from '../state'
import { HumanMessage } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../model'
import { defineAgent } from '../../agent/access'
import { refersToPage } from '../tools/page-chunks'

const INTENT_PROMPT = `You are a query planner for a personal blog RAG system.
Analyze the user's query and respond with JSON only, no markdown.

Response format:
{
  "intent": "factual" | "summary" | "code" | "comparison" | "exploratory" | "recommendation" | "off-topic",
  "complexity": "simple" | "medium" | "complex",
  "language": "zh-TW" | "en",
  "needs_clarification": boolean,
  "subtasks": string[],
  "search_keywords": string[],
  "specialists": ("summarizer" | "code_explainer")[]
}

Respond in the same language as the query.
Mark "off-topic" if the question is unrelated to the blog content (e.g., weather, sports).
Mark "recommendation" for article discovery requests such as "找文章", "推薦文章", "閱讀路線", "what should I read", or "learning path".
Mark "needs_clarification" only if the query is genuinely ambiguous.
Extract 1-4 clean search keywords (stripping conversational filler) in "search_keywords".`

type PlannerModelResult = Awaited<ReturnType<typeof invokeModel>>

interface PlannerRunOptions {
  apiKeys?: ProviderApiKeys
  maxTokens?: number
  skillInstructions?: string
}

interface AgentRuntimeOptions {
  providerApiKeys?: ProviderApiKeys
}

interface AgentRuntime {
  syscallContext: Parameters<import('../../agent/kernel').AgentOsKernel['syscall']>[0]
  syscall: import('../../agent/kernel').AgentOsKernel['syscall']
  runtimeOptions?: AgentRuntimeOptions
}

export async function plannerNode(
  state: GraphState,
  options?: PlannerRunOptions
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 512
  const prompt = buildPlannerPrompt(state, options?.skillInstructions)

  const { response, route, reasoning } = await invokeModel(
    state.config,
    'planner',
    [
      new HumanMessage(prompt),
    ],
    maxTokens,
    options?.apiKeys
  )

  return buildPlannerUpdate(state, { response, route, reasoning })
}

export const plannerAgent = defineAgent<GraphState, Partial<GraphState>>({
  id: 'planner',
  version: 1,
  displayName: 'Planner',
  description: 'Plans the RAG route and extracts intent, complexity, and language.',
  syscalls: ['model.invoke', 'memory.read'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: [],
  toolCallLimit: 5,
  timeoutSeconds: 30,
  irreversibleActionsRequireApproval: false,
  async run(state, runtime) {
    const { syscallContext, syscall, runtimeOptions } = runtime as AgentRuntime
    const result = await syscall(syscallContext, 'model.invoke', {
      config: state.config,
      stage: 'planner',
      messages: [new HumanMessage(buildPlannerPrompt(state))],
      maxTokens: 512,
      apiKeys: runtimeOptions?.providerApiKeys,
    }) as PlannerModelResult

    return buildPlannerUpdate(state, result)
  },
})

function buildPlannerPrompt(state: GraphState, skillInstructions?: string): string {
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage?.content === 'string' ? lastMessage.content : ''
  return `${INTENT_PROMPT}${buildPageContextNote(state)}${skillInstructions ? `\n\nAgent skill instructions:\n${skillInstructions}` : ''}\n\nConversation summary: ${state.conversation_summary ?? 'none'}\n\nQuery: ${query}`
}

// 沒有文章脈絡時回空字串，planner prompt 與原本逐字相同。
function buildPageContextNote(state: GraphState): string {
  if (!state.page_context) return ''
  return `\n\nThe reader is currently viewing the blog post titled ${JSON.stringify(state.page_context.title)}.
Phrases like "這篇", "本文", "文中", "this post" or "this article" refer to that post: such a query is on-topic and not ambiguous, so do not mark it "off-topic" or "needs_clarification". Include the post's key terms in "search_keywords".
Add "refers_to_page": true to the JSON when the query is about that post, false when it is a site-wide question.`
}

function buildPlannerUpdate(state: GraphState, result: PlannerModelResult): Partial<GraphState> {
  const { response, route } = result
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage?.content === 'string' ? lastMessage.content : ''
  // 模型漏填或 JSON 壞掉時，用字面規則保底；沒有文章脈絡就一律 false
  const refersByWording = Boolean(state.page_context) && refersToPage(query)
  let plan: Plan = {
    intent: 'factual',
    complexity: 'medium',
    needs_clarification: false,
    subtasks: [],
    search_keywords: [],
    specialists: [],
    refers_to_page: refersByWording,
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
      search_keywords: parsed.search_keywords ?? [],
      specialists: parsed.specialists ?? [],
      refers_to_page: Boolean(state.page_context) && (refersByWording || parsed.refers_to_page === true),
    }
  } catch {
    // fallback to defaults
  }

  return {
    plan,
    language,
    model_usage: [...state.model_usage, {
      stage: 'planner',
      ...route,
      ...(result.reasoning ? { reasoning: result.reasoning } : {}),
    }],
  }
}
