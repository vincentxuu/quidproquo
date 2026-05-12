import { runEmbedPipeline } from '../embed/pipeline'
import { EMBED_BATCH_SIZE } from '../rag/tools/hybrid-search'
import { buildContextBundle } from './context-builder'
import { validateBudgetPolicy } from './guards/budget'
import { validatePipelineInput } from './guards/input'
import { validateOutputSafety } from './guards/output'
import { validatePipelineTools } from './guards/tool'
import {
  createArtifact,
  createJob,
  createStep,
  finishStep,
  updateJobStatus,
} from './job-store'
import { runContentOps } from './modules/content-ops'
import { loadCloudPosts } from './modules/content-posts'
import { countFindings, runPostQualityCheck } from './modules/post-quality'
import { runReferenceCheck } from './modules/reference-check'
import { getPipelineDefinition } from './registry'
import type { PipelineRunRequest } from './types'

export async function runPipeline(db: D1Database, request: PipelineRunRequest): Promise<{ jobId: string; status: string }> {
  const definition = getPipelineDefinition(request.pipelineId)
  if (!definition) {
    throw new PipelineRunError(`Unknown pipeline: ${request.pipelineId}`, 404)
  }

  const jobId = await createJob(db, definition, request.input, request.requestedBy)
  await updateJobStatus(db, jobId, 'running')

  const guardStartedAt = Date.now()
  const guardStepId = await createStep(db, jobId, 'input-guards', 'module', 'Validate pipeline input and runtime')
  const inputGuardResults = validatePipelineInput(definition, request.input)
  const toolGuardResults = validatePipelineTools(definition)
  const outputGuardResults = validateOutputSafety(definition)
  const budgetGuardResults = validateBudgetPolicy(definition)
  const runtimeGuard = { id: 'runtime:worker', status: 'pass' as const }
  const guardResults = [
    ...inputGuardResults,
    ...toolGuardResults,
    ...outputGuardResults,
    ...budgetGuardResults,
    runtimeGuard,
  ]
  const guardFailed = guardResults.some((result) => result.status === 'fail')
  await finishStep(db, guardStepId, guardFailed ? 'failed' : 'succeeded', guardStartedAt, {
    output: guardFailed ? 'Input guards failed.' : 'Input guards completed.',
    guardResults,
  })

  if (guardFailed) {
    await updateJobStatus(db, jobId, 'failed', { error: 'Input guard failed', failureReason: 'guard_failed' })
    return { jobId, status: 'failed' }
  }

  const contextStartedAt = Date.now()
  const contextStepId = await createStep(db, jobId, 'context-builder', 'module', 'Build minimal context bundle')
  const contextArtifactId = await createArtifact(db, jobId, contextStepId, 'json_report', 'Context bundle', buildContextBundle(definition, request.input))
  await finishStep(db, contextStepId, 'succeeded', contextStartedAt, {
    artifactId: contextArtifactId,
    output: 'Context bundle created.',
  })

  if (definition.id === 'content-ops') {
    await runContentOpsJob(db, jobId, request.input)
    await updateJobStatus(db, jobId, 'succeeded', { output: 'Content ops job completed.' })
    return { jobId, status: 'succeeded' }
  }

  if (definition.id === 'post-quality') {
    const status = await runPostQualityJob(db, jobId, request.input)
    if (status === 'failed') return { jobId, status }
    await updateJobStatus(db, jobId, 'succeeded', { output: 'Post quality job completed.' })
    return { jobId, status: 'succeeded' }
  }

  if (definition.id === 'embed-sync') {
    await runEmbedSyncJob(db, jobId, request.input)
    await updateJobStatus(db, jobId, 'succeeded', { output: 'Embed sync job completed.' })
    return { jobId, status: 'succeeded' }
  }

  if (definition.id === 'crawl-sync') {
    const stepStartedAt = Date.now()
    const stepId = await createStep(db, jobId, 'crawl-sync-record', 'api', 'Record crawl sync request')
    const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Crawl sync request', {
      endpoint: '/api/crawl/sync',
      input: request.input,
      note: 'Crawl sync still executes through its Worker endpoint so secret validation remains centralized.',
    })
    await finishStep(db, stepId, 'succeeded', stepStartedAt, {
      artifactId,
      output: 'Recorded crawl sync request for Worker endpoint execution.',
    })
    await updateJobStatus(db, jobId, 'succeeded', { output: 'Crawl sync request recorded.' })
    return { jobId, status: 'succeeded' }
  }

  if (definition.id === 'translation') {
    const stepStartedAt = Date.now()
    const stepId = await createStep(db, jobId, 'translation-record', 'api', 'Record translation request')
    const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Translation request', {
      sourcePath: request.input.sourcePath,
      note: 'Translation requires local Node runner with LLM access. Use: pnpm translation:run "<sourcePath>"',
    })
    await finishStep(db, stepId, 'succeeded', stepStartedAt, {
      artifactId,
      output: 'Recorded translation request for local execution.',
    })
    await updateJobStatus(db, jobId, 'succeeded', { output: 'Translation request recorded. Run locally with pnpm translation:run.' })
    return { jobId, status: 'succeeded' }
  }

  await updateJobStatus(db, jobId, 'failed', { error: 'No worker runner implemented', failureReason: 'runner_missing' })
  return { jobId, status: 'failed' }
}

async function runContentOpsJob(db: D1Database, jobId: string, input: Record<string, unknown>): Promise<void> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'content-ops', 'module', 'Run Worker-safe content ops')

  try {
    const posts = await loadCloudPosts(db, input)
    const report = runContentOps(posts)
    const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Content ops report', report)
    await finishStep(db, stepId, 'succeeded', stepStartedAt, {
      artifactId,
      output: `Analyzed ${posts.length} cloud post records.`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await finishStep(db, stepId, 'failed', stepStartedAt, { error: message })
    await updateJobStatus(db, jobId, 'failed', { error: message, failureReason: 'content_ops_failed' })
    throw error
  }
}

async function runPostQualityJob(db: D1Database, jobId: string, input: Record<string, unknown>): Promise<'succeeded' | 'failed'> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'post-quality', 'module', 'Run Worker-safe quality and reference checks')

  try {
    const posts = await loadCloudPosts(db, input)
    const knownRoutes = new Set(posts.map((post) => `/posts/${post.slug}`).concat(posts.map((post) => `/en/posts/${post.slug}`)))
    const qualityReports = runPostQualityCheck(posts, knownRoutes)
    const referenceReports = runReferenceCheck(posts)
    const qualityErrors = countFindings(qualityReports, 'error')
    const referenceErrors = countFindings(referenceReports, 'error')
    const blockingIssues = qualityErrors + referenceErrors
    const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Post quality report', {
      checked_posts: posts.length,
      quality: qualityReports,
      references: referenceReports,
      summary: {
        quality_errors: qualityErrors,
        quality_warnings: countFindings(qualityReports, 'warn'),
        reference_errors: referenceErrors,
        reference_warnings: countFindings(referenceReports, 'warn'),
      },
    })
    await finishStep(db, stepId, blockingIssues > 0 ? 'failed' : 'succeeded', stepStartedAt, {
      artifactId,
      output: `Checked ${posts.length} cloud post records.`,
      error: blockingIssues > 0 ? `${blockingIssues} blocking issue(s) found.` : undefined,
    })
    if (blockingIssues > 0) {
      await updateJobStatus(db, jobId, 'failed', { error: `${blockingIssues} blocking issue(s) found.`, failureReason: 'quality_check_failed' })
      return 'failed'
    }
    return 'succeeded'
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await finishStep(db, stepId, 'failed', stepStartedAt, { error: message })
    await updateJobStatus(db, jobId, 'failed', { error: message, failureReason: 'post_quality_failed' })
    throw error
  }
}

async function runEmbedSyncJob(db: D1Database, jobId: string, input: Record<string, unknown>): Promise<void> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'embed-sync', 'api', 'Run embed pipeline')
  const sources = normalizeSources(input.sources)
  const offset = toInteger(input.offset, 0)
  const limit = toInteger(input.limit, EMBED_BATCH_SIZE)

  try {
    const results = await runEmbedPipeline(sources, offset, limit)
    const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Embed sync result', {
      sources,
      offset,
      limit,
      results,
    })
    await finishStep(db, stepId, 'succeeded', stepStartedAt, {
      artifactId,
      output: `Embedded ${Array.isArray(results) ? results.length : 0} result groups.`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await finishStep(db, stepId, 'failed', stepStartedAt, { error: message })
    await updateJobStatus(db, jobId, 'failed', { error: message, failureReason: 'embed_sync_failed' })
    throw error
  }
}

function normalizeSources(value: unknown): ('posts' | 'docs')[] {
  const raw = Array.isArray(value) ? value : ['posts', 'docs']
  const filtered = raw.filter((item): item is 'posts' | 'docs' => item === 'posts' || item === 'docs')
  return filtered.length > 0 ? filtered : ['posts', 'docs']
}

function toInteger(value: unknown, fallback: number): number {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= 0 ? numeric : fallback
}

export class PipelineRunError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}
