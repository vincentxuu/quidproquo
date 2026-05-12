import type { GuardResult, PipelineDefinition } from '../types'

export function validatePipelineInput(definition: PipelineDefinition, input: Record<string, unknown>): GuardResult[] {
  const results: GuardResult[] = []

  for (const field of definition.inputs) {
    const value = input[field.id]
    if (field.required && (value === undefined || value === null || value === '')) {
      results.push({ id: `input:${field.id}`, status: 'fail', message: `${field.label} is required` })
      continue
    }
    results.push({ id: `input:${field.id}`, status: 'pass' })
  }

  if (definition.inputs.some((field) => field.id === 'slug')) {
    const slug = String(input.slug ?? '')
    const allowed = slug === '' || (!slug.startsWith('/') && !slug.endsWith('.md') && !slug.includes('..'))
    results.push({
      id: 'input:post_slug',
      status: allowed ? 'pass' : 'fail',
      message: allowed ? undefined : 'slug must be a cloud post slug such as ai/2026-05-10-example',
    })
  }

  return results
}
