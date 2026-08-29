import type { McpServerConfig, McpToolDefinition, ToolPermission } from './types'
import { listTools } from './client'

const toolCache = new Map<string, McpToolDefinition[]>()

export async function loadServers(db: D1Database): Promise<McpServerConfig[]> {
  const result = await db
    .prepare('SELECT * FROM mcp_servers WHERE enabled = 1 ORDER BY name')
    .all()

  return result.results.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    type: row.type as McpServerConfig['type'],
    url: row.url as string | null,
    command: row.command as string | null,
    env: parseJson(row.env as string | null, {}),
    toolPermissions: parseJson(row.tool_permissions as string | null, {}),
    enabled: true,
  }))
}

export async function discoverTools(
  servers: McpServerConfig[],
  credentials: Record<string, string>,
): Promise<Map<string, { server: McpServerConfig; tool: McpToolDefinition }>> {
  const all = new Map<string, { server: McpServerConfig; tool: McpToolDefinition }>()

  for (const server of servers) {
    if (server.type !== 'http' && server.type !== 'sse') continue
    if (!server.url) continue

    const cacheKey = server.id
    let tools = toolCache.get(cacheKey)
    if (!tools) {
      try {
        const headers: Record<string, string> = {}
        const cred = credentials[server.name]
        if (cred) headers['Authorization'] = `Bearer ${cred}`
        tools = await listTools({ url: server.url, headers })
        toolCache.set(cacheKey, tools)
      } catch {
        tools = []
      }
    }

    for (const tool of tools) {
      const key = `mcp__${server.name}__${tool.name}`
      all.set(key, { server, tool })
    }
  }

  return all
}

export function getToolPermission(
  server: McpServerConfig,
  toolName: string,
): ToolPermission {
  return server.toolPermissions[toolName] ?? 'always_allow'
}

export function clearCache(): void {
  toolCache.clear()
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}
