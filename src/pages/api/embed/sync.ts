import type { APIRoute } from 'astro'
import { runEmbedPipeline } from '../../../lib/embed/pipeline'
import { verifySession } from '../../../lib/auth/session'
import { EMBED_BATCH_SIZE } from '../../../lib/rag/tools/hybrid-search'

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get('session')?.value
  if (!session || !(await verifySession(session))) {
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
