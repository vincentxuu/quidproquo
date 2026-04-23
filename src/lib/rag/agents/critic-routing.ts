import type { Critique } from '../state'

export function shouldRetry(critique: Critique, iteration: number): boolean {
  return iteration < 2 && (critique.confidence < 0.6 || critique.ungrounded_claims.length > 0)
}
