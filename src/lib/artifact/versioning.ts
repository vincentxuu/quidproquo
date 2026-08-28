import type { ArtifactRegistry } from './registry'
import type { ArtifactBlobBackend, ArtifactSectionRecord, ArtifactVersionRecord, DefinitionStoreBackend, SectionStoreBackend, VersionStoreBackend } from './storage/types'
import type { ExtractedSection } from './registry/types'
import { ArtifactVersionNotFound } from './errors'

export interface CreateVersionOpts {
  flowId: string
  kind: string
  logicalName: string
  inputsHash?: string
  flowRunId?: string
  flowStepRunId?: string
  payload: unknown
  parentVersionId?: string | null
}

export interface CreateVersionResult {
  versionId: string
  definitionId: string
  versionNumber: number
}

export class ArtifactVersioning {
  constructor(
    private readonly backends: {
      definitions: DefinitionStoreBackend
      versions: VersionStoreBackend
      sections: SectionStoreBackend
      blobs: ArtifactBlobBackend
    },
    private readonly registry: ArtifactRegistry,
  ) {}

  async createVersion(opts: CreateVersionOpts): Promise<CreateVersionResult> {
    const kindDef = this.registry.getKind(opts.kind)

    // Resolve or create definition
    let def = await this.backends.definitions.getByFlowAndKind(opts.flowId, opts.kind, opts.logicalName)
    if (!def) {
      const definitionId = crypto.randomUUID()
      await this.backends.definitions.upsert({
        definitionId,
        flowId: opts.flowId,
        kind: opts.kind,
        ownerScope: opts.flowRunId ? 'flow_run' : 'manual',
        label: opts.logicalName,
        logicalName: opts.logicalName,
        inputsHash: opts.inputsHash ?? null,
        flowRunId: opts.flowRunId ?? null,
      })
      def = await this.backends.definitions.getById(definitionId)
    }

    const definitionId = def!.definitionId

    // Determine version number
    const latest = await this.backends.versions.getLatestForDefinition(definitionId)
    const versionNumber = latest ? latest.versionNumber + 1 : 1
    const versionId = crypto.randomUUID()
    const bodyText = kindDef.serializer(opts.payload)
    const payloadJson = JSON.stringify(opts.payload)

    await this.backends.versions.insert({
      versionId,
      definitionId,
      versionNumber,
      payloadJson,
      bodyText,
      parentVersionId: opts.parentVersionId ?? null,
      flowRunId: opts.flowRunId ?? null,
      flowStepRunId: opts.flowStepRunId ?? null,
      status: 'draft',
    })

    // Persist sections if the kind has a section extractor
    if (kindDef.sectionExtractor) {
      const extracted: ExtractedSection[] = kindDef.sectionExtractor(opts.payload)
      if (extracted.length > 0) {
        const now = Date.now()
        const sectionRecords: ArtifactSectionRecord[] = extracted.map((s, i) => ({
          sectionId: crypto.randomUUID(),
          versionId,
          artifactId: definitionId,
          orgId: 'default',
          sectionKey: s.sectionKey,
          ordinal: i,
          heading: s.heading ?? null,
          bodyText: s.bodyText,
          bodyJson: null,
          claimIdsJson: s.claimIds ? JSON.stringify(s.claimIds) : null,
          sourceIdsJson: s.sourceIds ? JSON.stringify(s.sourceIds) : null,
          flowStepRunId: opts.flowStepRunId ?? null,
          approvalStatus: 'draft',
          resolvedBy: null,
          resolvedAt: null,
          createdAt: now,
        }))
        await this.backends.sections.insertBatch(sectionRecords)
      }
    }

    return { versionId, definitionId, versionNumber }
  }

  async getVersion(versionId: string): Promise<ArtifactVersionRecord | null> {
    return this.backends.versions.getById(versionId)
  }

  async listChain(definitionId: string): Promise<ArtifactVersionRecord[]> {
    return this.backends.versions.listChain(definitionId)
  }

  async updateStatus(versionId: string, newStatus: string, resolvedBy?: string): Promise<void> {
    const version = await this.backends.versions.getById(versionId)
    if (!version) throw new ArtifactVersionNotFound(versionId)
    return this.backends.versions.updateStatus(versionId, newStatus, resolvedBy)
  }
}
