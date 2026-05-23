import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { BinaryGenerator } from './pdf'
import type { Exporter, ExportContext, ExportResult } from './types'

const PPTX_OPTIONS_SCHEMA = {
  type: 'object',
  properties: { filename: { type: 'string' } },
} as const

/**
 * Produces PPTX bytes from the deck model via an injected generator. Real Workers-compatible PPTX
 * generation is deferred; the seam lets a generator be wired without changing the registry contract.
 */
export function createPptxExporter(enabled: boolean, generator?: BinaryGenerator): Exporter {
  return {
    destination: 'pptx',
    supportsKinds: ['pptx_export'],
    requiresApproval: false,
    optionsSchema: PPTX_OPTIONS_SCHEMA,
    async export(ctx: ExportContext): Promise<ExportResult> {
      if (!enabled) throw new ArtifactExporterDenied('flag_off')
      if (!generator) throw new ArtifactExporterDenied('pptx generator not configured')
      const bytes = await generator(JSON.parse(ctx.body))
      return { destination: 'pptx', externalRef: `${bytes.byteLength} bytes`, exportedAt: nowMs() }
    },
  }
}
