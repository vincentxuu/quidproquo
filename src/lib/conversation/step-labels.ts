/**
 * Ask AI pipeline 步驟的單一標籤表。
 *
 * 伺服器（/api/chat 的 SSE step 事件）與前端（Chat/Activity）都從這裡取字，
 * 不准各自再抄一份——之前兩份手抄表不同步，Planner 一邊翻「規劃檢索策略」
 * 一邊翻「分析問題」，時間軸就長出重複行。
 *
 * 純 TS、無任何 server-only 依賴，前端可直接 import。
 */

export type StepKind = 'thinking' | 'tool' | 'check'

export type StepAgent =
  | 'Planner'
  | 'Research'
  | 'Normalize'
  | 'Writer'
  | 'Validation'
  | 'Critic'
  | 'Fallback'
  | 'Related'

export type StepLang = 'zh-TW' | 'en'

interface StepMeta {
  kind: StepKind
  /** 現在式，列表用：檢索站內文章 */
  label: string
  labelEn: string
  description: string
}

const STEP_META: Record<StepAgent, StepMeta> = {
  Planner: { kind: 'thinking', label: '分析問題', labelEn: 'Analyse the question', description: '理解問題並決定搜尋方向' },
  Research: { kind: 'tool', label: '檢索站內文章', labelEn: 'Search posts', description: '搜尋站內文章與混合檢索' },
  Normalize: { kind: 'check', label: '整理檢索結果', labelEn: 'Normalise results', description: '清理與標準化搜尋結果' },
  Writer: { kind: 'thinking', label: '整理答案', labelEn: 'Compose the answer', description: '根據來源整理最終回答' },
  Validation: { kind: 'check', label: '驗證答案', labelEn: 'Validate the answer', description: '檢查引用與事實一致' },
  Critic: { kind: 'thinking', label: '評估品質', labelEn: 'Review quality', description: '評估信心與相關性' },
  Fallback: { kind: 'check', label: '備援回答', labelEn: 'Fallback answer', description: '使用備援策略產生回答' },
  Related: { kind: 'tool', label: '推薦相關文章', labelEn: 'Suggest related posts', description: '列出相關文章推薦' },
}

/** 等待中的動詞（頭像旁那個字）：依「最後完成的階段」推下一步在做什麼。值是 i18n/chat.ts 的 key 尾碼。 */
export type PhaseKey = 'thinking' | 'searching' | 'composing' | 'fallingBack'
export const PHASE_KEY: Record<'initial' | StepAgent, PhaseKey> = {
  initial: 'thinking',
  Planner: 'searching',
  Research: 'composing',
  Normalize: 'composing',
  Writer: 'composing',
  Validation: 'composing',
  Critic: 'composing',
  Fallback: 'fallingBack',
  Related: 'composing',
}

/** reasoning 事件的 stage（小寫）→ agent 名。 */
const STAGE_TO_AGENT: Record<string, StepAgent> = {
  planner: 'Planner',
  research: 'Research',
  writer: 'Writer',
  critic: 'Critic',
}

export function isStepAgent(value: string): value is StepAgent {
  return value in STEP_META
}

export function getStepKind(agent: string): StepKind {
  return isStepAgent(agent) ? STEP_META[agent].kind : 'check'
}

export function getStepLabel(agent: string, lang: StepLang = 'zh-TW'): string {
  if (!isStepAgent(agent)) return agent
  return lang === 'en' ? STEP_META[agent].labelEn : STEP_META[agent].label
}

export function getStepDescription(agent: string): string {
  return isStepAgent(agent) ? STEP_META[agent].description : agent
}

export function agentFromStage(stage: string): StepAgent | null {
  return STAGE_TO_AGENT[stage.toLowerCase()] ?? null
}

/** `Research:2` → `Research`；`Planner` → `Planner`。 */
export function baseAgentOfStepId(id: string): string {
  const idx = id.indexOf(':')
  return idx === -1 ? id : id.slice(0, idx)
}
