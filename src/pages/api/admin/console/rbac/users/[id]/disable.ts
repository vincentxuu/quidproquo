export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  if (!flags.agentConsole.enabled || !flags.agentConsole.rbac) {
    return new Response(JSON.stringify({ error: 'RBAC disabled' }), { status: 503 })
  }

  const userId = params.id
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user id' }), { status: 400 })
  }

  const formData = await request.formData()
  const action = formData.get('action')

  const db = typedEnv.DB

  try {
    if (action === 'disable') {
      await db.prepare(
        'UPDATE console_users SET disabled_at = ? WHERE user_id = ?'
      ).bind(Date.now(), userId).run()
    } else {
      await db.prepare(
        'UPDATE console_users SET disabled_at = NULL WHERE user_id = ?'
      ).bind(userId).run()
    }

    return Response.redirect(`/admin/console/rbac/users/${userId}`, 303)
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
