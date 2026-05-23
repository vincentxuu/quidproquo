import type { HealthSnapshot } from '../../types'
import type { ProviderHealthStoreBackend } from '../types'

interface HealthRow {
  snapshot_id: string
  provider_id: string
  observed_at: number
  is_healthy: number
  p50_latency_ms: number | null
  p95_latency_ms: number | null
  success_rate_pct: number | null
  sample_size: number
  error_json: string | null
}

function rowToSnapshot(row: HealthRow): HealthSnapshot {
  return {
    snapshotId: row.snapshot_id,
    providerId: row.provider_id,
    observedAt: row.observed_at,
    isHealthy: row.is_healthy === 1,
    p50LatencyMs: row.p50_latency_ms,
    p95LatencyMs: row.p95_latency_ms,
    successRatePct: row.success_rate_pct,
    sampleSize: row.sample_size,
    errorJson: row.error_json,
  }
}

export class D1ProviderHealthStore implements ProviderHealthStoreBackend {
  constructor(private readonly db: D1Database) {}

  async append(snapshot: HealthSnapshot): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO provider_health_snapshots
         (snapshot_id, provider_id, observed_at, is_healthy, p50_latency_ms, p95_latency_ms, success_rate_pct, sample_size, error_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        snapshot.snapshotId,
        snapshot.providerId,
        snapshot.observedAt,
        snapshot.isHealthy ? 1 : 0,
        snapshot.p50LatencyMs,
        snapshot.p95LatencyMs,
        snapshot.successRatePct,
        snapshot.sampleSize,
        snapshot.errorJson,
      )
      .run()
  }

  async queryRecent(opts: { providerId: string; windowMs: number }): Promise<HealthSnapshot[]> {
    const cutoff = Date.now() - opts.windowMs
    const result = await this.db
      .prepare(
        `SELECT * FROM provider_health_snapshots
         WHERE provider_id = ? AND observed_at > ?
         ORDER BY observed_at DESC`,
      )
      .bind(opts.providerId, cutoff)
      .all<HealthRow>()
    return (result.results ?? []).map(rowToSnapshot)
  }
}
