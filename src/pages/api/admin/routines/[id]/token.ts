export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const routineId = params.id
  if (!routineId) return badRequest('id required')

  const routine = await e.DB.prepare('SELECT id FROM routines WHERE id = ?').bind(routineId).first()
  if (!routine) return json({ error: 'not found' }, 404)

  const token = crypto.randomUUID()
  await e.DB.prepare(
    'UPDATE routines SET api_token = ?, api_token_created_at = ?, updated_at = ? WHERE id = ?',
  ).bind(token, Date.now(), Date.now(), routineId).run()

  return json({ token, routineId })
}

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const routineId = params.id
  if (!routineId) return badRequest('id required')

  await e.DB.prepare(
    'UPDATE routines SET api_token = NULL, api_token_created_at = NULL, updated_at = ? WHERE id = ?',
  ).bind(Date.now(), routineId).run()

  return json({ ok: true, routineId })
}
