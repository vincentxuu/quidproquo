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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as {
    cfContext?: { waitUntil?: (promise: Promise<unknown>) => void }
  }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

async function parseBody(request: Request): Promise<{
  userId: string
  redirectTo: string | null
  isJson: boolean
}> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({})) as { userId?: string; redirect?: string }
    return {
      userId: body.userId ?? '',
      redirectTo: body.redirect ?? null,
      isJson: true,
    }
  }

  const formData = await request.formData()
  return {
    userId: String(formData.get('user_id') ?? ''),
    redirectTo: String(formData.get('redirect') ?? ''),
    isJson: false,
  }
}

export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  if (rbacDisabled(typedEnv)) {
    return jsonResponse({ error: 'RBAC disabled' }, 503)
  }

  const roleId = params.id
  if (!roleId) return jsonResponse({ error: 'Missing role id' }, 400)

  const body = await parseBody(request)
  const redirectTo = body.redirectTo || `/admin/console/rbac/roles/${roleId}`
  const permissionResponse = await requireRbacMutationPermission({
    db: typedEnv.DB,
    flags: readFlags(typedEnv),
    action: 'edit',
    redirectTo,
    isJson: body.isJson,
  })
  if (permissionResponse) return permissionResponse

  if (!body.userId) {
    if (!body.isJson) return redirectWithNotice(redirectTo, 'error', '請選擇使用者。')
    return jsonResponse({ error: 'Missing user id' }, 400)
  }

  const db = typedEnv.DB
  const target = await db
    .prepare(`
      SELECT u.email, r.name AS role_name
      FROM console_users u
      CROSS JOIN console_roles r
      WHERE u.user_id = ? AND r.role_id = ?
      LIMIT 1
    `)
    .bind(body.userId, roleId)
    .first<{ email: string; role_name: string }>()

  if (!target) {
    if (!body.isJson) return redirectWithNotice(redirectTo, 'error', '找不到使用者或角色。')
    return jsonResponse({ error: 'User or role not found' }, 404)
  }

  const existing = await db
    .prepare('SELECT user_id FROM console_user_roles WHERE user_id = ? AND role_id = ? LIMIT 1')
    .bind(body.userId, roleId)
    .first<{ user_id: number }>()
  if (existing) {
    if (!body.isJson) return redirectWithNotice(redirectTo, 'error', '此使用者已擁有此角色。')
    return jsonResponse({ error: 'Role already assigned' }, 409)
  }

  await db
    .prepare('INSERT INTO console_user_roles (user_id, role_id, assigned_by) VALUES (?, ?, ?)')
    .bind(body.userId, roleId, 'admin')
    .run()

  const waitUntil = getWaitUntil(locals)
  auditLog({
    db,
    email: 'admin',
    action: 'rbac.user.role.add',
    kind: 'rbac',
    id: roleId,
    payload: {
      userId: body.userId,
      email: target.email,
      role: target.role_name,
    },
    waitUntil,
  }).catch(() => {})

  if (!body.isJson) {
    return redirectWithNotice(redirectTo, 'success', `已將 ${target.email} 加入此角色。`)
  }

  return jsonResponse({ ok: true, roleId, userId: body.userId })
}
