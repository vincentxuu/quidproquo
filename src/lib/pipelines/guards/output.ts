import { getToolDefinition } from '../tool-registry'
import type { GuardResult, PipelineDefinition } from '../types'

type Finding = { severity?: 'error' | 'warn'; message?: string }
type QualityLikeReport = {
  slug?: string
  title?: string
  findings: unknown
}

interface OutputValidationInput {
  qualityReports?: unknown
  referenceReports?: unknown
  translationReviews?: unknown
  qualityEvaluation?: unknown
}

export function validateOutputSafety(definition: PipelineDefinition, output?: OutputValidationInput): GuardResult[] {
  const results: GuardResult[] = []

  const markdownWritingTools = definition.tools
    .map((toolId) => getToolDefinition(toolId))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool?.writesMarkdown))

  if (!definition.writesMarkdown && markdownWritingTools.length > 0) {
    results.push({
      id: 'output:no_markdown_write',
      status: 'fail',
      message: 'Pipeline declares writesMarkdown=false but allows markdown-writing tools.',
    })
  } else {
    results.push({ id: 'output:no_markdown_write', status: 'pass' })
  }

  for (const tool of markdownWritingTools) {
    results.push({
      id: `output:no_silent_overwrite:${tool.id}`,
      status: tool.overwritesExisting ? 'fail' : 'pass',
      message: tool.overwritesExisting ? `Tool ${tool.id} may overwrite existing markdown` : undefined,
    })
  }

  if (definition.id === 'post-quality' && output) {
    const qualityErrors = collectErrorCount(output.qualityReports)
    const referenceErrors = collectErrorCount(output.referenceReports)
    const internalLinkErrors = collectInternalLinkErrorCount(output.qualityReports)
    results.push({
      id: 'output:quality_schema',
      status: qualityErrors === 0 ? 'pass' : 'fail',
      message: qualityErrors > 0 ? `Found ${qualityErrors} post quality blocking issues` : undefined,
    })
    results.push({
      id: 'output:reference_required',
      status: referenceErrors === 0 ? 'pass' : 'warn',
      message: referenceErrors > 0 ? `Found ${referenceErrors} reference blocking issues` : undefined,
    })
    results.push({
      id: 'output:internal_link_existence',
      status: internalLinkErrors === 0 ? 'pass' : 'fail',
      message: internalLinkErrors > 0 ? `Found ${internalLinkErrors} internal link validation issues` : undefined,
    })
  }

  if ((definition.id === 'translation' || definition.id === 'metadata-suggestions') && output) {
    const qualityErrors = collectErrorCount(output.qualityReports)
    const referenceErrors = collectErrorCount(output.referenceReports)
    const rejectedReviews = collectReviewFailures(output.translationReviews)

    results.push({
      id: 'output:translation_quality',
      status: qualityErrors === 0 ? 'pass' : 'fail',
      message: qualityErrors > 0 ? `Found ${qualityErrors} blocking quality issues` : undefined,
    })
    results.push({
      id: 'output:translation_reference',
      status: referenceErrors === 0 ? 'pass' : 'warn',
      message: referenceErrors > 0 ? `Found ${referenceErrors} blocking reference issues` : undefined,
    })
    results.push({
      id: 'output:translation_review',
      status: rejectedReviews === 0 ? 'pass' : 'fail',
      message: rejectedReviews > 0 ? `${rejectedReviews} review item(s) request human changes` : undefined,
    })
  }

  if (definition.id === 'post-quality' && output?.qualityEvaluation) {
    const evaluationStatus = mapEvaluationDecisionToStatus(output.qualityEvaluation)
    results.push({
      id: 'output:quality_evaluation',
      status: evaluationStatus,
      message: evaluationStatus === 'pass'
        ? undefined
        : `LLM quality review decision requires attention: ${getEvaluationDecision(output.qualityEvaluation)}`,
    })
  }

  if (definition.id === 'internal-links' && output?.qualityEvaluation) {
    const evaluationStatus = mapEvaluationDecisionToStatus(output.qualityEvaluation)
    results.push({
      id: 'output:internal_links_evaluation',
      status: evaluationStatus,
      message: evaluationStatus === 'pass'
        ? undefined
        : `LLM internal-link review decision requires attention: ${getEvaluationDecision(output.qualityEvaluation)}`,
    })
  }

  if (definition.id === 'metadata-suggestions' && output?.qualityEvaluation) {
    const evaluationStatus = mapEvaluationDecisionToStatus(output.qualityEvaluation)
    results.push({
      id: 'output:metadata_suggestion_evaluation',
      status: evaluationStatus,
      message: evaluationStatus === 'pass'
        ? undefined
        : `LLM metadata-review decision requires attention: ${getEvaluationDecision(output.qualityEvaluation)}`,
    })
  }

  return results
}

function getEvaluationDecision(value: unknown): string {
  if (!value || typeof value !== 'object') return 'unknown'
  const candidate = value as Record<string, unknown>
  if (typeof candidate.decision === 'string') return candidate.decision
  return 'unknown'
}

function mapEvaluationDecisionToStatus(value: unknown): GuardResult['status'] {
  const decision = getEvaluationDecision(value)
  if (decision === 'approve') return 'pass'
  if (decision === 'request_changes' || decision === 'needs_human_input') return 'warn'
  return 'warn'
}

function collectErrorCount(reports: unknown): number {
  if (!Array.isArray(reports)) return 0
  let errorCount = 0

  for (const item of reports as QualityLikeReport[]) {
    const findings = Array.isArray(item?.findings) ? item.findings as Finding[] : []
    errorCount += findings.filter((finding) => {
      if (!finding || typeof finding !== 'object') return false
      return finding.severity === 'error'
    }).length
  }

  return errorCount
}

function collectInternalLinkErrorCount(reports: unknown): number {
  if (!Array.isArray(reports)) return 0
  let count = 0
  for (const item of reports as QualityLikeReport[]) {
    const findings = Array.isArray(item?.findings) ? (item.findings as Finding[]) : []
    count += findings.filter((finding) => {
      if (!finding || typeof finding !== 'object') return false
      const message = finding.message ?? ''
      if (typeof message !== 'string') return false
      return message.includes('內部文章連結不存在')
    }).length
  }
  return count
}

function collectReviewFailures(reviews: unknown): number {
  if (!Array.isArray(reviews)) return 0

  return reviews.filter((review) => {
    if (!review || typeof review !== 'object') return false
    const status = String((review as { status?: unknown }).status)
    return status === 'request_changes' || status === 'needs_human_input'
  }).length
}
