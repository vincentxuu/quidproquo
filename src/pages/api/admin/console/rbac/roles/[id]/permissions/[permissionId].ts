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
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

async function parseBody(request: Request): Promise<{
  formAction: string
  resourceKind: string
  permissionAction: string
  resourceId: string | null
  redirectTo: string | null
  isJson: boolean
}> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({})) as {
      action?: string
      resource_kind?: string
      permission_action?: string
      resource_id?: string | null
      redirect?: string
    }
    return {
      formAction: body.action ?? 'update',
      resourceKind: body.resource_kind ?? '',
      permissionAction: body.permission_action ?? '',
      resourceId: body.resource_id?.trim() || null,
      redirectTo: body.redirect ?? null,
      isJson: true,
    }
  }

  const formData = await request.formData()
  const resourceId = String(formData.get('resource_id') ?? '').trim()
  return {
    formAction: String(formData.get('form_action') ?? formData.get('action') ?? 'update'),
    resourceKind: String(formData.get('resource_kind') ?? ''),
    permissionAction: String(formData.get('permission_action') ?? ''),
    resourceId: resourceId || null,
    redirectTo: String(formData.get('redirect') ?? ''),
    isJson: false,
  }
}

async function removePermission(
  roleId: string | undefined,
  permissionId: string | undefined,
  waitUntil?: (promise: Promise<unknown>) => void,
): Promise<Response> {
  if (!roleId || !permissionId) {
    return jsonResponse({ error: 'Missing role or permission id' }, 400)
  }

  const db = (env as unknown as Env).DB
  await db.prepare(
    'DELETE FROM console_permissions WHERE role_id = ? AND permission_id = ?'
  ).bind(roleId, permissionId).run()

  auditLog({
    db,
    email: 'admin',
    action: 'rbac.permission.remove',
    kind: 'rbac',
    id: roleId,
    payload: { permissionId },
    waitUntil,
  }).catch(() => {})

  return jsonResponse({ ok: true })
}

export const DELETE: APIRoute = async ({ cookies, params, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  if (rbacDisabled(typedEnv)) {
    return jsonResponse({ error: 'RBAC disabled' }, 503)
  }

  const permissionResponse = await requireRbacMutationPermission({
    db: typedEnv.DB,
    flags: readFlags(typedEnv),
    action: 'delete',
    isJson: true,
  })
  if (permissionResponse) return permissionResponse

  return removePermission(params.id, params.permissionId, getWaitUntil(locals))
}

export const POST: APIRoute = async ({ cookies, params, request, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  if (rbacDisabled(typedEnv)) {
    return jsonResponse({ error: 'RBAC disabled' }, 503)
  }

  const body = await parseBody(request)
  const redirectTo = body.redirectTo || `/admin/console/rbac/roles/${params.id}`
  const waitUntil = getWaitUntil(locals)
  const permissionResponse = await requireRbacMutationPermission({
    db: typedEnv.DB,
    flags: readFlags(typedEnv),
    action: body.formAction === 'delete' ? 'delete' : 'edit',
    redirectTo,
    isJson: body.isJson,
  })
  if (permissionResponse) return permissionResponse

  if (body.formAction === 'delete') {
    try {
      const response = await removePermission(params.id, params.permissionId, waitUntil)
      if (!response.ok) return response
      if (body.isJson) return response
      return redirectWithNotice(redirectTo, 'success', '已移除權限。')
    } catch (err) {
      if (!body.isJson) {
        return redirectWithNotice(redirectTo, 'error', '移除權限失敗。')
      }
      return jsonResponse({ error: String(err) }, 500)
    }
  }

  const roleId = params.id
  const permissionId = params.permissionId
  if (!roleId || !permissionId) {
    if (!body.isJson) {
      return redirectWithNotice(redirectTo, 'error', '缺少角色或權限 ID。')
    }
    return jsonResponse({ error: 'Missing role or permission id' }, 400)
  }

  if (!VALID_KINDS.has(body.resourceKind)) {
    if (!body.isJson) {
      return redirectWithNotice(redirectTo, 'error', `資源類型不正確：${body.resourceKind}`)
    }
    return jsonResponse({ error: `Invalid resource_kind: ${body.resourceKind}` }, 400)
  }

  if (!VALID_ACTIONS.has(body.permissionAction)) {
    if (!body.isJson) {
      return redirectWithNotice(redirectTo, 'error', `操作不正確：${body.permissionAction}`)
    }
    return jsonResponse({ error: `Invalid action: ${body.permissionAction}` }, 400)
  }

  const db = typedEnv.DB
  let existing: { permission_id: number; resource_kind: string; resource_id: string | null; action: string } | null = null
  try {
    existing = await db
      .prepare('SELECT permission_id, resource_kind, resource_id, action FROM console_permissions WHERE role_id = ? AND permission_id = ?')
      .bind(roleId, permissionId)
      .first<{ permission_id: number; resource_kind: string; resource_id: string | null; action: string }>()
  } catch (err) {
    if (!body.isJson) {
      return redirectWithNotice(redirectTo, 'error', '載入權限失敗。')
    }
    return jsonResponse({ error: String(err) }, 500)
  }

  if (!existing) {
    if (!body.isJson) {
      return redirectWithNotice(redirectTo, 'error', '找不到權限。')
    }
    return jsonResponse({ error: 'Permission not found' }, 404)
  }

  try {
    const duplicate = await db
      .prepare(`
        SELECT permission_id
        FROM console_permissions
        WHERE role_id = ?
          AND permission_id != ?
          AND resource_kind = ?
          AND action = ?
          AND (
            (resource_id IS NULL AND ? IS NULL)
            OR resource_id = ?
          )
        LIMIT 1
      `)
      .bind(roleId, permissionId, body.resourceKind, body.permissionAction, body.resourceId, body.resourceId)
      .first<{ permission_id: number }>()

    if (duplicate) {
      const label = `${body.resourceKind}:${body.resourceId ?? '*'}:${body.permissionAction}`
      if (!body.isJson) {
        return redirectWithNotice(redirectTo, 'error', `權限已存在：${label}`)
      }
      return jsonResponse({ error: 'Permission already exists', permissionId: duplicate.permission_id }, 409)
    }

    await db
      .prepare('UPDATE console_permissions SET resource_kind = ?, resource_id = ?, action = ? WHERE role_id = ? AND permission_id = ?')
      .bind(body.resourceKind, body.resourceId, body.permissionAction, roleId, permissionId)
      .run()

    auditLog({
      db,
      email: 'admin',
      action: 'rbac.permission.update',
      kind: 'rbac',
      id: roleId,
      payload: {
        permissionId,
        before: {
          resourceKind: existing.resource_kind,
          resourceId: existing.resource_id,
          action: existing.action,
        },
        after: {
          resourceKind: body.resourceKind,
          resourceId: body.resourceId,
          action: body.permissionAction,
        },
      },
      waitUntil,
    }).catch(() => {})
  } catch (err) {
    if (!body.isJson) {
      return redirectWithNotice(redirectTo, 'error', '儲存權限失敗。')
    }
    return jsonResponse({ error: String(err) }, 500)
  }

  if (body.isJson) {
    return jsonResponse({ ok: true, permissionId, resourceKind: body.resourceKind, resourceId: body.resourceId, action: body.permissionAction })
  }
  return redirectWithNotice(redirectTo, 'success', '已儲存權限。')
}

export const PATCH = POST
