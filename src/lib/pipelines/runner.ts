import { runCrawlSync } from '../crawl/sync'
import { env } from 'cloudflare:workers'
import { runEmbedPipeline } from '../embed/pipeline'
import { EMBED_BATCH_SIZE } from '../rag/tools/hybrid-search'
import { buildContextBundle } from './context-builder'
import { validateBudgetPolicy } from './guards/budget'
import { validatePipelineInput } from './guards/input'
import { validatePipelineTools } from './guards/tool'
import {
  createArtifact,
  createJob,
  createStep,
  finishStep,
  incrementRetryCount,
  markDeadLetter,
  updateJobStatus,
} from './job-store'
import { runContentOps } from './modules/content-ops'
import { loadCloudPosts, normalizeSlug, type CloudPost } from './modules/content-posts'
import { countFindings, runPostQualityCheck } from './modules/post-quality'
import { runReferenceCheck } from './modules/reference-check'
import { runInternalLinkSuggestions } from './modules/internal-links'
import { runMetadataSuggestions } from './modules/metadata-suggestions'
import {
  runInternalLinksSuggestionEvaluation,
  runMetadataSuggestionEvaluation,
  runPostQualityLlmReview,
} from './modules/quality-evaluator'
import { runFreshnessReview } from './modules/freshness-review'
import { runGlossaryGap } from './modules/glossary-gap'
import { runKnowledgeGraphPrototype } from './modules/knowledge-graph-prototype'
import { runTranslationDraft } from './modules/translation'
import { buildResearchBriefDraft, buildResearchDraftSlug, runResearchBrief } from './modules/research-brief'
import { buildYouTubeBriefDraft, buildYouTubeDraftSlug, runYouTubeBrief } from './modules/youtube-brief'
import { runSeriesSuggestions } from './modules/series-suggestions'
import { getPipelineDefinition } from './registry'
import { parseMarkdownFrontmatter } from './content-utils'
import type { PipelineRunRequest } from './types'
import { validateOutputSafety } from './guards/output'

const RETRY_BASE_MS = 500
const RETRY_CAP_MS = 8_000

type PipelineExecutionContext = {
  externalCallCount: number
  maxExternalCalls?: number
}

type PipelineExecutionResult = { status: 'succeeded' | 'failed' | 'waiting_review' | 'dead_letter'; output: string }

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

  const runtimeGuard = validateBudgetPolicy(definition)
  const guardResults = [...inputGuardResults, ...toolGuardResults, ...runtimeGuard]
  const guardFailed = guardResults.some((result) => result.status === 'fail')

  await finishStep(db, guardStepId, guardFailed ? 'failed' : 'succeeded', guardStartedAt, {
    output: guardFailed ? 'Input/runtime guard failed.' : 'Input and runtime guard completed.',
    guardResults,
  })

  if (guardFailed) {
    await updateJobStatus(db, jobId, 'failed', { error: 'Input/runtime guard failed', failureReason: 'guard_failed' })
    return { jobId, status: 'failed' }
  }

  const contextStartedAt = Date.now()
  const contextStepId = await createStep(db, jobId, 'context-builder', 'module', 'Build minimal context bundle')
  const contextArtifactId = await createArtifact(
    db,
    jobId,
    contextStepId,
    'json_report',
    'Context bundle',
    buildContextBundle(definition, request.input),
  )
  await finishStep(db, contextStepId, 'succeeded', contextStartedAt, {
    artifactId: contextArtifactId,
    output: 'Context bundle created.',
  })

  const executionContext: PipelineExecutionContext = {
    externalCallCount: 0,
    maxExternalCalls: definition.budget.maxExternalCalls,
  }

  const result = await executeWithPolicy(
    db,
    definition,
    jobId,
    executionContext,
    () => runPipelineById(definition, db, jobId, request.input, executionContext),
  )

  await updateJobStatus(db, jobId, result.status, {
    output: result.output,
    failureReason: result.status === 'failed' ? 'execution_failed' : undefined,
  })
  return { jobId, status: result.status }
}

async function runPipelineById(
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  if (definition.id === 'content-ops') {
    const output = await runContentOpsJob(db, jobId)
    return { status: 'succeeded', output }
  }

  if (definition.id === 'post-quality') {
    const output = await runPostQualityJob(definition, db, jobId, input, executionContext)
    return output
  }

  if (definition.id === 'metadata-suggestions') {
    const output = await runMetadataSuggestionsJob(db, jobId, input, definition, executionContext)
    return output
  }

  if (definition.id === 'embed-sync') {
    const output = await runEmbedSyncJob(db, jobId, input, executionContext)
    return { status: 'succeeded', output }
  }

  if (definition.id === 'internal-links') {
    const output = await runInternalLinksJob(db, jobId, input, definition, executionContext)
    return output
  }

  if (definition.id === 'crawl-sync') {
    const output = await runCrawlSyncJob(db, jobId, input, executionContext)
    return output
  }

  if (definition.id === 'translation') {
    const output = await runTranslationJob(db, jobId, input, definition, executionContext)
    return output
  }

  if (definition.id === 'research-brief') {
    const output = await runResearchBriefJob(db, jobId, input, definition, executionContext)
    return output
  }

  if (definition.id === 'youtube-brief') {
    const output = await runYouTubeBriefJob(db, jobId, input, definition, executionContext)
    return output
  }

  if (definition.id === 'freshness-review') {
    const output = await runFreshnessReviewJob(db, jobId, input)
    return output
  }

  if (definition.id === 'glossary-gap') {
    const output = await runGlossaryGapJob(db, jobId, input)
    return output
  }

  if (definition.id === 'series-suggestions') {
    const output = await runSeriesSuggestionsJob(db, jobId, input)
    return output
  }

  if (definition.id === 'knowledge-graph-prototype') {
    const output = await runKnowledgeGraphPrototypeJob(db, jobId, input)
    return output
  }

  throw new PipelineRunError(`No worker runner implemented for pipeline ${definition.id}`, 501)
}

async function runContentOpsJob(db: D1Database, jobId: string): Promise<string> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'content-ops', 'module', 'Run Worker-safe content ops')

  const posts = await loadCloudPosts(db)
  const report = runContentOps(posts)

  const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Content ops report', report)
  await finishStep(db, stepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Analyzed ${posts.length} cloud post records.`,
  })
  return `Content ops completed with ${posts.length} posts.`
}

async function runPostQualityJob(
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'post-quality', 'module', 'Run Worker-safe quality and reference checks')

  const posts = await loadCloudPosts(db, input)
  const knownRoutes = new Set(
    posts
      .map((post) => [`/posts/${post.slug}`, `/en/posts/${post.slug}`])
      .flat(),
  )
  const qualityReports = runPostQualityCheck(posts, knownRoutes)
  const referenceReports = runReferenceCheck(posts)

  const qualityErrors = countFindings(qualityReports, 'error')
  const referenceErrors = countFindings(referenceReports, 'error')
  const blockingIssues = qualityErrors + referenceErrors

  const outputGuardResults = validateOutputSafety(definition, {
    qualityReports,
    referenceReports,
  })
  const blockingOutput = outputGuardResults.some((result) => result.status === 'fail')

  const evaluationStepStartedAt = Date.now()
  const evaluationStepId = await createStep(db, jobId, 'quality-evaluation', 'llm', 'Run LLM quality review')
  const qualityEvaluation = await runPostQualityLlmReview(
    {
      posts,
      qualityReports,
      referenceReports,
    },
    {
      onExternalCall: () => {
        recordExternalCall(executionContext, 'post-quality-llm-review')
      },
    },
  )
  const evaluationArtifactId = await createArtifact(
    db,
    jobId,
    evaluationStepId,
    'json_report',
    'Quality evaluation',
    qualityEvaluation,
  )
  await finishStep(db, evaluationStepId, 'succeeded', evaluationStepStartedAt, {
    artifactId: evaluationArtifactId,
    output: `Quality evaluation decision: ${qualityEvaluation.decision}`,
  })

  const finalOutputGuardResults = validateOutputSafety(definition, {
    qualityReports,
    referenceReports,
    qualityEvaluation,
  })
  const finalFailureOutputGuard = finalOutputGuardResults.filter((result) => result.status === 'fail')
  const finalFailureCount = finalFailureOutputGuard.length

  const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Post quality report', {
    checked_posts: posts.length,
    quality: qualityReports,
    references: referenceReports,
    qualityEvaluation,
    summary: {
      quality_errors: qualityErrors,
      quality_warnings: countFindings(qualityReports, 'warn'),
      reference_errors: referenceErrors,
      reference_warnings: countFindings(referenceReports, 'warn'),
      output_guard_checks: finalOutputGuardResults,
      review_decision: qualityEvaluation.decision,
      review_why: qualityEvaluation.why,
    },
  })

  const reviewBlocking = qualityEvaluation.decision !== 'approve'
  const failed = blockingIssues > 0 || blockingOutput || finalFailureCount > 0
  const finalStatus: PipelineExecutionResult['status'] = failed ? 'failed' : reviewBlocking ? 'waiting_review' : 'succeeded'
  const outputMessages = [] as string[]
  if (blockingIssues > 0) {
    outputMessages.push(`${blockingIssues} quality/reference blocking issue(s) found.`)
  }
  if (finalFailureCount > 0) {
    outputMessages.push(`${finalFailureCount} output guard blocking issue(s) found.`)
  }
  if (reviewBlocking) {
    outputMessages.push(`LLM quality review requires ${qualityEvaluation.decision}.`)
  }

  const failureSummary = outputMessages.join(' ')

  await finishStep(db, stepId, finalStatus === 'failed' ? 'failed' : 'succeeded', stepStartedAt, {
    artifactId,
    output: `Checked ${posts.length} cloud post records.`,
    error: failed ? failureSummary : undefined,
    guardResults: finalOutputGuardResults,
  })

  return {
    status: finalStatus,
    output: finalStatus === 'failed'
      ? `Post quality failed. ${failureSummary}`
      : finalStatus === 'waiting_review'
        ? `Post quality waiting review. ${failureSummary}`
        : `Post quality passed with ${posts.length} posts checked.`,
  }
}

async function runMetadataSuggestionsJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'metadata-suggestion', 'module', 'Generate metadata suggestions')

  const sourceSlug = normalizeSlug(input.slug ?? input.sourcePath)
  if (!sourceSlug) {
    await finishStep(db, stepId, 'failed', stepStartedAt, {
      output: 'Invalid or missing source slug.',
      error: 'slug is required and must be "category/YYYY-MM-DD-slug".',
    })
    return { status: 'failed', output: 'Invalid or missing source slug.' }
  }

  const posts = await loadCloudPosts(db, { slug: sourceSlug })
  if (posts.length === 0) {
    await finishStep(db, stepId, 'failed', stepStartedAt, {
      output: `Source post not found: ${sourceSlug}`,
      error: 'No matching post in cloud DB.',
    })
    return { status: 'failed', output: `Source post not found: ${sourceSlug}` }
  }

  const report = runMetadataSuggestions(posts[0]!)
  const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Metadata suggestion report', report)
  const evaluationStepStartedAt = Date.now()
  const evaluationStepId = await createStep(db, jobId, 'metadata-suggestion-evaluation', 'llm', 'Review metadata suggestions')
  const evaluation = await runMetadataSuggestionEvaluation(report, {
    onExternalCall: () => {
      recordExternalCall(executionContext, 'metadata-suggestion-evaluator')
    },
  })
  const evaluationArtifactId = await createArtifact(
    db,
    jobId,
    evaluationStepId,
    'json_report',
    'Metadata suggestion evaluation',
    evaluation,
  )
  await finishStep(db, evaluationStepId, 'succeeded', evaluationStepStartedAt, {
    artifactId: evaluationArtifactId,
    output: `Metadata suggestion review decision: ${evaluation.decision}`,
  })
  const outputGuardResults = validateOutputSafety(definition, {
    qualityEvaluation: evaluation,
  })
  const finalOutputGuardFailures = outputGuardResults.filter((item) => item.status === 'fail')
  const finalStatus: PipelineExecutionResult['status'] = finalOutputGuardFailures.length > 0
    ? 'failed'
    : evaluation.decision === 'approve'
      ? 'succeeded'
      : 'waiting_review'
  await finishStep(db, stepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Generated metadata suggestions for ${sourceSlug}.`,
    error: finalOutputGuardFailures.length > 0 ? 'Metadata suggestion output guard failed.' : undefined,
    guardResults: outputGuardResults,
  })

  return {
    status: finalStatus,
    output:
      finalStatus === 'waiting_review'
        ? `Metadata suggestions generated for ${sourceSlug}, waiting review.`
        : finalStatus === 'failed'
          ? `Metadata suggestions generation failed for ${sourceSlug}.`
          : `Metadata suggestions generated for ${sourceSlug}.`,
  }
}

async function runInternalLinksJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'internal-links', 'module', 'Generate internal link suggestions')

  const sourceSlug = normalizeSlug(input.slug ?? input.sourcePath)
  if (!sourceSlug) {
    await finishStep(db, stepId, 'failed', stepStartedAt, {
      output: 'Invalid or missing source slug.',
      error: 'slug is required and must be "category/YYYY-MM-DD-slug".',
    })
    return { status: 'failed', output: 'Invalid or missing source slug.' }
  }

  const posts = await loadCloudPosts(db)
  const report = runInternalLinkSuggestions(posts, sourceSlug)
  const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Internal link report', report)
  const opportunityCount = Array.isArray(report.opportunities) ? report.opportunities.length : 0
  const evaluationStepStartedAt = Date.now()
  const evaluationStepId = await createStep(db, jobId, 'internal-link-evaluation', 'llm', 'Review internal links')
  const evaluation = await runInternalLinksSuggestionEvaluation(report, {
    onExternalCall: () => {
      recordExternalCall(executionContext, 'internal-links-evaluator')
    },
  })
  const evaluationArtifactId = await createArtifact(
    db,
    jobId,
    evaluationStepId,
    'json_report',
    'Internal link evaluation',
    evaluation,
  )
  await finishStep(db, evaluationStepId, 'succeeded', evaluationStepStartedAt, {
    artifactId: evaluationArtifactId,
    output: `Internal link review decision: ${evaluation.decision}`,
  })
  const outputGuardResults = validateOutputSafety(definition, {
    qualityEvaluation: evaluation,
  })
  const finalOutputGuardFailures = outputGuardResults.filter((item) => item.status === 'fail')
  const finalStatus: PipelineExecutionResult['status'] = finalOutputGuardFailures.length > 0
    ? 'failed'
    : evaluation.decision === 'approve'
      ? 'succeeded'
      : 'waiting_review'
  await finishStep(db, stepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Generated ${opportunityCount} internal link suggestion(s) for ${sourceSlug}.`,
    error: finalOutputGuardFailures.length > 0 ? 'Internal links output guard failed.' : undefined,
    guardResults: outputGuardResults,
  })

  return {
    status: finalStatus,
    output:
      finalStatus === 'waiting_review'
        ? `Generated ${opportunityCount} internal link suggestion(s) for ${sourceSlug}, waiting review.`
        : finalStatus === 'failed'
          ? `Internal link suggestion generation failed for ${sourceSlug}.`
          : `Generated ${opportunityCount} internal link suggestion(s) for ${sourceSlug}.`,
  }
}

async function runTranslationJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const sourceSlug = normalizeSlug(input.slug ?? input.sourcePath)
  if (!sourceSlug) {
    return {
      status: 'failed',
      output: 'Invalid or missing source slug.',
    }
  }

  const posts = await loadCloudPosts(db, { slug: sourceSlug })
  const sourcePost = posts[0]
  if (!sourcePost) {
    return {
      status: 'failed',
      output: `Source post not found: ${sourceSlug}`,
    }
  }

  const readSourceStepId = await createStep(db, jobId, 'read-source', 'module', 'Read source post')
  const readSourceStartedAt = Date.now()
  await finishStep(db, readSourceStepId, 'succeeded', readSourceStartedAt, {
    output: `Loaded source post: ${sourcePost.slug}`,
  })

  const translateStepId = await createStep(db, jobId, 'translate', 'llm', 'Translate content and review stages')
  const translateStartedAt = Date.now()
  const draftResult = await runTranslationDraft(sourcePost, {
    onExternalCall: () => {
      recordExternalCall(executionContext, 'translation-stage')
    },
  })
  await finishStep(db, translateStepId, 'succeeded', translateStartedAt, {
    output: `Translated draft generated for ${draftResult.sourceSlug}`,
  })

  const translatedPost = toTranslatedCloudPost(sourcePost, draftResult.draftMarkdown)
  const allPosts = await loadCloudPosts(db)
  const knownRoutes = new Set<string>([
    ...allPosts.map((post) => `/posts/${post.slug}`),
    ...allPosts.map((post) => `/en/posts/${post.slug}`),
  ])

  const qualityStepId = await createStep(db, jobId, 'quality-check', 'module', 'Run post-quality check')
  const qualityStartedAt = Date.now()
  const qualityReports = runPostQualityCheck([translatedPost], knownRoutes)
  const qualityArtifactId = await createArtifact(db, jobId, qualityStepId, 'json_report', 'Translation quality check', qualityReports)
  await finishStep(db, qualityStepId, 'succeeded', qualityStartedAt, {
    artifactId: qualityArtifactId,
    output: `Translation quality check returned ${qualityReports.length} item(s).`,
  })

  const referenceStepId = await createStep(db, jobId, 'reference-check', 'module', 'Run reference check')
  const referenceStartedAt = Date.now()
  const referenceReports = runReferenceCheck([translatedPost])
  const referenceArtifactId = await createArtifact(db, jobId, referenceStepId, 'json_report', 'Translation reference check', referenceReports)
  await finishStep(db, referenceStepId, 'succeeded', referenceStartedAt, {
    artifactId: referenceArtifactId,
    output: `Reference check returned ${referenceReports.length} item(s).`,
  })

  const writeDraftStepId = await createStep(db, jobId, 'write-draft', 'module', 'Write draft markdown artifact')
  const writeDraftStartedAt = Date.now()
  const draftArtifactId = await createArtifact(db, jobId, writeDraftStepId, 'markdown_draft', 'English draft markdown', draftResult.draftMarkdown)
  await finishStep(db, writeDraftStepId, 'succeeded', writeDraftStartedAt, {
    artifactId: draftArtifactId,
    output: `Draft markdown written for ${sourceSlug}.`,
  })

  const outputGuard = validateOutputSafety(definition, {
    qualityReports,
    referenceReports,
    translationReviews: draftResult.reviews,
  })

  const reviewFailures = draftResult.reviews.filter((review) => review.status !== 'approve')
  const reviewGateStatus = reviewFailures.length > 0 ? 'waiting_review' : 'passed'
  const needsHumanReview = reviewGateStatus === 'waiting_review'

  const reviewGateStepId = await createStep(db, jobId, 'review-gate', 'human_review', 'Publish gate decision')
  const reviewGateStartedAt = Date.now()
  const reviewReasons = reviewFailures.map((review) => ({
    stage: review.stage,
    status: review.status,
    summary: review.summary,
    issueCount: review.issues.length,
  }))

  await finishStep(db, reviewGateStepId, needsHumanReview ? 'succeeded' : 'skipped', reviewGateStartedAt, {
    output: needsHumanReview
      ? `Human review required: ${reviewFailures.length} review item(s) flagged.`
      : 'No human review required.',
  })

  const outputGuardNoReview = outputGuard.filter((item) => item.id !== 'output:translation_review')
  const outputGuardErrors = outputGuardNoReview
    .filter((item) => item.status === 'fail')
    .map((item) => item.id)
    .join(', ')
  const reportStepId = await createStep(db, jobId, 'translation-report', 'module', 'Write translation report')
  const reportStartedAt = Date.now()
  const report = {
    sourceSlug,
    draftModel: draftResult.model,
    modelUsage: draftResult.modelUsage,
    reviews: draftResult.reviews,
    qualityReports,
    referenceReports,
    outputGuard,
    publishGate: {
      status: reviewGateStatus,
      reasons: reviewReasons,
    },
    outputSummary: {
      qualityErrorCount: countFindings(qualityReports, 'error'),
      referenceErrorCount: countFindings(referenceReports, 'error'),
      reviewRequestChanges: draftResult.reviews.filter((review) => review.status !== 'approve').length,
    },
  }
  const translationArtifactId = await createArtifact(db, jobId, reportStepId, 'json_report', 'Translation report', report)

  const failed = outputGuardNoReview.some((item) => item.status === 'fail')
  const needsReview = reviewGateStatus === 'waiting_review'
  const outputSummary = failed
    ? `Translation guard failed for ${sourceSlug}.`
    : needsReview
      ? `Translation draft generated for ${sourceSlug}, waiting for human review.`
      : `Translation draft completed for ${sourceSlug}.`

  const outputError = outputGuardErrors || undefined
  const finalStatus = failed ? 'failed' : needsReview ? 'waiting_review' : 'succeeded'
  await finishStep(db, reportStepId, finalStatus === 'failed' ? 'failed' : 'succeeded', reportStartedAt, {
    artifactId: translationArtifactId,
    output: outputSummary,
    error: outputError || undefined,
  })

  return {
    status: finalStatus,
    output: outputSummary,
  }
}

async function runResearchBriefJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const topic = typeof input.topic === 'string' ? input.topic.trim() : ''
  if (!topic) {
    const stepId = await createStep(db, jobId, 'research-brief', 'module', 'Generate research brief')
    const startedAt = Date.now()
    await finishStep(db, stepId, 'failed', startedAt, {
      output: 'Missing required topic.',
      error: 'topic is required for research-brief',
    })
    return { status: 'failed', output: 'Missing required topic.' }
  }

  const depth = normalizeResearchDepth(input.researchDepth)
  const language = typeof input.language === 'string' ? input.language : 'zh-TW'
  const includeExternalSources = input.includeExternalSources === undefined ? true : toBoolean(input.includeExternalSources)

  const generateStepId = await createStep(db, jobId, 'research-brief', 'llm', 'Generate research brief')
  const generateStartedAt = Date.now()
  const brief = await runResearchBrief(
    {
      topic,
      language,
      researchDepth: depth,
      includeExternalSources,
    },
    {
      onExternalCall: () => {
        recordExternalCall(executionContext, 'research-brief-stage')
      },
    },
  )
  await finishStep(db, generateStepId, 'succeeded', generateStartedAt, {
    output: `Generated research brief for ${topic}`,
  })

  const draftContext = {
    date: brief.generatedAt.slice(0, 10),
    language,
    category: 'ai',
    slug: buildResearchDraftSlug(topic, brief.generatedAt),
  }
  const draft = buildResearchBriefDraft(brief, draftContext)
  const draftCloudPost = buildDraftCloudPost(draft.markdown, { ...draft, language })

  const allPosts = await loadCloudPosts(db)
  const knownRoutes = buildDraftKnownRoutes(allPosts, draft.slug)

  const qualityStepId = await createStep(db, jobId, 'research-quality', 'module', 'Run research draft quality check')
  const qualityStartedAt = Date.now()
  const qualityReports = runPostQualityCheck([draftCloudPost], knownRoutes)
  const qualityArtifactId = await createArtifact(
    db,
    jobId,
    qualityStepId,
    'json_report',
    'Research draft quality check',
    qualityReports,
  )
  await finishStep(db, qualityStepId, 'succeeded', qualityStartedAt, {
    artifactId: qualityArtifactId,
    output: `Research draft quality check returned ${qualityReports.length} item(s).`,
  })

  const referenceStepId = await createStep(db, jobId, 'research-reference', 'module', 'Run research draft reference check')
  const referenceStartedAt = Date.now()
  const referenceReports = runReferenceCheck([draftCloudPost])
  const referenceArtifactId = await createArtifact(
    db,
    jobId,
    referenceStepId,
    'json_report',
    'Research draft reference check',
    referenceReports,
  )
  await finishStep(db, referenceStepId, 'succeeded', referenceStartedAt, {
    artifactId: referenceArtifactId,
    output: `Research draft reference check returned ${referenceReports.length} item(s).`,
  })

  const needsHumanInput = brief.requiresHumanInput
  const reviewStepId = await createStep(db, jobId, 'research-review', 'human_review', 'Research review gate')
  const reviewStartedAt = Date.now()
  await finishStep(db, reviewStepId, needsHumanInput ? 'succeeded' : 'skipped', reviewStartedAt, {
    output: needsHumanInput ? `Human review required for ${topic}.` : 'No human review required.',
  })

  const writeDraftStepId = await createStep(db, jobId, 'research-write-draft', 'module', 'Write research draft markdown')
  const writeDraftStartedAt = Date.now()
  const draftArtifactId = await createArtifact(
    db,
    jobId,
    writeDraftStepId,
    'markdown_draft',
    'Research brief draft markdown',
    draft.markdown,
  )
  await finishStep(db, writeDraftStepId, 'succeeded', writeDraftStartedAt, {
    artifactId: draftArtifactId,
    output: `Research draft markdown written for ${topic}.`,
  })

  const reportStepId = await createStep(db, jobId, 'research-report', 'module', 'Write research brief report')
  const reportStartedAt = Date.now()
  const report = {
    pipelineId: definition.id,
    source: {
      topic,
      language,
      researchDepth: depth,
    },
    summary: {
      keyQuestionsCount: brief.keyQuestions.length,
      claimsCount: brief.claimHypotheses.length,
      includeExternalSources,
      sourcesCount: brief.sourcesToCheck.length,
      riskCount: brief.risks.length,
      requiresHumanInput: needsHumanInput,
      qualityErrorCount: countFindings(qualityReports, 'error'),
      referenceErrorCount: countFindings(referenceReports, 'error'),
    },
    brief,
    draft,
    qualityReports,
    referenceReports,
  }

  const outputGuard = validateOutputSafety(definition, {
    qualityReports,
    referenceReports,
  })
  const outputGuardFailures = outputGuard.filter((item) => item.status === 'fail')
  const failed =
    outputGuardFailures.length > 0 ||
    countFindings(qualityReports, 'error') > 0 ||
    countFindings(referenceReports, 'error') > 0
  const status: PipelineExecutionResult['status'] = failed
    ? 'failed'
    : needsHumanInput
      ? 'waiting_review'
      : 'succeeded'
  const artifactId = await createArtifact(db, jobId, reportStepId, 'json_report', 'Research brief report', report)
  const outputSummary = failed
    ? `Research draft failed quality/reference checks for "${topic}".`
    : needsHumanInput
      ? `Research draft generated for "${topic}" and waiting for human review.`
      : `Research draft generated for "${topic}".`
  await finishStep(db, reportStepId, status === 'failed' ? 'failed' : 'succeeded', reportStartedAt, {
    artifactId,
    output: outputSummary,
    error: outputGuardFailures.map((item) => item.id).join(', ') || undefined,
  })

  return { status, output: outputSummary }
}

async function runYouTubeBriefJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const videoUrl = typeof input.videoUrl === 'string' ? input.videoUrl.trim() : ''
  if (!videoUrl) {
    const stepId = await createStep(db, jobId, 'youtube-brief', 'module', 'Build YouTube brief skeleton')
    const startedAt = Date.now()
    await finishStep(db, stepId, 'failed', startedAt, {
      output: 'Missing required video URL.',
      error: 'videoUrl is required for youtube-brief',
    })
    return { status: 'failed', output: 'Missing required video URL.' }
  }

  const generateStepId = await createStep(db, jobId, 'youtube-brief', 'module', 'Build YouTube brief skeleton')
  const generateStartedAt = Date.now()
  const language = typeof input.language === 'string' ? input.language : 'zh-TW'
  const includeTranscript = input.includeTranscript === undefined ? true : toBoolean(input.includeTranscript)
  const brief = await runYouTubeBrief({ videoUrl, language, includeTranscript }, {
    onExternalCall: () => {
      recordExternalCall(executionContext, 'youtube-oembed')
    },
  })
  await finishStep(db, generateStepId, 'succeeded', generateStartedAt, {
    output: `Built YouTube draft for ${videoUrl}`,
  })

  const draftContext = {
    date: brief.generatedAt.slice(0, 10),
    language,
    category: 'ai',
    slug: buildYouTubeDraftSlug(videoUrl, brief.generatedAt),
  }
  const draft = buildYouTubeBriefDraft(brief, draftContext)
  const draftCloudPost = buildDraftCloudPost(draft.markdown, { ...draft, language })

  const allPosts = await loadCloudPosts(db)
  const knownRoutes = buildDraftKnownRoutes(allPosts, draft.slug)

  const qualityStepId = await createStep(db, jobId, 'youtube-quality', 'module', 'Run YouTube draft quality check')
  const qualityStartedAt = Date.now()
  const qualityReports = runPostQualityCheck([draftCloudPost], knownRoutes)
  const qualityArtifactId = await createArtifact(
    db,
    jobId,
    qualityStepId,
    'json_report',
    'YouTube draft quality check',
    qualityReports,
  )
  await finishStep(db, qualityStepId, 'succeeded', qualityStartedAt, {
    artifactId: qualityArtifactId,
    output: `YouTube draft quality check returned ${qualityReports.length} item(s).`,
  })

  const referenceStepId = await createStep(db, jobId, 'youtube-reference', 'module', 'Run YouTube draft reference check')
  const referenceStartedAt = Date.now()
  const referenceReports = runReferenceCheck([draftCloudPost])
  const referenceArtifactId = await createArtifact(
    db,
    jobId,
    referenceStepId,
    'json_report',
    'YouTube draft reference check',
    referenceReports,
  )
  await finishStep(db, referenceStepId, 'succeeded', referenceStartedAt, {
    artifactId: referenceArtifactId,
    output: `YouTube draft reference check returned ${referenceReports.length} item(s).`,
  })

  const needsHumanInput = brief.requiresHumanInput
  const reviewStepId = await createStep(db, jobId, 'youtube-review', 'human_review', 'Review YouTube brief')
  const reviewStartedAt = Date.now()
  await finishStep(db, reviewStepId, needsHumanInput ? 'succeeded' : 'skipped', reviewStartedAt, {
    output: needsHumanInput ? 'Human review required for YouTube draft.' : 'No human review required.',
  })

  const writeDraftStepId = await createStep(db, jobId, 'youtube-write-draft', 'module', 'Write YouTube draft markdown')
  const writeDraftStartedAt = Date.now()
  const draftArtifactId = await createArtifact(
    db,
    jobId,
    writeDraftStepId,
    'markdown_draft',
    'YouTube draft markdown',
    draft.markdown,
  )
  await finishStep(db, writeDraftStepId, 'succeeded', writeDraftStartedAt, {
    artifactId: draftArtifactId,
    output: `YouTube draft markdown written for ${videoUrl}.`,
  })

  const reportStepId = await createStep(db, jobId, 'youtube-report', 'module', 'Write YouTube brief report')
  const reportStartedAt = Date.now()
  const report = {
    pipelineId: definition.id,
    source: {
      videoUrl,
      language,
      includeTranscript,
    },
    summary: {
      requiresHumanInput: needsHumanInput,
      hasTranscript: brief.transcript.hasTranscript,
      transcriptSource: brief.transcript.source,
      actionItemsCount: brief.actionItems.length,
      gapsCount: brief.evidenceGaps.length,
      qualityErrorCount: countFindings(qualityReports, 'error'),
      referenceErrorCount: countFindings(referenceReports, 'error'),
    },
    brief,
    draft,
    qualityReports,
    referenceReports,
  }
  const outputGuard = validateOutputSafety(definition, {
    qualityReports,
    referenceReports,
  })
  const outputGuardFailures = outputGuard.filter((item) => item.status === 'fail')
  const failed =
    outputGuardFailures.length > 0 ||
    countFindings(qualityReports, 'error') > 0 ||
    countFindings(referenceReports, 'error') > 0
  const status: PipelineExecutionResult['status'] = failed
    ? 'failed'
    : needsHumanInput
      ? 'waiting_review'
      : 'succeeded'
  const artifactId = await createArtifact(db, jobId, reportStepId, 'json_report', 'YouTube brief report', report)
  const outputSummary = failed
    ? `YouTube draft failed quality/reference checks for ${videoUrl}.`
    : needsHumanInput
      ? `YouTube draft generated for ${videoUrl} and waiting for human review.`
      : `YouTube draft generated for ${videoUrl}.`
  await finishStep(db, reportStepId, status === 'failed' ? 'failed' : 'succeeded', reportStartedAt, {
    artifactId,
    output: outputSummary,
    error: outputGuardFailures.map((item) => item.id).join(', ') || undefined,
  })

  return { status, output: outputSummary }
}

async function runFreshnessReviewJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const scanStepId = await createStep(db, jobId, 'freshness-scan', 'module', 'Scan posts freshness risk')
  const maxAgeDays = normalizePositiveInt(input.maxAgeDays, 365, 30, 1095)
  const riskThreshold = normalizePositiveInt(input.riskThreshold, 40, 1, 100)
  const categoryFilter = typeof input.categoryFilter === 'string' ? input.categoryFilter : ''
  const languageFilter = typeof input.languageFilter === 'string' ? input.languageFilter : ''

  const posts = await loadCloudPosts(db)
  const report = runFreshnessReview(posts, {
    maxAgeDays,
    riskThreshold,
    categoryFilter,
    languageFilter,
  })
  const artifactId = await createArtifact(db, jobId, scanStepId, 'json_report', 'Freshness review report', report)

  await finishStep(db, scanStepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Freshness scan completed. ${report.summary.candidates} candidate(s) over threshold ${riskThreshold}.`,
  })

  const reportSummaryStepId = await createStep(db, jobId, 'freshness-report', 'module', 'Persist freshness summary')
  const reportSummaryAt = Date.now()
  await finishStep(db, reportSummaryStepId, 'succeeded', reportSummaryAt, {
    output: `Freshness review ready. High risk posts: ${report.summary.high_risk_candidates}.`,
  })

  return {
    status: 'succeeded',
    output: `Freshness review generated for ${report.summary.posts_analyzed} posts (${report.summary.candidates} candidates).`,
  }
}

async function runGlossaryGapJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const scanStepId = await createStep(db, jobId, 'glossary-gap-scan', 'module', 'Scan glossary lookup stats')
  const lookbackDays = normalizePositiveInt(input.days, 14, 1, 365)
  const minLookupCount = normalizePositiveInt(input.minLookupCount, 3, 1, 200)
  const topTerms = normalizePositiveInt(input.topTerms, 20, 1, 100)
  const topPostsPerTerm = normalizePositiveInt(input.topPostsPerTerm, 5, 1, 20)

  const report = await runGlossaryGap(db, {
    days: lookbackDays,
    minLookupCount,
    topTerms,
    topPostsPerTerm,
  })
  const artifactId = await createArtifact(db, jobId, scanStepId, 'json_report', 'Glossary gap report', report)

  await finishStep(db, scanStepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Glossary gap scan completed. ${report.summary.candidateTerms} candidate term(s) above threshold.`,
  })

  const reportStepId = await createStep(db, jobId, 'glossary-gap-report', 'module', 'Persist glossary gap report')
  const reportStartedAt = Date.now()
  await finishStep(db, reportStepId, 'succeeded', reportStartedAt, {
    output: `Glossary gap report summary: totalRows=${report.summary.totalRows}, totalTerms=${report.summary.totalTerms}, candidates=${report.summary.candidateTerms}.`,
  })

  return {
    status: 'succeeded',
    output: `Glossary gap report generated for ${report.summary.totalRows} lookups (${report.summary.candidateTerms} candidate term(s)).`,
  }
}

async function runSeriesSuggestionsJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const scanStepId = await createStep(db, jobId, 'series-scan', 'module', 'Scan posts for series signals')
  const posts = await loadCloudPosts(db)
  const topSeriesCount = normalizePositiveInt(input.topSeriesCount, 12, 1, 200)
  const minPostsPerSeries = normalizePositiveInt(input.minPostsPerSeries, 2, 2, 100)
  const maxPostsPerSeries = normalizePositiveInt(input.maxPostsPerSeries, 8, 1, 20)
  const minSignalLength = normalizePositiveInt(input.minSignalLength, 2, 1, 20)

  const report = runSeriesSuggestions(posts, {
    topSeriesCount,
    minPostsPerSeries,
    maxPostsPerSeries,
    minSignalLength,
  })
  const artifactId = await createArtifact(db, jobId, scanStepId, 'json_report', 'Series suggestions report', report)

  await finishStep(db, scanStepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Series suggestion scan completed. ${report.summary.candidates} candidate(s).`,
  })

  const reportStepId = await createStep(db, jobId, 'series-report', 'module', 'Persist series suggestions report')
  const reportStartedAt = Date.now()
  await finishStep(db, reportStepId, 'succeeded', reportStartedAt, {
    output: `Series suggestions generated for ${report.summary.posts_analyzed} posts with ${report.summary.candidates} candidate(s).`,
  })

  return {
    status: 'succeeded',
    output: `Series suggestions generated for ${report.summary.posts_analyzed} posts and ${report.summary.candidates} series candidate(s).`,
  }
}

async function runKnowledgeGraphPrototypeJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const scanStepId = await createStep(db, jobId, 'knowledge-graph-scan', 'module', 'Build knowledge graph prototype')
  const posts = await loadCloudPosts(db)
  const minEntityFrequency = normalizePositiveInt(input.minEntityFrequency, 2, 2, 50)
  const topNodes = normalizePositiveInt(input.topNodes, 80, 10, 500)
  const minCoOccurrence = normalizePositiveInt(input.minCoOccurrence, 2, 2, 20)
  const topEdges = normalizePositiveInt(input.topEdges, 180, 20, 1000)

  const report = runKnowledgeGraphPrototype(posts, {
    minEntityFrequency,
    topNodes,
    minCoOccurrence,
    topEdges,
  })
  const artifactId = await createArtifact(db, jobId, scanStepId, 'json_report', 'Knowledge graph prototype report', report)

  await finishStep(db, scanStepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Knowledge graph scan completed. ${report.summary.entities} entities, ${report.summary.edges} edges.`,
  })

  const reportStepId = await createStep(db, jobId, 'knowledge-graph-report', 'module', 'Persist knowledge graph report')
  const reportStartedAt = Date.now()
  await finishStep(db, reportStepId, 'succeeded', reportStartedAt, {
    output: `Knowledge graph prototype built for ${report.summary.posts_analyzed} posts (${report.summary.connected_entities} connected entities).`,
  })

  return {
    status: 'succeeded',
    output: `Knowledge graph prototype generated with ${report.summary.entities} entities and ${report.summary.edges} edges.`,
  }
}


async function runEmbedSyncJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  executionContext: PipelineExecutionContext,
): Promise<string> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'embed-sync', 'api', 'Run embed pipeline')
  const sources = normalizeSources(input.sources)
  const offset = toInteger(input.offset, 0)
  const limit = toInteger(input.limit, EMBED_BATCH_SIZE)

  recordExternalCall(executionContext, 'runEmbedPipeline')
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

  return `Embed sync completed for sources ${sources.join(', ')}.`
}

async function runCrawlSyncJob(
  db: D1Database,
  jobId: string,
  input: Record<string, unknown>,
  executionContext: PipelineExecutionContext,
): Promise<PipelineExecutionResult> {
  const stepStartedAt = Date.now()
  const stepId = await createStep(db, jobId, 'crawl-sync', 'api', 'Run crawl sync')
  const crawlSecret = (env as unknown as { CRAWL_SECRET?: string }).CRAWL_SECRET

  recordExternalCall(executionContext, 'runCrawlSync')
  const results = await runCrawlSync({
    full: toBoolean(input.full),
    modifiedSince: toOptionalInteger(input.modifiedSince),
    secret: crawlSecret,
  })

  const targetErrors = results.filter((item) => item.error)
  const artifactId = await createArtifact(db, jobId, stepId, 'json_report', 'Crawl sync result', {
    input,
    results,
  })

  if (targetErrors.length > 0) {
    await finishStep(db, stepId, 'failed', stepStartedAt, {
      artifactId,
      error: `Crawl sync reported ${targetErrors.length} target error(s).`,
    })
    return {
      status: 'failed',
      output: `Crawl sync warning: ${targetErrors.length} target error(s).`,
    }
  }

  await finishStep(db, stepId, 'succeeded', stepStartedAt, {
    artifactId,
    output: `Crawl sync completed for ${results.length} target(s).`,
  })
  return {
    status: 'succeeded',
    output: `Crawl sync completed for ${results.length} target(s).`,
  }
}

function buildDraftCloudPost(
  markdown: string,
  input: {
    slug: string
    category: string
    language: string
    date: string
    title: string
  },
): CloudPost {
  const parsed = parseMarkdownFrontmatter(markdown)
  const frontmatter = parsed.hasFrontmatter ? parsed.frontmatter : {}
  const parsedDate = typeof frontmatter.date === 'string' ? frontmatter.date : input.date
  const baseDate = parsedDate.slice(0, 10)
  const createdAt = isValidDateText(baseDate) ? `${baseDate}T00:00:00.000Z` : new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    slug: input.slug,
    title: normalizeText(frontmatter.title, input.title),
    category: normalizeText(frontmatter.category, input.category),
    lang: normalizeText(frontmatter.lang, input.language),
    description: normalizeText(frontmatter.description, null),
    tldr: normalizeText(frontmatter.tldr, null),
    content: markdown,
    tags: normalizeTagsFromFrontmatter(frontmatter.tags),
    created_at: createdAt,
    updated_at: new Date().toISOString(),
  }
}

function buildDraftKnownRoutes(allPosts: CloudPost[], draftSlug: string): Set<string> {
  const knownRoutes = new Set<string>([
    ...allPosts.map((post) => `/posts/${post.slug}`),
    ...allPosts.map((post) => `/en/posts/${post.slug}`),
  ])
  knownRoutes.add(`/posts/${draftSlug}`)
  return knownRoutes
}

function isValidDateText(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value).getTime())
}

function parseFrontmatterTags(raw: string): string[] {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    return []
  }
  const inner = trimmed.slice(1, -1).trim()
  if (!inner) return []

  return inner
    .split(',')
    .map((tag) => tag.trim().replace(/^"|"$/g, ''))
    .filter(Boolean)
}

function normalizeTagsFromFrontmatter(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = parseFrontmatterTags(value)
    return parsed.length > 0 ? parsed : [value.trim()]
  }
  return []
}

function toTranslatedCloudPost(sourcePost: CloudPost, draftMarkdown: string): CloudPost {
  const draftParsed = parseMarkdownFrontmatter(draftMarkdown)
  const frontmatter = draftParsed.hasFrontmatter ? draftParsed.frontmatter : {}
  const title = normalizeText(frontmatter.title, sourcePost.title)
  const description = normalizeText(frontmatter.description, sourcePost.description)
  const tldr = normalizeText(frontmatter.tldr, sourcePost.tldr)
  const tags = normalizeTags(frontmatter.tags, sourcePost.tags)
  return {
    ...sourcePost,
    title,
    description,
    tldr,
    tags,
    lang: 'en',
    content: draftMarkdown,
  }
}

function normalizeText(first: unknown, fallback: unknown): string {
  if (typeof first === 'string' && first.trim()) return first.trim()
  if (typeof fallback === 'string' && fallback.trim()) return fallback.trim()
  return ''
}

function normalizeTags(first: unknown, fallback: string[]): string[] {
  if (Array.isArray(first)) return first.map((tag) => String(tag).trim()).filter(Boolean)
  if (typeof first === 'string' && first.trim()) {
    const raw = first.trim()
    if (raw.startsWith('[') && raw.endsWith(']')) {
      return raw
        .slice(1, -1)
        .split(',')
        .map((tag) => tag.trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
    }
    return [raw]
  }
  return fallback
}

async function executeWithPolicy(
  db: D1Database,
  definition: NonNullable<ReturnType<typeof getPipelineDefinition>>,
  jobId: string,
  executionContext: PipelineExecutionContext,
  execute: () => Promise<PipelineExecutionResult>,
): Promise<PipelineExecutionResult> {
  const maxRetries = Math.max(0, definition.budget.maxRetries)
  let attempts = 0

  while (true) {
    try {
      const maxExternalCalls = definition.budget.maxExternalCalls
      if (typeof maxExternalCalls === 'number' && Number.isInteger(maxExternalCalls) && maxExternalCalls >= 0) {
        if (executionContext.externalCallCount >= maxExternalCalls) {
          throw new PipelineRunError(
            `External call budget exceeded (${executionContext.externalCallCount}/${maxExternalCalls})`,
            429,
            'dead_letter',
          )
        }
      }
      const result = await withTimeout(execute(), definition.budget.maxRuntimeMs)
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const retryable = attempts < maxRetries && isRetryableFailure(error)
      if (!retryable) {
        const terminalStatus: 'failed' | 'dead_letter' =
          attempts > 0 || (error instanceof PipelineRunError && error.jobStatus === 'dead_letter')
            ? 'dead_letter'
            : 'failed'
        if (terminalStatus === 'dead_letter') {
          await markDeadLetter(db, jobId, {
            error: message,
            failureReason: 'retry_exhausted',
          })
          return { status: terminalStatus, output: message }
        }

        await updateJobStatus(db, jobId, 'failed', { error: message, failureReason: 'execution_failed' })
        return { status: 'failed', output: message }
      }

      attempts += 1
      await incrementRetryCount(db, jobId)
      const waitMs = Math.min(RETRY_BASE_MS * Math.pow(2, attempts), RETRY_CAP_MS)
      await sleep(waitMs)
    }
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (timeoutMs <= 0) return promise

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new PipelineRunError('Pipeline execution timed out', 408))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutHandle) clearTimeout(timeoutHandle)
  })
}

function isRetryableFailure(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
  if (!message) return false
  const retryableSignals = [
    'timeout',
    'temporar',
    'rate limit',
    'too many requests',
    '429',
    'network',
    'fetch',
    'connection',
    'ECONNRESET',
    'ETIMEDOUT',
  ]
  return retryableSignals.some((signal) => message.includes(signal))
}

function normalizeSources(value: unknown): ('posts' | 'docs')[] {
  const raw = Array.isArray(value) ? value : ['posts', 'docs']
  const filtered = raw.filter((item): item is 'posts' | 'docs' => item === 'posts' || item === 'docs')
  return filtered.length > 0 ? filtered : ['posts', 'docs']
}

function normalizeResearchDepth(value: unknown): 'quick' | 'standard' | 'deep' {
  if (value === 'quick' || value === 'standard' || value === 'deep') return value
  if (typeof value === 'string' && value.trim()) {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'quick' || normalized === 'standard' || normalized === 'deep') return normalized
  }
  return 'standard'
}

function toInteger(value: unknown, fallback: number): number {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= 0 ? numeric : fallback
}

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= min && numeric <= max ? numeric : fallback
}

function toOptionalInteger(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const numeric = Number(value)
  return Number.isInteger(numeric) && numeric >= 0 ? numeric : undefined
}

function toBoolean(value: unknown): boolean {
  return value === true || value === 'true'
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function recordExternalCall(context: PipelineExecutionContext, _source: string): void {
  const maxCalls = context.maxExternalCalls
  if (typeof maxCalls === 'number' && Number.isInteger(maxCalls) && maxCalls >= 0 && context.externalCallCount >= maxCalls) {
    throw new PipelineRunError(
      `External call budget exceeded (${context.externalCallCount}/${maxCalls})`,
      429,
      'dead_letter',
    )
  }

  context.externalCallCount += 1
}

export class PipelineRunError extends Error {
  constructor(message: string, readonly status = 400, readonly jobStatus: 'failed' | 'dead_letter' = 'failed') {
    super(message)
  }
}
