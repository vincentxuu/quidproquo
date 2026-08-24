export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createMcpServersManager } from '@/lib/agent-skills'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const servers = await manager.listServers()
  return json({ servers })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const body = await request.json().catch(() => ({})) as {
    name?: string
    description?: string
    type?: 'stdio' | 'http' | 'sse'
    command?: string
    url?: string
    env?: string
    tools?: string
  }

  if (!body.name || !body.type) {
    return json({ error: 'name and type are required' }, 400)
  }

  const existing = await manager.getServerByName(body.name)
  if (existing) {
    return json({ error: 'Server with this name already exists' }, 409)
  }

  const server = await manager.createServer({
    name: body.name,
    description: body.description || null,
    type: body.type,
    command: body.command || null,
    url: body.url || null,
    env: body.env || null,
    tools: body.tools || null,
    enabled: true,
  })

  return json({ server }, 201)
}

export const PUT: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return json({ error: 'name query parameter is required' }, 400)
  }

  const body = await request.json().catch(() => ({})) as {
    description?: string
    type?: 'stdio' | 'http' | 'sse'
    command?: string
    url?: string
    env?: string
    tools?: string
    enabled?: boolean
  }

  const server = await manager.updateServer(name, body)
  if (!server) {
    return json({ error: 'Server not found' }, 404)
  }

  return json({ server })
}

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return json({ error: 'name query parameter is required' }, 400)
  }

  const deleted = await manager.deleteServer(name)
  if (!deleted) {
    return json({ error: 'Server not found' }, 404)
  }

  return json({ deleted: true })
}
