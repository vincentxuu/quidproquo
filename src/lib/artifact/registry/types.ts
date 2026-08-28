export interface ExtractedSection {
  sectionKey: string
  bodyText: string
  heading?: string
  claimIds?: number[]
  sourceIds?: number[]
}

export interface ArtifactKindDefinition {
  kind: string
  version: number
  contentType: string
  payloadSchema?: Record<string, unknown>
  serializer(payload: unknown): string
  sectionExtractor?(payload: unknown): ExtractedSection[]
  validate?(payload: unknown): void
  /** Binary kinds set this true — they opt out of text diff and section-based regeneration. */
  binary?: boolean
}
