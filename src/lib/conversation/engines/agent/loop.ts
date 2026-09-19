import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages'
import type { RagMessage } from '../../../retrieval/state'

/**
 * Ask AI agent 引擎的核心迴圈：模型決定要不要呼叫工具，程式負責把關。
 *
 * 純邏輯、無 I/O：模型呼叫與工具實作都由 deps 注入，方便用假模型測試
 * 「步數上限、時間上限、強制收尾、工具錯誤不中斷」這些控制邊界。
 */

export interface AgentToolCall {
  id: string
  name: string
  args: Record<string, unknown>
}

export interface AgentModelResponse {
  text: string
  toolCalls: AgentToolCall[]
  usage?: { input: number; output: number }
  reasoning?: string
}

export interface AgentToolResult {
  /** 回給模型的內容（字串，通常是 JSON） */
  content: string
  /** 給 UI／trace 的摘要，不回給模型 */
  summary?: Record<string, unknown>
}

export type AgentToolHandler = (args: Record<string, unknown>) => Promise<AgentToolResult>

export interface AgentLoopLimits {
  /** 工具呼叫總數上限（含失敗的） */
  maxToolCalls: number
  /** 模型輪數上限（含收尾那一輪） */
  maxTurns: number
  /** 整個迴圈的時間預算（ms），超過就強制收尾 */
  deadlineMs: number
}

export interface AgentLoopDeps {
  invoke: (messages: RagMessage[], options: { allowTools: boolean; turn: number }) => Promise<AgentModelResponse>
  tools: Record<string, AgentToolHandler>
  limits: AgentLoopLimits
  now?: () => number
  onTurn?: (info: { turn: number; response: AgentModelResponse; durationMs: number; final: boolean }) => void
  onToolCall?: (info: { call: AgentToolCall; result: AgentToolResult | null; error?: string; durationMs: number }) => void
}

export interface AgentLoopInput {
  systemPrompt: string
  question: string
  /** 先前對話摘要，有就接在問題前面給模型當背景 */
  conversationSummary?: string
}

export interface AgentLoopResult {
  answer: string
  turns: number
  toolCallCount: number
  usage: { input: number; output: number }
  /** 因步數／時間到而被程式強制收尾 */
  forcedFinish: boolean
  /** 收尾後仍拿不到文字（模型持續想叫工具或回空） */
  empty: boolean
  messages: RagMessage[]
}

const WRAP_UP_INSTRUCTION =
  'Tool budget is exhausted. Do not call any more tools. Write the final answer now using only the evidence you have already gathered; if it is insufficient, say so plainly.'

export async function runAgentLoop(deps: AgentLoopDeps, input: AgentLoopInput): Promise<AgentLoopResult> {
  const now = deps.now ?? (() => Date.now())
  const startedAt = now()
  const usage = { input: 0, output: 0 }
  const messages: RagMessage[] = [
    new SystemMessage(input.systemPrompt),
    new HumanMessage(
      input.conversationSummary
        ? `Conversation so far (summary):\n${input.conversationSummary}\n\nQuestion:\n${input.question}`
        : input.question,
    ),
  ]

  let turns = 0
  let toolCallCount = 0
  let forcedFinish = false

  const addUsage = (r: AgentModelResponse) => {
    usage.input += r.usage?.input ?? 0
    usage.output += r.usage?.output ?? 0
  }
  const budgetLeft = () =>
    toolCallCount < deps.limits.maxToolCalls &&
    turns < deps.limits.maxTurns - 1 &&
    now() - startedAt < deps.limits.deadlineMs

  while (turns < deps.limits.maxTurns) {
    const allowTools = budgetLeft()
    if (!allowTools) {
      forcedFinish = true
      messages.push(new HumanMessage(WRAP_UP_INSTRUCTION))
    }
    const turnStartedAt = now()
    turns += 1
    const response = await deps.invoke(messages, { allowTools, turn: turns })
    addUsage(response)
    const calls = allowTools ? response.toolCalls : []
    const final = calls.length === 0
    deps.onTurn?.({ turn: turns, response, durationMs: now() - turnStartedAt, final })

    if (final) {
      const answer = response.text.trim()
      if (answer) {
        return { answer, turns, toolCallCount, usage, forcedFinish, empty: false, messages }
      }
      // 模型回空（或收尾時仍只想叫工具）：再給一次機會，下一輪一定是收尾
      if (forcedFinish) break
      forcedFinish = true
      messages.push(new AIMessage({ content: response.text }))
      messages.push(new HumanMessage(WRAP_UP_INSTRUCTION))
      continue
    }

    messages.push(new AIMessage({ content: response.text, tool_calls: calls.map((c) => ({ id: c.id, name: c.name, args: c.args })) }))
    for (const call of calls) {
      const callStartedAt = now()
      toolCallCount += 1
      const handler = deps.tools[call.name]
      if (!handler) {
        const error = `Unknown tool: ${call.name}`
        deps.onToolCall?.({ call, result: null, error, durationMs: 0 })
        messages.push(new ToolMessage({ content: JSON.stringify({ error }), tool_call_id: call.id, name: call.name }))
        continue
      }
      try {
        const result = await handler(call.args)
        deps.onToolCall?.({ call, result, durationMs: now() - callStartedAt })
        messages.push(new ToolMessage({ content: result.content, tool_call_id: call.id, name: call.name }))
      } catch (err) {
        // 工具失敗不中斷整個鏈：回錯誤給模型，讓它換個做法或直接作答
        const error = err instanceof Error ? err.message : String(err)
        deps.onToolCall?.({ call, result: null, error, durationMs: now() - callStartedAt })
        messages.push(new ToolMessage({ content: JSON.stringify({ error }), tool_call_id: call.id, name: call.name }))
      }
    }
  }

  return { answer: '', turns, toolCallCount, usage, forcedFinish, empty: true, messages }
}
