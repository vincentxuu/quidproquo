import type { GuardResult, PipelineDefinition, ToolDefinition } from './types'

export const toolDefinitions: ToolDefinition[] = [
  {
    id: 'read_post_content',
    title: 'Read post content',
    kind: 'cloud_read',
    runtime: 'worker',
    description: 'Read post content from D1/R2 or build-time content manifest.',
  },
  {
    id: 'write_draft_artifact',
    title: 'Write draft artifact',
    kind: 'cloud_write',
    runtime: 'worker',
    description: 'Create a draft artifact without overwriting published Markdown.',
    writesMarkdown: true,
  },
  {
    id: 'write_artifact',
    title: 'Write artifact',
    kind: 'artifact',
    runtime: 'worker',
    description: 'Write job artifacts to D1 or an artifact directory.',
  },
  {
    id: 'run_content_ops',
    title: 'Run content ops',
    kind: 'module',
    runtime: 'worker',
    description: 'Run Worker-safe content ops analysis from cloud-readable post content.',
  },
  {
    id: 'run_post_quality_check',
    title: 'Run post quality check',
    kind: 'module',
    runtime: 'worker',
    description: 'Run Worker-safe post quality checks for one post or the full corpus.',
  },
  {
    id: 'read_glossary_stats',
    title: 'Read glossary lookup stats',
    kind: 'cloud_read',
    runtime: 'worker',
    description: 'Read glossary_lookup_stats for term frequency and context signals.',
  },
  {
    id: 'run_reference_check',
    title: 'Run reference check',
    kind: 'module',
    runtime: 'worker',
    description: 'Run Worker-safe reference checks for one post or the full corpus.',
  },
  {
    id: 'run_embed_sync',
    title: 'Run embed sync',
    kind: 'api',
    runtime: 'worker',
    description: 'Run one embedding sync batch in the Worker runtime.',
  },
  {
    id: 'run_crawl_sync',
    title: 'Run crawl sync',
    kind: 'api',
    runtime: 'worker',
    description: 'Trigger or hand off crawl sync work.',
    requiresExternalAccess: true,
  },
  {
    id: 'rag_search_posts',
    title: 'RAG search posts',
    kind: 'api',
    runtime: 'worker',
    description: 'Search related posts through the internal RAG/search tools.',
  },
]

export function listTools(): ToolDefinition[] {
  return toolDefinitions
}

export function getToolDefinition(id: string): ToolDefinition | undefined {
  return toolDefinitions.find((tool) => tool.id === id)
}

export function validateToolAllowlist(definition: PipelineDefinition): GuardResult[] {
  const results: GuardResult[] = []
  const allowed = new Set(definition.tools)

  for (const toolId of definition.tools) {
    const tool = getToolDefinition(toolId)
    results.push({
      id: `tool:registered:${toolId}`,
      status: tool ? 'pass' : 'fail',
      message: tool ? undefined : `Tool ${toolId} is not registered`,
    })
  }

  for (const stage of definition.stages) {
    if (!stage.tool) continue
    const tool = getToolDefinition(stage.tool)
    const allowedForStage = allowed.has(stage.tool)
    const runtimeOk = !tool || tool.runtime === 'both' || tool.runtime === definition.runtime
    results.push({
      id: `tool:allowlist:${stage.id}`,
      status: tool && allowedForStage && runtimeOk ? 'pass' : 'fail',
      message: getToolGuardMessage(stage.tool, Boolean(tool), allowedForStage, runtimeOk),
    })
  }

  return results
}

function getToolGuardMessage(toolId: string, registered: boolean, allowed: boolean, runtimeOk: boolean): string | undefined {
  if (!registered) return `Tool ${toolId} is not registered`
  if (!allowed) return `Tool ${toolId} is not allowed for this pipeline`
  if (!runtimeOk) return `Tool ${toolId} cannot run in this pipeline runtime`
  return undefined
}
