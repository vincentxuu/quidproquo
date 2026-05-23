export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '../_guard'
import { EvidenceStore } from '@/lib/agent-evidence/store'
import { D1SourceStoreBackend } from '@/lib/agent-evidence/storage/d1/source-store'
import { D1ExcerptStoreBackend } from '@/lib/agent-evidence/storage/d1/excerpt-store'
import { D1ClaimStoreBackend } from '@/lib/agent-evidence/storage/d1/claim-store'
import { D1CitationStoreBackend } from '@/lib/agent-evidence/storage/d1/citation-store'
import { D1ConflictStoreBackend } from '@/lib/agent-evidence/storage/d1/conflict-store'
import { D1VerificationStoreBackend } from '@/lib/agent-evidence/storage/d1/verification-store'
import { D1ClaimFtsBackend } from '@/lib/agent-evidence/storage/d1/claim-fts'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env

  const flagError = ensureAgentEvidenceEnabled(e)
  if (flagError) return flagError

  const flowRunId = params.flowRunId as string

  const db = e.DB
  const store = new EvidenceStore({
    sources: new D1SourceStoreBackend(db),
    excerpts: new D1ExcerptStoreBackend(db),
    claims: new D1ClaimStoreBackend(db),
    citations: new D1CitationStoreBackend(db),
    conflicts: new D1ConflictStoreBackend(db),
    verifications: new D1VerificationStoreBackend(db),
    claimFts: new D1ClaimFtsBackend(db),
  })

  const bundle = await store.getFlowRunBundle(flowRunId)

  return json(bundle)
}
