import type { ArtifactKindDefinition, ExtractedSection } from '../registry/types'
import { stableStringify } from './stable-json'

interface EvidenceClaim {
  claim_id: number
  claim_text: string
  confidence?: number
}

interface EvidencePayload {
  claims?: EvidenceClaim[]
  [key: string]: unknown
}

function serializer(payload: unknown): string {
  return stableStringify(payload)
}

function sectionExtractor(payload: unknown): ExtractedSection[] {
  const p = payload as EvidencePayload
  return (p.claims ?? []).map((c, i) => ({
    sectionKey: `claim.${i}`,
    bodyText: c.claim_text,
    claimIds: [c.claim_id],
  }))
}

export const evidenceBundleKind: ArtifactKindDefinition = {
  kind: 'evidence_bundle',
  version: 1,
  contentType: 'application/json',
  serializer,
  sectionExtractor,
}
