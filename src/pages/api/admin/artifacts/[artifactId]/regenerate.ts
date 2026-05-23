export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { json, badRequest, notFound } from '@/lib/api/response'
import { requireAdmin } from '@/lib/auth/admin'
import type { Env } from '@/lib/config/env'
import { createArtifact } from '@/lib/agent-artifact'
import { createBackends } from '@/lib/agent-artifact/storage'
import { ArtifactRegenerationFailed, ArtifactVersionNotFound } from '@/lib/agent-artifact/errors'
import { ensureAgentArtifactEnabled } from '../_guard'

interface RegenerateBody {
  stepRunId?: unknown
  options?: Record<string, unknown>
}

/**
 * POST /api/admin/artifacts/:artifactId/regenerate — re-run one flow step and produce a patched new
 * version. The flow-runtime re-execution seam (`reRunStep`) is NOT wired in the admin route yet, so
 * this endpoint surfaces the API and returns 501 until that seam lands; live regeneration arrives
 * with the agent-flow runtime integration.
 */
export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentArtifactEnabled()
  if (disabled) return disabled

  const artifactId = params.artifactId
  if (!artifactId) return badRequest('artifactId is required')

  const body = (await request.json().catch(() => ({}))) as RegenerateBody
  const stepRunId = typeof body.stepRunId === 'string' ? body.stepRunId : ''
  if (!stepRunId) return badRequest('stepRunId is required')

  const e = env as unknown as Env
  const backends = createBackends(e)
  const artifact = createArtifact(e, backends)

  const latest = await artifact.storage.versions.getLatestForArtifact(artifactId)
  if (!latest) return notFound('artifact not found')

  try {
    const result = await artifact.regeneration.regenerateFromStep({
      versionId: latest.versionId,
      stepRunId,
      options: body.options,
      // The flow-runtime re-execution seam is not wired into the admin route yet — surface the API
      // but defer live regeneration to the agent-flow runtime integration.
      reRunStep: async () => {
        throw new ArtifactRegenerationFailed('reRunStep not configured')
      },
    })
    return json({ newVersionId: result.newVersionId, patchedSections: result.patchedSections })
  } catch (error) {
    if (error instanceof ArtifactVersionNotFound) return notFound('version not found')
    if (error instanceof ArtifactRegenerationFailed) {
      return json({ ok: false, error: 'regeneration_requires_flow_runtime' }, 501)
    }
    throw error
  }
}
