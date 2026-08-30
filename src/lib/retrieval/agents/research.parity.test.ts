import { HumanMessage } from '@langchain/core/messages'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialState, type GraphState, type SearchResult, type RagMessage } from '../state'
import { researchAgent, researchNode } from './research'
import { invokeModel } from '../model'
import { searchBlogPosts } from '../tools/search-posts'
import { searchDocs } from '../tools/search-docs'
import { searchAbstractIndex } from '../tools/search-abstract-index'
import { pageIndexSearch } from '../tools/pageindex'
import { searchExternalTools } from '../tools/external-search'

vi.mock('../model', async () => {
  const actual = await vi.importActual<typeof import('../model')>('../model')
  return {
    ...actual,
    invokeModel: vi.fn(),
  }
})

vi.mock('../tools/search-posts', () => ({
  searchBlogPosts: vi.fn(),
}))

vi.mock('../tools/search-docs', () => ({
  searchDocs: vi.fn(),
}))

vi.mock('../tools/search-abstract-index', () => ({
  searchAbstractIndex: vi.fn(),
}))

vi.mock('../tools/pageindex', () => ({
  pageIndexSearch: vi.fn(),
}))

vi.mock('../tools/external-search', () => ({
  searchExternalTools: vi.fn(),
}))

const route = {
  provider: 'groq' as const,
  model: 'llama-3.3-70b-versatile',
  fallback: false,
}

const postResult = makeResult('post-1', 'post', 'https://quidproquo.cc/posts/agent-os')
const docResult = makeResult('doc-1', 'doc', 'https://example.com/doc')
const abstractResult = makeResult('abstract-1', 'abstract', 'https://quidproquo.cc/posts/agent-os')
const webResult = makeResult('web-1', 'doc', 'https://example.com/web')
const pageResult = makeResult('page-1', 'post', 'https://quidproquo.cc/posts/agent-os')

describe('research agent parity', () => {
  beforeEach(() => {
    vi.mocked(invokeModel).mockReset()
    vi.mocked(searchBlogPosts).mockReset()
    vi.mocked(searchDocs).mockReset()
    vi.mocked(searchAbstractIndex).mockReset()
    vi.mocked(pageIndexSearch).mockReset()
    vi.mocked(searchExternalTools).mockReset()
  })

  it('matches legacy output for local hybrid retrieval', async () => {
    const state = makeState({})
    await expectParity(state)
    expect(searchBlogPosts).toHaveBeenCalledWith(expect.objectContaining({ lang: 'zh-TW' }))
  })

  it('matches legacy output when external search is enabled', async () => {
    const state = makeState({
      config: {
        ...initialState().config,
        searchToolsEnabled: true,
        searchToolProviders: ['posts'],
      },
    })
    await expectParity(state)
  })

  it('matches legacy output for HyDE and page-index expansion', async () => {
    vi.mocked(invokeModel).mockResolvedValue({
      response: { content: 'hypothetical retrieval paragraph' },
      route,
    } as unknown as Awaited<ReturnType<typeof invokeModel>>)

    const state = makeState({
      config: {
        ...initialState().config,
        hydeEnabled: true,
        pageIndexEnabled: true,
      },
      plan: {
        intent: 'exploratory',
        complexity: 'complex',
        needs_clarification: false,
        subtasks: ['kernel syscalls'],
        specialists: [],
      },
    })
    await expectParity(state)
  })

  it('changes retrieval on retry by using critic gaps and disabling BM25 short-circuit', async () => {
    vi.mocked(searchBlogPosts).mockResolvedValue([postResult])
    vi.mocked(searchDocs).mockResolvedValue([docResult])
    vi.mocked(searchAbstractIndex).mockResolvedValue([])
    vi.mocked(searchExternalTools).mockResolvedValue([])
    vi.mocked(pageIndexSearch).mockResolvedValue([])

    await researchNode(makeState({
      iteration: 1,
      needs_web_search: true,
      critique: {
        confidence: 0.4,
        answer_relevance: 0.5,
        intent_alignment: 0.8,
        drift_detected: false,
        ungrounded_claims: [],
        gaps: ['deployment audit trail'],
      },
    }))

    expect(searchBlogPosts).toHaveBeenCalledTimes(2)
    expect(searchBlogPosts).toHaveBeenCalledWith(expect.objectContaining({
      query: expect.stringContaining('deployment audit trail'),
      shortCircuit: false,
    }))
    expect(searchDocs).toHaveBeenCalledWith(expect.objectContaining({ shortCircuit: false }))
  })

  it('uses cleaned planner keywords and a wider post window for recommendation queries', async () => {
    vi.mocked(searchBlogPosts).mockResolvedValue([postResult])
    vi.mocked(searchDocs).mockResolvedValue([])
    vi.mocked(searchAbstractIndex).mockResolvedValue([])
    vi.mocked(searchExternalTools).mockResolvedValue([])
    vi.mocked(pageIndexSearch).mockResolvedValue([])

    await researchNode(makeState({
      messages: [new HumanMessage('有哪些課程文章')] as RagMessage[],
      plan: {
        intent: 'recommendation',
        complexity: 'simple',
        needs_clarification: false,
        subtasks: [],
        search_keywords: ['課程', '文章'],
        specialists: [],
      },
    }))

    expect(searchBlogPosts).toHaveBeenCalledTimes(1)
    expect(searchBlogPosts).toHaveBeenCalledWith(expect.objectContaining({
      query: '課程',
      limit: 20,
      lang: 'zh-TW',
      metadataOnly: true,
    }))
    expect(searchDocs).not.toHaveBeenCalled()
    expect(searchExternalTools).not.toHaveBeenCalled()
  })

  it('cleans the original query when recommendation keywords are unavailable', async () => {
    vi.mocked(searchBlogPosts).mockResolvedValue([postResult])

    await researchNode(makeState({
      messages: [new HumanMessage('有哪些課程文章')] as RagMessage[],
      plan: {
        intent: 'recommendation',
        complexity: 'simple',
        needs_clarification: false,
        subtasks: [],
        search_keywords: [],
        specialists: [],
      },
    }))

    expect(searchBlogPosts).toHaveBeenCalledWith(expect.objectContaining({
      query: '課程',
      metadataOnly: true,
    }))
    expect(searchDocs).not.toHaveBeenCalled()
  })

  it('deduplicates different chunks from the same post for recommendation results', async () => {
    const firstChunk = { ...postResult, chunk_id: 'post-1', slug: 'agent-os', relevance_score: 0.7 }
    const secondChunk = { ...postResult, chunk_id: 'post-2', slug: 'agent-os', relevance_score: 0.9 }
    vi.mocked(searchBlogPosts).mockResolvedValueOnce([firstChunk, secondChunk])
    vi.mocked(searchDocs).mockResolvedValue([])
    vi.mocked(searchAbstractIndex).mockResolvedValue([])
    vi.mocked(searchExternalTools).mockResolvedValue([])
    vi.mocked(pageIndexSearch).mockResolvedValue([])

    const result = await researchNode(makeState({
      plan: {
        intent: 'recommendation',
        complexity: 'simple',
        needs_clarification: false,
        subtasks: [],
        search_keywords: ['agent kernel'],
        specialists: [],
      },
    }))

    expect(searchBlogPosts).toHaveBeenCalledTimes(1)
    expect(result.search_results).toHaveLength(1)
    expect(result.search_results?.[0].chunk_id).toBe('post-2')
  })

  it('preserves chunk-level retrieval for factual questions', async () => {
    const firstChunk = { ...postResult, chunk_id: 'post-1', slug: 'agent-os', relevance_score: 0.7 }
    const secondChunk = { ...postResult, chunk_id: 'post-2', slug: 'agent-os', relevance_score: 0.9 }
    vi.mocked(searchBlogPosts).mockResolvedValue([firstChunk, secondChunk])
    vi.mocked(searchDocs).mockResolvedValue([])
    vi.mocked(searchAbstractIndex).mockResolvedValue([])

    const result = await researchNode(makeState({
      plan: {
        intent: 'factual',
        complexity: 'simple',
        needs_clarification: false,
        subtasks: [],
        search_keywords: [],
        specialists: [],
      },
    }))

    expect(result.search_results).toHaveLength(2)
  })
})

async function expectParity(state: GraphState) {
  vi.mocked(searchBlogPosts).mockImplementation(async () => [postResult])
  vi.mocked(searchDocs).mockImplementation(async () => [docResult])
  vi.mocked(searchAbstractIndex).mockImplementation(async () => [abstractResult])
  vi.mocked(searchExternalTools).mockImplementation(async () => [webResult])
  vi.mocked(pageIndexSearch).mockImplementation(async () => [pageResult])

  const legacy = await researchNode(state, {
    apiKeys: { groq: 'legacy-key' },
  })
  const syscall = vi.fn(async (_ctx, name: string) => {
    if (name === 'model.invoke') {
      return {
        response: { content: 'hypothetical retrieval paragraph' },
        route,
      }
    }
    if (name === 'search.posts') return { results: [postResult], metrics: null }
    if (name === 'search.docs') return { results: [docResult], metrics: null }
    if (name === 'search.abstract-index') return { results: [abstractResult] }
    if (name === 'search.external') return { results: [webResult] }
    if (name === 'search.pageindex') return { results: [pageResult] }
    throw new Error(`unexpected syscall ${name}`)
  })
  const kernel = await researchAgent.run(state, {
    syscallContext: { runId: 'run-1', agentId: 'research' },
    syscall,
    runtimeOptions: { providerApiKeys: { groq: 'kernel-key' } },
  })

  expect(kernel.search_results?.map(result => result.chunk_id)).toEqual(legacy.search_results?.map(result => result.chunk_id))
  expect(kernel.retrieval_metrics).toEqual(legacy.retrieval_metrics)
  expect(kernel.model_usage).toEqual(legacy.model_usage)
}

function makeState(overrides: Partial<GraphState>): GraphState {
  return {
    ...initialState(),
    messages: [new HumanMessage('How does Agent OS mediate tools?')] as RagMessage[],
    token_usage: { input: 80, output: 40 },
    ...overrides,
  }
}

function makeResult(chunkId: string, type: SearchResult['type'], sourceUrl: string): SearchResult {
  return {
    claim: `${chunkId} claim`,
    evidence_excerpt: `${chunkId} evidence`,
    source_url: sourceUrl,
    chunk_id: chunkId,
    date: '2026-05-18',
    relevance_score: 0.9,
    images: [],
    links: [],
    type,
    slug: type === 'post' || type === 'abstract' ? 'agent-os' : undefined,
    title: 'Agent OS',
  }
}
