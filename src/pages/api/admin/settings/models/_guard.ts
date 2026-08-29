export const prerender = false

import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'
import { json } from '@/lib/api/response'

export function ensureProvidersEnabled(): Response | null {
  const flags = readFlags(env as unknown as Env)
  if (!flags.providers?.enabled) return json({ error: 'providers_disabled' }, 503)
  return null
}
