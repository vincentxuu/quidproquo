import { describe, it, expect, vi } from 'vitest'
import { applyMmrOrdering, parseMetadataArrays, orderByRelevance, rerankByQuery, rerankWithCrossEncoder, isRecencySensitiveQuery, applyRecencyBoost } from './normalize-results'
import type { SearchResult } from '../state'

describe('parseMetadataArrays', () => {
  it('parses JSON-stringified images', () => {
    const result = parseMetadataArrays({ images: '["https://a.com/img.png"]', links: '[]' })
    expect(result.images).toEqual(['https://a.com/img.png'])
    expect(result.links).toEqual([])
  })

  it('parses JSON-stringified links', () => {
    const result = parseMetadataArrays({
      images: '[]',
      links: '[{"text":"click","url":"https://x.com"}]',
    })
    expect(result.links).toEqual([{ text: 'click', url: 'https://x.com' }])
  })

  it('handles invalid JSON gracefully', () => {
    const result = parseMetadataArrays({ images: 'not-json', links: 'also-bad' })
    expect(result.images).toEqual([])
    expect(result.links).toEqual([])
  })
})

describe('orderByRelevance', () => {
  it('places highest-scoring chunk first', () => {
    const chunks = [
      { relevance_score: 0.5, evidence_excerpt: 'b' },
      { relevance_score: 0.9, evidence_excerpt: 'a' },
      { relevance_score: 0.3, evidence_excerpt: 'c' },
    ] as SearchResult[]
    const ordered = orderByRelevance(chunks)
    expect(ordered[0].evidence_excerpt).toBe('a')
  })

  it('returns empty array unchanged', () => {
    expect(orderByRelevance([])).toEqual([])
  })
})

describe('rerankByQuery', () => {
  it('boosts chunks with stronger lexical overlap', () => {
    const chunks = [
      { relevance_score: 0.8, claim: 'generic', evidence_excerpt: 'generic text' },
      { relevance_score: 0.7, claim: 'Cloudflare D1 batch timeout', evidence_excerpt: 'Cloudflare D1 batch timeout' },
    ] as SearchResult[]
    const ranked = rerankByQuery(chunks, 'cloudflare d1 timeout', 1)
    expect(ranked[0].evidence_excerpt).toContain('Cloudflare D1')
  })

  it('keeps only the configured number of top results', () => {
    const chunks = [
      { relevance_score: 0.9, claim: 'first', evidence_excerpt: 'first' },
      { relevance_score: 0.8, claim: 'second', evidence_excerpt: 'second' },
      { relevance_score: 0.7, claim: 'third', evidence_excerpt: 'third' },
    ] as SearchResult[]

    expect(rerankByQuery(chunks, 'first', 2)).toHaveLength(2)
    expect(rerankByQuery(chunks, 'first', 10)).toHaveLength(3)
  })
})

describe('comparable result ordering', () => {
  it('does not let an abstract cosine score overpower normalized RRF', () => {
    const ordered = orderByRelevance([
      { relevance_score: 0.75, type: 'post', evidence_excerpt: 'rrf' },
      { relevance_score: 0.99, type: 'abstract', evidence_excerpt: 'abstract' },
    ] as SearchResult[])

    expect(ordered[0].evidence_excerpt).toBe('rrf')
    expect(ordered[1].relevance_score).toBeCloseTo(0.495)
  })
})

vi.mock('cloudflare:workers', () => ({
  env: {
    AI: {
      run: vi.fn(),
    },
  },
}))

describe('rerankWithCrossEncoder', () => {
  it('reorders results by cross-encoder score', async () => {
    const { env: cfEnv } = await import('cloudflare:workers')
    const mockAI = (cfEnv as unknown as { AI: { run: ReturnType<typeof vi.fn> } }).AI
    mockAI.run.mockResolvedValueOnce({
      response: [
        { id: 0, score: -1.0 },
        { id: 1, score: 2.5 },
        { id: 2, score: 0.5 },
      ],
    })

    const chunks = [
      { relevance_score: 0.9, chunk_id: 'a', claim: 'generic', evidence_excerpt: 'generic text' },
      { relevance_score: 0.7, chunk_id: 'b', claim: 'D1 batch timeout', evidence_excerpt: 'Cloudflare D1 batch timeout fix' },
      { relevance_score: 0.5, chunk_id: 'c', claim: 'vector search', evidence_excerpt: 'vector search embedding' },
    ] as SearchResult[]

    const ranked = await rerankWithCrossEncoder(chunks, 'd1 timeout', 2)
    expect(ranked[0].chunk_id).toBe('b')
    expect(ranked[0].relevance_score).toBeGreaterThan(0.9)
    expect(ranked[1].chunk_id).toBe('c')
    expect(mockAI.run).toHaveBeenCalledWith('@cf/baai/bge-reranker-base', expect.objectContaining({
      query: 'd1 timeout',
      contexts: expect.arrayContaining([expect.objectContaining({ text: expect.stringContaining('generic') })]),
    }))
  })

  it('returns empty array for empty input', async () => {
    const ranked = await rerankWithCrossEncoder([], 'query', 3)
    expect(ranked).toEqual([])
  })

  it('applies sigmoid normalization to scores', async () => {
    const { env: cfEnv } = await import('cloudflare:workers')
    const mockAI = (cfEnv as unknown as { AI: { run: ReturnType<typeof vi.fn> } }).AI
    mockAI.run.mockResolvedValueOnce({
      response: [{ id: 0, score: 5.0 }],
    })

    const chunks = [
      { relevance_score: 0.5, chunk_id: 'a', claim: 'test', evidence_excerpt: 'test' },
    ] as SearchResult[]

    const ranked = await rerankWithCrossEncoder(chunks, 'test', 1)
    expect(ranked[0].relevance_score).toBeGreaterThan(0.99)
    expect(ranked[0].relevance_score).toBeLessThanOrEqual(1)
  })
})

describe('isRecencySensitiveQuery', () => {
  it('detects Chinese recency keywords', () => {
    expect(isRecencySensitiveQuery('今天有什麼新消息')).toBe(true)
    expect(isRecencySensitiveQuery('最近有什麼框架更新')).toBe(true)
    expect(isRecencySensitiveQuery('最新的 AI 模型')).toBe(true)
  })

  it('detects English recency keywords', () => {
    expect(isRecencySensitiveQuery('latest framework releases')).toBe(true)
    expect(isRecencySensitiveQuery('what is new today')).toBe(true)
    expect(isRecencySensitiveQuery('recent updates')).toBe(true)
  })

  it('returns false for non-recency queries', () => {
    expect(isRecencySensitiveQuery('什麼是 RAG')).toBe(false)
    expect(isRecencySensitiveQuery('explain BM25')).toBe(false)
  })
})

describe('applyRecencyBoost', () => {
  it('boosts results from today', () => {
    const results = [
      { relevance_score: 0.5, date: '2026-09-12' },
      { relevance_score: 0.6, date: '2026-08-01' },
    ] as SearchResult[]

    const boosted = applyRecencyBoost(results, '2026-09-12')
    expect(boosted[0].relevance_score).toBe(0.65)
    expect(boosted[1].relevance_score).toBe(0.6)
  })

  it('applies smaller boost for 7-day-old results', () => {
    const results = [
      { relevance_score: 0.5, date: '2026-09-08' },
    ] as SearchResult[]

    const boosted = applyRecencyBoost(results, '2026-09-12')
    expect(boosted[0].relevance_score).toBeCloseTo(0.58)
  })

  it('does not boost results older than 30 days', () => {
    const results = [
      { relevance_score: 0.5, date: '2026-07-01' },
    ] as SearchResult[]

    const boosted = applyRecencyBoost(results, '2026-09-12')
    expect(boosted[0].relevance_score).toBe(0.5)
  })

  it('clamps score to 1', () => {
    const results = [
      { relevance_score: 0.95, date: '2026-09-12' },
    ] as SearchResult[]

    const boosted = applyRecencyBoost(results, '2026-09-12')
    expect(boosted[0].relevance_score).toBe(1)
  })
})

describe('applyMmrOrdering', () => {
  it('keeps diverse chunks near the front', () => {
    const chunks = [
      { relevance_score: 1, claim: 'A', evidence_excerpt: 'cloudflare d1 timeout batch write' },
      { relevance_score: 0.95, claim: 'B', evidence_excerpt: 'cloudflare d1 timeout batch write' },
      { relevance_score: 0.9, claim: 'C', evidence_excerpt: 'langgraph planner critic writer related posts' },
    ] as SearchResult[]

    const ordered = applyMmrOrdering(chunks, 0.7)
    expect(ordered[1].evidence_excerpt).toContain('langgraph')
  })
})
