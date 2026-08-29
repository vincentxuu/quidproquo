export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { json, badRequest, unauthorized } from '@/lib/api/response'
import { createSessionManager } from '@/lib/agent/session-manager'

export const POST: APIRoute = async ({ params, request }) => {
  const e = env as unknown as Env
  const routineId = params.id
  if (!routineId) return badRequest('id required')

  const authHeader = request.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return unauthorized()

  const routine = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(routineId).first<Record<string, unknown>>()
  if (!routine) return json({ error: 'not found' }, 404)
  if (!routine.api_token || routine.api_token !== token) return unauthorized()
  if (Number(routine.enabled) === 0) return json({ error: 'routine_paused' }, 400)

  const sessions = createSessionManager(e.DB)
  const session = await sessions.create({
    instruction: String(routine.instructions ?? ''),
    model: routine.model ? String(routine.model) : undefined,
    repo: routine.repo ? String(routine.repo) : undefined,
    trigger: 'api',
    routineId,
  })

  await e.DB.prepare(
    'UPDATE routines SET last_run_id = ?, last_run_at = ?, last_run_status = ?, updated_at = ? WHERE id = ?',
  ).bind(session.id, Date.now(), 'running', Date.now(), routineId).run()

  return json({ sessionId: session.id, routineId })
}
