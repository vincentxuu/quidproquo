export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createPluginsManager } from '@/lib/agent-skills'

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Plugin name is required' }, 400)
  }

  const plugin = await manager.getPluginByName(name)
  if (!plugin) {
    return json({ error: 'Plugin not found' }, 404)
  }

  return json({ plugin })
}

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Plugin name is required' }, 400)
  }

  const body = await request.json().catch(() => ({})) as {
    description?: string
    version?: string
    author?: string
    source_url?: string
    skills?: string
    mcp_servers?: string
  }

  const plugin = await manager.updatePlugin(name, body)
  if (!plugin) {
    return json({ error: 'Plugin not found' }, 404)
  }

  return json({ plugin })
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Plugin name is required' }, 400)
  }

  const deleted = await manager.uninstallPlugin(name)
  if (!deleted) {
    return json({ error: 'Plugin not found' }, 404)
  }

  return json({ deleted: true })
}
