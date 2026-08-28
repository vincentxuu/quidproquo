import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

const SLACK_OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    channel: { type: 'string' },
    message: { type: 'string' },
    threadTs: { type: 'string' },
  },
  required: ['channel'],
} as const

export const slackExporter: Exporter = {
  destination: 'slack',
  supportsKinds: ['markdown_report', 'evidence_bundle'],
  requiresApproval: true,
  optionsSchema: SLACK_OPTIONS_SCHEMA,

  async export(ctx: ExportContext): Promise<ExportResult> {
    const options = ctx.options as { channel?: string; message?: string; threadTs?: string }
    if (!options.channel) {
      throw new ArtifactExporterDenied('slack: channel required')
    }

    // Stub: real call would be ctx.kernel.providers.action('slack').sendMessage(...)
    return {
      destination: 'slack',
      externalRef: `https://slack.com/channel/${options.channel}`,
      exportedAt: nowMs(),
    }
  },
}
