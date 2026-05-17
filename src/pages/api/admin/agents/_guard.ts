import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'
import { json } from '@/lib/api/response'

export function ensureAgentOsEnabled(): Response | undefined {
  const flags = readFlags(env as unknown as Env)
  if (!flags.agentOs.enabled) {
    return json({ error: 'agent_os_disabled' }, 503)
  }
  return undefined
}
