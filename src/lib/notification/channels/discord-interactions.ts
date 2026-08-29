import type { ApprovalAction } from '../types'

export async function verifyDiscordInteraction(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string,
): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    hexToUint8Array(publicKey),
    { name: 'Ed25519' },
    false,
    ['verify'],
  )
  const message = encoder.encode(timestamp + body)
  return crypto.subtle.verify('Ed25519', key, hexToUint8Array(signature), message)
}

function hexToUint8Array(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr
}

export function buildApprovalComponents(approvals: ApprovalAction[]): unknown[] {
  return approvals.slice(0, 5).map(a => ({
    type: 1,
    components: [
      {
        type: 2,
        style: 3,
        label: `Allow: ${a.toolName}`,
        custom_id: `approval:${a.id}:allow`,
      },
      {
        type: 2,
        style: 4,
        label: 'Deny',
        custom_id: `approval:${a.id}:deny`,
      },
    ],
  }))
}

export function parseInteractionCustomId(customId: string): {
  approvalId: string
  action: 'allow' | 'deny'
} | null {
  const match = customId.match(/^approval:(.+):(allow|deny)$/)
  if (!match) return null
  return { approvalId: match[1], action: match[2] as 'allow' | 'deny' }
}

export function buildInteractionResponse(
  type: 'pong' | 'deferred_update' | 'update',
  content?: string,
): Response {
  const types = { pong: 1, deferred_update: 5, update: 7 }
  const body: Record<string, unknown> = { type: types[type] }
  if (content) body.data = { content, components: [] }
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  })
}
