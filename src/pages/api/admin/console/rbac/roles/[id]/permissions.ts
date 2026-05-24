export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'
import { auditLog } from '@/lib/agent-console/rbac/permissions'
import { redirectWithNotice } from '@/lib/admin-console/rbac/redirect'
import { requireRbacMutationPermission } from '@/lib/admin-console/rbac/guard'

const VALID_KINDS = new Set(['flow', 'policy', 'provider', 'run', 'approval', 'artifact', 'cost', 'rbac'])
const VALID_ACTIONS = new Set(['view', 'invoke', 'edit', 'delete', 'approve', 'reject', 'cancel', 'export'])

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
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

  const roleId = params.id
  if (!roleId) {
    return new Response(JSON.stringify({ error: 'Missing role id' }), { status: 400 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  let resourceKind: string
  let action: string
  let resourceId: string | null
  let redirectTo = `/admin/console/rbac/roles/${roleId}`

  if (isJson) {
    const body = await request.json() as { resource_kind?: string; action?: string; resource_id?: string; redirect?: string }
    resourceKind = body.resource_kind ?? ''
    action = body.action ?? ''
    resourceId = body.resource_id ?? null
    redirectTo = body.redirect ?? redirectTo
  } else {
    const formData = await request.formData()
    resourceKind = String(formData.get('resource_kind') ?? '')
    action = String(formData.get('action') ?? '')
    const rid = formData.get('resource_id')
    resourceId = rid && String(rid).trim() ? String(rid).trim() : null
    redirectTo = String(formData.get('redirect') ?? redirectTo)
  }

  if (!VALID_KINDS.has(resourceKind)) {
    if (!isJson) {
      return redirectWithNotice(redirectTo, 'error', `資源類型不正確：${resourceKind}`)
    }
    return new Response(JSON.stringify({ error: `Invalid resource_kind: ${resourceKind}` }), { status: 400 })
  }

  if (!VALID_ACTIONS.has(action)) {
    if (!isJson) {
      return redirectWithNotice(redirectTo, 'error', `操作不正確：${action}`)
    }
    return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), { status: 400 })
  }

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
    // Verify role exists
    const roleRow = await db.prepare(
      'SELECT role_id FROM console_roles WHERE role_id = ?'
    ).bind(roleId).first<{ role_id: number }>()

    if (!roleRow) {
      if (!isJson) {
        return redirectWithNotice(redirectTo, 'error', '找不到角色。')
      }
      return new Response(JSON.stringify({ error: 'Role not found' }), { status: 404 })
    }

    const duplicate = await db.prepare(`
      SELECT permission_id
      FROM console_permissions
      WHERE role_id = ?
        AND resource_kind = ?
        AND action = ?
        AND (
          (resource_id IS NULL AND ? IS NULL)
          OR resource_id = ?
        )
      LIMIT 1
    `).bind(roleId, resourceKind, action, resourceId, resourceId).first<{ permission_id: number }>()

    if (duplicate) {
      const label = `${resourceKind}:${resourceId ?? '*'}:${action}`
      if (!isJson) {
        return redirectWithNotice(redirectTo, 'error', `權限已存在：${label}`)
      }
      return new Response(JSON.stringify({ error: 'Permission already exists', permissionId: duplicate.permission_id }), { status: 409 })
    }

    await db.prepare(`
      INSERT INTO console_permissions (role_id, resource_kind, resource_id, action)
      VALUES (?, ?, ?, ?)
    `).bind(roleId, resourceKind, resourceId, action).run()

    auditLog({
      db,
      email: 'admin',
      action: 'rbac.permission.add',
      kind: 'rbac',
      id: roleId,
      payload: { resourceKind, resourceId, action },
      waitUntil: getWaitUntil(locals),
    }).catch(() => {})

    if (!isJson) {
      return redirectWithNotice(redirectTo, 'success', '已新增權限。')
    }

    return new Response(JSON.stringify({ ok: true }), { status: 201 })
  } catch (err) {
    if (!isJson) {
      return redirectWithNotice(redirectTo, 'error', '新增權限失敗。')
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
