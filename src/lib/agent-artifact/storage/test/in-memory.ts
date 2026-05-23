import type {
  ArtifactBackends,
  ArtifactBlobBackend,
  ArtifactDefinitionRecord,
  ArtifactExportRecord,
  ArtifactSectionRecord,
  ArtifactVersionRecord,
  DefinitionStoreBackend,
  ExportStoreBackend,
  SectionStoreBackend,
  VersionStoreBackend,
} from '../types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class InMemoryDefinitionStoreBackend implements DefinitionStoreBackend {
  readonly store = new Map<string, ArtifactDefinitionRecord>()

  async upsert(opts: Parameters<DefinitionStoreBackend['upsert']>[0]): Promise<string> {
    const existing = this.store.get(opts.definitionId)
    if (existing) {
      const updated = { ...existing, updatedAt: Date.now() }
      this.store.set(opts.definitionId, updated)
      return opts.definitionId
    }
    const now = Date.now()
    const record: ArtifactDefinitionRecord = {
      definitionId: opts.definitionId,
      flowId: opts.flowId,
      kind: opts.kind,
      ownerScope: opts.ownerScope,
      label: opts.label,
      logicalName: opts.logicalName,
      inputsHash: opts.inputsHash ?? null,
      flowRunId: opts.flowRunId ?? null,
      createdAt: now,
      updatedAt: now,
    }
    this.store.set(opts.definitionId, record)
    return opts.definitionId
  }

  async getById(definitionId: string): Promise<ArtifactDefinitionRecord | null> {
    const r = this.store.get(definitionId)
    return r ? clone(r) : null
  }

  async getByFlowAndKind(flowId: string, kind: string, logicalName: string): Promise<ArtifactDefinitionRecord | null> {
    for (const r of this.store.values()) {
      if (r.flowId === flowId && r.kind === kind && r.logicalName === logicalName) return clone(r)
    }
    return null
  }

  async listByKind(kind: string): Promise<ArtifactDefinitionRecord[]> {
    return [...this.store.values()].filter((r) => r.kind === kind).map(clone)
  }

  async listForFlowRun(flowRunId: string): Promise<ArtifactDefinitionRecord[]> {
    return [...this.store.values()].filter((r) => r.flowRunId === flowRunId).map(clone)
  }
}

export class InMemoryVersionStoreBackend implements VersionStoreBackend {
  readonly store = new Map<string, ArtifactVersionRecord>()

  async insert(opts: Parameters<VersionStoreBackend['insert']>[0]): Promise<string> {
    const status = (opts.status as ArtifactVersionRecord['status']) ?? 'draft'
    const record: ArtifactVersionRecord = {
      versionId: opts.versionId,
      definitionId: opts.definitionId,
      versionNumber: opts.versionNumber,
      status,
      payloadJson: opts.payloadJson,
      bodyText: opts.bodyText ?? null,
      bodyRefJson: opts.bodyRefJson ?? null,
      parentVersionId: opts.parentVersionId ?? null,
      flowRunId: opts.flowRunId ?? null,
      flowStepRunId: opts.flowStepRunId ?? null,
      resolvedBy: null,
      createdAt: Date.now(),
      // Admin API compatibility aliases
      artifactId: opts.definitionId,
      approvalStatus: status,
    }
    this.store.set(opts.versionId, record)
    return opts.versionId
  }

  async getById(versionId: string): Promise<ArtifactVersionRecord | null> {
    const r = this.store.get(versionId)
    return r ? clone(r) : null
  }

  async getLatestForDefinition(definitionId: string): Promise<ArtifactVersionRecord | null> {
    const versions = [...this.store.values()]
      .filter((r) => r.definitionId === definitionId)
      .sort((a, b) => b.versionNumber - a.versionNumber)
    return versions[0] ? clone(versions[0]) : null
  }

  async listChain(definitionId: string): Promise<ArtifactVersionRecord[]> {
    return [...this.store.values()]
      .filter((r) => r.definitionId === definitionId)
      .sort((a, b) => a.versionNumber - b.versionNumber)
      .map(clone)
  }

  async getLatestForArtifact(artifactId: string): Promise<ArtifactVersionRecord | null> {
    return this.getLatestForDefinition(artifactId)
  }

  async listByFlowRun(flowRunId: string): Promise<ArtifactVersionRecord[]> {
    return [...this.store.values()]
      .filter((r) => r.flowRunId === flowRunId)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(clone)
  }

  async updateStatus(versionId: string, status: string, resolvedBy?: string): Promise<void> {
    const r = this.store.get(versionId)
    if (!r) return
    const newStatus = status as ArtifactVersionRecord['status']
    this.store.set(versionId, { ...r, status: newStatus, approvalStatus: newStatus, resolvedBy: resolvedBy ?? r.resolvedBy })
  }
}

export class InMemorySectionStoreBackend implements SectionStoreBackend {
  readonly store = new Map<string, ArtifactSectionRecord>()

  async insertBatch(sections: ArtifactSectionRecord[]): Promise<void> {
    for (const s of sections) {
      this.store.set(s.sectionId, clone(s))
    }
  }

  async listForVersion(versionId: string): Promise<ArtifactSectionRecord[]> {
    return [...this.store.values()]
      .filter((r) => r.versionId === versionId)
      .sort((a, b) => a.ordinal - b.ordinal)
      .map(clone)
  }

  async getById(sectionId: string): Promise<ArtifactSectionRecord | null> {
    const r = this.store.get(sectionId)
    return r ? clone(r) : null
  }

  async updateStatus(sectionId: string, status: string, opts?: { resolvedBy?: string; resolvedAt?: number }): Promise<void> {
    const r = this.store.get(sectionId)
    if (!r) return
    this.store.set(sectionId, {
      ...r,
      approvalStatus: status as ArtifactSectionRecord['approvalStatus'],
      resolvedBy: opts?.resolvedBy ?? r.resolvedBy,
      resolvedAt: opts?.resolvedAt ?? r.resolvedAt,
    })
  }
}

export class InMemoryExportStoreBackend implements ExportStoreBackend {
  readonly store = new Map<string, ArtifactExportRecord>()

  async insert(opts: Parameters<ExportStoreBackend['insert']>[0]): Promise<string> {
    const now = Date.now()
    const record: ArtifactExportRecord = {
      exportId: opts.exportId,
      versionId: opts.versionId,
      destination: opts.destination,
      status: 'pending',
      exportMetadataJson: opts.metadata ? JSON.stringify(opts.metadata) : null,
      exporterId: opts.destination,
      externalId: null,
      createdAt: now,
      updatedAt: now,
    }
    this.store.set(opts.exportId, record)
    return opts.exportId
  }

  async updateStatus(exportId: string, status: string, metadata?: unknown): Promise<void> {
    const r = this.store.get(exportId)
    if (!r) return
    this.store.set(exportId, {
      ...r,
      status: status as ArtifactExportRecord['status'],
      exportMetadataJson: metadata !== undefined ? JSON.stringify(metadata) : r.exportMetadataJson,
      updatedAt: Date.now(),
    })
  }

  async listForVersion(versionId: string): Promise<ArtifactExportRecord[]> {
    return [...this.store.values()].filter((r) => r.versionId === versionId).map(clone)
  }
}

export class InMemoryArtifactBlobBackend implements ArtifactBlobBackend {
  readonly blobs = new Map<string, string>()

  async put(key: string, body: string): Promise<void> {
    this.blobs.set(key, body)
  }

  async get(key: string): Promise<string | null> {
    return this.blobs.get(key) ?? null
  }
}

export function createInMemoryArtifactBackends(): ArtifactBackends {
  return {
    definitions: new InMemoryDefinitionStoreBackend(),
    versions: new InMemoryVersionStoreBackend(),
    sections: new InMemorySectionStoreBackend(),
    exports: new InMemoryExportStoreBackend(),
    blobs: new InMemoryArtifactBlobBackend(),
  }
}
