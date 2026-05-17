import { HumanMessage } from '@langchain/core/messages'
import { describe, expect, it, vi } from 'vitest'
import { initialState, type GraphState } from '../state'
import { writerAgent, writerNode } from './writer'
import { invokeModel } from '../model'

vi.mock('../model', async () => {
  const actual = await vi.importActual<typeof import('../model')>('../model')
  return {
    ...actual,
    invokeModel: vi.fn(),
  }
})

type MockInvokeResult = Awaited<ReturnType<typeof invokeModel>>

const route = {
  provider: 'groq' as const,
  model: 'llama-3.3-70b-versatile',
  fallback: false,
}

const cases = [
  {
    name: 'factual answer',
    state: makeState({
      plan: {
        intent: 'factual',
        complexity: 'medium',
        needs_clarification: false,
        subtasks: [],
        specialists: [],
      },
      iteration: 0,
    }),
    markdown: 'Agent OS routes tools through mediated syscalls and logs each call as telemetry [Agent OS](https://example.com/agent-os).',
  },
  {
    name: 'recommendation answer',
    state: makeState({
      plan: {
        intent: 'recommendation',
        complexity: 'medium',
        needs_clarification: false,
        subtasks: [],
        specialists: [],
      },
      iteration: 1,
    }),
    markdown: '- **Use the kernel path**: it preserves telemetry while keeping legacy fallback [Agent OS](https://example.com/agent-os).',
  },
  {
    name: 'low confidence disclaimer',
    state: makeState({
      critique: {
        confidence: 0.52,
        answer_relevance: 0.7,
        intent_alignment: 0.8,
        drift_detected: false,
        ungrounded_claims: [],
        gaps: ['missing deployment telemetry'],
      },
      validation: { passed: false, errors: ['missing citation'] },
      iteration: 2,
    }),
    markdown: 'Limitation: available evidence is incomplete. The grounded part is that syscalls are logged [Agent OS](https://example.com/agent-os).',
  },
]

describe('writer agent parity', () => {
  it.each(cases)('matches legacy node output for $name', async ({ state, markdown }) => {
    const result = makeInvokeResult(markdown)
    vi.mocked(invokeModel).mockResolvedValueOnce(result)

    const legacy = await writerNode(state, {
      apiKeys: { groq: 'legacy-key' },
    })
    const syscall = vi.fn().mockResolvedValueOnce(result)
    const kernel = await writerAgent.run(state, {
      syscallContext: { runId: 'run-1', agentId: 'writer' },
      syscall,
      runtimeOptions: { providerApiKeys: { groq: 'kernel-key' } },
    })

    expect(syscall).toHaveBeenCalledWith(
      expect.anything(),
      'model.invoke',
      expect.objectContaining({
        stage: 'writer',
        maxTokens: 2048,
        apiKeys: { groq: 'kernel-key' },
      })
    )
    expect(kernel.iteration).toBe(legacy.iteration)
    expect(kernel.iteration).toBe(state.iteration + 1)
    expect(kernel.draft).toBe(kernel.final_response)
    expect(legacy.draft).toBe(legacy.final_response)
    expect(kernel.model_usage?.at(-1)).toMatchObject({ stage: 'writer', ...route })
    expect(kernel.model_usage?.length).toBe(legacy.model_usage?.length)
    expect(kernel.token_usage).toEqual(legacy.token_usage)
    expect(Math.abs((kernel.draft?.length ?? 0) - (legacy.draft?.length ?? 0))).toBeLessThanOrEqual(Math.ceil((legacy.draft?.length ?? 0) * 0.1))
    expect(kernel.draft).toContain('[Agent OS](https://example.com/agent-os)')
  })
})

function makeState(overrides: Partial<GraphState>): GraphState {
  return {
    ...initialState(),
    messages: [new HumanMessage('How should we migrate this RAG agent?')],
    search_results: [{
      claim: 'Agent OS routes tools through mediated syscalls.',
      evidence_excerpt: 'All tool calls are logged through the kernel.',
      source_url: 'https://example.com/agent-os',
      chunk_id: 'chunk-1',
      date: '2026-05-18',
      relevance_score: 0.9,
      images: [],
      links: [],
      type: 'doc',
    }],
    token_usage: { input: 80, output: 40 },
    model_usage: [{ stage: 'research', ...route }],
    ...overrides,
  }
}

function makeInvokeResult(markdown: string): MockInvokeResult {
  return {
    response: {
      content: markdown,
      usage_metadata: {
        input_tokens: 20,
        output_tokens: 10,
      },
    },
    route,
  } as MockInvokeResult
}
