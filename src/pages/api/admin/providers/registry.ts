export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { listAll } from '@/lib/agent-providers/registry'
import { ensureProvidersEnabled } from './_guard'

export const GET: APIRoute = async ({ cookies }) => {
  const guard = ensureProvidersEnabled()
  if (guard) return guard

  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  try {
    const providers = listAll()
    return json({ providers })
  } catch {
    return json({ providers: [] })
  }
}
