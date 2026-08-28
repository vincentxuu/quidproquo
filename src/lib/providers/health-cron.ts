import type { Env } from '../config/env'
import type { Flags } from '../config/flags'
import { listByCategory } from './registry'
import { recordHealth } from './health'
import { D1ProviderHealthStore } from './storage/d1/health-store'
import { createInMemoryProviderBackends } from './storage/test/in-memory'
import type { ProviderBackends } from './storage/types'

// HEAD probe endpoints for each provider
const PROBE_URLS: Record<string, string> = {
  'search.tavily': 'https://api.tavily.com/health',
  'search.exa': 'https://api.exa.ai',
  'search.jina': 'https://s.jina.ai',
  'reader.directFetch': 'https://example.com',
  'reader.jina': 'https://r.jina.ai',
  'reader.firecrawl': 'https://api.firecrawl.dev',
}

async function probeProvider(providerId: string): Promise<{ isHealthy: boolean; latencyMs: number; error?: string }> {
  const url = PROBE_URLS[providerId]
  if (!url) {
    // No probe defined — skip (e.g. llm.*)
    return { isHealthy: true, latencyMs: 0 }
  }

  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(100),
    })
    const latencyMs = Date.now() - start
    // 2xx or 3xx = healthy; 4xx from auth = still reachable = healthy
    const isHealthy = res.status < 500
    return { isHealthy, latencyMs }
  } catch (err) {
    const latencyMs = Date.now() - start
    const message = err instanceof Error ? err.message : String(err)
    return { isHealthy: false, latencyMs, error: message }
  }
}

export async function runHealthSweep(env: Env, flags: Flags): Promise<void> {
  if (!flags.providers.routing.healthChecks) return

  const db = (env as unknown as { DB?: D1Database }).DB
  const backends: ProviderBackends = {
    ...createInMemoryProviderBackends(),
    ...(db ? { health: new D1ProviderHealthStore(db) } : {}),
  }

  const categories = ['llm', 'search', 'reader'] as const
  const results: Array<{ providerId: string; isHealthy: boolean; latencyMs: number; skipped?: boolean }> = []

  for (const category of categories) {
    const providers = listByCategory(category)
    for (const provider of providers) {
      const { providerId } = provider

      // Skip LLM providers — too expensive to probe
      if (category === 'llm') {
        results.push({ providerId, isHealthy: true, latencyMs: 0, skipped: true })
        continue
      }

      const { isHealthy, latencyMs, error } = await probeProvider(providerId)
      await recordHealth({ providerId, isHealthy, latencyMs, error, backends })
      results.push({ providerId, isHealthy, latencyMs })
    }
  }

  console.log(
    '[health-cron] sweep complete:',
    results
      .map((r) => `${r.providerId}=${r.skipped ? 'skipped' : r.isHealthy ? 'ok' : 'fail'}(${r.latencyMs}ms)`)
      .join(', '),
  )
}
