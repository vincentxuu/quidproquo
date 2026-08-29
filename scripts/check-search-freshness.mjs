#!/usr/bin/env node

const origin = process.env.SEARCH_FRESHNESS_BASE_URL || process.env.WORKER_URL || process.env.CF_PAGES_URL || 'https://quidproquo.cc'
const mode = process.env.SEARCH_FRESHNESS_MODE || 'hybrid'
const limit = Number(process.env.SEARCH_FRESHNESS_LIMIT ?? '50')
const defaultChecks = [
  { query: '免費搜尋', slug: 'ai/2026-08-21-free-search-scraping-tools' },
  { query: '正2', slug: 'investing/2026-06-19-2x-etf-system-three-books' },
]

let checks = defaultChecks
if (process.env.SEARCH_FRESHNESS_CHECKS) {
  try {
    checks = JSON.parse(process.env.SEARCH_FRESHNESS_CHECKS)
  } catch (error) {
    console.error('SEARCH_FRESHNESS_CHECKS must be valid JSON')
    console.error(error)
    process.exit(1)
  }
}

if (!Array.isArray(checks) || checks.length === 0) {
  console.error('At least one search freshness check is required')
  process.exit(1)
}

let failed = 0
for (const check of checks) {
  const query = String(check.query ?? '').trim()
  const slug = String(check.slug ?? '').trim()
  if (!query || !slug) {
    console.error('Each freshness check needs query and slug')
    failed += 1
    continue
  }

  const url = new URL('/api/search', origin)
  url.searchParams.set('q', query)
  url.searchParams.set('mode', mode)
  url.searchParams.set('limit', String(limit))

  const response = await fetch(url)
  const payload = await response.json().catch(() => ({}))
  const results = Array.isArray(payload.results) ? payload.results : []
  const found = results.some(result => String(result.url ?? result.source_url ?? '').includes(`/posts/${slug}`))

  console.log(`[search-freshness] query="${query}" slug="${slug}" found=${found} results=${results.length}`)
  if (!response.ok || !found) failed += 1
}

if (failed > 0) {
  console.error(`[search-freshness] ${failed} check(s) failed`)
  process.exit(1)
}

console.log('[search-freshness] all checks passed')
