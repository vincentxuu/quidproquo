---
title: "pi-mono Deep Dive 12: Compaction Deep Dive — Strategy, Token Estimation, Branch Summary, Structured Compaction"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, compaction, token-estimation, branch-summary, structured-compaction, context-window]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 12
tldr: "Complete Compaction Mechanism: shouldCompact Trigger Conditions (Token Ratio, Message Count), estimateTokens Calculation (Char/Word Approximation), findCutPoint Finding Cut Point (Retain Recent N Turns), generateSummary Generating Summary (LLM Call), prepareCompaction Preparing Context, Branch Summary Generation, Structured Compaction (Extension Custom via fromHook), CompactionEntry Details, fromHook Mechanism, Compaction Settings."
description: "Deep dive into pi-agent-core and pi-coding-agent Compaction System: Token Estimation Strategy, Cut Point Finding Algorithm, Summary Generation Flow, Context Reconstruction, Branch Summary Recording Abandoned Paths, Structured Compaction Allowing Extension Custom Compression Logic, CompactionEntry Field Breakdown, fromHook Marker for Extension-generated, CompactionSettings Configuration. For Engineers Researching Agent Context Window Management and Long Conversation Memory Compression."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-compaction)

## TL;DR

- **Trigger Conditions**: `shouldCompact` Checks Token Ratio (Default 75%), Message Count, Model Context Window
- **Token Estimation**: `estimateTokens` Char Approximation (English 4 Chars/Token, Chinese 1.5 Chars/Token), `estimateContextTokens` Includes System Prompt, Tools
- **Cut Point Finding**: `findCutPoint` Accumulates from Newest to Oldest, Retains Recent N Turns, Minimum 1 Turn
- **Summary Generation**: `generateSummary` Calls LLM (Optional Smaller Model), Outputs Structured Summary
- **Branch Summary**: `generateBranchSummary` Records Abandoned Branch Key Info
- **Structured Compaction**: `fromHook=true` Allows Extension Custom Compression Logic, Preserves Structured Data
- **CompactionEntry**: `firstKeptEntryId`, `tokensBefore`, `usage`, `details`, `fromHook`

---

## Why Compaction is Needed?

| Problem | Solution |
|---|---|
| Limited Context Window (4k~200k Tokens) | Compress Old Conversation, Free Space for New Messages |
| Long Conversation Token Cost High | Summary Replaces Original, Drastically Reduces Tokens |
| Critical Info Must Not Be Lost | Retain Recent Turns, Generate Structured Summary |
| Branch Experiments Generate History | Branch Summary Records Discarded Paths |

---

## Core Flow: prepareNextTurn → shouldCompact → compact

### 1. shouldCompact: Trigger Decision

```typescript
// packages/agent/src/harness/compaction/compaction.ts
export const DEFAULT_COMPACTION_SETTINGS: CompactionSettings = {
  // Token Ratio Threshold (Default 75%)
  threshold: 0.75,
  // Minimum Turns to Keep
  minTurnsToKeep: 2,
  // Max Summary Length
  maxSummaryTokens: 4096,
  // Summary Generation Model (Optional Smaller Model Saves Cost)
  summaryModel: undefined,  // undefined = Use Current Model
};

export async function shouldCompact(
  context: AgentContext,
  settings: CompactionSettings = DEFAULT_COMPACTION_SETTINGS
): Promise<boolean> {
  // 1. Estimate Current Context Tokens
  const currentTokens = await estimateContextTokens(context);
  
  // 2. Get Model Context Window
  const modelConfig = context.model;
  const contextWindow = modelConfig?.contextWindow ?? 128000;
  
  // 3. Calculate Ratio
  const ratio = currentTokens / contextWindow;
  
  // 4. Check Message Count
  const messageCount = context.messages.filter(m => m.role === "user" || m.role === "assistant").length;
  
  return ratio >= settings.threshold || messageCount > settings.minTurnsToKeep * 10;
}
```

### 2. estimateTokens: Token Estimation

```typescript
// packages/agent/src/harness/compaction/compaction.ts
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // English: ~4 Chars/Token, Chinese: ~1.5 Chars/Token
  // Simplified: Total Chars / 3.5
  return Math.ceil(text.length / 3.5);
}

export function estimateContextTokens(context: AgentContext): number {
  let total = 0;
  
  // System Prompt
  total += estimateTokens(context.systemPrompt);
  
  // Tools Schema
  for (const tool of context.tools ?? []) {
    total += estimateTokens(JSON.stringify(tool.parameters));
  }
  
  // Messages
  for (const message of context.messages) {
    if (typeof message.content === "string") {
      total += estimateTokens(message.content);
    } else {
      for (const block of message.content) {
        if (block.type === "text") total += estimateTokens(block.text);
        else if (block.type === "toolCall") total += estimateTokens(JSON.stringify(block.arguments));
        else if (block.type === "toolResult") total += estimateTokens(JSON.stringify(block.content));
        else if (block.type === "thinking") total += estimateTokens(block.thinking);
      }
    }
  }
  
  return total;
}
```

### 3. findCutPoint: Finding Cut Point

```typescript
export interface CutPointResult {
  cutIndex: number;           // 0-based Index, Cut After This
  tokensBefore: number;       // Tokens Before Cut Point
  tokensAfter: number;        // Tokens After Cut Point
}

export function findCutPoint(
  messages: AgentMessage[],
  targetTokens: number,       // Target Tokens to Keep
  settings: CompactionSettings
): CutPointResult {
  // Accumulate from Newest to Oldest Until Exceeds Target
  let accumulated = 0;
  let cutIndex = messages.length - 1;
  
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = estimateMessageTokens(messages[i]);
    if (accumulated + msgTokens > targetTokens) {
      // Found Cut Point: Keep Messages After i
      cutIndex = i;
      break;
    }
    accumulated += msgTokens;
  }
  
  // Ensure Minimum minTurnsToKeep User/Assistant Turns
  const userAssistantIndices = messages
    .map((m, i) => (m.role === "user" || m.role === "assistant") ? i : -1)
    .filter(i => i >= 0);
  
  if (userAssistantIndices.length > settings.minTurnsToKeep * 2) {
    const minKeepIndex = userAssistantIndices[userAssistantIndices.length - settings.minTurnsToKeep * 2];
    cutIndex = Math.min(cutIndex, minKeepIndex - 1);
  }
  
  const tokensBefore = messages.slice(0, cutIndex + 1).reduce((sum, m) => sum + estimateMessageTokens(m), 0);
  const tokensAfter = messages.slice(cutIndex + 1).reduce((sum, m) => sum + estimateMessageTokens(m), 0);
  
  return { cutIndex, tokensBefore, tokensAfter };
}
```

### 4. generateSummary: Generating Summary

```typescript
export async function generateSummary(
  messages: AgentMessage[],
  model: ModelConfig,
  streamFn: StreamFn,
  settings: CompactionSettings,
  signal: AbortSignal
): Promise<{ summary: string; usage?: Usage }> {
  // Build Summary Prompt
  const summaryPrompt = buildSummaryPrompt(messages);
  
  // Call LLM to Generate Summary (Can Use Smaller Model)
  const summaryModel = settings.summaryModel ?? model;
  const summaryContext: Context = {
    systemPrompt: SUMMARY_SYSTEM_PROMPT,
    messages: [{ role: "user", content: summaryPrompt }],
    tools: [],
  };
  
  const stream = streamFn(summaryModel, summaryContext, { signal });
  let summary = "";
  
  for await (const event of stream) {
    if (event.type === "text_delta") {
      summary += event.partial.content[0]?.text ?? "";
    } else if (event.type === "done") {
      const result = await event.result();
      return { summary: result.content[0]?.text ?? "", usage: result.usage };
    }
  }
  
  return { summary };
}

const SUMMARY_SYSTEM_PROMPT = `You are a conversation summarizer. Compress the following conversation into a structured summary containing:
1. Key Decisions & Conclusions
2. Important Code Changes or File Operations
3. Resolved Issues & Outstanding Items
4. Tools & Technologies Used
Answer in Traditional Chinese, Keep Concise but Complete.`;
```

### 5. compact: Complete Flow

```typescript
export interface CompactionResult {
  newContext: AgentContext;
  summary: string;
  tokensBefore: number;
  tokensAfter: number;
  cutIndex: number;
  usage?: Usage;
}

export async function compact(
  context: AgentContext,
  settings: CompactionSettings = DEFAULT_COMPACTION_SETTINGS,
  streamFn: StreamFn,
  signal: AbortSignal
): Promise<CompactionResult> {
  // 1. Estimate Tokens
  const tokensBefore = await estimateContextTokens(context);
  const contextWindow = context.model?.contextWindow ?? 128000;
  const targetTokens = Math.floor(contextWindow * (1 - settings.threshold));
  
  // 2. Find Cut Point
  const { cutIndex, tokensBefore: tb, tokensAfter } = findCutPoint(
    context.messages,
    targetTokens,
    settings
  );
  
  // 3. Generate Summary (Discarded Messages)
  const messagesToSummarize = context.messages.slice(0, cutIndex + 1);
  const { summary, usage } = await generateSummary(
    messagesToSummarize,
    context.model,
    streamFn,
    settings,
    signal
  );
  
  // 4. Reconstruct Context: [Summary] + [Kept Messages]
  const keptMessages = context.messages.slice(cutIndex + 1);
  const summaryMessage: AgentMessage = {
    role: "assistant",
    content: [
      { type: "text", text: `[Compaction Summary]\n${summary}` }
    ],
    provider: context.model.provider,
    model: context.model.id,
  };
  
  const newContext: AgentContext = {
    ...context,
    messages: [summaryMessage, ...keptMessages],
  };
  
  return {
    newContext,
    summary,
    tokensBefore,
    tokensAfter: tokensAfter + estimateTokens(summary),
    cutIndex,
    usage,
  };
}
```

---

## Integration in Agent Loop

### prepareNextTurn Calls Compact

```typescript
// packages/coding-agent/src/core/agent-session.ts
prepareNextTurn: async (turn: PrepareNextTurnContext) => {
  // 1. Check Compaction
  const shouldCompactResult = await shouldCompact(turn.context);
  if (shouldCompactResult) {
    const compactionResult = await compact(
      turn.context,
      this.compactionSettings,
      this.streamFunction,
      turn.signal
    );
    
    // Write to Session
    const firstKeptEntryId = turn.context.messages[compactionResult.cutIndex + 1]?.id;
    this.sessionManager.appendCompaction(
      compactionResult.summary,
      firstKeptEntryId,
      compactionResult.tokensBefore,
      undefined,  // details
      false,      // fromHook
      compactionResult.usage
    );
    
    return { context: compactionResult.newContext };
  }
  
  // 2. Model Switch, Thinking Level, etc...
  return undefined;
}
```

### SessionManager Writes CompactionEntry

```typescript
// packages/coding-agent/src/core/session-manager.ts
appendCompaction<T = unknown>(
  summary: string,
  firstKeptEntryId: string,
  tokensBefore: number,
  details?: T,
  fromHook?: boolean,
  usage?: Usage
): string {
  const entry: CompactionEntry<T> = {
    type: "compaction",
    id: generateId(this.byId),
    parentId: this.leafId,
    timestamp: new Date().toISOString(),
    summary,
    firstKeptEntryId,
    tokensBefore,
    details,
    usage,
    fromHook,
  };
  this._appendEntry(entry);
  return entry.id;
}
```

---

## Branch Summary: Recording Abandoned Paths

### Generating Branch Summary

```typescript
// packages/agent/src/harness/compaction/branch-summarization.ts
export async function generateBranchSummary(
  options: GenerateBranchSummaryOptions,
  model: ModelConfig,
  streamFn: StreamFn,
  signal: AbortSignal
): Promise<BranchSummaryResult> {
  const { fromId, toId, context } = options;
  
  // 1. Get Abandoned Path Messages
  const abandonedMessages = getAbandonedMessages(context, fromId, toId);
  
  // 2. Generate Summary
  const { summary, usage } = await generateSummary(
    abandonedMessages,
    model,
    streamFn,
    { ...DEFAULT_COMPACTION_SETTINGS, maxSummaryTokens: 2048 },
    signal
  );
  
  return { summary, usage };
}

export async function collectEntriesForBranchSummary(
  fromId: string,
  toId: string | null,
  sessionManager: SessionManager
): Promise<SessionEntry[]> {
  // Collect Entries Between fromId and toId
  const entries: SessionEntry[] = [];
  let current = fromId;
  while (current && current !== toId) {
    const entry = sessionManager.getEntry(current);
    if (entry) entries.push(entry);
    current = entry.parentId ?? null;
  }
  return entries.reverse();
}
```

### Branch Summary Entry

```typescript
// SessionManager.appendCompaction -> branchWithSummary
branchWithSummary(
  branchFromId: string | null,
  summary: string,
  details?: unknown,
  fromHook?: boolean,
  usage?: Usage
): string {
  const fromId = this.leafId ?? "root";
  this.leafId = branchFromId;
  const entry: BranchSummaryEntry = {
    type: "branch_summary",
    id: generateId(this.byId),
    parentId: branchFromId,
    timestamp: new Date().toISOString(),
    fromId,
    summary,
    details,
    usage,
    fromHook,
  };
  this._appendEntry(entry);
  return entry.id;
}
```

---

## Structured Compaction: Extension Custom Compression

### fromHook Mechanism

```typescript
// Extension Can Implement Custom Compaction
interface Extension {
  // ...
  onCompaction?: (context: AgentContext, signal: AbortSignal) => Promise<{
    summary: string;
    keptMessages: AgentMessage[];
    details?: unknown;
    usage?: Usage;
  }>;
}
```

### AgentSession Integration

```typescript
// packages/coding-agent/src/core/agent-session.ts
private async runCompaction(context: AgentContext, signal: AbortSignal): Promise<CompactionResult> {
  // 1. Try Extension Compaction
  for (const ext of this.extensions) {
    if (ext.onCompaction) {
      const result = await ext.onCompaction(context, signal);
      if (result) {
        // Extension Returns Custom Result
        const firstKeptEntryId = result.keptMessages[0]?.id;
        this.sessionManager.appendCompaction(
          result.summary,
          firstKeptEntryId,
          estimateContextTokens(context),
          result.details,
          true,  // fromHook = true
          result.usage
        );
        return {
          newContext: { ...context, messages: [createCompactionMessage(result.summary), ...result.keptMessages] },
          summary: result.summary,
          tokensBefore: estimateContextTokens(context),
          tokensAfter: estimateTokens(result.summary) + estimateContextTokens({ ...context, messages: result.keptMessages }),
          cutIndex: context.messages.length - result.keptMessages.length,
          usage: result.usage,
        };
      }
    }
  }
  
  // 2. Fallback to Built-in Compact
  return compact(context, this.compactionSettings, this.streamFunction, signal);
}
```

### Example: Git-aware Compaction Extension

```typescript
// Preserve Git-related Messages, Compress Others
const gitAwareCompactionExtension: Extension = {
  name: "git-aware-compaction",
  version: "1.0.0",
  onCompaction: async (context, signal) => {
    const messages = context.messages;
    const gitMessages = messages.filter(m => 
      m.content.some(c => c.type === "text" && c.text.includes("git "))
    );
    const otherMessages = messages.filter(m => !gitMessages.includes(m));
    
    if (otherMessages.length > 10) {
      const { summary } = await generateSummary(otherMessages, /* ... */);
      return {
        summary: `[Git-Aware Compaction]\n${summary}\n\n[Git Operations Preserved]\n${gitMessages.map(m => m.content).join("\n")}`,
        keptMessages: [...gitMessages, ...otherMessages.slice(-5)],
        details: { preservedGitOps: gitMessages.length },
      };
    }
  },
};
```

---

## CompactionEntry Complete Fields

```typescript
export interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;              // Summary Text
  firstKeptEntryId: string;     // Kept Segment Start Entry ID
  tokensBefore: number;         // Tokens Before Compression
  details?: T;                  // Extension-specific Data (Structured Compaction)
  usage?: Usage;                // LLM Usage for Summary Generation
  fromHook?: boolean;           // true = Extension Generated, false = Built-in
}
```

### buildContextEntries Handles Compaction

```typescript
// packages/coding-agent/src/core/session-manager.ts
export function buildContextEntries(
  entries: SessionEntry[],
  leafId?: string | null,
  byId?: Map<string, SessionEntry>
): SessionEntry[] {
  const path = buildSessionPath(entries, leafId, byId);
  let compaction: CompactionEntry | null = null;

  // Find Latest Compaction
  for (const entry of path) {
    if (entry.type === "compaction") compaction = entry;
  }

  if (!compaction) return path;

  const compactionIdx = path.findIndex(e => e.id === compaction.id);
  if (compactionIdx < 0) return path;

  // Reconstruct: [Compaction] + [After FirstKept] + [After Compaction]
  const contextEntries: SessionEntry[] = [compaction];
  let foundFirstKept = false;
  for (let i = 0; i < compactionIdx; i++) {
    if (path[i].id === compaction.firstKeptEntryId) foundFirstKept = true;
    if (foundFirstKept) contextEntries.push(path[i]);
  }
  contextEntries.push(...path.slice(compactionIdx + 1));
  return contextEntries;
}
```

---

## Compaction Settings Configuration

```typescript
export interface CompactionSettings {
  threshold: number;           // Token Ratio Threshold (0-1), Default 0.75
  minTurnsToKeep: number;      // Minimum Turns to Keep, Default 2
  maxSummaryTokens: number;    // Max Summary Tokens, Default 4096
  summaryModel?: ModelConfig;  // Summary Model, undefined = Current Model
  // Advanced
  preserveSystemPrompt: boolean;  // Default true
  preserveTools: boolean;         // Default true
  preserveRecentFiles: number;    // Preserve Recent N File Operations, Default 5
}
```

### Default Values

```typescript
export const DEFAULT_COMPACTION_SETTINGS: CompactionSettings = {
  threshold: 0.75,
  minTurnsToKeep: 2,
  maxSummaryTokens: 4096,
  summaryModel: undefined,
  preserveSystemPrompt: true,
  preserveTools: true,
  preserveRecentFiles: 5,
};
```

---

## References

- [GitHub - earendil-works/pi — packages/agent/src/harness/compaction/](https://github.com/earendil-works/pi/tree/main/packages/agent/src/harness/compaction)
- [Pi Official Docs: Compaction](https://pi.dev/docs/latest/compaction)
- [Context Window Management Strategies](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#compaction)
- [Token Estimation Techniques](https://github.com/openai/tiktoken)

---

## Next Up

> **Part 13: Agent Harness, Skills, System Prompt Assembly**
>
> AgentHarness Class, System Prompt Assembly Flow, Skills Loading & Formatting, Prompt Templates, How Harness Decides Tool Availability, Result Handling, Telemetry Schema Registration, Default Harness Construction.