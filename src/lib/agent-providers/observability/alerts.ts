import type { Env } from '../../config/env'
import type { Flags } from '../../config/flags'

interface AlertCheckResult {
  allHealthy: boolean
  warnings: string[]
}

export async function checkProviderHealth(env: Env, flags: Flags): Promise<AlertCheckResult> {
  if (!flags.providers?.enabled) return { allHealthy: true, warnings: [] }

  const warnings: string[] = []

  try {
    // Check 1: Any category with 0 healthy providers
    const healthRows = await env.DB?.prepare(
      `SELECT category, COUNT(*) as total, SUM(CASE WHEN is_healthy=1 THEN 1 ELSE 0 END) as healthy
       FROM provider_health_snapshots
       WHERE recorded_at > unixepoch()-3600
       GROUP BY category`
    )
      .all()
      .catch(() => ({ results: [] }))

    for (const row of (healthRows?.results ?? []) as { category: string; total: number; healthy: number }[]) {
      if (row.healthy === 0) {
        warnings.push(`WARN: category '${row.category}' has 0 healthy providers`)
      }
    }

    // Check 2: AllProvidersFailed count > 5 in last hour
    const failCount = await env.DB?.prepare(
      `SELECT COUNT(*) as cnt FROM agent_run_events
       WHERE event_type='AllProvidersFailed' AND created_at > unixepoch()-3600`
    )
      .first<{ cnt: number }>()
      .catch(() => null)

    if ((failCount?.cnt ?? 0) > 5) {
      warnings.push(`WARN: AllProvidersFailed occurred ${failCount?.cnt} times in last hour`)
    }

    // Check 3: Stale action approvals (pending > 6h)
    const staleApprovals = await env.DB?.prepare(
      `SELECT COUNT(*) as cnt FROM agent_approval_requests
       WHERE status='pending' AND scope LIKE 'action.%' AND created_at < unixepoch()-21600`
    )
      .first<{ cnt: number }>()
      .catch(() => null)

    if ((staleApprovals?.cnt ?? 0) > 0) {
      warnings.push(`WARN: ${staleApprovals?.cnt} action approval(s) pending >6h`)
    }
  } catch {
    // Non-fatal — health check should not crash the cron
  }

  return { allHealthy: warnings.length === 0, warnings }
}
