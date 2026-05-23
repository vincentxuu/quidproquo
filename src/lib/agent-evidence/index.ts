import type { Flags } from '../config/flags'
import type { EvidenceBackends } from './storage/types'
import { EvidenceStore } from './store'
import { ClaimExtractor } from './extraction'
import { EvidenceVerifier } from './verification'
import { SourceReputation } from './reputation'
import { ConflictDetector } from './conflict'
import { attachEvidenceToKernel } from './listener'

export interface Evidence {
  store: EvidenceStore
  extraction: ClaimExtractor
  verification: EvidenceVerifier
  reputation: SourceReputation
  conflict: ConflictDetector
  backends: EvidenceBackends
  attachToKernel(kernel: unknown, flowRunId: string): void
}

const noopStore = new Proxy({} as EvidenceStore, {
  get: () => async () => undefined,
})
const noopExtraction = new Proxy({} as ClaimExtractor, {
  get: () => async () => ({ claimsInserted: 0, citationsInserted: 0, deduped: 0 }),
})
const noopVerification = new Proxy({} as EvidenceVerifier, {
  get: () => async () => ({ passed: true, checks: [], gaps: [] }),
})
const noopReputation = new Proxy({} as SourceReputation, {
  get: () => async () => 0.5,
})
const noopConflict = new Proxy({} as ConflictDetector, {
  get: () => async () => [],
})

export function createEvidence(flags: Flags, backends: EvidenceBackends): Evidence {
  if (!flags.agentEvidence.enabled) {
    return {
      store: noopStore,
      extraction: noopExtraction,
      verification: noopVerification,
      reputation: noopReputation,
      conflict: noopConflict,
      backends,
      attachToKernel: () => {},
    }
  }

  const store = new EvidenceStore(backends)
  const reputation = new SourceReputation(backends)
  const extraction = new ClaimExtractor(store, reputation, backends)
  const verification = new EvidenceVerifier(store, backends)
  const conflict = new ConflictDetector(store, backends)

  return {
    store,
    extraction,
    verification,
    reputation,
    conflict,
    backends,
    attachToKernel: (kernel: unknown, flowRunId: string) => {
      attachEvidenceToKernel(kernel, { store, extraction, verification, reputation, conflict, backends, attachToKernel: () => {} }, flowRunId)
    },
  }
}

export { EvidenceStore } from './store'
export { ClaimExtractor } from './extraction'
export { EvidenceVerifier } from './verification'
export { SourceReputation } from './reputation'
export { ConflictDetector } from './conflict'
export * from './errors'
export * from './storage/types'
