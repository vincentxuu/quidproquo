import { csvFileExporter } from './csv-file'
import { emailExporter } from './email'
import { fileExporter } from './file'
import { githubIssueExporter } from './github-issue'
import { githubPrReviewExporter } from './github-pr-review'
import { notionExporter } from './notion'
import { createPdfExporter } from './pdf'
import { createPptxExporter } from './pptx'
import type { ExporterRegistry } from './registry'
import { slackExporter } from './slack'
import type { Flags } from '../../config/flags'

export function registerDefaultExporters(registry: ExporterRegistry, flags?: Flags['agentArtifact']): void {
  registry.register(fileExporter)
  if (flags?.csv) registry.register(csvFileExporter)
  if (flags?.pdf) registry.register(createPdfExporter(false))
  if (flags?.pptx) registry.register(createPptxExporter(false))
  if (flags?.notion) registry.register(notionExporter)
  if (flags?.githubIssue) registry.register(githubIssueExporter)
  if (flags?.email) registry.register(emailExporter)
  if (flags?.slack) registry.register(slackExporter)
  if (flags?.githubPr) registry.register(githubPrReviewExporter)
}
