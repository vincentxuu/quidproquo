import { describe, expect, it } from 'vitest'
import type { CloudPost } from './content-posts'
import { buildKnownPostRoutes, runPostQualityCheck } from './post-quality'

function post(slug: string, content: string): CloudPost {
  return {
    id: slug,
    slug,
    title: 'T',
    category: 'ai',
    lang: slug.endsWith('-en') ? 'en' : 'zh-TW',
    description: null,
    tldr: null,
    content,
    tags: [],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  }
}

const linkErrors = (reports: ReturnType<typeof runPostQualityCheck>) =>
  reports.flatMap((r) => r.findings).filter((f) => f.message.startsWith('內部文章連結不存在'))

describe('post quality internal links', () => {
  const zh = post('ai/2026-01-01-x', 'body')
  const en = post('ai/2026-01-01-x-en', 'body')

  it('knows only the real /posts/<slug> routes (English posts live at /posts/<slug>-en)', () => {
    expect([...buildKnownPostRoutes([zh, en])].sort()).toEqual([
      '/posts/ai/2026-01-01-x',
      '/posts/ai/2026-01-01-x-en',
    ])
  })

  it('accepts a link to the English post at its real route', () => {
    const src = post('ai/2026-01-02-y', '> 🌏 [English version](/posts/ai/2026-01-01-x-en)')
    expect(linkErrors(runPostQualityCheck([src, zh, en]))).toEqual([])
  })

  it('rejects the non-existent /en/posts/ route', () => {
    const src = post('ai/2026-01-02-y', '> 🌏 [English version](/en/posts/ai/2026-01-01-x-en)')
    expect(linkErrors(runPostQualityCheck([src, zh, en]))).toHaveLength(1)
  })
})
