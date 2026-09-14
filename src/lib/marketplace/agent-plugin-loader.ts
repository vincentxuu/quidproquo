import type {
  AgentPluginManifest,
  AgentPluginMcpConfig,
  LoadedPlugin,
  LoadedPluginSkill,
} from './types'

const PLUGIN_JSON = 'plugin.json'
const MCP_JSON = 'mcp.json'
const SKILLS_DIR = 'skills'
const SKILL_FILE = 'SKILL.md'

const NAME_RE = /^[a-z0-9][a-z0-9.-]{0,62}[a-z0-9]$/

function parseSkillFrontmatter(content: string): { name: string; description: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { name: '', description: '', body: content }
  const frontmatter = match[1]
  const body = match[2]
  let name = ''
  let description = ''
  for (const line of frontmatter.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx < 0) continue
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (key === 'name') name = value
    if (key === 'description') description = value
  }
  return { name, description, body }
}

export function validateManifest(raw: unknown): AgentPluginManifest {
  if (!raw || typeof raw !== 'object') throw new Error('plugin.json must be a JSON object')
  const obj = raw as Record<string, unknown>
  if (typeof obj.name !== 'string' || !NAME_RE.test(obj.name)) {
    throw new Error(`Invalid plugin name: ${obj.name}`)
  }
  return {
    $schema: typeof obj.$schema === 'string' ? obj.$schema : undefined,
    name: obj.name,
    version: typeof obj.version === 'string' ? obj.version : undefined,
    description: typeof obj.description === 'string' ? obj.description : undefined,
    author: obj.author && typeof obj.author === 'object' && 'name' in (obj.author as Record<string, unknown>)
      ? { name: String((obj.author as Record<string, unknown>).name) }
      : undefined,
    keywords: Array.isArray(obj.keywords) ? obj.keywords.filter((k): k is string => typeof k === 'string') : undefined,
    license: typeof obj.license === 'string' ? obj.license : undefined,
    repository: typeof obj.repository === 'string' ? obj.repository : undefined,
    extensions: obj.extensions && typeof obj.extensions === 'object'
      ? obj.extensions as Record<string, Record<string, unknown>>
      : undefined,
  }
}

export function validateMcpConfig(raw: unknown): AgentPluginMcpConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (!obj.mcpServers || typeof obj.mcpServers !== 'object') return null
  return obj as unknown as AgentPluginMcpConfig
}

export interface PluginFileSystem {
  readFile(path: string): Promise<string | null>
  listDir(path: string): Promise<string[]>
  exists(path: string): Promise<boolean>
}

export async function loadPluginFromDirectory(
  rootPath: string,
  fs: PluginFileSystem,
): Promise<LoadedPlugin> {
  const pluginJsonRaw = await fs.readFile(`${rootPath}/${PLUGIN_JSON}`)
  if (!pluginJsonRaw) throw new Error(`Missing ${PLUGIN_JSON} in ${rootPath}`)

  const manifest = validateManifest(JSON.parse(pluginJsonRaw))

  let mcpConfig: AgentPluginMcpConfig | null = null
  const mcpJsonRaw = await fs.readFile(`${rootPath}/${MCP_JSON}`)
  if (mcpJsonRaw) {
    mcpConfig = validateMcpConfig(JSON.parse(mcpJsonRaw))
  }

  const skills: LoadedPluginSkill[] = []
  const skillsPath = `${rootPath}/${SKILLS_DIR}`
  if (await fs.exists(skillsPath)) {
    const skillDirs = await fs.listDir(skillsPath)
    for (const dir of skillDirs) {
      const skillMdPath = `${skillsPath}/${dir}/${SKILL_FILE}`
      const skillContent = await fs.readFile(skillMdPath)
      if (!skillContent) continue

      const { name, description } = parseSkillFrontmatter(skillContent)
      const skillName = name || dir

      const files: { path: string; content: string }[] = []
      const refsPath = `${skillsPath}/${dir}/references`
      if (await fs.exists(refsPath)) {
        const refFiles = await fs.listDir(refsPath)
        for (const rf of refFiles) {
          const refContent = await fs.readFile(`${refsPath}/${rf}`)
          if (refContent) files.push({ path: `references/${rf}`, content: refContent })
        }
      }

      skills.push({ name: skillName, description, content: skillContent, files })
    }
  }

  // Single-skill plugin: root SKILL.md when no skills/ directory
  if (skills.length === 0) {
    const rootSkill = await fs.readFile(`${rootPath}/${SKILL_FILE}`)
    if (rootSkill) {
      const { name, description } = parseSkillFrontmatter(rootSkill)
      skills.push({ name: name || manifest.name, description, content: rootSkill, files: [] })
    }
  }

  return { manifest, mcpConfig, skills, sourcePath: rootPath }
}
