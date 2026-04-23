import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../lib/auth/session'
import { checkAndIncrementRateLimit } from '../../lib/auth/rate-limit'
import { getGraph } from '../../lib/rag/graph'
import { createTrace, updateTrace, scoreTrace } from '../../lib/langfuse'
import { HumanMessage } from '@langchain/core/messages'

interface Env { DB: D1Database; RATE: KVNamespace }

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

  await createTrace({
    id: traceId,
    name: 'blog-rag',
    userId: isAdmin ? 'owner' : ip,
    input: { message },
  })

  const graph = getGraph()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: unknown) => {
        controller.enqueue(new TextEncoder().encode(sseEvent(type, data)))
      }

      try {
        const graphStream = graph.stream(
          { messages: [new HumanMessage(message)], langfuse_trace_id: traceId },
          { configurable: { thread_id }, streamMode: 'updates' }
        )

        for await (const chunk of await graphStream) {
          const nodeName = Object.keys(chunk)[0]
          const update = chunk[nodeName]

          if (nodeName === 'planner') {
            send('agent_step', { agent: 'Planner', status: 'completed' })
          } else if (nodeName === 'research') {
            const results = (update as { search_results?: unknown[] })?.search_results ?? []
            send('agent_step', { agent: 'Research', status: 'completed', chunks_found: results.length })
          } else if (nodeName === 'writer') {
            send('agent_step', { agent: 'Writer', status: 'completed' })
            const finalResp = (update as { final_response?: string })?.final_response
            if (finalResp) {
              send('token', { text: finalResp })
            }
          } else if (nodeName === 'critic') {
            send('agent_step', { agent: 'Critic', status: 'completed' })
          } else if (nodeName === 'related') {
            const related = (update as { related_posts?: unknown[] })?.related_posts ?? []
            if (related.length > 0) {
              send('related', related)
            }
          }
        }

        const result = await graph.getState({ configurable: { thread_id } })
        const state = result.values as { search_results?: Array<{ source_url: string; title?: string; slug?: string }>; token_usage?: { input: number; output: number }; critique?: { confidence: number }; final_response?: string }

        const seenUrls = new Set<string>()
        const sources = (state.search_results ?? [])
          .filter(r => { if (seenUrls.has(r.source_url)) return false; seenUrls.add(r.source_url); return true })
          .map(r => ({ title: r.title ?? r.source_url, url: r.source_url, slug: r.slug }))
        if (sources.length > 0) send('sources', sources)

        let remainingQuota: number | null = null
        if (!isAdmin) {
          const key = `rate:${ip}:${new Date().toISOString().slice(0, 10)}`
          const used = parseInt((await (env as unknown as Env).RATE.get(key)) ?? '0', 10)
          const limit2 = await getVisitorLimit()
          remainingQuota = Math.max(0, limit2 - used)
        }

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
          crypto.randomUUID(), thread_id,
          ip, isAdmin ? 1 : 0,
          message, state.final_response ?? '',
          state.critique?.confidence ?? 1, traceId
        ).run()

        await updateTrace(traceId, {
          output: { response: state.final_response },
          metadata: { confidence: state.critique?.confidence, chunks: state.search_results?.length ?? 0 },
        })
        await scoreTrace(traceId, 'confidence', state.critique?.confidence ?? 1)

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
