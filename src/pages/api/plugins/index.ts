export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createPluginsManager } from '@/lib/extensions'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const plugins = await manager.listPlugins()
  return json({ plugins })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const body = await request.json().catch(() => ({})) as {
    name?: string
    description?: string
    version?: string
    author?: string
    source_url?: string
    skills?: string
    mcp_servers?: string
  }

  if (!body.name) {
    return json({ error: 'name is required' }, 400)
  }

  const existing = await manager.getPluginByName(body.name)
  if (existing) {
    return json({ error: 'Plugin with this name already exists' }, 409)
  }

  const plugin = await manager.installPlugin({
    name: body.name,
    description: body.description || null,
    version: body.version || null,
    author: body.author || null,
    source_url: body.source_url || null,
    skills: body.skills || null,
    mcp_servers: body.mcp_servers || null,
  })

  return json({ plugin }, 201)
}

export const PUT: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return json({ error: 'name query parameter is required' }, 400)
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

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createPluginsManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return json({ error: 'name query parameter is required' }, 400)
  }

  const deleted = await manager.uninstallPlugin(name)
  if (!deleted) {
    return json({ error: 'Plugin not found' }, 404)
  }

  return json({ deleted: true })
}
