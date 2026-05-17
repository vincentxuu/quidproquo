import type { ApprovalRecord, ApprovalStatus, ApprovalStoreBackend } from '../types'
import { approvalFromRow, encodeJson } from './utils'

export class D1ApprovalStoreBackend implements ApprovalStoreBackend {
  constructor(private readonly db: D1Database) {}

  async create(approval: ApprovalRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO agent_approval_requests (
        approval_id, run_id, reason, context_json, status, resolved_by, resolved_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      approval.approvalId,
      approval.runId,
      approval.reason,
      encodeJson(approval.context),
      approval.status,
      approval.resolvedBy ?? null,
      approval.resolvedAt ?? null,
      approval.createdAt,
    ).run()
  }

  async get(approvalId: string): Promise<ApprovalRecord | null> {
    const row = await this.db.prepare('SELECT * FROM agent_approval_requests WHERE approval_id = ?').bind(approvalId).first<Record<string, unknown>>()
    return row ? approvalFromRow(row) : null
  }

  async listByStatus(status: ApprovalStatus): Promise<ApprovalRecord[]> {
    const result = await this.db.prepare(`
      SELECT * FROM agent_approval_requests
      WHERE status = ?
      ORDER BY created_at ASC
    `).bind(status).all<Record<string, unknown>>()
    return (result.results ?? []).map(approvalFromRow)
  }

  async resolve(approvalId: string, patch: { status: Exclude<ApprovalStatus, 'pending'>; resolvedBy?: string; resolvedAt: number }): Promise<ApprovalRecord> {
    await this.db.prepare(`
      UPDATE agent_approval_requests
      SET status = ?, resolved_by = ?, resolved_at = ?
      WHERE approval_id = ? AND status = 'pending'
    `).bind(patch.status, patch.resolvedBy ?? null, patch.resolvedAt, approvalId).run()
    const approval = await this.get(approvalId)
    if (!approval) throw new Error(`Approval not found: ${approvalId}`)
    return approval
  }

  async expireBefore(cutoffMs: number): Promise<ApprovalRecord[]> {
    const expired = await this.db.prepare(`
      SELECT * FROM agent_approval_requests
      WHERE status = 'pending' AND created_at < ?
    `).bind(cutoffMs).all<Record<string, unknown>>()
    await this.db.prepare(`
      UPDATE agent_approval_requests
      SET status = 'expired'
      WHERE status = 'pending' AND created_at < ?
    `).bind(cutoffMs).run()
    return (expired.results ?? []).map((row) => approvalFromRow({ ...row, status: 'expired' }))
  }
}
