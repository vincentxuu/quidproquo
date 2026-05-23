import type { ArtifactDefinitionRecord, DefinitionStoreBackend } from '../types'

function rowToRecord(row: Record<string, unknown>): ArtifactDefinitionRecord {
  return {
    definitionId: row.definition_id as string,
    flowId: row.flow_id as string,
    kind: row.kind as string,
    ownerScope: row.owner_scope as string,
    label: row.label as string,
    logicalName: row.logical_name as string,
    inputsHash: (row.inputs_hash as string | null) ?? null,
    flowRunId: (row.flow_run_id as string | null) ?? null,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  }
}

export class D1DefinitionStoreBackend implements DefinitionStoreBackend {
  constructor(private readonly db: D1Database) {}

  async upsert(opts: Parameters<DefinitionStoreBackend['upsert']>[0]): Promise<string> {
    const now = Date.now()
    await this.db
      .prepare(
        `INSERT OR IGNORE INTO artifact_definitions
          (definition_id, flow_id, kind, owner_scope, label, logical_name, inputs_hash, flow_run_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        opts.definitionId,
        opts.flowId,
        opts.kind,
        opts.ownerScope,
        opts.label,
        opts.logicalName,
        opts.inputsHash ?? null,
        opts.flowRunId ?? null,
        now,
        now,
      )
      .run()

    await this.db
      .prepare(`UPDATE artifact_definitions SET updated_at = ? WHERE definition_id = ?`)
      .bind(now, opts.definitionId)
      .run()

    return opts.definitionId
  }

  async getById(definitionId: string): Promise<ArtifactDefinitionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM artifact_definitions WHERE definition_id = ?')
      .bind(definitionId)
      .first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async getByFlowAndKind(flowId: string, kind: string, logicalName: string): Promise<ArtifactDefinitionRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM artifact_definitions WHERE flow_id = ? AND kind = ? AND logical_name = ? LIMIT 1')
      .bind(flowId, kind, logicalName)
      .first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async listByKind(kind: string): Promise<ArtifactDefinitionRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM artifact_definitions WHERE kind = ? ORDER BY created_at ASC')
      .bind(kind)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async listForFlowRun(flowRunId: string): Promise<ArtifactDefinitionRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM artifact_definitions WHERE flow_run_id = ? ORDER BY created_at ASC')
      .bind(flowRunId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }
}
