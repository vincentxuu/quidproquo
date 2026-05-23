import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

const GITHUB_ISSUE_OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    owner: { type: 'string' },
    repo: { type: 'string' },
    labels: { type: 'array', items: { type: 'string' } },
  },
  required: ['owner', 'repo'],
} as const

export const githubIssueExporter: Exporter = {
  destination: 'github_issue',
  supportsKinds: ['markdown_report'],
  requiresApproval: true,
  optionsSchema: GITHUB_ISSUE_OPTIONS_SCHEMA,

  async export(ctx: ExportContext): Promise<ExportResult> {
    const options = ctx.options as { owner?: string; repo?: string; labels?: string[] }
    if (!options.owner || !options.repo) {
      throw new ArtifactExporterDenied('github_issue: owner and repo required')
    }

    // Stub: real call would be ctx.kernel.providers.action('github').createIssue(...)
    return {
      destination: 'github_issue',
      externalRef: `https://github.com/${options.owner}/${options.repo}/issues/stub`,
      exportedAt: nowMs(),
    }
  },
}
