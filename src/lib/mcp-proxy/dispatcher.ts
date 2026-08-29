import type { McpServerConfig, McpToolCallResult, McpToolDefinition, ToolPermission } from './types'
import { callTool } from './client'
import { getToolPermission } from './registry'

const MCP_PREFIX = 'mcp__'

export function isMcpTool(toolName: string): boolean {
  return toolName.startsWith(MCP_PREFIX)
}

export function parseMcpToolName(toolName: string): { serverName: string; tool: string } | null {
  if (!isMcpTool(toolName)) return null
  const rest = toolName.slice(MCP_PREFIX.length)
  const sep = rest.indexOf('__')
  if (sep < 0) return null
  return { serverName: rest.slice(0, sep), tool: rest.slice(sep + 2) }
}

export interface DispatchContext {
  servers: Map<string, { server: McpServerConfig; tool: McpToolDefinition }>
  credentials: Record<string, string>
}

export interface DispatchResult {
  result?: McpToolCallResult
  permission: ToolPermission
  error?: string
}

export async function dispatchMcpTool(
  ctx: DispatchContext,
  toolName: string,
  input: Record<string, unknown>,
): Promise<DispatchResult> {
  const parsed = parseMcpToolName(toolName)
  if (!parsed) return { permission: 'always_deny', error: `Invalid MCP tool name: ${toolName}` }

  const entry = ctx.servers.get(toolName)
  if (!entry) return { permission: 'always_deny', error: `MCP tool not found: ${toolName}` }

  const permission = getToolPermission(entry.server, parsed.tool)
  if (permission === 'always_deny') {
    return { permission, error: `Tool ${toolName} is denied by policy` }
  }

  if (!entry.server.url) {
    return { permission, error: `MCP server ${entry.server.name} has no URL (stdio not supported yet)` }
  }

  const headers: Record<string, string> = {}
  const cred = ctx.credentials[entry.server.name]
  if (cred) headers['Authorization'] = `Bearer ${cred}`

  const result = await callTool({ url: entry.server.url, headers }, parsed.tool, input)
  return { result, permission }
}
