---
title: "同名不同層：meta-harness、ACP、HarnessAgent 與 Flue 到底在爭哪一層"
date: 2026-08-26
category: ai
type: deep-dive
tags: [meta-harness, acp, harness-engineering, ai-agent, agent-orchestration, mcp]
lang: zh-TW
tldr: "同一個詞 meta-harness 其實指兩種東西：Databricks 的控制面與 Stanford 的優化迴圈。本文用 MCP/ACP/Runtime/meta-harness 四層模型，對照 Omnigent、Zed ACP、Vercel HarnessAgent 與 Cloudflare Flue 的定位。"
description: "釐清 2026 年 meta-harness 的同名歧義：以 Omnigent 為錨點，對照 Zed ACP、Vercel HarnessAgent、Cloudflare Flue 與 Conductor 的協議/SDK/Runtime 差異，並區分 Stanford 論文的外層優化迴圈。"
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 2
glossary:
  - term: "ACP"
    aliases: ["Agent Client Protocol"]
    definition: "Zed 提出的 Agent Client Protocol，讓任何 agent 接任何 editor 的開放協議，定位類似 LSP。"
    definition_en: "Agent Client Protocol by Zed — an open protocol that lets any agent work with any editor, analogous to LSP."
    links:
      - label: "Zed ACP"
        url: "https://agentclientprotocol.com/"
  - term: "HarnessAgent"
    definition: "Vercel AI SDK 7 的 SDK 層抽象，讓你在 TypeScript 程式碼中以統一 API 切換不同 harness。"
    definition_en: "Vercel AI SDK 7's SDK-layer abstraction for swapping harnesses via a unified API in TypeScript."
    links:
      - label: "Vercel HarnessAgent"
        url: "https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer"
---

> 🌏 [English version](/posts/ai/2026-08-26-meta-harness-layers-en)

上一篇談 [Omnigent 的 meta-harness、Policy 與跨裝置 Session](/posts/ai/2026-08-26-omnigent-meta-harness) 時，多次提到「harness 之上的治理層」。但同一週，Stanford 也有一篇論文叫 [Meta-Harness](https://arxiv.org/abs/2603.28052)，講的卻是「用外層迴圈去改 harness 程式碼」。加上 [Zed ACP](https://agentclientprotocol.com/)、[Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) 與 [Cloudflare Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) 同時出現，很容易把四個東西當成同一個戰場。

這篇用一張四層模型把位置排開，並說明為何它們多數是**互補而非互斥**。

## 先把詞對齊：兩種 meta-harness

| 用法 | 指什麼 | 代表專案 | 一句話 |
|---|---|---|---|
| **控制面**（Databricks 脈絡） | harness 之上的統一接入、排程與治理 | [Omnigent](https://github.com/omnigent-ai/omnigent)、[loopx](https://github.com/huangruiteng/loopx)、[mission-control](https://github.com/builderz-labs/mission-control) | `你 ↔ 一群 agent` 的介面 |
| **優化迴圈**（Stanford 脈絡） | 用外層 agent 去搜尋更好的 harness 程式碼 | [stanford-iris-lab/meta-harness](https://github.com/stanford-iris-lab/meta-harness)、[SuperagenticAI/metaharness](https://github.com/SuperagenticAI/metaharness)、[ruvnet/metaharness](https://github.com/ruvnet/metaharness) | `agent 去改 agent 的程式` |

本文的 `meta-harness` 皆指前者，後者會明確寫「Stanford meta-harness（優化迴圈）」以區分。

## 四層模型：MCP / ACP / Runtime / meta-harness

借用 [codepick 買家指南](https://codepick.dev/en/guides/meta-harness-2026/) 的切法：

```
你
 │
 ├─ meta-harness  你 ↔ 多個完整 agent（Omnigent、loopx、mission-control）
 ├─ ACP           agent ↔ editor（Zed ACP）
 ├─ Runtime       單一 agent 的執行/復原/隔離（Cloudflare Agents SDK、Google AX）
 └─ MCP           agent ↔ 工具/資料（Anthropic MCP）
```

- **MCP** 管「agent 怎麼叫工具」，每個 harness 內部都用它。
- **ACP** 管「editor 怎麼接 agent」，目標是任何 agent 進任何 editor。
- **Runtime** 管「單一 agent 怎麼跑得穩」，如 durable execution、hibernation。
- **meta-harness** 管「你怎麼同時管一群 agent」，如多 harness 替換、成本與權限治理、跨裝置共享。

記法：**MCP 管工具、ACP 管接入、Runtime 管執行、meta-harness 管你跟一群 agent**。

## 四個專案，各自卡在哪一層

### Omnigent — 控制面的參考實作

已在上一篇詳述：`Runner + Server + Omnibox`，共通 API `messages/files in → streams/tool calls out`，三層 Policy，10 種雲 sandbox。此層的價值在「可攜、治理、協作」三件事同時發生。

### Zed ACP — LSP for agents

[Zed ACP](https://agentclientprotocol.com/) 走**協議標準化**路線，刻意模仿 LSP：LSP 把「語言智慧」從 IDE 解耦，ACP 想把「agent」從 editor 解耦。技術上是一組 JSON-RPC over stdio，編輯器側（Zed、JetBrains、Neovim、Emacs）與 agent 側（Cline、Cursor、Gemini CLI、OpenCode、Goose）各自實作 adapter，[ACP Registry](https://agentclientprotocol.com/) 讓 `implement once, work everywhere`。

與 Omnigent 互補：ACP 解「接入」，Omnigent 解「排程與治理」。兩者可疊為 `ACP（接入）→ Omnigent（治理）→ MCP（工具）`。

### Vercel HarnessAgent — 在 code 裡切 harness

[Vercel AI SDK 7 的 HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) 把「`切模型不重寫`」的哲學延伸為「`切 harness 不重寫`」：

```ts
import { HarnessAgent } from '@ai-sdk/harness/agent';
import { createClaudeCode } from '@ai-sdk/harness-claude-code';

const agent = new HarnessAgent({ harness: createClaudeCode() });
```

近期再加 `@ai-sdk/harness-acp` 這個 **meta-adapter**：不直接包單一 harness，而是包 ACP 協議，讓任何支援 ACP 的 harness 都能被 `HarnessAgent` 調度。對 Claude Code/Codex 官方仍建議用直連 adapter，對其餘走 ACP。

與 Omnigent 的差異：Vercel 在 **code 裡切**，Omnigent 在 **YAML + Server 層切**。前者適合產品內嵌，後者適合團隊控制面。

### Cloudflare Flue + Dynamic Workflows — 雲端規模

[Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) 是建在 [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/)（Durable Objects）上的框架，搭配約 300 行 MIT 授權的 [Dynamic Workflows](https://github.com/cloudflare/dynamic-workflows)。論點很硬：若每人同時跑數個 agent，需要支撐千萬級併發的持久執行與 hibernation。

Flue 的模型是「描述 agent 需要的 context（模型、skills、sandbox、instructions），而非編排 loop」。在 Cloudflare 上每個 Flue agent 跑在自己的 Durable Object，具隔離儲存與 `runFiber`/`stash`/`onFiberRecovered` 的 durable 能力。

與 Omnigent 互為 host：Omnigent 的 Runner 已可選 `cloudflare` 等沙盒，Flue 則是把 harness 變成可大規模水平擴展的服務。

### Conductor — 桌面的輕量版

[Conductor](https://www.conductor.build/)（Melty Labs，閉源 Mac app）給每個 agent 一個 git worktree，在單一 dashboard 平行跑 Claude Code/Codex。可視為 meta-harness 思想的**單機簡化版**，適合先用它驗證「平行多 agent 是否真有價值」，再評估 Omnigent。

## 常見誤判

- **「MCP vs meta-harness 選哪個？」** — 不是二選一。MCP 在 harness 內，meta-harness 在 harness 之上，兩者疊加。
- **「Omnigent vs ACP 誰贏？」** — 不同層，Omnigent 管治理，ACP 管接入。
- **「Stanford meta-harness 是 Omnigent 的競品？」** — 同名不同義，一個優化 harness 程式，一個治理多個 harness。

## 小結與下一篇

四層分工已大致底定，短期內最值得借的組合是：**Omnigent 的 Runner/Server/Policy + ACP 的接入協議 + Flue 的雲端休眠 + Vercel 的 code 內切換**。標準化會先從 ACP 這種協議層發生，治理層則會開源（Omnigent）與雲端廠商並存一陣子。

下一篇將用同一個任務（`平行 worktree + cross-vendor review` 的 Polly 模式）實作四種寫法：Omnigent YAML vs LangGraph vs CrewAI vs Goose，對比 token/latency 與可維護性。

## 參考資料

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [Introducing Omnigent — Databricks Blog](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
- [Zed Agent Client Protocol](https://agentclientprotocol.com/)
- [Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) / [@ai-sdk/harness-acp](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer)
- [Cloudflare Flue + Dynamic Workflows](https://blog.cloudflare.com/agents-platform-flue-sdk/)
- [Meta-Harness: End-to-End Optimization of Model Harnesses — arXiv:2603.28052](https://arxiv.org/abs/2603.28052)
- [stanford-iris-lab/meta-harness](https://github.com/stanford-iris-lab/meta-harness) / [SuperagenticAI/metaharness](https://github.com/SuperagenticAI/metaharness) / [ruvnet/metaharness](https://github.com/ruvnet/metaharness)
