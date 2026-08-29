export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, forbidden } from '@/lib/api/response'
import { ensureAgentOsEnabled } from './_guard'
import type { Env } from '@/lib/config/env'
import { env } from 'cloudflare:workers'
import { createSessionManager } from '@/lib/agent/session-manager'
import type { SessionEvent } from '@/lib/agent/events'
import { fromSessionEvent } from '@/lib/agent/events'

interface CreateChatBody {
  instruction?: unknown
  prompt?: unknown
  skill?: unknown
  mode?: unknown
  model?: unknown
  repo?: unknown
  runner_provider?: unknown
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readMode(value: unknown): 'auto' | 'default' | 'plan' | undefined {
  return value === 'auto' || value === 'default' || value === 'plan' ? value : undefined
}

function readBooleanParam(url: URL, key: string): boolean | undefined {
  const value = url.searchParams.get(key)
  if (value == null) return undefined
  if (value === '1' || value === 'true') return true
  if (value === '0' || value === 'false') return false
  return undefined
}

function readNumberParam(url: URL, key: string, fallback: number, max: number): number {
  const raw = url.searchParams.get(key)
  if (!raw) return fallback
  const value = Number.parseInt(raw, 10)
  if (!Number.isFinite(value) || value < 0) return fallback
  return Math.min(value, max)
}

async function persistSessionEvent(db: D1Database, kv: KVNamespace, sessionId: string, event: SessionEvent): Promise<void> {
  const seqRow = await db
    .prepare('SELECT COALESCE(MAX(seq), -1) + 1 AS n FROM agent_events WHERE session_id = ?')
    .bind(sessionId)
    .first<{ n: number }>()
  const seq = seqRow?.n ?? 0
  const row = fromSessionEvent(sessionId, seq, event)
  const result = await db
    .prepare('INSERT INTO agent_events (session_id, seq, type, payload_json, created_at, event_id) VALUES (?, ?, ?, ?, ?, NULL)')
    .bind(row.session_id, row.seq, row.type, row.payload_json, row.created_at)
    .run()
  const eventId = result.meta?.last_row_id
  if (eventId) {
    await db
      .prepare('UPDATE agent_events SET event_id = ? WHERE session_id = ? AND seq = ?')
      .bind(eventId, sessionId, seq)
      .run()
    await kv.put(`session:${sessionId}:last_event`, String(eventId))
  }
}

async function createDevSessionFallback(e: Env, id: string, input: {
  prompt: string
  mode?: 'auto' | 'default' | 'plan'
  model?: string
  repo?: string
  runner_provider?: string
}): Promise<Record<string, unknown>> {
  const mgr = createSessionManager(e.DB)
  const session = await mgr.create({
    id,
    instruction: input.prompt,
    mode: input.mode,
    model: input.model,
    repo: input.repo,
    runnerProvider: input.runner_provider,
    trigger: 'manual',
  })
  await mgr.transition(id, 'running')
  await persistSessionEvent(e.DB, e.SESSION, id, {
    type: 'system/init',
    sessionId: id,
    model: input.model ?? session.model ?? 'default',
    mode: input.mode ?? (session.mode as 'auto' | 'default' | 'plan') ?? 'auto',
    tools: [],
  })
  await persistSessionEvent(e.DB, e.SESSION, id, { type: 'user', content: input.prompt })
  await e.DB
    .prepare('INSERT INTO agent_messages (session_id, seq, role, content_json, tool_call_id, tool_name, created_at) VALUES (?, 0, ?, ?, NULL, NULL, ?)')
    .bind(id, 'user', JSON.stringify(input.prompt), Date.now())
    .run()
  await mgr.transition(id, 'done')
  return { sessionId: id, session: await mgr.get(id), dev_fallback: true }
}

export const GET: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const d = ensureAgentOsEnabled()
  if (d) return d
  const e = env as unknown as Env
  // WS upgrade proxy to DO
  if (request.headers.get('Upgrade') === 'websocket') {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id || !e.AGENT_SESSION_DO) return forbidden()
    const stub = e.AGENT_SESSION_DO.getByName(id)
    return stub.fetch(request as unknown as Request)
  }
  const url = new URL(request.url)
  const mgr = createSessionManager(e.DB)
  const sessions = await mgr.list({
    pinned: readBooleanParam(url, 'pinned'),
    archived: readBooleanParam(url, 'archived') ?? false,
    limit: readNumberParam(url, 'limit', 50, 200),
    offset: readNumberParam(url, 'offset', 0, 10000),
  })
  return json({ sessions })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const d = ensureAgentOsEnabled()
  if (d) return d
  const e = env as unknown as Env
  if (!e.AGENT_SESSION_DO) return badRequest('AGENT_SESSION_DO not configured')
  const body = (await request.json().catch(() => ({}))) as CreateChatBody
  const prompt = readOptionalString(body.instruction) ?? readOptionalString(body.prompt)
  if (!prompt) return badRequest('first user message required')
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const runInput = {
    sessionId: id,
    prompt,
    skill: readOptionalString(body.skill),
    mode: readMode(body.mode),
    model: readOptionalString(body.model),
    repo: readOptionalString(body.repo),
    runner_provider: readOptionalString(body.runner_provider),
  }
  // proxy to DO via getByName
  const stub = e.AGENT_SESSION_DO.getByName(id)
  let data: Record<string, unknown>
  try {
    const res = await stub.fetch(
      new Request(`https://do/run?sessionId=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(runInput),
      }),
    )
    data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  } catch (error) {
    if (!import.meta.env.DEV) throw error
    data = await createDevSessionFallback(e, id, runInput)
  }
  return json({ id, ...data })
}

// WebSocket upgrade + approve proxy: GET ?upgrade=websocket handled by DO
export const ALL: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id || !e.AGENT_SESSION_DO) return forbidden()
  const stub = e.AGENT_SESSION_DO.getByName(id)
  return stub.fetch(request as unknown as Request)
}
