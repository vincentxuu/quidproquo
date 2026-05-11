import type { Critique, GraphState, ValidationResult } from '../state'

export const MAX_DRAFT_ATTEMPTS = 3

export function hasCriticFailure(critique: Critique): boolean {
  return (
    critique.confidence < 0.6 ||
    critique.answer_relevance < 0.75 ||
    critique.intent_alignment < 0.75 ||
    critique.drift_detected ||
    critique.ungrounded_claims.length > 0
  )
}

export function hasValidationFailure(validation: ValidationResult): boolean {
  return !validation.passed
}

export function shouldRetry(state: Pick<GraphState, 'iteration' | 'critique' | 'validation'>): boolean {
  const failed = hasValidationFailure(state.validation) || hasCriticFailure(state.critique)
  return failed && state.iteration < MAX_DRAFT_ATTEMPTS
}

export function shouldDegrade(state: Pick<GraphState, 'iteration' | 'critique' | 'validation'>): boolean {
  const failed = hasValidationFailure(state.validation) || hasCriticFailure(state.critique)
  return failed && state.iteration >= MAX_DRAFT_ATTEMPTS
}
