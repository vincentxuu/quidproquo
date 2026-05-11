import { searchBlogPosts } from '../tools/search-posts'
import { searchAbstractIndex } from '../tools/search-abstract-index'
import { searchDocs } from '../tools/search-docs'
import type { GraphState, SearchResult } from '../state'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createModel } from '../model'

async function generateQueryAlternatives(query: string, maxQueries: number): Promise<string[]> {
  const model = createModel(256)
  const response = await model.invoke([
    new SystemMessage(`Generate up to ${maxQueries} diverse search rewrites for a blog/documentation RAG system.
Return JSON only: {"queries":["..."]}`),
    new HumanMessage(query),
  ])

  try {
    const parsed = JSON.parse(String(response.content))
    return Array.isArray(parsed.queries)
      ? parsed.queries.filter((item: unknown) => typeof item === 'string' && item.trim().length > 0).slice(0, maxQueries)
      : []
  } catch {
    return []
  }
}

async function generateHydeQuery(query: string): Promise<string | null> {
  const model = createModel(256)
  const response = await model.invoke([
    new SystemMessage('Write a short hypothetical answer paragraph that would help retrieve the right supporting documents. Return plain text only.'),
    new HumanMessage(query),
  ])

  const content = String(response.content ?? '').trim()
  return content.length > 0 ? content : null
}

function mergeUniqueResults(results: SearchResult[]): SearchResult[] {
  const merged = new Map<string, SearchResult>()

  for (const result of results) {
    const existing = merged.get(result.chunk_id)
    if (!existing || result.relevance_score > existing.relevance_score) {
      merged.set(result.chunk_id, result)
    }
  }

  return [...merged.values()]
}

export async function researchNode(state: GraphState): Promise<Partial<GraphState>> {
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const baseQuery = state.plan.subtasks.length > 0
    ? `${query} ${state.plan.subtasks.join(' ')}`
    : query

  const searchQueries = [baseQuery]

  if (state.config.hydeEnabled && state.plan.complexity !== 'simple') {
    const hydeQuery = await generateHydeQuery(baseQuery).catch(() => null)
    if (hydeQuery) searchQueries.push(hydeQuery)
  }

  if (state.config.multiQueryEnabled && state.plan.complexity === 'complex') {
    const alternates = await generateQueryAlternatives(baseQuery, 2).catch(() => [])
    searchQueries.push(...alternates)
  }

  const queryVariants = Array.from(new Set(searchQueries.map(item => item.trim()).filter(Boolean)))
  const perQueryResults = await Promise.all(queryVariants.map(async searchQuery => {
    const [abstractResults, postResults, docResults] = await Promise.all([
      state.plan.complexity === 'simple'
        ? Promise.resolve([] as SearchResult[])
        : searchAbstractIndex({ query: searchQuery, limit: 4 }).catch(() => [] as SearchResult[]),
      searchBlogPosts({ query: searchQuery, limit: 8 }).catch(() => [] as SearchResult[]),
      searchDocs({ query: searchQuery, limit: 5 }).catch(() => [] as SearchResult[]),
    ])

    return [
      ...(abstractResults as SearchResult[]),
      ...(postResults as SearchResult[]),
      ...(docResults as SearchResult[]),
    ]
  }))

  const allResults = mergeUniqueResults(perQueryResults.flat())

  return { search_results: allResults }
}
