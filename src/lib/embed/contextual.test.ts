import { describe, it, expect } from 'vitest'
import { buildContextualChunk } from './contextual'

describe('buildContextualChunk', () => {
  it('prepends context for post chunk', () => {
    const result = buildContextualChunk(
      'This is the chunk content.',
      {
        type: 'post',
        title: 'RAG 入門',
        category: 'ai',
        date: '2024-06-01',
      }
    )
    expect(result).toContain('RAG 入門')
    expect(result).toContain('ai')
    expect(result).toContain('2024-06-01')
    expect(result).toContain('This is the chunk content.')
  })

  it('prepends context for doc chunk', () => {
    const result = buildContextualChunk('Doc content.', {
      type: 'doc',
      sourceName: 'Cloudflare D1',
      sourceUrl: 'https://developers.cloudflare.com/d1/',
    })
    expect(result).toContain('Cloudflare D1')
    expect(result).toContain('Doc content.')
  })

  it('returns original content unchanged if no context provided', () => {
    const result = buildContextualChunk('Raw content.', { type: 'post' })
    expect(result).toContain('Raw content.')
  })
})
