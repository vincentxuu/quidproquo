import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { runEmbedPipeline } from '../../../lib/indexing/pipeline'
import { EMBED_BATCH_SIZE } from '../../../lib/retrieval/tools/hybrid-search'
import { requireScheduledAuth, UnauthorizedError } from '@/lib/auth/scheduled-auth'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    await requireScheduledAuth(cookies, request, env as unknown as { CRAWL_SECRET?: string })
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) throw error
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
