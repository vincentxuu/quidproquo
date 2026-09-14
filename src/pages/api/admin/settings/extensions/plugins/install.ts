export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, serverError } from '@/lib/api/response'
import { installAgentPlugin } from '@/lib/marketplace/installer-v2'
import { validateManifest, validateMcpConfig } from '@/lib/marketplace/agent-plugin-loader'
import type { LoadedPlugin, LoadedPluginSkill, AgentPluginMcpConfig } from '@/lib/marketplace/types'

type Env = { DB: D1Database; R2_AGENT_ARTIFACT?: R2Bucket }

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const body = await request.json().catch(() => ({})) as {
    manifest?: Record<string, unknown>
    skills?: Array<{ name: string; description: string; content: string; files?: Array<{ path: string; content: string }> }>
    mcp_config?: Record<string, unknown>
    subject_type?: string
    subject_id?: string
  }

  if (!body.manifest) {
    return badRequest('manifest (plugin.json contents) is required')
  }

  let manifest
  try {
    manifest = validateManifest(body.manifest)
  } catch (err) {
    return badRequest(`Invalid manifest: ${err instanceof Error ? err.message : String(err)}`)
  }

  const mcpConfig: AgentPluginMcpConfig | null = body.mcp_config
    ? validateMcpConfig(body.mcp_config)
    : null

  const skills: LoadedPluginSkill[] = (body.skills ?? []).map(s => ({
    name: s.name,
    description: s.description,
    content: s.content,
    files: s.files ?? [],
  }))

  const plugin: LoadedPlugin = {
    manifest,
    mcpConfig,
    skills,
    sourcePath: 'api',
  }

  const subjectType = body.subject_type ?? 'workspace'
  const subjectId = body.subject_id ?? 'default'

  try {
    const result = await installAgentPlugin(e.DB, e.R2_AGENT_ARTIFACT, plugin, subjectType, subjectId)
    return json({ ok: true, ...result }, 201)
  } catch (err) {
    return serverError(`Install failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}
