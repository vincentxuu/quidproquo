import type { APIRoute } from 'astro'
import { verifySession } from '../../../lib/auth/session'

interface Env {
  DB?: D1Database
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
  const db = (env as unknown as Env).DB
  if (!kv && !db) {
    return new Response('Deep research storage is not configured', { status: 500 })
  }

  if (db) {
    try {
      const row = await db.prepare('SELECT final_report FROM deep_research_reports WHERE report_id = ?')
        .bind(reportId)
        .first<{ final_report: string }>()
      if (row?.final_report) {
        return new Response(row.final_report, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        })
      }
    } catch (error) {
      console.error('Deep research report lookup by D1 failed:', error)
    }
  }

  if (kv) {
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

  return new Response('Report not found', { status: 404 })
}
