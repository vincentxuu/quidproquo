import { z } from 'zod'
import type { FlowDefinition } from './ast'

const FlowInputSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean().optional(),
  default: z.unknown().optional(),
})

const FlowStepSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
}).passthrough()

const FlowEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  condition: z.unknown().optional(),
})

const FlowArtifactSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
})

const FlowArtifactBindingSchema = z.object({
  stepId: z.string().min(1),
  artifactId: z.string().min(1),
  outputKey: z.string().optional(),
})

const FlowRetrySchema = z.object({
  maxAttempts: z.number().int().positive(),
  backoffMs: z.number().optional(),
})

const FlowDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.number().int().positive(),
  description: z.string().optional(),
  inputs: z.array(FlowInputSchema).default([]),
  steps: z.array(FlowStepSchema).min(1, 'Flow must have at least one step'),
  edges: z.array(FlowEdgeSchema).default([]),
  artifacts: z.array(FlowArtifactSchema).default([]),
  artifactBindings: z.array(FlowArtifactBindingSchema).optional(),
  durable: z.boolean().optional(),
  retry: FlowRetrySchema.optional(),
  timeout: z.number().optional(),
})

export interface ValidationError {
  path: string
  message: string
}

/**
 * Validate a raw parsed object against the FlowDefinition schema.
 * Returns the typed FlowDefinition on success, throws ValidationError[] on failure.
 */
export function validateFlowSchema(raw: unknown): FlowDefinition {
  const result = FlowDefinitionSchema.safeParse(raw)
  if (!result.success) {
    const errors: ValidationError[] = result.error.issues.map((issue) => ({
      path: issue.path.join('.') || '(root)',
      message: issue.message,
    }))
    const err = new Error(`Flow schema validation failed: ${errors.map(e => `${e.path}: ${e.message}`).join('; ')}`)
    ;(err as Error & { validationErrors: ValidationError[] }).validationErrors = errors
    throw err
  }
  return result.data as FlowDefinition
}

/**
 * Try to validate without throwing. Returns errors array (empty = valid).
 */
export function tryValidateFlowSchema(raw: unknown): ValidationError[] {
  const result = FlowDefinitionSchema.safeParse(raw)
  if (!result.success) {
    return result.error.issues.map((issue) => ({
      path: issue.path.join('.') || '(root)',
      message: issue.message,
    }))
  }
  return []
}

/**
 * Detect cycles in flow edges. Returns a list of error messages (empty = no cycles).
 */
export function detectEdgeCycles(edges: Array<{ from: string; to: string }>): string[] {
  const graph = new Map<string, string[]>()
  for (const edge of edges) {
    if (!graph.has(edge.from)) graph.set(edge.from, [])
    graph.get(edge.from)!.push(edge.to)
  }

  const visited = new Set<string>()
  const inStack = new Set<string>()
  const cycles: string[] = []

  function dfs(node: string, path: string[]): void {
    if (node === '__end__' || node === '__start__') return
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node)
      const cycle = [...path.slice(cycleStart), node]
      cycles.push(`Cycle detected: ${cycle.join(' → ')}`)
      return
    }
    if (visited.has(node)) return
    visited.add(node)
    inStack.add(node)
    for (const next of graph.get(node) ?? []) {
      dfs(next, [...path, node])
    }
    inStack.delete(node)
  }

  for (const node of graph.keys()) {
    dfs(node, [])
  }

  return cycles
}
