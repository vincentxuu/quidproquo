import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

const EMAIL_OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    to: { type: 'array', items: { type: 'string' } },
    subject: { type: 'string' },
    cc: { type: 'array', items: { type: 'string' } },
  },
  required: ['to', 'subject'],
} as const

export const emailExporter: Exporter = {
  destination: 'email',
  supportsKinds: ['markdown_report'],
  requiresApproval: true, // irreversible — always requires approval
  optionsSchema: EMAIL_OPTIONS_SCHEMA,

  async export(ctx: ExportContext): Promise<ExportResult> {
    const options = ctx.options as { to?: string[]; subject?: string; cc?: string[] }
    if (!options.to?.length || !options.subject) {
      throw new ArtifactExporterDenied('email: to and subject required')
    }

    // Stub: real call would be ctx.kernel.providers.action('email').send(...)
    return {
      destination: 'email',
      externalRef: `mailto:${options.to[0]}?subject=${encodeURIComponent(options.subject)}`,
      exportedAt: nowMs(),
    }
  },
}
