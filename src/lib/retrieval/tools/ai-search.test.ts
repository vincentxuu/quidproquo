import { beforeEach, describe, expect, it, vi } from 'vitest'
import { env } from 'cloudflare:workers'
import { getSearchMetrics } from './hybrid-search'
import { searchAiSearch } from './ai-search'

const workerEnv = env as Record<string, unknown>

describe('searchAiSearch', () => {
  beforeEach(() => {
    for (const key of Object.keys(workerEnv)) {
      delete workerEnv[key]
    }
  })

  it('normalizes AI Search chunks into SearchResult rows', async () => {
    workerEnv.AI_SEARCH = {
      search: vi.fn(async () => ({
        chunks: [
          {
            id: 'chunk-1',
            text: 'Cloudflare AI Search can retrieve site content.',
            score: 0.82,
            item: {
              key: '/posts/cloudflare-ai-search',
              metadata: {
                type: 'post',
                title: 'Cloudflare AI Search',
                slug: 'cloudflare-ai-search',
                date: '2026-08-29',
                url: '/posts/cloudflare-ai-search',
              },
            },
          },
        ],
      })),
    }

    const results = await searchAiSearch({
      query: 'Cloudflare AI Search',
      lang: 'en',
      limit: 5,
      timeoutMs: 1000,
      metadataFiltersEnabled: true,
    })

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      title: 'Cloudflare AI Search',
      slug: 'cloudflare-ai-search',
      type: 'post',
      source_url: 'https://quidproquo.cc/posts/cloudflare-ai-search',
      relevance_score: 0.82,
    })
    expect(getSearchMetrics(results)).toMatchObject({
      source: 'ai_search',
      result_count: 1,
    })
  })

  it('returns an empty result set when no binding is available', async () => {
    await expect(searchAiSearch({
      query: 'RAG',
      lang: 'zh-TW',
      limit: 5,
      timeoutMs: 1000,
      metadataFiltersEnabled: true,
    })).resolves.toEqual([])
  })
})
