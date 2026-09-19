import type { StepKind } from '@/lib/conversation/step-labels'

export interface StepResult {
  title: string
  url: string
  slug?: string
  type?: string
}

/**
 * 一個 step 一個 id；SSE `step` 事件對同一 id 做 upsert。
 * id = agent 名（`Research`），重試時加序號（`Research:1`）。
 */
export interface Step {
  id: string
  kind: StepKind
  label: string
  status: 'active' | 'complete' | 'error'
  input?: { keywords?: string[]; query?: string; slug?: string }
  output?: { count?: number; results?: StepResult[]; passed?: boolean; intent?: string; keywords?: string[]; reason?: string }
  reasoning?: string
  duration_ms?: number
}

/** 伺服器送來的 `step` 事件，欄位皆可缺（部分更新）。 */
export type StepEvent = Partial<Step> & { id: string }

type LinkLike =
  | string
  | {
      title?: unknown
      label?: unknown
      url?: unknown
      source_url?: unknown
      slug?: unknown
      description?: unknown
    }

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  steps?: Step[]
  sources?: LinkLike[]
  related?: LinkLike[]
  streaming?: boolean
}
