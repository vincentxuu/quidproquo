---
title: "pi-mono Deep Dive 6: Tool System — 8 Core Tools, Factory Pattern, Parallel/Sequential Execution, Before/After Hooks Interception"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, tool-system, parallel-execution, hooks, file-mutation-queue]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 6
tldr: "Complete analysis of pi-coding-agent's 8 core tools: ToolDefinition (for LLM) vs AgentTool (execution logic), createToolDefinition/createTool Factory, executionMode determines parallel/sequential, beforeToolCall/afterToolCall interception chain, withFileMutationQueue serializes file writes, truncateHead/Line/Tail output truncation, read/write/edit/bash/grep/find/ls/powershell implementation details."
description: "Deep dive into pi-coding-agent tool system: complete chain from definition to execution. Covers ToolDefinition (JSON Schema + description), AgentTool (execute + prepareArguments + executionMode), 8 tool implementations, tool executor parallel/sequential dispatch, beforeToolCall/afterToolCall hook mechanisms and interception points, File Mutation Queue for race condition prevention, output truncation strategies, permission and trust check integration. For engineers researching Agent Tool Calling architecture and tool system design."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-tool-system)

## TL;DR

- **Dual Definition**: `ToolDefinition` (for LLM, has JSON Schema) vs `AgentTool` (execution logic, has execute/prepareArguments/executionMode)
- **Factory**: `createToolDefinition()`/`createTool()` create from name, unified interface
- **8 Core Tools**: read, write, edit, bash, grep, find, ls, powershell
- **Execution Mode**: `executionMode: "parallel" | "sequential"` defaults parallel, tool can override
- **Hook Chain**: `beforeToolCall` (can block, terminate) → execute → `afterToolCall` (can patch result, terminate)
- **File Mutation Queue**: Serializes same-file writes, prevents race conditions
- **Truncation**: `truncateHead/Line/Tail` protects against token limits

---

## Architecture Overview: Definition vs Execution Separation

```
┌─────────────────────────────────────────────────────────────────┐
│                        Tool System                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────────────┐     │
│  │  ToolDefinition  │         │       AgentTool          │     │
│  │  (for LLM)       │         │  (actual execution)      │     │
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

## ToolDefinition: Interface for LLM

```typescript
// packages/coding-agent/src/core/extensions/types.ts
export interface ToolDefinition<TArgs = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: JSONSchema;  // Standard JSON Schema
  // Optional: extra hints for LLM
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}
```

**Key Points**:
- `parameters` must be valid JSON Schema (for LLM parameter validation)
- `annotations` helps LLM understand tool characteristics (e.g., `destructiveHint: true` makes it more cautious)

---

## AgentTool: Runtime Complete Definition

```typescript
// packages/agent/src/types.ts
export interface AgentTool<TArgs = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: JSONSchema;
  // Core execution function
  execute: (
    toolCallId: string,
    args: TArgs,
    signal: AbortSignal,
    onUpdate: (partialResult: TResult) => void
  ) => Promise<TResult>;
  // Optional: argument preprocessing (path resolution, defaults)
  prepareArguments?: (args: TArgs) => TArgs;
  // Execution mode
  executionMode?: "parallel" | "sequential";
}
```

**Key Differences**:
| Feature | ToolDefinition | AgentTool |
|---|---|---|
| Purpose | LLM knows how to call | Actual execution logic |
| execute | ❌ | ✅ |
| prepareArguments | ❌ | ✅ |
| executionMode | ❌ | ✅ |
| Param Validation | LLM-side (Schema) | Re-validated before execution |

---

## Factory Pattern: Unified Creation Entry

### Registry (`packages/coding-agent/src/core/tools/index.ts`)

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

// Create ToolDefinition (for LLM)
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

// Create AgentTool (for execution)
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

// Common combinations
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

## 8 Core Tool Implementations

### 1. Read Tool (`packages/coding-agent/src/core/tools/read.ts`)

```typescript
export interface ReadToolOptions {
  maxBytes?: number;      // Default 1MB
  maxLines?: number;      // Default 2000 lines
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
      // ... read file, handle encoding, truncate
      return { content: [{ type: "text", text: fileContent }], details: { size: stats.size } };
    },
  };
}
```

**Features**:
- Auto-detects encoding, supports binary files (base64)
- `offset`/`limit` for paging large files
- Images return base64 + MIME type

### 2. Write Tool (`packages/coding-agent/src/core/tools/write.ts`)

```typescript
export interface WriteToolOptions {
  maxBytes?: number;  // Default 10MB
}

export function createWriteTool(cwd: string, options?: WriteToolOptions): AgentTool {
  return {
    name: "write",
    description: "Write file contents. Creates parent directories. Overwrites existing.",
    parameters: { ... },
    executionMode: "sequential",  // Writes usually need serialization
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

### 3. Edit Tool (`packages/coding-agent/src/core/tools/edit.ts`)

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
        // Warn if multiple matches
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

**Key**: `old_string` needs enough context for uniqueness, supports `replace_all`.

### 4. Bash Tool (`packages/coding-agent/src/core/tools/bash.ts`)

```typescript
export interface BashToolOptions {
  timeout?: number;           // Default 120s
  maxOutputBytes?: number;    // Default 10MB
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
    executionMode: "sequential",  // Shell commands default sequential
    execute: async (toolCallId, args, signal, onUpdate) => {
      const { command, description, timeout, env } = args;
      return operations.execute(toolCallId, command, { description, timeout, env, signal, onUpdate });
    },
  };
}
```

**LocalBashOperations Core** (`createLocalBashOperations`):

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

      // Streaming output
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
// Grep: Content search (ripgrep or built-in)
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
      // Use rg or built-in grep implementation
      // Stream results via onUpdate
    },
  };
}

// Find: Filename search
export function createFindTool(cwd: string, options?: FindToolOptions): AgentTool { ... }

// LS: Directory listing
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
      // Recursive walk, return structured listing
    },
  };
}
```

---

## Execution Mode: Parallel vs Sequential

### Decision Logic (`agent-loop.ts`)

```typescript
async function executeToolCalls(
  currentContext: AgentContext,
  assistantMessage: AssistantMessage,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  emit: AgentEventSink,
): Promise<ExecutedToolCallBatch> {
  const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
  
  // Check if any tool demands sequential
  const hasSequentialToolCall = toolCalls.some(
    (tc) => currentContext.tools?.find((t) => t.name === tc.name)?.executionMode === "sequential"
  );

  // Global setting or per-tool override
  if (config.toolExecution === "sequential" || hasSequentialToolCall) {
    return executeToolCallsSequential(currentContext, assistantMessage, toolCalls, config, signal, emit);
  }
  return executeToolCallsParallel(currentContext, assistantMessage, toolCalls, config, signal, emit);
}
```

### Sequential: One by One, Previous Result Affects Next

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

### Parallel: Launch All, Promise.all Wait

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
    // Wrap as function for later parallel execution
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      return finalizeExecutedToolCall(currentContext, assistantMessage, preparation, executed, config, signal);
    });
  }

  // Parallel await
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

**Default Tool executionMode**:
| Tool | executionMode | Reason |
|---|---|---|
| read | parallel | Read-only, no side effects |
| grep | parallel | Read-only |
| find | parallel | Read-only |
| ls | parallel | Read-only |
| write | sequential | Write has side effects, order matters |
| edit | sequential | Modifies files, needs serialization |
| bash | sequential | Commands may have side effects, env deps |
| powershell | sequential | Same |

---

## Hook Mechanism: Before / After Tool Call

### Before Hook: Intercept, Modify, Block

```typescript
// AgentLoopConfig
beforeToolCall?: (ctx: {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;           // Validated args
  context: AgentContext;
}, signal: AbortSignal) => Promise<{
  block?: boolean;         // true = block execution
  reason?: string;         // Block reason
  terminate?: boolean;     // true = force agent end
}>;

// Usage Example: Trust Check
const beforeToolCall = async (ctx, signal) => {
  // Tools requiring trust
  if (["write", "edit", "bash"].includes(ctx.toolCall.name)) {
    const trusted = await trustManager.check(ctx.toolCall.name, ctx.args);
    if (!trusted) {
      return { block: true, reason: "Project not trusted for this operation", terminate: false };
    }
  }
  // Argument correction
  if (ctx.toolCall.name === "bash" && !ctx.args.description) {
    ctx.args.description = "Auto-generated description";
  }
  return undefined;  // Continue execution
};
```

### After Hook: Result Post-processing, Compensation, Telemetry

```typescript
// AgentLoopConfig
afterToolCall?: (ctx: {
  assistantMessage: AssistantMessage;
  toolCall: AgentToolCall;
  args: unknown;
  result: ToolResult;      // Original result
  isError: boolean;
  context: AgentContext;
}, signal: AbortSignal) => Promise<{
  content?: ToolResult["content"];    // Replace content
  details?: ToolResult["details"];    // Replace details
  usage?: ToolResult["usage"];        // Add usage
  terminate?: boolean;                // Force terminate
  isError?: boolean;                  // Change error state
}>;

// Usage Example: Extension Result Transform
const afterToolCall = async (ctx, signal) => {
  // Extension may want to modify result presentation
  if (ctx.result.details?.extensionTransform) {
    return { content: ctx.result.details.extensionTransform(ctx.result.content) };
  }
  // Error compensation: bash failure adds suggestion
  if (ctx.isError && ctx.toolCall.name === "bash") {
    return { content: [{ type: "text", text: `${ctx.result.content[0].text}\n\nSuggestion: Check command syntax or permissions.` }] };
  }
  return undefined;
};
```

### Integration in AgentSession

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

## File Mutation Queue: Prevent Same-File Race Conditions

### Problem

Parallel execution of multiple `write`/`edit` on same file → race conditions, data corruption.

### Solution: `withFileMutationQueue` (`packages/coding-agent/src/core/tools/file-mutation-queue.ts`)

```typescript
// Global queue: path → Promise queue
const fileMutationQueues = new Map<string, Promise<unknown>[]>();

export function withFileMutationQueue<T>(
  path: string,
  fn: () => Promise<T>
): Promise<T> {
  const resolvedPath = resolvePath(path);
  const queue = fileMutationQueues.get(resolvedPath) ?? [];
  fileMutationQueues.set(resolvedPath, queue);

  // Create promise that waits for previous operation
  const previous = queue.length > 0 ? queue[queue.length - 1] : Promise.resolve();
  
  const promise = previous.then(() => fn()).finally(() => {
    // Remove self
    const idx = queue.indexOf(promise);
    if (idx >= 0) queue.splice(idx, 1);
    if (queue.length === 0) fileMutationQueues.delete(resolvedPath);
  });

  queue.push(promise);
  return promise;
}
```

### In Write/Edit Tool

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

## Output Truncation: Protecting Token Limits

### Truncate Utilities (`packages/coding-agent/src/core/tools/truncate.ts`)

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
  // Keep tail (latest output most important)
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
  // Keep head (for error messages, early important info)
  // ... similar logic
}

export function truncateLine(text: string, maxLineLength: number): string {
  return text.split("\n").map(line => line.length > maxLineLength ? line.slice(0, maxLineLength) + "…" : line).join("\n");
}
```

### Applied in Bash Tool

```typescript
// bash.ts execute end
const { text: truncatedStdout, result } = truncateHead(stdout, { maxBytes: options.maxOutputBytes, maxLines: options.maxOutputLines });
onUpdate({ content: [{ type: "text", text: truncatedStdout }], details: { ... } });
if (result.truncated) {
  // Mark truncation so LLM knows output incomplete
  details.truncated = true;
}
```

---

## References

- [GitHub - earendil-works/pi — packages/coding-agent/src/core/tools/](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src/core/tools)
- [Pi Official Docs: Tool System](https://pi.dev/docs/latest/tools)
- [JSON Schema Specification](https://json-schema.org/)
- [Agent Tool Calling Design Patterns](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#tools)
- [Ripgrep (rg) Official Docs](https://github.com/BurntSushi/ripgrep)

---

## Next Up

> **Part 7: Extension System — Hooks, Custom Tools, UI Components, Lifecycle Complete Mechanism**
>
> Extension definition interface, onLoad/onUnload lifecycle, onAgentStart/onBeforeToolCall/onAfterToolCall/onTurnEnd four major Hooks, tools/commands/keybindings/ui/settings five extension points, ExtensionRunner load order, ExtensionAPI provided capabilities, Dynamic Border, Widget, Dialog, Selector UI components, Extension inter-communication, hot reload mechanism.