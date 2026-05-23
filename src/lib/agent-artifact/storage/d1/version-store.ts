import type { ArtifactVersionRecord, VersionStoreBackend } from '../types'

function rowToRecord(row: Record<string, unknown>): ArtifactVersionRecord {
  const definitionId = row.definition_id as string
  const status = row.status as ArtifactVersionRecord['status']
  return {
    versionId: row.version_id as string,
    definitionId,
    versionNumber: row.version_number as number,
    status,
    payloadJson: row.payload_json as string,
    bodyText: (row.body_text as string | null) ?? null,
    bodyRefJson: (row.body_ref_json as string | null) ?? null,
    parentVersionId: (row.parent_version_id as string | null) ?? null,
    flowRunId: (row.flow_run_id as string | null) ?? null,
    flowStepRunId: (row.flow_step_run_id as string | null) ?? null,
    resolvedBy: (row.resolved_by as string | null) ?? null,
    createdAt: row.created_at as number,
    // Admin API compatibility aliases
    artifactId: (row.artifact_id as string | null) ?? definitionId,
    approvalStatus: status,
    kind: (row.kind as string | null) ?? undefined,
  }
}

export class D1VersionStoreBackend implements VersionStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(opts: Parameters<VersionStoreBackend['insert']>[0]): Promise<string> {
    const now = Date.now()
    await this.db
      .prepare(
        `INSERT INTO artifact_versions
          (version_id, definition_id, version_number, status, payload_json, body_text, body_ref_json,
           parent_version_id, flow_run_id, flow_step_run_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        opts.versionId,
        opts.definitionId,
        opts.versionNumber,
        opts.status ?? 'draft',
        opts.payloadJson,
        opts.bodyText ?? null,
        opts.bodyRefJson ?? null,
        opts.parentVersionId ?? null,
        opts.flowRunId ?? null,
        opts.flowStepRunId ?? null,
        now,
      )
      .run()

    return opts.versionId
  }

  async getById(versionId: string): Promise<ArtifactVersionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM artifact_versions WHERE version_id = ?')
      .bind(versionId)
      .first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async getLatestForDefinition(definitionId: string): Promise<ArtifactVersionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM artifact_versions WHERE definition_id = ? ORDER BY version_number DESC LIMIT 1')
      .bind(definitionId)
      .first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async listChain(definitionId: string): Promise<ArtifactVersionRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM artifact_versions WHERE definition_id = ? ORDER BY version_number ASC')
      .bind(definitionId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async getLatestForArtifact(artifactId: string): Promise<ArtifactVersionRecord | null> {
    return this.getLatestForDefinition(artifactId)
  }

  async listByFlowRun(flowRunId: string): Promise<ArtifactVersionRecord[]> {
    const result = await this.db
      .prepare(
        `SELECT v.*, d.kind, d.definition_id AS artifact_id
         FROM artifact_versions v
         JOIN artifact_definitions d ON v.definition_id = d.definition_id
         WHERE v.flow_run_id = ?
         ORDER BY v.created_at ASC`,
      )
      .bind(flowRunId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async updateStatus(versionId: string, status: string, resolvedBy?: string): Promise<void> {
    await this.db
      .prepare('UPDATE artifact_versions SET status = ?, resolved_by = ? WHERE version_id = ?')
      .bind(status, resolvedBy ?? null, versionId)
      .run()
  }
}
