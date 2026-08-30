#!/usr/bin/env node

const origin = process.env.WORKER_URL || process.env.CF_PAGES_URL || 'https://quidproquo.cc'
const secret = process.env.INDEX_SYNC_SECRET
const MAX_API_LIMIT = 500

function readNumberFlag(name, fallback) {
  const exactIndex = process.argv.indexOf(name)
  if (exactIndex >= 0) return Number(process.argv[exactIndex + 1])

  const prefix = `${name}=`
  const inline = process.argv.find(arg => arg.startsWith(prefix))
  return inline ? Number(inline.slice(prefix.length)) : Number(fallback)
}

const limit = readNumberFlag('--limit', process.env.EMBED_SYNC_LIMIT ?? '80')
const maxBatches = readNumberFlag('--max-batches', process.env.EMBED_SYNC_MAX_BATCHES ?? '500')
const full = process.argv.includes('--full')

if (!secret) {
  console.error('INDEX_SYNC_SECRET is required to run production embedding sync')
  process.exit(1)
}

if (!Number.isInteger(limit) || limit <= 0 || limit > MAX_API_LIMIT) {
  console.error(`Embedding sync limit must be an integer from 1 to ${MAX_API_LIMIT}`)
  process.exit(1)
}

if (!Number.isInteger(maxBatches) || maxBatches <= 0) {
  console.error('EMBED_SYNC_MAX_BATCHES must be a positive integer')
  process.exit(1)
}

let totalVectors = 0
let totalDeleted = 0
let batchCount = 0
let hasMore = true

while (hasMore && batchCount < maxBatches) {
  batchCount += 1
  const response = await fetch(`${origin}/api/embed/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Index-Sync-Secret': secret,
    },
    body: JSON.stringify({ sources: ['posts'], limit, full: full && batchCount === 1 }),
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
  totalDeleted += Number(postResult.deleted ?? 0)
  hasMore = Boolean(postResult.hasMore)
  console.log(`[embed-sync] batch=${batchCount} vectors=${postResult.vectors} deleted=${postResult.deleted ?? 0} hasMore=${hasMore}`)
}

if (hasMore) {
  const message = `[embed-sync] paused after ${maxBatches} batches; pending work remains`
  if (full) {
    console.error(message)
    process.exit(1)
  }
  console.log(message)
  process.exit(0)
}

console.log(`[embed-sync] complete batches=${batchCount} vectors=${totalVectors} deleted=${totalDeleted}`)
