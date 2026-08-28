export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '@/pages/api/admin/evidence/_guard'
import { D1ConflictStoreBackend } from '@/lib/agent-evidence/storage/d1/conflict-store'
import { auditLog, PermissionDenied, requirePermission } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'

const RESOLUTIONS = new Set(['accepted_a', 'accepted_b', 'dismissed'])

interface ResolveBody {
  resolution?: string
}

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

export const POST: APIRoute = async ({ cookies, params, request, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const flags = readFlags(e)
  const actor = 'admin'
  const disabled = ensureAgentEvidenceEnabled(e)
  if (disabled) return disabled

  const conflictId = Number(params.conflictId)
  if (!Number.isFinite(conflictId)) return badRequest('conflictId is required')

  const body = (await request.json().catch(() => ({}))) as ResolveBody
  const resolution = body.resolution?.trim() ?? ''
  if (!RESOLUTIONS.has(resolution)) return badRequest(`invalid resolution: ${resolution}`)

  const existing = await e.DB.prepare(`
    SELECT ec.conflict_id,
           ec.status,
           ec.resolved_by,
           ec.claim_a_id,
           ec.claim_b_id,
           COALESCE(ca.flow_run_id, cb.flow_run_id) AS flow_run_id
    FROM evidence_conflicts ec
    LEFT JOIN evidence_claims ca ON ca.claim_id = ec.claim_a_id
    LEFT JOIN evidence_claims cb ON cb.claim_id = ec.claim_b_id
    WHERE ec.conflict_id = ?
    LIMIT 1
  `)
    .bind(conflictId)
    .first<{
      conflict_id: number
      status: string
      resolved_by: string | null
      claim_a_id: number
      claim_b_id: number
      flow_run_id: string | null
    }>()
  if (!existing) return notFound('conflict not found')
  if (existing.status !== 'pending') {
    return json({
      error: `conflict already resolved: ${existing.status}`,
      conflictId,
      status: existing.status,
      resolution: existing.resolved_by,
    }, 409)
  }

  try {
    await requirePermission({
      db: e.DB,
      email: actor,
      kind: 'run',
      id: existing.flow_run_id ?? undefined,
      action: resolution === 'dismissed' ? 'reject' : 'approve',
      flags,
    })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  const status = resolution === 'dismissed' ? 'rejected' : 'approved'
  const backend = new D1ConflictStoreBackend(e.DB)
  await backend.updateStatus(conflictId, status, resolution)

  auditLog({
    db: e.DB,
    email: actor,
    action: 'evidence.conflict.resolve',
    kind: 'run',
    id: existing.flow_run_id ?? undefined,
    payload: {
      conflictId,
      claimAId: existing.claim_a_id,
      claimBId: existing.claim_b_id,
      resolution,
      status,
    },
    waitUntil: getWaitUntil(locals),
  }).catch(() => {})

  return json({ ok: true, conflictId, resolution, status, flowRunId: existing.flow_run_id })
}
