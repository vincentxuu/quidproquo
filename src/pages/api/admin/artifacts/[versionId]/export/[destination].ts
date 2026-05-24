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
import { auditLog, PermissionDenied, requirePermission } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'

interface ExportBody {
  options?: Record<string, unknown>
}

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

/**
 * POST /api/admin/artifacts/:versionId/export/:destination — dispatch an export via the exporter
 * registry. No kernel is wired into the admin route, so `requiresApproval` exporters throw
 * `ArtifactExporterDenied` (approval needs a kernel) — surfaced as 501. Live export awaits the
 * kernel seam.
 */
export const POST: APIRoute = async ({ cookies, params, request, locals }) => {
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
  const flags = readFlags(e)
  const backends = createBackends(e)
  const artifact = createArtifact(e, backends)
  const waitUntil = getWaitUntil(locals)
  const actor = 'admin'

  try {
    await requirePermission({ db: e.DB, email: actor, kind: 'artifact', id: versionId, action: 'export', flags })
    const version = await backends.versions.getById(versionId)
    if (!version) return notFound('version not found')
    // kernel is intentionally undefined here — no kernel is wired into admin routes. Exporters that
    // require approval (or a filesystem) throw ArtifactExporterDenied, surfaced as 501 below.
    const outcome = await artifact.exporters.export({ versionId, destination, options })
    auditLog({
      db: e.DB,
      email: actor,
      action: 'artifact.export',
      kind: 'artifact',
      id: versionId,
      payload: {
        artifactId: version.definitionId,
        flowRunId: version.flowRunId,
        versionNumber: version.versionNumber,
        destination,
        exportId: outcome.exportId,
        status: outcome.status,
        externalRef: outcome.externalRef,
      },
      waitUntil,
    }).catch(() => {})
    return json({ exportId: outcome.exportId, status: outcome.status, externalRef: outcome.externalRef })
  } catch (error) {
    if (error instanceof PermissionDenied) return json({ ok: false, error: 'permission_denied', message: error.message }, 403)
    if (error instanceof ArtifactExporterNotFound) return notFound('exporter not found')
    if (error instanceof ArtifactVersionNotFound) return notFound('version not found')
    if (error instanceof ArtifactValidationError) return badRequest(error.message)
    if (error instanceof ArtifactExporterDenied) {
      auditLog({
        db: e.DB,
        email: actor,
        action: 'artifact.export.denied',
        kind: 'artifact',
        id: versionId,
        payload: { destination, error: 'export_requires_kernel' },
        waitUntil,
      }).catch(() => {})
      return json({ ok: false, error: 'export_requires_kernel' }, 501)
    }
    throw error
  }
}
