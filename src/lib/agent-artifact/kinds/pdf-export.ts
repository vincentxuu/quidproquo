import type { ArtifactKindDefinition, ExtractedSection } from '../registry/types'
import { stableStringify } from './stable-json'

interface PdfBlock {
  type?: 'heading' | 'paragraph'
  text?: string
}

interface PdfPayload {
  title?: string
  blocks?: PdfBlock[]
}

/**
 * The version body is the canonical JSON document model (text — fits the string-based versioning
 * + diff path). Binary PDF bytes are produced at export time by an injected generator (Phase 7
 * exporter), not at version-create time.
 */
function serializer(payload: PdfPayload): string {
  return stableStringify(payload)
}

function sectionExtractor(payload: PdfPayload): ExtractedSection[] {
  if (!Array.isArray(payload.blocks)) return []
  return payload.blocks.map((block, index) => ({
    sectionKey: `block.${index}`,
    bodyText: block.text ?? '',
  }))
}

export const pdfExportKind: ArtifactKindDefinition = {
  kind: 'pdf_export',
  version: 1,
  contentType: 'application/pdf',
  binary: true,
  payloadSchema: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
      blocks: { type: 'array' },
    },
  },
  serializer,
  sectionExtractor,
}
