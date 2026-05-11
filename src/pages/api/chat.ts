import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../lib/auth/session'
import { checkAndIncrementRateLimit } from '../../lib/auth/rate-limit'
import { runPipeline } from '../../lib/rag/graph'
import { createTrace, updateTrace, scoreTrace } from '../../lib/langfuse'
import { loadRagSettings, buildShadowBaselineConfig } from '../../lib/rag/settings'
import { loadLatestCheckpoint, maybeSaveCheckpoint } from '../../lib/rag/checkpoints'
import { lookupSemanticCache, storeSemanticCache } from '../../lib/rag/cache'

interface Env { DB: D1Database }

async function getVisitorLimit(): Promise<number> {
  const { DB } = env as unknown as Env
  const row = await DB.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('visitor_daily_limit').first<{ value: string }>()
  return parseInt(row?.value ?? '5', 10)
}

function sseEvent(type: string, data: unknown): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`
}

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const sessionToken = cookies.get('session')?.value
  const isAdmin = sessionToken ? await verifySession(sessionToken) : false

  if (!isAdmin) {
    const ip = clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'
    const limit = await getVisitorLimit()
    const rateResult = await checkAndIncrementRateLimit(ip, limit)
    if (!rateResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'rate_limit', message: `Daily limit reached. Resets at ${rateResult.resetAt}` }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  const body = await request.json() as { message: string; thread_id?: string }
  const { message, thread_id = crypto.randomUUID() } = body

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'Empty message' }), { status: 400 })
  }

  const traceId = crypto.randomUUID()
  const ip = clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const ragConfig = await loadRagSettings()
  const checkpointSummary = await loadLatestCheckpoint(thread_id)

  const cached = await lookupSemanticCache(message, ragConfig.semanticCacheThreshold).catch(() => null)
  if (cached) {
    return new Response(new ReadableStream({
      start(controller) {
        const send = (type: string, data: unknown) => {
          controller.enqueue(new TextEncoder().encode(sseEvent(type, data)))
        }
        send('token', { text: cached.response })
        send('done', {
          usage: { input: 0, output: 0 },
          confidence: cached.confidence,
          thread_id,
          cached: true,
        })
        controller.close()
      },
    }), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }

  await createTrace({
    id: traceId,
    name: 'blog-rag',
    userId: isAdmin ? 'owner' : ip,
    input: { message },
  })

  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: unknown) => {
        controller.enqueue(new TextEncoder().encode(sseEvent(type, data)))
      }

      try {
        const state = await runPipeline(
          { message, traceId, threadId: thread_id, conversationSummary: checkpointSummary, config: ragConfig },
          {
            onStep: (agent, extra) => send('agent_step', { agent, status: 'completed', ...extra }),
            onToken: (text) => send('token', { text }),
            onRelated: (posts) => send('related', posts),
          }
        )

        if (ragConfig.shadowModeEnabled) {
          const shadowState = await runPipeline(
            {
              message,
              traceId: `${traceId}:shadow`,
              threadId: thread_id,
              conversationSummary: checkpointSummary,
              config: buildShadowBaselineConfig(ragConfig),
            },
            {
              onStep: () => {},
              onToken: () => {},
              onRelated: () => {},
            }
          )

          const { DB } = env as unknown as Env
          await DB.prepare(
            `INSERT INTO shadow_runs (
              id, trace_id, thread_id, query, primary_response, primary_confidence,
              shadow_response, shadow_confidence, config_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            crypto.randomUUID(),
            traceId,
            thread_id,
            message,
            state.final_response ?? '',
            state.critique?.confidence ?? 1,
            shadowState.final_response ?? '',
            shadowState.critique?.confidence ?? 1,
            JSON.stringify(ragConfig)
          ).run().catch(() => {})
        }

        const seenUrls = new Set<string>()
        const sources = state.search_results
          .filter(r => { if (seenUrls.has(r.source_url)) return false; seenUrls.add(r.source_url); return true })
          .map(r => ({ title: r.title ?? r.source_url, url: r.source_url, slug: r.slug }))
        if (sources.length > 0) send('sources', sources)

        const remainingQuota = !isAdmin
          ? await (async () => {
              const limit2 = await getVisitorLimit()
              const key = `rate:${ip}:${new Date().toISOString().slice(0, 10)}`
              const used = parseInt((await (env as unknown as { RATE: KVNamespace }).RATE.get(key)) ?? '0', 10)
              return Math.max(0, limit2 - used)
            })()
          : null

        send('done', {
          usage: state.token_usage,
          confidence: state.critique?.confidence ?? 1,
          thread_id,
          ...(remainingQuota !== null ? { remaining: remainingQuota } : {}),
        })

        const { DB } = env as unknown as Env
        await DB.prepare(
          'INSERT INTO chat_logs (id, thread_id, ip, is_admin, query, response, confidence, langfuse_trace_id) VALUES (?,?,?,?,?,?,?,?)'
        ).bind(
          crypto.randomUUID(), thread_id, ip, isAdmin ? 1 : 0,
          message, state.final_response ?? '',
          state.critique?.confidence ?? 1, traceId
        ).run()

        await updateTrace(traceId, {
          output: { response: state.final_response },
          metadata: {
            confidence: state.critique?.confidence,
            answer_relevance: state.critique?.answer_relevance,
            intent_alignment: state.critique?.intent_alignment,
            drift_detected: state.critique?.drift_detected,
            chunks: state.search_results.length,
            config: ragConfig,
          },
        })
        await scoreTrace(traceId, 'confidence', state.critique?.confidence ?? 1)
        await scoreTrace(traceId, 'answer_relevance', state.critique?.answer_relevance ?? 0)
        await scoreTrace(traceId, 'intent_alignment', state.critique?.intent_alignment ?? 0)
        await storeSemanticCache(message, state.final_response ?? '', state.critique?.confidence ?? 0).catch(() => {})
        await maybeSaveCheckpoint(state, ragConfig.checkpointThresholdRatio).catch(() => {})

      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Internal error'
        send('error', { type: 'internal', message: msg })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
