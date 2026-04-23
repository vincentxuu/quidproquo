import type { APIRoute } from 'astro'
import { runEmbedPipeline } from '../../../lib/embed/pipeline'
import { verifySession } from '../../../lib/auth/session'

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = cookies.get('session')?.value
  if (!session || !(await verifySession(session))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as { sources?: string[] }
  const sources = (body.sources ?? ['posts', 'docs']) as ('posts' | 'docs')[]

  const results = await runEmbedPipeline(sources)
  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
