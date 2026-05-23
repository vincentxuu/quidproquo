import type { ArtifactKindDefinition, ExtractedSection } from '../registry/types'

interface MarkdownSection {
  heading: string
  body_markdown: string
  claim_ids?: number[]
}

interface MarkdownPayload {
  title: string
  body_markdown?: string
  sections?: MarkdownSection[]
  metadata?: Record<string, unknown>
}

function serializer(payload: unknown): string {
  const p = payload as MarkdownPayload
  const metaLines: string[] = [`title: ${p.title}`]
  if (p.metadata) {
    for (const [k, v] of Object.entries(p.metadata)) {
      metaLines.push(`${k}: ${v}`)
    }
  }
  const front = `---\n${metaLines.join('\n')}\n---\n\n`
  if (p.sections?.length) {
    return front + p.sections.map((s) => `## ${s.heading}\n\n${s.body_markdown}`).join('\n\n')
  }
  return front + (p.body_markdown ?? '')
}

function sectionExtractor(payload: unknown): ExtractedSection[] {
  const p = payload as MarkdownPayload
  if (p.sections?.length) {
    return p.sections.map((s, i) => ({
      sectionKey: `section.${i}`,
      bodyText: s.body_markdown,
      heading: s.heading,
      claimIds: s.claim_ids,
    }))
  }
  return [{ sectionKey: 'body', bodyText: p.body_markdown ?? '' }]
}

function validate(payload: unknown): void {
  const p = payload as Record<string, unknown>
  if (typeof p.title !== 'string') throw new Error('markdown_report: title required')
}

export const markdownReportKind: ArtifactKindDefinition = {
  kind: 'markdown_report',
  version: 1,
  contentType: 'text/markdown',
  serializer,
  sectionExtractor,
  validate,
}
