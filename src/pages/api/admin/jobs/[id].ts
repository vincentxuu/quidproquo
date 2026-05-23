export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import {
  getJob,
  getJobArtifact,
  updateArtifactContent,
} from '../../../../lib/pipelines/job-store'
import { updateJobStatus } from '../../../../lib/pipelines/job-store'
import { runPipeline } from '../../../../lib/pipelines/runner'
import { getPipelineDefinition } from '../../../../lib/pipelines/registry'
import type { PipelineRunRequest } from '../../../../lib/pipelines/types'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

function mapFlowRunStatus(status: string): import('../../../../lib/pipelines/types').PipelineStatus {
  if (status === 'done') return 'succeeded'
  if (
    status === 'queued' ||
    status === 'running' ||
    status === 'failed' ||
    status === 'cancelled'
  ) {
    return status as import('../../../../lib/pipelines/types').PipelineStatus
  }
  return 'queued'
}

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const id = params.id
  if (!id) return json({ error: 'job id is required' }, 400)

  const db = (env as unknown as Env).DB

  // Check flow_runs first (for migrated records)
  try {
    const flowRun = await db
      .prepare(
        `SELECT flow_run_id AS id, flow_id AS pipeline_id, status, started_at, finished_at, created_at
         FROM flow_runs
         WHERE (flow_run_id=? OR parent_external_id=?) AND parent_kind='pipeline'
         LIMIT 1`,
      )
      .bind(id, id)
      .first<{
        id: string
        pipeline_id: string
        status: string
        started_at: number | null
        finished_at: number | null
        created_at: number
      }>()

    if (flowRun) {
      const job = {
        id: flowRun.id,
        pipeline_id: flowRun.pipeline_id,
        status: mapFlowRunStatus(flowRun.status),
        risk: '',
        requested_by: null,
        input_json: '{}',
        output_summary: null,
        error_summary: null,
        failure_reason: null,
        retry_count: 0,
        created_at: String(flowRun.created_at),
        started_at: flowRun.started_at != null ? String(flowRun.started_at) : null,
        finished_at: flowRun.finished_at != null ? String(flowRun.finished_at) : null,
        token_input: null,
        token_output: null,
        provider: null,
        model: null,
        dead_letter_at: null,
      }

      // Fetch steps from flow_step_runs if available
      let steps: unknown[] = []
      try {
        const stepsResult = await db
          .prepare(
            `SELECT flow_step_run_id AS id, flow_run_id AS job_id, step_id AS stage_id, kind, status,
                    input_summary, output_summary, artifact_id, duration_ms, error_summary,
                    guard_results, created_at, started_at, finished_at
             FROM flow_step_runs
             WHERE flow_run_id=?
             ORDER BY created_at ASC`,
          )
          .bind(flowRun.id)
          .all<unknown>()
        steps = stepsResult.results
      } catch {
        // flow_step_runs may not exist yet
      }

      return json({ job, steps, artifacts: [] })
    }
  } catch {
    // flow_runs table may not exist in local dev without migration applied
  }

  return json({ error: 'job not found' }, 404)
}

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const id = params.id
  if (!id) return json({ error: 'job id is required' }, 400)

  const body = await request.json().catch(() => ({})) as {
    action?: string
    reviewNote?: string
    artifactId?: string
    content?: string
    artifactType?: string
  }
  const db = (env as unknown as Env).DB
  const job = await getJob(db, id)
  if (!job) return json({ error: 'job not found' }, 404)
  const reviewNote = body.reviewNote?.trim()

  if (body.action === 'update_artifact') {
    if (job.status === 'queued' || job.status === 'running') {
      return json({ error: `Cannot edit artifacts for ${job.status} job` }, 400)
    }

    const artifactId = body.artifactId?.trim()
    if (!artifactId) {
      return json({ error: 'artifactId is required for update_artifact' }, 400)
    }

    const content = body.content ?? ''
    const artifact = await getJobArtifact(db, id, artifactId)
    if (!artifact) {
      return json({ error: 'Artifact not found' }, 404)
    }

    const targetType = body.artifactType ?? artifact.type
    let serializedContent: string

    if (targetType === 'json_report') {
      try {
        const parsed = JSON.parse(content)
        serializedContent = JSON.stringify(parsed)
      } catch {
        return json({ error: 'Invalid JSON format for json_report artifact. Please provide valid JSON text.' }, 400)
      }
    } else {
      serializedContent = JSON.stringify(String(content))
    }

    await updateArtifactContent(db, artifact.id, serializedContent)
    return json({ ok: true, artifactId: artifact.id, type: artifact.type })
  }

  if (body.action === 'cancel') {
    if (job.status === 'succeeded' || job.status === 'failed' || job.status === 'dead_letter') {
      return json({ error: `Cannot cancel ${job.status} job` }, 400)
    }
    await updateJobStatus(db, id, 'cancelled', { output: 'Cancelled by admin action', error: 'cancelled' })
    return json({ ok: true, jobId: id, status: 'cancelled' })
  }

  if (body.action === 'approve') {
    if (job.status !== 'waiting_review') {
      return json({ error: `Cannot approve job with status ${job.status}` }, 400)
    }
    await updateJobStatus(db, id, 'succeeded', {
      output: `Approved by admin${reviewNote ? `: ${reviewNote}` : ''}`,
    })
    return json({ ok: true, jobId: id, status: 'succeeded' })
  }

  if (body.action === 'reject') {
    if (job.status !== 'waiting_review') {
      return json({ error: `Cannot reject job with status ${job.status}` }, 400)
    }
    if (!reviewNote) {
      return json({ error: 'review note is required when rejecting a job' }, 400)
    }
    await updateJobStatus(db, id, 'cancelled', {
      output: `Rejected by admin: ${reviewNote}`,
      error: reviewNote,
      failureReason: 'review_rejected',
    })
    return json({ ok: true, jobId: id, status: 'cancelled' })
  }

  if (body.action === 'rerun') {
    // TODO(pipelines-unify 7.1): replace with flow-based rerun once PIPELINES_PORTED_TO_FLOW=true
    const definition = getPipelineDefinition(job.pipeline_id)
    if (!definition) return json({ error: 'unknown pipeline definition' }, 400)

    let input: Record<string, unknown> = {}
    try {
      input = job.input_json ? (JSON.parse(job.input_json) as Record<string, unknown>) : {}
    } catch {
      input = {}
    }

    const result = await runPipeline(db, {
      pipelineId: job.pipeline_id,
      input,
      requestedBy: 'admin',
    } satisfies PipelineRunRequest)
    return json({ ok: true, ...result })
  }

  return json({ error: `unsupported action: ${body.action}` }, 400)
}



