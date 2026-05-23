export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const runId = params.runId
  if (!runId) return new Response('run_id required', { status: 400 })

  const db = (env as unknown as Env).DB

  const encoder = new TextEncoder()
  let lastEventId = 0

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Emit existing events
        const existing = await db
          .prepare(
            `SELECT event_id, event_type, payload_json, created_at
             FROM agent_run_events
             WHERE run_id=?
             ORDER BY event_id ASC`,
          )
          .bind(runId)
          .all<{ event_id: number; event_type: string; payload_json: string; created_at: number }>()

        for (const row of existing.results ?? []) {
          const data = `id: ${row.event_id}\nevent: ${row.event_type}\ndata: ${row.payload_json}\n\n`
          controller.enqueue(encoder.encode(data))
          lastEventId = row.event_id
        }

        // Poll for new events every 1s until terminal state
        const poll = async () => {
          const run = await db
            .prepare(`SELECT status FROM agent_runs WHERE run_id=? LIMIT 1`)
            .bind(runId)
            .first<{ status: string }>()

          if (!run || run.status === 'done' || run.status === 'failed' || run.status === 'cancelled') {
            controller.close()
            return
          }

          const newEvents = await db
            .prepare(
              `SELECT event_id, event_type, payload_json
               FROM agent_run_events
               WHERE run_id=? AND event_id > ?
               ORDER BY event_id ASC`,
            )
            .bind(runId, lastEventId)
            .all<{ event_id: number; event_type: string; payload_json: string }>()

          for (const row of newEvents.results ?? []) {
            const data = `id: ${row.event_id}\nevent: ${row.event_type}\ndata: ${row.payload_json}\n\n`
            controller.enqueue(encoder.encode(data))
            lastEventId = row.event_id
          }

          // Cloudflare Workers supports setTimeout in async context
          await new Promise((r) => setTimeout(r, 1000))
          await poll()
        }

        await poll()
      } catch {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    },
  })
}
