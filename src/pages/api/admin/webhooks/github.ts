export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { handleGitHubWebhook } from '@/lib/agent/triggers/github-webhook'

export const POST: APIRoute = async ({ request }) => {
  const e = env as unknown as Env
  const eventType = request.headers.get('x-github-event')
  const signature = request.headers.get('x-hub-signature-256')

  if (!eventType || !signature) {
    return new Response(JSON.stringify({ error: 'Missing GitHub headers' }), { status: 400 })
  }

  const payload = await request.text()
  const result = await handleGitHubWebhook(e.DB, eventType, payload, signature)

  return new Response(JSON.stringify({ ok: true, ...result }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
