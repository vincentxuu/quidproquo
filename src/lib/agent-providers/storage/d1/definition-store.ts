import type { ProviderDefinition, ProviderCategory } from '../../types'
import type { ProviderDefinitionStoreBackend } from '../types'

interface DefinitionRow {
  provider_id: string
  category: string
  display_name: string
  capability_json: string
  cost_model_json: string
  outbound_domains_json: string
  is_enabled: number
  created_at: number
  updated_at: number
}

function rowToDefinition(row: DefinitionRow): ProviderDefinition {
  return {
    providerId: row.provider_id,
    category: row.category as ProviderCategory,
    displayName: row.display_name,
    capabilityJson: JSON.parse(row.capability_json) as Record<string, unknown>,
    costModelJson: JSON.parse(row.cost_model_json) as Record<string, unknown>,
    outboundDomains: JSON.parse(row.outbound_domains_json) as string[],
    isEnabled: row.is_enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class D1ProviderDefinitionStore implements ProviderDefinitionStoreBackend {
  constructor(private readonly db: D1Database) {}

  async upsert(def: ProviderDefinition): Promise<void> {
    await this.db
      .prepare(
        `INSERT OR REPLACE INTO provider_definitions
         (provider_id, category, display_name, capability_json, cost_model_json, outbound_domains_json, is_enabled, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        def.providerId,
        def.category,
        def.displayName,
        JSON.stringify(def.capabilityJson),
        JSON.stringify(def.costModelJson),
        JSON.stringify(def.outboundDomains),
        def.isEnabled ? 1 : 0,
        def.createdAt,
        def.updatedAt,
      )
      .run()
  }

  async getById(id: string): Promise<ProviderDefinition | null> {
    const row = await this.db
      .prepare(`SELECT * FROM provider_definitions WHERE provider_id = ?`)
      .bind(id)
      .first<DefinitionRow>()
    return row ? rowToDefinition(row) : null
  }

  async listByCategory(category: ProviderCategory): Promise<ProviderDefinition[]> {
    const result = await this.db
      .prepare(`SELECT * FROM provider_definitions WHERE category = ? ORDER BY provider_id ASC`)
      .bind(category)
      .all<DefinitionRow>()
    return (result.results ?? []).map(rowToDefinition)
  }

  async setEnabled(id: string, enabled: boolean): Promise<void> {
    await this.db
      .prepare(`UPDATE provider_definitions SET is_enabled = ? WHERE provider_id = ?`)
      .bind(enabled ? 1 : 0, id)
      .run()
  }
}
