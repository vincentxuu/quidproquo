import type { ProviderBackends } from './storage/types'

const DEFAULT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function computePercentile(sorted: number[], pct: number): number | null {
  if (sorted.length === 0) return null
  const idx = Math.ceil((pct / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)]
}

export async function recordHealth(opts: {
  providerId: string
  isHealthy: boolean
  latencyMs?: number
  error?: string
  backends: ProviderBackends
}): Promise<void> {
  const { providerId, isHealthy, latencyMs, error, backends } = opts

  const snapshotId = `${providerId}:${Date.now()}:${Math.random().toString(36).slice(2)}`
  const now = Date.now()

  await backends.health.append({
    snapshotId,
    providerId,
    observedAt: now,
    isHealthy,
    p50LatencyMs: latencyMs ?? null,
    p95LatencyMs: latencyMs ?? null,
    successRatePct: null,
    sampleSize: 1,
    errorJson: error ? JSON.stringify({ message: error }) : null,
  })
}

export async function getHealth(opts: {
  providerId: string
  windowMs?: number
  backends: ProviderBackends
}): Promise<{
  p50LatencyMs: number | null
  p95LatencyMs: number | null
  successRatePct: number | null
  sampleSize: number
}> {
  const { providerId, windowMs = DEFAULT_WINDOW_MS, backends } = opts

  const snapshots = await backends.health.queryRecent({ providerId, windowMs })

  if (snapshots.length === 0) {
    return { p50LatencyMs: null, p95LatencyMs: null, successRatePct: null, sampleSize: 0 }
  }

  const latencies = snapshots
    .map((s) => s.p50LatencyMs)
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b)

  const healthyCount = snapshots.filter((s) => s.isHealthy).length

  return {
    p50LatencyMs: computePercentile(latencies, 50),
    p95LatencyMs: computePercentile(latencies, 95),
    successRatePct: snapshots.length > 0 ? (healthyCount / snapshots.length) * 100 : null,
    sampleSize: snapshots.length,
  }
}
