export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'
import { auditLog } from '@/lib/agent-console/rbac/permissions'
import { redirectWithNotice } from '@/lib/admin-console/rbac/redirect'
import { requireRbacMutationPermission } from '@/lib/admin-console/rbac/guard'

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as {
    cfContext?: { waitUntil?: (promise: Promise<unknown>) => void }
  }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  if (
    !flags.agentConsole.enabled
    || (flags.agentConsole.rbac !== undefined && !flags.agentConsole.rbac)
  ) {
    return new Response(JSON.stringify({ error: 'RBAC disabled' }), { status: 503 })
  }

  const userId = params.id
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user id' }), { status: 400 })
  }

  // Parse roles from form data or JSON
  let roles: string[] = []
  let redirectTo = `/admin/console/rbac/users/${userId}`
  const contentType = request.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (isJson) {
    const body = await request.json() as { roles?: string[] }
    roles = Array.isArray(body.roles) ? body.roles : []
    redirectTo = (body as { redirect?: string }).redirect ?? redirectTo
  } else {
    // form submission: multiple checkboxes with name="roles"
    const formData = await request.formData()
    roles = formData.getAll('roles').map(String)
    redirectTo = String(formData.get('redirect') ?? redirectTo)
  }

  const requestedRoles = [...new Set(roles.map((role) => role.trim()).filter(Boolean))]
  const db = typedEnv.DB
  const permissionResponse = await requireRbacMutationPermission({
    db,
    flags,
    action: 'edit',
    redirectTo,
    isJson,
  })
  if (permissionResponse) return permissionResponse

  try {
    // Verify user exists
    const userRow = await db.prepare(
      'SELECT user_id FROM console_users WHERE user_id = ?'
    ).bind(userId).first<{ user_id: number }>()

    if (!userRow) {
      if (!isJson) {
        return redirectWithNotice(redirectTo, 'error', '找不到使用者。')
      }
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    const previousRows = await db.prepare(`
      SELECT r.name
      FROM console_user_roles ur
      JOIN console_roles r ON r.role_id = ur.role_id
      WHERE ur.user_id = ?
      ORDER BY r.name
    `).bind(userId).all<{ name: string }>()
    const previousRoles = (previousRows.results ?? []).map((role) => role.name)

    // Resolve role IDs for the given role names
    const roleRows = requestedRoles.length > 0
      ? await db.prepare(
          `SELECT role_id, name FROM console_roles WHERE name IN (${requestedRoles.map(() => '?').join(',')})`
        ).bind(...requestedRoles).all<{ role_id: number; name: string }>()
      : { results: [] as { role_id: number; name: string }[] }

    const resolvedRoles = roleRows.results ?? []
    const resolvedNames = new Set(resolvedRoles.map((role) => role.name))
    const missingRoles = requestedRoles.filter((role) => !resolvedNames.has(role))
    if (missingRoles.length > 0) {
      const message = `找不到角色：${missingRoles.join(', ')}。`
      if (!isJson) {
        return redirectWithNotice(redirectTo, 'error', message)
      }
      return new Response(JSON.stringify({ error: 'Unknown roles', roles: missingRoles }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      })
    }

    const roleIds = resolvedRoles.map((r) => r.role_id)
    const previousSet = new Set(previousRoles)
    const requestedSet = new Set(requestedRoles)
    const added = requestedRoles.filter((role) => !previousSet.has(role))
    const removed = previousRoles.filter((role) => !requestedSet.has(role))

    // DELETE all existing user_roles for this user, then INSERT new ones
    await db.prepare(
      'DELETE FROM console_user_roles WHERE user_id = ?'
    ).bind(userId).run()

    for (const roleId of roleIds) {
      await db.prepare(
        'INSERT OR IGNORE INTO console_user_roles (user_id, role_id) VALUES (?, ?)'
      ).bind(userId, roleId).run()
    }

    const waitUntil = getWaitUntil(locals)
    auditLog({
      db,
      email: 'admin',
      action: 'rbac.user.roles.update',
      kind: 'rbac',
      id: userId,
      payload: { before: previousRoles, after: requestedRoles, added, removed },
      waitUntil,
    }).catch(() => {})

    // Redirect back to user detail page on form submission
    if (!isJson) {
      return redirectWithNotice(redirectTo, 'success', '已儲存使用者角色。')
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    if (!isJson) {
      return redirectWithNotice(redirectTo, 'error', '角色指派失敗。')
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
