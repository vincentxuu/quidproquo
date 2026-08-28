import { describe, expect, it } from 'vitest'
import { extractMarkdownUrls, validateDraft, validateMarkdownStructure, validateMermaidBlocks, validateSourceUrls } from './validation'
import type { SearchResult } from '../state'

const searchResults: SearchResult[] = [
  {
    claim: 'claim',
    evidence_excerpt: 'evidence',
    source_url: 'https://example.com/post',
    chunk_id: 'chunk-1',
    date: '2026-05-12',
    relevance_score: 0.9,
    images: ['https://example.com/image.png'],
    links: [],
    type: 'post',
    slug: 'post',
    title: 'Post',
  },
]

describe('validation helpers', () => {
  it('flags unbalanced markdown fences', () => {
    expect(validateMarkdownStructure('```ts\nconst x = 1;\n')).toContain('Unbalanced Markdown code fences.')
  })

  it('extracts citation and image urls separately', () => {
    expect(extractMarkdownUrls('[source](https://example.com/post)\n![img](https://example.com/image.png)')).toEqual({
      citationUrls: ['https://example.com/post'],
      imageUrls: ['https://example.com/image.png'],
    })
  })

  it('flags citations outside retrieved sources', () => {
    expect(validateSourceUrls('[bad](https://other.com)', { search_results: searchResults })).toContain(
      'Unknown citation URL(s): https://other.com'
    )
  })

  it('accepts valid mermaid blocks and rejects invalid ones', () => {
    expect(validateMermaidBlocks('```mermaid\nflowchart TD\nA --> B\n```')).toEqual([])
    expect(validateMermaidBlocks('```mermaid\nA --> B\n```')[0]).toContain('Mermaid block must start with a valid diagram type')
  })

  it('combines deterministic checks into a failed validation result', () => {
    const result = validateDraft({
      draft: '[bad](https://other.com)\n```mermaid\nA --> B\n```',
      search_results: searchResults,
    })

    expect(result.passed).toBe(false)
    expect(result.errors).toEqual([
      'Unknown citation URL(s): https://other.com',
      'Mermaid block must start with a valid diagram type, got: A --> B',
    ])
  })
})
