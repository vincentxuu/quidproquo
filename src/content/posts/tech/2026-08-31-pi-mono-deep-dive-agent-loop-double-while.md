---
title: "pi-mono 深度導讀 4：Agent Loop——雙層循環與事件流，從 Steering 到 Follow-up 的完整時序"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, agent-loop, event-driven, streaming, tool-execution]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 4
tldr: "pi-agent-core 的心臟：agentLoop() → runLoop() 雙層 while(true)。Inner loop 處理 tool calls + steering messages，Outer loop 處理 follow-up + prepareNextTurn（compaction、model switch）。Enter = steering（當前工具跑完插入）、Alt+Enter = follow-up（agent 判定結束插入）。streamAssistantResponse() 如何處理 partial message 更新、tool call 解析、parallel/sequential 執行、before/after hooks。"
description: "深入 pi-agent-core 的 Agent Loop 核心邏輯（~800 行）。拆解 agentLoop/agentLoopContinue 入口、runLoop 雙層迴圈架構、EventStream 事件流、streamAssistantResponse 部分訊息更新機制、executeToolCalls parallel/sequential 分派、beforeToolCall/afterToolCall hook 攔截、prepareNextTurn compaction/model switch 整合、shouldStopAfterTurn 終止判斷。附帶時序圖與狀態機說明。適合研究 AI Agent Runtime 核心迴圈設計的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-agent-loop-double-while-en)

## TL;DR

- **入口**：`agentLoop(prompts, context, config, signal, streamFn)`、`agentLoopContinue(context, config, signal, streamFn)`
- **核心**：`runLoop()` 雙層 `while(true)` —— Inner 處理 tool calls + steering，Outer 處理 follow-up + prepareNextTurn
- **Steering (Enter)**：`getSteeringMessages()` → 當前工具結束、下一輪 LLM 前注入
- **Follow-up (Alt+Enter)**：`getFollowUpMessages()` → agent 判定結束後注入
- **prepareNextTurn**：Compaction 觸發、Model Switch、Context Transform、Steering 收集
- **Streaming**：`streamAssistantResponse()` 處理 `text_delta`/`thinking_delta`/`toolcall_delta` 部分更新
- **工具執行**：`executeToolCalls()` parallel/sequential + `beforeToolCall`/`afterToolCall` hooks
- **終止**：`shouldStopAfterTurn()` 判斷、Error/Abort/Length 截斷處理

---

## 整體架構：Agent Loop 在系統中的位置

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

## 入口函數：兩種啟動方式

### 1. `agentLoop()`：新對話或續接 prompts

```typescript
// packages/agent/src/agent-loop.ts
export function agentLoop(
  prompts: AgentMessage[],           // 新的 user messages
  context: AgentContext,             // 現有上下文（含 history、tools、systemPrompt）
  config: AgentLoopConfig,           // 模型、工具、hooks 等設定
  signal: AbortSignal | undefined,   // 中斷信號
  streamFn: StreamFn,                // pi-ai 的 streamFunction
): EventStream<AgentEvent, AgentMessage[]> {
  const stream = createAgentStream();  // 內部 EventStream

  void runAgentLoop(
    prompts,
    context,
    config,
    async (event) => stream.push(event),  // 事件推送到 stream
    signal,
    streamFn,
  ).then((messages) => stream.end(messages));  // 結束時返回所有新訊息

  return stream;  // 立即返回 stream，呼叫端可 for await 事件
}
```

### 2. `agentLoopContinue()`：Retry / 續接無新 prompt

```typescript
export function agentLoopContinue(
  context: AgentContext,             // 必須有 messages，最後一條非 assistant
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  streamFn: StreamFn,
): EventStream<AgentEvent, AgentMessage[]> {
  // 驗證：context 不能為空、最後一條不能是 assistant
  if (context.messages.length === 0) throw new Error("Cannot continue: no messages");
  if (context.messages[context.messages.length - 1].role === "assistant")
    throw new Error("Cannot continue from message role: assistant");

  const stream = createAgentStream();
  void runAgentLoopContinue(context, config, ...).then((messages) => stream.end(messages));
  return stream;
}
```

> **關鍵差異**：`agentLoop` 將 `prompts` 追加到 context；`agentLoopContinue` 直接用現有 context（適用於 retry、tool result 已在 context 時）。

---

## EventStream：事件流的容器

```typescript
// packages/agent/src/agent-loop.ts
function createAgentStream(): EventStream<AgentEvent, AgentMessage[]> {
  return new EventStream<AgentEvent, AgentMessage[]>(
    (event: AgentEvent) => event.type === "agent_end",  // 結束條件
    (event: AgentEvent) => (event.type === "agent_end" ? event.messages : []),  // 結果提取
  );
}
```

- **作用**：將非同步事件流包裝成可 `for await` 的介面
- **結束條件**：收到 `agent_end` 事件
- **結果**：`agent_end` 事件攜帶的 `messages: AgentMessage[]`

---

## runLoop()：雙層迴圈核心（~400 行）

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

  // ========== Outer Loop: 當 follow-up 到來時繼續 ==========
  while (true) {
    let hasMoreToolCalls = true;

    // ========== Inner Loop: 工具呼叫 + Steering ==========
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      // 1. 準備下一輪（compaction、model switch、收集 steering）
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

      // 2. 處理 pending messages（steering/follow-up 注入）
      if (pendingMessages.length > 0) {
        for (const message of pendingMessages) {
          await emit({ type: "message_start", message });
          await emit({ type: "message_end", message });
          currentContext.messages.push(message);
          newMessages.push(message);
        }
        pendingMessages = [];
      }

      // 3. 串流 LLM 回應
      const message = await streamAssistantResponse(currentContext, config, signal, emit, streamFunction);
      newMessages.push(message);

      // 錯誤/中斷直接結束
      if (message.stopReason === "error" || message.stopReason === "aborted") {
        await emit({ type: "turn_end", message, toolResults: [] });
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }

      // 4. 檢查工具呼叫
      const toolCalls = message.content.filter((c) => c.type === "toolCall");
      const toolResults: ToolResultMessage[] = [];
      hasMoreToolCalls = false;

      if (toolCalls.length > 0) {
        // 截斷保護：output token limit 導致的截斷，所有 tool call 視為失敗
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

      // 5. 發送 turn_end，記錄 lastCompletedTurn
      await emit({ type: "turn_end", message, toolResults });
      lastCompletedTurn = { message, toolResults, context: currentContext, newMessages };

      // 6. 檢查是否應停止
      if (await config.shouldStopAfterTurn?.(lastCompletedTurn)) {
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }

      // 7. 收集下一輪的 steering messages
      pendingMessages = (await config.getSteeringMessages?.()) || [];
    }

    // ========== Outer Loop 結束點：Agent 本會結束 ==========
    // 檢查 follow-up messages（Alt+Enter）
    const followUpMessages = (await config.getFollowUpMessages?.()) || [];
    if (followUpMessages.length > 0) {
      pendingMessages = followUpMessages;
      continue;  // 回到 Outer Loop 開頭，Inner Loop 會處理它們
    }

    // 沒有 follow-up，真正結束
    break;
  }

  await emit({ type: "agent_end", messages: newMessages });
}
```

---

## 時序圖：完整生命週期

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         runLoop() 雙層迴圈                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Outer Loop (while true)                                                     │
│  │                                                                           │
│  │  ┌── Inner Loop (while hasMoreToolCalls || pendingMessages)             │
│  │  │                                                                        │
│  │  │  [prepareNextTurn] ──→ Compaction? Model Switch? Context Transform?  │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [Steering Messages] ──→ 當前工具結束、下一輪 LLM 前注入             │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [streamAssistantResponse] ──→ LLM 串流生成                          │
│  │  │       │           │                                                    │
│  │  │       │           ├─ text_delta / thinking_delta / toolcall_delta    │
│  │  │       │           │         → 部分訊息更新 → emit message_update     │
│  │  │       │           │                                                    │
│  │  │       │           └─ done / error → 完成訊息                         │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [Tool Calls?] ──→ executeToolCalls()                                │
│  │  │       │           ├─ beforeToolCall hook（可阻擋、終止）              │
│  │  │       │           ├─ Parallel / Sequential 執行                       │
│  │  │       │           ├─ 工具執行中 → emit tool_execution_update          │
│  │  │       │           ├─ afterToolCall hook（可修改結果、終止）           │
│  │  │       │           └─ 產生 ToolResultMessage                          │
│  │  │       │                                                                │
│  │  │       ▼                                                                │
│  │  │  [turn_end] ──→ lastCompletedTurn 記錄                               │
│  │  │       │                                                                │
│  │  │       ├─ shouldStopAfterTurn? ──→ true: agent_end, return            │
│  │  │       │                                                                │
│  │  │       └─ getSteeringMessages() ──→ pendingMessages (下一輪 Inner)   │
│  │  │                                                                        │
│  │  └── Inner Loop 結束（無 tool calls、無 pending）                        │
│  │       │                                                                │
│  │       ▼                                                                │
│  │  [getFollowUpMessages] ──→ Follow-up (Alt+Enter)                       │
│  │       │                                                                │
│  │       ├─ 有 follow-up: pendingMessages = followUp, continue Outer      │
│  │       │                                                                │
│  │       └─ 無 follow-up: break Outer, agent_end                          │
│  │                                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 關鍵階段深度解析

### 1. `streamAssistantResponse()`：部分訊息更新機制

```typescript
async function streamAssistantResponse(
  context: AgentContext,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  emit: AgentEventSink,
  streamFunction: StreamFn,
): Promise<AssistantMessage> {
  // 1. Context Transform（可選：compaction、RAG 注入等）
  let messages = context.messages;
  if (config.transformContext) {
    messages = await config.transformContext(messages, signal);
  }

  // 2. 轉換為 LLM 格式（AgentMessage[] → Message[]）
  const llmMessages = await config.convertToLlm(messages);

  // 3. 建構 LLM Context
  const llmContext: Context = {
    systemPrompt: context.systemPrompt,
    messages: llmMessages,
    tools: context.tools,
  };

  // 4. 解析 API Key（支援過期 token 刷新）
  const resolvedApiKey = (config.getApiKey ? await config.getApiKey(config.model.provider) : undefined) || config.apiKey;

  // 5. 呼叫 pi-ai streamFunction
  const response = await streamFunction(config.model, llmContext, { ...config, apiKey: resolvedApiKey, signal });

  let partialMessage: AssistantMessage | null = null;
  let addedPartial = false;

  // 6. 處理串流事件
  for await (const event of response) {
    switch (event.type) {
      case "start":
        partialMessage = event.partial;
        context.messages.push(partialMessage);  // 加入 context 以便後續更新
        addedPartial = true;
        await emit({ type: "message_start", message: { ...partialMessage } });
        break;

      case "text_delta":
      case "thinking_delta":
      case "toolcall_delta":
        if (partialMessage) {
          partialMessage = event.partial;
          context.messages[context.messages.length - 1] = partialMessage;  // 就地更新
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
          context.messages[context.messages.length - 1] = finalMessage;  // 替換 partial
        } else {
          context.messages.push(finalMessage);
        }
        if (!addedPartial) await emit({ type: "message_start", message: { ...finalMessage } });
        await emit({ type: "message_end", message: finalMessage });
        return finalMessage;
      }
    }
  }

  // Fallback：response 結束但沒有 done/error event
  const finalMessage = await response.result();
  // ... 同樣處理
  return finalMessage;
}
```

**關鍵設計**：
- `partialMessage` 就地更新 `context.messages` 最後一個位置
- 每個 delta 都 emit `message_update`，TUI 即時渲染
- `done` 時用 `response.result()` 取得最終完整訊息

### 2. `executeToolCalls()`：Parallel vs Sequential + Hooks

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

  // 決定執行模式
  if (config.toolExecution === "sequential" || hasSequentialToolCall) {
    return executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config, signal, emit);
  }
  return executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config, signal, emit);
}
```

#### Sequential 執行（逐個、等待完成）

```typescript
async function executeToolCallsSequential(...) {
  const finalizedCalls: FinalizedToolCallOutcome[] = [];
  const messages: ToolResultMessage[] = [];

  for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", toolCallId: toolCall.id, toolName: toolCall.name, args: toolCall.arguments });

    // 準備：驗證參數、beforeToolCall hook
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

#### Parallel 執行（同時啟動、Promise.all 等待）

```typescript
async function executeToolCallsParallel(...) {
  const finalizedCalls: FinalizedToolCallEntry[] = [];  // 可為函數（lazy）

  for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", ... });

    const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config, signal);
    if (preparation.kind === "immediate") {
      // 即時結果（如 beforeToolCall block、工具不存在）
      const finalized = { toolCall, result: preparation.result, isError: preparation.isError };
      await emitToolExecutionEnd(finalized, emit);
      finalizedCalls.push(finalized);
      continue;
    }

    // 延遲執行：包成函數稍後 Promise.all
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      return finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config, signal);
    });
  }

  // 並行等待所有延遲執行
  const orderedFinalizedCalls = await Promise.all(
    finalizedCalls.map(entry => typeof entry === "function" ? entry() : Promise.resolve(entry))
  );

  // 依序 emit 結果（保持順序）
  const messages: ToolResultMessage[] = [];
  for (const finalized of orderedFinalizedCalls) {
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    messages.push(toolResultMessage);
  }
  return { messages, terminate: shouldTerminateToolBatch(orderedFinalizedCalls) };
}
```

### 3. `prepareToolCall()`：驗證 + Before Hook

```typescript
async function prepareToolCall(
  currentContext: AgentContext,
  assistantMessage: AssistantMessage,
  toolCall: AgentToolCall,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
): Promise<PreparedToolCall | ImmediateToolCallOutcome> {
  // 1. 找工具定義
  const tool = currentContext.tools?.find((t) => t.name === toolCall.name);
  if (!tool) return immediateError(`Tool ${toolCall.name} not found`);

  // 2. 參數預處理（tool.prepareArguments）
  const preparedToolCall = tool.prepareArguments ? tool.prepareArguments(toolCall) : toolCall;

  // 3. 參數驗證（JSON Schema）
  const validatedArgs = validateToolArguments(tool, preparedToolCall);

  // 4. beforeToolCall Hook（可阻擋、可終止）
  if (config.beforeToolCall) {
    const beforeResult = await config.beforeToolCall({
      assistantMessage, toolCall, args: validatedArgs, context: currentContext
    }, signal);
    if (beforeResult?.block) {
      return immediateError(beforeResult.reason || "Blocked", beforeResult.terminate);
    }
  }

  // 5. 返回 PreparedToolCall，等待執行
  return { kind: "prepared", toolCall, tool, args: validatedArgs };
}
```

**Before Hook 用途**：權限確認、參數修正、動態注入 context、條件阻擋。

### 4. `afterToolCall` Hook：結果後處理

```typescript
// 在 finalizeExecutedToolCall 中
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

**After Hook 用途**：結果轉換、錯誤補償、記錄遙測、觸發副作用。

### 5. `prepareNextTurn()`：Compaction、Model Switch、Context Transform

```typescript
// AgentLoopConfig.prepareNextTurn 簽名
prepareNextTurn?: (turn: PrepareNextTurnContext) => Promise<NextTurnSnapshot | undefined>;

// NextTurnSnapshot
interface NextTurnSnapshot {
  context?: AgentContext;           // 新 context（compaction 後）
  model?: ModelConfig;              // 新模型（model switch）
  thinkingLevel?: "low"|"medium"|"high"|"off";  // thinking 等級變更
}
```

**pi-coding-agent 的實作**（`packages/coding-agent/src/core/agent-session.ts`）：

```typescript
prepareNextTurn: async (turn) => {
  // 1. 檢查是否需要 compaction
  const shouldCompact = await this.shouldCompact(turn.context);
  if (shouldCompact) {
    const compactionResult = await this.compact(turn.context);
    return { context: compactionResult.newContext };  // 包含 compaction entry
  }

  // 2. 檢查模型切換（用戶在對話中 /model）
  if (this.pendingModelChange) {
    return { model: this.pendingModelChange };
  }

  // 3. Thinking level 變更
  if (this.pendingThinkingLevelChange) {
    return { thinkingLevel: this.pendingThinkingLevelChange };
  }

  return undefined;  // 無變更
}
```

### 6. `shouldStopAfterTurn()`：終止判斷

```typescript
// 預設實作：stopReason 為 end_turn/stop_sequence 且無 tool calls 時停止
shouldStopAfterTurn: (turn) => {
  return turn.message.stopReason === "end_turn" || turn.message.stopReason === "stop_sequence";
}

// 也可自訂：例如達成特定目標、工具回傳 terminate=true
```

---

## 錯誤與邊界處理

| 情況 | 處理方式 |
|---|---|
| **Output token limit (stopReason="length")** | 所有 tool calls 標記為失敗、要求模型重發 |
| **Tool 參數驗證失敗** | 即時回傳 error tool result、不執行工具 |
| **beforeToolCall block** | 回傳 error、可選 terminate=true 強制結束 agent |
| **工具執行拋出錯誤** | 捕獲、產生 error tool result、繼續後續工具 |
| **AbortSignal 觸發** | 立即中斷串流、標記 aborted、emit agent_end |
| **Stream error event** | 捕獲、emit message_end (error)、emit agent_end |

---

## 狀態機：Agent Loop 狀態轉換

```
┌─────────┐
│  START  │  (agentLoop / agentLoopContinue)
└────┬────┘
     │
     ▼
┌─────────────────┐
│ prepareNextTurn │  (compaction, model switch, steering 收集)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  turn_start     │  (emit event)
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Steering Messages?  ──Yes──→ inject messages
└────┬────────────┘
     │ No
     ▼
┌─────────────────┐
│ streamAssistant │  (LLM 串流)
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
│ lastCompletedTurn                │ Has pending?──Yes──→ Inner Loop 繼續
└────┬────────────┘                └──────┬──────┘
     │                                     │ No
     ▼                                     ▼
┌─────────────────┐                getFollowUpMessages()
│ shouldStopAfter │                    │
│ Turn?           ──Yes──→ agent_end    ▼
└────┬────────────┘                ┌─────────────┐
     │ No                          │ Has followup?──Yes──→ Outer Loop 繼續
     ▼                              └──────┬──────┘
getFollowUpMessages()                      │ No
     │                                     ▼
     └──────────────────────────────→ agent_end
```

---

## 與 pi-coding-agent 的整合

`AgentSession` 類別實作 `AgentLoopConfig`：

```typescript
// packages/coding-agent/src/core/agent-session.ts
const loopConfig: AgentLoopConfig = {
  model: this.modelRuntime.modelConfig,
  tools: this.getTools(),
  systemPrompt: this.buildSystemPrompt(),
  convertToLlm: this.convertToLlm.bind(this),
  transformContext: this.transformContext.bind(this),  // compaction、RAG 等
  getApiKey: this.modelRuntime.getApiKey.bind(this.modelRuntime),
  reasoning: this.thinkingLevel,
  toolExecution: this.settings.toolExecution,
  beforeToolCall: this.onBeforeToolCall.bind(this),    // Trust check、Extension hook
  afterToolCall: this.onAfterToolCall.bind(this),      // Extension hook、遙測
  shouldStopAfterTurn: this.shouldStopAfterTurn.bind(this),
  getSteeringMessages: () => this.steeringMessages,    // Enter 訊息隊列
  getFollowUpMessages: () => this.followUpMessages,    // Alt+Enter 訊息隊列
  prepareNextTurn: this.prepareNextTurn.bind(this),    // Compaction、Model switch
};
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/agent/src/agent-loop.ts](https://github.com/earendil-works/pi/blob/main/packages/agent/src/agent-loop.ts)
- [Pi 官方文件：Agent Loop 架構](https://pi.dev/docs/latest/architecture/agent-loop)
- [EventStream 實作參考](https://github.com/earendil-works/pi/blob/main/packages/ai/src/utils/event-stream.ts)
- [Agent Loop 設計模式：雙層迴圈](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#agent-loop)
- [非同步迭代器模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)

---

## 下一篇預告

> **第 5 篇：Session Tree：Append-only、Branching、Compaction**
>
> SessionManager 如何用 JSONL 存樹狀結構？`id`/`parentId` 如何形成 tree？`branch()` 如何移動 leaf pointer 而不改歷史？`buildSessionContext()` 如何處理 compaction entry？`createBranchedSession()` 如何 fork 到新檔案？Label、Custom Entry、Session Info 等 entry 類型完整說明。