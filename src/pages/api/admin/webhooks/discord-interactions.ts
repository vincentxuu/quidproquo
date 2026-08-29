export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import {
  verifyDiscordInteraction,
  parseInteractionCustomId,
  buildInteractionResponse,
} from '@/lib/notification/channels/discord-interactions'
import { createSessionManager } from '@/lib/agent/session-manager'

export const POST: APIRoute = async ({ request }) => {
  const e = env as unknown as Env
  const signature = request.headers.get('x-signature-ed25519') ?? ''
  const timestamp = request.headers.get('x-signature-timestamp') ?? ''
  const body = await request.text()

  const publicKey = (e as unknown as Record<string, string>).DISCORD_PUBLIC_KEY
  if (!publicKey) {
    return new Response('Discord not configured', { status: 500 })
  }

  const valid = await verifyDiscordInteraction(body, signature, timestamp, publicKey)
  if (!valid) {
    return new Response('Invalid signature', { status: 401 })
  }

  const interaction = JSON.parse(body) as { type: number; data?: { custom_id?: string } }

  if (interaction.type === 1) {
    return buildInteractionResponse('pong')
  }

  if (interaction.type === 3 && interaction.data?.custom_id) {
    const parsed = parseInteractionCustomId(interaction.data.custom_id)
    if (!parsed) return buildInteractionResponse('update', 'Unknown action')

    const _sm = createSessionManager(e.DB)
    // Delegate to the approval API internally
    try {
      const approvalRes = await fetch(
        new URL(`/api/admin/sessions/approvals/${parsed.approvalId}/${parsed.action}`, request.url),
        { method: 'POST', headers: { Cookie: '' } },
      )
      const result = await approvalRes.json().catch(() => ({})) as Record<string, unknown>
      const label = parsed.action === 'allow' ? 'Approved' : 'Denied'
      return buildInteractionResponse('update', `${label}: ${result.ok ? 'success' : 'failed'}`)
    } catch {
      return buildInteractionResponse('update', 'Action failed')
    }
  }

  return new Response('Unknown interaction type', { status: 400 })
}
