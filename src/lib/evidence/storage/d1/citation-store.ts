import type { CitationRecord, CitationStoreBackend } from '../types'

const nowMs = () => Date.now()

function rowToCitationRecord(row: Record<string, unknown>): CitationRecord {
  return {
    citationId: row.citation_id as number,
    claimId: row.claim_id as number,
    excerptId: row.excerpt_id as number,
    relation: row.relation as 'supports' | 'refutes' | 'context',
    provenanceChainJson: row.provenance_chain_json as string,
    createdAt: row.created_at as number,
  }
}

export class D1CitationStoreBackend implements CitationStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(input: Parameters<CitationStoreBackend['insert']>[0]): Promise<number> {
    const now = nowMs()
    const result = await this.db
      .prepare(
        `INSERT INTO evidence_citations (claim_id, excerpt_id, relation, provenance_chain_json, created_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(
        input.claimId,
        input.excerptId,
        input.relation,
        input.provenanceChainJson,
        now,
      )
      .run()
    return Number(result.meta.last_row_id)
  }

  async listForClaim(claimId: number): Promise<CitationRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM evidence_citations WHERE claim_id = ? ORDER BY created_at ASC')
      .bind(claimId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToCitationRecord)
  }
}
