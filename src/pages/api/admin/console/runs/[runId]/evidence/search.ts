export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '@/pages/api/admin/evidence/_guard'
import { D1ClaimFtsBackend } from '@/lib/agent-evidence/storage/d1/claim-fts'

export const GET: APIRoute = async ({ cookies, params, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const disabled = ensureAgentEvidenceEnabled(e)
  if (disabled) return disabled

  const runId = params.runId
  if (!runId) return badRequest('runId is required')

  const query = url.searchParams.get('q')?.trim() ?? ''
  if (!query) return json({ claims: [] })

  const limitRaw = Number(url.searchParams.get('limit') ?? '25')
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(50, limitRaw)) : 25
  const backend = new D1ClaimFtsBackend(e.DB)
  const claims = await backend.search(query, runId, limit)
  return json({ claims })
}
