import type { Flags } from '@/lib/config/flags'
import {
  PermissionDenied,
  requirePermission,
  type ResourceAction,
} from '@/lib/agent-console/rbac/permissions'
import { redirectWithNotice } from './redirect'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export async function requireRbacMutationPermission(opts: {
  db: D1Database
  flags: Flags
  action: Extract<ResourceAction, 'edit' | 'delete'>
  redirectTo?: string | null
  isJson: boolean
  email?: string
}): Promise<Response | undefined> {
  try {
    await requirePermission({
      db: opts.db,
      email: opts.email ?? 'admin',
      kind: 'rbac',
      action: opts.action,
      flags: opts.flags,
    })
    return undefined
  } catch (err) {
    if (!(err instanceof PermissionDenied)) throw err

    if (opts.isJson) {
      return jsonResponse({ error: err.message }, 403)
    }

    return redirectWithNotice(
      opts.redirectTo || '/admin/console/rbac',
      'error',
      opts.action === 'delete'
        ? '權限不足：需要 RBAC delete 權限。'
        : '權限不足：需要 RBAC edit 權限。',
    )
  }
}
