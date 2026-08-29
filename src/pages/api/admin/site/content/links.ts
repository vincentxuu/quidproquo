export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  // Placeholder - would need content-ops report data
  return json({ opportunities: [] })
}



