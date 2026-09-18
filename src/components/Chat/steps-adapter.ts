import type { AgentStep } from './AgentSteps'
import type { Step } from './types'

/**
 * 把新版 SSE 步驟事件（step_start / step_complete / tool_call / agent_step
 * 混在一起送）轉成舊版 AgentSteps pills 要的形狀。
 *
 * 後端同一個階段會送多個事件（例如 Planner 同時有 step_start「規劃檢索策略」
 * 和 agent_step「分析問題」），這裡按 label 去重、保留首次出現順序、狀態取
 * 最後一次（complete 蓋掉 active），pills 才不會出現重複項目。
 */
export function toAgentSteps(steps: Step[] | undefined): AgentStep[] {
  if (!steps || steps.length === 0) return []

  const merged = new Map<string, AgentStep>()
  for (const step of steps) {
    const label = step.label || '處理中'
    const status = step.status === 'complete' ? 'completed' : 'started'
    const sourcesFound = step.results && step.results.length > 0 ? step.results.length : undefined

    const existing = merged.get(label)
    if (existing) {
      existing.status = status
      if (sourcesFound !== undefined) existing.sources_found = sourcesFound
    } else {
      merged.set(label, {
        agent: label,
        status,
        ...(sourcesFound !== undefined ? { sources_found: sourcesFound } : {}),
      })
    }
  }
  return [...merged.values()]
}
