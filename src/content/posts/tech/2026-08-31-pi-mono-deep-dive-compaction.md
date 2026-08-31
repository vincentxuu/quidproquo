---
title: "pi-mono 深度導讀 12：Compaction 深度——策略、Token Estimation、Branch Summary、Structured Compaction"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, compaction, token-estimation, branch-summary, structured-compaction, context-window]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 12
tldr: "Compaction 完整機制：shouldCompact 觸發條件（token 佔比、訊息數）、estimateTokens 計算（字符/單字近似）、findCutPoint 尋找切點（保留最近 N 輪）、generateSummary 生成摘要（LLM 呼叫）、prepareCompaction 整理上下文、Branch Summary 生成、Structured Compaction（Extension 自訂 via fromHook）、CompactionEntry 細節、fromHook 機制、Compaction Settings。"
description: "深入 pi-agent-core 與 pi-coding-agent 的 Compaction 系統：Token 估算策略、切點尋找算法、摘要生成流程、上下文重構、Branch Summary 記錄被捨棄路徑、Structured Compaction 讓 Extension 自訂壓縮邏輯、CompactionEntry 欄位完整解析、fromHook 標記 Extension 產生、CompactionSettings 配置選項。適合研究 Agent Context Window 管理、長對話記憶壓縮的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-compaction-en)

## TL;DR

- **觸發條件**：`shouldCompact` 檢查 token 佔比（預設 75%）、訊息數、模型 Context Window
- **Token 估算**：`estimateTokens` 字符近似（英文 4 chars/token、中文 1.5 chars/token）、`estimateContextTokens` 含 system prompt、tools
- **切點尋找**：`findCutPoint` 從舊到新累加、保留最近 N 輪對話、最少保留 1 輪
- **摘要生成**：`generateSummary` 呼叫 LLM（可指定模型）、輸出結構化摘要
- **Branch Summary**：`generateBranchSummary` 記錄被捨棄分支的關鍵資訊
- **Structured Compaction**：`fromHook=true` 讓 Extension 自訂壓縮邏輯、保留結構化資料
- **CompactionEntry**：`firstKeptEntryId`、`tokensBefore`、`usage`、`details`、`fromHook`

---

## 為什麼需要 Compaction？

| 問題 | 解法 |
|---|---|
| Context Window 有限（4k~200k tokens） | 壓縮舊對話、騰出空間給新訊息 |
| 長對話 Token 成本高 | 摘要替代原文、大幅減少 Token |
| 關鍵資訊不能丟 | 保留最近輪次、生成結構化摘要 |
| 分支實驗產生大量歷史 | Branch Summary 記錄棄用路徑 |

---

## 核心流程：prepareNextTurn → shouldCompact → compact

### 1. shouldCompact：觸發判斷

```typescript
// packages/agent/src/harness/compaction/compaction.ts
export const DEFAULT_COMPACTION_SETTINGS: CompactionSettings = {
  // Token 佔比閾值（預設 75%）
  threshold: 0.75,
  // 最少保留輪次
  minTurnsToKeep: 2,
  // 最大摘要長度
  maxSummaryTokens: 4096,
  // 摘要生成模型（可指定較小模型省錢）
  summaryModel: undefined,  // undefined = 使用當前模型
};

export async function shouldCompact(
  context: AgentContext,
  settings: CompactionSettings = DEFAULT_COMPACTION_SETTINGS
): Promise<boolean> {
  // 1. 估算目前 Context Tokens
  const currentTokens = await estimateContextTokens(context);
  
  // 2. 取得模型 Context Window
  const modelConfig = context.model;
  const contextWindow = modelConfig?.contextWindow ?? 128000;
  
  // 3. 計算佔比
  const ratio = currentTokens / contextWindow;
  
  // 4. 檢查訊息數
  const messageCount = context.messages.filter(m => m.role === "user" || m.role === "assistant").length;
  
  return ratio >= settings.threshold || messageCount > settings.minTurnsToKeep * 10;
}
```

### 2. estimateTokens：Token 估算

```typescript
// packages/agent/src/harness/compaction/compaction.ts
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // 英文：~4 chars/token，中文：~1.5 chars/token
  // 簡化：總字符數 / 3.5
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

### 3. findCutPoint：尋找切點

```typescript
export interface CutPointResult {
  cutIndex: number;           // 從 0 開始的索引，切在這之後
  tokensBefore: number;       // 切點前的 token 數
  tokensAfter: number;        // 切點後的 token 數
}

export function findCutPoint(
  messages: AgentMessage[],
  targetTokens: number,       // 目標保留 token 數
  settings: CompactionSettings
): CutPointResult {
  // 從最新往舊累加，直到超過 targetTokens
  let accumulated = 0;
  let cutIndex = messages.length - 1;
  
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = estimateMessageTokens(messages[i]);
    if (accumulated + msgTokens > targetTokens) {
      // 找到切點：保留 i+1 之後的訊息
      cutIndex = i;
      break;
    }
    accumulated += msgTokens;
  }
  
  // 確保最少保留 minTurnsToKeep 輪 user/assistant
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

### 4. generateSummary：生成摘要

```typescript
export async function generateSummary(
  messages: AgentMessage[],
  model: ModelConfig,
  streamFn: StreamFn,
  settings: CompactionSettings,
  signal: AbortSignal
): Promise<{ summary: string; usage?: Usage }> {
  // 建構摘要 Prompt
  const summaryPrompt = buildSummaryPrompt(messages);
  
  // 呼叫 LLM 生成摘要（可用較小模型）
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

const SUMMARY_SYSTEM_PROMPT = `你是一個對話摘要助手。請將以下對話壓縮成結構化摘要，包含：
1. 關鍵決策與結論
2. 重要的程式碼變更或檔案操作
3. 解決的問題與未解決事項
4. 使用的工具與技術
請用繁體中文，保持簡潔但資訊完整。`;
```

### 5. compact：完整流程

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
  // 1. 估算 Tokens
  const tokensBefore = await estimateContextTokens(context);
  const contextWindow = context.model?.contextWindow ?? 128000;
  const targetTokens = Math.floor(contextWindow * (1 - settings.threshold));
  
  // 2. 找切點
  const { cutIndex, tokensBefore: tb, tokensAfter } = findCutPoint(
    context.messages,
    targetTokens,
    settings
  );
  
  // 3. 生成摘要（被切掉的訊息）
  const messagesToSummarize = context.messages.slice(0, cutIndex + 1);
  const { summary, usage } = await generateSummary(
    messagesToSummarize,
    context.model,
    streamFn,
    settings,
    signal
  );
  
  // 4. 重構 Context：[摘要] + [保留的訊息]
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

## 在 Agent Loop 中整合

### prepareNextTurn 呼叫 Compact

```typescript
// packages/coding-agent/src/core/agent-session.ts
prepareNextTurn: async (turn: PrepareNextTurnContext) => {
  // 1. 檢查 Compaction
  const shouldCompactResult = await shouldCompact(turn.context);
  if (shouldCompactResult) {
    const compactionResult = await compact(
      turn.context,
      this.compactionSettings,
      this.streamFunction,
      turn.signal
    );
    
    // 寫入 Session
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
  
  // 2. Model Switch、Thinking Level 等...
  return undefined;
}
```

### SessionManager 寫入 CompactionEntry

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

## Branch Summary：記錄被捨棄路徑

### 生成 Branch Summary

```typescript
// packages/agent/src/harness/compaction/branch-summarization.ts
export async function generateBranchSummary(
  options: GenerateBranchSummaryOptions,
  model: ModelConfig,
  streamFn: StreamFn,
  signal: AbortSignal
): Promise<BranchSummaryResult> {
  const { fromId, toId, context } = options;
  
  // 1. 取得被捨棄路徑的訊息
  const abandonedMessages = getAbandonedMessages(context, fromId, toId);
  
  // 2. 生成摘要
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
  // 收集 fromId 到 toId 之間的 entries
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

## Structured Compaction：Extension 自訂壓縮

### fromHook 機制

```typescript
// Extension 可實作自訂 Compaction
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

### AgentSession 整合

```typescript
// packages/coding-agent/src/core/agent-session.ts
private async runCompaction(context: AgentContext, signal: AbortSignal): Promise<CompactionResult> {
  // 1. 嘗試 Extension Compaction
  for (const ext of this.extensions) {
    if (ext.onCompaction) {
      const result = await ext.onCompaction(context, signal);
      if (result) {
        // Extension 回傳自訂結果
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
  
  // 2. Fallback 到內建 Compact
  return compact(context, this.compactionSettings, this.streamFunction, signal);
}
```

### 範例：Git-aware Compaction Extension

```typescript
// 保留 Git 相關訊息、壓縮其他
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

## CompactionEntry 完整欄位

```typescript
export interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;              // 摘要文字
  firstKeptEntryId: string;     // 保留區段起始 Entry ID
  tokensBefore: number;         // 壓縮前 Token 數
  details?: T;                  // Extension 專用資料（Structured Compaction）
  usage?: Usage;                // 生成摘要的 LLM Usage
  fromHook?: boolean;           // true = Extension 產生、false = 內建
}
```

### buildContextEntries 處理 Compaction

```typescript
// packages/coding-agent/src/core/session-manager.ts
export function buildContextEntries(
  entries: SessionEntry[],
  leafId?: string | null,
  byId?: Map<string, SessionEntry>
): SessionEntry[] {
  const path = buildSessionPath(entries, leafId, byId);
  let compaction: CompactionEntry | null = null;

  // 找最新的 Compaction
  for (const entry of path) {
    if (entry.type === "compaction") compaction = entry;
  }

  if (!compaction) return path;

  const compactionIdx = path.findIndex(e => e.id === compaction.id);
  if (compactionIdx < 0) return path;

  // 重構：[Compaction] + [FirstKept 之後] + [Compaction 之後]
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

## Compaction Settings 配置

```typescript
export interface CompactionSettings {
  threshold: number;           // Token 佔比閾值 (0-1)，預設 0.75
  minTurnsToKeep: number;      // 最少保留輪次，預設 2
  maxSummaryTokens: number;    // 摘要最大 Token，預設 4096
  summaryModel?: ModelConfig;  // 摘要用模型，undefined = 當前模型
  // 進階
  preserveSystemPrompt: boolean;  // 預設 true
  preserveTools: boolean;         // 預設 true
  preserveRecentFiles: number;    // 保留最近 N 個檔案操作，預設 5
}
```

### 預設值

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

## 參考資料

- [GitHub - earendil-works/pi — packages/agent/src/harness/compaction/](https://github.com/earendil-works/pi/tree/main/packages/agent/src/harness/compaction)
- [Pi 官方文件：Compaction](https://pi.dev/docs/latest/compaction)
- [Context Window Management Strategies](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#compaction)
- [Token Estimation Techniques](https://github.com/openai/tiktoken)

---

## 下一篇預告

> **第 13 篇：Agent Harness、Skills、System Prompt 組裝**
>
> AgentHarness 類別、System Prompt 組裝流程、Skills 載入與格式化、Prompt Templates、Harness 如何決定 Tool 可用性、Result Handling、Telemetry Schema 註冊、預設 Harness 建構。