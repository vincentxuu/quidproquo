import { describe, expect, it } from 'vitest'
import { extractMarkdownUrls, normalizeCitationUrl, validateDraft, validateMarkdownStructure, validateMermaidBlocks, validateSourceUrls } from './validation'
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

  it('accepts citations that differ from source_url only by trailing slash, www, scheme or fragment', () => {
    const draft = [
      '[a](https://example.com/post/)',
      '[b](http://example.com/post)',
      '[c](https://www.example.com/post#section)',
      '[d](https://example.com/post?utm=x)',
    ].join('\n')
    expect(validateSourceUrls(draft, { search_results: searchResults })).toEqual([])
  })

  it('accepts URLs that appear inside the evidence excerpt or result links', () => {
    const results: SearchResult[] = [{
      ...searchResults[0],
      evidence_excerpt: 'See [docs](https://developers.cloudflare.com/workers-ai/) and https://example.org/ref.',
      links: [{ text: 'pricing', url: 'https://developers.cloudflare.com/workers-ai/platform/pricing/' }],
    }]
    const draft = '[a](https://developers.cloudflare.com/workers-ai) [b](https://example.org/ref) [c](https://developers.cloudflare.com/workers-ai/platform/pricing)'
    expect(validateSourceUrls(draft, { search_results: results })).toEqual([])
    expect(validateSourceUrls('[x](https://developers.cloudflare.com/other)', { search_results: results })).toHaveLength(1)
  })

  it('maps site-relative citations onto the blog origin before comparing', () => {
    expect(normalizeCitationUrl('/posts/ai/foo/')).toBe('https://quidproquo.cc/posts/ai/foo')
    expect(normalizeCitationUrl('https://www.quidproquo.cc/posts/ai/foo/#x')).toBe('https://quidproquo.cc/posts/ai/foo')
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

  it('fails an empty draft so the pipeline retries instead of answering blank', () => {
    for (const draft of ['', '   ', '\n\t ']) {
      const result = validateDraft({ draft, search_results: searchResults })
      expect(result.passed).toBe(false)
      expect(result.errors).toContain('Draft is empty; the writer produced no content.')
    }
  })
})
