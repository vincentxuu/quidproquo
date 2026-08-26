import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { searchBlogPostsTool, searchDocsTool } from '../tools/langchain-tools'
import { getPostDetail } from '../tools/get-post-detail'
import type { GraphState, SearchResult } from '../../rag/state'
import { HumanMessage } from '@langchain/core/messages'
import { createResilientModel, type ProviderApiKeys } from '../../rag/model'

const SYSTEM_PROMPT = `You are a research agent for a personal blog. Your job is to find relevant content.

Use search_blog_posts for questions about the author's own articles.
Use search_docs for technical questions about Cloudflare, Astro, or Workers.
Use get_post_detail only when you need the full content of a specific article.
You can call multiple tools in parallel for efficiency.
Stop when you have enough information (max 5 tool calls).`

export async function researchNode(
  state: GraphState,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
    maxSearchCalls?: number
    searchProfile?: unknown
    skillInstructions?: string
  }
): Promise<Partial<GraphState>> {
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const subtaskList = state.plan.subtasks.length > 0
    ? `\n\nPlanner subtasks to address:\n${state.plan.subtasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : ''

  const model = createResilientModel(options?.maxTokens ?? 2048, {
    config: state.config,
    stage: 'research',
    apiKeys: options?.apiKeys,
  })
  const agent = createReactAgent({
    llm: model as any, // [skip-harness] langchain's createReactAgent expects BaseChatModel with bindTools
    tools: [searchBlogPostsTool, searchDocsTool, getPostDetail] as any, // [skip-harness] langchain tool type mismatch
    stateModifier: SYSTEM_PROMPT,
  })

  const result = await agent.invoke({
    messages: [new HumanMessage(`${query}${subtaskList}`)],
  })

  const allResults: SearchResult[] = []
  for (const msg of result.messages) {
    if (msg._getType() === 'tool') {
      try {
        const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          allResults.push(...parsed.filter((r: unknown) => r && typeof r === 'object' && 'chunk_id' in (r as object)))
        }
      } catch { /* skip unparseable */ }
    }
  }

  return { search_results: allResults, retrieval_metrics: [] }
}
