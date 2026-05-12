import type { PipelineDefinition } from './types'

export const pipelineDefinitions: PipelineDefinition[] = [
  {
    id: 'content-ops',
    title: 'Content Ops Agent',
    description: 'Generate or review the content operations report.',
    category: 'ops',
    risk: 'low',
    runtime: 'worker',
    inputs: [],
    tools: ['run_content_ops', 'write_artifact'],
    stages: [
      { id: 'run-content-ops', title: 'Run content ops report', kind: 'module', tool: 'run_content_ops' },
      { id: 'write-report-artifact', title: 'Write report artifact', kind: 'module', tool: 'write_artifact' },
    ],
    artifacts: [{ id: 'content-ops-report', type: 'json_report', title: 'Content ops report' }],
    guards: ['admin_required', 'tool_allowlist', 'budget_limit'],
    budget: { maxRetries: 1, maxRuntimeMs: 120_000 },
    requiresAdmin: true,
    writesMarkdown: false,
    usesExternalResearch: false,
  },
  {
    id: 'post-quality',
    title: 'Quality Agent',
    description: 'Run deterministic post quality and reference checks for a markdown post or directory.',
    category: 'production',
    risk: 'low',
    runtime: 'worker',
    inputs: [
      {
        id: 'slug',
        label: 'Post slug',
        type: 'string',
        required: false,
        placeholder: 'ai/2026-05-10-example',
      },
    ],
    tools: ['read_post_content', 'run_post_quality_check', 'run_reference_check', 'write_artifact'],
    stages: [
      { id: 'quality-check', title: 'Run post quality check', kind: 'module', tool: 'run_post_quality_check' },
      { id: 'reference-check', title: 'Run reference check', kind: 'module', tool: 'run_reference_check' },
      { id: 'quality-report', title: 'Write quality report', kind: 'module', tool: 'write_artifact' },
    ],
    artifacts: [{ id: 'quality-report', type: 'json_report', title: 'Quality report' }],
    guards: ['admin_required', 'post_path', 'tool_allowlist', 'budget_limit'],
    budget: { maxRetries: 1, maxRuntimeMs: 120_000 },
    requiresAdmin: true,
    writesMarkdown: false,
    usesExternalResearch: false,
  },
  {
    id: 'embed-sync',
    title: 'Embedding Agent',
    description: 'Run one embed batch and record the result in the admin job timeline.',
    category: 'knowledge',
    risk: 'medium',
    runtime: 'worker',
    inputs: [
      { id: 'sources', label: 'Sources JSON', type: 'json', defaultValue: ['posts', 'docs'] },
      { id: 'offset', label: 'Offset', type: 'number', defaultValue: 0 },
      { id: 'limit', label: 'Limit', type: 'number', defaultValue: 50 },
    ],
    tools: ['run_embed_sync', 'write_artifact'],
    stages: [
      { id: 'embed-sync', title: 'Run embed batch', kind: 'api', tool: 'run_embed_sync' },
      { id: 'embed-report', title: 'Write embed result artifact', kind: 'api', tool: 'write_artifact' },
    ],
    artifacts: [{ id: 'embed-sync-result', type: 'json_report', title: 'Embed sync result' }],
    guards: ['admin_required', 'tool_allowlist', 'budget_limit'],
    budget: { maxRetries: 2, maxRuntimeMs: 600_000 },
    requiresAdmin: true,
    writesMarkdown: false,
    usesExternalResearch: false,
  },
  {
    id: 'crawl-sync',
    title: 'Crawl Agent',
    description: 'Track crawl sync as a harness job. Record crawl sync requests in the harness while execution stays on the Worker endpoint with CRAWL_SECRET validation.',
    category: 'knowledge',
    risk: 'medium',
    runtime: 'worker',
    inputs: [
      { id: 'full', label: 'Full crawl', type: 'boolean', defaultValue: false },
      { id: 'modifiedSince', label: 'Modified since', type: 'number' },
    ],
    tools: ['run_crawl_sync', 'write_artifact'],
    stages: [
      { id: 'crawl-sync', title: 'Create crawl sync job record', kind: 'api', tool: 'run_crawl_sync' },
      { id: 'crawl-report', title: 'Write crawl request artifact', kind: 'api', tool: 'write_artifact' },
    ],
    artifacts: [{ id: 'crawl-sync-record', type: 'json_report', title: 'Crawl sync job record' }],
    guards: ['admin_required', 'tool_allowlist', 'budget_limit'],
    budget: { maxRetries: 2, maxRuntimeMs: 600_000 },
    requiresAdmin: true,
    writesMarkdown: false,
    usesExternalResearch: true,
  },
  {
    id: 'translation',
    title: 'Translation Agent',
    description: 'Translate a zh-TW post to en draft. Creates draft markdown with lang: en.',
    category: 'production',
    risk: 'high',
    runtime: 'worker',
    inputs: [
      {
        id: 'sourcePath',
        label: 'Source post path',
        type: 'string',
        required: true,
        placeholder: 'src/content/posts/ai/2026-05-10-example.md',
      },
    ],
    tools: ['read_post_content', 'write_draft_artifact', 'run_post_quality_check', 'run_reference_check', 'write_artifact'],
    stages: [
      { id: 'read-source', title: 'Read source post', kind: 'module', tool: 'read_post_content' },
      { id: 'translate', title: 'Translate content', kind: 'llm' },
      { id: 'cultural-review', title: 'Cultural review', kind: 'llm' },
      { id: 'quality-check', title: 'Run quality check', kind: 'module', tool: 'run_post_quality_check' },
      { id: 'reference-check', title: 'Run reference check', kind: 'module', tool: 'run_reference_check' },
      { id: 'write-draft', title: 'Write draft artifact', kind: 'module', tool: 'write_draft_artifact' },
    ],
    artifacts: [
      { id: 'translation-draft', type: 'markdown_draft', title: 'English draft' },
      { id: 'translation-report', type: 'json_report', title: 'Translation report' },
    ],
    guards: ['admin_required', 'draft_only', 'reviewer_never_auto_fix', 'no_fabrication', 'tool_allowlist', 'budget_limit'],
    budget: { maxRetries: 1, maxRuntimeMs: 1_200_000 },
    requiresAdmin: true,
    writesMarkdown: true,
    usesExternalResearch: false,
  },
]

export function listPipelines(): PipelineDefinition[] {
  return pipelineDefinitions
}

export function getPipelineDefinition(id: string): PipelineDefinition | undefined {
  return pipelineDefinitions.find((pipeline) => pipeline.id === id)
}
