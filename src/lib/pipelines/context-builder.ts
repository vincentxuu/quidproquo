import type { PipelineDefinition } from './types'

export interface ContextBundle {
  projectRules: {
    sourceOfTruth: string
    noAutoPublish: boolean
    noSilentOverwrite: boolean
    reviewerNoAutofix: boolean
  }
  pipeline: {
    id: string
    title: string
    risk: string
    runtime: string
    writesMarkdown: boolean
    usesExternalResearch: boolean
  }
  inputSummary: Record<string, unknown>
  guardSummary: string[]
}

export function buildContextBundle(definition: PipelineDefinition, input: Record<string, unknown>): ContextBundle {
  return {
    projectRules: {
      sourceOfTruth: 'Markdown source mirrored to D1/R2/build-time content manifest',
      noAutoPublish: true,
      noSilentOverwrite: true,
      reviewerNoAutofix: true,
    },
    pipeline: {
      id: definition.id,
      title: definition.title,
      risk: definition.risk,
      runtime: definition.runtime,
      writesMarkdown: definition.writesMarkdown,
      usesExternalResearch: definition.usesExternalResearch,
    },
    inputSummary: sanitizeInput(input),
    guardSummary: definition.guards,
  }
}

function sanitizeInput(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (/secret|token|password/i.test(key)) return [key, '[redacted]']
      return [key, value]
    }),
  )
}
