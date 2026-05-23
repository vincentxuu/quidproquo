import type { ArtifactKindDefinition, ExtractedSection } from '../registry/types'
import { stableStringify } from './stable-json'

interface PptxSlide {
  title?: string
  bullets?: string[]
}

interface PptxPayload {
  title?: string
  slides?: PptxSlide[]
}

/**
 * The version body is the canonical JSON deck model (text). Binary PPTX bytes are produced at
 * export time by an injected generator, not at version-create time.
 */
function serializer(payload: PptxPayload): string {
  return stableStringify(payload)
}

function sectionExtractor(payload: PptxPayload): ExtractedSection[] {
  if (!Array.isArray(payload.slides)) return []
  return payload.slides.map((slide, index) => {
    const extracted: ExtractedSection = {
      sectionKey: `slide.${index}`,
      bodyText: (slide.bullets ?? []).join('\n'),
    }
    if (slide.title !== undefined) extracted.heading = slide.title
    return extracted
  })
}

export const pptxExportKind: ArtifactKindDefinition = {
  kind: 'pptx_export',
  version: 1,
  contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  binary: true,
  payloadSchema: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string' },
      slides: { type: 'array' },
    },
  },
  serializer,
  sectionExtractor,
}
