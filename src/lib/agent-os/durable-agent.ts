/**
 * Agentic loop — pure function, no DO/Workflow coupling.
 * Shape copied from pi-mono packages/agent/src/agent-loop.ts#runLoop:
 *   outer loop = steering, inner loop = tool_calls until stopReason != tool_use
 * Each turn persists to D1 agent_messages/agent_events for resume.
 */

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

export type LoopDeps = {
  modelInvoke: (messages: LoopMessage[]) => Promise<{ content: string; toolCalls?: Array<{ id: string; name: string; input: unknown }>; stopReason: string }>
  syscall: (name: string, input: unknown) => Promise<unknown>
  persistMessage: (msg: LoopMessage) => Promise<void>
  persistEvent: (type: string, payload: unknown) => Promise<void>
  broadcast?: (event: unknown) => void
  shouldBlockForApproval?: (toolName: string, input: unknown) => boolean
}

const MAX_TURNS = 30

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
    await deps.persistEvent('assistant', { content: res.content, stopReason: res.stopReason })
    deps.broadcast?.({ type: 'assistant', content: res.content, turn: state.turnCount })

    if (!res.toolCalls || res.toolCalls.length === 0 || res.stopReason !== 'tool_use') {
      break
    }

    for (const tc of res.toolCalls) {
      if (deps.shouldBlockForApproval?.(tc.name, tc.input)) {
        const reqId = `appr_${Date.now()}_${tc.id}`
        state.pendingApprovals.set(reqId, { toolName: tc.name, input: tc.input })
        await deps.persistEvent('control_request', { requestId: reqId, toolName: tc.name, input: tc.input })
        deps.broadcast?.({ type: 'control_request', requestId: reqId, toolName: tc.name, input: tc.input })
        // For draft-only CCR console: synthesize deny so loop continues; human can approve next turn via steering
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

      try {
        const result = await deps.syscall(tc.name, tc.input)
        const toolMsg: LoopMessage = {
          role: 'tool_result',
          content: typeof result === 'string' ? result : JSON.stringify(result),
          toolCallId: tc.id,
          toolName: tc.name,
        }
        state.messages.push(toolMsg)
        await deps.persistMessage(toolMsg)
        await deps.persistEvent('tool_result', { toolId: tc.id, toolName: tc.name })
        deps.broadcast?.({ type: 'tool_result', toolName: tc.name, turn: state.turnCount })
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e)
        const toolMsg: LoopMessage = { role: 'tool_result', content: `Error: ${err}`, toolCallId: tc.id, toolName: tc.name }
        state.messages.push(toolMsg)
        await deps.persistMessage(toolMsg)
      }
    }

    onTurn?.(state)
  }

  if (state.turnCount >= MAX_TURNS) {
    await deps.persistEvent('max_turns', { turnCount: state.turnCount })
  }

  return state
}
