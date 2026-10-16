import { describe, expect, it } from 'vitest'
import { normalizeRagLifecycleOutput } from './normalizers'
import { RAG_ENGINE_REGISTRY, resolveRagEngine } from './registry'
import { initialState } from '../../retrieval/state'

describe('RAG engine registry', () => {
  it('exposes manual, langgraph and agent engines', () => {
    expect(new Set(Object.keys(RAG_ENGINE_REGISTRY).sort())).toEqual(
      new Set(['agent', 'langgraph', 'manual'])
    )
    expect(resolveRagEngine('agent').name).toBe('agent')
    expect(resolveRagEngine('manual').name).toBe('manual')
    expect(resolveRagEngine('langgraph').name).toBe('langgraph')
  })
})

describe('RAG lifecycle output normalization', () => {
  it('fills required defaults and preserves trace id', () => {
    const state = initialState()
    const output = {
      ...state,
      final_response: 'ok',
      trace_steps: [],
      search_results: [],
      retrieval_metrics: [],
      related_posts: [],
      model_usage: [],
      token_usage: { input: 3, output: 5 },
      messages: [...state.messages],
    }
    const normalized = normalizeRagLifecycleOutput(
      {
        message: 'what is this?',
        traceId: 'trace-1',
        threadId: 'thread-1',
        conversationSummary: 'summary',
        recentTurns: 'Reader: 前一句\n\nAssistant: 前一句的答案',
        config: state.config,
      },
      output
    )

    expect(normalized.thread_id).toBe('thread-1')
    expect(normalized.langfuse_trace_id).toBe('trace-1')
    expect(normalized.config).toBe(state.config)
    expect(normalized.conversation_summary).toBe('summary')
    expect(normalized.recent_turns).toBe('Reader: 前一句\n\nAssistant: 前一句的答案')
  })

  it('leaves recent_turns undefined when the request carries no history', () => {
    const output = { ...initialState(), messages: [] }
    const normalized = normalizeRagLifecycleOutput(
      { message: 'q', traceId: 'trace-2', config: initialState().config },
      output
    )

    expect(normalized.recent_turns).toBeUndefined()
  })
})
