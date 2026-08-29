export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { fetchManifest } from '@/lib/marketplace/fetcher'
import { uninstallPlugin, installPlugin } from '@/lib/marketplace/installer'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const sourceId = params.packageId
  if (!sourceId) return badRequest('packageId required')

  const e = env as unknown as Env
  const source = await e.DB
    .prepare('SELECT * FROM marketplace_sources WHERE id = ?')
    .bind(sourceId)
    .first()
  if (!source) return notFound('source not found')

  const existing = await e.DB
    .prepare('SELECT id FROM plugins WHERE marketplace_source_id = ?')
    .bind(sourceId)
    .first()
  if (existing) {
    await uninstallPlugin(e.DB, existing.id as string)
  }

  const sourceUrl = source.url as string
  const manifest = await fetchManifest(sourceUrl)
  const result = await installPlugin(e.DB, manifest, sourceUrl, sourceId)

  return json({ ok: true, ...result, name: manifest.name, version: manifest.version })
}
