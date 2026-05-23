import type { ConflictRecord, ConflictStoreBackend } from '../types'

const nowMs = () => Date.now()

function rowToConflictRecord(row: Record<string, unknown>): ConflictRecord {
  return {
    conflictId: row.conflict_id as number,
    claimAId: row.claim_a_id as number,
    claimBId: row.claim_b_id as number,
    confidenceDelta: row.confidence_delta as number,
    detectedBy: row.detected_by as string,
    status: row.status as 'pending' | 'approved' | 'rejected' | 'expired',
    approvalId: (row.approval_id as string | null) ?? null,
    resolvedBy: (row.resolved_by as string | null) ?? null,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  }
}

export class D1ConflictStoreBackend implements ConflictStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(input: Parameters<ConflictStoreBackend['insert']>[0]): Promise<number> {
    const now = nowMs()
    const result = await this.db
      .prepare(
        `INSERT INTO evidence_conflicts
          (claim_a_id, claim_b_id, confidence_delta, detected_by, status, approval_id, resolved_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?)`,
      )
      .bind(
        input.claimAId,
        input.claimBId,
        input.confidenceDelta ?? 0.0,
        input.detectedBy,
        input.status ?? 'pending',
        now,
        now,
      )
      .run()
    return Number(result.meta.last_row_id)
  }

  async listByStatus(
    status: 'pending' | 'approved' | 'rejected' | 'expired',
    opts?: { limit?: number; cursor?: string },
  ): Promise<{ conflicts: ConflictRecord[]; cursor: string | null }> {
    const limit = opts?.limit ?? 50
    const cursor = opts?.cursor ? Number(opts.cursor) : null

    const result = cursor
      ? await this.db
          .prepare(
            `SELECT * FROM evidence_conflicts
             WHERE status = ? AND conflict_id > ?
             ORDER BY conflict_id ASC LIMIT ?`,
          )
          .bind(status, cursor, limit + 1)
          .all<Record<string, unknown>>()
      : await this.db
          .prepare(
            `SELECT * FROM evidence_conflicts
             WHERE status = ?
             ORDER BY conflict_id ASC LIMIT ?`,
          )
          .bind(status, limit + 1)
          .all<Record<string, unknown>>()

    const rows = result.results ?? []
    const hasMore = rows.length > limit
    const page = hasMore ? rows.slice(0, limit) : rows
    const nextCursor = hasMore ? String(page[page.length - 1].conflict_id) : null

    return {
      conflicts: page.map(rowToConflictRecord),
      cursor: nextCursor,
    }
  }

  async updateStatus(
    conflictId: number,
    status: 'pending' | 'approved' | 'rejected' | 'expired',
    resolvedBy?: string,
  ): Promise<void> {
    await this.db
      .prepare(
        `UPDATE evidence_conflicts
         SET status = ?, resolved_by = ?, updated_at = ?
         WHERE conflict_id = ?`,
      )
      .bind(status, resolvedBy ?? null, nowMs(), conflictId)
      .run()
  }

  async getByApprovalId(approvalId: string): Promise<ConflictRecord | null> {
    const result = await this.db
      .prepare(`SELECT * FROM evidence_conflicts WHERE approval_id = ? LIMIT 1`)
      .bind(approvalId)
      .first<Record<string, unknown>>()
    return result ? rowToConflictRecord(result) : null
  }

  async updateApprovalId(conflictId: number, approvalId: string): Promise<void> {
    await this.db
      .prepare(
        `UPDATE evidence_conflicts SET approval_id = ?, updated_at = ? WHERE conflict_id = ?`,
      )
      .bind(approvalId, nowMs(), conflictId)
      .run()
  }
}
