export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { readFlags } from '@/lib/config/flags'

type CountRow = { value: number | null }

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const workerEnv = env as unknown as Env
  const flags = readFlags(workerEnv)
  const cutoff24h = Date.now() - 24 * 60 * 60 * 1000
  const r2BytesStatement = flags.agentOs.memory.r2
    ? workerEnv.DB.prepare(`
      SELECT COALESCE(SUM(length(body_text)), 0) AS value
      FROM agent_memory_items
      WHERE json_extract(body_json, '$.r2Key') IS NOT NULL
    `)
    : workerEnv.DB.prepare('SELECT NULL AS value')

  const [
    processes,
    running,
    queued,
    failed24h,
    avgCost24h,
    totalCost24h,
    approvalsPending,
    approvalsPendingOver24h,
    memoryItems,
    r2Bytes,
  ] = await workerEnv.DB.batch([
    workerEnv.DB.prepare('SELECT COUNT(*) AS value FROM agent_processes'),
    workerEnv.DB.prepare("SELECT COUNT(*) AS value FROM agent_runs WHERE status = 'running'"),
    workerEnv.DB.prepare("SELECT COUNT(*) AS value FROM agent_runs WHERE status = 'pending'"),
    workerEnv.DB.prepare("SELECT COUNT(*) AS value FROM agent_runs WHERE status = 'failed' AND started_at >= ?").bind(cutoff24h),
    workerEnv.DB.prepare('SELECT COALESCE(AVG(total_cost_usd), 0) AS value FROM agent_runs WHERE started_at >= ?').bind(cutoff24h),
    workerEnv.DB.prepare('SELECT COALESCE(SUM(total_cost_usd), 0) AS value FROM agent_runs WHERE started_at >= ?').bind(cutoff24h),
    workerEnv.DB.prepare("SELECT COUNT(*) AS value FROM agent_approval_requests WHERE status = 'pending'"),
    workerEnv.DB.prepare("SELECT COUNT(*) AS value FROM agent_approval_requests WHERE status = 'pending' AND created_at < ?").bind(cutoff24h),
    workerEnv.DB.prepare('SELECT COUNT(*) AS value FROM agent_memory_items'),
    r2BytesStatement,
  ])

  return json({
    processes: readValue(processes),
    runs: {
      running: readValue(running),
      queued: readValue(queued),
      failed_24h: readValue(failed24h),
    },
    cost: {
      avg_usd_per_run_24h: readValue(avgCost24h),
      total_usd_24h: readValue(totalCost24h),
    },
    approvals: {
      pending: readValue(approvalsPending),
      pending_over_24h: readValue(approvalsPendingOver24h),
    },
    memory: {
      items_total: readValue(memoryItems),
      r2_bytes: flags.agentOs.memory.r2 ? readValue(r2Bytes) : null,
    },
  })
}

function readValue(result: D1Result<unknown>): number {
  const row = result.results?.[0] as CountRow | undefined
  return Number(row?.value ?? 0)
}
