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
  action: string
  name: string
  description: string | null
  redirectTo: string | null
  isJson: boolean
}> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({})) as {
      action?: string
      name?: string
      description?: string
      redirect?: string
    }
    return {
      action: body.action ?? 'update',
      name: body.name?.trim() ?? '',
      description: body.description?.trim() || null,
      redirectTo: body.redirect ?? null,
      isJson: true,
    }
  }

  const formData = await request.formData()
  return {
    action: String(formData.get('action') ?? 'update'),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim() || null,
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
  const db = typedEnv.DB
  const existing = await db
    .prepare('SELECT role_id, name, description FROM console_roles WHERE role_id = ?')
    .bind(roleId)
    .first<{ role_id: number; name: string; description: string | null }>()
  if (!existing) {
    if (!body.isJson) {
      return redirectWithNotice(
        body.redirectTo || '/admin/console/rbac?tab=roles',
        'error',
        '找不到角色。',
      )
    }
    return jsonResponse({ error: 'Role not found' }, 404)
  }

  const waitUntil = getWaitUntil(locals)

  try {
    const permissionResponse = await requireRbacMutationPermission({
      db,
      flags: readFlags(typedEnv),
      action: body.action === 'delete' ? 'delete' : 'edit',
      redirectTo: body.redirectTo || `/admin/console/rbac/roles/${roleId}`,
      isJson: body.isJson,
    })
    if (permissionResponse) return permissionResponse

    if (body.action === 'delete') {
      if (RESERVED_ROLES.has(existing.name)) {
        if (!body.isJson) {
          return redirectWithNotice(
            body.redirectTo || `/admin/console/rbac/roles/${roleId}`,
            'error',
            '內建角色不可刪除。',
          )
        }
        return jsonResponse({ error: 'Reserved roles cannot be deleted' }, 409)
      }

      await db.prepare('DELETE FROM console_user_roles WHERE role_id = ?').bind(roleId).run()
      await db.prepare('DELETE FROM console_permissions WHERE role_id = ?').bind(roleId).run()
      await db.prepare('DELETE FROM console_roles WHERE role_id = ?').bind(roleId).run()

      auditLog({
        db,
        email: 'admin',
        action: 'rbac.role.delete',
        kind: 'rbac',
        id: roleId,
        payload: { name: existing.name },
        waitUntil,
      }).catch(() => {})

      if (!body.isJson) {
        return redirectWithNotice(
          body.redirectTo || '/admin/console/rbac?tab=roles',
          'success',
          '已刪除角色。',
        )
      }
      return jsonResponse({ ok: true, deleted: true })
    }

    const nextName = RESERVED_ROLES.has(existing.name) ? existing.name : body.name
    if (!/^[a-z][a-z0-9_-]{1,63}$/.test(nextName)) {
      if (!body.isJson) {
        return redirectWithNotice(
          body.redirectTo || `/admin/console/rbac/roles/${roleId}`,
          'error',
          '角色名稱格式不正確。',
        )
      }
      return jsonResponse({ error: 'Invalid role name' }, 400)
    }

    if (nextName !== existing.name) {
      const duplicate = await db
        .prepare('SELECT role_id FROM console_roles WHERE name = ? AND role_id != ? LIMIT 1')
        .bind(nextName, roleId)
        .first<{ role_id: number }>()

      if (duplicate) {
        if (!body.isJson) {
          return redirectWithNotice(
            body.redirectTo || `/admin/console/rbac/roles/${roleId}`,
            'error',
            '此角色名稱已存在。',
          )
        }
        return jsonResponse({ error: 'Role name already exists' }, 409)
      }
    }

    await db
      .prepare('UPDATE console_roles SET name = ?, description = ? WHERE role_id = ?')
      .bind(nextName, body.description, roleId)
      .run()

    auditLog({
      db,
      email: 'admin',
      action: 'rbac.role.update',
      kind: 'rbac',
      id: roleId,
      payload: {
        before: { name: existing.name, description: existing.description },
        after: { name: nextName, description: body.description },
      },
      waitUntil,
    }).catch(() => {})

    if (!body.isJson) {
      return redirectWithNotice(
        body.redirectTo || `/admin/console/rbac/roles/${roleId}`,
        'success',
        '已儲存角色。',
      )
    }
    return jsonResponse({ ok: true, roleId, name: nextName, description: body.description })
  } catch (err) {
    if (!body.isJson) {
      return redirectWithNotice(
        body.redirectTo || `/admin/console/rbac/roles/${roleId}`,
        'error',
        '角色操作失敗。',
      )
    }
    return jsonResponse({ error: String(err) }, 500)
  }
}

export const PATCH = POST
export const DELETE: APIRoute = async (context) => {
  const request = new Request(context.request, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete' }),
    headers: { 'content-type': 'application/json' },
  })
  return POST({ ...context, request })
}
