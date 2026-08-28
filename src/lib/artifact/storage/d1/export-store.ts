import type { ArtifactExportRecord, ExportStoreBackend } from '../types'

function rowToRecord(row: Record<string, unknown>): ArtifactExportRecord {
  const destination = row.destination as string
  return {
    exportId: row.export_id as string,
    versionId: row.version_id as string,
    destination,
    status: row.status as ArtifactExportRecord['status'],
    exportMetadataJson: (row.export_metadata_json as string | null) ?? null,
    exporterId: destination,
    externalId: null,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  }
}

export class D1ExportStoreBackend implements ExportStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(opts: Parameters<ExportStoreBackend['insert']>[0]): Promise<string> {
    const now = Date.now()
    await this.db
      .prepare(
        `INSERT INTO artifact_exports
          (export_id, version_id, destination, status, export_metadata_json, created_at, updated_at)
         VALUES (?, ?, ?, 'pending', ?, ?, ?)`,
      )
      .bind(
        opts.exportId,
        opts.versionId,
        opts.destination,
        opts.metadata ? JSON.stringify(opts.metadata) : null,
        now,
        now,
      )
      .run()

    return opts.exportId
  }

  async updateStatus(exportId: string, status: string, metadata?: unknown): Promise<void> {
    const now = Date.now()
    await this.db
      .prepare(
        'UPDATE artifact_exports SET status = ?, export_metadata_json = ?, updated_at = ? WHERE export_id = ?',
      )
      .bind(status, metadata !== undefined ? JSON.stringify(metadata) : null, now, exportId)
      .run()
  }

  async listForVersion(versionId: string): Promise<ArtifactExportRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM artifact_exports WHERE version_id = ? ORDER BY created_at DESC')
      .bind(versionId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }
}
