export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { PipelineJobRow } from '../../../../lib/pipelines/job-store'
import type { PipelineStatus } from '../../../../lib/pipelines/types'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

interface FlowRunRow {
  id: string
  pipeline_id: string
  status: string
  started_at: number | null
  finished_at: number | null
  created_at: number
  parent_external_id: string | null
}

function mapFlowRunStatus(status: string): PipelineStatus {
  if (status === 'done') return 'succeeded'
  if (
    status === 'queued' ||
    status === 'running' ||
    status === 'failed' ||
    status === 'cancelled'
  ) {
    return status as PipelineStatus
  }
  return 'queued'
}

function flowRunToJobRow(fr: FlowRunRow): PipelineJobRow {
  return {
    id: fr.id,
    pipeline_id: fr.pipeline_id,
    status: mapFlowRunStatus(fr.status),
    risk: '',
    requested_by: null,
    input_json: '{}',
    output_summary: null,
    error_summary: null,
    failure_reason: null,
    retry_count: 0,
    created_at: String(fr.created_at),
    started_at: fr.started_at != null ? String(fr.started_at) : null,
    finished_at: fr.finished_at != null ? String(fr.finished_at) : null,
    token_input: null,
    token_output: null,
    provider: null,
    model: null,
    dead_letter_at: null,
  }
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
  const normalizedLimit = Number.isInteger(limit) ? limit : 20

  let flowRuns: FlowRunRow[] = []
  try {
    const flowRunsResult = await db
      .prepare(
        `SELECT flow_run_id AS id, flow_id AS pipeline_id, status, started_at, finished_at, created_at, parent_external_id
         FROM flow_runs
         WHERE parent_kind='pipeline'
         ORDER BY created_at DESC
         LIMIT ?`,
      )
      .bind(normalizedLimit)
      .all<FlowRunRow>()
    flowRuns = flowRunsResult.results
  } catch {
    // flow_runs table may not exist in local dev without migration applied
  }

  const jobs: PipelineJobRow[] = flowRuns.map(flowRunToJobRow)
  return json({ jobs })
}



