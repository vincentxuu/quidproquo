import { describe, it, expect } from 'vitest'
import { applyMmrOrdering, parseMetadataArrays, orderByRelevance, rerankByQuery } from './normalize-results'
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
