import type { ArtifactSectionRecord, SectionStoreBackend } from '../types'

function rowToRecord(row: Record<string, unknown>): ArtifactSectionRecord {
  return {
    sectionId: row.section_id as string,
    versionId: row.version_id as string,
    artifactId: row.artifact_id as string,
    orgId: (row.org_id as string) ?? 'default',
    sectionKey: row.section_key as string,
    ordinal: row.ordinal as number,
    heading: (row.heading as string | null) ?? null,
    bodyText: (row.body_text as string) ?? '',
    bodyJson: (row.body_json as string | null) ?? null,
    claimIdsJson: (row.claim_ids_json as string | null) ?? null,
    sourceIdsJson: (row.source_ids_json as string | null) ?? null,
    flowStepRunId: (row.flow_step_run_id as string | null) ?? null,
    approvalStatus: (row.approval_status as ArtifactSectionRecord['approvalStatus']) ?? 'draft',
    resolvedBy: (row.resolved_by as string | null) ?? null,
    resolvedAt: (row.resolved_at as number | null) ?? null,
    createdAt: row.created_at as number,
  }
}

export class D1SectionStoreBackend implements SectionStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insertBatch(sections: ArtifactSectionRecord[]): Promise<void> {
    if (sections.length === 0) return
    const now = Date.now()
    const stmts = sections.map((s) =>
      this.db
        .prepare(
          `INSERT OR REPLACE INTO artifact_sections
            (section_id, version_id, artifact_id, org_id, section_key, ordinal, heading, body_text, body_json,
             claim_ids_json, source_ids_json, flow_step_run_id, approval_status, resolved_by, resolved_at, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          s.sectionId,
          s.versionId,
          s.artifactId,
          s.orgId,
          s.sectionKey,
          s.ordinal,
          s.heading ?? null,
          s.bodyText,
          s.bodyJson ?? null,
          s.claimIdsJson ?? null,
          s.sourceIdsJson ?? null,
          s.flowStepRunId ?? null,
          s.approvalStatus,
          s.resolvedBy ?? null,
          s.resolvedAt ?? null,
          s.createdAt || now,
        ),
    )
    await this.db.batch(stmts)
  }

  async listForVersion(versionId: string): Promise<ArtifactSectionRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM artifact_sections WHERE version_id = ? ORDER BY ordinal ASC')
      .bind(versionId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async getById(sectionId: string): Promise<ArtifactSectionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM artifact_sections WHERE section_id = ?')
      .bind(sectionId)
      .first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async updateStatus(sectionId: string, status: string, opts?: { resolvedBy?: string; resolvedAt?: number }): Promise<void> {
    await this.db
      .prepare('UPDATE artifact_sections SET approval_status = ?, resolved_by = ?, resolved_at = ? WHERE section_id = ?')
      .bind(status, opts?.resolvedBy ?? null, opts?.resolvedAt ?? null, sectionId)
      .run()
  }
}
