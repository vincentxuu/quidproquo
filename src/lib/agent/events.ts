/**
 * Session event types — aligned with Agent SDK stream-json (spec §3.3).
 * 14 event types, discriminated union on `type`.
 */

export interface SystemInitEvent {
  type: 'system/init'
  sessionId: string
  model: string
  mode: 'auto' | 'default' | 'plan'
  tools: string[]
  pendingPermissionRequests?: ControlRequestPayload[]
}

export interface UserEvent {
  type: 'user'
  content: string
}

export interface AssistantEvent {
  type: 'assistant'
  content: string
  stopReason: string
  toolCalls?: ToolCallRef[]
}

export interface ToolCallRef {
  id: string
  name: string
  input: unknown
}

export interface ResultEvent {
  type: 'result'
  content: string
  totalTokens: number
  totalCostUsd: number
}

export interface ControlRequestPayload {
  requestId: string
  toolName: string
  displayName?: string
  input: unknown
  decisionReason?: string
}

export interface ControlRequestEvent {
  type: 'control_request'
  subtype: 'can_use_tool'
  payload: ControlRequestPayload
}

export interface ControlResponseEvent {
  type: 'control_response'
  requestId: string
  behavior: 'allow' | 'deny'
  updatedInput?: unknown
}

export type EnvManagerStep = 'provision' | 'clone' | 'setup_script' | 'start_agent'

export interface EnvManagerLogEvent {
  type: 'env_manager_log'
  step: EnvManagerStep
  status: 'started' | 'completed' | 'failed'
  message?: string
  durationMs?: number
}

export type StatusCategory = 'running' | 'waiting' | 'done' | 'failed' | 'cancelled'

export interface PostTurnSummaryEvent {
  type: 'system/post_turn_summary'
  statusCategory: StatusCategory
  statusDetail: string
  needsAction: boolean
}

export interface PromptSuggestionEvent {
  type: 'prompt_suggestion'
  suggestions: string[]
}

export interface VcsStateChangedEvent {
  type: 'vcs_state_changed'
  branch: string
  commitSha?: string
  diffStat?: string
}

export interface CompactBoundaryEvent {
  type: 'compact_boundary'
  beforeTokens: number
  afterTokens: number
}

export interface ToolProgressEvent {
  type: 'tool_progress'
  toolCallId: string
  toolName: string
  progress: string
}

export interface RateLimitEvent {
  type: 'rate_limit_event'
  retryAfterMs: number
  provider?: string
}

export interface ToolUseEvent {
  type: 'tool_use'
  toolCallId: string
  toolName: string
  input: unknown
  result?: unknown
  error?: string
  durationMs?: number
}

export type SessionEvent =
  | SystemInitEvent
  | UserEvent
  | AssistantEvent
  | ResultEvent
  | ControlRequestEvent
  | ControlResponseEvent
  | EnvManagerLogEvent
  | PostTurnSummaryEvent
  | PromptSuggestionEvent
  | VcsStateChangedEvent
  | CompactBoundaryEvent
  | ToolProgressEvent
  | RateLimitEvent
  | ToolUseEvent

export interface StoredEvent {
  eventId: number
  sessionId: string
  seq: number
  type: SessionEvent['type']
  payload: SessionEvent
  createdAt: number
}

export function encode(event: SessionEvent): string {
  return JSON.stringify(event)
}

export function decode(raw: string): SessionEvent {
  return JSON.parse(raw) as SessionEvent
}

export function toStoredEvent(
  row: { event_id: number; session_id: string; seq: number; type: string; payload_json: string; created_at: number },
): StoredEvent {
  return {
    eventId: row.event_id,
    sessionId: row.session_id,
    seq: row.seq,
    type: row.type as SessionEvent['type'],
    payload: decode(row.payload_json),
    createdAt: row.created_at,
  }
}

export function fromSessionEvent(
  sessionId: string,
  seq: number,
  event: SessionEvent,
): { session_id: string; seq: number; type: string; payload_json: string; created_at: number } {
  return {
    session_id: sessionId,
    seq,
    type: event.type,
    payload_json: encode(event),
    created_at: Date.now(),
  }
}
