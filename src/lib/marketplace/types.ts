// Agent Plugins 1.0.0 spec: https://agent-plugins.org/
// Only $schema and name are required in plugin.json.

export interface AgentPluginManifest {
  $schema?: string
  name: string
  version?: string
  description?: string
  author?: { name: string; url?: string }
  keywords?: string[]
  license?: string
  repository?: string
  extensions?: Record<string, Record<string, unknown>>
}

// mcp.json — MCP server declarations bundled with the plugin
export interface AgentPluginMcpConfig {
  $schema?: string
  mcpServers: Record<string, AgentPluginMcpServer>
}

export interface AgentPluginMcpServer {
  type: 'stdio' | 'streamable-http' | 'sse'
  command?: string
  args?: string[]
  url?: string
  env?: Record<string, string>
  headers?: Record<string, string>
}

// Internal representation after loading a plugin directory
export interface LoadedPlugin {
  manifest: AgentPluginManifest
  mcpConfig: AgentPluginMcpConfig | null
  skills: LoadedPluginSkill[]
  sourcePath: string
}

export interface LoadedPluginSkill {
  name: string
  description: string
  content: string
  files: { path: string; content: string }[]
}

// Legacy types (kept for backward compatibility with existing D1 data)
export interface PluginManifest {
  name: string
  version: string
  author?: string
  description?: string
  skills?: ManifestSkill[]
  mcp_servers?: ManifestMcpServer[]
}

export interface ManifestSkill {
  name: string
  description?: string
  file: string
}

export interface ManifestMcpServer {
  name: string
  description?: string
  type: 'http' | 'sse' | 'stdio'
  url?: string
  command?: string
}

export interface MarketplaceSource {
  id: string
  url: string
  name: string | null
  description: string | null
  lastFetchedAt: number | null
  createdAt: number
}

export interface MarketplacePackage {
  sourceId: string
  manifest: PluginManifest | AgentPluginManifest
  sourceUrl: string
  installed: boolean
}
