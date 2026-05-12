#!/usr/bin/env node

const origin = process.env.WORKER_URL || process.env.CF_PAGES_URL || 'https://quidproquo.cc'
const secret = process.env.CRAWL_SECRET
const dryRun = process.env.RAG_TRACE_RETENTION_DRY_RUN === '1' || process.env.RAG_TRACE_RETENTION_DRY_RUN === 'true'
const scope = process.env.RAG_TRACE_RETENTION_SCOPE || 'all'

if (!secret) {
  console.error('[rag-trace-retention] CRAWL_SECRET is required')
  process.exit(1)
}

const response = await fetch(`${origin}/api/admin/traces/retention`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Crawl-Secret': secret,
  },
  body: JSON.stringify({
    scope: ['production', 'admin', 'all'].includes(scope) ? scope : 'all',
    dryRun,
  }),
})

const resultText = await response.text()
if (!response.ok) {
  console.error('[rag-trace-retention] Failed:', resultText)
  process.exit(1)
}

console.log(resultText)
