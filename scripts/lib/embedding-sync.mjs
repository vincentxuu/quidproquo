/** Incremental sync retries resume server checkpoints; a reset is never replayed. */
export async function runEmbeddingSync({
  origin, secret, limit = 20, maxBatches = 500, maxRetries = 5, full = false, maxDurationMs = 600000, now = Date.now,
  fetch: request = globalThis.fetch,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  log = console.log,
}) {
  if (!secret) throw new Error('INDEX_SYNC_SECRET is required to run production embedding sync')
  for (const [name, value, min, max] of [
    ['limit', limit, 1, 500], ['maxBatches', maxBatches, 1, 100000], ['maxRetries', maxRetries, 0, 10], ['maxDurationMs', maxDurationMs, 1, 3600000],
  ]) {
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer from ${min} to ${max}`)
  }
  const endpoint = new URL('/api/embed/sync', origin)
  if (!['http:', 'https:'].includes(endpoint.protocol)) throw new Error('Expected an HTTP(S) Worker origin')
  const deadline = now() + maxDurationMs
  let currentLimit = limit, totalVectors = 0, totalDeleted = 0, batches = 0, hasMore = true
  while (hasMore && batches < maxBatches) {
    const reset = full && batches === 0
    let payload
    for (let attempt = 0; ; attempt++) {
      const remaining = deadline - now()
      if (remaining <= 0) throw new Error('Embedding sync time budget exhausted; pending work remains')
      let response, text = '', failure
      try {
        response = await request(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Index-Sync-Secret': secret },
          body: JSON.stringify({ sources: ['posts'], limit: currentLimit, full: reset }),
          signal: AbortSignal.timeout(Math.min(60000, remaining)),
        })
        text = await response.text()
      } catch (error) {
        failure = error
      }
      const resourceLimit = response?.status === 503 && /1102|Worker exceeded resource limits/i.test(text)
      const transient = failure || [429, 502, 503, 504].includes(response?.status)
      if (!failure && response.ok) {
        try { payload = JSON.parse(text) } catch { throw new Error('Embedding sync returned invalid JSON') }
        break
      }
      const status = response ? `HTTP ${response.status}` : 'network/timeout failure'
      const detail = `${status}${resourceLimit ? ' (Worker resource limit)' : ''}; limit=${currentLimit}`
      // A failed response may follow a committed reset. Retrying full=true could
      // erase checkpoints again, so operators must resume incrementally instead.
      if (reset) throw new Error(`Full rebuild response failed: ${detail}. Reset outcome is unknown; inspect state and resume without --full.`)
      if (!transient || attempt >= maxRetries) throw new Error(`Embedding sync failed: ${detail}; retries=${attempt}`)
      if (resourceLimit) currentLimit = Math.max(1, Math.floor(currentLimit / 2))
      const retryAfter = Number(response?.headers.get('Retry-After'))
      const delay = Math.min(30000, Math.max(500 * 2 ** attempt, Number.isFinite(retryAfter) ? retryAfter * 1000 : 0))
      log(`[embed-sync] retry=${attempt + 1}/${maxRetries} ${detail} nextLimit=${currentLimit} delayMs=${delay}`)
      if (delay >= deadline - now()) throw new Error('Embedding sync time budget exhausted before retry; pending work remains')
      await sleep(delay)
    }
    if (!payload?.ok) throw new Error('Embedding sync response reported failure')
    const result = payload.results?.find?.(item => item.source === 'posts')
    if (!result) throw new Error('Embedding sync response did not include a posts result')
    if (result.errors?.length) throw new Error(`Embedding sync returned errors: ${JSON.stringify(result.errors.slice(0, 20))}`)
    if (![result.vectors, result.deleted].every(value => Number.isInteger(value) && value >= 0) || typeof result.hasMore !== 'boolean') {
      throw new Error('Embedding sync returned an invalid progress result')
    }
    if (result.hasMore && result.vectors + result.deleted === 0) throw new Error('Embedding sync made no progress; pending work remains')
    totalVectors += result.vectors
    totalDeleted += result.deleted
    hasMore = result.hasMore
    batches++
    log(`[embed-sync] batch=${batches} limit=${currentLimit} vectors=${result.vectors} deleted=${result.deleted} hasMore=${hasMore}`)
  }
  if (hasMore && full) throw new Error(`Full rebuild paused after ${maxBatches} batches; pending work remains; resume without --full`)
  log(hasMore ? `[embed-sync] paused after ${maxBatches} batches; pending work remains` : `[embed-sync] complete batches=${batches} vectors=${totalVectors} deleted=${totalDeleted}`)
  return { batches, totalVectors, totalDeleted, hasMore, limit: currentLimit }
}
