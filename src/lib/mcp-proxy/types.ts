export interface McpToolDefinition {
  name: string
  description?: string
  inputSchema?: Record<string, unknown>
}

export interface McpToolCallRequest {
  sessionId: string
  server: string
  tool: string
  input: Record<string, unknown>
}

export interface McpToolCallResult {
  content: unknown
  isError?: boolean
}

export interface McpServerConfig {
  id: string
  name: string
  type: 'http' | 'sse' | 'stdio'
  url: string | null
  command: string | null
  env: Record<string, string>
  toolPermissions: Record<string, ToolPermission>
  enabled: boolean
}

export type ToolPermission = 'always_allow' | 'always_ask' | 'always_deny'

export interface McpToolCallError {
  code: string
  message: string
}
