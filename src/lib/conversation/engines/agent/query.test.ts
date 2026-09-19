import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AIMessage } from '@langchain/core/messages'
import { initialState, type PipelineCallbacks, type SearchResult } from '../../../retrieval/state'

const invokeQueue: Array<(messages: unknown[], tools: boolean) => AIMessage> = []
const bindToolsSpy = vi.fn()

vi.mock('../../../retrieval/model', () => ({
  createRawModel: () => {
    const make = (tools: boolean) => ({
      invoke: async (messages: unknown[]) => {
        const next = invokeQueue.shift()
        if (!next) throw new Error('no scripted response left')
        return next(messages, tools)
      },
    })
    return { ...make(false), bindTools: (schemas: unknown) => { bindToolsSpy(schemas); return make(true) } }
  },
  extractReasoningText: () => '',
  resolveModelRoute: () => ({ provider: 'groq', model: 'test-model' }),
}))
const plannerMock = vi.fn(async () => ({ plan: { intent: 'factual', complexity: 'simple', needs_clarification: false, subtasks: [], search_keywords: ['RAG'], specialists: [] }, language: 'zh-TW', model_usage: [] }))
vi.mock('../../../retrieval/agents/planner', () => ({ plannerNode: (...args: unknown[]) => plannerMock(...(args as [])) }))
vi.mock('../../../retrieval/agents/critic', () => ({
  criticNode: async () => ({ critique: { confidence: 0.8, answer_relevance: 0.9, intent_alignment: 0.9, drift_detected: false, ungrounded_claims: [], gaps: [] } }),
}))
vi.mock('../../../retrieval/agents/related-posts', () => ({
  relatedPostsNode: async () => ({ related_posts: [{ title: 'Related', slug: 'ai/related', description: '' }] }),
}))
const searchSpy = vi.fn()
vi.mock('../../../retrieval/tools/search-posts', () => ({
  searchBlogPosts: async (args: { query: string }) => { searchSpy(args); return SEARCH_HITS },
}))
vi.mock('../../../tool-registry/definitions/get-post-detail', () => ({
  getPostDetailMarkdown: async (slug: string) => (slug === 'ai/rag-cost' ? '# RAG 成本優化\n\n全文內容' : `Post "${slug}" not found.`),
}))
const langgraphSpy = vi.fn()
vi.mock('../langgraph/query', () => ({
  runLangGraphQuery: async (input: unknown, callbacks: PipelineCallbacks) => {
    langgraphSpy(input)
    callbacks.onStep('Planner')
    return { ...initialState(), final_response: 'langgraph answer', native_trace: { engine: 'langgraph', version: '1', events: [] } }
  },
}))

const SEARCH_HITS: SearchResult[] = [
  { claim: 'c', evidence_excerpt: 'RAG 成本可以靠快取降低', source_url: 'https://quidproquo.cc/posts/ai/rag-cost', chunk_id: 'k1', date: '', relevance_score: 0.9, images: [], links: [], type: 'post', slug: 'ai/rag-cost', title: 'RAG 成本優化' },
  { claim: 'c', evidence_excerpt: '另一段', source_url: 'https://quidproquo.cc/posts/ai/rag-cost', chunk_id: 'k2', date: '', relevance_score: 0.8, images: [], links: [], type: 'post', slug: 'ai/rag-cost', title: 'RAG 成本優化' },
]

const { runAgentQuery, runAgentQueryWithFallback, stripDisallowedLinks } = await import('./query')

function makeCallbacks() {
  const steps: Array<{ agent: string; extra?: Record<string, unknown> }> = []
  const callbacks: PipelineCallbacks = {
    onStep: (agent, extra) => steps.push({ agent, extra }),
    onToken: () => {},
    onRelated: vi.fn(),
    onReasoning: () => {},
  }
  return { steps, callbacks }
}
const input = { message: 'RAG 成本怎麼降？', traceId: 't1', config: { ...initialState().config, pipelineEngine: 'agent' as const } }
const ai = (content: string, tool_calls: Array<{ id: string; name: string; args: Record<string, unknown> }> = []) =>
  new AIMessage({ content, tool_calls, usage_metadata: { input_tokens: 10, output_tokens: 5, total_tokens: 15 } })

beforeEach(() => { invokeQueue.length = 0; searchSpy.mockClear(); langgraphSpy.mockClear(); bindToolsSpy.mockClear() })

describe('runAgentQuery', () => {
  it('searches, reads, answers with valid citations and emits UI steps', async () => {
    invokeQueue.push(
      () => ai('', [{ id: 'a', name: 'search_posts', args: { query: 'RAG 成本' } }]),
      () => ai('', [{ id: 'b', name: 'get_post_detail', args: { slug: 'ai/rag-cost' } }]),
      () => ai('用快取降成本，見 [RAG 成本優化](https://quidproquo.cc/posts/ai/rag-cost)。'),
    )
    const { steps, callbacks } = makeCallbacks()
    const out = await runAgentQuery(input, callbacks)
    expect(out.final_response).toContain('快取')
    expect(out.validation.passed).toBe(true)
    expect(out.search_results.map((r) => r.chunk_id)).toEqual(['k1', 'k2', 'post:ai/rag-cost'])
    expect(out.critique.confidence).toBe(0.8)
    expect(out.related_posts).toHaveLength(1)
    expect(out.token_usage).toEqual({ input: 30, output: 15 })
    expect(steps.map((s) => s.agent)).toEqual(['Planner', 'Agent', 'Research', 'Agent', 'ReadPost', 'Writer', 'Validation', 'Critic'])
    expect(steps[2].extra).toMatchObject({ query: 'RAG 成本', sources_found: 1 })
    expect(steps[4].extra).toMatchObject({ slug: 'ai/rag-cost', found: true })
    expect(searchSpy).toHaveBeenCalledWith({ query: 'RAG 成本', lang: 'zh-TW', limit: 6 })
    expect(out.native_trace?.events.map((e) => e.stage)).toContain('tool:get_post_detail')
  })

  it('asks the model to repair hallucinated citations, then strips what is still wrong', async () => {
    invokeQueue.push(
      () => ai('', [{ id: 'a', name: 'search_posts', args: { query: 'RAG' } }]),
      () => ai('答案 [假連結](https://quidproquo.cc/posts/ai/nope)'),
      // repair turn: still wrong
      (_m, tools) => { expect(tools).toBe(false); return ai('修正後 [還是假](https://quidproquo.cc/posts/ai/nope) 與 [真的](https://quidproquo.cc/posts/ai/rag-cost)') },
    )
    const { callbacks } = makeCallbacks()
    const out = await runAgentQuery(input, callbacks)
    expect(out.final_response).toBe('修正後 還是假 與 [真的](https://quidproquo.cc/posts/ai/rag-cost)')
    expect(out.validation.passed).toBe(true)
  })

  it('returns early on off-topic without touching the model', async () => {
    plannerMock.mockResolvedValueOnce({ plan: { intent: 'off-topic', complexity: 'simple', needs_clarification: false, subtasks: [], search_keywords: [], specialists: [] }, language: 'zh-TW', model_usage: [] })
    const { steps, callbacks } = makeCallbacks()
    const out = await runAgentQuery(input, callbacks)
    expect(out.final_response).toBe('')
    expect(out.plan.intent).toBe('off-topic')
    expect(steps.map((s) => s.agent)).toEqual(['Planner'])
    expect(bindToolsSpy).not.toHaveBeenCalled()
  })

  it('falls back to langgraph when the loop cannot produce an answer', async () => {
    invokeQueue.push(() => ai('   '), () => ai('   '))
    const { steps, callbacks } = makeCallbacks()
    const out = await runAgentQueryWithFallback(input, callbacks)
    expect(langgraphSpy).toHaveBeenCalledTimes(1)
    expect(out.final_response).toBe('langgraph answer')
    expect(out.config.pipelineEngine).toBe('agent')
    expect(steps.map((s) => s.agent)).toContain('Fallback')
    expect(out.native_trace?.events[0].stage).toBe('fallback')
  })
})

describe('stripDisallowedLinks', () => {
  it('keeps allowed links and flattens the rest', () => {
    const allowed = new Set(['https://quidproquo.cc/posts/a'])
    expect(stripDisallowedLinks('[ok](https://quidproquo.cc/posts/a) [bad](https://quidproquo.cc/posts/b)', allowed)).toBe('[ok](https://quidproquo.cc/posts/a) bad')
  })
})
