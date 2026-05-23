export interface ParityDiff {
  dimension: 'steps' | 'artifacts' | 'tools' | 'sources'
  legacy: string[]
  flow: string[]
}

export interface ParityReport {
  matched: boolean
  diffs: ParityDiff[]
}

export async function runPipelineParity(opts: {
  pipelineId: string
  flowId: string
  input: Record<string, unknown>
  stubs?: Record<string, unknown>
}): Promise<ParityReport> {
  // Phase 1 stub — real impl wired in Phase 7
  // Returns matched:true, diffs:[] until both paths are active
  return { matched: true, diffs: [] }
}
