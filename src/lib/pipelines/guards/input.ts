import type { GuardResult, PipelineDefinition } from '../types'
import { normalizeSlug } from '../modules/content-posts'

const FILE_PATH_STYLE_FIELDS = new Set(['slug', 'path', 'sourcePath'])
const POST_SLUG_PATTERN = /^[a-z0-9-]+\/\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/

function isValidCloudSlug(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const normalized = normalizeSlug(value)
  if (!normalized) return false
  if (normalized.includes('..') || normalized.startsWith('/') || normalized.endsWith('/')) return false
  return POST_SLUG_PATTERN.test(normalized)
}

export function validatePipelineInput(definition: PipelineDefinition, input: Record<string, unknown>): GuardResult[] {
  const results: GuardResult[] = []

  for (const field of definition.inputs) {
    const value = input[field.id]
    if (field.required && (value === undefined || value === null || value === '')) {
      results.push({ id: `input:${field.id}`, status: 'fail', message: `${field.label} is required` })
      continue
    }

    if (value !== undefined && value !== null && value !== '') {
      if (field.type === 'number' && !Number.isInteger(Number(value))) {
        results.push({
          id: `input:${field.id}`,
          status: 'fail',
          message: `${field.label} must be a number`,
        })
        continue
      }

      if (field.type === 'boolean' && typeof value !== 'boolean') {
        results.push({
          id: `input:${field.id}`,
          status: 'fail',
          message: `${field.label} must be true or false`,
        })
        continue
      }
    }

    results.push({ id: `input:${field.id}`, status: 'pass' })
  }

  for (const field of definition.inputs.filter((item) => FILE_PATH_STYLE_FIELDS.has(item.id))) {
    const value = input[field.id]
    if (value === undefined || value === null || value === '') continue
    const normalized = normalizeSlug(value)
    const isFilePath = typeof value === 'string' && (value.includes('src/content/posts/') || value.endsWith('.md'))
    const valid = isValidCloudSlug(value) || isFilePath
    const isDeprecatedPath = isFilePath

    results.push({
      id: `input:${field.id}`,
      status: valid ? 'pass' : 'fail',
      message: valid
        ? isDeprecatedPath
          ? 'Deprecated path format; recommend AI-friendly slug format "category/YYYY-MM-DD-slug"'
          : undefined
        : 'Cloud post slug must be "category/2026-05-10-slug" format',
    })
  }

  return results
}
