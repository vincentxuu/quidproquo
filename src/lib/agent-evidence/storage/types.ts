export interface SourceRecord {
  sourceId: number
  url: string
  contentHash: string
  bodyText: string | null
  bodyRef: string | null
  freshnessScore: number
  retrievedAt: number
  providerCallId: string | null
  flowRunId: string | null
  agentRunId: string | null
  status: 'active' | 'archived'
  createdAt: number
}

export interface ExcerptRecord {
  excerptId: number
  sourceId: number
  offset: number
  length: number
  text: string
  surroundingContext: string | null
  createdAt: number
}

export interface ClaimRecord {
  claimId: number
  claimText: string
  claimHash: string
  agentId: string | null
  confidence: number
  flowRunId: string | null
  flowStepRunId: string | null
  agentRunId: string | null
  createdAt: number
}

export interface CitationRecord {
  citationId: number
  claimId: number
  excerptId: number
  relation: 'supports' | 'refutes' | 'context'
  provenanceChainJson: string
  createdAt: number
}

export interface ConflictRecord {
  conflictId: number
  claimAId: number
  claimBId: number
  confidenceDelta: number
  detectedBy: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  approvalId: string | null
  resolvedBy: string | null
  createdAt: number
  updatedAt: number
}

export interface VerificationRecord {
  verificationId: number
  flowRunId: string
  policyJson: string
  passed: boolean
  checksJson: string
  gapsJson: string
  performedAt: number
  createdAt: number
}

export interface FtsSearchResult {
  claimId: number
  claimText: string
  score: number
}

export interface SourceStoreBackend {
  insert(input: {
    url: string
    contentHash: string
    bodyText?: string | null
    freshnessScore?: number
    providerCallId?: string | null
    flowRunId?: string | null
    agentRunId?: string | null
  }): Promise<number>
  getById(sourceId: number): Promise<SourceRecord | null>
  getByUrlAndHash(url: string, hash: string): Promise<SourceRecord | null>
  listForFlowRun(flowRunId: string): Promise<SourceRecord[]>
  updateBodyRef(sourceId: number, bodyRef: string): Promise<void>
}

export interface ExcerptStoreBackend {
  insert(input: {
    sourceId: number
    offset: number
    length: number
    text: string
    surroundingContext?: string | null
  }): Promise<number>
  listForSource(sourceId: number): Promise<ExcerptRecord[]>
}

export interface ClaimStoreBackend {
  insert(input: {
    claimText: string
    claimHash: string
    agentId?: string | null
    confidence?: number
    flowRunId?: string | null
    flowStepRunId?: string | null
    agentRunId?: string | null
  }): Promise<number>
  getById(claimId: number): Promise<ClaimRecord | null>
  listForFlowRun(flowRunId: string): Promise<ClaimRecord[]>
}

export interface CitationStoreBackend {
  insert(input: {
    claimId: number
    excerptId: number
    relation: 'supports' | 'refutes' | 'context'
    provenanceChainJson: string
  }): Promise<number>
  listForClaim(claimId: number): Promise<CitationRecord[]>
}

export interface ConflictStoreBackend {
  insert(input: {
    claimAId: number
    claimBId: number
    confidenceDelta?: number
    detectedBy: string
    status?: 'pending' | 'approved' | 'rejected' | 'expired'
  }): Promise<number>
  listByStatus(status: 'pending' | 'approved' | 'rejected' | 'expired', opts?: { limit?: number; cursor?: string }): Promise<{ conflicts: ConflictRecord[]; cursor: string | null }>
  getByApprovalId(approvalId: string): Promise<ConflictRecord | null>
  updateStatus(conflictId: number, status: 'pending' | 'approved' | 'rejected' | 'expired', resolvedBy?: string): Promise<void>
  updateApprovalId(conflictId: number, approvalId: string): Promise<void>
}

export interface VerificationStoreBackend {
  insert(input: {
    flowRunId: string
    policyJson: string
    passed: boolean
    checksJson: string
    gapsJson: string
    performedAt: number
  }): Promise<number>
  getByFlowRun(flowRunId: string): Promise<VerificationRecord[]>
}

export interface ClaimFtsBackend {
  search(query: string, flowRunId: string, limit?: number): Promise<FtsSearchResult[]>
}

export const EVIDENCE_BLOB_SIZE_THRESHOLD = 256 * 1024 // 256KB

export interface EvidenceBlobBackend {
  put(flowRunId: string, sourceId: number, body: string): Promise<string>
  get(key: string): Promise<string | null>
}

export interface ReputationRecord {
  domain: string
  score: number
  positiveSignals: number
  negativeSignals: number
  lastUpdated: number
}

export interface ReputationBackend {
  get(domain: string): Promise<ReputationRecord | null>
  upsert(domain: string, delta: { scoreDelta: number; signalKind: 'positive' | 'negative' }): Promise<void>
  listTop(n: number): Promise<ReputationRecord[]>
}

export interface EvidenceBackends {
  sources: SourceStoreBackend
  excerpts: ExcerptStoreBackend
  claims: ClaimStoreBackend
  citations: CitationStoreBackend
  conflicts: ConflictStoreBackend
  verifications: VerificationStoreBackend
  claimFts: ClaimFtsBackend
  blob?: EvidenceBlobBackend
  r2Blobs?: EvidenceBlobBackend
  reputation?: ReputationBackend
}
