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
  action: string
  email: string
  redirectTo: string | null
  isJson: boolean
}> {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({})) as {
      action?: string
      email?: string
      redirect?: string
    }
    return {
      action: body.action ?? 'update',
      email: body.email?.trim().toLowerCase() ?? '',
      redirectTo: body.redirect ?? null,
      isJson: true,
    }
  }

  const formData = await request.formData()
  return {
    action: String(formData.get('action') ?? 'update'),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
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

  const userId = params.id
  if (!userId) return jsonResponse({ error: 'Missing user id' }, 400)

  const body = await parseBody(request)
  const db = typedEnv.DB
  const existing = await db
    .prepare('SELECT user_id, email FROM console_users WHERE user_id = ?')
    .bind(userId)
    .first<{ user_id: number; email: string }>()
  if (!existing) {
    if (!body.isJson) {
      return redirectWithNotice(
        body.redirectTo || '/admin/console/rbac?tab=users',
        'error',
        '找不到使用者。',
      )
    }
    return jsonResponse({ error: 'User not found' }, 404)
  }

  const waitUntil = getWaitUntil(locals)

  try {
    const permissionResponse = await requireRbacMutationPermission({
      db,
      flags: readFlags(typedEnv),
      action: body.action === 'delete' ? 'delete' : 'edit',
      redirectTo: body.redirectTo || `/admin/console/rbac/users/${userId}`,
      isJson: body.isJson,
    })
    if (permissionResponse) return permissionResponse

    if (body.action === 'delete') {
      await db.prepare('DELETE FROM console_user_roles WHERE user_id = ?').bind(userId).run()
      await db.prepare('UPDATE console_audit_log SET user_id = NULL WHERE user_id = ?').bind(userId).run()
      await db.prepare('DELETE FROM console_users WHERE user_id = ?').bind(userId).run()

      auditLog({
        db,
        email: 'admin',
        action: 'rbac.user.delete',
        kind: 'rbac',
        id: userId,
        payload: { email: existing.email },
        waitUntil,
      }).catch(() => {})

      if (!body.isJson) {
        return redirectWithNotice(
          body.redirectTo || '/admin/console/rbac?tab=users',
          'success',
          '已刪除使用者。',
        )
      }
      return jsonResponse({ ok: true, deleted: true })
    }

    if (!body.email || !body.email.includes('@')) {
      if (!body.isJson) {
        return redirectWithNotice(
          body.redirectTo || `/admin/console/rbac/users/${userId}`,
          'error',
          '請輸入有效的電子郵件。',
        )
      }
      return jsonResponse({ error: 'Invalid email' }, 400)
    }

    if (body.email !== existing.email) {
      const duplicate = await db
        .prepare('SELECT user_id FROM console_users WHERE email = ? AND user_id != ? LIMIT 1')
        .bind(body.email, userId)
        .first<{ user_id: number }>()

      if (duplicate) {
        if (!body.isJson) {
          return redirectWithNotice(
            body.redirectTo || `/admin/console/rbac/users/${userId}`,
            'error',
            '此電子郵件已被其他使用者使用。',
          )
        }
        return jsonResponse({ error: 'Email already exists' }, 409)
      }
    }

    await db
      .prepare('UPDATE console_users SET email = ? WHERE user_id = ?')
      .bind(body.email, userId)
      .run()

    auditLog({
      db,
      email: 'admin',
      action: 'rbac.user.update',
      kind: 'rbac',
      id: userId,
      payload: { before: existing.email, after: body.email },
      waitUntil,
    }).catch(() => {})

    if (!body.isJson) {
      return redirectWithNotice(
        body.redirectTo || `/admin/console/rbac/users/${userId}`,
        'success',
        '已儲存使用者。',
      )
    }
    return jsonResponse({ ok: true, userId, email: body.email })
  } catch (err) {
    if (!body.isJson) {
      return redirectWithNotice(
        body.redirectTo || `/admin/console/rbac/users/${userId}`,
        'error',
        '使用者操作失敗。',
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
