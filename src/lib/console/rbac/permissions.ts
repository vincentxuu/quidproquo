import type { Flags } from '../../config/flags'

export type ResourceKind = 'flow' | 'policy' | 'provider' | 'run' | 'approval' | 'artifact' | 'cost' | 'rbac'
export type ResourceAction = 'view' | 'invoke' | 'edit' | 'delete' | 'approve' | 'reject' | 'cancel' | 'export'

export class PermissionDenied extends Error {
  readonly status = 403
  constructor(message = 'Permission denied') {
    super(message)
    this.name = 'PermissionDenied'
  }
}

export interface RequirePermissionOptions {
  db: D1Database
  email: string  // from admin session
  kind: ResourceKind
  id?: string    // null = wildcard check
  action: ResourceAction
  flags: Flags
}

export async function requirePermission(opts: RequirePermissionOptions): Promise<void> {
  // Bypass entirely when RBAC flag is off (Phases 1-6 behavior preserved)
  if (!opts.flags.agentConsole?.rbac) return

  const result = await opts.db.prepare(`
    SELECT COUNT(*) AS cnt
    FROM console_user_roles ur
    JOIN console_users u ON u.user_id = ur.user_id
    JOIN console_permissions p ON p.role_id = ur.role_id
    WHERE u.email = ?
      AND u.disabled_at IS NULL
      AND p.resource_kind = ?
      AND p.action = ?
      AND (p.resource_id IS NULL OR p.resource_id = ?)
  `).bind(opts.email, opts.kind, opts.action, opts.id ?? null).first<{ cnt: number }>()

  if (!result || result.cnt === 0) {
    throw new PermissionDenied(`No '${opts.action}' permission on ${opts.kind}${opts.id ? ` '${opts.id}'` : ''}`)
  }
}

export async function auditLog(opts: {
  db: D1Database
  email: string
  action: string
  kind: ResourceKind
  id?: string
  payload?: unknown
  waitUntil?: (promise: Promise<unknown>) => void
}): Promise<void> {
  const insert = async () => {
    const user = await opts.db.prepare(
      'SELECT user_id FROM console_users WHERE email = ?'
    ).bind(opts.email).first<{ user_id: number }>()

    await opts.db.prepare(`
      INSERT INTO console_audit_log (user_id, action, resource_kind, resource_id, payload_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      user?.user_id ?? null,
      opts.action,
      opts.kind,
      opts.id ?? null,
      opts.payload ? JSON.stringify(opts.payload) : null,
      Date.now(),
    ).run()
  }

  if (opts.waitUntil) {
    opts.waitUntil(insert().catch(() => { /* non-fatal */ }))
  } else {
    await insert().catch(() => { /* non-fatal */ })
  }
}
