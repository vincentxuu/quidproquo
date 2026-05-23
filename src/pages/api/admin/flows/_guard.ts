import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'
import { json } from '@/lib/api/response'

export function ensureAgentFlowEnabled(): Response | undefined {
  const flags = readFlags(env as unknown as Env)
  if (!flags.agentConsole.enabled) {
    return json({ error: 'agent_flow_disabled' }, 503)
  }
  return undefined
}
