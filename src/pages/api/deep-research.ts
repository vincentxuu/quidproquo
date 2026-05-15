import type { APIRoute } from 'astro'
import { HumanMessage } from '@langchain/core/messages'
import { initialState, type GraphState, type RagRuntimeConfig, type SearchResult } from '../../lib/rag/state'
import { verifySession } from '../../lib/auth/session'
import { plannerNode } from '../../lib/rag/agents/planner'
import { researchNode } from '../../lib/rag/agents/research'
import { writerNode } from '../../lib/rag/agents/writer'
import { criticNode } from '../../lib/rag/agents/critic'
import { resolveProviderApiKeys } from '../../lib/rag/provider-key-store'
import type { ProviderApiKeys } from '../../lib/rag/model'

interface Env {
  URL: string
  DB?: D1Database
  SESSION?: KVNamespace
  DEEP_RESEARCH_KV?: KVNamespace
}

type Provider = RagRuntimeConfig['defaultProvider']
type DeepResearchBody = {
  brief?: unknown
  config?: {
    maxQueries?: unknown
    maxTokens?: unknown
    providerPref?: unknown
    maxSearchCalls?: unknown
  }
}

export const POST: APIRoute = async ({ request, env, cookies }) => {
  try {
    const sessionToken = cookies.get('session')?.value
    const authSuccess = sessionToken ? await verifySession(sessionToken) : false
    if (!authSuccess) {
      return new Response('Unauthorized', { status: 401 })
    }

    const payload = await request.json().catch(() => ({})) as DeepResearchBody
    const brief = payload.brief
    const userConfig = payload.config || {}

    if (!brief || typeof brief !== 'string') {
      return new Response('Brief is required and must be a string', { status: 400 })
    }

    const hash = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const reportId = `dr_report_${hash}`
    const costKey = `dr_cost_${hash}`

    const maxQueries = typeof userConfig.maxQueries === 'number' ? Math.max(1, Math.min(10, Math.round(userConfig.maxQueries))) : 3
    const maxTokens = typeof userConfig.maxTokens === 'number' ? Math.max(64, Math.min(1024, Math.round(userConfig.maxTokens))) : 256
    const maxSearchCalls = typeof userConfig.maxSearchCalls === 'number' ? Math.max(1, Math.min(10, Math.round(userConfig.maxSearchCalls))) : 3
    const providerPref = typeof userConfig.providerPref === 'string' ? userConfig.providerPref : 'groq'

    const kv = (env as unknown as Env).DEEP_RESEARCH_KV ?? (env as unknown as Env).SESSION
    if (!kv) {
      return new Response(
        JSON.stringify({ error: 'Deep research KV namespace is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const apiKeys = await loadProviderKeys((env as unknown as Env).DB)

    const provider = normalizeProvider(providerPref)
    const finalConfig: RagRuntimeConfig = {
      ...initialState().config,
      defaultProvider: provider,
      defaultModel: defaultModelForProvider(provider),
    }

    const baseState = {
      ...initialState(),
      config: finalConfig,
      messages: [new HumanMessage(brief)],
    }

    const planResult = await plannerNode(baseState, { apiKeys, maxTokens })
    const plan = planResult.plan ?? initialState().plan
    const subtasks = plan.subtasks?.length ? plan.subtasks : [brief]
    const selectedSubtasks = subtasks.slice(0, maxQueries)

    const notes: Record<string, SearchResult[]> = {}
    const allResults: SearchResult[] = []
    for (const question of selectedSubtasks) {
      const researchState = {
        ...baseState,
        messages: [new HumanMessage(question)],
        plan,
      } as GraphState

      const researchResult = await researchNode(researchState, { apiKeys, maxTokens })
      const questionResults = researchResult.search_results ?? []
      allResults.push(...questionResults)
      notes[question] = questionResults

      maxSearchCalls
    }

    const mergedResults = dedupeSearchResults(allResults)
    const writeState = {
      ...baseState,
      messages: [new HumanMessage(brief)],
      plan,
      search_results: mergedResults,
    } as GraphState
    const writeResult = await writerNode(writeState, { apiKeys, maxTokens })
    const finalReport = typeof writeResult.final_response === 'string' ? writeResult.final_response : ''

    const critiqueState = {
      ...writeState,
      draft: finalReport,
    } as GraphState
    await criticNode(critiqueState, { apiKeys, maxTokens })

    await kv.put(reportId, finalReport)
    const reportUrl = `${env.URL}/api/deep-research/${reportId}`

    const currentCostStr = await kv.get(costKey)
    const currentCost = currentCostStr ? parseFloat(currentCostStr) : 0
    const estimatedCost = 0.5
    await kv.put(costKey, (currentCost + estimatedCost).toString())

    return new Response(JSON.stringify({
      runId: hash,
      reportUrl,
      status: 'completed',
      summary: finalReport.slice(0, 200) + (finalReport.length > 200 ? '…' : ''),
      notes,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Deep research API error:', error)
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function dedupeSearchResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  const deduped: SearchResult[] = []
  for (const result of results) {
    if (seen.has(result.chunk_id)) continue
    seen.add(result.chunk_id)
    deduped.push(result)
  }
  return deduped
}

function normalizeProvider(raw: string): Provider {
  if (raw === 'openai' || raw === 'google' || raw === 'groq') return raw
  return 'groq'
}

function defaultModelForProvider(provider: Provider): string {
  if (provider === 'openai') return 'gpt-4.1-mini'
  if (provider === 'google') return 'gemini-2.0-flash'
  return 'llama-3.3-70b-versatile'
}

async function loadProviderKeys(db?: D1Database): Promise<ProviderApiKeys> {
  if (!db) return {}
  return resolveProviderApiKeys(db)
}
