import { env } from 'cloudflare:workers'
import { json } from '@/lib/api/response'
import type { Env } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'

/**
 * Umbrella kill switch for every artifact admin endpoint. Returns a 503 Response when
 * `AGENT_ARTIFACT_ENABLED=false`, or `undefined` when the feature is on (caller proceeds).
 * Mirrors `providers/_guard.ts`.
 */
export function ensureAgentArtifactEnabled(): Response | undefined {
  const flags = readFlags(env as unknown as Env)
  if (!flags.agentArtifact.enabled) {
    return json({ error: 'agent_artifact_disabled' }, 503)
  }
  return undefined
}
