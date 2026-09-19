import { PHASE_KEY, baseAgentOfStepId, getStepLabel, isStepAgent, type StepLang } from '@/lib/conversation/step-labels'
import { chatT } from '@/i18n/chat'
import type { Step, StepEvent } from './types'

/**
 * SSE `step` 事件 → message.steps 的純函式。
 * 同一 id 只保留一列（upsert），首次出現的順序就是顯示順序。
 */
export function applyStepEvent(steps: Step[] | undefined, event: StepEvent): Step[] {
  const list = steps ?? []
  const idx = list.findIndex((s) => s.id === event.id)
  if (idx === -1) {
    const agent = baseAgentOfStepId(event.id)
    const created: Step = {
      id: event.id,
      kind: event.kind ?? 'check',
      label: event.label ?? getStepLabel(agent),
      status: event.status ?? 'active',
      ...(event.input ? { input: event.input } : {}),
      ...(event.output ? { output: event.output } : {}),
      ...(event.reasoning ? { reasoning: event.reasoning } : {}),
      ...(event.duration_ms !== undefined ? { duration_ms: event.duration_ms } : {}),
    }
    return [...list, created]
  }
  const prev = list[idx]
  const merged: Step = {
    ...prev,
    ...(event.kind ? { kind: event.kind } : {}),
    ...(event.label ? { label: event.label } : {}),
    ...(event.status ? { status: event.status } : {}),
    ...(event.input ? { input: { ...prev.input, ...event.input } } : {}),
    ...(event.output ? { output: { ...prev.output, ...event.output } } : {}),
    ...(event.reasoning ? { reasoning: event.reasoning } : {}),
    ...(event.duration_ms !== undefined ? { duration_ms: event.duration_ms } : {}),
  }
  const next = list.slice()
  next[idx] = merged
  return next
}

function lastOf(steps: Step[], agent: string): Step | undefined {
  for (let i = steps.length - 1; i >= 0; i -= 1) {
    if (baseAgentOfStepId(steps[i].id) === agent) return steps[i]
  }
  return undefined
}

export type PendingActivity =
  | { type: 'word'; text: string }
  | { type: 'tool'; label: string; keywords: string[] }

/**
 * 答案還沒到時，頭像旁顯示什麼：
 * - 沒任何步驟 → 「分析中」
 * - Planner 剛完成 → 兩顆小點 + 「檢索站內文章 「關鍵字」」（下一步一定是 Research）
 * - 其他 → 依 PHASE_WORD
 */
export function pendingActivity(steps: Step[] | undefined, lang: StepLang = 'zh-TW'): PendingActivity {
  const t = chatT(lang)
  const list = steps ?? []
  const last = list.at(-1)
  if (!last) return { type: 'word', text: t(`chat.activity.${PHASE_KEY.initial}`) }
  const agent = baseAgentOfStepId(last.id)
  if (agent === 'Planner' && last.status === 'complete') {
    return { type: 'tool', label: getStepLabel('Research', lang), keywords: last.output?.keywords ?? [] }
  }
  const key = isStepAgent(agent) ? PHASE_KEY[agent] : PHASE_KEY.initial
  return { type: 'word', text: t(`chat.activity.${key}`) }
}

/**
 * 已完成那一行的過去式文案。只有四種句型：
 * 「檢索了 N 篇文章（、推薦 M 篇延伸閱讀）」／「沒有找到相關文章」／
 * 「找不到足夠來源，改用備援回答」／「中途發生錯誤」。
 * 沒東西可講回傳空字串（例如 off-topic 只跑了 Planner）。
 */
export function summarizeActivity(steps: Step[] | undefined, lang: StepLang = 'zh-TW'): string {
  const t = chatT(lang)
  const sep = lang === 'en' ? ', ' : '、'
  const list = steps ?? []
  if (list.some((s) => s.status === 'error')) return t('chat.activity.error')
  if (lastOf(list, 'Fallback')) return t('chat.activity.fallback')

  const searches = list.filter((s) => baseAgentOfStepId(s.id) === 'Research')
  const reads = list.filter((s) => baseAgentOfStepId(s.id) === 'ReadPost' && (s.output?.count ?? 0) > 0)
  const related = lastOf(list, 'Related')
  const relatedCount = related?.output?.count ?? 0

  if (searches.length === 0) {
    if (relatedCount > 0) return t('chat.activity.suggestedOnly', { n: relatedCount })
    return list.some((s) => s.reasoning) ? t('chat.activity.analysed') : ''
  }
  // 多次搜尋（agent 引擎或重試）：有結果清單就按 URL 去重，沒有就加總
  const count = countSearchedPosts(searches)
  const parts = [count === 0 ? t('chat.activity.none') : t('chat.activity.searched', { n: count })]
  if (reads.length > 0) parts.push(t('chat.activity.read', { n: reads.length }))
  if (relatedCount > 0) parts.push(t('chat.activity.suggested', { n: relatedCount }))
  return parts.join(sep)
}

function countSearchedPosts(searches: Step[]): number {
  if (searches.length === 1) return searches[0].output?.count ?? 0
  if (searches.every((s) => Array.isArray(s.output?.results))) {
    return new Set(searches.flatMap((s) => (s.output?.results ?? []).map((r) => r.url))).size
  }
  return searches.reduce((sum, s) => sum + (s.output?.count ?? 0), 0)
}

/** 列標籤後面的補充：搜尋關鍵字，或讀了哪一篇。 */
export function stepDetailWords(step: Step): string[] {
  const keywords = stepKeywords(step)
  if (keywords.length > 0) return keywords
  if (step.input?.query) return [step.input.query]
  if (step.input?.slug) return [step.output?.results?.[0]?.title ?? step.input.slug]
  return []
}

/**
 * 展開清單要列哪些：工具列全列；thinking 列只在有 reasoning 文字時列；
 * Validation／Critic 這類內部檢查不給讀者看，Fallback 與錯誤例外。
 */
export function visibleSteps(steps: Step[] | undefined): Step[] {
  return (steps ?? []).filter((s) => {
    if (s.status === 'error') return true
    if (s.kind === 'tool') return true
    if (s.kind === 'thinking') return Boolean(s.reasoning)
    return baseAgentOfStepId(s.id) === 'Fallback'
  })
}

/** 每一列的右側 meta：「6 篇」、「思考 1.2 秒」。 */
export function stepMeta(step: Step, lang: StepLang = 'zh-TW'): string {
  const t = chatT(lang)
  if (step.kind === 'tool') {
    const count = step.output?.count
    return typeof count === 'number' ? t('chat.activity.count', { n: count }) : ''
  }
  if (step.kind === 'thinking' && typeof step.duration_ms === 'number' && step.duration_ms > 0) {
    return t('chat.activity.thought', { s: formatSeconds(step.duration_ms, lang) })
  }
  return ''
}

/** 列的標籤：已知 agent 依語言取字，未知的沿用伺服器給的。 */
export function stepLabel(step: Step, lang: StepLang = 'zh-TW'): string {
  const agent = baseAgentOfStepId(step.id)
  return isStepAgent(agent) ? getStepLabel(agent, lang) : step.label
}

export function stepKeywords(step: Step): string[] {
  if (step.input?.keywords && step.input.keywords.length > 0) return step.input.keywords
  if (step.input?.query) return [step.input.query]
  return step.output?.keywords ?? []
}

export function formatSeconds(ms: number, lang: StepLang = 'zh-TW'): string {
  const s = ms / 1000
  return chatT(lang)('chat.activity.seconds', { s: s >= 10 ? String(Math.round(s)) : s.toFixed(1) })
}
