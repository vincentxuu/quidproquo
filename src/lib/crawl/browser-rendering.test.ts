import { describe, expect, it } from 'vitest'
import { createCrawlRequest } from './browser-rendering'
import type { CrawlTarget } from './config'

const target: CrawlTarget = {
  name: 'Docs',
  url: 'https://example.com/docs/',
  includePatterns: ['/docs/**'],
  limit: 25,
  render: false,
}

describe('createCrawlRequest', () => {
  it('builds a markdown crawl request for a target', () => {
    expect(createCrawlRequest(target)).toEqual({
      url: 'https://example.com/docs/',
      formats: ['markdown'],
      limit: 25,
      render: false,
      source: 'sitemaps',
      maxAge: 604800,
      options: {
        includePatterns: ['/docs/**'],
      },
    })
  })

  it('passes modifiedSince when provided', () => {
    expect(createCrawlRequest(target, { modifiedSince: 1770000000 })).toMatchObject({
      modifiedSince: 1770000000,
    })
  })
})
