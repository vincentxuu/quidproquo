import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { runEmbedPipeline } from '../../../lib/indexing/pipeline'
import { EMBED_BATCH_SIZE } from '../../../lib/retrieval/tools/hybrid-search'
import { verifySession } from '../../../lib/auth/session'
import { z } from 'zod'

export const prerender = false
const INDEX_SYNC_SECRET_HEADER = 'X-Index-Sync-Secret'
export const MAX_EMBED_SYNC_LIMIT = 500

const requestSchema = z.object({
  sources: z.array(z.enum(['posts', 'docs'])).min(1).max(2).default(['posts', 'docs']),
  limit: z.number().int().min(1).max(MAX_EMBED_SYNC_LIMIT).default(EMBED_BATCH_SIZE),
  full: z.boolean().default(false),
}).strict()

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isAuthorized(request, cookies))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const rawBody = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(rawBody)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request body', issues: parsed.error.issues }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const results = await runEmbedPipeline(parsed.data.sources, 0, parsed.data.limit, parsed.data.full)
  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

async function isAuthorized(
  request: Request,
  cookies: { get(name: string): { value: string } | undefined },
): Promise<boolean> {
  const session = cookies.get('session')?.value
  if (session && await verifySession(session)) return true

  const secret = (env as unknown as { INDEX_SYNC_SECRET?: string }).INDEX_SYNC_SECRET
  return Boolean(secret) && request.headers.get(INDEX_SYNC_SECRET_HEADER) === secret
}
