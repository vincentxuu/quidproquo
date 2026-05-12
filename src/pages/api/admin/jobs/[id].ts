export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { getJob, listJobArtifacts, listJobSteps } from '../../../../lib/pipelines/job-store'
import { updateJobStatus } from '../../../../lib/pipelines/job-store'
import { runPipeline } from '../../../../lib/pipelines/runner'
import { getPipelineDefinition } from '../../../../lib/pipelines/registry'
import type { PipelineRunRequest } from '../../../../lib/pipelines/types'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const id = params.id
  if (!id) return json({ error: 'job id is required' }, 400)

  const db = (env as unknown as Env).DB
  const job = await getJob(db, id)
  if (!job) return json({ error: 'job not found' }, 404)

  const [steps, artifacts] = await Promise.all([
    listJobSteps(db, id),
    listJobArtifacts(db, id),
  ])
  return json({ job, steps, artifacts })
}

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const id = params.id
  if (!id) return json({ error: 'job id is required' }, 400)

  const body = await request.json().catch(() => ({})) as { action?: string; reviewNote?: string }
  const db = (env as unknown as Env).DB
  const job = await getJob(db, id)
  if (!job) return json({ error: 'job not found' }, 404)
  const reviewNote = body.reviewNote?.trim()

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

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
