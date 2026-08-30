import assert from 'node:assert/strict'
import test from 'node:test'
import retrievalContract from './assertions/retrieval-contract.mjs'

const config = {
  requiredSources: ['learning/stanford', 'learning/mit'],
  forbiddenSources: ['tech/cache-rules'],
  minUniqueSources: 2,
  maxLatencyMs: 3000,
  requireUncached: true,
}

test('passes a complete unique retrieval result', () => {
  const result = retrievalContract('兩篇課程導讀', {
    config,
    metadata: {
      sources: [
        { slug: 'learning/stanford', url: 'https://quidproquo.cc/posts/learning/stanford' },
        { slug: 'learning/mit', url: 'https://quidproquo.cc/posts/learning/mit' },
      ],
      latencyMs: 1200,
      cached: false,
      error: null,
    },
  })
  assert.equal(result.pass, true)
})

test('fails missing, forbidden, duplicate, cached, and slow retrieval evidence', () => {
  const duplicate = { slug: 'tech/cache-rules', url: 'https://quidproquo.cc/posts/tech/cache-rules' }
  const result = retrievalContract('看似流暢的回答', {
    config,
    metadata: {
      sources: [duplicate, duplicate],
      latencyMs: 4000,
      cached: true,
      error: null,
    },
  })
  assert.equal(result.pass, false)
  assert.match(result.reason, /Missing required sources/)
  assert.match(result.reason, /Forbidden sources found/)
  assert.match(result.reason, /Semantic-cache response/)
  assert.match(result.reason, /Latency/)
})

test('fails an empty answer or provider error', () => {
  const result = retrievalContract('', {
    config: { minUniqueSources: 0, requireUncached: false },
    metadata: { sources: [], latencyMs: 0, error: 'stream failed' },
  })
  assert.equal(result.pass, false)
  assert.match(result.reason, /Answer must not be empty/)
  assert.match(result.reason, /Provider error/)
})

test('detects a forbidden source named only in cached answer text', () => {
  const result = retrievalContract('仍然列出 Cloudflare Cache Rules', {
    config: {
      ...config,
      forbiddenSources: ['tech/2026-03-12-cloudflare-cache-rules'],
    },
    metadata: { sources: [], latencyMs: 100, cached: true, error: null },
  })

  assert.equal(result.pass, false)
  assert.match(result.reason, /Forbidden sources found: tech\/2026-03-12-cloudflare-cache-rules/)
})
