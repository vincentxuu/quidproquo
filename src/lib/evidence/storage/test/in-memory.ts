import type {
  CitationRecord,
  CitationStoreBackend,
  ClaimFtsBackend,
  ClaimRecord,
  ClaimStoreBackend,
  ConflictRecord,
  ConflictStoreBackend,
  EvidenceBlobBackend,
  EvidenceBackends,
  ExcerptRecord,
  ExcerptStoreBackend,
  FtsSearchResult,
  ReputationBackend,
  ReputationRecord,
  SourceRecord,
  SourceStoreBackend,
  VerificationRecord,
  VerificationStoreBackend,
} from '../types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class InMemorySourceStoreBackend implements SourceStoreBackend {
  readonly sources = new Map<number, SourceRecord>()
  private nextId = 1

  async insert(input: Parameters<SourceStoreBackend['insert']>[0]): Promise<number> {
    const now = Date.now()
    const sourceId = this.nextId++
    const record: SourceRecord = {
      sourceId,
      url: input.url,
      contentHash: input.contentHash,
      bodyText: input.bodyText ?? null,
      bodyRef: null,
      freshnessScore: input.freshnessScore ?? 1.0,
      retrievedAt: now,
      providerCallId: input.providerCallId ?? null,
      flowRunId: input.flowRunId ?? null,
      agentRunId: input.agentRunId ?? null,
      status: 'active',
      createdAt: now,
    }
    this.sources.set(sourceId, clone(record))
    return sourceId
  }

  async getById(sourceId: number): Promise<SourceRecord | null> {
    const record = this.sources.get(sourceId)
    return record ? clone(record) : null
  }

  async getByUrlAndHash(url: string, hash: string): Promise<SourceRecord | null> {
    for (const record of this.sources.values()) {
      if (record.url === url && record.contentHash === hash) return clone(record)
    }
    return null
  }

  async listForFlowRun(flowRunId: string): Promise<SourceRecord[]> {
    return [...this.sources.values()].filter((r) => r.flowRunId === flowRunId).map(clone)
  }

  async updateBodyRef(sourceId: number, bodyRef: string): Promise<void> {
    const record = this.sources.get(sourceId)
    if (record) this.sources.set(sourceId, { ...record, bodyRef })
  }
}

export class InMemoryExcerptStoreBackend implements ExcerptStoreBackend {
  readonly excerpts = new Map<number, ExcerptRecord>()
  private nextId = 1

  async insert(input: Parameters<ExcerptStoreBackend['insert']>[0]): Promise<number> {
    const excerptId = this.nextId++
    const record: ExcerptRecord = {
      excerptId,
      sourceId: input.sourceId,
      offset: input.offset,
      length: input.length,
      text: input.text,
      surroundingContext: input.surroundingContext ?? null,
      createdAt: Date.now(),
    }
    this.excerpts.set(excerptId, clone(record))
    return excerptId
  }

  async listForSource(sourceId: number): Promise<ExcerptRecord[]> {
    return [...this.excerpts.values()].filter((r) => r.sourceId === sourceId).map(clone)
  }
}

export class InMemoryClaimStoreBackend implements ClaimStoreBackend {
  readonly claims = new Map<number, ClaimRecord>()
  private nextId = 1

  async insert(input: Parameters<ClaimStoreBackend['insert']>[0]): Promise<number> {
    const claimId = this.nextId++
    const record: ClaimRecord = {
      claimId,
      claimText: input.claimText,
      claimHash: input.claimHash,
      agentId: input.agentId ?? null,
      confidence: input.confidence ?? 1.0,
      flowRunId: input.flowRunId ?? null,
      flowStepRunId: input.flowStepRunId ?? null,
      agentRunId: input.agentRunId ?? null,
      createdAt: Date.now(),
    }
    this.claims.set(claimId, clone(record))
    return claimId
  }

  async getById(claimId: number): Promise<ClaimRecord | null> {
    const record = this.claims.get(claimId)
    return record ? clone(record) : null
  }

  async listForFlowRun(flowRunId: string): Promise<ClaimRecord[]> {
    return [...this.claims.values()].filter((r) => r.flowRunId === flowRunId).map(clone)
  }
}

export class InMemoryCitationStoreBackend implements CitationStoreBackend {
  readonly citations = new Map<number, CitationRecord>()
  private nextId = 1

  async insert(input: Parameters<CitationStoreBackend['insert']>[0]): Promise<number> {
    const citationId = this.nextId++
    const record: CitationRecord = {
      citationId,
      claimId: input.claimId,
      excerptId: input.excerptId,
      relation: input.relation,
      provenanceChainJson: input.provenanceChainJson,
      createdAt: Date.now(),
    }
    this.citations.set(citationId, clone(record))
    return citationId
  }

  async listForClaim(claimId: number): Promise<CitationRecord[]> {
    return [...this.citations.values()].filter((r) => r.claimId === claimId).map(clone)
  }
}

export class InMemoryConflictStoreBackend implements ConflictStoreBackend {
  readonly conflicts = new Map<number, ConflictRecord>()
  private nextId = 1

  async insert(input: Parameters<ConflictStoreBackend['insert']>[0]): Promise<number> {
    const conflictId = this.nextId++
    const now = Date.now()
    const record: ConflictRecord = {
      conflictId,
      claimAId: input.claimAId,
      claimBId: input.claimBId,
      confidenceDelta: input.confidenceDelta ?? 0,
      detectedBy: input.detectedBy,
      status: input.status ?? 'pending',
      approvalId: null,
      resolvedBy: null,
      createdAt: now,
      updatedAt: now,
    }
    this.conflicts.set(conflictId, clone(record))
    return conflictId
  }

  async listByStatus(
    status: 'pending' | 'approved' | 'rejected' | 'expired',
    opts: { limit?: number; cursor?: string } = {},
  ): Promise<{ conflicts: ConflictRecord[]; cursor: string | null }> {
    const limit = opts.limit ?? 50
    const all = [...this.conflicts.values()]
      .filter((r) => r.status === status)
      .filter((r) => !opts.cursor || r.createdAt < Number(opts.cursor))
      .sort((a, b) => b.createdAt - a.createdAt)
    const page = all.slice(0, limit)
    return {
      conflicts: page.map(clone),
      cursor: all.length > limit ? String(all[limit].createdAt) : null,
    }
  }

  async updateStatus(
    conflictId: number,
    status: 'pending' | 'approved' | 'rejected' | 'expired',
    resolvedBy?: string,
  ): Promise<void> {
    const record = this.conflicts.get(conflictId)
    if (record) {
      this.conflicts.set(conflictId, {
        ...record,
        status,
        resolvedBy: resolvedBy ?? record.resolvedBy,
        updatedAt: Date.now(),
      })
    }
  }

  async getByApprovalId(approvalId: string): Promise<ConflictRecord | null> {
    const found = [...this.conflicts.values()].find((r) => r.approvalId === approvalId)
    return found ? clone(found) : null
  }

  async updateApprovalId(conflictId: number, approvalId: string): Promise<void> {
    const record = this.conflicts.get(conflictId)
    if (record) this.conflicts.set(conflictId, { ...record, approvalId, updatedAt: Date.now() })
  }
}

export class InMemoryVerificationStoreBackend implements VerificationStoreBackend {
  readonly verifications = new Map<number, VerificationRecord>()
  private nextId = 1

  async insert(input: Parameters<VerificationStoreBackend['insert']>[0]): Promise<number> {
    const verificationId = this.nextId++
    const record: VerificationRecord = {
      verificationId,
      flowRunId: input.flowRunId,
      policyJson: input.policyJson,
      passed: input.passed,
      checksJson: input.checksJson,
      gapsJson: input.gapsJson,
      performedAt: input.performedAt,
      createdAt: Date.now(),
    }
    this.verifications.set(verificationId, clone(record))
    return verificationId
  }

  async getByFlowRun(flowRunId: string): Promise<VerificationRecord[]> {
    return [...this.verifications.values()].filter((r) => r.flowRunId === flowRunId).map(clone)
  }
}

export class InMemoryClaimFtsBackend implements ClaimFtsBackend {
  constructor(private readonly claims: InMemoryClaimStoreBackend) {}

  async search(query: string, flowRunId: string, limit = 20): Promise<FtsSearchResult[]> {
    const q = query.toLowerCase()
    return [...this.claims.claims.values()]
      .filter((r) => r.flowRunId === flowRunId && r.claimText.toLowerCase().includes(q))
      .slice(0, limit)
      .map((r) => ({ claimId: r.claimId, claimText: r.claimText, score: 1.0 }))
  }
}

export class InMemoryEvidenceBlobBackend implements EvidenceBlobBackend {
  readonly blobs = new Map<string, string>()

  async put(flowRunId: string, sourceId: number, body: string): Promise<string> {
    const key = `evidence/${flowRunId}/${sourceId}`
    this.blobs.set(key, body)
    return key
  }

  async get(key: string): Promise<string | null> {
    return this.blobs.get(key) ?? null
  }
}

export class InMemoryReputationBackend implements ReputationBackend {
  readonly records = new Map<string, ReputationRecord>()

  async get(domain: string): Promise<ReputationRecord | null> {
    const record = this.records.get(domain)
    return record ? clone(record) : null
  }

  async upsert(domain: string, delta: { scoreDelta: number; signalKind: 'positive' | 'negative' }): Promise<void> {
    const existing = this.records.get(domain)
    const current = existing ?? {
      domain,
      score: 0.5,
      positiveSignals: 0,
      negativeSignals: 0,
      lastUpdated: Date.now(),
    }
    const newScore = Math.min(1, Math.max(0, current.score + delta.scoreDelta))
    this.records.set(domain, {
      domain,
      score: newScore,
      positiveSignals: current.positiveSignals + (delta.signalKind === 'positive' ? 1 : 0),
      negativeSignals: current.negativeSignals + (delta.signalKind === 'negative' ? 1 : 0),
      lastUpdated: Date.now(),
    })
  }

  async listTop(n: number): Promise<ReputationRecord[]> {
    return [...this.records.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, n)
      .map(clone)
  }
}

export function createInMemoryEvidenceBackends(): EvidenceBackends & { blob: InMemoryEvidenceBlobBackend } {
  const claims = new InMemoryClaimStoreBackend()
  return {
    sources: new InMemorySourceStoreBackend(),
    excerpts: new InMemoryExcerptStoreBackend(),
    claims,
    citations: new InMemoryCitationStoreBackend(),
    conflicts: new InMemoryConflictStoreBackend(),
    verifications: new InMemoryVerificationStoreBackend(),
    claimFts: new InMemoryClaimFtsBackend(claims),
    blob: new InMemoryEvidenceBlobBackend(),
  }
}
