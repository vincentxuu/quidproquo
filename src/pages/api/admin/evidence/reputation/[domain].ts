export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '../_guard'
import { D1ReputationBackend } from '@/lib/agent-evidence/storage/d1/reputation-store'

export const POST: APIRoute = async ({ request, cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env

  const flagError = ensureAgentEvidenceEnabled(e)
  if (flagError) return flagError

  const domain = params.domain
  if (!domain) return json({ error: 'Missing domain' }, 400)

  let body: { score?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const score = typeof body.score === 'number' ? body.score : undefined
  if (score === undefined || score < 0 || score > 1) {
    return json({ error: 'score must be a number between 0 and 1' }, 400)
  }

  const backend = new D1ReputationBackend(e.DB)

  // Override the score directly — upsert with scoreDelta centered on 0.5 baseline.
  // The SQL formula: INSERT sets score = MAX(0, MIN(1, 0.5 + scoreDelta));
  // ON CONFLICT: score = MAX(0, MIN(1, score + excluded.score - 0.5))
  // To override to an exact value, pass scoreDelta = score - 0.5 on INSERT.
  // On conflict, the update adds (excluded.score - 0.5) to existing score, so we
  // first reset by passing a large negative to floor it, then a second upsert sets
  // the absolute value. Simpler: compute the delta needed from current value.
  const existing = await backend.get(domain)
  const currentScore = existing?.score ?? 0.5
  const scoreDelta = score - currentScore
  await backend.upsert(domain, {
    scoreDelta,
    signalKind: score >= 0.5 ? 'positive' : 'negative',
  })

  const updated = await backend.get(domain)
  return json({ domain, score: updated?.score ?? score, updated: true })
}
