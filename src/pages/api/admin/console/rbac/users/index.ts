export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'
import { auditLog } from '@/lib/agent-console/rbac/permissions'
import { redirectWithNotice } from '@/lib/admin-console/rbac/redirect'
import { requireRbacMutationPermission } from '@/lib/admin-console/rbac/guard'

function rbacDisabled(typedEnv: Env): boolean {
  const flags = readFlags(typedEnv)
  return !flags.agentConsole.enabled
    || (flags.agentConsole.rbac !== undefined && !flags.agentConsole.rbac)
}

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  if (rbacDisabled(typedEnv)) {
    return new Response(JSON.stringify({ error: 'RBAC disabled' }), { status: 503 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  let email = ''
  let roles: string[] = []
  let redirectTo = '/admin/console/rbac?tab=users'

  if (contentType.includes('application/json')) {
    const body = await request.json() as { email?: string; roles?: string[]; redirect?: string }
    email = body.email?.trim().toLowerCase() ?? ''
    roles = Array.isArray(body.roles) ? body.roles : []
    redirectTo = body.redirect || redirectTo
  } else {
    const formData = await request.formData()
    email = String(formData.get('email') ?? '').trim().toLowerCase()
    roles = formData.getAll('roles').map(String)
    redirectTo = String(formData.get('redirect') ?? redirectTo)
  }

  const isJson = contentType.includes('application/json')
  const requestedRoles = [...new Set(roles.map((role) => role.trim()).filter(Boolean))]

  if (!email || !email.includes('@')) {
    if (!isJson) return redirectWithNotice(redirectTo, 'error', '電子郵件格式無效。')
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 })
  }

  const db = typedEnv.DB
  const permissionResponse = await requireRbacMutationPermission({
    db,
    flags: readFlags(typedEnv),
    action: 'edit',
    redirectTo,
    isJson,
  })
  if (permissionResponse) return permissionResponse

  try {
    const now = Date.now()
    const existing = await db.prepare(
      'SELECT user_id FROM console_users WHERE email = ? LIMIT 1'
    ).bind(email).first<{ user_id: number }>()

    if (existing) {
      const message = `使用者 ${email} 已存在，請到使用者詳情編輯角色。`
      if (!isJson) return redirectWithNotice(redirectTo, 'error', message)
      return new Response(JSON.stringify({ error: 'User already exists', userId: existing.user_id }), { status: 409 })
    }

    await db.prepare(`
      INSERT INTO console_users (email, created_at)
      VALUES (?, ?)
    `).bind(email, now).run()

    const result = await db.prepare(
      'SELECT user_id FROM console_users WHERE email = ?'
    ).bind(email).first<{ user_id: number }>()

    const userId = result?.user_id
    if (!userId) {
      if (!isJson) return redirectWithNotice(redirectTo, 'error', '無法建立使用者。')
      return new Response(JSON.stringify({ error: 'Unable to create user' }), { status: 500 })
    }

    if (requestedRoles.length > 0) {
      const roleRows = await db.prepare(
        `SELECT role_id, name FROM console_roles WHERE name IN (${requestedRoles.map(() => '?').join(',')})`
      ).bind(...requestedRoles).all<{ role_id: number; name: string }>()

      const resolvedRoles = roleRows.results ?? []
      const resolvedRoleNames = new Set(resolvedRoles.map((role) => role.name))
      const missingRoles = requestedRoles.filter((role) => !resolvedRoleNames.has(role))
      if (missingRoles.length > 0) {
        await db.prepare('DELETE FROM console_users WHERE user_id = ?').bind(userId).run()
        const message = `找不到角色：${missingRoles.join(', ')}`
        if (!isJson) return redirectWithNotice(redirectTo, 'error', message)
        return new Response(JSON.stringify({ error: 'Unknown roles', roles: missingRoles }), { status: 400 })
      }

      for (const role of resolvedRoles) {
        await db.prepare(
          'INSERT OR IGNORE INTO console_user_roles (user_id, role_id, assigned_by) VALUES (?, ?, ?)'
        ).bind(userId, role.role_id, 'admin').run()
      }
    }

    auditLog({
      db,
      email: 'admin',
      action: 'rbac.user.create',
      kind: 'rbac',
      id: String(userId),
      payload: { email, roles: requestedRoles },
      waitUntil: getWaitUntil(locals),
    }).catch(() => {})

    if (!isJson) {
      return redirectWithNotice(redirectTo, 'success', `已儲存使用者 ${email}。`)
    }

    return new Response(JSON.stringify({ ok: true, userId }), { status: 201 })
  } catch (err) {
    if (!isJson) return redirectWithNotice(redirectTo, 'error', String(err))
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
