export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const id = params.sessionId
  const session = await e.DB.prepare('SELECT * FROM agent_sessions WHERE id = ?').bind(id).first()
  if (!session) return json({ error: 'not found' }, 404)
  const msgs = await e.DB.prepare('SELECT seq, role, content_json, tool_call_id, tool_name FROM agent_messages WHERE session_id = ? ORDER BY seq').bind(id).all()
  const evts = await e.DB.prepare('SELECT seq, type, payload_json FROM agent_events WHERE session_id = ? ORDER BY seq').bind(id).all()
  return json({ session, messages: (msgs as unknown as { results: unknown[] }).results ?? [], events: (evts as unknown as { results: unknown[] }).results ?? [] })
}
