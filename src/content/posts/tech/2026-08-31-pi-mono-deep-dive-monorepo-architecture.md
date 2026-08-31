---
title: "pi-mono 深度導讀 2：Monorepo 架構與核心抽象層——7 套件怎麼分工、依賴為什麼單向流動"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, monorepo, architecture, dependency-inversion]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 2
tldr: "從使用者可見功能切入架構：7 個 npm 套件各司其職、依賴圖單向流向、為什麼 pi-tui/pi-telemetry 零依賴、pi-ai 如何隔離 provider 細節、lockstep versioning 怎麼避免 diamond dependency。建立「從外往內」的架構心智模型。"
description: "深入 pi-mono monorepo 結構：packages/ai、agent、coding-agent、tui、telemetry、client、server、protocol 八大核心套件職責邊界、依賴方向、版本策略、建構順序、供應鏈硬化機制。適合想理解大型 TypeScript monorepo 架構決策的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-monorepo-architecture-en)

## TL;DR

- **7 核心套件**：`pi-ai`、`pi-agent-core`、`pi-coding-agent`、`pi-tui`、`pi-telemetry`、`pi-client`、`pi-server` + `pi-protocol`、`session-backends`
- **依賴單向流**：`pi-tui`/`pi-telemetry` (leaf) → `pi-ai` → `pi-agent-core` → `pi-coding-agent`（root）
- **關鍵設計**：零依賴 leaf 套件、provider 細節封裝在 `pi-ai/api/*`、lockstep versioning 統一版本號
- **建構順序**：手寫拓撲序、零配置、完全可審計
- **供應鏈**：Exact versions + shrinkwrap + min-release-age=2 + npm OIDC trusted publishing

---

## 專案全景：從 CLI 使用者看不到的地方

第 1 篇我們用「黑盒」視角操作 pi。現在打開盒子，看 7 個 npm 套件怎麼分工協作：

```
pi-mono (earendil-works/pi)
├── packages/ai              # pi-ai：統一多供應商 LLM API
├── packages/agent           # pi-agent-core：Agent Runtime + Loop + Harness
├── packages/coding-agent    # pi-coding-agent：CLI 入口 + Session + SDK
├── packages/tui             # pi-tui：Terminal UI Library (Differential Rendering)
├── packages/telemetry       # pi-telemetry：Vendor-neutral Telemetry Contracts
├── packages/client          # pi-client：Remote Session Client
├── packages/server          # pi-server：Remote Session Server
├── packages/protocol        # pi-protocol：JSON-RPC/WebSocket 協定定義
└── packages/session-backends/
    └── sqlite-node          # Session 儲存後端（可插拔）
```

### 套件職責一覽表

| 套件 | NPM Scope | 核心職責 | 關鍵 Export |
|---|---|---|---|
| **pi-ai** | `@earendil-works/pi-ai` | 統一 LLM 介面、Provider Factory、Model Catalog、Auth、Streaming | `Message`、`Tool`、`Context`、`streamFunction`、OAuth helpers |
| **pi-agent-core** | `@earendil-works/pi-agent-core` | Agent Loop、Harness、Tool Execution、Compaction、Branch Summary、Telemetry Schema | `agentLoop`、`AgentHarness`、`executeToolCalls`、`compact`、`TelemetrySchema` |
| **pi-coding-agent** | `@earendil-works/pi-coding-agent` | CLI、Session Manager、Extension Runtime、Model Registry、SDK、TUI Components | `main`、`SessionManager`、`ExtensionRunner`、`createAgentSession`、`InteractiveMode` |
| **pi-tui** | `@earendil-works/pi-tui` | Virtual DOM Diff、CSI 2026、Component Tree、Layout Engine、Keybindings | `TUI`、`Component`、`LayoutNode`、`EditorComponent`、`MarkdownComponent` |
| **pi-telemetry** | `@earendil-works/pi-telemetry` | Schema-defined Telemetry、Conformance Tests、NOOP/InMemory 實作 | `TelemetrySchema`、`defineTelemetrySchema`、`InMemoryTelemetryContext` |
| **pi-protocol** | `@earendil-works/pi-protocol` | JSON-RPC 2.0 Types、WebSocket Framing、Reconnection Logic | `ProtocolMessage`、`ClientMessage`、`ServerMessage`、`WebSocketTransport` |
| **pi-client** | `@earendil-works/pi-client` | Remote Session Client、Auto-reconnect、Event Stream | `Client`、`RemoteSession`、`Connection` |
| **pi-server** | `@earendil-works/pi-server` | Remote Session Server、Session Registry、Auth Middleware | `Server`、`SessionManager`、`ProtocolHandler` |

---

## 依賴圖：為什麼單向流動？

```
┌─────────────────────────────────────────────────────────────────┐
│                        pi-coding-agent (CLI 入口)                │
│  依賴：pi-agent-core, pi-ai, pi-tui, pi-telemetry, pi-client    │
└─────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────┐
│                      pi-agent-core (Agent 核心)                  │
│  依賴：pi-ai, pi-telemetry                                       │
└─────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────┐
│                         pi-ai (LLM 整合層)                       │
│  依賴：pi-telemetry (可選，用於 AI 相關 spans)                   │
└─────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────┐
│              pi-tui (零依賴)    │    pi-telemetry (零依賴)       │
│  純 TypeScript、無外部依賴        │  純 TypeScript、無外部依賴    │
└─────────────────────────────────────────────────────────────────┘

Remote 層（平行）：
  pi-client ← pi-protocol → pi-server
  ↑                              ↑
  └────────── pi-telemetry ──────┘
```

### 依賴方向鐵律

| 規則 | 理由 | 違反後果 |
|---|---|---|
| **Leaf 套件零外部依賴** | `pi-tui`、`pi-telemetry` 可被任何專案獨立引用 | 引入循環依賴、增加 bundle size、污染純度 |
| **核心邏輯不依賴 CLI** | `pi-agent-core`、`pi-ai` 無 `pi-coding-agent` 依賴 | SDK/Embed 使用者不需安裝 CLI 相關代碼 |
| **Provider 細節內隱** | `pi-ai` 只 export 介面與 Factory，具體實作在 `api/*`、 `providers/*` | Tree-shaking 有效、使用者不見內部實作 |
| **Protocol 獨立** | `pi-protocol` 只定義類型與帧格式，無業務邏輯 | Client/Server 可獨立演進、多語言實作友善 |

---

## 核心抽象層級（從外往內，對應依賴深度）

### Layer 0：基礎設施——零依賴、可獨立分發

#### pi-tui：Terminal UI Engine

```typescript
// packages/tui/src/index.ts - 主要 export
export { TUI } from "./tui.ts";
export { Component, LayoutNode, VStack, HStack, Box, Text, MarkdownComponent, EditorComponent } from "./components/index.ts";
export { KeybindingsManager, DEFAULT_EDITOR_KEYBINDINGS, DEFAULT_APP_KEYBINDINGS } from "./keybindings.ts";
export { Terminal, AltScreen } from "./terminal.ts";
```

**核心能力**：
- **Differential Rendering**：Virtual DOM diff → 最小化 ANSI 序列輸出 → 無閃爍
- **CSI 2026 Synchronized Output**：批次輸出、避免 partial frame tearing
- **Layout Engine**：Flex-like 布局（VStack/HStack/Box）、動態尺寸計算
- **Component Tree**：`Component` 基類、`render(context)`、`diff(prev, next)`、`mount/unmount`
- **Keyboard System**：`KeybindingsManager`、chord 支援（`ctrl+shift+p`）、platform-normalized keys

> **為什麼零依賴？** TUI 是最底層的渲染引擎，任何 TypeScript 專案（不只是 pi）都應該能直接 `import { TUI } from '@earendil-works/pi-tui'` 使用。

#### pi-telemetry：Vendor-neutral Contracts

```typescript
// packages/telemetry/src/index.ts
export { defineTelemetrySchema, createTypedSpanStarter, InMemoryTelemetryContext, NOOP_TELEMETRY_CONTEXT } from "./index.ts";
export type { TelemetrySchema, TelemetrySpan, TelemetryContext, SpanAttributes, TelemetryAttributeDefinition } from "./index.ts";
```

**核心能力**：
- **Schema-defined**：先定義 Schema（span 名稱、屬性、事件），再產生 typed starters
- **Vendor-neutral**：不綁定 OpenTelemetry、Datadog、Honeycomb；adapter 由使用者提供
- **Conformance Tests**：`testing/conformance.ts` 驗證 adapter 是否正確實作契約
- **Zero-overhead NOOP**：`NOOP_TELEMETRY_CONTEXT` 讓不需要 telemetry 的路徑零成本

> **為什麼不直接用 OpenTelemetry？** OTel API 複雜、bundle 大、強制特定資料模型。pi 要的是「定義自己的 schema、任選後端、測試能跑」。

---

### Layer 1：LLM 整合層——封裝所有 Provider 差異

#### pi-ai：統一介面、Lazy Loading、Model Catalog

```
packages/ai/
├── src/
│   ├── index.ts                    # 公共 API（只 export types + 核心 utilities）
│   ├── types.ts                    # Message、Tool、Context、StreamEvent 等核心型別
│   ├── models.ts                   # Model Registry、Resolver、Catalog
│   ├── models.generated.ts         # 自動產生的模型資料（不可手改）
│   ├── models-store.ts             # Model 資料儲存與查詢
│   ├── providers/
│   │   ├── index.ts                # Provider Factory Registry
│   │   ├── faux.ts                 # 測試用 Faux Provider
│   │   ├── anthropic/              # Anthropic Provider 實作
│   │   ├── openai/                 # OpenAI Provider 實作
│   │   ├── google/                 # Google Provider 實作
│   │   └── ...                     # 15+ providers
│   ├── api/                        # 具體 API 實作（lazy-loaded）
│   │   ├── anthropic-messages.ts
│   │   ├── openai-responses.ts
│   │   ├── google-generative-ai.ts
│   │   └── ...
│   ├── auth/                       # OAuth、API Key、Credential Store
│   └── utils/                      # Streaming、JSON Parse、Retry、Validation
```

**關鍵抽象**：

```typescript
// 統一的 Streaming 介面（所有 provider 實作此介面）
export interface StreamFunction {
  (model: ModelConfig, context: Context, options: StreamOptions): AsyncIterable<StreamEvent>;
}

// StreamEvent 類型統一
export type StreamEvent =
  | { type: "start"; partial: AssistantMessage }
  | { type: "text_delta"; partial: AssistantMessage }
  | { type: "toolcall_delta"; partial: AssistantMessage }
  | { type: "done"; result: () => Promise<AssistantMessage> }
  | { type: "error"; error: Error };
```

**Lazy Loading 機制**：

```typescript
// packages/ai/src/api/lazy.ts
export const anthropicMessages = lazy(() => import("./anthropic-messages.ts").then(m => m.streamAnthropicMessages));
export const openaiResponses = lazy(() => import("./openai-responses.ts").then(m => m.streamOpenAIResponses));
// ...

// 使用時才動態 import，tree-shaking 會移除未使用的 provider 代碼
```

**Model Catalog 自動生成**：

```bash
# 產生模型資料（從各 provider 官方 API 抓取）
npm run generate:models

# 輸出：packages/ai/src/models.generated.ts（約 50KB、含所有模型 metadata）
# 包含：model id、display name、context window、max output、pricing、capabilities、thinking 支援
```

> **架構洞察**：`pi-ai` 是「反腐層」——上層只見 `Message`、`Tool`、`Context`、`streamFunction`；下層 15+ providers 各自實作 `streamFunction`，細節完全隔離。

---

### Layer 2：Agent 核心層——Loop、Harness、Tool Execution

#### pi-agent-core：Agent Runtime

```
packages/agent/
├── src/
│   ├── index.ts                    # 公共 API
│   ├── types.ts                    # AgentMessage、AgentTool、AgentContext、AgentEvent、AgentLoopConfig
│   ├── agent-loop.ts               # 核心雙層 while 迴圈（~800 行）
│   ├── stream-fn.ts                # 預設 streamFunction wrapper
│   ├── harness/
│   │   ├── agent-harness.ts        # Harness 組裝：system prompt、tools、skills、compaction
│   │   ├── compaction/             # Compaction 邏輯（token estimation、cut point、summary 生成）
│   │   ├── branch-summarization.ts # Branch Summary 生成
│   │   ├── messages.ts             # System/User/Assistant message builders
│   │   ├── prompt-templates.ts     # Prompt Template 系統
│   │   ├── result.ts               # AgentResult、TurnResult
│   │   ├── session/                # Session 介面（供 harness 使用）
│   │   ├── skills.ts               # Skills 載入與格式化
│   │   ├── system-prompt.ts        # System Prompt 組裝
│   │   ├── telemetry.ts            # Telemetry Schema 定義
│   │   ├── tools/                  # 內建工具定義（bash、read、write、edit、grep、find、ls）
│   │   └── types.ts                # Harness 核心型別
│   ├── proxy.ts                    # Agent Proxy（RPC 模式用）
│   └── search/                     # 搜尋相關工具
```

**Agent Loop 核心簽名**：

```typescript
// packages/agent/src/agent-loop.ts
export function agentLoop(
  prompts: AgentMessage[],
  context: AgentContext,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  streamFn: StreamFn,
): EventStream<AgentEvent, AgentMessage[]>;

// AgentLoopConfig 關鍵欄位
export interface AgentLoopConfig {
  model: ModelConfig;
  tools: AgentTool[];
  systemPrompt: string;
  convertToLlm: (messages: AgentMessage[]) => Promise<Message[]>;
  transformContext?: (messages: AgentMessage[], signal) => Promise<AgentMessage[]>;
  getApiKey?: (provider: string) => Promise<string | undefined>;
  apiKey?: string;
  reasoning?: "low" | "medium" | "high" | "off";
  toolExecution: "parallel" | "sequential";
  beforeToolCall?: (ctx, signal) => Promise<{ block?: boolean; reason?: string; terminate?: boolean }>;
  afterToolCall?: (ctx, signal) => Promise<ToolResultPatch>;
  shouldStopAfterTurn?: (turn: PrepareNextTurnContext) => Promise<boolean>;
  getSteeringMessages?: () => Promise<AgentMessage[]>;      // Steering (Enter)
  getFollowUpMessages?: () => Promise<AgentMessage[]>;      // Follow-up (Alt+Enter)
  prepareNextTurn?: (turn: PrepareNextTurnContext) => Promise<NextTurnSnapshot>; // Compaction、Model Switch
}
```

**雙層迴圈架構**（第 4 篇深入）：

```
Outer Loop (while true):
  ├─ 準備下一輪（prepareNextTurn：compaction、model switch、steering 收集）
  ├─ Inner Loop (while hasMoreToolCalls || pendingMessages):
  │   ├─ 處理 pending messages (steering/follow-up 注入)
  │   ├─ streamAssistantResponse() → LLM 呼叫
  │   ├─ 解析 tool calls
  │   ├─ executeToolCalls() (parallel/sequential + before/after hooks)
  │   ├─ 發送 turn_end event
  │   ├─ shouldStopAfterTurn() 檢查是否結束
  │   └─ 收集 follow-up messages
  └─ 若有 follow-up → 繼續 outer loop；否則 break
```

---

### Layer 3：應用層——CLI、Session、Extension、SDK

#### pi-coding-agent：使用者面向的完整應用

```
packages/coding-agent/
├── src/
│   ├── index.ts                    # 統一 export（巨大、~400 行）
│   ├── main.ts                     # CLI 入口、參數解析、模式分派
│   ├── cli.ts                      # 參數定義、子指令
│   ├── config.ts                   # 路徑常數、版本資訊
│   ├── core/
│   │   ├── agent-session.ts        # AgentSession 類別（Interactive 模式核心）
│   │   ├── session-manager.ts      # SessionManager（Tree、Branching、Compaction、Persist）
│   │   ├── session-manager.test.ts # 測試
│   │   ├── compaction/             # Compaction 整合（使用 pi-agent-core 的邏輯）
│   │   ├── extensions/             # Extension Runtime、Hooks、API 定義
│   │   ├── model-registry.ts       # ModelRegistry（Scope、Diagnostics、Resolver）
│   │   ├── model-resolver.ts       # CLI model string → ModelConfig 解析
│   │   ├── model-runtime.ts        # ModelRuntime（Credential Sync、Auth Overrides）
│   │   ├── sdk.ts                  # 程式化 API：createAgentSession、createCodingTools
│   │   ├── settings-manager.ts     # Settings 持久化、Schema 驗證
│   │   ├── trust-manager.ts        # Project Trust（允許/拒絕工具執行）
│   │   ├── tools/                  # 8 個核心工具實作（bash、read、write、edit、grep、find、ls、powershell）
│   │   └── messages.ts             # Session Entry → Context Messages 轉換
│   ├── modes/
│   │   ├── index.ts                # Mode export
│   │   ├── interactive/            # InteractiveMode 類別、Components、Theme
│   │   ├── rpc/                    # RpcMode、RpcClient、JSONL Transport
│   │   └── print/                  # PrintMode、JSONMode
│   └── utils/                      # 眾多工具函式（git、clipboard、image、shell、diff 等）
```

**SessionManager 核心**（第 5 篇深入）：

```typescript
// packages/coding-agent/src/core/session-manager.ts
export class SessionManager {
  // Tree 結構：append-only、id/parentId
  appendMessage(message): string;
  appendThinkingLevelChange(level): string;
  appendModelChange(provider, modelId): string;
  appendCompaction(summary, firstKeptEntryId, tokensBefore): string;
  branch(branchFromId): void;                    // 移動 leaf pointer
  branchWithSummary(branchFromId, summary): string; // 分支 + 摘要舊路徑
  buildSessionContext(): SessionContext;          // 給 LLM 的 context（含 compaction 處理）
  buildContextEntries(): SessionEntry[];          // 給 TUI 渲染的 entries
  createBranchedSession(leafId): string | undefined; // Fork 到新檔案
  getTree(): SessionTreeNode[];                   # 視覺化樹結構
}
```

**Extension System**（第 7 篇深入）：

```typescript
// Extension 定義
export interface Extension {
  name: string;
  version: string;
  // 生命週期
  onLoad?(api: ExtensionAPI): Promise<void> | void;
  onUnload?(api: ExtensionAPI): Promise<void> | void;
  // Hooks
  onAgentStart?(event): Promise<BeforeAgentStartEventResult>;
  onBeforeToolCall?(ctx): Promise<{ block?: boolean; reason?: string; terminate?: boolean }>;
  onAfterToolCall?(ctx): Promise<ToolResultPatch>;
  onTurnEnd?(event): Promise<void>;
  // 擴充點
  tools?: RegisteredTool[];
  commands?: RegisteredCommand[];
  keybindings?: AppKeybinding[];
  ui?: { components?: EntryRenderer[]; widgets?: WidgetDefinition[] };
  settings?: SettingsConfig;
}
```

---

### Layer 4：Remote 層——平行於主流程

#### pi-protocol / pi-client / pi-server

```
packages/protocol/src/
├── index.ts           # 類型定義
├── protocol.ts        # JSON-RPC 2.0 訊息結構
├── client.ts          # Client 端訊息處理
├── server.ts          # Server 端訊息處理
└── types.ts           # 共用型別

packages/client/src/
├── client.ts          # Client 類別、連線管理、重連邏輯
├── connection.ts      # WebSocket 連線、心跳、事件流
├── session-handle.ts  # Remote Session Handle
└── transport.ts       # Transport 抽象（WebSocket、未來可換）

packages/server/src/
├── server.ts          # Server 類別、Session Registry
├── sessions.ts        # Session 管理、Auth Middleware
├── protocol.ts        # 協定處理器
└── snapshots.ts       # Session 快照（支援斷點續傳）
```

**Remote Session 流程**：

```
Client (pi --rpc 或 IDE)                    Server (pi server)
     │                                          │
     ├── WebSocket Connect ──────────────────→ │
     │                                          │
     ├── JSON-RPC: prompt ──────────────────→ │
     │                                          ├── 建立/恢復 SessionManager
     │                                          ├── 執行 Agent Loop
     │                                          │
     │ ←────────── Streaming Events ────────── │  (message_start, tool_execution, turn_end...)
     │                                          │
     ├── JSON-RPC: steering/follow-up ──────→ │  (中途插隊)
     │                                          │
     ├── Disconnect ────────────────────────→ │
```

---

## Monorepo 運作機制

### 版本策略：Lockstep Versioning

```json
// 根 package.json
{
  "version": "0.12.3",
  "workspaces": ["packages/*", "packages/session-backends/*", ...],
  "scripts": {
    "version:patch": "npm version patch --workspaces --no-git-tag-version --no-workspaces-update && node scripts/sync-versions.js && npm install --package-lock-only --ignore-scripts",
    "release:patch": "node scripts/release.mjs patch",
    "release:minor": "node scripts/release.mjs minor"
  }
}
```

- **所有套件共用同一版本號**（`0.12.3`）
- **Patch** = fixes + additions、**Minor** = breaking changes、**無 Major**
- `scripts/sync-versions.js` 同步所有 workspace 版本
- Release script：bump 版本 → 更新 CHANGELOG → 重新產生 artifacts → `npm run check` → commit → tag → push → CI 發佈

### 建構順序：手寫拓撲序

```json
// 根 package.json scripts.build
"build": "cd packages/tui && npm run build && \
          cd ../telemetry && npm run build && \
          cd ../ai && npm run build && \
          cd ../agent && npm run build && \
          cd ../session-backends/sqlite-node && npm run build && \
          cd ../../protocol && npm run build && \
          cd ../client && npm run build && \
          cd ../server && npm run build && \
          cd ../coding-agent && npm run build"
```

**為什麼不依賴 `npm run build --workspaces`？**
- 控制精確順序（tui → telemetry → ai → agent → ...）
- 避免並行建構導致的 race condition
- 完全可審計、零隱性依賴

### 供應鏈硬化

| 機制 | 實作 | 目的 |
|---|---|---|
| **Exact versions** | 所有外部依賴鎖死版本號 | 可重現建構 |
| **npm-shrinkwrap.json** | `scripts/generate-coding-agent-shrinkwrap.mjs` 從根 lockfile 產生 | 發佈給 npm 使用者的 transitive deps 也鎖死 |
| **min-release-age=2** | `.npmrc` 設定 | 避免同天發佈的惡意套件被解析 |
| **PI_ALLOW_LOCKFILE_CHANGE=1** | Pre-commit 擋住 lockfile 變更 | 強制審查依賴變更 |
| **Lifecycle script allowlist** | Shrinkwrap 生成腳本檢查 | 新增 lifecycle script 需顯式審查 |
| **npm ci --ignore-scripts** | CI 安裝 | 不執行任意 install scripts |
| **Trusted Publishing** | GitHub Actions OIDC → npm | 無需本地 npm token、OTP、WebAuthn |

---

## 關鍵設計決策回顧

| 決策點 | 選擇 | 替代方案 | 為什麼選這個 |
|---|---|---|---|
| Monorepo 工具 | npm workspaces + 手寫 build | Turborepo、Nx、pnpm workspaces | 零配置、原生、完全控制、無額外依賴 |
| 版本策略 | Lockstep | Independent versioning | 避免 diamond dependency、單一版本發佈、心智負擔低 |
| 依賴方向 | 嚴格單向、Leaf 零依賴 | 允許雙向、共用 utils | 可獨立分發、Tree-shaking、架構清晰 |
| Provider 封裝 | `pi-ai/api/*` lazy-loaded | 所有 provider 靜態 import | Bundle size、啟動速度、Tree-shaking |
| Telemetry | 自定 Schema + Conformance | OpenTelemetry | 輕量、自定義資料模型、測試友善 |
| Remote 協定 | JSON-RPC 2.0 over WebSocket | gRPC、自定二進制 | 人類可讀、瀏覽器原生、多語言易實作 |
| Session 儲存 | JSONL append-only tree | SQLite、Redis、CRDT | 簡單、可人工檢視、Git-friendly、無遷移痛苦 |

---

## 參考資料

- [Pi 官方網站 pi.dev — 架構概覽](https://pi.dev/docs/latest/architecture)
- [GitHub - earendil-works/pi — Monorepo 結構](https://github.com/earendil-works/pi/tree/main/packages)
- [npm workspaces 官方文件](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [TypeScript ESM + Node 22 原生支援](https://nodejs.org/docs/latest-v22.x/api/esm.html)
- [Supply-chain hardening: npm shrinkwrap 與 trusted publishing](https://docs.npmjs.com/cli/v10/commands/npm-shrinkwrap)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [CSI 2026 Synchronized Output 標準](https://github.com/microsoft/terminal/blob/main/doc/synchronized-output.md)

---

## 下一篇預告

> **第 3 篇：pi-ai：統一多供應商 LLM API**
>
> 15+ providers 怎麼在同一介面下工作？`streamFunction` 簽名長什麼樣？Lazy loading 怎麼實現 tree-shaking？Model Catalog 如何自動生成？OAuth 與 API Key 怎麼統一管理？Credential Sync 機制？