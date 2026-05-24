export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'
import { auditLog } from '@/lib/agent-console/rbac/permissions'
import { redirectWithNotice } from '@/lib/admin-console/rbac/redirect'
import { requireRbacMutationPermission } from '@/lib/admin-console/rbac/guard'

const RESERVED_ROLES = new Set(['admin', 'operator', 'approver', 'viewer'])

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
  let name = ''
  let description: string | null = null
  let redirectTo = '/admin/console/rbac?tab=roles'

  if (contentType.includes('application/json')) {
    const body = await request.json() as { name?: string; description?: string; redirect?: string }
    name = body.name?.trim() ?? ''
    description = body.description?.trim() || null
    redirectTo = body.redirect || redirectTo
  } else {
    const formData = await request.formData()
    name = String(formData.get('name') ?? '').trim()
    description = String(formData.get('description') ?? '').trim() || null
    redirectTo = String(formData.get('redirect') ?? redirectTo)
  }

  const isJson = contentType.includes('application/json')

  if (!/^[a-z][a-z0-9_-]{1,63}$/.test(name)) {
    if (!isJson) return redirectWithNotice(redirectTo, 'error', '角色名稱格式無效。')
    return new Response(JSON.stringify({ error: 'Invalid role name' }), { status: 400 })
  }

  if (RESERVED_ROLES.has(name)) {
    if (!isJson) return redirectWithNotice(redirectTo, 'error', `角色 ${name} 是系統保留角色，不能從新增角色表單修改。`)
    return new Response(JSON.stringify({ error: 'Reserved role cannot be created here' }), { status: 409 })
  }

  const permissionResponse = await requireRbacMutationPermission({
    db: typedEnv.DB,
    flags: readFlags(typedEnv),
    action: 'edit',
    redirectTo,
    isJson,
  })
  if (permissionResponse) return permissionResponse

  try {
    const existing = await typedEnv.DB.prepare(
      'SELECT role_id FROM console_roles WHERE name = ? LIMIT 1'
    ).bind(name).first<{ role_id: number }>()

    if (existing) {
      const message = `角色 ${name} 已存在，請到角色詳情編輯。`
      if (!isJson) return redirectWithNotice(redirectTo, 'error', message)
      return new Response(JSON.stringify({ error: 'Role already exists', roleId: existing.role_id }), { status: 409 })
    }

    await typedEnv.DB.prepare(`
      INSERT INTO console_roles (name, description)
      VALUES (?, ?)
    `).bind(name, description).run()

    const role = await typedEnv.DB.prepare(
      'SELECT role_id FROM console_roles WHERE name = ?'
    ).bind(name).first<{ role_id: number }>()

    auditLog({
      db: typedEnv.DB,
      email: 'admin',
      action: 'rbac.role.upsert',
      kind: 'rbac',
      id: role?.role_id != null ? String(role.role_id) : undefined,
      payload: { name, description },
      waitUntil: getWaitUntil(locals),
    }).catch(() => {})

    if (!isJson) {
      return redirectWithNotice(redirectTo, 'success', `已儲存角色 ${name}。`)
    }

    return new Response(JSON.stringify({ ok: true, roleId: role?.role_id }), { status: 201 })
  } catch (err) {
    if (!isJson) return redirectWithNotice(redirectTo, 'error', String(err))
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
