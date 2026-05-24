import { HumanMessage } from '@langchain/core/messages'
import { describe, expect, it, vi } from 'vitest'
import { initialState, type GraphState, type Plan, type RagMessage } from '../state'
import { plannerAgent, plannerNode } from './planner'
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

const cases: Array<{ name: string; query: string; plan: Plan; language: string }> = [
  {
    name: 'factual zh-TW',
    query: 'Agent OS 是什麼？',
    language: 'zh-TW',
    plan: makePlan('factual', 'medium'),
  },
  {
    name: 'summary English',
    query: 'Summarize the RAG article',
    language: 'en',
    plan: makePlan('summary', 'simple'),
  },
  {
    name: 'code comparison',
    query: 'Compare the code paths and show an example',
    language: 'en',
    plan: makePlan('comparison', 'complex', false, ['legacy path', 'kernel path'], ['code_explainer']),
  },
  {
    name: 'exploratory recommendation',
    query: '推薦我一條 Agent learning path',
    language: 'zh-TW',
    plan: makePlan('recommendation', 'complex', false, ['agent basics', 'tool mediation']),
  },
  {
    name: 'off-topic clarification',
    query: '明天天氣如何？',
    language: 'zh-TW',
    plan: makePlan('off-topic', 'simple', true),
  },
]

describe('planner agent parity', () => {
  it.each(cases)('matches legacy node output for $name', async ({ query, plan, language }) => {
    const state = makeState(query)
    const result = makeInvokeResult({ ...plan, language })
    vi.mocked(invokeModel).mockResolvedValueOnce(result)

    const legacy = await plannerNode(state, {
      apiKeys: { groq: 'legacy-key' },
    })
    const syscall = vi.fn().mockResolvedValueOnce(result)
    const kernel = await plannerAgent.run(state, {
      syscallContext: { runId: 'run-1', agentId: 'planner' },
      syscall,
      runtimeOptions: { providerApiKeys: { groq: 'kernel-key' } },
    })

    expect(syscall).toHaveBeenCalledWith(
      expect.anything(),
      'model.invoke',
      expect.objectContaining({
        stage: 'planner',
        maxTokens: 512,
        apiKeys: { groq: 'kernel-key' },
      })
    )
    expect(kernel.plan).toEqual(legacy.plan)
    expect(kernel.language).toBe(legacy.language)
    expect(kernel.model_usage?.at(-1)).toMatchObject({ stage: 'planner', ...route })
    expect(plannerBranch({ ...state, ...kernel })).toBe(plannerBranch({ ...state, ...legacy }))
  })
})

function makeState(query: string): GraphState {
  return {
    ...initialState(),
    messages: [new HumanMessage(query)] as RagMessage[],
    model_usage: [{ stage: 'critic', ...route }],
  }
}

function makePlan(
  intent: Plan['intent'],
  complexity: Plan['complexity'],
  needsClarification = false,
  subtasks: string[] = [],
  specialists: string[] = []
): Plan {
  return {
    intent,
    complexity,
    needs_clarification: needsClarification,
    subtasks,
    specialists,
  }
}

function makeInvokeResult(content: unknown): MockInvokeResult {
  return {
    response: { content: JSON.stringify(content) },
    route,
  } as unknown as MockInvokeResult
}

function plannerBranch(state: Pick<GraphState, 'plan'>): 'END' | 'research' {
  return state.plan.needs_clarification || state.plan.intent === 'off-topic' ? 'END' : 'research'
}
