export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'

const VALID_KINDS = new Set(['flow', 'policy', 'provider', 'run', 'approval', 'artifact', 'cost', 'rbac'])
const VALID_ACTIONS = new Set(['view', 'invoke', 'edit', 'delete', 'approve', 'reject', 'cancel', 'export'])

export const POST: APIRoute = async ({ params, request, cookies }) => {
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
  let resourceKind: string
  let action: string
  let resourceId: string | null

  if (contentType.includes('application/json')) {
    const body = await request.json() as { resource_kind?: string; action?: string; resource_id?: string }
    resourceKind = body.resource_kind ?? ''
    action = body.action ?? ''
    resourceId = body.resource_id ?? null
  } else {
    const formData = await request.formData()
    resourceKind = String(formData.get('resource_kind') ?? '')
    action = String(formData.get('action') ?? '')
    const rid = formData.get('resource_id')
    resourceId = rid && String(rid).trim() ? String(rid).trim() : null
  }

  if (!VALID_KINDS.has(resourceKind)) {
    return new Response(JSON.stringify({ error: `Invalid resource_kind: ${resourceKind}` }), { status: 400 })
  }

  if (!VALID_ACTIONS.has(action)) {
    return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), { status: 400 })
  }

  const db = typedEnv.DB

  try {
    // Verify role exists
    const roleRow = await db.prepare(
      'SELECT role_id FROM console_roles WHERE role_id = ?'
    ).bind(roleId).first<{ role_id: number }>()

    if (!roleRow) {
      return new Response(JSON.stringify({ error: 'Role not found' }), { status: 404 })
    }

    await db.prepare(`
      INSERT INTO console_permissions (role_id, resource_kind, resource_id, action)
      VALUES (?, ?, ?, ?)
    `).bind(roleId, resourceKind, resourceId, action).run()

    if (!contentType.includes('application/json')) {
      return Response.redirect(`/admin/console/rbac/roles/${roleId}`, 303)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
