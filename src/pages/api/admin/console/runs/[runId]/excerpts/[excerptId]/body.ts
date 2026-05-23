export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { ensureAgentEvidenceEnabled } from '@/pages/api/admin/evidence/_guard'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const disabled = ensureAgentEvidenceEnabled(e)
  if (disabled) return disabled

  const runId = params.runId
  const excerptId = Number(params.excerptId)
  if (!runId) return badRequest('runId is required')
  if (!Number.isFinite(excerptId)) return badRequest('excerptId is required')

  const row = await e.DB.prepare(
    `SELECT ex.excerpt_id, ex.offset, ex.length, ex.text, ex.surrounding_context,
            src.source_id, src.url, src.body_text, src.body_ref, src.retrieved_at
       FROM evidence_excerpts ex
       JOIN evidence_sources src ON src.source_id = ex.source_id
      WHERE ex.excerpt_id = ? AND src.flow_run_id = ?
      LIMIT 1`,
  )
    .bind(excerptId, runId)
    .first<{
      excerpt_id: number
      offset: number
      length: number
      text: string
      surrounding_context: string | null
      source_id: number
      url: string
      body_text: string | null
      body_ref: string | null
      retrieved_at: number
    }>()

  if (!row) return notFound('excerpt not found')

  // R2-backed evidence bodies are optional in this deployment. Until the evidence blob
  // bucket is wired into Env, fall back to inline source body or excerpt context.
  return json({
    excerptId: row.excerpt_id,
    sourceId: row.source_id,
    url: row.url,
    retrievedAt: row.retrieved_at,
    offset: row.offset,
    length: row.length,
    text: row.text,
    body: row.body_text ?? row.surrounding_context ?? row.text,
    bodyRef: row.body_ref,
  })
}
