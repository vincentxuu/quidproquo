export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '../_guard'
import { D1ConflictStoreBackend } from '@/lib/agent-evidence/storage/d1/conflict-store'

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'expired'] as const
type ConflictStatus = (typeof VALID_STATUSES)[number]

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env

  const flagError = ensureAgentEvidenceEnabled(e)
  if (flagError) return flagError

  const searchParams = new URL(url).searchParams
  const rawStatus = searchParams.get('status') ?? 'pending'
  const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 200)
  const cursor = searchParams.get('cursor') ?? undefined

  if (!VALID_STATUSES.includes(rawStatus as ConflictStatus)) {
    return badRequest(`invalid status: ${rawStatus}`)
  }

  const status = rawStatus as ConflictStatus

  const backend = new D1ConflictStoreBackend(e.DB)
  const result = await backend.listByStatus(status, { limit, cursor })

  return json({ conflicts: result.conflicts, cursor: result.cursor })
}
