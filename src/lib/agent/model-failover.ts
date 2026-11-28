// What the agent does after a model call fails: try the same model with the provider's next
// API key, move to the next fallback route, or surface the error.

/**
 * - `key`: this key is out of quota, rate limited, unpaid or rejected (401, 402, 429); another key
 *   of the same provider may still work.
 * - `provider`: the provider cannot serve this request now (408, 5xx, a free tier's prompt cap);
 *   another key will not help, another provider may.
 * - `request`: the request itself was rejected; retrying elsewhere hides a bug.
 */
export type ModelErrorKind = 'key' | 'provider' | 'request'

export type FailoverStep = 'next-key' | 'next-route' | 'throw'

const KEY_STATUSES = new Set([401, 402, 429])
const KEY_MESSAGE = /\b(401|402|429)\b|too many requests|rate.?limit|quota|unauthori[sz]ed|invalid api key|insufficient (credit|balance)/i
const PROVIDER_MESSAGE = /\b(408|5\d\d)\b|overloaded|unavailable|timeout|timed out|ECONNRESET|ETIMEDOUT/i

export function classifyModelError(error: unknown): ModelErrorKind {
  const { status, code } = (error ?? {}) as { status?: unknown; code?: unknown }
  const msg = error instanceof Error ? error.message : String(error)
  // Runcrate's free tier caps the prompt size (413): another provider can still take it.
  if (code === 'free_prompt_too_large' || msg.includes('free_prompt_too_large')) return 'provider'
  if (typeof status === 'number') {
    if (KEY_STATUSES.has(status)) return 'key'
    if (status === 408 || status >= 500) return 'provider'
    return 'request'
  }
  if (KEY_MESSAGE.test(msg)) return 'key'
  if (PROVIDER_MESSAGE.test(msg)) return 'provider'
  return 'request'
}

/**
 * Key errors try the provider's next key before the next route. A request error on the route the
 * run started from is thrown; on a fallback route it only moves on, as before.
 */
export function nextFailoverStep(
  kind: ModelErrorKind,
  position: { keyIndex: number; keyCount: number; isStartRoute: boolean },
): FailoverStep {
  if (kind === 'key' && position.keyIndex + 1 < position.keyCount) return 'next-key'
  if (kind === 'request' && position.isStartRoute) return 'throw'
  return 'next-route'
}

/** `runcrate:openai/gpt-oss-120b` for key 1, `runcrate#2:openai/gpt-oss-120b` for key 2. */
export function routeFailureLabel(provider: string, model: string, keyIndex: number): string {
  return `${provider}${keyIndex > 0 ? `#${keyIndex + 1}` : ''}:${model}`
}
