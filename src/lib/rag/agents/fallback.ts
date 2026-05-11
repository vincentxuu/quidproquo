import type { GraphState } from '../state'

const WARNING = '⚠️ 此回答可能不完整'

export async function fallbackNode(state: GraphState): Promise<Partial<GraphState>> {
  const draft = state.draft.trim()
  const warning = `${WARNING}。這個版本未通過系統的格式或品質檢查。`
  const finalResponse = draft.startsWith(WARNING) || draft.length === 0
    ? (draft || warning)
    : `${warning}\n\n${draft}`

  return {
    final_response: finalResponse,
    critique: {
      confidence: Math.min(state.critique.confidence, 0.3),
      answer_relevance: Math.min(state.critique.answer_relevance, 0.5),
      intent_alignment: Math.min(state.critique.intent_alignment, 0.5),
      drift_detected: state.critique.drift_detected,
      ungrounded_claims: state.critique.ungrounded_claims,
      gaps: state.critique.gaps.length > 0 ? state.critique.gaps : state.validation.errors,
    },
  }
}
