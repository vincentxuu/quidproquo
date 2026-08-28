export class EvidenceNotImplemented extends Error {
  constructor(method: string) {
    super(`EvidenceNotImplemented: ${method}`)
    this.name = 'EvidenceNotImplemented'
  }
}

export class EvidenceSourceUnknown extends Error {
  constructor(sourceId: number) {
    super(`EvidenceSourceUnknown: source ${sourceId} not found`)
    this.name = 'EvidenceSourceUnknown'
  }
}

export class EvidenceClaimUnknown extends Error {
  constructor(claimId: number) {
    super(`EvidenceClaimUnknown: claim ${claimId} not found`)
    this.name = 'EvidenceClaimUnknown'
  }
}

export class EvidencePolicyViolation extends Error {
  readonly gaps: string[]
  constructor(gaps: string[]) {
    super(`EvidencePolicyViolation: ${gaps.join('; ')}`)
    this.name = 'EvidencePolicyViolation'
    this.gaps = gaps
  }
}

export class EvidenceConflictUnresolved extends Error {
  constructor(conflictId: number) {
    super(`EvidenceConflictUnresolved: conflict ${conflictId} is still pending`)
    this.name = 'EvidenceConflictUnresolved'
  }
}

export class EvidenceBlobTooLarge extends Error {
  constructor(bytes: number) {
    super(`EvidenceBlobTooLarge: body is ${bytes} bytes, enable AGENT_EVIDENCE_R2_BLOBS to offload`)
    this.name = 'EvidenceBlobTooLarge'
  }
}

export class EvidenceFlagDisabled extends Error {
  constructor() {
    super('EvidenceFlagDisabled: AGENT_EVIDENCE_ENABLED is false')
    this.name = 'EvidenceFlagDisabled'
  }
}

export class EvidenceBlobBackendMissing extends Error {
  constructor() {
    super('EvidenceBlobBackendMissing: AGENT_EVIDENCE_R2_BLOBS=true but no R2_AGENT_MEMORY binding provided')
    this.name = 'EvidenceBlobBackendMissing'
  }
}
