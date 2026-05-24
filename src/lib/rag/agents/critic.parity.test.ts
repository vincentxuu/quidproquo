import { HumanMessage } from '@langchain/core/messages'
import { describe, expect, it, vi } from 'vitest'
import { initialState, type GraphState, type RagMessage } from '../state'
import { shouldDegrade, shouldRetry } from './critic-routing'
import { criticAgent, criticNode } from './critic'
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
    name: 'passing critique',
    state: makeState({
      draft: 'The draft is grounded and directly answers the question.',
      iteration: 0,
    }),
    critique: {
      confidence: 0.91,
      answer_relevance: 0.96,
      intent_alignment: 0.94,
      drift_detected: false,
      ungrounded_claims: [],
      gaps: [],
    },
  },
  {
    name: 'ungrounded claim',
    state: makeState({
      draft: 'The draft adds a claim that is not present in the source.',
      iteration: 1,
    }),
    critique: {
      confidence: 0.58,
      answer_relevance: 0.82,
      intent_alignment: 0.8,
      drift_detected: false,
      ungrounded_claims: ['unsupported benchmark number'],
      gaps: ['missing source coverage'],
    },
  },
  {
    name: 'drift after retry budget',
    state: makeState({
      draft: 'The draft wandered into an unrelated implementation plan.',
      iteration: 3,
    }),
    critique: {
      confidence: 0.7,
      answer_relevance: 0.62,
      intent_alignment: 0.52,
      drift_detected: true,
      ungrounded_claims: [],
      gaps: ['does not answer the original question'],
    },
  },
]

describe('critic agent parity', () => {
  it.each(cases)('matches legacy node output for $name', async ({ state, critique }) => {
    const result = makeInvokeResult(critique)
    vi.mocked(invokeModel).mockResolvedValueOnce(result)

    const legacy = await criticNode(state, {
      apiKeys: { groq: 'legacy-key' },
    })
    const syscall = vi.fn().mockResolvedValueOnce(result)
    const kernel = await criticAgent.run(state, {
      syscallContext: { runId: 'run-1', agentId: 'critic' },
      syscall,
      runtimeOptions: { providerApiKeys: { groq: 'kernel-key' } },
    })

    expect(syscall).toHaveBeenCalledWith(
      expect.anything(),
      'model.invoke',
      expect.objectContaining({
        stage: 'critic',
        maxTokens: 512,
        apiKeys: { groq: 'kernel-key' },
      })
    )
    expect(kernel.critique?.drift_detected).toBe(legacy.critique?.drift_detected)
    expect(kernel.critique?.ungrounded_claims).toEqual(legacy.critique?.ungrounded_claims)
    expect(kernel.critique?.gaps).toEqual(legacy.critique?.gaps)
    expect(kernel.critique?.confidence).toBeCloseTo(legacy.critique?.confidence ?? 0, 2)
    expect(kernel.critique?.answer_relevance).toBeCloseTo(legacy.critique?.answer_relevance ?? 0, 2)
    expect(kernel.critique?.intent_alignment).toBeCloseTo(legacy.critique?.intent_alignment ?? 0, 2)
    expect(kernel.model_usage?.length).toBe(legacy.model_usage?.length)
    expect(kernel.token_usage).toEqual(legacy.token_usage)

    const legacyState = { ...state, ...legacy }
    const kernelState = { ...state, ...kernel }
    expect(shouldRetry(kernelState)).toBe(shouldRetry(legacyState))
    expect(shouldDegrade(kernelState)).toBe(shouldDegrade(legacyState))
  })
})

function makeState(overrides: Partial<GraphState>): GraphState {
  return {
    ...initialState(),
    messages: [new HumanMessage('What changed in the agent architecture?')] as RagMessage[],
    plan: {
      intent: 'factual',
      complexity: 'medium',
      needs_clarification: false,
      subtasks: [],
      specialists: [],
    },
    search_results: [{
      claim: 'Agent OS routes tools through mediated syscalls.',
      evidence_excerpt: 'All tool calls are logged through the kernel.',
      source_url: 'https://example.com/agent-os',
      chunk_id: 'chunk-1',
      date: '2026-05-17',
      relevance_score: 0.9,
      images: [],
      links: [],
      type: 'doc',
    }],
    token_usage: { input: 100, output: 50 },
    model_usage: [{ stage: 'writer', ...route }],
    ...overrides,
  }
}

function makeInvokeResult(critique: unknown): MockInvokeResult {
  return {
    response: {
      content: JSON.stringify(critique),
      usage_metadata: {
        input_tokens: 12,
        output_tokens: 6,
      },
    },
    route,
  } as unknown as MockInvokeResult
}
