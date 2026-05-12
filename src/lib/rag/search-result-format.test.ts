import { describe, expect, it } from 'vitest'
import { dedupeSearchResultsByUrl, formatSearchExcerpt } from './search-result-format'

describe('formatSearchExcerpt', () => {
  it('removes markdown links and code fences from search snippets', () => {
    const excerpt = formatSearchExcerpt(`
### 生產營運路線
如果你要把 RAG 系統上生產：[RAG Guardrails](/posts/ai/rag-guardrails)

\`\`\`
RAG 技術體系全景
│ │ │ ┌──── 十代演化
│ Gen 1: Naive RAG │ Gen 2: Advanced RAG
\`\`\`
`)

    expect(excerpt).toContain('生產營運路線')
    expect(excerpt).toContain('RAG Guardrails')
    expect(excerpt).not.toContain('```')
    expect(excerpt).not.toContain('/posts/')
    expect(excerpt).not.toContain('│')
  })

  it('clips long snippets', () => {
    const excerpt = formatSearchExcerpt('成本優化 '.repeat(80), 60)

    expect(excerpt.length).toBeLessThanOrEqual(63)
    expect(excerpt.endsWith('...')).toBe(true)
  })
})

describe('dedupeSearchResultsByUrl', () => {
  it('keeps the highest scoring result for each URL', () => {
    const results = dedupeSearchResultsByUrl([
      { source_url: '/a', relevance_score: 0.1, chunk_id: 'a1' },
      { source_url: '/b', relevance_score: 0.2, chunk_id: 'b1' },
      { source_url: '/a', relevance_score: 0.3, chunk_id: 'a2' },
    ])

    expect(results).toHaveLength(2)
    expect(results.find(result => result.source_url === '/a')?.chunk_id).toBe('a2')
  })
})
