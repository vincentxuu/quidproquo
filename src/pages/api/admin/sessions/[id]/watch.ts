export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { toStoredEvent } from '@/lib/agent/events'
import { formatSSE, keepaliveComment } from '@/lib/agent/sse'

const POLL_INTERVAL_MS = 1000
const MAX_POLL_SECONDS = 25

interface EventRow {
  event_id: number
  session_id: string
  seq: number
  type: string
  payload_json: string
  created_at: number
}

async function fetchEvents(db: D1Database, sessionId: string, afterEventId: number | null): Promise<EventRow[]> {
  const query = afterEventId != null
    ? 'SELECT event_id, session_id, seq, type, payload_json, created_at FROM agent_events WHERE session_id = ? AND event_id > ? ORDER BY event_id ASC'
    : 'SELECT event_id, session_id, seq, type, payload_json, created_at FROM agent_events WHERE session_id = ? ORDER BY event_id ASC'

  const stmt = afterEventId != null
    ? db.prepare(query).bind(sessionId, afterEventId)
    : db.prepare(query).bind(sessionId)

  const result = await stmt.all<EventRow>()
  return result.results ?? []
}

async function getSessionStatus(db: D1Database, sessionId: string): Promise<string | null> {
  const row = await db.prepare('SELECT status FROM agent_sessions WHERE id = ?').bind(sessionId).first<{ status: string }>()
  return row?.status ?? null
}

async function getLastEventTimestamp(kv: KVNamespace, sessionId: string): Promise<string | null> {
  return kv.get(`session:${sessionId}:last_event`)
}

export const GET: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const sessionId = params.id
  if (!sessionId) return new Response('session id required', { status: 400 })

  const status = await getSessionStatus(e.DB, sessionId)
  if (!status) return new Response('session not found', { status: 404 })

  const url = new URL(request.url)
  const resumeTokenRaw = url.searchParams.get('resume_token')
  const resumeToken = resumeTokenRaw ? parseInt(resumeTokenRaw, 10) : null

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (text: string) => controller.enqueue(encoder.encode(text))

      const initialEvents = await fetchEvents(e.DB, sessionId, resumeToken)
      for (const row of initialEvents) {
        enqueue(formatSSE(toStoredEvent(row)))
      }

      let lastSeenId = initialEvents.length > 0
        ? initialEvents[initialEvents.length - 1].event_id
        : resumeToken

      const currentStatus = await getSessionStatus(e.DB, sessionId)
      const isTerminal = currentStatus !== 'running' && currentStatus !== 'pending' && currentStatus !== 'paused'

      if (isTerminal) {
        controller.close()
        return
      }

      let lastKvTimestamp = await getLastEventTimestamp(e.SESSION, sessionId)
      let elapsed = 0

      while (elapsed < MAX_POLL_SECONDS) {
        await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))
        elapsed += POLL_INTERVAL_MS / 1000

        const currentKvTimestamp = await getLastEventTimestamp(e.SESSION, sessionId)
        if (currentKvTimestamp && currentKvTimestamp !== lastKvTimestamp) {
          lastKvTimestamp = currentKvTimestamp
          const newEvents = await fetchEvents(e.DB, sessionId, lastSeenId)
          for (const row of newEvents) {
            enqueue(formatSSE(toStoredEvent(row)))
          }
          if (newEvents.length > 0) {
            lastSeenId = newEvents[newEvents.length - 1].event_id
          }
        }

        const pollStatus = await getSessionStatus(e.DB, sessionId)
        if (pollStatus !== 'running' && pollStatus !== 'pending' && pollStatus !== 'paused') {
          const finalEvents = await fetchEvents(e.DB, sessionId, lastSeenId)
          for (const row of finalEvents) {
            enqueue(formatSSE(toStoredEvent(row)))
          }
          controller.close()
          return
        }
      }

      enqueue(keepaliveComment())
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
