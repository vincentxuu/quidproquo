export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { MacRunnerProvider } from '@/lib/agent/runner/mac'

let macProvider: MacRunnerProvider | undefined

export function getMacProvider(db: D1Database): MacRunnerProvider {
  if (!macProvider) macProvider = new MacRunnerProvider(db)
  return macProvider
}

export const GET: APIRoute = async ({ request }) => {
  const upgradeHeader = request.headers.get('Upgrade')
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 })
  }

  const e = env as unknown as Env
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  const expectedToken = e.CRAWL_SECRET
  if (!token || !expectedToken || token !== expectedToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  const pair = new WebSocketPair()
  const [client, server] = Object.values(pair) as [WebSocket, WebSocket]

  const runnerId = `mac_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const provider = getMacProvider(e.DB)

  server.accept()

  await e.DB.prepare(
    "INSERT INTO runner_connections (runner_id, provider, hostname, status, last_heartbeat, created_at) VALUES (?, 'mac', ?, 'connected', ?, ?)",
  )
    .bind(runnerId, request.headers.get('X-Runner-Hostname') ?? 'unknown', Date.now(), Date.now())
    .run()

  provider.registerRunnerSocket(runnerId, server)

  server.addEventListener('message', (event) => {
    const text = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data as ArrayBuffer)
    try {
      const data = JSON.parse(text) as { id?: string; type?: string; result?: unknown; error?: string; sessionId?: string }

      if (data.type === 'heartbeat') {
        e.DB.prepare('UPDATE runner_connections SET last_heartbeat = ? WHERE runner_id = ?')
          .bind(Date.now(), runnerId)
          .run()
          .catch(() => {})
        server.send(JSON.stringify({ type: 'heartbeat_ack' }))
        return
      }

      if (data.id) {
        const sessionId = data.sessionId
        if (sessionId) {
          const handle = provider.getHandle(sessionId)
          if (handle) {
            handle.handleResponse(data as { id: string; result?: unknown; error?: string })
          }
        }
      }
    } catch {
      // ignore malformed
    }
  })

  server.addEventListener('close', () => {
    provider.unregisterRunnerSocket(runnerId)
    e.DB.prepare("UPDATE runner_connections SET status = 'disconnected' WHERE runner_id = ?")
      .bind(runnerId)
      .run()
      .catch(() => {})
  })

  server.addEventListener('error', () => {
    provider.unregisterRunnerSocket(runnerId)
    e.DB.prepare("UPDATE runner_connections SET status = 'disconnected' WHERE runner_id = ?")
      .bind(runnerId)
      .run()
      .catch(() => {})
  })

  return new Response(null, { status: 101, webSocket: client })
}
