import type { BaseMessage } from '@langchain/core/messages'
import type { SearchMetrics } from './tools/hybrid-search'
import type { RagProvider } from './providers'

export interface NativeTraceEvent {
  stage: string
  at: string
  duration_ms?: number
  metadata?: Record<string, unknown>
}

export interface NativeTrace {
  engine: string
  version: string
  events: NativeTraceEvent[]
  metadata?: Record<string, unknown>
}

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
  pipelineEngine: 'langgraph' | 'manual' | 'llamaindex'
  defaultProvider: RagProvider
  defaultModel: string
  stageOverrides: Record<string, { provider?: RagProvider; model?: string }>
  fallbackProvider: RagProvider | null
  fallbackModel: string | null
  hydeEnabled: boolean
  multiQueryEnabled: boolean
  rerankerEnabled: boolean
  criticEnabled: boolean
  pageIndexEnabled: boolean
  pageIndexMaxSteps: number
  bm25ShortCircuitEnabled: boolean
  shadowModeEnabled: boolean
  semanticCacheThreshold: number
  rerankerMinKeep: number
  mmrLambda: number
  checkpointThresholdRatio: number
}

export interface Plan {
  intent: 'factual' | 'summary' | 'code' | 'comparison' | 'exploratory' | 'recommendation' | 'off-topic'
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
  retrieval_metrics: SearchMetrics[]
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
  trace_steps: TraceStep[]
  model_usage: { stage: string; provider: string; model: string; fallback: boolean }[]
  native_trace?: NativeTrace
}

export interface TraceStep {
  stage: string
  started_at: string
  duration_ms: number
  input_summary: string
  output_summary: string
  tokens?: { input: number; output: number }
  retry?: boolean
  metadata?: Record<string, unknown>
}

export interface PipelineCallbacks {
  onStep: (agent: string, extra?: Record<string, unknown>) => void
  onToken: (text: string) => void
  onRelated: (posts: { title: string; slug: string; description: string }[]) => void
}

export function initialState(): GraphState {
  return {
    messages: [],
    thread_id: crypto.randomUUID(),
    language: 'zh-TW',
    conversation_summary: undefined,
    config: {
      pipelineEngine: 'langgraph',
      defaultProvider: 'groq',
      defaultModel: 'llama-3.3-70b-versatile',
      stageOverrides: {},
      fallbackProvider: null,
      fallbackModel: null,
      hydeEnabled: false,
      multiQueryEnabled: false,
      rerankerEnabled: false,
      criticEnabled: true,
      pageIndexEnabled: false,
      pageIndexMaxSteps: 5,
      bm25ShortCircuitEnabled: true,
      shadowModeEnabled: false,
      semanticCacheThreshold: 0.95,
      rerankerMinKeep: 3,
      mmrLambda: 0.7,
      checkpointThresholdRatio: 0.7,
    },
    plan: { intent: 'factual', complexity: 'medium', needs_clarification: false, subtasks: [], specialists: [] },
    needs_web_search: false,
    search_results: [],
    retrieval_metrics: [],
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
    trace_steps: [],
    model_usage: [],
    native_trace: undefined,
  }
}
