/**
 * Agentic loop — pure function, no DO/Workflow coupling.
 * Shape copied from pi-mono packages/agent/src/agent-loop.ts#runLoop:
 *   outer loop = steering, inner loop = tool_calls until stopReason != tool_use
 * Each turn persists to D1 agent_messages/agent_events for resume.
 *
 * Phase 2: events use spec §3.3 typed SessionEvent; each event written to D1
 * with auto-incrementing event_id; KV bumped for SSE watch long-poll.
 */

import type { SessionEvent } from './events'
import { fromSessionEvent } from './events'
import type { RunnerHandle } from './runner/types'

export type LoopMessage = {
  role: 'user' | 'assistant' | 'tool_result'
  content: string
  toolCallId?: string
  toolName?: string
}

export type LoopState = {
  messages: LoopMessage[]
  turnCount: number
  pendingApprovals: Map<string, unknown>
}

const SANDBOX_TOOLS = new Set(['Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep'])

export type LoopDeps = {
  sessionId: string
  modelInvoke: (messages: LoopMessage[]) => Promise<{
    content: string
    toolCalls?: Array<{ id: string; name: string; input: unknown }>
    stopReason: string
  }>
  syscall: (name: string, input: unknown) => Promise<unknown>
  persistMessage: (msg: LoopMessage) => Promise<void>
  persistEvent: (type: string, payload: unknown) => Promise<void>
  broadcast?: (event: unknown) => void
  shouldBlockForApproval?: (toolName: string, input: unknown) => boolean

  db?: D1Database
  kv?: KVNamespace
  runner?: RunnerHandle
  emitSessionEvent?: (event: SessionEvent) => Promise<void>
}

const MAX_TURNS = 30

async function writeEventToD1(
  deps: LoopDeps,
  event: SessionEvent,
): Promise<void> {
  if (!deps.db) return

  const seqRow = await deps.db
    .prepare('SELECT COALESCE(MAX(seq), -1) + 1 AS n FROM agent_events WHERE session_id = ?')
    .bind(deps.sessionId)
    .first<{ n: number }>()
  const seq = seqRow?.n ?? 0
  const row = fromSessionEvent(deps.sessionId, seq, event)

  const result = await deps.db
    .prepare(
      'INSERT INTO agent_events (session_id, seq, type, payload_json, created_at, event_id) VALUES (?, ?, ?, ?, ?, NULL)',
    )
    .bind(row.session_id, row.seq, row.type, row.payload_json, row.created_at)
    .run()

  const eventId = result.meta?.last_row_id
  if (eventId) {
    await deps.db
      .prepare('UPDATE agent_events SET event_id = ? WHERE session_id = ? AND seq = ?')
      .bind(eventId, deps.sessionId, seq)
      .run()

    if (deps.kv) {
      await deps.kv.put(`session:${deps.sessionId}:last_event`, String(eventId))
    }
  }
}

async function dispatchTool(
  deps: LoopDeps,
  toolName: string,
  input: unknown,
): Promise<unknown> {
  if (deps.runner && SANDBOX_TOOLS.has(toolName)) {
    const inp = input as Record<string, unknown>
    switch (toolName) {
      case 'Bash':
        return deps.runner.exec(
          Array.isArray(inp.command) ? inp.command : [String(inp.command ?? '')],
        )
      case 'Read':
        return deps.runner.readFile(String(inp.file_path ?? inp.path ?? ''))
      case 'Write':
        await deps.runner.writeFile(
          String(inp.file_path ?? inp.path ?? ''),
          String(inp.content ?? ''),
        )
        return { ok: true }
      case 'Edit':
        await deps.runner.writeFile(
          String(inp.file_path ?? inp.path ?? ''),
          String(inp.content ?? inp.new_content ?? ''),
        )
        return { ok: true }
      case 'Glob':
        return deps.runner.glob(String(inp.pattern ?? '*'))
      case 'Grep':
        return deps.runner.grep(
          String(inp.pattern ?? ''),
          Array.isArray(inp.paths) ? inp.paths.map(String) : [String(inp.path ?? '.')],
        )
      default:
        return deps.syscall(toolName, input)
    }
  }
  return deps.syscall(toolName, input)
}

export async function runLoop(
  initialMessages: LoopMessage[],
  deps: LoopDeps,
  onTurn?: (state: LoopState) => void,
): Promise<LoopState> {
  const state: LoopState = {
    messages: [...initialMessages],
    turnCount: 0,
    pendingApprovals: new Map(),
  }

  while (state.turnCount < MAX_TURNS) {
    state.turnCount++
    const res = await deps.modelInvoke(state.messages)

    const assistantMsg: LoopMessage = { role: 'assistant', content: res.content }
    state.messages.push(assistantMsg)
    await deps.persistMessage(assistantMsg)

    const assistantEvent: SessionEvent = {
      type: 'assistant',
      content: res.content,
      stopReason: res.stopReason,
      toolCalls: res.toolCalls?.map((tc) => ({ id: tc.id, name: tc.name, input: tc.input })),
    }
    await writeEventToD1(deps, assistantEvent)
    await deps.persistEvent('assistant', { content: res.content, stopReason: res.stopReason })
    deps.broadcast?.({ type: 'assistant', content: res.content, turn: state.turnCount })

    if (!res.toolCalls || res.toolCalls.length === 0 || res.stopReason !== 'tool_use') {
      break
    }

    for (const tc of res.toolCalls) {
      if (deps.shouldBlockForApproval?.(tc.name, tc.input)) {
        const reqId = `appr_${Date.now()}_${tc.id}`
        state.pendingApprovals.set(reqId, { toolName: tc.name, input: tc.input })

        const controlEvent: SessionEvent = {
          type: 'control_request',
          subtype: 'can_use_tool',
          payload: { requestId: reqId, toolName: tc.name, input: tc.input },
        }
        await writeEventToD1(deps, controlEvent)
        await deps.persistEvent('control_request', { requestId: reqId, toolName: tc.name, input: tc.input })
        deps.broadcast?.({ type: 'control_request', requestId: reqId, toolName: tc.name, input: tc.input })

        const toolMsg: LoopMessage = {
          role: 'tool_result',
          content: `Approval required for ${tc.name} (requestId: ${reqId}) — waiting for human. Returning error so LLM can adapt.`,
          toolCallId: tc.id,
          toolName: tc.name,
        }
        state.messages.push(toolMsg)
        await deps.persistMessage(toolMsg)
        continue
      }

      const toolUseStart = Date.now()
      try {
        const result = await dispatchTool(deps, tc.name, tc.input)
        const durationMs = Date.now() - toolUseStart
        const toolMsg: LoopMessage = {
          role: 'tool_result',
          content: typeof result === 'string' ? result : JSON.stringify(result),
          toolCallId: tc.id,
          toolName: tc.name,
        }
        state.messages.push(toolMsg)
        await deps.persistMessage(toolMsg)

        const toolUseEvent: SessionEvent = {
          type: 'tool_use',
          toolCallId: tc.id,
          toolName: tc.name,
          input: tc.input,
          result,
          durationMs,
        }
        await writeEventToD1(deps, toolUseEvent)
        await deps.persistEvent('tool_result', { toolId: tc.id, toolName: tc.name })
        deps.broadcast?.({ type: 'tool_result', toolName: tc.name, turn: state.turnCount })
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e)
        const durationMs = Date.now() - toolUseStart
        const toolMsg: LoopMessage = {
          role: 'tool_result',
          content: `Error: ${err}`,
          toolCallId: tc.id,
          toolName: tc.name,
        }
        state.messages.push(toolMsg)
        await deps.persistMessage(toolMsg)

        const toolErrorEvent: SessionEvent = {
          type: 'tool_use',
          toolCallId: tc.id,
          toolName: tc.name,
          input: tc.input,
          error: err,
          durationMs,
        }
        await writeEventToD1(deps, toolErrorEvent)
      }
    }

    onTurn?.(state)
  }

  if (state.turnCount >= MAX_TURNS) {
    const resultEvent: SessionEvent = {
      type: 'result',
      content: `Max turns reached (${state.turnCount})`,
      totalTokens: 0,
      totalCostUsd: 0,
    }
    await writeEventToD1(deps, resultEvent)
    await deps.persistEvent('max_turns', { turnCount: state.turnCount })
  }

  return state
}
