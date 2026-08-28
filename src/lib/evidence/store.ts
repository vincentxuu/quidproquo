import { EvidenceClaimUnknown } from './errors'
import type {
  CitationRecord,
  ClaimRecord,
  ConflictRecord,
  EvidenceBackends,
  ExcerptRecord,
  SourceRecord,
  VerificationRecord,
} from './storage/types'

export interface ProvenanceChain {
  claim: ClaimRecord
  citations: Array<{
    excerpt: ExcerptRecord
    source: SourceRecord
    provenance: Record<string, unknown>
  }>
}

export class EvidenceStore {
  constructor(private readonly backends: EvidenceBackends) {}

  async storeSource(input: Parameters<EvidenceBackends['sources']['insert']>[0]): Promise<number> {
    return this.backends.sources.insert(input)
  }

  async storeExcerpt(
    input: Parameters<EvidenceBackends['excerpts']['insert']>[0],
  ): Promise<number> {
    return this.backends.excerpts.insert(input)
  }

  async storeClaim(input: Parameters<EvidenceBackends['claims']['insert']>[0]): Promise<number> {
    return this.backends.claims.insert(input)
  }

  async storeCitation(
    input: Parameters<EvidenceBackends['citations']['insert']>[0],
  ): Promise<number> {
    return this.backends.citations.insert(input)
  }

  async storeConflict(
    input: Parameters<EvidenceBackends['conflicts']['insert']>[0],
  ): Promise<number> {
    return this.backends.conflicts.insert(input)
  }

  async getProvenanceChain(claimId: number): Promise<ProvenanceChain> {
    const claim = await this.backends.claims.getById(claimId)
    if (!claim) throw new EvidenceClaimUnknown(claimId)

    const citationRecords = await this.backends.citations.listForClaim(claimId)

    const citations = await Promise.all(
      citationRecords.map(async (citation) => {
        const provenance = JSON.parse(citation.provenanceChainJson) as Record<string, unknown>
        const sourceId = provenance.source_id as number
        const excerptList = await this.backends.excerpts.listForSource(sourceId)
        const excerpt = excerptList.find((e) => e.excerptId === citation.excerptId) ?? null
        const source = await this.backends.sources.getById(sourceId)
        return {
          citation,
          excerpt: excerpt!,
          source: source!,
          provenance,
        }
      }),
    )

    return { claim, citations }
  }

  async getFlowRunBundle(flowRunId: string): Promise<{
    sources: SourceRecord[]
    excerpts: ExcerptRecord[]
    claims: ClaimRecord[]
    citations: CitationRecord[]
    conflicts: ConflictRecord[]
    verifications: VerificationRecord[]
  }> {
    const [sources, claims, verifications] = await Promise.all([
      this.backends.sources.listForFlowRun(flowRunId),
      this.backends.claims.listForFlowRun(flowRunId),
      this.backends.verifications.getByFlowRun(flowRunId),
    ])

    const excerpts = (
      await Promise.all(sources.map((s) => this.backends.excerpts.listForSource(s.sourceId)))
    ).flat()

    const citations = (
      await Promise.all(claims.map((c) => this.backends.citations.listForClaim(c.claimId)))
    ).flat()

    const { conflicts } = await this.backends.conflicts.listByStatus('pending', { limit: 1000 })
    const { conflicts: approvedConflicts } = await this.backends.conflicts.listByStatus(
      'approved',
      { limit: 1000 },
    )
    const { conflicts: rejectedConflicts } = await this.backends.conflicts.listByStatus(
      'rejected',
      { limit: 1000 },
    )
    const { conflicts: expiredConflicts } = await this.backends.conflicts.listByStatus('expired', {
      limit: 1000,
    })

    const claimIds = new Set(claims.map((c) => c.claimId))
    const allConflicts = [
      ...conflicts,
      ...approvedConflicts,
      ...rejectedConflicts,
      ...expiredConflicts,
    ].filter((cf) => claimIds.has(cf.claimAId) || claimIds.has(cf.claimBId))

    return { sources, excerpts, claims, citations, conflicts: allConflicts, verifications }
  }
}
