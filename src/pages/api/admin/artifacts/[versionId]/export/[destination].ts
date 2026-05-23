export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { json, badRequest, notFound } from '@/lib/api/response'
import { requireAdmin } from '@/lib/auth/admin'
import type { Env } from '@/lib/config/env'
import { createArtifact } from '@/lib/agent-artifact'
import { createBackends } from '@/lib/agent-artifact/storage'
import {
  ArtifactExporterDenied,
  ArtifactExporterNotFound,
  ArtifactValidationError,
  ArtifactVersionNotFound,
} from '@/lib/agent-artifact/errors'
import { ensureAgentArtifactEnabled } from '../../_guard'

interface ExportBody {
  options?: Record<string, unknown>
}

/**
 * POST /api/admin/artifacts/:versionId/export/:destination — dispatch an export via the exporter
 * registry. No kernel is wired into the admin route, so `requiresApproval` exporters throw
 * `ArtifactExporterDenied` (approval needs a kernel) — surfaced as 501. Live export awaits the
 * kernel seam.
 */
export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentArtifactEnabled()
  if (disabled) return disabled

  const versionId = params.versionId
  const destination = params.destination
  if (!versionId) return badRequest('versionId is required')
  if (!destination) return badRequest('destination is required')

  const body = (await request.json().catch(() => ({}))) as ExportBody
  const options = body.options ?? {}

  const e = env as unknown as Env
  const backends = createBackends(e)
  const artifact = createArtifact(e, backends)

  try {
    // kernel is intentionally undefined here — no kernel is wired into admin routes. Exporters that
    // require approval (or a filesystem) throw ArtifactExporterDenied, surfaced as 501 below.
    const outcome = await artifact.exporters.export({ versionId, destination, options })
    return json({ exportId: outcome.exportId, status: outcome.status, externalRef: outcome.externalRef })
  } catch (error) {
    if (error instanceof ArtifactExporterNotFound) return notFound('exporter not found')
    if (error instanceof ArtifactVersionNotFound) return notFound('version not found')
    if (error instanceof ArtifactValidationError) return badRequest(error.message)
    if (error instanceof ArtifactExporterDenied) {
      return json({ ok: false, error: 'export_requires_kernel' }, 501)
    }
    throw error
  }
}
