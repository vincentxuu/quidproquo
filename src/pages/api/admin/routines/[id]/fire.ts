export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { json, badRequest, unauthorized } from '@/lib/api/response'
import { getWaitUntil, startRoutineRun } from '@/lib/agent/routine-run'

export const POST: APIRoute = async ({ params, request, locals }) => {
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

  const { sessionId, run } = await startRoutineRun(e, {
    id: routineId,
    instructions: String(routine.instructions ?? ''),
    model: routine.model ? String(routine.model) : null,
    repo: routine.repo ? String(routine.repo) : null,
  }, { trigger: 'api' })
  getWaitUntil(locals)?.(run)

  return json({ sessionId, routineId })
}
