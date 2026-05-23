export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '@/pages/api/admin/evidence/_guard'
import { D1ConflictStoreBackend } from '@/lib/agent-evidence/storage/d1/conflict-store'

const RESOLUTIONS = new Set(['accepted_a', 'accepted_b', 'dismissed'])

interface ResolveBody {
  resolution?: string
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const disabled = ensureAgentEvidenceEnabled(e)
  if (disabled) return disabled

  const conflictId = Number(params.conflictId)
  if (!Number.isFinite(conflictId)) return badRequest('conflictId is required')

  const body = (await request.json().catch(() => ({}))) as ResolveBody
  const resolution = body.resolution?.trim() ?? ''
  if (!RESOLUTIONS.has(resolution)) return badRequest(`invalid resolution: ${resolution}`)

  const existing = await e.DB.prepare('SELECT conflict_id FROM evidence_conflicts WHERE conflict_id = ? LIMIT 1')
    .bind(conflictId)
    .first<{ conflict_id: number }>()
  if (!existing) return notFound('conflict not found')

  const status = resolution === 'dismissed' ? 'rejected' : 'approved'
  const backend = new D1ConflictStoreBackend(e.DB)
  await backend.updateStatus(conflictId, status, resolution)

  return json({ ok: true, conflictId, resolution, status })
}
