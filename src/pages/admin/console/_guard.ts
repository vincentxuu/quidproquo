import { getEnv } from '@/lib/config/env'
import { readFlags } from '@/lib/config/flags'

/**
 * Returns a 503 Response when the umbrella console flag is off.
 * Returns undefined when the umbrella is enabled (page can proceed to render).
 */
export function ensureConsoleUmbrella(): Response | undefined {
  const flags = readFlags(getEnv())
  if (!flags.agentConsole.enabled) {
    return new Response('Agent Console is disabled.', { status: 503 })
  }
  return undefined
}
