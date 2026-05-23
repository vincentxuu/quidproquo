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

  // Parse roles from form data or JSON
  let roles: string[] = []
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = await request.json() as { roles?: string[] }
    roles = Array.isArray(body.roles) ? body.roles : []
  } else {
    // form submission: multiple checkboxes with name="roles"
    const formData = await request.formData()
    roles = formData.getAll('roles').map(String)
  }

  const db = typedEnv.DB

  try {
    // Verify user exists
    const userRow = await db.prepare(
      'SELECT user_id FROM console_users WHERE user_id = ?'
    ).bind(userId).first<{ user_id: number }>()

    if (!userRow) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    // Resolve role IDs for the given role names
    const roleRows = roles.length > 0
      ? await db.prepare(
          `SELECT role_id FROM console_roles WHERE name IN (${roles.map(() => '?').join(',')})`
        ).bind(...roles).all<{ role_id: number }>()
      : { results: [] as { role_id: number }[] }

    const roleIds = (roleRows.results ?? []).map((r) => r.role_id)

    // DELETE all existing user_roles for this user, then INSERT new ones
    await db.prepare(
      'DELETE FROM console_user_roles WHERE user_id = ?'
    ).bind(userId).run()

    for (const roleId of roleIds) {
      await db.prepare(
        'INSERT OR IGNORE INTO console_user_roles (user_id, role_id) VALUES (?, ?)'
      ).bind(userId, roleId).run()
    }

    // Redirect back to user detail page on form submission
    if (!contentType.includes('application/json')) {
      return Response.redirect(`/admin/console/rbac/users/${userId}`, 303)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
