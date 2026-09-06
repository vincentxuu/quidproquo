---
title: "pi-mono 深度導讀系列：從零認識這個極簡 Coding Agent 的完整架構"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, monorepo, architecture, agent-loop, session-management]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 0
tldr: "本系列 17 篇帶你從 CLI 使用者角度切入，逐層深入 pi-mono 的 Agent Loop、Session Tree、Tool System、Extension System、TUI 架構、Remote Session、Telemetry、Compaction、Release 流程等核心機制。適合想自架 Agent、研究 Agent 架構、或想貢獻 pi 的開發者。"
description: "pi-mono 是 Mario Zechner 打造的極簡 coding agent monorepo（TypeScript、MIT、@earendil-works scope）。本文為系列導覽，概覽 7 個核心套件、依賴關係、設計哲學，並列出完整 17 篇閱讀地圖。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-series-overview-en)

## TL;DR

- **專案**：pi-mono → 已改名 [earendil-works/pi](https://github.com/earendil-works/pi)，npm scope `@earendil-works`
- **核心**：7 個套件組成的 monorepo，主打「極簡核心 + 無限擴充」
- **定位**：不是 batteries-included 的成品 agent，而是給開發者「自己組」的 primitives
- **系列**：17 篇，從 CLI 使用 → 架構概觀 → Agent Loop → Session/Compaction → Tools → Extensions → TUI → Remote/Telemetry/Release
- **先備知識**：TypeScript 基礎、CLI 操作、LLM 基本概念；不需要 Rust、C++、分散式系統經驗

---

## 這個系列是為誰寫的？

| 讀者畫像 | 你會得到什麼 |
|---|---|
| 想自架/客製化 coding agent 的工程師 | 完整架構圖譜、可直接借鑑的設計模式 |
| 研究 AI Agent 架構的學者/學生 | 真實生產級代碼的逐層拆解、決策理由 |
| 想貢獻 pi / 開發 Extension 的開發者 | Extension API 完整機制、Hook points、最佳實踐 |
| 好奇「極簡主義」怎麼在工程上落地的讀者 | 4 個工具怎麼支撐完整 coding workflow、為什麼不做 MCP/Sub-agents |

**不適合**：想要「開箱即用、功能最全」的使用者 → 請直接用 [Claude Code](https://claude.ai/code)、[Codex CLI](https://codex.cli)、[OpenCode](https://opencode.ai) 或 [oh-my-pi](https://github.com/can1357/oh-my-pi)。

---

## 專案概覽：7 個核心套件

```
pi-mono (earendil-works/pi)
├── packages/ai              # pi-ai：統一多供應商 LLM API
├── packages/agent           # pi-agent-core：Agent Runtime + Loop + Harness
├── packages/coding-agent    # pi-coding-agent：CLI 入口 + Session + SDK
├── packages/tui             # pi-tui：Terminal UI Library (Differential Rendering)
├── packages/telemetry       # pi-telemetry：Vendor-neutral Telemetry Contracts
├── packages/client          # pi-client：Remote Session Client
├── packages/server          # pi-server：Remote Session Server
├── packages/protocol        # pi-protocol：JSON-RPC/WebSocket 協定
└── packages/session-backends/*  # Session 儲存後端
```

### 套件依賴關係（簡化版）

```
pi-tui (zero deps)
    ↑
pi-telemetry (zero deps)
    ↑
pi-ai ─────────────────────→ 15+ providers (OpenAI, Anthropic, Google, Azure, Bedrock, Mistral, Groq, Cerebras, xAI, HF, Ollama, OpenRouter...)
    ↑
pi-agent-core ←────────────── pi-telemetry, pi-ai
    ↑
pi-coding-agent ←──────────── pi-agent-core, pi-ai, pi-tui, pi-telemetry
    ↑                    ↑
pi-client ──────────────→ pi-protocol ←────────── pi-server
    ↑
session-backends/sqlite-node
```

### 關鍵設計決策一覽

| 決策 | 內容 | 理由 |
|---|---|---|
| **語言** | TypeScript (ESM, Node ≥ 22.19) | 型別安全、生態豐富、前後端共用型別 |
| **Monorepo 工具** | npm workspaces + 手寫 build 順序 | 完全控制、零配置依賴、供應鏈可審計 |
| **版本策略** | Lockstep versioning (所有套件同版本) | 避免 diamond dependency、單一版本發佈 |
| **依賴鎖定** | Exact versions + `npm-shrinkwrap.json` + `min-release-age=2` | Supply-chain hardening、可重現建構 |
| **測試策略** | Vitest (unit) + Faux Provider (e2e 無 API Key) + Browser smoke | CI 快速、不依賴外部服務、可本地跑 |
| **Code Quality** | Biome (lint/format) + tsgo (type check) + pinned deps check | 單一工具鏈、極速、不妥協 |
| **Release** | Local smoke → `release:patch/minor` → CI trusted publishing → R2 marker | 零人工干預、npm OIDC、版本發佈即可驗證 |

---

## 核心抽象層級（從外往內）

```
┌─────────────────────────────────────────────────────────────┐
│ 使用者介面層                                                 │
│  ├── CLI (Interactive / Print / JSON / RPC / SDK)           │
│  ├── TUI Components (Markdown, Editor, Selector, Diff...)   │
│  └── Extension UI (Widgets, Dialogs, Custom Renderers)      │
├─────────────────────────────────────────────────────────────┤
│ 應用邏輯層                                                   │
│  ├── Session Manager (Tree, Branching, Compaction, Fork)    │
│  ├── Model Registry / Resolver / Runtime (15+ providers)    │
│  ├── Extension Runtime (Hooks, Tools, Commands, Keys, UI)   │
│  └── Settings / Trust / Package Manager                     │
├─────────────────────────────────────────────────────────────┤
│ Agent 核心層                                                  │
│  ├── Agent Loop (Double While: Inner tool calls, Outer follow-up) │
│  ├── Harness (System Prompt, Skills, Compaction, Branch Summary) │
│  ├── Tool Execution (Parallel/Sequential, Before/After Hooks)    │
│  └── Telemetry (Schema-defined, Vendor-neutral)                │
├─────────────────────────────────────────────────────────────┤
│ LLM 整合層                                                    │
│  ├── Unified API (Messages, Tools, Streaming, Thinking)     │
│  ├── Provider Factories (Lazy-loaded, Tree-shakable)        │
│  ├── Model Catalog (Auto-generated, Versioned)              │
│  └── Auth (API Key, OAuth, Credential Store, Sync)          │
├─────────────────────────────────────────────────────────────┤
│ 基礎設施層                                                    │
│  ├── TUI Engine (Virtual DOM Diff, CSI 2026, Kitty Images)  │
│  ├── Session Storage (JSONL, Append-only, Tree Index)       │
│  ├── Protocol (JSON-RPC 2.0, WebSocket, Reconnection)       │
│  └── Telemetry Contracts (Schema, Conformance Tests)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 系列閱讀地圖（17 篇）

| Order | 標題 | 聚焦問題 | 狀態 | 預估長度 |
|---|---|---|---|---|
| 0 | **系列導覽與專案概覽** (本文) | 這個專案是什麼？系列怎麼讀？ | ✅ 發布 | — |
| 1 | **從 CLI 使用者角度認識 pi** | 裝起來怎麼用？4 模式怎麼切？Session 怎麼存？ | 🔄 撰寫中 | ~2500 字 |
| 2 | **Monorepo 架構與核心抽象層** | 7 套件怎麼分工？依賴怎麼單向？為什麼這樣切？ | ⏳ 待寫 | ~3000 字 |
| 3 | **pi-ai：統一多供應商 LLM API** | 15+ providers 怎麼同一介面？Lazy loading？Streaming 怎麼統一？ | ⏳ 待寫 | ~3500 字 |
| 4 | **Agent Loop：雙層循環與事件流** | 為什麼雙 while？Steering vs Follow-up？中斷怎麼處理？ | ⏳ 待寫 | ~4000 字 |
| 5 | **Session Tree：Append-only、Branching、Compaction** | Tree 結構怎麼存？Branch 怎麼不改歷史？Compaction 觸發點？ | ⏳ 待寫 | ~3500 字 |
| 6 | **Tool System：定義、執行、Parallel/Sequential、Hooks** | Tool 定義長什麼樣？Before/After hook 怎麼攔截？ | ⏳ 待寫 | ~3000 字 |
| 7 | **Extension System：Hooks、Custom Tools、UI Components、Lifecycle** | Extension 能做什麼？怎麼載入？怎麼存取 TUI？ | ⏳ 待寫 | ~4000 字 |
| 8 | **TUI 架構：Differential Rendering、Component Tree、Layout Engine** | 無閃爍怎麼做？Virtual DOM Diff？CSI 2026 是什麼？ | ⏳ 待寫 | ~3500 字 |
| 9 | **Model Catalog、Provider Factory、OAuth 與 Credential Sync** | 模型資料怎麼產？Provider 怎麼懶載？OAuth 流程？ | ⏳ 待寫 | ~3000 字 |
| 10 | **Remote Session：Client/Server、Protocol、RPC、WebSocket** | 遠端 session 怎麼同步？JSON-RPC 怎麼定義？Reconnection？ | ⏳ 待寫 | ~3000 字 |
| 11 | **Telemetry：Vendor-neutral Contracts、Schema、Conformance** | 為什麼不直接用 OpenTelemetry？Schema 怎麼定義？ | ⏳ 待寫 | ~2500 字 |
| 12 | **Compaction 深度：策略、Token Estimation、Branch Summary、Structured Compaction** | Token 怎麼估？Cut point 怎麼找？Extension 怎麼自訂？ | ⏳ 待寫 | ~3500 字 |
| 13 | **Agent Harness、Skills、System Prompt 組裝** | System prompt 怎麼組？Skills 怎麼載入？Prompt template？ | ⏳ 待寫 | ~2500 字 |
| 14 | **Testing、Quality Gates、Supply-chain Hardening** | Faux provider？Browser smoke？Pinned deps？Shrinkwrap？ | ⏳ 待寫 | ~3000 字 |
| 15 | **Containerization、Sandbox、Permission Model** | Gondolin？Docker？OpenShell？為什麼不內建 permission？ | ⏳ 待寫 | ~2500 字 |
| 16 | **Release 流程、Lockstep Versioning、Binary Build、Trusted Publishing** | 怎麼單一版本發佈？Binary 怎麼建？npm OIDC 流程？ | ⏳ 待寫 | ~3000 字 |

### 閱讀順序建議

```
新手/使用者視角：0 → 1 → 2 → 3 → 4 → 5 → 6 → 7
架構師/貢獻者視角：0 → 2 → 4 → 5 → 6 → 7 → 8 → 3 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16
只想看特定主題：每篇前置標註 `前置：需要先讀 order X`，可跳轉
```

---

## 斷崖處理：認知跳躍怎麼橋接

| 位置 | 認知跳躍 | 橋接方式 |
|---|---|---|
| 1→2 | 從「怎麼用」跳到「為什麼這樣切」 | 1 篇結尾留「架構預覽」段落，2 篇開頭回顧使用者痛點 |
| 3→4 | 從 LLM API 跳到 Agent Loop | 3 篇最後展示 `streamFunction` 簽名，4 篇直接接 `runLoop` 如何呼叫它 |
| 5→6 | 從 Session 跳到 Tool | 5 篇提到 `toolResult` 入 session，6 篇從 `executeToolCalls` 開始 |
| 7→8 | 從 Extension API 跳到 TUI 內部 | 7 篇展示 `ExtensionUIDialogOptions`，8 篇拆解 `DialogComponent` 實作 |
| 10→11 | 從網路協定跳到 Telemetry | 10 篇最後提到 `telemetry` binding，11 篇解釋為什麼要自己定 Schema |
| 12→13 | 從 Compaction 細節跳到 Harness 組裝 | 12 篇結尾說「Harness 決定何時觸發」，13 篇接 `shouldCompact`、`prepareCompaction` |

---

## 站內前置知識連結（需要時隨時查）

| 主題 | 站內導讀 |
|---|---|
| LLM 基礎、Token、Context Window | [LLM 術語表](/search?q=LLM&mode=rag) |
| RAG / Embedding / Vector Search | [RAG 系統模式完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide) |
| AI Agent 架構模式 | [AI Agent 架構模式完整指南](/posts/ai/2026-03-18-ai-agent-patterns-guide) |
| MCP 協定 | [MCP 協定完整介紹](/posts/ai/2026-03-22-mcp-model-context-protocol) |
| Cloudflare Workers / D1 / Vectorize | [Cloudflare Workers 完整介紹](/posts/tech/2026-03-27-cloudflare-workers-edge-compute) |
| TypeScript / ESM / tsgo | [TypeScript 7 Native 編譯器](/posts/tech/2026-08-22-typescript-7-native-en) |
| Differential Rendering / Virtual DOM | [Looplane TUI 架構](/posts/tech/2026-08-23-looplane-tui-cli-ergonomics) |

---

## 怎麼跟著系列實作/實驗

每篇結尾會附上 **可執行動作**：

```bash
# 範例：第 1 篇結尾
# 1. 安裝並跑起來
npm install -g @earendil-works/pi-coding-agent
pi --help

# 2. 用 Ollama 跑本地模型
ollama pull qwen3:1.7b
pi -p "用繁體中文說 hello world" --model ollama:qwen3:1.7b

# 3. 看 session 檔案
cat ~/.pi/agent/sessions/--your-cwd--/latest.jsonl
```

建議準備：
- Node.js ≥ 22.19
- `pi` CLI 安裝（或 `./pi-test.sh` 從 source 跑）
- 一個有 Git repo 的專案目錄（測試 session、tools、git 整合）
- 可選：Ollama / API Keys（Anthropic、OpenAI 等）

---

## 參考資料

- [Pi 官方網站 pi.dev — coding agent 架構與文件](https://pi.dev/)
- [GitHub - earendil-works/pi — pi-mono monorepo 原始碼](https://github.com/earendil-works/pi)
- [Pi 作者部落格：打造極簡 coding agent 的心得 — Mario Zechner 設計哲學](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Mario Zechner 演講：Building pi in a World of Slop (AI Engineer) — 極簡主義 Agent 設計](https://www.youtube.com/watch?v=RjfbvDXpFls)
- [npm - @earendil-works/pi-coding-agent — 套件發佈頁面](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)
- [舊版 Pi 介紹文：Pi Coding Agent：極簡主義的開源終端機 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness) —— 含與 OpenClaw、omp 的關係說明

---

## 下一篇預告

> **第 1 篇：從 CLI 使用者角度認識 pi**
>
> 裝起來、跑起來、切模式、存 session、看 tree、匯出 HTML、插隊送訊息。把「黑盒」變成「透明盒」，為後續架構篇建立直覺。