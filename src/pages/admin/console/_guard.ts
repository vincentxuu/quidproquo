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

// Per-page flags retired 2026-05-23 (Phase 9.4.3).
// All pages are enabled when the umbrella agentConsole.enabled is on.
export function isPageEnabled(_flag?: string): boolean {
  return true
}

export function consolePhaseFor(_flag?: string): string {
  return 'enabled'
}
