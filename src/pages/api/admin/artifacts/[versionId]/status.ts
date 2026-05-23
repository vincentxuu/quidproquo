export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { ensureAgentArtifactEnabled } from '../_guard'
import { createBackends } from '@/lib/agent-artifact/storage'

const VERSION_STATUSES = new Set(['draft', 'approved', 'rejected', 'published'])
const SECTION_STATUSES = new Set(['draft', 'approved', 'rejected'])

interface StatusBody {
  status?: string
  sectionId?: string
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentArtifactEnabled()
  if (disabled) return disabled

  const versionId = params.versionId
  if (!versionId) return badRequest('versionId is required')

  const body = (await request.json().catch(() => ({}))) as StatusBody
  const status = body.status?.trim()
  if (!status) return badRequest('status is required')

  const e = env as unknown as Env
  const backends = createBackends(e)
  const actor = 'admin'

  if (body.sectionId) {
    if (!SECTION_STATUSES.has(status)) return badRequest(`invalid section status: ${status}`)
    const section = await backends.sections.getById(body.sectionId)
    if (!section || section.versionId !== versionId) return notFound('section not found')
    await backends.sections.updateStatus(body.sectionId, status, {
      resolvedBy: actor,
      resolvedAt: Date.now(),
    })
    return json({ ok: true, scope: 'section', sectionId: body.sectionId, status })
  }

  if (!VERSION_STATUSES.has(status)) return badRequest(`invalid version status: ${status}`)
  const version = await backends.versions.getById(versionId)
  if (!version) return notFound('version not found')
  await backends.versions.updateStatus(versionId, status, actor)
  return json({ ok: true, scope: 'version', versionId, status })
}
