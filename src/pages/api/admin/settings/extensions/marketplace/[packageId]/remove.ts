export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { uninstallPlugin } from '@/lib/marketplace/installer'

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const sourceId = params.packageId
  if (!sourceId) return badRequest('packageId required')

  const e = env as unknown as Env
  const plugin = await e.DB
    .prepare('SELECT id FROM plugins WHERE marketplace_source_id = ?')
    .bind(sourceId)
    .first()
  if (!plugin) return notFound('no installed plugin from this source')

  await uninstallPlugin(e.DB, plugin.id as string)

  return json({ ok: true, removed: plugin.id })
}
