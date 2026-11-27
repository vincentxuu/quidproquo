import type { ThreadMessageLike } from '@assistant-ui/react'

export type SessionStatus = 'unknown' | 'queued' | 'running' | 'paused' | 'done' | 'failed' | 'cancelled' | string
export type StatusIndicatorState = 'working' | 'finished' | 'waiting_approval' | 'error' | null

export type SessionEventType =
  | 'system/init'
  | 'system/status'
  | 'system/post_turn_summary'
  | 'user'
  | 'assistant'
  | 'tool_use'
  | 'result'
  | 'control_request'
  | 'control_response'
  | 'env_manager_log'
  | 'prompt_suggestion'
  | 'vcs_state_changed'
  | 'compact_boundary'
  | 'tool_progress'
  | 'rate_limit_event'

export interface EventRow {
  id: string
  type: SessionEventType
  payload: Record<string, unknown>
}

export interface SessionPayload {
  name?: string
  status?: SessionStatus
  instruction?: string
  model?: string
}

export interface SessionEventPayload {
  event_id?: string
  payload_json?: string
  seq?: number
  type?: string
}

export interface DiffPayload {
  available?: boolean
  reason?: string
  summary?: string
  files?: Array<{ name: string; additions?: number; deletions?: number }>
}

export const EVENT_TYPES: SessionEventType[] = [
  'system/init',
  'system/status',
  'system/post_turn_summary',
  'user',
  'assistant',
  'tool_use',
  'result',
  'control_request',
  'control_response',
  'env_manager_log',
  'prompt_suggestion',
  'vcs_state_changed',
  'compact_boundary',
  'tool_progress',
  'rate_limit_event',
]

export const PROV_STEPS = ['provision', 'clone', 'setup_script', 'start_agent'] as const

export const STEP_LABELS: Record<string, string> = {
  provision: 'Allocating sandbox',
  clone: 'Cloning repository',
  setup_script: 'Running setup script',
  start_agent: 'Starting agent',
}

export function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

export function asNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export function stringify(value: unknown, fallback = '') {
  if (typeof value === 'string') return value
  if (value === undefined || value === null) return fallback
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max)}...` : value
}

export function renderSessionLog(type: SessionEventType, payload: Record<string, unknown>) {
  if (type === 'control_response') {
    const requestId = asString(payload.requestId)
    return `${asString(payload.behavior)}${requestId ? ` (${requestId.slice(0, 8)})` : ''}`
  }
  if (type === 'system/post_turn_summary') {
    return asString(payload.statusDetail || payload.status_detail, 'Turn complete')
  }
  if (type === 'system/init') {
    return `Session started · model: ${asString(payload.model, '-')} · mode: ${asString(payload.mode, '-')}`
  }
  if (type === 'env_manager_log') {
    const durationMs = asNumber(payload.durationMs)
    return `${STEP_LABELS[asString(payload.step)] || asString(payload.step)}${durationMs ? ` (${(durationMs / 1000).toFixed(1)}s)` : ''}${payload.message ? ` - ${asString(payload.message)}` : ''}`
  }
  if (type === 'tool_progress') return `${asString(payload.toolName)}: ${asString(payload.progress)}`
  if (type === 'vcs_state_changed') {
    return `Branch: ${asString(payload.branch)}${payload.commitSha ? ` · ${asString(payload.commitSha).slice(0, 7)}` : ''}${payload.diffStat ? ` · ${asString(payload.diffStat)}` : ''}`
  }
  if (type === 'rate_limit_event') {
    const retryAfterMs = asNumber(payload.retryAfterMs) || 0
    return `Rate limited${payload.provider ? ` (${asString(payload.provider)})` : ''} · retry in ${(retryAfterMs / 1000).toFixed(0)}s`
  }
  if (type === 'compact_boundary') {
    return `Context compacted: ${asNumber(payload.beforeTokens) || 0} -> ${asNumber(payload.afterTokens) || 0} tokens`
  }
  return null
}

export function eventToThreadMessage(row: EventRow): ThreadMessageLike | null {
  const { id, type, payload } = row

  if (type === 'user') {
    return {
      id,
      role: 'user',
      content: asString(payload.content),
      metadata: { custom: { eventType: type } },
    }
  }

  if (type === 'assistant') {
    const blocks = (payload.contentBlocks || payload.content_blocks) as unknown
    if (!Array.isArray(blocks)) {
      return {
        id,
        role: 'assistant',
        content: asString(payload.content),
        status: { type: 'complete', reason: 'stop' },
        metadata: { custom: { eventType: type } },
      }
    }
    const content: Array<{ type: 'text'; text: string } | { type: 'reasoning'; text: string }> = []
    for (const block of blocks) {
      if (!block || typeof block !== 'object') continue
      const item = block as Record<string, unknown>
      if (item.type === 'thinking') content.push({ type: 'reasoning', text: asString(item.thinking || item.text) })
      if (item.type === 'text') content.push({ type: 'text', text: asString(item.text) })
    }
    return {
      id,
      role: 'assistant',
      content,
      status: { type: 'complete', reason: 'stop' },
      metadata: { custom: { eventType: type } },
    }
  }

  if (type === 'tool_use') {
    const toolName = asString(payload.toolName || payload.name || payload.tool, 'tool')
    const hasError = Boolean(payload.error)
    return {
      id,
      role: 'assistant',
      content: [{
        type: 'tool-call',
        toolCallId: id,
        toolName,
        argsText: truncate(stringify(payload.input || {}), 500),
        result: hasError ? payload.error : payload.result,
        isError: hasError,
      }],
      status: { type: 'complete', reason: 'stop' },
      metadata: { custom: { eventType: type } },
    }
  }

  if (type === 'result') {
    const raw = stringify(payload.content || payload.output)
    // 失敗的 result 保留原文，由 thread 依 isFailedResultText 渲染成錯誤卡（摘要＋可展開原文）。
    if (isFailedResultText(raw)) {
      return { id, role: 'system', content: raw, metadata: { custom: { eventType: type } } }
    }
    const totalTokens = asNumber(payload.totalTokens)
    const output = truncate(raw, 2000)
    return {
      id,
      role: 'system',
      content: `Result${totalTokens ? ` · ${totalTokens} tokens` : ''}${output ? `\n${output}` : ''}`,
      metadata: { custom: { eventType: type } },
    }
  }

  if (type === 'control_request' || type === 'prompt_suggestion') return null

  const log = renderSessionLog(type, payload)
  if (!log) return null
  return {
    id,
    role: 'system',
    content: log,
    metadata: { custom: { eventType: type } },
  }
}

/** 執行器寫入的失敗結果（session-do、sessions API）一律以這兩種前綴開頭。 */
export function isFailedResultText(text: string) {
  return /^Session failed( to start)?:/i.test(text.trim())
}

function isEmptyContent(content: ThreadMessageLike['content']) {
  if (typeof content === 'string') return content.trim() === ''
  return content.every(part => (part.type === 'text' || part.type === 'reasoning') && !part.text.trim())
}

const asParts = (content: ThreadMessageLike['content']) =>
  typeof content === 'string' ? (content.trim() ? [{ type: 'text' as const, text: content }] : []) : [...content]

/**
 * 事件轉成 thread 訊息。同一輪 agent 的文字與工具呼叫是分開的事件，逐一轉換會讓每個工具呼叫
 * 各帶一個頭像、只有工具呼叫的回合留下空白訊息；這裡把連續的 assistant 訊息併成一則、丟掉空的。
 */
export function eventsToThreadMessages(events: EventRow[]) {
  const out: ThreadMessageLike[] = []
  for (const message of events.map(eventToThreadMessage)) {
    if (!message) continue
    if (message.role === 'assistant' && isEmptyContent(message.content)) continue
    const prev = out.at(-1)
    if (message.role === 'assistant' && prev?.role === 'assistant') {
      out[out.length - 1] = { ...prev, content: [...asParts(prev.content), ...asParts(message.content)] as ThreadMessageLike['content'] }
      continue
    }
    out.push(message)
  }
  return out
}
