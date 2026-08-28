import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

const NOTION_OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    parentPageId: { type: 'string' },
    title: { type: 'string' },
  },
  required: ['parentPageId'],
} as const

export const notionExporter: Exporter = {
  destination: 'notion',
  supportsKinds: ['markdown_report', 'evidence_bundle'],
  requiresApproval: true,
  optionsSchema: NOTION_OPTIONS_SCHEMA,

  async export(ctx: ExportContext): Promise<ExportResult> {
    const options = ctx.options as { parentPageId?: string; title?: string }
    if (!options.parentPageId) {
      throw new ArtifactExporterDenied('notion: parentPageId required')
    }

    // Stub: real call would be ctx.kernel.providers.knowledge('notion').createPage(...)
    return {
      destination: 'notion',
      externalRef: `https://notion.so/stub-page-id`,
      exportedAt: nowMs(),
    }
  },
}
