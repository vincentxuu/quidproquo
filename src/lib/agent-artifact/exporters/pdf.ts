import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

/**
 * Produces PDF bytes from the document model. Real Workers-compatible PDF generation is deferred
 * to a follow-up; the exporter is shipped behind its flag with this seam so a generator (lib or
 * external rendering service) can be wired without touching the registry contract.
 */
export type BinaryGenerator = (documentModel: unknown) => Promise<Uint8Array>

const PDF_OPTIONS_SCHEMA = {
  type: 'object',
  properties: { filename: { type: 'string' } },
} as const

export function createPdfExporter(enabled: boolean, generator?: BinaryGenerator): Exporter {
  return {
    destination: 'pdf',
    supportsKinds: ['pdf_export'],
    requiresApproval: false,
    optionsSchema: PDF_OPTIONS_SCHEMA,
    async export(ctx: ExportContext): Promise<ExportResult> {
      if (!enabled) throw new ArtifactExporterDenied('flag_off')
      if (!generator) throw new ArtifactExporterDenied('pdf generator not configured')
      const bytes = await generator(JSON.parse(ctx.body))
      return { destination: 'pdf', externalRef: `${bytes.byteLength} bytes`, exportedAt: nowMs() }
    },
  }
}
