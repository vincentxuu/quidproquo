import type { PolicyBody } from '../../schema/body'
import type { PolicyDefinitionBackend, PolicyDefinitionRow } from '../types'

function nowMs(): number {
  return Date.now()
}

function rowToRecord(row: Record<string, unknown>): PolicyDefinitionRow {
  return {
    policyId: Number(row.policy_id),
    policyKey: String(row.policy_key),
    version: Number(row.version),
    label: String(row.label),
    body: JSON.parse(String(row.category_json)) as PolicyBody,
    createdBy: row.created_by != null ? String(row.created_by) : null,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    archivedAt: row.archived_at != null ? Number(row.archived_at) : null,
  }
}

export class D1PolicyDefinitionBackend implements PolicyDefinitionBackend {
  constructor(private readonly db: D1Database) {}

  async insert(opts: { policyKey: string; version: number; label: string; body: PolicyBody; createdBy?: string }): Promise<number> {
    const now = nowMs()
    const result = await this.db.prepare(
      `INSERT INTO policy_definitions (policy_key, version, label, category_json, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      opts.policyKey,
      opts.version,
      opts.label,
      JSON.stringify(opts.body),
      opts.createdBy ?? null,
      now,
      now,
    ).run()
    return Number(result.meta.last_row_id)
  }

  async getByKey(policyKey: string, version?: number): Promise<PolicyDefinitionRow | null> {
    let row: Record<string, unknown> | null
    if (version !== undefined) {
      row = await this.db.prepare(
        `SELECT * FROM policy_definitions WHERE policy_key = ? AND version = ? AND archived_at IS NULL ORDER BY version DESC LIMIT 1`
      ).bind(policyKey, version).first<Record<string, unknown>>()
    } else {
      row = await this.db.prepare(
        `SELECT * FROM policy_definitions WHERE policy_key = ? AND archived_at IS NULL ORDER BY version DESC LIMIT 1`
      ).bind(policyKey).first<Record<string, unknown>>()
    }
    return row ? rowToRecord(row) : null
  }

  async list(opts?: { archived?: boolean }): Promise<PolicyDefinitionRow[]> {
    let query: string
    if (opts?.archived) {
      query = `SELECT * FROM policy_definitions ORDER BY policy_key ASC, version DESC`
    } else {
      query = `SELECT * FROM policy_definitions WHERE archived_at IS NULL ORDER BY policy_key ASC, version DESC`
    }
    const result = await this.db.prepare(query).all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async archive(policyKey: string): Promise<void> {
    const now = nowMs()
    await this.db.prepare(
      `UPDATE policy_definitions SET archived_at = ? WHERE policy_key = ?`
    ).bind(now, policyKey).run()
  }

  async bumpVersion(policyKey: string, newBody: PolicyBody): Promise<number> {
    const current = await this.getByKey(policyKey)
    const nextVersion = current ? current.version + 1 : 1
    const now = nowMs()
    const result = await this.db.prepare(
      `INSERT INTO policy_definitions (policy_key, version, label, category_json, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      policyKey,
      nextVersion,
      current?.label ?? policyKey,
      JSON.stringify(newBody),
      current?.createdBy ?? null,
      now,
      now,
    ).run()
    return Number(result.meta.last_row_id)
  }
}
