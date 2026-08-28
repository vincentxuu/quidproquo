import type { AgentProcessRecord, ProcessRegistryBackend } from '../types'
import { processFromRow } from './utils'

export class D1ProcessRegistryBackend implements ProcessRegistryBackend {
  constructor(private readonly db: D1Database) {}

  async upsert(process: AgentProcessRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO agent_processes (
        agent_id, version, display_name, description, schedule, tool_call_limit,
        timeout_seconds, max_concurrent, approval_ttl_seconds, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(agent_id) DO UPDATE SET
        version = excluded.version,
        display_name = excluded.display_name,
        description = excluded.description,
        schedule = excluded.schedule,
        tool_call_limit = excluded.tool_call_limit,
        timeout_seconds = excluded.timeout_seconds,
        max_concurrent = excluded.max_concurrent,
        approval_ttl_seconds = excluded.approval_ttl_seconds,
        updated_at = excluded.updated_at
    `).bind(
      process.agentId,
      process.version,
      process.displayName,
      process.description ?? null,
      process.schedule ?? null,
      process.toolCallLimit,
      process.timeoutSeconds,
      process.maxConcurrent,
      process.approvalTtlSeconds,
      process.createdAt,
      process.updatedAt,
    ).run()
  }

  async get(agentId: string): Promise<AgentProcessRecord | null> {
    const row = await this.db.prepare('SELECT * FROM agent_processes WHERE agent_id = ?').bind(agentId).first<Record<string, unknown>>()
    return row ? processFromRow(row) : null
  }

  async list(): Promise<AgentProcessRecord[]> {
    const result = await this.db.prepare('SELECT * FROM agent_processes ORDER BY agent_id').all<Record<string, unknown>>()
    return (result.results ?? []).map(processFromRow)
  }
}
