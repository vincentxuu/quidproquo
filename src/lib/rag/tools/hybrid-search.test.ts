import { describe, expect, it } from 'vitest'
import {
  attachSearchMetrics,
  BM25_SHORT_CIRCUIT_THRESHOLD,
  buildFtsQuery,
  getSearchMetrics,
  isPrecisionQuery,
  reciprocalRankFuse,
  RRF_K,
  shouldShortCircuitBm25,
} from './hybrid-search'

describe('buildFtsQuery', () => {
  it('quotes and OR-joins extracted tokens', () => {
    expect(buildFtsQuery('cloudflare d1 batch timeout')).toBe('"cloudflare" OR "d1" OR "batch" OR "timeout"')
  })

  it('drops empty or punctuation-only input', () => {
    expect(buildFtsQuery('  " -  ')).toBeNull()
  })

  it('handles mixed CJK and latin tokens', () => {
    expect(buildFtsQuery('Context Engineering 跟 Prompt Engineering 差在哪'))
      .toBe('"Context" OR "Engineering" OR "Prompt" OR "差在哪"')
  })
})

describe('BM25 short circuit helpers', () => {
  it('detects precision-style queries', () => {
    expect(isPrecisionQuery('D1 batch timeout')).toBe(true)
    expect(isPrecisionQuery('ERR_CONNECTION_RESET')).toBe(true)
    expect(isPrecisionQuery('適合初學者的文章')).toBe(false)
  })

  it('short-circuits when BM25 reaches the threshold', () => {
    expect(shouldShortCircuitBm25(BM25_SHORT_CIRCUIT_THRESHOLD)).toBe(true)
    expect(shouldShortCircuitBm25(BM25_SHORT_CIRCUIT_THRESHOLD - 1)).toBe(false)
    expect(shouldShortCircuitBm25(BM25_SHORT_CIRCUIT_THRESHOLD, false)).toBe(false)
  })

  it('attaches metrics without serializing them into tool results', () => {
    const results = attachSearchMetrics([{ chunk_id: 'a' }], {
      source: 'posts',
      query_kind: 'precision',
      bm25_results: 5,
      vector_results: 0,
      result_count: 1,
      bm25_ms: 12,
      vector_ms: null,
      total_ms: 12,
      skipped_vector: true,
      short_circuit_threshold: BM25_SHORT_CIRCUIT_THRESHOLD,
      estimated_latency_saved_ms: null,
    })

    expect(getSearchMetrics(results)?.skipped_vector).toBe(true)
    expect(JSON.stringify(results)).not.toContain('skipped_vector')
  })
})

describe('reciprocalRankFuse', () => {
  it('promotes overlap across ranked lists', () => {
    const fused = reciprocalRankFuse([
      [
        { chunk_id: 'a', title: 'A' },
        { chunk_id: 'b', title: 'B' },
      ],
      [
        { chunk_id: 'b', title: 'B' },
        { chunk_id: 'c', title: 'C' },
      ],
    ], 3)

    expect(fused.map(row => row.chunk_id)).toEqual(['b', 'a', 'c'])
    expect(fused[0].relevance_score).toBeCloseTo((1 / (RRF_K + 2)) + (1 / (RRF_K + 1)))
  })

  it('respects the final limit', () => {
    const fused = reciprocalRankFuse([
      [{ chunk_id: 'a' }, { chunk_id: 'b' }],
      [{ chunk_id: 'c' }, { chunk_id: 'd' }],
    ], 2)

    expect(fused).toHaveLength(2)
  })
})
