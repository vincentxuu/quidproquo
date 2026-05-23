import type { ExcerptRecord, ExcerptStoreBackend } from '../types'

const nowMs = () => Date.now()

function rowToExcerptRecord(row: Record<string, unknown>): ExcerptRecord {
  return {
    excerptId: row.excerpt_id as number,
    sourceId: row.source_id as number,
    offset: row.offset as number,
    length: row.length as number,
    text: row.text as string,
    surroundingContext: (row.surrounding_context as string | null) ?? null,
    createdAt: row.created_at as number,
  }
}

export class D1ExcerptStoreBackend implements ExcerptStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(input: Parameters<ExcerptStoreBackend['insert']>[0]): Promise<number> {
    const now = nowMs()
    const result = await this.db
      .prepare(
        `INSERT INTO evidence_excerpts (source_id, offset, length, text, surrounding_context, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.sourceId,
        input.offset,
        input.length,
        input.text,
        input.surroundingContext ?? null,
        now,
      )
      .run()
    return Number(result.meta.last_row_id)
  }

  async listForSource(sourceId: number): Promise<ExcerptRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM evidence_excerpts WHERE source_id = ? ORDER BY offset ASC')
      .bind(sourceId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToExcerptRecord)
  }
}
