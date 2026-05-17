export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB

  let total = 0
  let drafts = 0
  let missingType = 0
  let missingDescription = 0
  let missingTldr = 0

  try {
    const totalRow = await db.prepare('SELECT COUNT(*) as c FROM posts').first<{ c: number }>()
    total = totalRow?.c ?? 0

    // These would require parsing frontmatter from content_json or checking specific columns
    // For now, return placeholder values until we have proper metadata columns
    drafts = 0
    missingType = 0
    missingDescription = 0
    missingTldr = 0
  } catch {
    // Tables may not exist yet
  }

  return json({
    total,
    drafts,
    missingType,
    missingDescription,
    missingTldr,
  })
}



