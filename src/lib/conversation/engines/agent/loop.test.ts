import { describe, expect, it } from 'vitest'
import { runAgentLoop, type AgentModelResponse, type AgentLoopDeps } from './loop'

const LIMITS = { maxToolCalls: 4, maxTurns: 5, deadlineMs: 10_000 }

function scripted(responses: AgentModelResponse[]): AgentLoopDeps['invoke'] {
  let i = 0
  return async () => responses[Math.min(i++, responses.length - 1)]
}

const search = { id: 'c1', name: 'search_posts', args: { query: 'RAG' } }
const read = { id: 'c2', name: 'get_post_detail', args: { slug: 'ai/rag' } }

describe('runAgentLoop', () => {
  it('runs tools in order and returns the final text', async () => {
    const calls: string[] = []
    const result = await runAgentLoop(
      {
        invoke: scripted([
          { text: '', toolCalls: [search], usage: { input: 10, output: 2 } },
          { text: '', toolCalls: [read], usage: { input: 20, output: 3 } },
          { text: 'Final answer [RAG](https://quidproquo.cc/posts/ai/rag)', toolCalls: [], usage: { input: 30, output: 40 } },
        ]),
        tools: {
          search_posts: async (args) => { calls.push(`search:${args.query}`); return { content: '[{"slug":"ai/rag"}]' } },
          get_post_detail: async (args) => { calls.push(`read:${args.slug}`); return { content: '# RAG' } },
        },
        limits: LIMITS,
      },
      { systemPrompt: 'sys', question: 'What is RAG?' },
    )
    expect(calls).toEqual(['search:RAG', 'read:ai/rag'])
    expect(result.answer).toContain('Final answer')
    expect(result.turns).toBe(3)
    expect(result.toolCallCount).toBe(2)
    expect(result.usage).toEqual({ input: 60, output: 45 })
    expect(result.forcedFinish).toBe(false)
    // system, human, ai, tool, ai, tool
    expect(result.messages.map((m) => m.type)).toEqual(['system', 'human', 'ai', 'tool', 'ai', 'tool'])
  })

  it('forces a wrap-up turn without tools once the tool budget is spent', async () => {
    const seen: boolean[] = []
    const invoke: AgentLoopDeps['invoke'] = async (_messages, opts) => {
      seen.push(opts.allowTools)
      if (opts.allowTools) return { text: '', toolCalls: [search, search] }
      return { text: 'Wrapped up', toolCalls: [] }
    }
    const result = await runAgentLoop(
      { invoke, tools: { search_posts: async () => ({ content: '[]' }) }, limits: { ...LIMITS, maxToolCalls: 2 } },
      { systemPrompt: 'sys', question: 'q' },
    )
    expect(seen).toEqual([true, false])
    expect(result.forcedFinish).toBe(true)
    expect(result.answer).toBe('Wrapped up')
    expect(result.toolCallCount).toBe(2)
  })

  it('ignores tool calls returned during a wrap-up turn', async () => {
    const invoke: AgentLoopDeps['invoke'] = async (_m, opts) =>
      opts.allowTools ? { text: '', toolCalls: [search] } : { text: 'answer anyway', toolCalls: [search] }
    const result = await runAgentLoop(
      { invoke, tools: { search_posts: async () => ({ content: '[]' }) }, limits: { ...LIMITS, maxToolCalls: 1 } },
      { systemPrompt: 'sys', question: 'q' },
    )
    expect(result.answer).toBe('answer anyway')
  })

  it('stops on the deadline', async () => {
    let clock = 0
    const invoke: AgentLoopDeps['invoke'] = async (_m, opts) => {
      clock += 6_000
      return opts.allowTools ? { text: '', toolCalls: [search] } : { text: 'late answer', toolCalls: [] }
    }
    const result = await runAgentLoop(
      { invoke, tools: { search_posts: async () => ({ content: '[]' }) }, limits: { ...LIMITS, deadlineMs: 10_000 }, now: () => clock },
      { systemPrompt: 'sys', question: 'q' },
    )
    expect(result.forcedFinish).toBe(true)
    expect(result.answer).toBe('late answer')
    expect(result.turns).toBe(3)
  })

  it('feeds tool errors and unknown tools back to the model instead of aborting', async () => {
    const events: string[] = []
    const result = await runAgentLoop(
      {
        invoke: scripted([
          { text: '', toolCalls: [{ id: 'x', name: 'nope', args: {} }, search] },
          { text: 'recovered', toolCalls: [] },
        ]),
        tools: { search_posts: async () => { throw new Error('D1 down') } },
        limits: LIMITS,
        onToolCall: ({ call, error }) => events.push(`${call.name}:${error ?? 'ok'}`),
      },
      { systemPrompt: 'sys', question: 'q' },
    )
    expect(events).toEqual(['nope:Unknown tool: nope', 'search_posts:D1 down'])
    expect(result.answer).toBe('recovered')
    const toolMsgs = result.messages.filter((m) => m.type === 'tool')
    expect(toolMsgs).toHaveLength(2)
    expect(String(toolMsgs[1].content)).toContain('D1 down')
  })

  it('retries once when the model returns empty text, then gives up', async () => {
    const result = await runAgentLoop(
      { invoke: scripted([{ text: '   ', toolCalls: [] }]), tools: {}, limits: LIMITS },
      { systemPrompt: 'sys', question: 'q' },
    )
    expect(result.empty).toBe(true)
    expect(result.answer).toBe('')
    expect(result.turns).toBe(2)
  })
})
