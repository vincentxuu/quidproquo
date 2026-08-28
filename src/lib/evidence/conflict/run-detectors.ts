import { detectNumericContradiction } from './rules/numeric'
import { detectNegationContradiction } from './rules/negation'
import type { Flags } from '../../config/flags'

export interface ClaimPair {
  claimAText: string
  claimBText: string
}

export interface DetectorResult {
  contradicts: boolean
  detectedBy: string
  delta?: number
}

// Stub NLI detector — returns no-contradiction always
// Real impl wired when a Workers AI NLI model is available
function detectNliContradiction(_a: string, _b: string): DetectorResult {
  return { contradicts: false, detectedBy: 'rule:nli' }
}

export function runDetectors(pair: ClaimPair, flags?: Flags): DetectorResult[] {
  const results: DetectorResult[] = []

  const numeric = detectNumericContradiction(pair.claimAText, pair.claimBText)
  if (numeric.contradicts) {
    results.push({ contradicts: true, detectedBy: 'rule:numeric', delta: numeric.delta })
  }

  const negation = detectNegationContradiction(pair.claimAText, pair.claimBText)
  if (negation.contradicts) {
    results.push({ contradicts: true, detectedBy: 'rule:negation' })
  }

  // NLI: only run when flag is on
  if ((flags?.agentEvidence as { nliConflict?: boolean } | undefined)?.nliConflict) {
    const nli = detectNliContradiction(pair.claimAText, pair.claimBText)
    if (nli.contradicts) results.push(nli)
  }

  return results
}
