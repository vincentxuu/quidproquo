import type { APIRoute } from 'astro'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { verifySession } from '../../../lib/auth/session'
import type { Env } from '@/lib/config/env'
type DeepResearchStorageMode = 'auto' | 'd1' | 'deep_research_kv' | 'session'

export const GET: APIRoute = async (context) => {
  const { params, cookies } = context
  const routeEnv = (context as unknown as { env?: Env }).env
  const runtimeEnv = ((routeEnv as unknown as Env | undefined) ?? (cloudflareEnv as unknown as Env))
  const sessionToken = cookies.get('session')?.value
  const isAdmin = sessionToken ? await verifySession(sessionToken) : false
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 })
  }

  const reportId = params.reportId?.trim()
  if (!reportId) {
    return new Response('reportId required', { status: 400 })
  }

  const storageMode = await loadDeepResearchStorageMode(runtimeEnv.DB)
  const storage = resolveDeepResearchStorage(runtimeEnv, storageMode)
  const kv = storage.kv
  const db = storage.db
  if (!kv && !db) {
    return new Response(`Deep research storage is not configured for mode: ${storageMode}`, { status: 500 })
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

async function loadDeepResearchStorageMode(db?: D1Database): Promise<DeepResearchStorageMode> {
  if (!db) return 'auto'
  try {
    const row = await db.prepare('SELECT value FROM admin_settings WHERE key = ?')
      .bind('deep_research_storage_mode')
      .first<{ value: string }>()
    return normalizeDeepResearchStorageMode(row?.value)
  } catch {
    return 'auto'
  }
}

function normalizeDeepResearchStorageMode(raw: unknown): DeepResearchStorageMode {
  return raw === 'd1' || raw === 'deep_research_kv' || raw === 'session' ? raw : 'auto'
}

function resolveDeepResearchStorage(runtimeEnv: Env, mode: DeepResearchStorageMode): {
  kv?: KVNamespace
  db?: D1Database
} {
  if (mode === 'd1') return { db: runtimeEnv.DB }
  if (mode === 'deep_research_kv') return { kv: runtimeEnv.DEEP_RESEARCH_KV }
  if (mode === 'session') return { kv: runtimeEnv.SESSION }
  return {
    kv: runtimeEnv.DEEP_RESEARCH_KV ?? runtimeEnv.SESSION,
    db: runtimeEnv.DB,
  }
}
