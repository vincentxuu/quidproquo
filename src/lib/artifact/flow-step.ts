import type { ArtifactRegistry } from './registry'
import type { ArtifactVersioning } from './versioning'

export interface ArtifactStepResult {
  versionId: string | null
  kind: string
  status: 'draft' | 'skipped'
}

export async function runArtifactStep(
  opts: {
    flowId?: string
    kind: string
    logicalName?: string
    payload: unknown
    flowRunId?: string
    flowStepRunId?: string
  },
  deps: { registry: ArtifactRegistry; versioning: ArtifactVersioning },
  flags?: { agentArtifact?: { enabled?: boolean } },
): Promise<ArtifactStepResult> {
  if (!flags?.agentArtifact?.enabled) return { versionId: null, kind: opts.kind, status: 'skipped' }

  deps.registry.validatePayload(opts.kind, opts.payload)

  const result = await deps.versioning.createVersion({
    flowId: opts.flowId ?? 'default',
    kind: opts.kind,
    logicalName: opts.logicalName ?? opts.kind,
    flowRunId: opts.flowRunId,
    flowStepRunId: opts.flowStepRunId,
    payload: opts.payload,
  })

  return { versionId: result.versionId, kind: opts.kind, status: 'draft' }
}
