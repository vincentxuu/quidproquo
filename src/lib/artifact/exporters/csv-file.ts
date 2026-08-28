import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { ExporterFileSystem } from './file'
import type { Exporter, ExportContext, ExportResult } from './types'

const CSV_FILE_OPTIONS_SCHEMA = {
  type: 'object',
  properties: { path: { type: 'string' } },
  required: ['path'],
} as const

/**
 * Local CSV file exporter. Distinct from the generic `file` exporter so the registry rejects
 * incompatible kind+destination pairs cleanly (this one only accepts `csv_spreadsheet`). No FS
 * (production / Workers) → throws `ArtifactExporterDenied`; tests pass an in-memory map.
 */
export function createCsvFileExporter(fs?: ExporterFileSystem): Exporter {
  return {
    destination: 'csv_file',
    supportsKinds: ['csv_spreadsheet'],
    requiresApproval: false,
    optionsSchema: CSV_FILE_OPTIONS_SCHEMA,
    async export(ctx: ExportContext): Promise<ExportResult> {
      if (!fs) {
        throw new ArtifactExporterDenied('csv_file exporter requires a local filesystem; unavailable in Workers')
      }
      const path = ctx.options.path as string
      await fs.write(path, ctx.body)
      return { destination: 'csv_file', externalRef: path, exportedAt: nowMs() }
    },
  }
}

/** Default fs-less csv file exporter — throws `ArtifactExporterDenied` on use (production caveat). */
export const csvFileExporter: Exporter = createCsvFileExporter()
