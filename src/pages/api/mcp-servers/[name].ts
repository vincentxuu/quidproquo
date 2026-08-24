export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createMcpServersManager } from '@/lib/agent-skills'

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Server name is required' }, 400)
  }

  const server = await manager.getServerByName(name)
  if (!server) {
    return json({ error: 'Server not found' }, 404)
  }

  return json({ server })
}

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Server name is required' }, 400)
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

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Server name is required' }, 400)
  }

  const deleted = await manager.deleteServer(name)
  if (!deleted) {
    return json({ error: 'Server not found' }, 404)
  }

  return json({ deleted: true })
}

export const PATCH: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createMcpServersManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Server name is required' }, 400)
  }

  const server = await manager.toggleServer(name)
  if (!server) {
    return json({ error: 'Server not found' }, 404)
  }

  return json({ server })
}
