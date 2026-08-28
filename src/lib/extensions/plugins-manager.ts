import type { D1Database } from '@cloudflare/workers-types'
import type { PluginRecord } from './types'

export class PluginsManager {
  constructor(private db: D1Database) {}

  private generateId(): string {
    return `plugin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }

  private now(): number {
    return Math.floor(Date.now() / 1000)
  }

  /**
   * List all plugins
   */
  async listPlugins(): Promise<PluginRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM plugins ORDER BY name')
      .all()

    return result.results.map((row) => this.rowToRecord(row))
  }

  /**
   * Get a plugin by name
   */
  async getPluginByName(name: string): Promise<PluginRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM plugins WHERE name = ?')
      .bind(name)
      .first()

    if (!row) return null

    return this.rowToRecord(row)
  }

  /**
   * Install a plugin
   */
  async installPlugin(
    input: Omit<PluginRecord, 'id' | 'installed_at'>
  ): Promise<PluginRecord> {
    const id = this.generateId()
    const now = this.now()

    await this.db
      .prepare(
        `INSERT INTO plugins (id, name, description, version, author, source_url, skills, mcp_servers, installed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.description || null,
        input.version || null,
        input.author || null,
        input.source_url || null,
        input.skills || null,
        input.mcp_servers || null,
        now
      )
      .run()

    return this.getPluginByName(input.name) as Promise<PluginRecord>
  }

  /**
   * Update a plugin
   */
  async updatePlugin(
    name: string,
    input: Partial<Omit<PluginRecord, 'id' | 'name' | 'installed_at'>>
  ): Promise<PluginRecord | null> {
    const existing = await this.getPluginByName(name)
    if (!existing) return null

    const updates: string[] = []
    const values: unknown[] = []

    if (input.description !== undefined) {
      updates.push('description = ?')
      values.push(input.description)
    }

    if (input.version !== undefined) {
      updates.push('version = ?')
      values.push(input.version)
    }

    if (input.author !== undefined) {
      updates.push('author = ?')
      values.push(input.author)
    }

    if (input.source_url !== undefined) {
      updates.push('source_url = ?')
      values.push(input.source_url)
    }

    if (input.skills !== undefined) {
      updates.push('skills = ?')
      values.push(input.skills)
    }

    if (input.mcp_servers !== undefined) {
      updates.push('mcp_servers = ?')
      values.push(input.mcp_servers)
    }

    if (updates.length === 0) return existing

    values.push(name)

    await this.db
      .prepare(`UPDATE plugins SET ${updates.join(', ')} WHERE name = ?`)
      .bind(...values)
      .run()

    return this.getPluginByName(name)
  }

  /**
   * Uninstall a plugin
   */
  async uninstallPlugin(name: string): Promise<boolean> {
    const result = await this.db
      .prepare('DELETE FROM plugins WHERE name = ?')
      .bind(name)
      .run()

    return result.meta.changes > 0
  }

  /**
   * Get skills from a plugin
   */
  async getPluginSkills(name: string): Promise<string[]> {
    const plugin = await this.getPluginByName(name)
    if (!plugin || !plugin.skills) return []

    try {
      return JSON.parse(plugin.skills) as string[]
    } catch {
      return []
    }
  }

  /**
   * Get MCP servers from a plugin
   */
  async getPluginMcpServers(name: string): Promise<string[]> {
    const plugin = await this.getPluginByName(name)
    if (!plugin || !plugin.mcp_servers) return []

    try {
      return JSON.parse(plugin.mcp_servers) as string[]
    } catch {
      return []
    }
  }

  /**
   * Convert a database row to a PluginRecord
   */
  private rowToRecord(row: Record<string, unknown>): PluginRecord {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      version: row.version as string | null,
      author: row.author as string | null,
      source_url: row.source_url as string | null,
      skills: row.skills as string | null,
      mcp_servers: row.mcp_servers as string | null,
      installed_at: row.installed_at as number,
    }
  }
}

export function createPluginsManager(db: D1Database): PluginsManager {
  return new PluginsManager(db)
}
