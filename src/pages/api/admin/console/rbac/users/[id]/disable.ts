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

  const formData = await request.formData()
  const action = String(formData.get('action') ?? '')
  const redirectTo = String(formData.get('redirect') ?? `/admin/console/rbac/users/${userId}`)

  if (action !== 'disable' && action !== 'enable') {
    return redirectWithNotice(redirectTo, 'error', '未知的使用者狀態操作。')
  }

  const db = typedEnv.DB
  const permissionResponse = await requireRbacMutationPermission({
    db,
    flags,
    action: 'edit',
    redirectTo,
    isJson: false,
  })
  if (permissionResponse) return permissionResponse

  try {
    const userRow = await db.prepare(
      'SELECT user_id, disabled_at FROM console_users WHERE user_id = ?'
    ).bind(userId).first<{ user_id: number; disabled_at: number | null }>()

    if (!userRow) {
      return redirectWithNotice(redirectTo, 'error', '找不到使用者。')
    }

    const previousDisabledAt = userRow.disabled_at
    let nextDisabledAt: number | null = null
    if (action === 'disable') {
      nextDisabledAt = previousDisabledAt ?? Date.now()
      await db.prepare(
        'UPDATE console_users SET disabled_at = ? WHERE user_id = ?'
      ).bind(nextDisabledAt, userId).run()
    } else {
      await db.prepare(
        'UPDATE console_users SET disabled_at = NULL WHERE user_id = ?'
      ).bind(userId).run()
    }

    const waitUntil = getWaitUntil(locals)
    auditLog({
      db,
      email: 'admin',
      action: action === 'disable' ? 'rbac.user.disable' : 'rbac.user.enable',
      kind: 'rbac',
      id: userId,
      payload: { before: previousDisabledAt, after: nextDisabledAt },
      waitUntil,
    }).catch(() => {})

    return redirectWithNotice(
      redirectTo,
      'success',
      action === 'disable' ? '已停用使用者。' : '已重新啟用使用者。',
    )
  } catch {
    return redirectWithNotice(redirectTo, 'error', '使用者狀態更新失敗。')
  }
}
