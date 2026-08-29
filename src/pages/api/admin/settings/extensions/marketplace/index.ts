export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { fetchManifest } from '@/lib/marketplace/fetcher'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const sources = await e.DB
    .prepare('SELECT * FROM marketplace_sources ORDER BY created_at DESC')
    .all()

  const packages = []
  for (const source of sources.results) {
    try {
      const manifest = await fetchManifest(source.url as string)
      const installed = await e.DB
        .prepare('SELECT id FROM plugins WHERE source_url = ?')
        .bind(source.url as string)
        .first()
      packages.push({
        sourceId: source.id,
        sourceUrl: source.url,
        manifest,
        installed: !!installed,
      })
    } catch {
      packages.push({
        sourceId: source.id,
        sourceUrl: source.url,
        manifest: null,
        installed: false,
        error: 'Failed to fetch manifest',
      })
    }
  }

  return json({ ok: true, sources: sources.results, packages })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const body = (await request.json().catch(() => ({}))) as { url?: string; name?: string }
  const url = body.url?.trim()
  if (!url) return badRequest('url required')

  const e = env as unknown as Env
  const id = `src_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const now = Math.floor(Date.now() / 1000)

  await e.DB
    .prepare('INSERT INTO marketplace_sources (id, url, name, created_at) VALUES (?, ?, ?, ?)')
    .bind(id, url, body.name ?? null, now)
    .run()

  return json({ ok: true, id, url })
}
