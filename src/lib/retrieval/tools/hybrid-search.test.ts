import { describe, expect, it } from 'vitest'
import {
  attachSearchMetrics,
  ABSTRACT_RANKING_WEIGHT,
  BM25_SHORT_CIRCUIT_THRESHOLD,
  buildFtsQuery,
  comparableRankingScore,
  getSearchMetrics,
  isWeakRetrieval,
  isPrecisionQuery,
  reciprocalRankFuse,
  RRF_K,
  shouldShortCircuitBm25,
  shouldUseBm25ShortCircuit,
  weightedReciprocalRankFuse,
} from './hybrid-search'

describe('buildFtsQuery', () => {
  it('quotes and OR-joins extracted tokens', () => {
    expect(buildFtsQuery('cloudflare d1 batch timeout')).toBe('"cloudflare" OR "d1" OR "batch" OR "timeout"')
  })

  it('drops empty or punctuation-only input', () => {
    expect(buildFtsQuery('  " -  ')).toBeNull()
  })

  it('handles mixed CJK and latin tokens with 2-grams', () => {
    const result = buildFtsQuery('Context Engineering 跟 Prompt Engineering 差在哪')
    expect(result).toContain('"Context"')
    expect(result).toContain('"Engineering"')
    expect(result).toContain('"Prompt"')
    expect(result).toContain('"差在哪"')
    expect(result).toContain('"差在"')
    expect(result).toContain('"在哪"')
  })

  it('handles unspaced mixed Chinese and English queries', () => {
    const result = buildFtsQuery('我想找入門的ai課程')
    expect(result).toContain('"我想找入門的ai課程"')
    expect(result).toContain('"ai"')
    expect(result).toContain('"課程"')
    expect(result).toContain('"入門"')
    expect(result).toContain('"我想"')
  })

  it('preserves short mixed Han and numeric precision queries', () => {
    expect(buildFtsQuery('正2')).toBe('"正2"')

    const result = buildFtsQuery('正2系統')
    expect(result).toContain('"正2系統"')
    expect(result).toContain('"正2"')
    expect(result).toContain('"系統"')
  })

  it('handles long unspaced Chinese queries with 2-grams', () => {
    const result = buildFtsQuery('推薦新手學習深度學習')
    expect(result).toContain('"推薦"')
    expect(result).toContain('"新手"')
    expect(result).toContain('"學習"')
    expect(result).toContain('"深度"')
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

  it('only applies the BM25-only fast path to precision queries', () => {
    expect(shouldUseBm25ShortCircuit('D1 batch timeout', BM25_SHORT_CIRCUIT_THRESHOLD)).toBe(true)
    expect(shouldUseBm25ShortCircuit('適合初學者的文章', BM25_SHORT_CIRCUIT_THRESHOLD)).toBe(false)
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
    const maxPossibleScore = 2 / (RRF_K + 1)
    expect(fused[0].relevance_score).toBeCloseTo(
      ((1 / (RRF_K + 2)) + (1 / (RRF_K + 1))) / maxPossibleScore
    )
    expect(fused[1].relevance_score).toBeCloseTo(0.5)
  })

  it('respects the final limit', () => {
    const fused = reciprocalRankFuse([
      [{ chunk_id: 'a' }, { chunk_id: 'b' }],
      [{ chunk_id: 'c' }, { chunk_id: 'd' }],
    ], 2)

    expect(fused).toHaveLength(2)
  })
})

describe('weightedReciprocalRankFuse', () => {
  it('lets a higher-weight source win when there is no cross-source agreement', () => {
    const fused = weightedReciprocalRankFuse([
      { weight: 0.5, results: [{ chunk_id: 'keyword-top' }] },
      { weight: 2, results: [{ chunk_id: 'semantic-top' }] },
    ], 2)

    expect(fused.map(row => row.chunk_id)).toEqual(['semantic-top', 'keyword-top'])
  })

  it('ignores shadow-only callers by accepting only supplied visible lists', () => {
    const fused = weightedReciprocalRankFuse([
      { weight: 1, results: [{ chunk_id: 'visible' }] },
    ], 2)

    expect(fused.map(row => row.chunk_id)).toEqual(['visible'])
  })
})

describe('comparable retrieval signals', () => {
  it('keeps RRF agreement ahead of a high abstract cosine score', () => {
    const [rrfMatch] = reciprocalRankFuse([
      [{ chunk_id: 'shared' }],
      [{ chunk_id: 'shared' }],
    ], 1)

    expect(rrfMatch.relevance_score).toBe(1)
    expect(comparableRankingScore({ relevance_score: 0.99, type: 'abstract' }))
      .toBeCloseTo(0.99 * ABSTRACT_RANKING_WEIGHT)
    expect(rrfMatch.relevance_score).toBeGreaterThan(
      comparableRankingScore({ relevance_score: 0.99, type: 'abstract' })
    )
  })

  it('flags empty and low-confidence abstract retrieval for fallback', () => {
    expect(isWeakRetrieval([])).toBe(true)
    expect(isWeakRetrieval([{ relevance_score: 0.7, type: 'abstract' }])).toBe(true)
    expect(isWeakRetrieval([{ relevance_score: 0.9, type: 'abstract' }])).toBe(false)
  })
})
