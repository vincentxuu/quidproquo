export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { json, badRequest } from '@/lib/api/response'
import { requireAdmin } from '@/lib/auth/admin'
import type { Env } from '@/lib/config/env'
import { createArtifact } from '@/lib/agent-artifact'
import { createBackends } from '@/lib/agent-artifact/storage'
import { ensureAgentArtifactEnabled } from '../_guard'

/**
 * GET /api/admin/artifacts/runs/:flowRunId — lists every artifact produced by a flow run, grouped
 * by artifact (definition), with each version's lineage + approval status and the exports recorded
 * against each version.
 */
export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentArtifactEnabled()
  if (disabled) return disabled

  const flowRunId = params.flowRunId
  if (!flowRunId) return badRequest('flowRunId is required')

  const e = env as unknown as Env
  const backends = createBackends(e)
  const artifact = createArtifact(e, backends)

  const versions = await artifact.storage.versions.listByFlowRun(flowRunId)

  // Group versions by artifactId; collect each version's exports.
  const byArtifact = new Map<
    string,
    {
      artifactId: string
      kind: string
      versions: { versionId: string; parentVersionId: string | null; approvalStatus: string; createdAt: number }[]
      exports: {
        exportId: string
        exporterId: string
        status: string
        externalId: string | null
        versionId: string
      }[]
    }
  >()

  for (const version of versions) {
    if (!byArtifact.has(version.artifactId)) {
      byArtifact.set(version.artifactId, {
        artifactId: version.artifactId,
        kind: version.kind ?? version.definitionId,
        versions: [],
        exports: [],
      })
    }
    const group = byArtifact.get(version.artifactId)!
    group.versions.push({
      versionId: version.versionId,
      parentVersionId: version.parentVersionId ?? null,
      approvalStatus: version.approvalStatus,
      createdAt: version.createdAt,
    })
    const exportRows = await artifact.storage.exports.listForVersion(version.versionId)
    for (const row of exportRows) {
      group.exports.push({
        exportId: row.exportId,
        exporterId: row.exporterId,
        status: row.status,
        externalId: row.externalId ?? null,
        versionId: row.versionId,
      })
    }
  }

  return json({ artifacts: [...byArtifact.values()] })
}
