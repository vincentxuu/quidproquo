// Pure helpers the search page API uses to decide (a) whether the keyword
// source must be re-run without its tight budget and (b) what to tell the
// client, so an all-sources-timed-out response is never mistaken for "no
// results" (the 2026-09-19 `/search/?q=rag` incident).

export type DegradationReason = 'timeout' | 'error' | 'partial'

export interface DegradationSourceRun {
  id: string
  enabled: boolean
  visible: boolean
  shadow: boolean
  resultCount: number
  timeout?: boolean
  error?: string
  /** The source answered, but dropped a stage (e.g. vector search) to stay inside its budget. */
  partial?: boolean
}

export interface DegradedSource {
  id: string
  reason: DegradationReason
}

export interface SearchDegradation {
  degraded: boolean
  sources: DegradedSource[]
}

function isUserFacing(run: DegradationSourceRun): boolean {
  return run.enabled && run.visible && !run.shadow
}

function reasonFor(run: DegradationSourceRun): DegradationReason | null {
  if (run.timeout) return 'timeout'
  if (run.error) return 'error'
  if (run.partial) return 'partial'
  return null
}

export function assessSearchDegradation(runs: DegradationSourceRun[]): SearchDegradation {
  const sources: DegradedSource[] = []
  for (const run of runs) {
    if (!isUserFacing(run)) continue
    const reason = reasonFor(run)
    if (reason) sources.push({ id: run.id, reason })
  }
  return { degraded: sources.length > 0, sources }
}

/**
 * True when nothing user-facing produced results and the keyword source
 * either never ran or failed — the one case where a slower retry can still
 * rescue the response.
 */
export function needsKeywordFallback(runs: DegradationSourceRun[], keywordSourceId = 'd1Keyword'): boolean {
  if (runs.some(run => isUserFacing(run) && run.resultCount > 0)) return false
  const keywordRun = runs.find(run => run.id === keywordSourceId)
  if (!keywordRun) return true
  return Boolean(keywordRun.timeout || keywordRun.error)
}
