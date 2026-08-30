import { describe, expect, it } from 'vitest'
import type { SearchResult } from './state'
import { buildRecommendationSearchQuery, isBroadArticleCatalogQuery } from './query-strategy'
import { countUniquePostResults, dedupePostResultsByDocument } from './search-result-format'

describe('recommendation query strategy', () => {
  it('removes catalog filler from a broad Chinese article query', () => {
    expect(buildRecommendationSearchQuery('有哪些課程文章', {
      search_keywords: ['課程', '文章'],
    })).toBe('課程')
  })

  it('falls back to the original query when planner keywords are absent', () => {
    expect(buildRecommendationSearchQuery('有哪些課程文章', {
      search_keywords: [],
    })).toBe('課程')
  })

  it('preserves recommendation when it is part of the requested subject', () => {
    expect(buildRecommendationSearchQuery('有哪些推薦系統文章', {
      search_keywords: ['推薦系統', '文章'],
    })).toBe('推薦系統')
  })

  it('separates broad article catalogs from ordinary recommendations', () => {
    expect(isBroadArticleCatalogQuery('有哪些課程文章')).toBe(true)
    expect(isBroadArticleCatalogQuery('列出大學課程導讀')).toBe(true)
    expect(isBroadArticleCatalogQuery('推薦我 RAG 成本優化文章')).toBe(false)
  })

  it('deduplicates post chunks by slug while preserving separate document chunks', () => {
    const results = dedupePostResultsByDocument([
      makeResult('post-a-1', 'post', 'course-a', 0.6),
      makeResult('post-a-2', 'post', 'course-a', 0.9),
      makeResult('doc-1', 'doc', undefined, 0.7),
      makeResult('doc-2', 'doc', undefined, 0.8),
    ])

    expect(results.map(result => result.chunk_id)).toEqual(['post-a-2', 'doc-1', 'doc-2'])
    expect(countUniquePostResults(results)).toBe(1)
  })
})

function makeResult(
  chunkId: string,
  type: SearchResult['type'],
  slug: string | undefined,
  relevanceScore: number
): SearchResult {
  return {
    claim: chunkId,
    evidence_excerpt: chunkId,
    source_url: slug ? `https://quidproquo.cc/posts/${slug}` : `https://example.com/${chunkId}`,
    chunk_id: chunkId,
    date: '2026-08-30',
    relevance_score: relevanceScore,
    images: [],
    links: [],
    type,
    slug,
    title: slug,
  }
}
