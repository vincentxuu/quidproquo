import type { SourceRecord, SourceStoreBackend } from '../types'

const nowMs = () => Date.now()

function rowToSourceRecord(row: Record<string, unknown>): SourceRecord {
  return {
    sourceId: row.source_id as number,
    url: row.url as string,
    contentHash: row.content_hash as string,
    bodyText: (row.body_text as string | null) ?? null,
    bodyRef: (row.body_ref as string | null) ?? null,
    freshnessScore: row.freshness_score as number,
    retrievedAt: row.retrieved_at as number,
    providerCallId: (row.provider_call_id as string | null) ?? null,
    flowRunId: (row.flow_run_id as string | null) ?? null,
    agentRunId: (row.agent_run_id as string | null) ?? null,
    status: (row.status as 'active' | 'archived') ?? 'active',
    createdAt: row.created_at as number,
  }
}

export class D1SourceStoreBackend implements SourceStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(input: Parameters<SourceStoreBackend['insert']>[0]): Promise<number> {
    const now = nowMs()
    await this.db
      .prepare(
        `INSERT OR IGNORE INTO evidence_sources
          (url, content_hash, body_text, body_ref, freshness_score, retrieved_at, provider_call_id, flow_run_id, agent_run_id, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      )
      .bind(
        input.url,
        input.contentHash,
        input.bodyText ?? null,
        null,
        input.freshnessScore ?? 0.5,
        now,
        input.providerCallId ?? null,
        input.flowRunId ?? null,
        input.agentRunId ?? null,
        now,
      )
      .run()

    const row = await this.db
      .prepare('SELECT source_id FROM evidence_sources WHERE url = ? AND content_hash = ?')
      .bind(input.url, input.contentHash)
      .first<{ source_id: number }>()

    return row!.source_id
  }

  async getById(sourceId: number): Promise<SourceRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM evidence_sources WHERE source_id = ?')
      .bind(sourceId)
      .first<Record<string, unknown>>()
    return row ? rowToSourceRecord(row) : null
  }

  async getByUrlAndHash(url: string, hash: string): Promise<SourceRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM evidence_sources WHERE url = ? AND content_hash = ?')
      .bind(url, hash)
      .first<Record<string, unknown>>()
    return row ? rowToSourceRecord(row) : null
  }

  async listForFlowRun(flowRunId: string): Promise<SourceRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM evidence_sources WHERE flow_run_id = ? ORDER BY created_at ASC')
      .bind(flowRunId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToSourceRecord)
  }

  async updateBodyRef(sourceId: number, bodyRef: string): Promise<void> {
    await this.db
      .prepare('UPDATE evidence_sources SET body_ref = ? WHERE source_id = ?')
      .bind(bodyRef, sourceId)
      .run()
  }
}
