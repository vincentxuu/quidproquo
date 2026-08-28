import { ArtifactRegenerationFailed, ArtifactVersionNotFound } from './errors'
import { patchSections } from './regeneration/patch'
import type { ArtifactRegistry } from './registry'
import type { ArtifactSectionRecord, DefinitionStoreBackend, SectionStoreBackend, VersionStoreBackend } from './storage/types'
import type { ArtifactVersioning } from './versioning'

export interface RegenerateFromStepOpts {
  versionId: string
  stepRunId: string
  options?: Record<string, unknown>
  reRunStep(stepRunId: string, options?: Record<string, unknown>): Promise<{ output: unknown }>
}

export interface RegenerateResult {
  newVersionId: string | null
  patchedSections: string[]
}

export class ArtifactRegeneration {
  constructor(
    private readonly deps: {
      versioning: ArtifactVersioning
      definitions: DefinitionStoreBackend
      versions: VersionStoreBackend
      sections: SectionStoreBackend
      registry: ArtifactRegistry
    },
  ) {}

  async regenerateFromStep(opts: RegenerateFromStepOpts): Promise<RegenerateResult> {
    const version = await this.deps.versions.getById(opts.versionId)
    if (!version) throw new ArtifactVersionNotFound(opts.versionId)

    const def = await this.deps.definitions.getById(version.definitionId)
    if (!def) throw new ArtifactVersionNotFound(version.definitionId)

    const kindDef = this.deps.registry.getKind(def.kind)

    // Binary kinds cannot be regenerated section-by-section
    if (kindDef.binary) {
      throw new ArtifactRegenerationFailed(`binary_kind_not_supported: ${def.kind}`)
    }

    // Load original sections
    const originalSections = await this.deps.sections.listForVersion(opts.versionId)
    const originalStepRunIds = originalSections.map((s) => s.flowStepRunId)

    // Re-run the step
    let reRunResult: { output: unknown }
    try {
      reRunResult = await opts.reRunStep(opts.stepRunId, opts.options)
    } catch (err) {
      throw new ArtifactRegenerationFailed(err instanceof Error ? err.message : String(err))
    }

    // Extract sections from the new output
    const newExtracted = kindDef.sectionExtractor ? kindDef.sectionExtractor(reRunResult.output) : []

    // Patch original sections: replace those from targetStepRunId with the regenerated ones
    const originalExtracted = originalSections.map((s) => ({
      sectionKey: s.sectionKey,
      bodyText: s.bodyText,
      heading: s.heading ?? undefined,
      claimIds: s.claimIdsJson ? (JSON.parse(s.claimIdsJson) as number[]) : undefined,
    }))

    const patched = patchSections(originalExtracted, newExtracted, opts.stepRunId, originalStepRunIds)

    // Determine which section IDs were patched (those from the target step)
    const patchedSectionIds = originalSections
      .filter((s) => s.flowStepRunId === opts.stepRunId)
      .map((s) => s.sectionId)

    // Rebuild payload from patched sections for markdown_report
    let newPayload: unknown = reRunResult.output
    if (kindDef.kind === 'markdown_report') {
      const origPayload = JSON.parse(version.payloadJson) as Record<string, unknown>
      newPayload = {
        ...origPayload,
        sections: patched.map((s) => ({
          heading: s.heading ?? s.sectionKey,
          body_markdown: s.bodyText,
          claim_ids: s.claimIds,
        })),
      }
    } else if (kindDef.kind === 'evidence_bundle') {
      const origPayload = JSON.parse(version.payloadJson) as Record<string, unknown>
      newPayload = {
        ...origPayload,
        claims: patched.map((s) => ({
          claim_id: s.claimIds?.[0] ?? 0,
          claim_text: s.bodyText,
        })),
      }
    }

    // Create new version chained to original
    const result = await this.deps.versioning.createVersion({
      flowId: def.flowId,
      kind: def.kind,
      logicalName: def.logicalName,
      flowRunId: version.flowRunId ?? undefined,
      flowStepRunId: opts.stepRunId,
      payload: newPayload,
      parentVersionId: opts.versionId,
    })

    // Persist the patched sections with their correct step run IDs
    const now = Date.now()
    const newSectionRecords: ArtifactSectionRecord[] = patched.map((s, i) => {
      const origIdx = originalSections.findIndex((os) => os.sectionKey === s.sectionKey && os.bodyText === s.bodyText)
      const origSection = origIdx >= 0 ? originalSections[origIdx] : null
      const isPatched = patchedSectionIds.length > 0 && origSection === null
      return {
        sectionId: crypto.randomUUID(),
        versionId: result.versionId,
        artifactId: def.definitionId,
        orgId: 'default',
        sectionKey: s.sectionKey,
        ordinal: i,
        heading: s.heading ?? null,
        bodyText: s.bodyText,
        bodyJson: null,
        claimIdsJson: s.claimIds ? JSON.stringify(s.claimIds) : null,
        sourceIdsJson: null,
        flowStepRunId: isPatched ? opts.stepRunId : (origSection?.flowStepRunId ?? opts.stepRunId),
        approvalStatus: 'draft',
        resolvedBy: null,
        resolvedAt: null,
        createdAt: now,
      }
    })

    // Replace sections written by createVersion with correctly attributed ones
    // (createVersion stamps all sections with the same flowStepRunId)
    // We do a batch overwrite since insertBatch uses INSERT OR REPLACE
    if (newSectionRecords.length > 0) {
      // Delete the auto-created sections and rewrite with correct step attribution
      const autoSections = await this.deps.sections.listForVersion(result.versionId)
      const rewritten = newSectionRecords.map((rec, i) => ({
        ...rec,
        sectionId: autoSections[i]?.sectionId ?? rec.sectionId,
      }))
      await this.deps.sections.insertBatch(rewritten)
    }

    return {
      newVersionId: result.versionId,
      patchedSections: patchedSectionIds,
    }
  }
}
