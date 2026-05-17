export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import {
  getJob,
  getJobArtifact,
  listJobArtifacts,
  listJobSteps,
  updateArtifactContent,
} from '../../../../lib/pipelines/job-store'
import { updateJobStatus } from '../../../../lib/pipelines/job-store'
import { runPipeline } from '../../../../lib/pipelines/runner'
import { getPipelineDefinition } from '../../../../lib/pipelines/registry'
import type { PipelineRunRequest } from '../../../../lib/pipelines/types'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
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



