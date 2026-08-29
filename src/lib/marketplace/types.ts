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
  manifest: PluginManifest
  sourceUrl: string
  installed: boolean
}
