import { describe, expect, it } from 'vitest'
import {
  CONTENT_CHUNK_CAP,
  buildKeywordQueryPlan,
  compileKeywordSql,
  keywordRelevanceScore,
  keywordRowToResult,
  tokenizeKeywordQuery,
} from './keyword-posts'

describe('tokenizeKeywordQuery', () => {
  it('splits on whitespace and Han/non-Han boundaries, keeping order and dropping duplicates', () => {
    expect(tokenizeKeywordQuery('RAG 微調LoRA rag')).toEqual(['RAG', '微調', 'LoRA', 'rag'])
  })

  it('keeps hyphenated identifiers as one token', () => {
    expect(tokenizeKeywordQuery('Self-RAG')).toEqual(['Self-RAG'])
  })
})

describe('buildKeywordQueryPlan', () => {
  it('uses trigram MATCH for a single term of three or more characters', () => {
    expect(buildKeywordQueryPlan('rag')).toEqual({ match: '"rag"', likeTerms: [] })
  })

  it('falls back to LIKE for two-character Latin queries trigram cannot index', () => {
    expect(buildKeywordQueryPlan('AI')).toEqual({ match: null, likeTerms: ['AI'] })
  })

  it('falls back to LIKE for two-character Han queries', () => {
    expect(buildKeywordQueryPlan('微調')).toEqual({ match: null, likeTerms: ['微調'] })
  })

  it('keeps mixed Han/digit short words whole for LIKE instead of splitting them into single characters', () => {
    expect(buildKeywordQueryPlan('正2')).toEqual({ match: null, likeTerms: ['正2'] })
    expect(buildKeywordQueryPlan('微調2')).toEqual({ match: '"微調2"', likeTerms: [] })
    expect(buildKeywordQueryPlan('AI 微調')).toEqual({ match: '"AI 微調"', likeTerms: [] })
  })

  it('matches Han phrases of three or more characters directly', () => {
    expect(buildKeywordQueryPlan('模型家族')).toEqual({ match: '"模型家族"', likeTerms: [] })
  })

  it('adds the whole phrase ahead of individual long tokens and drops short leftovers', () => {
    expect(buildKeywordQueryPlan('AI  agent')).toEqual({ match: '"AI agent" OR "agent"', likeTerms: [] })
  })

  it('escapes double quotes inside FTS terms', () => {
    expect(buildKeywordQueryPlan('say "hi" there').match).toBe('"say ""hi"" there" OR "say" OR "there"')
  })

  it('returns an empty plan for single characters and whitespace', () => {
    expect(buildKeywordQueryPlan(' a ')).toEqual({ match: null, likeTerms: [] })
    expect(buildKeywordQueryPlan('   ')).toEqual({ match: null, likeTerms: [] })
  })
})

describe('compileKeywordSql', () => {
  it('returns null when the plan has nothing to search', () => {
    expect(compileKeywordSql({ match: null, likeTerms: [] })).toBeNull()
  })

  it('binds the MATCH expression for both posts_fts and the capped chunks_fts scan', () => {
    const compiled = compileKeywordSql({ match: '"rag"', likeTerms: [] })
    expect(compiled?.params).toEqual(['"rag"', '"rag"'])
    expect(compiled?.ctes).toContain('posts_fts MATCH ?')
    expect(compiled?.ctes).toContain(`ORDER BY rowid DESC LIMIT ${CONTENT_CHUNK_CAP}`)
    expect(compiled?.ctes).not.toContain('LIKE')
  })

  it('serves LIKE-only plans from posts_fts columns and skips the chunk scan', () => {
    const compiled = compileKeywordSql({ match: null, likeTerms: ['AI'] })
    expect(compiled?.params).toEqual(['%AI%', '%AI%', '%AI%', '%AI%'])
    expect(compiled?.ctes).toContain('title LIKE ? OR description LIKE ? OR tldr LIKE ? OR tags LIKE ?')
    expect(compiled?.ctes).not.toContain('chunks_fts MATCH')
    expect(compiled?.ctes).toContain('SELECT NULL AS post_id WHERE 0')
  })
})

describe('keyword result shaping', () => {
  it('decays relevance by position with a floor', () => {
    expect(keywordRelevanceScore(0)).toBe(1)
    expect(keywordRelevanceScore(10)).toBeCloseTo(0.9)
    expect(keywordRelevanceScore(200)).toBe(0.4)
  })

  it('prefers tldr, then description, then the content excerpt as evidence', () => {
    const base = {
      slug: 'ai/2026-09-03-self-rag',
      title: 'Self-RAG',
      category: 'ai',
      excerpt: 'body text',
      date: '2026-09-03',
      rank: -3,
    }
    expect(keywordRowToResult({ ...base, description: 'desc', tldr: 'tldr' }, 0).evidence_excerpt).toBe('tldr')
    expect(keywordRowToResult({ ...base, description: 'desc', tldr: null }, 0).evidence_excerpt).toBe('desc')
    expect(keywordRowToResult({ ...base, description: null, tldr: null }, 0).evidence_excerpt).toBe('body text')
    expect(keywordRowToResult({ ...base, description: null, tldr: null }, 0)).toMatchObject({
      chunk_id: 'keyword:ai/2026-09-03-self-rag',
      source_url: 'https://quidproquo.cc/posts/ai/2026-09-03-self-rag',
      type: 'post',
    })
  })
})
