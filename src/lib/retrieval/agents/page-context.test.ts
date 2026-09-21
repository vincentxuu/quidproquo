import { HumanMessage } from '@langchain/core/messages'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialState, type GraphState, type RagMessage, type SearchResult } from '../state'
import { invokeModel } from '../model'
import { fetchPageChunks } from '../tools/page-chunks'
import { plannerNode } from './planner'
import { normalizeResultsNode } from './normalize-results'

vi.mock('../model', async () => {
  const actual = await vi.importActual<typeof import('../model')>('../model')
  return { ...actual, invokeModel: vi.fn() }
})

vi.mock('../tools/page-chunks', async () => {
  const actual = await vi.importActual<typeof import('../tools/page-chunks')>('../tools/page-chunks')
  return { ...actual, fetchPageChunks: vi.fn() }
})

const page = { slug: 'ai/current', title: '目前這篇', lang: 'zh-TW' }

function stateFor(query: string, overrides: Partial<GraphState> = {}): GraphState {
  return { ...initialState(), messages: [new HumanMessage(query)] as RagMessage[], ...overrides }
}

function result(chunkId: string, slug: string, score: number): SearchResult {
  return {
    claim: chunkId,
    evidence_excerpt: `${chunkId} text`,
    source_url: `https://quidproquo.cc/posts/${slug}`,
    chunk_id: chunkId,
    date: '2026-09-01',
    relevance_score: score,
    images: [],
    links: [],
    type: 'post',
    slug,
    title: slug,
  }
}

function mockPlannerJson(json: Record<string, unknown> | string) {
  vi.mocked(invokeModel).mockResolvedValueOnce({
    response: { content: typeof json === 'string' ? json : JSON.stringify(json) },
    route: { provider: 'groq', model: 'test', fallback: false },
  } as unknown as Awaited<ReturnType<typeof invokeModel>>)
}

beforeEach(() => {
  vi.mocked(invokeModel).mockReset()
  vi.mocked(fetchPageChunks).mockReset()
})

describe('planner with page context', () => {
  it('tells the model which post the reader is viewing', async () => {
    mockPlannerJson({ intent: 'summary', refers_to_page: true })
    await plannerNode(stateFor('這篇的重點是什麼？', { page_context: page }))
    const prompt = String((vi.mocked(invokeModel).mock.calls[0][2][0] as HumanMessage).content)
    expect(prompt).toContain('"目前這篇"')
  })

  it('falls back to wording when the model omits the field or returns broken JSON', async () => {
    mockPlannerJson({ intent: 'summary' })
    expect((await plannerNode(stateFor('這篇的重點是什麼？', { page_context: page }))).plan?.refers_to_page).toBe(true)
    mockPlannerJson('not json')
    expect((await plannerNode(stateFor('這篇的重點是什麼？', { page_context: page }))).plan?.refers_to_page).toBe(true)
  })

  it('keeps site-wide questions site-wide even on a post page', async () => {
    mockPlannerJson({ intent: 'recommendation', refers_to_page: false })
    expect((await plannerNode(stateFor('有哪些 RAG 文章？', { page_context: page }))).plan?.refers_to_page).toBe(false)
  })

  it('never sets refers_to_page without a page context', async () => {
    mockPlannerJson({ intent: 'summary', refers_to_page: true })
    const update = await plannerNode(stateFor('這篇的重點是什麼？'))
    expect(update.plan?.refers_to_page).toBe(false)
    const prompt = String((vi.mocked(invokeModel).mock.calls[0][2][0] as HumanMessage).content)
    expect(prompt).not.toContain('currently viewing')
  })
})

describe('normalizeResultsNode with page context', () => {
  const global = [result('a1', 'ai/other', 0.95), result('b1', 'ai/third', 0.9)]

  it('adds the current post as guaranteed candidates and pins them first, keeping site-wide results', async () => {
    vi.mocked(fetchPageChunks).mockResolvedValueOnce([result('p1', page.slug, 0.85), result('p2', page.slug, 0.85)])
    const state = stateFor('這篇跟另一篇差在哪', { page_context: page, search_results: global })
    state.plan = { ...state.plan, refers_to_page: true }
    const update = await normalizeResultsNode(state)
    expect(update.search_results?.map(item => item.chunk_id)).toEqual(['p1', 'p2', 'a1', 'b1'])
    expect(fetchPageChunks).toHaveBeenCalledWith({ slug: page.slug, query: '這篇跟另一篇差在哪' })
  })

  it('does not trigger web search when only the current post has evidence', async () => {
    vi.mocked(fetchPageChunks).mockResolvedValueOnce([result('p1', page.slug, 0.85)])
    const state = stateFor('這篇的重點', { page_context: page, search_results: [] })
    state.plan = { ...state.plan, refers_to_page: true }
    expect((await normalizeResultsNode(state)).needs_web_search).toBe(false)
  })

  it('does nothing for site-wide questions on a post page', async () => {
    const state = stateFor('有哪些 RAG 文章？', { page_context: page, search_results: global })
    const update = await normalizeResultsNode(state)
    expect(fetchPageChunks).not.toHaveBeenCalled()
    expect(update.search_results?.map(item => item.chunk_id)).toEqual(['a1', 'b1'])
  })

  it('degrades to site-wide results when the chunk lookup fails', async () => {
    vi.mocked(fetchPageChunks).mockRejectedValueOnce(new Error('d1 down'))
    const state = stateFor('這篇的重點', { page_context: page, search_results: global })
    state.plan = { ...state.plan, refers_to_page: true }
    expect((await normalizeResultsNode(state)).search_results?.map(item => item.chunk_id)).toEqual(['a1', 'b1'])
  })
})
