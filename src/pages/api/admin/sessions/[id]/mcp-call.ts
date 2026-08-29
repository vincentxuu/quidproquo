export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { loadServers, discoverTools } from '@/lib/mcp-proxy/registry'
import { dispatchMcpTool, isMcpTool } from '@/lib/mcp-proxy/dispatcher'

interface McpCallBody {
  tool?: string
  input?: Record<string, unknown>
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const sessionId = params.id
  if (!sessionId) return badRequest('session id required')

  const body = (await request.json().catch(() => ({}))) as McpCallBody
  const toolName = body.tool?.trim()
  if (!toolName) return badRequest('tool name required')
  if (!isMcpTool(toolName)) return badRequest('not an MCP tool (must start with mcp__)')

  const e = env as unknown as Env
  const servers = await loadServers(e.DB)
  const credentials: Record<string, string> = {}
  const discovered = await discoverTools(servers, credentials)

  const result = await dispatchMcpTool(
    { servers: discovered, credentials },
    toolName,
    body.input ?? {},
  )

  if (result.error) {
    return json({ ok: false, error: result.error, permission: result.permission }, 400)
  }

  return json({ ok: true, result: result.result, permission: result.permission })
}
