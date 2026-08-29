export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createSessionManager } from '@/lib/agent/session-manager'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  if (!session.repo || !session.git_ref) {
    return json({ ok: true, available: false, reason: 'no repo or git ref attached' })
  }

  // Phase 5: walk GitHub compare API (compare/{base}...{head})
  // For now return a placeholder
  return json({
    ok: true,
    available: false,
    reason: 'diff via GitHub compare will be available in Phase 5 (Cloudflare Sandbox)',
    repo: session.repo,
    git_ref: session.git_ref,
  })
}
