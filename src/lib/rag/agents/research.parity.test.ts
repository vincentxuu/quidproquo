import { HumanMessage } from '@langchain/core/messages'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialState, type GraphState, type SearchResult } from '../state'
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
    } as Awaited<ReturnType<typeof invokeModel>>)

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
    messages: [new HumanMessage('How does Agent OS mediate tools?')],
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
