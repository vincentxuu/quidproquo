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

async function parseBody(request: Request): Promise<{ redirectTo: string | null; isJson: boolean }> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({})) as { redirect?: string }
    return { redirectTo: body.redirect ?? null, isJson: true }
  }

  const formData = await request.formData()
  return { redirectTo: String(formData.get('redirect') ?? ''), isJson: false }
}

export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  if (rbacDisabled(typedEnv)) {
    return jsonResponse({ error: 'RBAC disabled' }, 503)
  }

  const roleId = params.id
  const userId = params.userId
  if (!roleId || !userId) return jsonResponse({ error: 'Missing role or user id' }, 400)

  const body = await parseBody(request)
  const redirectTo = body.redirectTo || `/admin/console/rbac/roles/${roleId}`
  const db = typedEnv.DB
  const permissionResponse = await requireRbacMutationPermission({
    db,
    flags: readFlags(typedEnv),
    action: 'edit',
    redirectTo,
    isJson: body.isJson,
  })
  if (permissionResponse) return permissionResponse

  const assignment = await db
    .prepare(`
      SELECT u.email, r.name AS role_name
      FROM console_user_roles ur
      JOIN console_users u ON u.user_id = ur.user_id
      JOIN console_roles r ON r.role_id = ur.role_id
      WHERE ur.role_id = ? AND ur.user_id = ?
      LIMIT 1
    `)
    .bind(roleId, userId)
    .first<{ email: string; role_name: string }>()

  if (!assignment) {
    if (!body.isJson) return redirectWithNotice(redirectTo, 'error', '找不到此角色指派。')
    return jsonResponse({ error: 'Role assignment not found' }, 404)
  }

  await db
    .prepare('DELETE FROM console_user_roles WHERE role_id = ? AND user_id = ?')
    .bind(roleId, userId)
    .run()

  const waitUntil = getWaitUntil(locals)
  auditLog({
    db,
    email: 'admin',
    action: 'rbac.user.role.remove',
    kind: 'rbac',
    id: roleId,
    payload: {
      userId,
      email: assignment.email,
      role: assignment.role_name,
    },
    waitUntil,
  }).catch(() => {})

  if (!body.isJson) {
    return redirectWithNotice(redirectTo, 'success', `已從 ${assignment.email} 移除此角色。`)
  }

  return jsonResponse({ ok: true, roleId, userId })
}

export const DELETE = POST
