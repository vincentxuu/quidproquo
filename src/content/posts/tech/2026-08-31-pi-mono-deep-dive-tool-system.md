---
title: "pi-mono 深度導讀 6：Tool System——8 核心工具定義、Factory 模式、Parallel/Sequential 執行、Before/After Hooks 攔截"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, tool-system, parallel-execution, hooks, file-mutation-queue]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 6
tldr: "pi-coding-agent 8 核心工具完整解析：ToolDefinition（給 LLM 看）vs AgentTool（執行邏輯）、createToolDefinition/createTool Factory、executionMode 決定 parallel/sequential、beforeToolCall/afterToolCall 攔截鏈、withFileMutationQueue 序列化檔案寫入、truncateHead/Line/Tail 輸出截斷、read/write/edit/bash/grep/find/ls/powershell 各工具實作細節。"
description: "深入 pi-coding-agent 工具系統：從定義到執行的完整鏈路。涵蓋 ToolDefinition（JSON Schema + 描述）、AgentTool（execute + prepareArguments + executionMode）、8 種工具的具體實作、工具執行器的 parallel/sequential 分派、beforeToolCall/afterToolCall hook 機制與攔截點、File Mutation Queue 避免競態、輸出截斷策略、權限與信任檢查整合。適合研究 Agent Tool Calling 架構、工具系統設計的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-tool-system-en)

## TL;DR

- **雙層定義**：`ToolDefinition`（給 LLM、含 JSON Schema）vs `AgentTool`（執行邏輯、含 execute/prepareArguments/executionMode）
- **Factory**：`createToolDefinition()`/`createTool()` 從名稱建立、統一介面
- **8 核心工具**：read、write、edit、bash、grep、find、ls、powershell
- **執行模式**：`executionMode: "parallel" | "sequential"` 預設 parallel、工具可覆蓋
- **Hook 鏈**：`beforeToolCall`（可阻擋、終止）→ 執行 → `afterToolCall`（可修改結果、終止）
- **File Mutation Queue**：序列化同檔案寫入、避免競態
- **截斷**：`truncateHead/Line/Tail` 大輸出保護

---

## 架構概覽：定義與執行分離

```
┌─────────────────────────────────────────────────────────────────┐
│                        Tool System                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────────────┐     │
│  │  ToolDefinition  │         │       AgentTool          │     │
│  │  (給 LLM 看)      │         │  (實際執行邏輯)           │     │
│  ├──────────────────┤         ├──────────────────────────┤     │
│  │ name: string     │         │ name: string             │     │
│  │ description: str │         │ description: string      │     │
│  │ parameters:      │         │ parameters: JSONSchema   │     │
│  │   JSONSchema     │         │ execute: (id, args,      │     │
│  │                  │         │   signal, onUpdate)      │     │
│  │                  │         │   ) => Promise<ToolResult>│     │
│  │                  │         │ prepareArguments?:       │     │
│  │                  │         │   (args) => args         │     │
│  │                  │         │ executionMode?:          │     │
│  │                  │         │   "parallel" | "sequential"│    │
│  └────────┬─────────┘         └────────────┬─────────────┘     │
│           │                                │                   │
│           ▼                                ▼                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              createToolDefinition(name, cwd, opts)       │   │
│  │              createTool(name, cwd, opts)                 │   │
│  │              createCodingToolDefinitions(cwd, opts)      │   │
│  │              createAllTools(cwd, opts)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ToolDefinition：給 LLM 的介面

```typescript
// packages/coding-agent/src/core/extensions/types.ts
export interface ToolDefinition<TArgs = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: JSONSchema;  // 標準 JSON Schema
  // 可選：給 LLM 的額外提示
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}
```

**關鍵點**：
- `parameters` 必須是有效的 JSON Schema（供 LLM 驗證參數）
- `annotations` 讓 LLM 理解工具特性（如 `destructiveHint: true` 會更謹慎）

---

## AgentTool：執行時的完整定義

```typescript
// packages/agent/src/types.ts
export interface AgentTool<TArgs = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: JSONSchema;
  // 核心執行函數
  execute: (
    toolCallId: string,
    args: TArgs,
    signal: AbortSignal,
    onUpdate: (partialResult: TResult) => void
  ) => Promise<TResult>;
  // 可選：參數預處理（如路徑解析、預設值填充）
  prepareArguments?: (args: TArgs) => TArgs;
  // 執行模式
  executionMode?: "parallel" | "sequential";
}
```

**關鍵差異**：
| 特性 | ToolDefinition | AgentTool |
|---|---|---|
| 用途 | LLM 知道怎麼呼叫 | 實際執行邏輯 |
| execute | ❌ | ✅ |
| prepareArguments | ❌ | ✅ |
| executionMode | ❌ | ✅ |
| 參數驗證 | LLM 端（Schema） | 執行前再驗證一次 |

---

## Factory 模式：統一建立入口

### 註冊表（`packages/coding-agent/src/core/tools/index.ts`）

```typescript
export type ToolName = "read" | "bash" | "powershell" | "edit" | "write" | "grep" | "find" | "ls";
export const allToolNames: Set<ToolName> = new Set([
  "read", "bash", "powershell", "edit", "write", "grep", "find", "ls"
]);

export interface ToolsOptions {
  read?: ReadToolOptions;
  bash?: BashToolOptions;
  powershell?: PowerShellToolOptions;
  write?: WriteToolOptions;
  edit?: EditToolOptions;
  grep?: GrepToolOptions;
  find?: FindToolOptions;
  ls?: LsToolOptions;
}

// 產生 ToolDefinition（給 LLM）
export function createToolDefinition(toolName: ToolName, cwd: string, options?: ToolsOptions): ToolDefinition {
  switch (toolName) {
    case "read": return createReadToolDefinition(cwd, options?.read);
    case "bash": return createBashToolDefinition(cwd, options?.bash);
    case "powershell": return createPowerShellToolDefinition(cwd, options?.powershell);
    case "edit": return createEditToolDefinition(cwd, options?.edit);
    case "write": return createWriteToolDefinition(cwd, options?.write);
    case "grep": return createGrepToolDefinition(cwd, options?.grep);
    case "find": return createFindToolDefinition(cwd, options?.find);
    case "ls": return createLsToolDefinition(cwd, options?.ls);
    default: throw new Error(`Unknown tool name: ${toolName}`);
  }
}

// 產生 AgentTool（執行用）
export function createTool(toolName: ToolName, cwd: string, options?: ToolsOptions): AgentTool {
  switch (toolName) {
    case "read": return createReadTool(cwd, options?.read);
    case "bash": return createBashTool(cwd, options?.bash);
    case "powershell": return createPowerShellTool(cwd, options?.powershell);
    case "edit": return createEditTool(cwd, options?.edit);
    case "write": return createWriteTool(cwd, options?.write);
    case "grep": return createGrepTool(cwd, options?.grep);
    case "find": return createFindTool(cwd, options?.find);
    case "ls": return createLsTool(cwd, options?.ls);
    default: throw new Error(`Unknown tool name: ${toolName}`);
  }
}

// 常用組合
export function createCodingToolDefinitions(cwd: string, options?: ToolsOptions): ToolDefinition[] {
  return [
    createReadToolDefinition(cwd, options?.read),
    createBashToolDefinition(cwd, options?.bash),
    createEditToolDefinition(cwd, options?.edit),
    createWriteToolDefinition(cwd, options?.write),
  ];
}

export function createReadOnlyToolDefinitions(cwd: string, options?: ToolsOptions): ToolDefinition[] {
  return [
    createReadToolDefinition(cwd, options?.read),
    createGrepToolDefinition(cwd, options?.grep),
    createFindToolDefinition(cwd, options?.find),
    createLsToolDefinition(cwd, options?.ls),
  ];
}

export function createAllToolDefinitions(cwd: string, options?: ToolsOptions): Record<ToolName, ToolDefinition> {
  return {
    read: createReadToolDefinition(cwd, options?.read),
    bash: createBashToolDefinition(cwd, options?.bash),
    powershell: createPowerShellToolDefinition(cwd, options?.powershell),
    edit: createEditToolDefinition(cwd, options?.edit),
    write: createWriteToolDefinition(cwd, options?.write),
    grep: createGrepToolDefinition(cwd, options?.grep),
    find: createFindToolDefinition(cwd, options?.find),
    ls: createLsToolDefinition(cwd, options?.ls),
  };
}
```

---

## 8 核心工具實作細節

### 1. Read Tool（`packages/coding-agent/src/core/tools/read.ts`）

```typescript
export interface ReadToolOptions {
  maxBytes?: number;      // 預設 1MB
  maxLines?: number;      // 預設 2000 行
  encoding?: BufferEncoding;
}

export function createReadToolDefinition(cwd: string, options?: ReadToolOptions): ToolDefinition {
  return {
    name: "read",
    description: "Read file contents. Supports text files, images, PDFs. Returns base64 for binary.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Absolute path to file" },
        offset: { type: "number", description: "Start line (0-indexed)" },
        limit: { type: "number", description: "Max lines to read" },
      },
      required: ["path"],
      additionalProperties: false,
    },
  };
}

export function createReadTool(cwd: string, options?: ReadToolOptions): AgentTool {
  return {
    name: "read",
    description: "Read file contents",
    parameters: createReadToolDefinition(cwd, options).parameters,
    execute: async (toolCallId, args, signal, onUpdate) => {
      const { path, offset = 0, limit } = args as { path: string; offset?: number; limit?: number };
      const resolvedPath = resolvePath(cwd, path);
      // ... 讀取檔案、處理編碼、截斷
      return { content: [{ type: "text", text: fileContent }], details: { size: stats.size } };
    },
  };
}
```

**特色**：
- 自動偵測編碼、支援二進位檔（base64）
- `offset`/`limit` 分頁讀取大檔案
- 圖片回傳 base64 + MIME type

### 2. Write Tool（`packages/coding-agent/src/core/tools/write.ts`）

```typescript
export interface WriteToolOptions {
  maxBytes?: number;  // 預設 10MB
}

export function createWriteTool(cwd: string, options?: WriteToolOptions): AgentTool {
  return {
    name: "write",
    description: "Write file contents. Creates parent directories. Overwrites existing.",
    parameters: { ... },
    executionMode: "sequential",  // 寫入通常要序列化
    execute: async (toolCallId, args, signal, onUpdate) => {
      const { path, content } = args as { path: string; content: string };
      const resolvedPath = resolvePath(cwd, path);
      await mkdir(dirname(resolvedPath), { recursive: true });
      await writeFile(resolvedPath, content, "utf8");
      return { content: [{ type: "text", text: `Written ${content.length} chars` }], details: {} };
    },
  };
}
```

### 3. Edit Tool（`packages/coding-agent/src/core/tools/edit.ts`）

```typescript
export interface EditToolOptions {
  maxBytes?: number;
}

export function createEditTool(cwd: string, options?: EditToolOptions): AgentTool {
  return {
    name: "edit",
    description: "Edit file by replacing a specific string. Use unique old_string for precision.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
        old_string: { type: "string", description: "Exact string to replace (include context for uniqueness)" },
        new_string: { type: "string", description: "Replacement string" },
        replace_all: { type: "boolean", default: false },
      },
      required: ["path", "old_string", "new_string"],
    },
    executionMode: "sequential",
    execute: async (toolCallId, args, signal, onUpdate) => {
      const { path, old_string, new_string, replace_all = false } = args;
      const resolvedPath = resolvePath(cwd, path);
      let content = await readFile(resolvedPath, "utf8");
      
      if (replace_all) {
        content = content.split(old_string).join(new_string);
      } else {
        const idx = content.indexOf(old_string);
        if (idx === -1) throw new Error("old_string not found");
        content = content.slice(0, idx) + new_string + content.slice(idx + old_string.length);
        // 檢查是否還有其他匹配（警告）
        if (content.indexOf(old_string, idx) !== -1) {
          onUpdate({ content: [{ type: "text", text: "Warning: old_string appears multiple times" }] });
        }
      }
      await writeFile(resolvedPath, content, "utf8");
      return { content: [{ type: "text", text: "Edit applied" }], details: {} };
    },
  };
}
```

**關鍵**：`old_string` 需包含足夠上下文確保唯一、支援 `replace_all`。

### 4. Bash Tool（`packages/coding-agent/src/core/tools/bash.ts`）

```typescript
export interface BashToolOptions {
  timeout?: number;           // 預設 120s
  maxOutputBytes?: number;    // 預設 10MB
  env?: Record<string, string>;
}

export function createBashTool(cwd: string, options?: BashToolOptions): AgentTool {
  const operations = createLocalBashOperations(cwd, options);
  return {
    name: "bash",
    description: "Execute shell command. Long-running, streaming output. Use for builds, tests, git, etc.",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "Command to execute" },
        description: { type: "string", description: "Human-readable description" },
        timeout: { type: "number" },
        env: { type: "object", additionalProperties: { type: "string" } },
      },
      required: ["command", "description"],
    },
    executionMode: "sequential",  // Shell 命令預設序列化
    execute: async (toolCallId, args, signal, onUpdate) => {
      const { command, description, timeout, env } = args;
      return operations.execute(toolCallId, command, { description, timeout, env, signal, onUpdate });
    },
  };
}
```

**LocalBashOperations 核心**（`createLocalBashOperations`）：

```typescript
export function createLocalBashOperations(cwd: string, options?: BashToolOptions): BashOperations {
  return {
    execute: async (toolCallId, command, opts) => {
      const { signal, onUpdate, timeout = 120000, env, description } = opts;
      const child = spawn("bash", ["-c", command], {
        cwd,
        env: { ...process.env, ...env },
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "", stderr = "";
      let killed = false;

      // 串流輸出
      child.stdout?.on("data", (data) => {
        stdout += data.toString();
        onUpdate({ content: [{ type: "text", text: stdout }], details: { stdout, stderr } });
        if (stdout.length > (options?.maxOutputBytes ?? 10_000_000)) {
          killed = true; child.kill("SIGTERM");
        }
      });
      child.stderr?.on("data", (data) => {
        stderr += data.toString();
        onUpdate({ content: [{ type: "text", text: stderr }], details: { stdout, stderr } });
      });

      // Timeout
      const timeoutId = setTimeout(() => { killed = true; child.kill("SIGTERM"); }, timeout);

      const exitCode = await new Promise<number>((resolve) => {
        child.on("close", (code) => resolve(code ?? 0));
      });
      clearTimeout(timeoutId);

      if (killed) throw new Error("Command timed out or output limit exceeded");
      if (exitCode !== 0) throw new Error(`Command failed with exit code ${exitCode}: ${stderr}`);

      return { content: [{ type: "text", text: stdout || stderr }], details: { exitCode, stdout, stderr } };
    },
  };
}
```

### 5. Grep / Find / LS Tool

```typescript
// Grep: 內容搜尋（ripgrep 或內建）
export function createGrepTool(cwd: string, options?: GrepToolOptions): AgentTool {
  return {
    name: "grep",
    description: "Search file contents with regex. Uses ripgrep if available.",
    parameters: {
      type: "object",
      properties: {
        pattern: { type: "string" },
        path: { type: "string" },
        include: { type: "string" },      // glob pattern
        exclude: { type: "string" },
        case_sensitive: { type: "boolean" },
      },
      required: ["pattern"],
    },
    execute: async (toolCallId, args, signal, onUpdate) => {
      // 使用 rg 或內建 grep 實作
      // 串流結果 via onUpdate
    },
  };
}

// Find: 檔名搜尋
export function createFindTool(cwd: string, options?: FindToolOptions): AgentTool { ... }

// LS: 目錄列表
export function createLsTool(cwd: string, options?: LsToolOptions): AgentTool {
  return {
    name: "ls",
    description: "List directory contents. Returns file names, sizes, types.",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" },
        recursive: { type: "boolean" },
        max_depth: { type: "number" },
      },
      required: ["path"],
    },
    execute: async (toolCallId, args, signal, onUpdate) => {
      // 遞歸走訪、回傳結構化列表
    },
  };
}
```

---

## 執行模式：Parallel vs Sequential

### 決定邏輯（`agent-loop.ts`）

```typescript
async function executeToolCalls(
  currentContext: AgentContext,
  assistantMessage: AssistantMessage,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  emit: AgentEventSink,
): Promise<ExecutedToolCallBatch> {
  const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
  
  // 檢查是否有工具要求 sequential
  const hasSequentialToolCall = toolCalls.some(
    (tc) => currentContext.tools?.find((t) => t.name === tc.name)?.executionMode === "sequential"
  );

  // 全域設定或單工具覆蓋
  if (config.toolExecution === "sequential" || hasSequentialToolCall) {
    return executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config, signal, emit);
  }
  return executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config, signal, emit);
}
```

### Sequential：逐個執行、上一個結果影響下一個

```typescript
async function executeToolCallsSequential(...) {
  const finalizedCalls: FinalizedToolCallOutcome[] = [];
  const messages: ToolResultMessage[] = [];

  for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", toolCallId: toolCall.id, toolName: toolCall.name, args: toolCall.arguments });
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

### Parallel：同時啟動、Promise.all 等待

```typescript
async function executeToolCallsParallel(...) {
  const finalizedCalls: FinalizedToolCallEntry[] = [];

  for (const toolCall of toolCalls) {
    await emit({ type: "tool_execution_start", ... });
    const preparation = await prepareToolCall(currentContext, assistantMessage, toolCall, config, signal);
    if (preparation.kind === "immediate") {
      const finalized = { toolCall, result: preparation.result, isError: preparation.isError };
      await emitToolExecutionEnd(finalized, emit);
      finalizedCalls.push(finalized);
      continue;
    }
    // 包成函數稍後並行執行
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      return finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config, signal);
    });
  }

  // 並行等待
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

**預設工具 executionMode**：
| 工具 | executionMode | 理由 |
|---|---|---|
| read | parallel | 唯讀、無副作用 |
| grep | parallel | 唯讀 |
| find | parallel | 唯讀 |
| ls | parallel | 唯讀 |
| write | sequential | 寫入有副作用、順序重要 |
| edit | sequential | 修改檔案、需序列化 |
| bash | sequential | 命令可能有副作用、環境依賴 |
| powershell | sequential | 同上 |

---

## Hook 機制：Before / After Tool Call

### Before Hook：攔截、修改、阻擋

```typescript
// AgentLoopConfig
beforeToolCall?: (ctx: {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;           // 已驗證的參數
  context: AgentContext;
}, signal: AbortSignal) => Promise<{
  block?: boolean;         // true = 阻擋執行
  reason?: string;         // 阻擋原因
  terminate?: boolean;     // true = 強制結束 agent
}>;

// 使用範例：Trust Check
const beforeToolCall = async (ctx, signal) => {
  // 需要信任的工具
  if (["write", "edit", "bash"].includes(ctx.toolCall.name)) {
    const trusted = await trustManager.check(ctx.toolCall.name, ctx.args);
    if (!trusted) {
      return { block: true, reason: "Project not trusted for this operation", terminate: false };
    }
  }
  // 參數修正
  if (ctx.toolCall.name === "bash" && !ctx.args.description) {
    ctx.args.description = "Auto-generated description";
  }
  return undefined;  // 繼續執行
};
```

### After Hook：結果後處理、補償、遙測

```typescript
// AgentLoopConfig
afterToolCall?: (ctx: {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;
  result: ToolResult;      // 原始結果
  isError: boolean;
  context: AgentContext;
}, signal: AbortSignal) => Promise<{
  content?: ToolResult["content"];    // 替換內容
  details?: ToolResult["details"];    // 替換細節
  usage?: ToolResult["usage"];        // 附加 usage
  terminate?: boolean;                // 強制結束
  isError?: boolean;                  // 改變錯誤狀態
}>;

// 使用範例：Extension 結果轉換
const afterToolCall = async (ctx, signal) => {
  // Extension 可能想修改結果呈現
  if (ctx.result.details?.extensionTransform) {
    return { content: ctx.result.details.extensionTransform(ctx.result.content) };
  }
  // 錯誤補償：bash 失敗時自動補上建議
  if (ctx.isError && ctx.toolCall.name === "bash") {
    return { content: [{ type: "text", text: `${ctx.result.content[0].text}\n\nSuggestion: Check command syntax or permissions.` }] };
  }
  return undefined;
};
```

### 在 AgentSession 中的整合

```typescript
// packages/coding-agent/src/core/agent-session.ts
const loopConfig: AgentLoopConfig = {
  // ...
  beforeToolCall: this.onBeforeToolCall.bind(this),
  afterToolCall: this.onAfterToolCall.bind(this),
};

private async onBeforeToolCall(ctx, signal) {
  // 1. Trust Check
  const trustResult = await this.trustManager.checkTool(ctx.toolCall.name, ctx.args);
  if (!trustResult.allowed) {
    return { block: true, reason: trustResult.reason, terminate: trustResult.terminate };
  }
  // 2. Extension beforeToolCall hooks
  for (const ext of this.extensions) {
    const result = await ext.onBeforeToolCall?.(ctx, signal);
    if (result?.block) return result;
  }
  return undefined;
}

private async onAfterToolCall(ctx, signal) {
  // 1. Extension afterToolCall hooks
  for (const ext of this.extensions) {
    const result = await ext.onAfterToolCall?.(ctx, signal);
    if (result) return result;
  }
  // 2. Telemetry
  telemetry.recordToolCall(ctx.toolCall.name, ctx.isError, ctx.result.usage);
  return undefined;
}
```

---

## File Mutation Queue：避免同檔案競態

### 問題

Parallel 執行多個 `write`/`edit` 同一檔案 → 競態條件、資料損毀。

### 解法：`withFileMutationQueue`（`packages/coding-agent/src/core/tools/file-mutation-queue.ts`）

```typescript
// 全域佇列：path → Promise 队列
const fileMutationQueues = new Map<string, Promise<unknown>[]>();

export function withFileMutationQueue<T>(
  path: string,
  fn: () => Promise<T>
): Promise<T> {
  const resolvedPath = resolvePath(path);
  const queue = fileMutationQueues.get(resolvedPath) ?? [];
  fileMutationQueues.set(resolvedPath, queue);

  // 建立等待前一個操作完成的 Promise
  const previous = queue.length > 0 ? queue[queue.length - 1] : Promise.resolve();
  
  const promise = previous.then(() => fn()).finally(() => {
    // 移除自己
    const idx = queue.indexOf(promise);
    if (idx >= 0) queue.splice(idx, 1);
    if (queue.length === 0) fileMutationQueues.delete(resolvedPath);
  });

  queue.push(promise);
  return promise;
}
```

### 在 Write/Edit Tool 中使用

```typescript
// write.ts
execute: async (toolCallId, args, signal, onUpdate) => {
  const { path, content } = args;
  return withFileMutationQueue(path, async () => {
    const resolvedPath = resolvePath(cwd, path);
    await mkdir(dirname(resolvedPath), { recursive: true });
    await writeFile(resolvedPath, content, "utf8");
    return { content: [{ type: "text", text: `Written ${content.length} chars` }], details: {} };
  });
}

// edit.ts
execute: async (toolCallId, args, signal, onUpdate) => {
  const { path, old_string, new_string } = args;
  return withFileMutationQueue(path, async () => {
    const resolvedPath = resolvePath(cwd, path);
    let content = await readFile(resolvedPath, "utf8");
    // ... edit logic
    await writeFile(resolvedPath, content, "utf8");
    return { content: [{ type: "text", text: "Edit applied" }], details: {} };
  });
}
```

---

## 輸出截斷：保護 Token Limit

### Truncate Utilities（`packages/coding-agent/src/core/tools/truncate.ts`）

```typescript
export const DEFAULT_MAX_BYTES = 10_000_000;  // 10MB
export const DEFAULT_MAX_LINES = 10_000;

export interface TruncationOptions {
  maxBytes?: number;
  maxLines?: number;
}

export interface TruncationResult {
  truncated: boolean;
  originalBytes: number;
  originalLines: number;
}

export function truncateHead(text: string, options: TruncationOptions): { text: string; result: TruncationResult } {
  const lines = text.split("\n");
  const bytes = Buffer.byteLength(text, "utf8");
  if ((options.maxLines && lines.length <= options.maxLines) && (options.maxBytes && bytes <= options.maxBytes)) {
    return { text, result: { truncated: false, originalBytes: bytes, originalLines: lines.length } };
  }
  // 保留尾部（最新輸出最重要）
  let result = text;
  if (options.maxLines && lines.length > options.maxLines) {
    result = lines.slice(-options.maxLines).join("\n");
  }
  if (options.maxBytes && Buffer.byteLength(result, "utf8") > options.maxBytes) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(result);
    result = new TextDecoder().decode(encoded.slice(-options.maxBytes));
  }
  return { text: result, result: { truncated: true, originalBytes: bytes, originalLines: lines.length } };
}

export function truncateTail(text: string, options: TruncationOptions): { text: string; result: TruncationResult } {
  // 保留頭部（適合錯誤訊息、開頭重要資訊）
  // ... 類似邏輯
}

export function truncateLine(text: string, maxLineLength: number): string {
  return text.split("\n").map(line => line.length > maxLineLength ? line.slice(0, maxLineLength) + "…" : line).join("\n");
}
```

### 在 Bash Tool 中應用

```typescript
// bash.ts execute 結束時
const { text: truncatedStdout, result } = truncateHead(stdout, { maxBytes: options.maxOutputBytes, maxLines: options.maxOutputLines });
onUpdate({ content: [{ type: "text", text: truncatedStdout }], details: { ... } });
if (result.truncated) {
  // 標記截斷，讓 LLM 知道輸出不完整
  details.truncated = true;
}
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/coding-agent/src/core/tools/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/core/tools)
- [Pi 官方文件：工具系統](https://pi.dev/docs/latest/tools)
- [JSON Schema 規範](https://json-schema.org/)
- [Agent Tool Calling 設計模式](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#tools)
- [Ripgrep (rg) 官方文件](https://github.com/BurntSushi/ripgrep)

---

## 下一篇預告

> **第 7 篇：Extension System——Hooks、Custom Tools、UI Components、Lifecycle 完整機制**
>
> Extension 定義介面、onLoad/onUnload 生命週期、onAgentStart/onBeforeToolCall/onAfterToolCall/onTurnEnd 四大 Hook、tools/commands/keybindings/ui/settings 五大擴充點、ExtensionRunner 載入順序、ExtensionAPI 提供的能力、Dynamic Border、Widget、Dialog、Selector 等 UI 元件擴充、Extension 間通訊、熱重載機制。