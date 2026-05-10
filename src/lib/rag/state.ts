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

const overwrite = <T>(_prev: T, next: T) => next

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  thread_id: Annotation<string>({ reducer: overwrite, default: () => crypto.randomUUID() }),
  language: Annotation<string>({ reducer: overwrite, default: () => 'zh-TW' }),
  conversation_summary: Annotation<string | undefined>({ reducer: overwrite, default: () => undefined }),

  plan: Annotation<Plan>({
    reducer: overwrite,
    default: () => ({ intent: 'factual', needs_clarification: false, subtasks: [], specialists: [] }),
  }),
  needs_web_search: Annotation<boolean>({ reducer: overwrite, default: () => false }),

  search_results: Annotation<SearchResult[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  coverage_gaps: Annotation<string[]>({ reducer: overwrite, default: () => [] }),

  diagram: Annotation<{ type: 'mermaid' | 'image'; content: string } | undefined>({
    reducer: overwrite,
    default: () => undefined,
  }),
  draft: Annotation<string>({ reducer: overwrite, default: () => '' }),
  critique: Annotation<Critique>({
    reducer: overwrite,
    default: () => ({ confidence: 1, ungrounded_claims: [], gaps: [] }),
  }),
  iteration: Annotation<number>({ reducer: overwrite, default: () => 0 }),

  related_posts: Annotation<{ title: string; slug: string; description: string }[]>({
    reducer: overwrite,
    default: () => [],
  }),
  final_response: Annotation<string>({ reducer: overwrite, default: () => '' }),

  langfuse_trace_id: Annotation<string>({ reducer: overwrite, default: () => '' }),
  token_usage: Annotation<{ input: number; output: number }>({
    reducer: overwrite,
    default: () => ({ input: 0, output: 0 }),
  }),
})

export type GraphState = typeof StateAnnotation.State
