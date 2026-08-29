#!/usr/bin/env node

const origin = process.env.WORKER_URL || process.env.CF_PAGES_URL || 'https://quidproquo.cc'
const secret = process.env.CRAWL_SECRET
const limit = Number(process.env.EMBED_SYNC_LIMIT ?? '80')
const maxBatches = Number(process.env.EMBED_SYNC_MAX_BATCHES ?? '500')

if (!secret) {
  console.error('CRAWL_SECRET is required to run production embedding sync')
  process.exit(1)
}

if (!Number.isInteger(limit) || limit <= 0) {
  console.error('EMBED_SYNC_LIMIT must be a positive integer')
  process.exit(1)
}

let offset = Number(process.env.EMBED_SYNC_OFFSET ?? '0')
if (!Number.isInteger(offset) || offset < 0) {
  console.error('EMBED_SYNC_OFFSET must be a non-negative integer')
  process.exit(1)
}

let totalVectors = 0
let batchCount = 0
let hasMore = true

while (hasMore && batchCount < maxBatches) {
  batchCount += 1
  const response = await fetch(`${origin}/api/embed/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Crawl-Secret': secret,
    },
    body: JSON.stringify({ sources: ['posts'], offset, limit }),
  })

  const text = await response.text()
  let payload
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    payload = { raw: text }
  }

  if (!response.ok || !payload.ok) {
    console.error('Embedding sync failed', JSON.stringify({
      status: response.status,
      offset,
      limit,
      payload,
    }, null, 2))
    process.exit(1)
  }

  const postResult = payload.results?.find?.(result => result.source === 'posts')
  if (!postResult) {
    console.error('Embedding sync response did not include a posts result')
    console.error(JSON.stringify(payload, null, 2))
    process.exit(1)
  }

  if (postResult.errors?.length) {
    console.error('Embedding sync returned errors')
    console.error(JSON.stringify(postResult.errors.slice(0, 20), null, 2))
    process.exit(1)
  }

  totalVectors += Number(postResult.vectors ?? 0)
  hasMore = Boolean(postResult.hasMore)
  offset = Number(postResult.nextOffset ?? offset + limit)
  console.log(`[embed-sync] batch=${batchCount} vectors=${postResult.vectors} nextOffset=${offset} hasMore=${hasMore}`)
}

if (hasMore) {
  console.error(`Embedding sync still has more work after ${maxBatches} batches`)
  process.exit(1)
}

console.log(`[embed-sync] complete batches=${batchCount} vectors=${totalVectors}`)
