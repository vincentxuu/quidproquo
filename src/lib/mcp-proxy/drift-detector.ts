import { listTools } from './client'
import { createHash } from '../marketplace/hash'

interface ServerRow {
  id: string
  name: string
  transport: string
  url: string | null
}

interface SnapshotRow {
  id: string
  tool_name: string
  schema_hash: string
  removed_at: number | null
}

export interface DriftReport {
  newTools: string[]
  removedTools: string[]
  changedTools: string[]
  errors: string[]
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export async function detectToolDrift(
  db: D1Database,
  credentials: Record<string, string>,
): Promise<DriftReport> {
  const report: DriftReport = { newTools: [], removedTools: [], changedTools: [], errors: [] }
  const now = Math.floor(Date.now() / 1000)

  let servers: ServerRow[]
  try {
    const result = await db
      .prepare('SELECT id, name, transport, url FROM mcp_server_v2 WHERE enabled = 1')
      .all<ServerRow>()
    servers = result.results ?? []
  } catch {
    report.errors.push('Failed to query mcp_server_v2')
    return report
  }

  for (const server of servers) {
    if ((server.transport !== 'http' && server.transport !== 'sse') || !server.url) continue

    let liveTools: Array<{ name: string; description?: string; inputSchema?: Record<string, unknown> }>
    try {
      const headers: Record<string, string> = {}
      const cred = credentials[server.name]
      if (cred) headers['Authorization'] = `Bearer ${cred}`
      liveTools = await listTools({ url: server.url, headers })
    } catch (err) {
      report.errors.push(`${server.name}: ${err instanceof Error ? err.message : String(err)}`)
      continue
    }

    let existingSnapshots: SnapshotRow[]
    try {
      const result = await db
        .prepare('SELECT id, tool_name, schema_hash, removed_at FROM tool_snapshot WHERE server_id = ?')
        .bind(server.id)
        .all<SnapshotRow>()
      existingSnapshots = result.results ?? []
    } catch {
      report.errors.push(`${server.name}: Failed to query tool_snapshot`)
      continue
    }

    const activeSnapshots = existingSnapshots.filter(s => !s.removed_at)
    const activeByName = new Map(activeSnapshots.map(s => [s.tool_name, s]))
    const liveByName = new Map(liveTools.map(t => [t.name, t]))

    for (const tool of liveTools) {
      const schemaJson = JSON.stringify(tool.inputSchema ?? {})
      const hash = await createHash(schemaJson)
      const qualifiedKey = `${server.name}__${tool.name}`
      const existing = activeByName.get(tool.name)

      if (!existing) {
        // New tool
        await db.prepare(`
          INSERT OR IGNORE INTO tool_snapshot (id, server_id, tool_name, qualified_key, description, input_schema, schema_hash, first_seen_at, last_seen_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(genId('ts'), server.id, tool.name, qualifiedKey, tool.description ?? '', schemaJson, hash, now, now).run()
        report.newTools.push(qualifiedKey)
      } else if (existing.schema_hash !== hash) {
        // Schema changed — insert new snapshot row
        await db.prepare(`
          INSERT OR IGNORE INTO tool_snapshot (id, server_id, tool_name, qualified_key, description, input_schema, schema_hash, first_seen_at, last_seen_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(genId('ts'), server.id, tool.name, qualifiedKey, tool.description ?? '', schemaJson, hash, now, now).run()
        report.changedTools.push(qualifiedKey)
      } else {
        // Same — update last_seen_at
        await db.prepare('UPDATE tool_snapshot SET last_seen_at = ? WHERE id = ?')
          .bind(now, existing.id).run()
      }
    }

    // Removed tools: active snapshots not in live tools
    for (const [toolName, snapshot] of activeByName) {
      if (!liveByName.has(toolName)) {
        await db.prepare('UPDATE tool_snapshot SET removed_at = ? WHERE id = ?')
          .bind(now, snapshot.id).run()
        report.removedTools.push(`${server.name}__${toolName}`)
      }
    }
  }

  // Log drift report if anything changed
  const hasChanges = report.newTools.length > 0 || report.removedTools.length > 0 || report.changedTools.length > 0
  if (hasChanges || report.errors.length > 0) {
    try {
      await db.prepare(`
        INSERT INTO agent_events (session_id, seq, type, payload_json, created_at)
        VALUES ('system', 0, 'mcp/drift', ?, ?)
      `).bind(JSON.stringify(report), now).run()
    } catch {
      // Logging failure is non-fatal
    }
  }

  return report
}
