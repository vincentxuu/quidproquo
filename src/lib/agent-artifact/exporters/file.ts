import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

export interface ExporterFileSystem {
  write(path: string, body: string): Promise<void>
}

const FILE_OPTIONS_SCHEMA = {
  type: 'object',
  properties: { path: { type: 'string' } },
  required: ['path'],
} as const

/**
 * Local file exporter. No Workers FS → throws `ArtifactExporterDenied`; tests inject an in-memory
 * map via the `fs` parameter.
 */
export function createFileExporter(fs?: ExporterFileSystem): Exporter {
  return {
    destination: 'file',
    supportsKinds: ['markdown_report', 'evidence_bundle'],
    requiresApproval: false,
    optionsSchema: FILE_OPTIONS_SCHEMA,
    async export(ctx: ExportContext): Promise<ExportResult> {
      if (!fs) {
        throw new ArtifactExporterDenied('file exporter requires a local filesystem; unavailable in Workers')
      }
      const path = ctx.options.path as string
      await fs.write(path, ctx.body)
      return { destination: 'file', externalRef: path, exportedAt: nowMs() }
    },
  }
}

/** Default fs-less file exporter — throws `ArtifactExporterDenied` on use (production caveat). */
export const fileExporter: Exporter = createFileExporter()
