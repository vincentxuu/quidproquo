import type { APIRoute } from 'astro'
import { verifySession } from '../../../lib/auth/session'

interface Env {
  DEEP_RESEARCH_KV?: KVNamespace
  SESSION?: KVNamespace
}

export const GET: APIRoute = async ({ params, cookies, env }) => {
  const sessionToken = cookies.get('session')?.value
  const isAdmin = sessionToken ? await verifySession(sessionToken) : false
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 })
  }

  const reportId = params.reportId?.trim()
  if (!reportId) {
    return new Response('reportId required', { status: 400 })
  }

  const kv = (env as unknown as Env).DEEP_RESEARCH_KV ?? (env as unknown as Env).SESSION
  if (!kv) {
    return new Response('Deep research KV namespace is not configured', { status: 500 })
  }

  const report = await kv.get(reportId)
  if (!report) {
    return new Response('Report not found', { status: 404 })
  }

  return new Response(report, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
