export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'
import { auditLog } from '@/lib/agent-console/rbac/permissions'
import { redirectWithNotice } from '@/lib/admin-console/rbac/redirect'
import { requireRbacMutationPermission } from '@/lib/admin-console/rbac/guard'

type PermissionGrant = {
  resourceKind: string
  action: string
  resourceId: string | null
}

const PRESETS: Record<string, { label: string; grants: PermissionGrant[] }> = {
  viewer: {
    label: '唯讀檢視',
    grants: ['flow', 'policy', 'provider', 'run', 'approval', 'artifact', 'cost'].map((resourceKind) => ({
      resourceKind,
      action: 'view',
      resourceId: null,
    })),
  },
  operator: {
    label: '執行操作',
    grants: [
      { resourceKind: 'flow', action: 'view', resourceId: null },
      { resourceKind: 'flow', action: 'invoke', resourceId: null },
      { resourceKind: 'run', action: 'view', resourceId: null },
      { resourceKind: 'run', action: 'invoke', resourceId: null },
      { resourceKind: 'run', action: 'cancel', resourceId: null },
      { resourceKind: 'approval', action: 'view', resourceId: null },
      { resourceKind: 'approval', action: 'approve', resourceId: null },
      { resourceKind: 'approval', action: 'reject', resourceId: null },
    ],
  },
  artifactReviewer: {
    label: '產出物審核',
    grants: [
      { resourceKind: 'run', action: 'view', resourceId: null },
      { resourceKind: 'artifact', action: 'view', resourceId: null },
      { resourceKind: 'artifact', action: 'approve', resourceId: null },
      { resourceKind: 'artifact', action: 'reject', resourceId: null },
      { resourceKind: 'artifact', action: 'export', resourceId: null },
      { resourceKind: 'approval', action: 'view', resourceId: null },
      { resourceKind: 'approval', action: 'approve', resourceId: null },
      { resourceKind: 'approval', action: 'reject', resourceId: null },
    ],
  },
  rbacAdmin: {
    label: 'RBAC 管理',
    grants: [
      { resourceKind: 'rbac', action: 'view', resourceId: null },
      { resourceKind: 'rbac', action: 'edit', resourceId: null },
      { resourceKind: 'rbac', action: 'delete', resourceId: null },
    ],
  },
}

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
  preset: string
  redirectTo: string | null
  isJson: boolean
}> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({})) as { preset?: string; redirect?: string }
    return {
      preset: body.preset ?? '',
      redirectTo: body.redirect ?? null,
      isJson: true,
    }
  }

  const formData = await request.formData()
  return {
    preset: String(formData.get('preset') ?? ''),
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

  const preset = PRESETS[body.preset]
  if (!preset) {
    if (!body.isJson) return redirectWithNotice(redirectTo, 'error', '未知的權限範本。')
    return jsonResponse({ error: 'Unknown permission preset' }, 400)
  }

  const db = typedEnv.DB
  const role = await db
    .prepare('SELECT role_id, name FROM console_roles WHERE role_id = ?')
    .bind(roleId)
    .first<{ role_id: number; name: string }>()
  if (!role) {
    if (!body.isJson) return redirectWithNotice(redirectTo, 'error', '找不到角色。')
    return jsonResponse({ error: 'Role not found' }, 404)
  }

  let inserted = 0
  for (const grant of preset.grants) {
    const existing = grant.resourceId === null
      ? await db
          .prepare(
            `SELECT permission_id
             FROM console_permissions
             WHERE role_id = ?
               AND resource_kind = ?
               AND action = ?
               AND resource_id IS NULL
             LIMIT 1`,
          )
          .bind(roleId, grant.resourceKind, grant.action)
          .first<{ permission_id: number }>()
      : await db
          .prepare(
            `SELECT permission_id
             FROM console_permissions
             WHERE role_id = ?
               AND resource_kind = ?
               AND action = ?
               AND resource_id = ?
             LIMIT 1`,
          )
          .bind(roleId, grant.resourceKind, grant.action, grant.resourceId)
          .first<{ permission_id: number }>()
    if (existing) continue

    await db
      .prepare(
        `INSERT INTO console_permissions (role_id, resource_kind, resource_id, action)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(roleId, grant.resourceKind, grant.resourceId, grant.action)
      .run()
    inserted += 1
  }

  const waitUntil = getWaitUntil(locals)
  auditLog({
    db,
    email: 'admin',
    action: 'rbac.permission.preset.apply',
    kind: 'rbac',
    id: roleId,
    payload: {
      role: role.name,
      preset: body.preset,
      label: preset.label,
      grants: preset.grants,
      inserted,
    },
    waitUntil,
  }).catch(() => {})

  if (!body.isJson) {
    return redirectWithNotice(
      redirectTo,
      'success',
      `已套用「${preset.label}」範本，新增 ${inserted} 項權限。`,
    )
  }

  return jsonResponse({ ok: true, preset: body.preset, inserted })
}
