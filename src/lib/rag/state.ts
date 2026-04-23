import { Annotation } from '@langchain/langgraph'
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
  type: 'post' | 'doc' | 'custom'
  slug?: string
  title?: string
}

export interface Plan {
  intent: 'factual' | 'summary' | 'code' | 'comparison' | 'exploratory' | 'off-topic'
  needs_clarification: boolean
  subtasks: string[]
  specialists: string[]
}

export interface Critique {
  confidence: number
  ungrounded_claims: string[]
  gaps: string[]
}

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  thread_id: Annotation<string>({ default: () => crypto.randomUUID() }),
  language: Annotation<string>({ default: () => 'zh-TW' }),
  conversation_summary: Annotation<string | undefined>({ default: () => undefined }),

  plan: Annotation<Plan>({
    default: () => ({ intent: 'factual', needs_clarification: false, subtasks: [], specialists: [] }),
  }),
  needs_web_search: Annotation<boolean>({ default: () => false }),

  search_results: Annotation<SearchResult[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  coverage_gaps: Annotation<string[]>({ default: () => [] }),

  diagram: Annotation<{ type: 'mermaid' | 'image'; content: string } | undefined>({
    default: () => undefined,
  }),
  draft: Annotation<string>({ default: () => '' }),
  critique: Annotation<Critique>({
    default: () => ({ confidence: 1, ungrounded_claims: [], gaps: [] }),
  }),
  iteration: Annotation<number>({ default: () => 0 }),

  related_posts: Annotation<{ title: string; slug: string; description: string }[]>({
    default: () => [],
  }),
  final_response: Annotation<string>({ default: () => '' }),

  langfuse_trace_id: Annotation<string>({ default: () => '' }),
  token_usage: Annotation<{ input: number; output: number }>({
    default: () => ({ input: 0, output: 0 }),
  }),
})

export type GraphState = typeof StateAnnotation.State
