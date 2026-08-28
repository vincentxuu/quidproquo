import type { ArtifactRegistry } from '../registry'
import { csvSpreadsheetKind } from './csv-spreadsheet'
import { evidenceBundleKind } from './evidence-bundle'
import { markdownReportKind } from './markdown-report'
import { pdfExportKind } from './pdf-export'
import { pptxExportKind } from './pptx-export'

export function registerDefaultKinds(registry: ArtifactRegistry): void {
  registry.defineArtifact(markdownReportKind)
  registry.defineArtifact(evidenceBundleKind)
  registry.defineArtifact(csvSpreadsheetKind)
  registry.defineArtifact(pdfExportKind)
  registry.defineArtifact(pptxExportKind)
}
