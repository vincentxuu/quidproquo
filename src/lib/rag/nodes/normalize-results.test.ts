import { describe, it, expect } from 'vitest'
import { parseMetadataArrays, orderByRelevance } from './normalize-results'
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
