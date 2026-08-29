import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { runEmbedPipeline } from '../../../lib/indexing/pipeline'
import { EMBED_BATCH_SIZE } from '../../../lib/retrieval/tools/hybrid-search'
import { verifySession } from '../../../lib/auth/session'

export const prerender = false
const INDEX_SYNC_SECRET_HEADER = 'X-Index-Sync-Secret'

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isAuthorized(request, cookies))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as { sources?: string[]; offset?: number; limit?: number }
  const sources = (body.sources ?? ['posts', 'docs']) as ('posts' | 'docs')[]
  const offset = body.offset ?? 0
  const limit = body.limit ?? EMBED_BATCH_SIZE

  const results = await runEmbedPipeline(sources, offset, limit)
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
