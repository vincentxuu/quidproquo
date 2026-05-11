import type { BaseMessage } from '@langchain/core/messages'

export interface SearchResult {
  claim: string
  evidence_excerpt: string
  source_url: string
  chunk_id: string
  date: string
  relevance_score: number
  images: string[]
  links: { text: string; url: string }[]
  type: 'post' | 'doc' | 'custom' | 'abstract'
  slug?: string
  title?: string
}

export interface RagRuntimeConfig {
  hydeEnabled: boolean
  multiQueryEnabled: boolean
  rerankerEnabled: boolean
  criticEnabled: boolean
  shadowModeEnabled: boolean
  semanticCacheThreshold: number
  rerankerMinKeep: number
  mmrLambda: number
  checkpointThresholdRatio: number
}

export interface Plan {
  intent: 'factual' | 'summary' | 'code' | 'comparison' | 'exploratory' | 'off-topic'
  complexity: 'simple' | 'medium' | 'complex'
  needs_clarification: boolean
  subtasks: string[]
  specialists: string[]
}

export interface Critique {
  confidence: number
  answer_relevance: number
  intent_alignment: number
  drift_detected: boolean
  ungrounded_claims: string[]
  gaps: string[]
}

export interface ValidationResult {
  passed: boolean
  errors: string[]
}

export interface GraphState {
  messages: BaseMessage[]
  thread_id: string
  language: string
  conversation_summary: string | undefined
  config: RagRuntimeConfig
  plan: Plan
  needs_web_search: boolean
  search_results: SearchResult[]
  coverage_gaps: string[]
  diagram: { type: 'mermaid' | 'image'; content: string } | undefined
  draft: string
  validation: ValidationResult
  critique: Critique
  iteration: number
  related_posts: { title: string; slug: string; description: string }[]
  final_response: string
  langfuse_trace_id: string
  token_usage: { input: number; output: number }
}

export function initialState(): GraphState {
  return {
    messages: [],
    thread_id: crypto.randomUUID(),
    language: 'zh-TW',
    conversation_summary: undefined,
    config: {
      hydeEnabled: false,
      multiQueryEnabled: false,
      rerankerEnabled: false,
      criticEnabled: true,
      shadowModeEnabled: false,
      semanticCacheThreshold: 0.95,
      rerankerMinKeep: 3,
      mmrLambda: 0.7,
      checkpointThresholdRatio: 0.7,
    },
    plan: { intent: 'factual', complexity: 'medium', needs_clarification: false, subtasks: [], specialists: [] },
    needs_web_search: false,
    search_results: [],
    coverage_gaps: [],
    diagram: undefined,
    draft: '',
    validation: { passed: true, errors: [] },
    critique: { confidence: 1, answer_relevance: 1, intent_alignment: 1, drift_detected: false, ungrounded_claims: [], gaps: [] },
    iteration: 0,
    related_posts: [],
    final_response: '',
    langfuse_trace_id: '',
    token_usage: { input: 0, output: 0 },
  }
}
