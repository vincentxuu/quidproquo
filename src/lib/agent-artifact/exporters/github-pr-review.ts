import { nowMs } from '../../utils/dates'
import { ArtifactExporterDenied } from '../errors'
import type { Exporter, ExportContext, ExportResult } from './types'

const GITHUB_PR_REVIEW_OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    owner: { type: 'string' },
    repo: { type: 'string' },
    pullNumber: { type: 'number' },
    event: { type: 'string' }, // 'COMMENT' | 'APPROVE' | 'REQUEST_CHANGES'
  },
  required: ['owner', 'repo', 'pullNumber'],
} as const

export const githubPrReviewExporter: Exporter = {
  destination: 'github_pr_review',
  supportsKinds: ['markdown_report'],
  requiresApproval: true,
  optionsSchema: GITHUB_PR_REVIEW_OPTIONS_SCHEMA,

  async export(ctx: ExportContext): Promise<ExportResult> {
    const options = ctx.options as { owner?: string; repo?: string; pullNumber?: number; event?: string }
    if (!options.owner || !options.repo || !options.pullNumber) {
      throw new ArtifactExporterDenied('github_pr_review: owner, repo, and pullNumber required')
    }

    // Stub: real call would be ctx.kernel.providers.action('github').createPrReview(...)
    return {
      destination: 'github_pr_review',
      externalRef: `https://github.com/${options.owner}/${options.repo}/pull/${options.pullNumber}`,
      exportedAt: nowMs(),
    }
  },
}
