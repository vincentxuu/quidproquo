export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, forbidden } from '@/lib/api/response'
import { ensureAgentOsEnabled } from './_guard'
import type { Env } from '@/lib/config/env'
import { env } from 'cloudflare:workers'

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
    if (!id || !e.AGENT_SESSION_DO) return forbidden('missing id or DO')
    const stub = e.AGENT_SESSION_DO.getByName(id)
    return stub.fetch(request as unknown as Request)
  }
  const rows = await e.DB.prepare('SELECT id, agent_id, trigger, status, created_at FROM agent_sessions ORDER BY created_at DESC LIMIT 50').all()
  return json({ sessions: rows.results })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const d = ensureAgentOsEnabled()
  if (d) return d
  const e = env as unknown as Env
  if (!e.AGENT_SESSION_DO) return badRequest('AGENT_SESSION_DO not configured')
  const body = (await request.json().catch(() => ({}))) as { prompt?: string; skill?: string }
  if (!body.prompt) return badRequest('prompt required')
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  // proxy to DO via getByName
  const stub = e.AGENT_SESSION_DO.getByName(id)
  const res = await stub.fetch(
    new Request(`https://do/run?sessionId=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return json({ id, ...data })
}

// WebSocket upgrade + approve proxy: GET ?upgrade=websocket handled by DO
export const ALL: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id || !e.AGENT_SESSION_DO) return forbidden('missing id or DO')
  const stub = e.AGENT_SESSION_DO.getByName(id)
  return stub.fetch(request as unknown as Request)
}
