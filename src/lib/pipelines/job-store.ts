import type { ArtifactType, GuardResult, PipelineDefinition, PipelineStatus } from './types'

export interface PipelineJobRow {
  id: string
  pipeline_id: string
  status: PipelineStatus
  risk: string
  requested_by: string | null
  input_json: string
  output_summary: string | null
  error_summary: string | null
  failure_reason: string | null
  retry_count: number
  created_at: string
  started_at: string | null
  finished_at: string | null
  token_input: number | null
  token_output: number | null
  provider: string | null
  model: string | null
  dead_letter_at: string | null
}

export interface PipelineStepRow {
  id: string
  job_id: string
  stage_id: string
  kind: string
  status: string
  input_summary: string | null
  output_summary: string | null
  artifact_id: string | null
  duration_ms: number | null
  error_summary: string | null
  guard_results: string | null
  created_at: string
  started_at: string | null
  finished_at: string | null
}

export interface PipelineArtifactRow {
  id: string
  job_id: string
  step_id: string | null
  type: ArtifactType
  name: string | null
  path: string | null
  content_json: string | null
  created_at: string
}

export async function createJob(
  db: D1Database,
  definition: PipelineDefinition,
  input: Record<string, unknown>,
  requestedBy: string,
): Promise<string> {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO admin_jobs (id, pipeline_id, status, risk, requested_by, input_json)
     VALUES (?, ?, 'queued', ?, ?, ?)`,
  ).bind(id, definition.id, definition.risk, requestedBy, JSON.stringify(input)).run()
  return id
}

export async function updateJobStatus(
  db: D1Database,
  id: string,
  status: PipelineStatus,
  summary?: { output?: string; error?: string; failureReason?: string },
): Promise<void> {
  const startedAt = status === 'running' ? ", started_at = COALESCE(started_at, datetime('now'))" : ''
  const finishedAt = ['succeeded', 'failed', 'dead_letter', 'cancelled', 'waiting_review'].includes(status)
    ? ", finished_at = COALESCE(finished_at, datetime('now'))"
    : ''
  await db.prepare(
    `UPDATE admin_jobs
     SET status = ?,
         output_summary = COALESCE(?, output_summary),
         error_summary = COALESCE(?, error_summary),
         failure_reason = COALESCE(?, failure_reason)
         ${startedAt}
         ${finishedAt}
     WHERE id = ?`,
  ).bind(status, summary?.output ?? null, summary?.error ?? null, summary?.failureReason ?? null, id).run()
}

export async function createStep(
  db: D1Database,
  jobId: string,
  stageId: string,
  kind: string,
  inputSummary?: string,
): Promise<string> {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO admin_job_steps (id, job_id, stage_id, kind, status, input_summary, started_at)
     VALUES (?, ?, ?, ?, 'running', ?, datetime('now'))`,
  ).bind(id, jobId, stageId, kind, inputSummary ?? null).run()
  return id
}

export async function finishStep(
  db: D1Database,
  id: string,
  status: 'succeeded' | 'failed' | 'skipped',
  startedAtMs: number,
  result: { output?: string; error?: string; artifactId?: string; guardResults?: GuardResult[] },
): Promise<void> {
  await db.prepare(
    `UPDATE admin_job_steps
     SET status = ?,
         output_summary = ?,
         error_summary = ?,
         artifact_id = ?,
         duration_ms = ?,
         guard_results = ?,
         finished_at = datetime('now')
     WHERE id = ?`,
  ).bind(
    status,
    result.output ?? null,
    result.error ?? null,
    result.artifactId ?? null,
    Date.now() - startedAtMs,
    result.guardResults ? JSON.stringify(result.guardResults) : null,
    id,
  ).run()
}

export async function createArtifact(
  db: D1Database,
  jobId: string,
  stepId: string | null,
  type: ArtifactType,
  name: string,
  content: unknown,
): Promise<string> {
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO admin_job_artifacts (id, job_id, step_id, type, name, content_json)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(id, jobId, stepId, type, name, JSON.stringify(content)).run()
  return id
}

export async function listJobs(
  db: D1Database,
  limit = 20,
  status?: PipelineJobRow['status'],
): Promise<PipelineJobRow[]> {
  const normalizedLimit = Math.min(Math.max(limit, 1), 100)
  const clause = status ? ' WHERE status = ?' : ''
  const query = `SELECT id, pipeline_id, status, risk, requested_by, input_json, output_summary, error_summary,
            failure_reason, retry_count, token_input, token_output, provider, model, dead_letter_at, created_at, started_at, finished_at
     FROM admin_jobs
     ${clause}
     ORDER BY created_at DESC
     LIMIT ?`

  const result = await db.prepare(query).bind(...(status ? [status, normalizedLimit] : [normalizedLimit])).all<PipelineJobRow>()
  return result.results
}

export async function getJob(db: D1Database, id: string): Promise<PipelineJobRow | null> {
  return await db.prepare(
    `SELECT id, pipeline_id, status, risk, requested_by, input_json, output_summary, error_summary,
            failure_reason, retry_count, token_input, token_output, provider, model, dead_letter_at,
            created_at, started_at, finished_at
     FROM admin_jobs
     WHERE id = ?`,
  ).bind(id).first<PipelineJobRow>()
}

export async function listJobSteps(db: D1Database, jobId: string): Promise<PipelineStepRow[]> {
  const result = await db.prepare(
    `SELECT id, job_id, stage_id, kind, status, input_summary, output_summary, artifact_id,
            duration_ms, error_summary, guard_results, created_at, started_at, finished_at
     FROM admin_job_steps
     WHERE job_id = ?
     ORDER BY created_at ASC`,
  ).bind(jobId).all<PipelineStepRow>()
  return result.results
}

export async function listJobArtifacts(db: D1Database, jobId: string): Promise<PipelineArtifactRow[]> {
  const result = await db.prepare(
    `SELECT id, job_id, step_id, type, name, path, content_json, created_at
     FROM admin_job_artifacts
     WHERE job_id = ?
     ORDER BY created_at ASC`,
  ).bind(jobId).all<PipelineArtifactRow>()
  return result.results
}

export async function incrementRetryCount(db: D1Database, id: string): Promise<number> {
  await db.prepare(
    `UPDATE admin_jobs
     SET retry_count = COALESCE(retry_count, 0) + 1
     WHERE id = ?`,
  ).bind(id).run()
  const row = await db.prepare(`SELECT COALESCE(retry_count, 0) AS count FROM admin_jobs WHERE id = ?`).bind(id).first<{ count: number }>()
  return row?.count ?? 0
}

export async function markDeadLetter(
  db: D1Database,
  id: string,
  summary: { error?: string; failureReason?: string },
): Promise<void> {
  await updateJobStatus(db, id, 'dead_letter', {
    output: summary.error,
    error: summary.error,
    failureReason: summary.failureReason ?? 'retry_exhausted',
  })
  await db.prepare(`UPDATE admin_jobs SET dead_letter_at = datetime('now') WHERE id = ?`).bind(id).run()
}
