export interface ArtifactDefinitionRecord {
  definitionId: string
  flowId: string
  kind: string
  ownerScope: string
  label: string
  logicalName: string
  inputsHash: string | null
  flowRunId: string | null
  createdAt: number
  updatedAt: number
}

export interface ArtifactSectionRecord {
  sectionId: string
  versionId: string
  artifactId: string
  orgId: string
  sectionKey: string
  ordinal: number
  heading: string | null
  bodyText: string
  bodyJson: string | null
  claimIdsJson: string | null
  sourceIdsJson: string | null
  flowStepRunId: string | null
  approvalStatus: 'draft' | 'approved' | 'rejected'
  resolvedBy: string | null
  resolvedAt: number | null
  createdAt: number
}

export interface ArtifactExportRecord {
  exportId: string
  versionId: string
  destination: string
  status: 'pending' | 'done' | 'failed'
  exportMetadataJson: string | null
  /** Alias for destination — kept for admin API compatibility. */
  exporterId: string
  /** External reference (e.g. Notion page URL, file path). */
  externalId: string | null
  createdAt: number
  updatedAt: number
}

// ---------- Backend interfaces ----------

export interface DefinitionStoreBackend {
  upsert(opts: {
    definitionId: string
    flowId: string
    kind: string
    ownerScope: string
    label: string
    logicalName: string
    inputsHash?: string | null
    flowRunId?: string | null
  }): Promise<string>
  getById(definitionId: string): Promise<ArtifactDefinitionRecord | null>
  getByFlowAndKind(flowId: string, kind: string, logicalName: string): Promise<ArtifactDefinitionRecord | null>
  listByKind(kind: string): Promise<ArtifactDefinitionRecord[]>
  listForFlowRun(flowRunId: string): Promise<ArtifactDefinitionRecord[]>
}

export interface ArtifactVersionRecord {
  versionId: string
  definitionId: string
  versionNumber: number
  status: 'draft' | 'approved' | 'rejected' | 'published'
  payloadJson: string
  bodyText: string | null
  bodyRefJson: string | null
  parentVersionId: string | null
  flowRunId: string | null
  flowStepRunId: string | null
  resolvedBy: string | null
  createdAt: number
  /** Alias for definitionId — kept for admin API compatibility. */
  artifactId: string
  /** Approval status alias — kept for admin API compatibility. */
  approvalStatus: string
  /** Kind resolved from the joined definition — set when queried via listByFlowRun. */
  kind?: string
}

export interface VersionStoreBackend {
  insert(opts: {
    versionId: string
    definitionId: string
    versionNumber: number
    payloadJson: string
    bodyText?: string | null
    bodyRefJson?: string | null
    parentVersionId?: string | null
    flowRunId?: string | null
    flowStepRunId?: string | null
    status?: string
  }): Promise<string>
  getById(versionId: string): Promise<ArtifactVersionRecord | null>
  getLatestForDefinition(definitionId: string): Promise<ArtifactVersionRecord | null>
  /** Get the latest version for a given artifact (definition) id. */
  getLatestForArtifact(artifactId: string): Promise<ArtifactVersionRecord | null>
  listChain(definitionId: string): Promise<ArtifactVersionRecord[]>
  /** List all versions for a flow run (joined with definition for kind). */
  listByFlowRun(flowRunId: string): Promise<ArtifactVersionRecord[]>
  updateStatus(versionId: string, status: string, resolvedBy?: string): Promise<void>
}

export interface SectionStoreBackend {
  insertBatch(sections: ArtifactSectionRecord[]): Promise<void>
  listForVersion(versionId: string): Promise<ArtifactSectionRecord[]>
  getById(sectionId: string): Promise<ArtifactSectionRecord | null>
  updateStatus(sectionId: string, status: string, opts?: { resolvedBy?: string; resolvedAt?: number }): Promise<void>
}

export interface ExportStoreBackend {
  insert(opts: {
    exportId: string
    versionId: string
    destination: string
    metadata?: unknown
  }): Promise<string>
  updateStatus(exportId: string, status: string, metadata?: unknown): Promise<void>
  listForVersion(versionId: string): Promise<ArtifactExportRecord[]>
}

export interface ArtifactBlobBackend {
  put(key: string, body: string): Promise<void>
  get(key: string): Promise<string | null>
}

export interface ArtifactBackends {
  definitions: DefinitionStoreBackend
  versions: VersionStoreBackend
  sections: SectionStoreBackend
  exports: ExportStoreBackend
  blobs: ArtifactBlobBackend
}
