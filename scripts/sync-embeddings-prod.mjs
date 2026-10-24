#!/usr/bin/env node

const origin = process.env.WORKER_URL || process.env.CF_PAGES_URL || 'https://quidproquo.cc'
const secret = process.env.INDEX_SYNC_SECRET

function readNumberFlag(name, fallback) {
  const exactIndex = process.argv.indexOf(name)
  if (exactIndex >= 0) return Number(process.argv[exactIndex + 1])

  const prefix = `${name}=`
  const inline = process.argv.find(arg => arg.startsWith(prefix))
  return inline ? Number(inline.slice(prefix.length)) : Number(fallback)
}

try {
  const { runEmbeddingSync } = await import('./lib/embedding-sync.mjs')
  await runEmbeddingSync({
    origin, secret,
    limit: readNumberFlag('--limit', process.env.EMBED_SYNC_LIMIT ?? '20'),
    maxBatches: readNumberFlag('--max-batches', process.env.EMBED_SYNC_MAX_BATCHES ?? '500'),
    maxRetries: readNumberFlag('--max-retries', process.env.EMBED_SYNC_MAX_RETRIES ?? '5'),
    maxDurationMs: readNumberFlag('--max-duration-ms', process.env.EMBED_SYNC_MAX_DURATION_MS ?? '600000'),
    full: process.argv.includes('--full'),
  })
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
