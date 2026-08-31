---
title: "pi-mono Deep Dive 4: Agent Loop — Double-Loop & Event Flow, From Steering to Follow-up Complete Timeline"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, agent-loop, event-driven, streaming, tool-execution]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 4
tldr: "Heart of pi-agent-core: agentLoop() → runLoop() double while(true). Inner loop handles tool calls + steering messages; Outer loop handles follow-up + prepareNextTurn (compaction, model switch). Enter = steering (inject after current tool), Alt+Enter = follow-up (inject after agent stops). streamAssistantResponse() partial message updates, tool call parsing, parallel/sequential execution, before/after hooks."
description: "Deep dive into pi-agent-core Agent Loop core logic (~800 lines). Dissects agentLoop/agentLoopContinue entry points, runLoop double-loop architecture, EventStream event flow, streamAssistantResponse partial message updates, executeToolCalls parallel/sequential dispatch, beforeToolCall/afterToolCall hook interception, prepareNextTurn compaction/model switch integration, shouldStopAfterTurn termination logic. Includes timeline diagrams and state machine. For engineers researching AI Agent Runtime core loop design."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-agent-loop-double-while)

## TL;DR

- **Entry Points**: `agentLoop(prompts, context, config, signal, streamFn)`, `agentLoopContinue(context, config, signal, streamFn)`
- **Core**: `runLoop()` double `while(true)` — Inner handles tool calls + steering, Outer handles follow-up + prepareNextTurn
- **Steering (Enter)**: `getSteeringMessages()` → inject after current tool, before next LLM call
- **Follow-up (Alt+Enter)**: `getFollowUpMessages()` → inject after agent decides to stop
- **prepareNextTurn**: Compaction trigger, Model Switch, Context Transform, Steering collection
- **Streaming**: `streamAssistantResponse()` handles `text_delta`/`thinking_delta`/`toolcall_delta` partial updates
- **Tool Execution**: `executeToolCalls()` parallel/sequential + `beforeToolCall`/`afterToolCall` hooks
- **Termination**: `shouldStopAfterTurn()` decision, Error/Abort/Length truncation handling

---

## Overall Architecture: Agent Loop in the System

```
┌─────────────────────────────────────────────────────────────────┐
│                     pi-coding-agent (CLI)                        │
│  InteractiveMode → AgentSession → agentLoop()                   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   pi-agent-core (Agent Runtime)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      agentLoop()                           │  │
│  │  └─ runLoop() ── Double While Loop                        │  │
│  │       ├─ Inner: tool calls + steering                     │  │
│  │       └─ Outer: follow-up + prepareNextTurn               │  │
│  │  └─ EventStream<AgentEvent, AgentMessage[]>               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           │                                      │
│           ┌───────────────┼───────────────┐                      │
│           ▼               ▼               ▼                      │
│     streamFunction   executeToolCalls  Telemetry                │
│     (pi-ai)          (parallel/seq)    (pi-telemetry)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Entry Functions: Two Ways to Start

### 1. `agentLoop()`: New Conversation or Continue with Prompts

```typescript
// packages/agent/src/agent-loop.ts
export function agentLoop(
  prompts: AgentMessage[],           // New user messages
  context: AgentContext,             // Existing context (history, tools, systemPrompt)
  config: AgentLoopConfig,           // Model, tools, hooks config
  signal: AbortSignal | undefined,   // Abort signal
  streamFn: StreamFn,                // pi-ai streamFunction
): EventStream<AgentEvent, AgentMessage[]> {
  const stream = createAgentStream();  // Internal EventStream

  void runAgentLoop(
    prompts,
    context,
    config,
    async (event) => stream.push(event),  // Push events to stream
    signal,
    streamFn,
  ).then((messages) => stream.end(messages));  // End with all new messages

  return stream;  // Return stream immediately, caller can for await events
}
```

### 2. `agentLoopContinue()`: Retry / Continue Without New Prompt

```typescript
export function agentLoopContinue(
  context: AgentContext,             // Must have messages, last not assistant
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  streamFn: StreamFn,
): EventStream<AgentEvent, AgentMessage[]> {
  // Validation: context not empty, last message not assistant
  if (context.messages.length === 0) throw new Error("Cannot continue: no messages");
  if (context.messages[context.messages.length - 1].role === "assistant")
    throw new Error("Cannot continue from message role: assistant");

  const stream = createAgentStream();
  void runAgentLoopContinue(context, config, ...).then((messages) => stream.end(messages));
  return stream;
}
```

> **Key Difference**: `agentLoop` appends `prompts` to context; `agentLoopContinue` uses existing context directly (for retry, when tool results already in context).

---

## EventStream: Event Flow Container

```typescript
// packages/agent/src/agent-loop.ts
function createAgentStream(): EventStream<AgentEvent, AgentMessage[]> {
  return new EventStream<AgentEvent, AgentMessage[]>(
    (event: AgentEvent) => event.type === "agent_end",  // Termination condition
    (event: AgentEvent) => (event.type === "agent_end" ? event.messages : []),  // Result extraction
  );
}
```

- **Purpose**: Wraps async event stream into `for await`-able interface
- **Termination**: On `agent_end` event
- **Result**: `messages: AgentMessage[]` carried by `agent_end`

---

## runLoop(): Double-Loop Core (~400 lines)

```typescript
async function runLoop(
  initialContext: AgentContext,
  newMessages: AgentMessage[],
  initialConfig: AgentLoopConfig,
  signal: AbortSignal | undefined,
  emit: AgentEventSink,
  streamFunction: StreamFn,
): Promise<void> {
  let currentContext = initialContext;
  let config = initialConfig;
  let lastCompletedTurn: PrepareNextTurnContext | undefined;
  let pendingMessages: AgentMessage[] = (await config.getSteeringMessages?.()) || [];

  // ========== Outer Loop: Continue on follow-up ==========
  while (true) {
    let hasMoreToolCalls = true;

    // ========== Inner Loop: Tool calls + Steering ==========
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      // 1. Prepare next turn (compaction, model switch, collect steering)
      if (lastCompletedTurn) {
        const nextTurnSnapshot = await config.prepareNextTurn?.(lastCompletedTurn);
        if (nextTurnSnapshot) {
          currentContext = nextTurnSnapshot.context ?? currentContext;
          config = { ...config, model: nextTurnSnapshot.model ?? config.model, ... };
        }
        if (pendingMessages.length === 0) {
          pendingMessages = (await config.getSteeringMessages?.()) || [];
        }
        await emit({ type: "turn_start" });
      }

      // 2. Process pending messages (steering/follow-up injection)
      if (pendingMessages.length > 0) {
        for (const message of pendingMessages) {
          await emit({ type: "message_start", message });
          await emit({ type: "message_end", message });
          currentContext.messages.push(message);
          newMessages.push(message);
        }
        pendingMessages = [];
      }

      // 3. Stream LLM response
      const message = await streamAssistantResponse(currentContext, config, signal, emit, streamFunction);
      newMessages.push(message);

      // Error/Abort → immediate end
      if (message.stopReason === "error" || message.stopReason === "aborted") {
        await emit({ type: "turn_end", message, toolResults: [] });
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }

      // 4. Check for tool calls
      const toolCalls = message.content.filter((c) => c.type === "toolCall");
      const toolResults: ToolResultMessage[] = [];
      hasMoreToolCalls = false;

      if (toolCalls.length > 0) {
        // Truncation protection: output token limit → all tool calls fail
        const executedToolBatch = message.stopReason === "length"
          ? await failToolCallsFromTruncatedMessage(toolCalls, emit)
          : await executeToolCalls(currentContext, message, config, signal, emit);

        toolResults.push(...executedToolBatch.messages);
        hasMoreToolCalls = !executedToolBatch.terminate;

        for (const result of toolResults) {
          currentContext.messages.push(result);
          newMessages.push(result);
        }
      }

      // 5. Emit turn_end, record lastCompletedTurn
      await emit({ type: "turn_end", message, toolResults });
      lastCompletedTurn = { message, toolResults, context: currentContext, newMessages };

      // 6. Check if should stop
      if (await config.shouldStopAfterTurn?.(lastCompletedTurn)) {
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }

      // 7. Collect steering messages for next inner iteration
      pendingMessages = (await config.getSteeringMessages?.()) || [];
    }

    // ========== Outer Loop End: Agent Would Stop Here ==========
    // Check follow-up messages (Alt+Enter)
    const followUpMessages = (await config.getFollowUpMessages?.()) || [];
    if (followUpMessages.length > 0) {
      pendingMessages = followUpMessages;
      continue;  // Back to Outer Loop start, Inner Loop will process them
    }

    // No follow-up, truly done
    break;
  }

  await emit({ type: "agent_end", messages: newMessages });
}
```

---

## Timeline: Complete Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         runLoop() Double Loop                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Outer Loop (while true)                                                     │
│  │                                                                           │
│  │  ┌── Inner Loop (while hasMoreToolCalls || pendingMessages)             │
│  │  │                                                                        │
│  │  │  [prepareNextTurn] ──→ Compaction? Model Switch? Context Transform?  │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [Steering Messages] ──→ Inject after current tool, before next LLM  │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [streamAssistantResponse] ──→ LLM Streaming                         │
│  │  │       │           │                                                    │
│  │  │       │           ├─ text_delta / thinking_delta / toolcall_delta    │
│  │  │       │           │         → Partial Update → emit message_update   │
│  │  │       │           │                                                    │
│  │  │       │           └─ done / error → Final Message                     │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [Tool Calls?] ──→ executeToolCalls()                                │
│  │  │       │           ├─ beforeToolCall hook (can block, terminate)      │
│  │  │       │           ├─ Parallel / Sequential Execution                  │
│  │  │       │           ├─ Tool Executing → emit tool_execution_update     │
│  │  │       │           ├─ afterToolCall hook (can patch result, terminate) │
│  │  │       │           └─ Produce ToolResultMessage                        │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [turn_end] ──→ lastCompletedTurn Recorded                           │
│  │  │       │                                                                │
│  │  │       ├─ shouldStopAfterTurn? ──→ True: agent_end, Return            │
│  │  │       │                                                                │
│  │  │       └─ getSteeringMessages() ──→ pendingMessages (Next Inner)     │
│  │  │                                                                        │
│  │  └── Inner Loop Ends (no tool calls, no pending)                        │
│  │       │                                                                │
│  │       ▼                                                                │
│  │  [getFollowUpMessages] ──→ Follow-up (Alt+Enter)                       │
│  │       │                                                                │
│  │       ├─ Has follow-up: pendingMessages = followUp, Continue Outer     │
│  │       │                                                                │
│  │       └─ No follow-up: Break Outer, agent_end                          │
│  │                                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Phase Deep Dive

### 1. `streamAssistantResponse()`: Partial Message Update Mechanism

```typescript
async function streamAssistantResponse(
  context: AgentContext,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  emit: AgentEventSink,
  streamFunction: StreamFn,
): Promise<AssistantMessage> {
  // 1. Context Transform (optional: compaction, RAG injection)
  let messages = context.messages;
  if (config.transformContext) {
    messages = await config.transformContext(messages, signal);
  }

  // 2. Convert to LLM format (AgentMessage[] → Message[])
  const llmMessages = await config.convertToLlm(messages);

  // 3. Build LLM Context
  const llmContext: Context = {
    systemPrompt: context.systemPrompt,
    messages: llmMessages,
    tools: context.tools,
  };

  // 4. Resolve API Key (supports expiring token refresh)
  const resolvedApiKey = (config.getApiKey ? await config.getApiKey(config.model.provider) : undefined) || config.apiKey;

  // 5. Call pi-ai streamFunction
  const response = await streamFunction(config.model, llmContext, { ...config, apiKey: resolvedApiKey, signal });

  let partialMessage: AssistantMessage | null = null;
  let addedPartial = false;

  // 6. Process Stream Events
  for await (const event of response) {
    switch (event.type) {
      case "start":
        partialMessage = event.partial;
        context.messages.push(partialMessage);  // Add to context for updates
        addedPartial = true;
        await emit({ type: "message_start", message: { ...partialMessage } });
        break;

      case "text_delta":
      case "thinking_delta":
      case "toolcall_delta":
        if (partialMessage) {
          partialMessage = event.partial;
          context.messages[context.messages.length - 1] = partialMessage;  // In-place update
          await emit({
            type: "message_update",
            assistantMessageEvent: event,
            message: { ...partialMessage },
          });
        }
        break;

      case "done":
      case "error": {
        const finalMessage = await response.result();
        if (addedPartial) {
          context.messages[context.messages.length - 1] = finalMessage;  // Replace partial
        } else {
          context.messages.push(finalMessage);
        }
        if (!addedPartial) await emit({ type: "message_start", message: { ...finalMessage } });
        await emit({ type: "message_end", message: finalMessage });
        return finalMessage;
      }
    }
  }

  // Fallback: response ends without done/error event
  const finalMessage = await response.result();
  // ... Same handling
  return finalMessage;
}
```

**Key Design**:
- `partialMessage` updated in-place at `context.messages` last position
- Every delta emits `message_update` for real-time TUI rendering
- `done` uses `response.result()` for final complete message

### 2. `executeToolCalls()`: Parallel vs Sequential + Hooks

```typescript
async function executeToolCalls(
  currentContext: AgentContext,
  assistantMessage: AssistantMessage,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  emit: AgentEventSink,
): Promise<ExecutedToolCallBatch> {
  const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
  const hasSequentialToolCall = toolCalls.some(
    (tc) => currentContext.tools?.find((t) => t.name === tc.name)?.executionMode === "sequential"
  );

  // Decide execution mode
  if (config.toolExecution === "sequential" || hasSequentialToolCall) {
    return executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config, signal, emit);
  }
  return executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config, signal, emit);
}
```

#### Sequential Execution (One by One, Await Each)

```typescript
async function executeToolCallsSequential(...) {
  const finalizedCalls: FinalizedToolCallOutcome[] = [];
  const messages: ToolResultMessage[] = [];

  for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", toolCallId: toolCall.id, toolName: toolCall.name, args: toolCall.arguments });

    // Prepare: Validate args, beforeToolCall hook
    const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config, signal);
    let finalized: FinalizedToolCallOutcome;

    if (preparation.kind === "immediate") {
      finalized = { toolCall, result: preparation.result, isError: preparation.isError };
    } else {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      finalized = await finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config, signal);
    }

    await emitToolExecutionEnd(finalized, emit);
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    finalizedCalls.push(finalized);
    messages.push(toolResultMessage);

    if (signal?.aborted) break;
  }
  return { messages, terminate: shouldTerminateToolBatch(finalizedCalls) };
}
```

#### Parallel Execution (Launch All, Promise.all Wait)

```typescript
async function executeToolCallsParallel(...) {
  const finalizedCalls: FinalizedToolCallEntry[] = [];  // Can be functions (lazy)

  for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", ... });

    const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config, signal);
    if (preparation.kind === "immediate") {
      // Immediate result (e.g., beforeToolCall block, tool not found)
      const finalized = { toolCall, result: preparation.result, isError: preparation.isError };
      await emitToolExecutionEnd(finalized, emit);
      finalizedCalls.push(finalized);
      continue;
    }

    // Deferred execution: wrap as function for later Promise.all
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      return finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config, signal);
    });
  }

  // Parallel await all deferred executions
  const orderedFinalizedCalls = await Promise.all(
    finalizedCalls.map(entry => typeof entry === "function" ? entry() : Promise.resolve(entry))
  );

  // Emit results in order (preserve order)
  const messages: ToolResultMessage[] = [];
  for (const finalized of orderedFinalizedCalls) {
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    messages.push(toolResultMessage);
  }
  return { messages, terminate: shouldTerminateToolBatch(orderedFinalizedCalls) };
}
```

### 3. `prepareToolCall()`: Validation + Before Hook

```typescript
async function prepareToolCall(
  currentContext: AgentContext,
  assistantMessage: AssistantMessage,
  toolCall: AgentToolCall,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
): Promise<PreparedToolCall | ImmediateToolCallOutcome> {
  // 1. Find tool definition
  const tool = currentContext.tools?.find((t) => t.name === toolCall.name);
  if (!tool) return immediateError(`Tool ${toolCall.name} not found`);

  // 2. Argument preprocessing (tool.prepareArguments)
  const preparedToolCall = tool.prepareArguments ? tool.prepareArguments(toolCall) : toolCall;

  // 3. Argument Validation (JSON Schema)
  const validatedArgs = validateToolArguments(tool, preparedToolCall);

  // 4. beforeToolCall Hook (Can Block, Can Terminate)
  if (config.beforeToolCall) {
    const beforeResult = await config.beforeToolCall({
      assistantMessage, toolCall, args: validatedArgs, context: currentContext
    }, signal);
    if (beforeResult?.block) {
      return immediateError(beforeResult.reason || "Blocked", beforeResult.terminate);
    }
  }

  // 5. Return PreparedToolCall, Await Execution
  return { kind: "prepared", toolCall, tool, args: validatedArgs };
}
```

**Before Hook Uses**: Permission checks, argument correction, dynamic context injection, conditional blocking.

### 4. `afterToolCall` Hook: Result Post-Processing

```typescript
// In finalizeExecutedToolCall
if (config.afterToolCall) {
  const afterResult = await config.afterToolCall({
    assistantMessage, toolCall: prepared.toolCall, args: prepared.args,
    result, isError, context: currentContext
  }, signal);
  if (afterResult) {
    result = { ...result, content: afterResult.content ?? result.content, ... };
    isError = afterResult.isError ?? isError;
  }
}
```

**After Hook Uses**: Result transformation, error compensation, telemetry logging, side-effect triggers.

### 5. `prepareNextTurn()`: Compaction, Model Switch, Context Transform

```typescript
// AgentLoopConfig.prepareNextTurn Signature
prepareNextTurn?: (turn: PrepareNextTurnContext) => Promise<NextTurnSnapshot | undefined>;

// NextTurnSnapshot
interface NextTurnSnapshot {
  context?: AgentContext;           // New context (post-compaction)
  model?: ModelConfig;              // New model (model switch)
  thinkingLevel?: "low"|"medium"|"high"|"off";  // Thinking level change
}
```

**pi-coding-agent Implementation** (`packages/coding-agent/src/core/agent-session.ts`):

```typescript
prepareNextTurn: async (turn) => {
  // 1. Check if compaction needed
  const shouldCompact = await this.shouldCompact(turn.context);
  if (shouldCompact) {
    const compactionResult = await this.compact(turn.context);
    return { context: compactionResult.newContext };  // Includes compaction entry
  }

  // 2. Check model switch (user ran /model mid-conversation)
  if (this.pendingModelChange) {
    return { model: this.pendingModelChange };
  }

  // 3. Thinking level change
  if (this.pendingThinkingLevelChange) {
    return { thinkingLevel: this.pendingThinkingLevelChange };
  }

  return undefined;  // No changes
}
```

### 6. `shouldStopAfterTurn()`: Termination Decision

```typescript
// Default: Stop on end_turn/stop_sequence with no tool calls
shouldStopAfterTurn: (turn) => {
  return turn.message.stopReason === "end_turn" || turn.message.stopReason === "stop_sequence";
}

// Customizable: e.g., goal achieved, tool returns terminate=true
```

---

## Error & Edge Case Handling

| Situation | Handling |
|---|---|
| **Output Token Limit (stopReason="length")** | All tool calls marked failed, ask model to re-issue |
| **Tool Arg Validation Fails** | Immediate error tool result, no execution |
| **beforeToolCall Blocks** | Returns error, optional terminate=true forces agent end |
| **Tool Execution Throws** | Caught, produces error tool result, continues remaining tools |
| **AbortSignal Triggered** | Immediately abort stream, mark aborted, emit agent_end |
| **Stream Error Event** | Caught, emit message_end (error), emit agent_end |

---

## State Machine: Agent Loop State Transitions

```
┌─────────┐
│  START  │  (agentLoop / agentLoopContinue)
└────┬────┘
     │
     ▼
┌─────────────────┐
│ prepareNextTurn │  (compaction, model switch, collect steering)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  turn_start     │  (emit event)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Steering Msg?   ──Yes──→ Inject Messages
└────┬────────────┘
     │ No
     ▼
┌─────────────────┐
│ streamAssistant │  (LLM Streaming)
│   Response      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Tool Calls?     ──No──→ turn_end → shouldStopAfterTurn?
└────┬────────────┘                    │
     │ Yes                            ▼
     ▼                         ┌─────────────┐
┌─────────────────┐            │   True?     ──Yes──→ agent_end
│ executeToolCalls│            └──────┬──────┘
│ (parallel/seq)  │                   │ No
└────┬────────────┘                   ▼
     │                        getSteeringMessages()
     ▼                                 │
┌─────────────────┐                    ▼
│ turn_end        │            ┌─────────────┐
│ lastCompletedTurn                │ Has Pending?──Yes──→ Inner Loop Continues
└────┬────────────┘                └──────┬──────┘
     │                                     │ No
     ▼                                     ▼
┌─────────────────┐                getFollowUpMessages()
│ shouldStopAfter │                    │
│ Turn?           ──Yes──→ agent_end    ▼
└────┬────────────┘                ┌─────────────┐
     │ No                          │ Has Followup?──Yes──→ Outer Loop Continues
     ▼                              └──────┬──────┘
getFollowUpMessages()                      │ No
     │                                     ▼
     └──────────────────────────────→ agent_end
```

---

## Integration with pi-coding-agent

`AgentSession` implements `AgentLoopConfig`:

```typescript
// packages/coding-agent/src/core/agent-session.ts
const loopConfig: AgentLoopConfig = {
  model: this.modelRuntime.modelConfig,
  tools: this.getTools(),
  systemPrompt: this.buildSystemPrompt(),
  convertToLlm: this.convertToLlm.bind(this),
  transformContext: this.transformContext.bind(this),  // Compaction, RAG, etc.
  getApiKey: this.modelRuntime.getApiKey.bind(this.modelRuntime),
  reasoning: this.thinkingLevel,
  toolExecution: this.settings.toolExecution,
  beforeToolCall: this.onBeforeToolCall.bind(this),    // Trust check, Extension hook
  afterToolCall: this.onAfterToolCall.bind(this),      // Extension hook, Telemetry
  shouldStopAfterTurn: this.shouldStopAfterTurn.bind(this),
  getSteeringMessages: () => this.steeringMessages,    // Enter message queue
  getFollowUpMessages: () => this.followUpMessages,    // Alt+Enter message queue
  prepareNextTurn: this.prepareNextTurn.bind(this),    // Compaction, Model switch
};
```

---

## References

- [GitHub - earendil-works/pi — packages/agent/src/agent-loop.ts](https://github.com/earendil-works/pi/blob/main/packages/agent/src/agent-loop.ts)
- [Pi Official Docs: Agent Loop Architecture](https://pi.dev/docs/latest/architecture/agent-loop)
- [EventStream Implementation Reference](https://github.com/earendil-works/pi/blob/main/packages/ai/src/utils/event-stream.ts)
- [Agent Loop Design Pattern: Double Loop](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#agent-loop)
- [Async Iterator Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)

---

## Next Up

> **Part 5: Session Tree — Append-only, Branching, Compaction**
>
> How does SessionManager store tree structure in JSONL? How do `id`/`parentId` form a tree? How does `branch()` move leaf pointer without mutating history? How does `buildSessionContext()` handle compaction entries? How does `createBranchedSession()` fork to new file? Complete entry type breakdown: Label, Custom Entry, Session Info, etc.