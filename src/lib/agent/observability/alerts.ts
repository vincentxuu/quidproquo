import type { Env } from '@/lib/config/env'

export interface KernelHealthAlert {
  reason: string
  details: Record<string, unknown>
}

interface CountRow {
  value: number | null
}

const DEFAULT_D1_HOURLY_WRITE_WARNING_THRESHOLD = 50_000

export async function checkKernelHealth(
  env: Env,
  options: { d1HourlyWriteWarningThreshold?: number } = {}
): Promise<KernelHealthAlert[]> {
  const now = Date.now()
  const cutoffHour = now - 60 * 60 * 1000
  const cutoff24h = now - 24 * 60 * 60 * 1000
  const threshold = options.d1HourlyWriteWarningThreshold ?? DEFAULT_D1_HOURLY_WRITE_WARNING_THRESHOLD

  const [
    writesLastHour,
    pendingOver24h,
    failed24h,
    total24h,
  ] = await env.DB.batch([
    env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM agent_runs WHERE started_at >= ?)
        + (SELECT COUNT(*) FROM agent_run_events WHERE at >= ?)
        + (SELECT COUNT(*) FROM agent_tool_calls WHERE started_at >= ?)
        + (SELECT COUNT(*) FROM agent_memory_items WHERE written_at >= ?)
        + (SELECT COUNT(*) FROM agent_approval_requests WHERE created_at >= ?) AS value
    `).bind(cutoffHour, cutoffHour, cutoffHour, cutoffHour, cutoffHour),
    env.DB.prepare("SELECT COUNT(*) AS value FROM agent_approval_requests WHERE status = 'pending' AND created_at < ?").bind(cutoff24h),
    env.DB.prepare("SELECT COUNT(*) AS value FROM agent_runs WHERE status = 'failed' AND started_at >= ?").bind(cutoff24h),
    env.DB.prepare('SELECT COUNT(*) AS value FROM agent_runs WHERE started_at >= ?').bind(cutoff24h),
  ])

  const alerts: KernelHealthAlert[] = []
  const writes = readValue(writesLastHour)
  const pending = readValue(pendingOver24h)
  const failed = readValue(failed24h)
  const total = readValue(total24h)
  const failureRate = total > 0 ? failed / total : 0

  if (writes > threshold) {
    alerts.push({ reason: 'd1_write_rate_high', details: { writes_last_hour: writes, threshold } })
  }
  if (pending > 0) {
    alerts.push({ reason: 'pending_approvals_over_24h', details: { pending_over_24h: pending } })
  }
  if (total > 0 && failureRate > 0.05) {
    alerts.push({ reason: 'failed_run_rate_high', details: { failed_24h: failed, total_24h: total, failure_rate: failureRate } })
  }

  for (const alert of alerts) {
    console.warn('[agent-os] WARN', alert.reason, alert.details)
  }
  return alerts
}

function readValue(result: D1Result<unknown>): number {
  const row = result.results?.[0] as CountRow | undefined
  return Number(row?.value ?? 0)
}
