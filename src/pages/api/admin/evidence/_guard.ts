import { readFlags } from '@/lib/config/flags'
import type { Env } from '@/lib/config/env'

export function ensureAgentEvidenceEnabled(env: Env): Response | undefined {
  const flags = readFlags(env)
  if (!flags.agentEvidence.enabled) {
    return new Response(JSON.stringify({ error: 'agent evidence disabled' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return undefined
}
