export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { ensureProvidersEnabled } from '../_guard'
import { json } from '@/lib/api/response'

interface ProviderCredentialRow {
  credential_id: string
  credential_type: string
  scope_json: string
  expires_at: number | null
}

function randomSecret(): string {
  return `qkq_rotated_${crypto.randomUUID()}`
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const guard = ensureProvidersEnabled()
  if (guard) return guard

  const typedEnv = env as unknown as Env
  const db = typedEnv.DB

  const providerId = params.providerId
  if (!providerId) return json({ error: 'providerId required' }, 400)

  try {
    const existing = await db
      .prepare(
        `SELECT credential_id, credential_type, scope_json, expires_at
         FROM provider_credentials
         WHERE provider_id = ?
         ORDER BY (agent_id IS NULL) DESC, updated_at DESC
         LIMIT 1`,
      )
      .bind(providerId)
      .first<ProviderCredentialRow>()

    const now = Date.now()
    const newKey = randomSecret()

    if (existing) {
      await db
        .prepare(
          `UPDATE provider_credentials
             SET value_encrypted = ?, updated_at = ?
           WHERE credential_id = ?`,
        )
        .bind(newKey, now, existing.credential_id)
        .run()
    } else {
      const providerExists = await db
        .prepare(`SELECT provider_id FROM provider_definitions WHERE provider_id = ? LIMIT 1`)
        .bind(providerId)
        .first<{ provider_id: string }>()

      if (!providerExists) {
        return json({ error: 'provider not found' }, 404)
      }

      const credentialId = crypto.randomUUID()
      await db
        .prepare(
          `INSERT INTO provider_credentials
           (credential_id, provider_id, agent_id, credential_type, value_encrypted, scope_json, expires_at, created_at, updated_at)
           VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          credentialId,
          providerId,
          'api_key',
          newKey,
          JSON.stringify([]),
          null,
          now,
          now,
        )
        .run()
    }

    if ((await request.text().catch(() => 'html')).includes('accept-json')) {
      return json({ ok: true, providerId, rotatedAt: now })
    }

    const accept = request.headers.get('accept') ?? ''
    if (accept.includes('application/json')) {
      return json({ ok: true, providerId, rotatedAt: now })
    }

    return new Response(null, { status: 303, headers: { Location: `/admin/console/providers/${encodeURIComponent(providerId)}` } })
  } catch {
    return json({ error: 'failed to rotate provider key' }, 500)
  }
}
