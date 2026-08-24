import type { McpServerRecord } from './types'

export class McpServersManager {
  constructor(private db: D1Database) {}

  private generateId(): string {
    return `mcp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }

  private now(): number {
    return Math.floor(Date.now() / 1000)
  }

  /**
   * List all MCP servers
   */
  async listServers(): Promise<McpServerRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM mcp_servers ORDER BY name')
      .all()

    return result.results.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      type: row.type as McpServerRecord['type'],
      command: row.command as string | null,
      url: row.url as string | null,
      env: row.env as string | null,
      tools: row.tools as string | null,
      enabled: row.enabled === 1,
      created_at: row.created_at as number,
    }))
  }

  /**
   * Get a server by name
   */
  async getServerByName(name: string): Promise<McpServerRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM mcp_servers WHERE name = ?')
      .bind(name)
      .first()

    if (!row) return null

    return this.rowToRecord(row)
  }

  /**
   * Create a new server
   */
  async createServer(
    input: Omit<McpServerRecord, 'id' | 'created_at'>
  ): Promise<McpServerRecord> {
    const id = this.generateId()
    const now = this.now()

    await this.db
      .prepare(
        `INSERT INTO mcp_servers (id, name, description, type, command, url, env, tools, enabled, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.name,
        input.description || null,
        input.type,
        input.command || null,
        input.url || null,
        input.env || null,
        input.tools || null,
        input.enabled ? 1 : 0,
        now
      )
      .run()

    return this.getServerByName(input.name) as Promise<McpServerRecord>
  }

  /**
   * Update a server
   */
  async updateServer(
    name: string,
    input: Partial<Omit<McpServerRecord, 'id' | 'name' | 'created_at'>>
  ): Promise<McpServerRecord | null> {
    const existing = await this.getServerByName(name)
    if (!existing) return null

    const updates: string[] = []
    const values: unknown[] = []

    if (input.description !== undefined) {
      updates.push('description = ?')
      values.push(input.description)
    }

    if (input.type !== undefined) {
      updates.push('type = ?')
      values.push(input.type)
    }

    if (input.command !== undefined) {
      updates.push('command = ?')
      values.push(input.command)
    }

    if (input.url !== undefined) {
      updates.push('url = ?')
      values.push(input.url)
    }

    if (input.env !== undefined) {
      updates.push('env = ?')
      values.push(input.env)
    }

    if (input.tools !== undefined) {
      updates.push('tools = ?')
      values.push(input.tools)
    }

    if (input.enabled !== undefined) {
      updates.push('enabled = ?')
      values.push(input.enabled ? 1 : 0)
    }

    if (updates.length === 0) return existing

    values.push(name)

    await this.db
      .prepare(`UPDATE mcp_servers SET ${updates.join(', ')} WHERE name = ?`)
      .bind(...values)
      .run()

    return this.getServerByName(name)
  }

  /**
   * Delete a server
   */
  async deleteServer(name: string): Promise<boolean> {
    const result = await this.db
      .prepare('DELETE FROM mcp_servers WHERE name = ?')
      .bind(name)
      .run()

    return result.meta.changes > 0
  }

  /**
   * Toggle server enabled state
   */
  async toggleServer(name: string): Promise<McpServerRecord | null> {
    const existing = await this.getServerByName(name)
    if (!existing) return null

    return this.updateServer(name, { enabled: !existing.enabled })
  }

  /**
   * Get all enabled servers
   */
  async getEnabledServers(): Promise<McpServerRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM mcp_servers WHERE enabled = 1 ORDER BY name')
      .all()

    return result.results.map((row) => this.rowToRecord(row))
  }

  /**
   * Get tools for a server
   */
  async getServerTools(name: string): Promise<string[]> {
    const server = await this.getServerByName(name)
    if (!server || !server.tools) return []

    try {
      return JSON.parse(server.tools) as string[]
    } catch {
      return []
    }
  }

  /**
   * Convert a database row to a McpServerRecord
   */
  private rowToRecord(row: Record<string, unknown>): McpServerRecord {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      type: row.type as McpServerRecord['type'],
      command: row.command as string | null,
      url: row.url as string | null,
      env: row.env as string | null,
      tools: row.tools as string | null,
      enabled: row.enabled === 1 || row.enabled === true,
      created_at: row.created_at as number,
    }
  }
}

export function createMcpServersManager(db: D1Database): McpServersManager {
  return new McpServersManager(db)
}
