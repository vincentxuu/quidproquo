export const prerender = false

import type { APIRoute } from 'astro'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { initGatelane } from '../../lib/gatelane'
import { requireAdmin } from '../../lib/auth/admin'
import { runDeepResearch, type DeepResearchBody } from '../../lib/research/orchestrator'
import type { Env } from '@/lib/config/env'

export const POST: APIRoute = async (context) => {
  initGatelane()
  try {
    const { request, cookies } = context
    const routeEnv = (context as unknown as { env?: Env }).env
    const runtimeEnv = ((routeEnv as unknown as Env | undefined) ?? (cloudflareEnv as unknown as Env))
    const auth = await requireAdmin(cookies, request)
    if (!auth.ok) return auth.response

    const payload = await request.json().catch(() => ({})) as DeepResearchBody
    const brief = typeof payload.brief === 'string' ? payload.brief.trim() : ''
    if (!brief) {
      return new Response('Brief is required and must be a string', { status: 400 })
    }

    const origin = runtimeEnv.URL || new URL(request.url).origin
    const result = await runDeepResearch({
      brief,
      config: payload.config,
      env: runtimeEnv,
      origin,
    })

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Deep research API error:', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
