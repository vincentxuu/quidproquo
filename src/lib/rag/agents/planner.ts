import type { GraphState, Plan } from '../state'
import { HumanMessage } from '@langchain/core/messages'
import { invokeModel, type ProviderApiKeys } from '../model'
import { defineAgent } from '../../agent-os/access'

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
  syscallContext: Parameters<import('../../agent-os/kernel').AgentOsKernel['syscall']>[0]
  syscall: import('../../agent-os/kernel').AgentOsKernel['syscall']
  runtimeOptions?: AgentRuntimeOptions
}

export async function plannerNode(
  state: GraphState,
  options?: PlannerRunOptions
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 512
  const prompt = buildPlannerPrompt(state, options?.skillInstructions)

  const { response, route } = await invokeModel(
    state.config,
    'planner',
    [
      new HumanMessage(prompt),
    ],
    maxTokens,
    options?.apiKeys
  )

  return buildPlannerUpdate(state, { response, route })
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
  return `${INTENT_PROMPT}${skillInstructions ? `\n\nAgent skill instructions:\n${skillInstructions}` : ''}\n\nConversation summary: ${state.conversation_summary ?? 'none'}\n\nQuery: ${query}`
}

function buildPlannerUpdate(state: GraphState, result: PlannerModelResult): Partial<GraphState> {
  const { response, route } = result
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
