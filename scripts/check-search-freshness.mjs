#!/usr/bin/env node

const origin = process.env.SEARCH_FRESHNESS_BASE_URL || process.env.WORKER_URL || process.env.CF_PAGES_URL || 'https://quidproquo.cc'
const mode = process.env.SEARCH_FRESHNESS_MODE || 'keyword'
const limit = Number(process.env.SEARCH_FRESHNESS_LIMIT ?? '50')
const retries = Number(process.env.SEARCH_FRESHNESS_RETRIES ?? '2')
const retryDelayMs = Number(process.env.SEARCH_FRESHNESS_RETRY_DELAY_MS ?? '3000')
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

const sleep = ms => new Promise(r => setTimeout(r, ms))

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

  let found = false
  let resultCount = 0
  let ok = false
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      console.log(`[search-freshness] retry ${attempt}/${retries} after ${retryDelayMs}ms...`)
      await sleep(retryDelayMs)
    }
    const response = await fetch(url)
    ok = response.ok
    const payload = await response.json().catch(() => ({}))
    const results = Array.isArray(payload.results) ? payload.results : []
    resultCount = results.length
    found = results.some(result => String(result.url ?? result.source_url ?? '').includes(`/posts/${slug}`))
    if (ok && found) break
  }

  console.log(`[search-freshness] query="${query}" slug="${slug}" found=${found} results=${resultCount}`)
  if (!ok || !found) failed += 1
}

if (failed > 0) {
  console.error(`[search-freshness] ${failed} check(s) failed`)
  process.exit(1)
}

console.log('[search-freshness] all checks passed')
