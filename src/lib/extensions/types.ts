export interface SkillMetadata {
  name: string
  description: string
  [key: string]: unknown
}

export const SUPPORTED_AGENT_SKILLS = [
  'interview-me',
  'idea-refine',
  'spec-driven-development',
  'planning-and-task-breakdown',
  'incremental-implementation',
  'test-driven-development',
  'context-engineering',
  'source-driven-development',
  'doubt-driven-development',
  'frontend-ui-engineering',
  'api-and-interface-design',
  'browser-testing-with-devtools',
  'debugging-and-error-recovery',
  'code-review-and-quality',
  'code-simplification',
  'security-and-hardening',
  'performance-optimization',
  'git-workflow-and-versioning',
  'ci-cd-and-automation',
  'deprecation-and-migration',
  'documentation-and-adrs',
  'shipping-and-launch',
  'using-agent-skills',
] as const

export type AgentSkill = string

export type SkillSource = 'project' | 'user' | 'imported'

export interface Skill {
  name: string
  description: string
  content: string
  path: string
  metadata: SkillMetadata
  hasScripts: boolean
  hasReferences: boolean
  hasAssets: boolean
  source: SkillSource
  version?: number
}

export interface SkillListItem {
  name: string
  description: string
  path: string
  source: SkillSource
}

export interface CreateSkillInput {
  name: string
  description: string
  content: string
  source?: SkillSource
}

export interface UpdateSkillInput {
  description?: string
  content?: string
}

export interface UserSkillRecord {
  id: string
  name: string
  description: string
  content: string
  source: SkillSource
  tags: string | null
  version: number
  created_at: number
  updated_at: number
}

export interface McpServerRecord {
  id: string
  name: string
  description: string | null
  type: 'stdio' | 'http' | 'sse'
  command: string | null
  url: string | null
  env: string | null
  tools: string | null
  enabled: boolean
  created_at: number
}

export interface PluginRecord {
  id: string
  name: string
  description: string | null
  version: string | null
  author: string | null
  source_url: string | null
  skills: string | null
  mcp_servers: string | null
  installed_at: number
}
