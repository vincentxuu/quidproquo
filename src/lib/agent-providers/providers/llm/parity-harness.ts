export interface ParityResult {
  legacyResponse: unknown
  newResponse: unknown
  shapesMatch: boolean
  costRecorded: boolean
}

export async function runLlmParityTest(_providerId: string, _input: unknown): Promise<ParityResult> {
  // Phase 2 stub — real parity test wired in Phase 2.3 after kernel integration
  return { legacyResponse: null, newResponse: null, shapesMatch: true, costRecorded: false }
}
