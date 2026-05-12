import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import type { CloudPost } from './content-posts'
import { createModel } from '../../rag/model'
import type { InternalLinkSuggestionsReport } from './internal-links'
import type { MetadataSuggestionsReport } from './metadata-suggestions'
import type { QualityReportItem, PipelineFinding } from './post-quality'

export type EvaluatorDecision = 'approve' | 'request_changes' | 'needs_human_input'
export type EvaluatorRiskSeverity = 'low' | 'medium' | 'high'

export interface EvaluatorRisk {
  severity: EvaluatorRiskSeverity
  location: string
  finding: string
  evidence: string
  repair_hint: string
}

export interface EvaluatorOutput {
  decision: EvaluatorDecision
  why: string
  risks: EvaluatorRisk[]
  next_actions: string[]
  model: string
  raw_output: string
}

export interface PostQualityLlmInput {
  posts: CloudPost[]
  qualityReports: QualityReportItem[]
  referenceReports: QualityReportItem[]
}

const QUALITY_EVALUATOR_STAGES: Record<string, number> = {
  post_quality: 2600,
  metadata_suggestion: 1800,
  internal_link_suggestion: 1800,
}

export async function runPostQualityLlmReview(
  input: PostQualityLlmInput,
  options: { onExternalCall?: () => void } = {},
): Promise<EvaluatorOutput> {
  const userPayload = buildPostQualityPayload(input)
  const systemPrompt = `你是「Content Quality Evaluator」。
請只輸出 JSON，不要 Markdown。`

  return runEvaluator({
    stage: 'post_quality',
    modelBudget: QUALITY_EVALUATOR_STAGES.post_quality,
    systemPrompt: `${systemPrompt}

請審核輸出結果的「寫作風格」與「claim risk」兩類風險，不要重複 deterministic schema 的缺漏：

- 風格：過於口語、段落跳躍、語氣不一致、主題離線都算風險。
- claim risk：未標明版本/日期脈絡、過度推論、缺乏可驗證依據、術語定義模糊都算風險。

輸入是一批文章的 quality/reference 檢查摘要。你的輸出必須是 JSON：
{
  "decision": "approve | request_changes | needs_human_input",
  "why": "簡短說明決策",
  "risks": [
    {
      "severity": "high | medium | low",
      "location": "slug 或段落",
      "finding": "問題描述",
      "evidence": "根據何種提示或語句做出判斷",
      "repair_hint": "可執行修補建議"
    }
  ],
  "next_actions": ["可立即執行的人工核對項目（1-5）"]
}

決策規則：
- 只要有明確可修補 claim 風險或多個明顯 style 問題，回傳 request_changes。
- 缺少上下文（版本、時間、測試/對照訊息）時回傳 needs_human_input。
- 其他可直接採納則回傳 approve。`,
    userPayload,
    onExternalCall: options.onExternalCall,
  })
}

export async function runMetadataSuggestionEvaluation(
  report: MetadataSuggestionsReport,
  options: { onExternalCall?: () => void } = {},
): Promise<EvaluatorOutput> {
  const systemPrompt = `你是「Metadata Suggestion Evaluator」。
請只輸出 JSON，不要 Markdown。`
  const userPayload = buildMetadataSuggestionPayload(report)

  return runEvaluator({
    stage: 'metadata_suggestion',
    modelBudget: QUALITY_EVALUATOR_STAGES.metadata_suggestion,
    systemPrompt: `${systemPrompt}

請審核 metadata 建議是否可用，並避免直接改稿，只做阻擋判斷：

- 需檢查 tldr、description、social snippet 的可讀性與可驗證性。
- 若有太長、語意空泛、風格偏離文章脈絡、或可能誤導使用者，回傳 request_changes。
- 若缺乏上下文且無法判斷正確方向，回傳 needs_human_input。
- 風險可修補且可採用回傳 approve。

輸入為 suggestion JSON：
{
  "pipeline": "metadata-suggestions",
  "target_post": {...},
  "existing": {...},
  "suggestions": {...}
}

請輸出 JSON：
{
  "decision": "approve | request_changes | needs_human_input",
  "why": "簡短說明決策",
  "risks": [
    {
      "severity": "high | medium | low",
      "location": "tldr | description | social_snippet",
      "finding": "問題描述",
      "evidence": "根據 suggestion 的哪段文字判斷",
      "repair_hint": "可執行修補建議"
    }
  ],
  "next_actions": ["補充人工核對項目"]
}`,
    userPayload,
    onExternalCall: options.onExternalCall,
  })
}

export async function runInternalLinksSuggestionEvaluation(
  report: InternalLinkSuggestionsReport,
  options: { onExternalCall?: () => void } = {},
): Promise<EvaluatorOutput> {
  const systemPrompt = `你是「Internal Link Suggestion Evaluator」。
請只輸出 JSON，不要 Markdown。`
  const userPayload = buildInternalLinksPayload(report)

  return runEvaluator({
    stage: 'internal_link_suggestion',
    modelBudget: QUALITY_EVALUATOR_STAGES.internal_link_suggestion,
    systemPrompt: `${systemPrompt}

請評估站內連結建議的可採用性：

- anchor text 是否具體、是否會誤導。
- 插入位置是否合理（是否可對應內容段落）。
- 目標 slug 是否與本文主題相關。
- 若機率過低/缺上下文，回傳 needs_human_input；若建議明顯不合適或太多雜訊，回傳 request_changes；可直接採用為 approve。

輸出 JSON：
{
  "decision": "approve | request_changes | needs_human_input",
  "why": "簡短說明決策",
  "risks": [
    {
      "severity": "high | medium | low",
      "location": "target_slug / anchor_text / insert_after_heading",
      "finding": "問題描述",
      "evidence": "根據建議內容/來源推導",
      "repair_hint": "可執行修補建議"
    }
  ],
  "next_actions": ["補充人工核對項目"]
}`,
    userPayload,
    onExternalCall: options.onExternalCall,
  })
}

async function runEvaluator(args: {
  stage: keyof typeof QUALITY_EVALUATOR_STAGES
  modelBudget: number
  systemPrompt: string
  userPayload: string
  onExternalCall?: () => void
}): Promise<EvaluatorOutput> {
  args.onExternalCall?.()
  const model = createModel(args.modelBudget, { stage: args.stage })
  const response = await model.invoke([
    new SystemMessage(args.systemPrompt),
    new HumanMessage(args.userPayload),
  ])
  const raw = modelTextFromContent(response.content)
  if (!raw.trim()) {
    throw new Error(`Evaluator stage ${args.stage} produced empty output`)
  }

  const parsed = parseJsonOutput(raw)
  const modelOutput = parsed ?? {}
  const decision = normalizeDecision(modelOutput.decision)
  const why = normalizeText(modelOutput.why) || 'LLM evaluator output missing reason'
  const risks = normalizeRisks(modelOutput.risks)
  const next_actions = normalizeList(modelOutput.next_actions, '建議先人工核對並補充證據')

  return {
    decision,
    why,
    risks,
    next_actions,
    model: args.stage,
    raw_output: raw,
  }
}

function buildPostQualityPayload(input: PostQualityLlmInput): string {
  const bySlug = new Map<string, QualityReportItem>()
  for (const report of input.qualityReports) {
    bySlug.set(report.slug, report)
  }
  const byReferenceSlug = new Map<string, QualityReportItem>()
  for (const report of input.referenceReports) {
    byReferenceSlug.set(report.slug, report)
  }

  const targets = input.posts.slice(0, 6).map((post) => {
    const quality = bySlug.get(post.slug)
    const reference = byReferenceSlug.get(post.slug)
    return {
      slug: post.slug,
      title: post.title,
      category: post.category,
      lang: post.lang,
      snippet: extractText(post.content).slice(0, 420),
      quality_findings: quality?.findings?.slice(0, 4).map((finding) => finding.message) ?? [],
      quality_warnings: quality?.findings?.filter((finding) => finding.severity === 'warn').slice(0, 4).map((finding) => finding.message) ?? [],
      reference_findings: reference?.findings?.slice(0, 4).map((finding) => finding.message) ?? [],
    }
  })

  const payload = {
    pipeline: 'post-quality',
    target_count: input.posts.length,
    quality_error_count: input.posts.length ? countReportFindings(input.qualityReports, 'error') : 0,
    reference_error_count: input.posts.length ? countReportFindings(input.referenceReports, 'error') : 0,
    targets,
  }

  return JSON.stringify(payload)
}

function buildMetadataSuggestionPayload(report: MetadataSuggestionsReport): string {
  return JSON.stringify({
    pipeline: report.pipeline,
    target_post: report.target_post,
    existing: report.existing,
    suggestions: report.suggestions,
  })
}

function buildInternalLinksPayload(report: InternalLinkSuggestionsReport): string {
  const topOpportunities = report.opportunities.slice(0, 12).map((item) => ({
    target_slug: item.target_slug,
    target_title: item.target_title,
    target_category: item.target_category,
    anchor_text: item.anchor_text,
    insert_after_heading: item.insert_after_heading,
    score: item.score,
    reason: item.reason,
  }))

  return JSON.stringify({
    pipeline: report.pipeline,
    target_post: report.target_post,
    opportunities_count: report.opportunities.length,
    top_opportunities: topOpportunities,
  })
}

function parseJsonOutput(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed)
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
    } catch {
      /* ignore */
    }
  }

  const first = trimmed.indexOf('{')
  const last = trimmed.lastIndexOf('}')
  if (first >= 0 && last > first) {
    try {
      const fenced = trimmed.slice(first, last + 1)
      const parsed = JSON.parse(fenced)
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
    } catch {
      /* ignore */
    }
  }
  return null
}

function normalizeDecision(value: unknown): EvaluatorDecision {
  const normalized = normalizeText(value).toLowerCase().replace(/_/g, ' ')
  if (normalized === 'approve' || normalized === 'approved') return 'approve'
  if (normalized === 'request changes' || normalized === 'request_changes' || normalized === 'change requested') return 'request_changes'
  if (normalized === 'needs human input' || normalized === 'needs_human_input' || normalized === 'needs human check') return 'needs_human_input'
  if (normalized === 'needs_human_check' || normalized === 'needs check') return 'needs_human_input'
  return 'request_changes'
}

function normalizeRisks(value: unknown): EvaluatorRisk[] {
  if (!Array.isArray(value)) return []
  const entries = value.slice(0, 8).map((entry) => {
    if (!entry || typeof entry !== 'object') return null
    const candidate = entry as Record<string, unknown>
    const severity = normalizeRiskSeverity(candidate.severity)
    const finding = normalizeText(candidate.finding)
    const evidence = normalizeText(candidate.evidence)
    const repairHint = normalizeText(candidate.repair_hint)
    const location = normalizeText(candidate.location) || 'unknown'

    return {
      severity,
      location,
      finding: finding || '待補說明',
      evidence: evidence || '無法直接解析',
      repair_hint: repairHint || '請人工核對並補齊證據/措辭',
    }
  }).filter((item): item is EvaluatorRisk => Boolean(item))

  return entries
}

function normalizeRiskSeverity(value: unknown): EvaluatorRiskSeverity {
  const normalized = normalizeText(value).toLowerCase()
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') return normalized
  return 'medium'
}

function normalizeList(value: unknown, fallback: string): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeText(entry))
      .filter((entry): entry is string => entry.length > 0)
      .slice(0, 6)
  }
  return [fallback]
}

function normalizeText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  return String(value).trim()
}

function countReportFindings(reports: QualityReportItem[], severity: PipelineFinding['severity']): number {
  return reports.flatMap((report) => report.findings).filter((finding) => finding.severity === severity).length
}

function extractText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function modelTextFromContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => modelTextFromContent(part))
      .filter(Boolean)
      .join('\n')
  }
  if (content && typeof content === 'object' && 'content' in content) {
    return modelTextFromContent((content as { content?: unknown }).content)
  }
  return ''
}
