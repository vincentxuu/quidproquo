import { getToolDefinition } from '../tool-registry'
import type { GuardResult, PipelineDefinition } from '../types'

export function validateOutputSafety(definition: PipelineDefinition): GuardResult[] {
  const results: GuardResult[] = []

  const markdownWritingTools = definition.tools
    .map((toolId) => getToolDefinition(toolId))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool?.writesMarkdown))

  if (!definition.writesMarkdown && markdownWritingTools.length > 0) {
    results.push({
      id: 'output:no_markdown_write',
      status: 'fail',
      message: 'Pipeline declares writesMarkdown=false but allows markdown-writing tools.',
    })
  } else {
    results.push({ id: 'output:no_markdown_write', status: 'pass' })
  }

  for (const tool of markdownWritingTools) {
    results.push({
      id: `output:no_silent_overwrite:${tool.id}`,
      status: tool.overwritesExisting ? 'fail' : 'pass',
      message: tool.overwritesExisting ? `Tool ${tool.id} may overwrite existing markdown` : undefined,
    })
  }

  return results
}
