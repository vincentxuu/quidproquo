import type { McpServerConfig, ToolPermission } from './types'
import { getToolPermission } from './registry'

export interface ToolsetConfig {
  serverIds: string[]
  toolOverrides: Record<string, ToolPermission>
}

export function resolvePermission(
  server: McpServerConfig,
  toolName: string,
  toolset: ToolsetConfig | null,
): ToolPermission {
  const overrideKey = `${server.name}__${toolName}`
  if (toolset?.toolOverrides[overrideKey]) {
    return toolset.toolOverrides[overrideKey]
  }
  return getToolPermission(server, toolName)
}

export function isServerEnabled(
  serverId: string,
  toolset: ToolsetConfig | null,
): boolean {
  if (!toolset) return true
  return toolset.serverIds.includes(serverId)
}

export async function loadToolset(
  db: D1Database,
  toolsetName: string,
): Promise<ToolsetConfig | null> {
  const row = await db
    .prepare('SELECT server_ids, tool_overrides FROM default_toolset WHERE name = ?')
    .bind(toolsetName)
    .first()
  if (!row) return null
  return {
    serverIds: JSON.parse((row.server_ids as string) || '[]'),
    toolOverrides: JSON.parse((row.tool_overrides as string) || '{}'),
  }
}
