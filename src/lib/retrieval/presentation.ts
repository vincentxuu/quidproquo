import { hasCriticFailure, hasValidationFailure } from './agents/critic-routing'
import type { GraphState } from './state'

export function shouldExposeRetrievedLinks(state: Pick<GraphState, 'critique' | 'validation' | 'search_results'>): boolean {
  return (
    state.search_results.length > 0 &&
    !hasValidationFailure(state.validation) &&
    !hasCriticFailure(state.critique)
  )
}
