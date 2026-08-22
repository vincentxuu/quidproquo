---
title: "DeepSeek Harness（dsh）：把 Everything is a Plugin 做到底的 coding agent 框架"
date: 2026-08-22
category: tech
type: deep-dive
tags: [deepseek, coding-agent, cli, open-source, ai-tools, harness-engineering, plugin]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 26
tldr: "DeepSeek Harness（dsh）是 DeepSeek 官方的開源 coding agent 框架，2026-08-13 發布 v0.1 開發者預覽版，9 天內累積 184,000+ 星。核心是 Cordis plugin kernel——模型、工具、agent loop、UI 全部都是可抽換的外掛。四種 runtime 模式，能把 Claude Code 和 Codex 當子代理使用。Web UI 優先，目前沒有原生 CLI。"
description: "DeepSeek Harness（dsh）的 Cordis plugin kernel 架構、四種 runtime 模式、子代理整合、Web UI 優先策略，以及 developer preview 階段的風險。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en)

2026 年 8 月 13 日，DeepSeek 在宣布 V4-Pro 正式上線的同一天，開源了自己的 coding agent 框架——[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（指令叫 `dsh`）。MIT 授權，TypeScript/Node.js，v0.1 開發者預覽版。

然後它在 9 天內拿到 184,000+ 星，打破了 GitHub 的所有星數速度紀錄：1.5 小時 22,000 星、12 小時 50,000 星、2 天 100,000 星。之前最快到 20,000 星的是 xAI 的 Grok-1（約 1.2 天），DeepSeek-R1 也花了 5.7 天。

這篇不講星數神話，講它實際上做了什麼跟其他 coding agent 不一樣的事。

## Cordis：Everything is a Plugin

dsh 的核心不是 agent loop，不是工具系統，也不是模型整合——是一個叫 **Cordis** 的 plugin kernel。Cordis 有一篇題為「A Programming Paradigm for Spatiotemporal Composability」的論文，但不用讀論文也能理解它的設計：

**dsh 裡的每一個能力都是一個 Cordis plugin。** 模型適配器是 plugin、工具註冊是 plugin、agent loop 是 plugin、session 儲存是 plugin、沙箱是 plugin、UI 也是 plugin。要換掉任何一層，改設定檔就好，不需要動原始碼。

### Cordis 的四個機制

**Context**：一個階層式的服務登錄。每個 plugin 用穩定的命名空間 key 註冊自己（`ctx.tools`、`ctx.llm`、`ctx.sessions`），消費方不需要 `import` 具體實作，只需要從 context 取用。

**依賴注入**：plugin 透過 `inject` 欄位宣告自己需要什麼。Cordis 會延遲啟動，直到所有依賴都就位。不需要手動排序載入順序。

**事件系統**，四種派發模式：

| 模式 | 行為 |
|---|---|
| `emit` | 同步觀察，無回傳 |
| `waterfall` | 環繞式 middleware，監聽者收到 `(...args, next)` 可以代理或短路 |
| `parallel` | 並行觀察 |
| `serial` | 序列執行，累積結果 |

`waterfall` 是最重要的一個——它讓任何 plugin 都能在不改原始碼的情況下攔截和修改其他 plugin 的行為。工具呼叫的權限檢查、模型回應的過濾、session 的自動存檔，都可以用 waterfall listener 實作。

**生命週期管理**：plugin 用 `ctx.effect()` 或 `ctx.on()` 註冊效果，產生可逆的註冊。拆卸時依相反順序回收——reload 或 dispose 的時候不會漏掉副作用。

### 設定與 Profile

設定用 `cordis.yml`，支援 `!!js` 求值（僅限 plugin 設定和 `disabled` 欄位）。機密走環境變數和 `.env` 檔。

dsh 用 **profile** 來管理不同的 plugin 組合。每個 profile 目錄有一個 `package.json`（裡面的 `dsh.profile` 欄位列出 bundle 載入順序）和一個 `cordis.patch.yml`（使用者自己的覆蓋層）。`dsh --profile web --dump-config` 會印出實際啟動的完整設定樹。

內建兩個 profile：`web`（完整 Web UI）和 `headless`（伺服器/自動化用）。

## 四種 Runtime 模式

dsh 不是一種固定形態的 agent，它有四種模式，每種對應不同的使用場景：

| 模式 | 用途 | 工具集 |
|---|---|---|
| **Standard** | 完整 coding agent | 檔案系統、shell、搜尋、子代理、規劃 |
| **Code** | 生成 SDK 一次執行 | Standard 的所有工具，但模型寫的是一支完整的 TypeScript 程式，透過生成的 SDK 呼叫工具，一次執行而非多輪往返 |
| **Minimal** | 基準測試 | 只有 bash 和字串替換編輯器，用來在控制環境下測試 agent 行為 |
| **Creator** | 元模式 / runtime 組合 | Standard 加上 runtime 自省和 plugin 實驗，讓你在記憶體裡測試 Cordis plugin 並組合成新的模式 |

**Code 模式**值得多看一眼。一般 coding agent 的工作流是：模型呼叫一個工具 → 等結果 → 再呼叫下一個 → 等結果，每一步都是一次 round trip。Code 模式讓模型把五步的工作寫成一支程式，一次跑完。這在批次操作（重新命名 20 個檔案、修改一百處 import）上效率差距很大。

**Minimal 模式**的設計動機很有趣——它是 DeepSeek 自己用來做 harness 研究的工具。只給 bash 和一個最簡的編輯器，測試不同 harness 設計對 agent 表現的影響。這等於承認：[harness 的設計比模型本身更影響結果](/posts/ai/2026-08-10-model-component-harness-system)，而且 DeepSeek 正在用自己的框架驗證這件事。

**Creator 模式**是給框架開發者用的。你可以在 dsh 裡面檢查當前的 runtime 組成、測試新的 plugin 組合、把它們打包成新的 profile。這在其他 coding agent 裡沒有對應物——Claude Code、Codex CLI、opencode 都是「agent 是什麼就是什麼」，dsh 讓你在 agent 裡面做 agent。

## 把 Claude Code 和 Codex 當子代理

dsh 的 `packages/subagent/` 底下有 **subagent provider plugin**，可以把外部 agent binary 當成子代理派發工作。目前內建的 provider 包括 Claude Code 和 Codex。

實作方式是呼叫使用者 `PATH` 上的 binary，預設停用，需要明確啟用。

dsh 還在 `packages/hooks/` 底下做了 **hook bridge**——把 Claude Code 和 Codex 的 `hooks.json` 介面接進 Cordis，讓既有的 hook 設定可以直接複用。

這個定位很清楚：**dsh 不是要取代 Claude Code，而是要坐在它上面。** 一個 2026 年的實際部署可能是：Claude Code 留在編輯器裡當互動式 agent，dsh 跑在伺服器上當協調層，根據任務性質派發給不同的 agent 或模型。

## Web UI 優先

dsh 的主要介面是 **Web UI**：

```bash
npx @deepseek-ai/dsh web
# 啟動在 http://127.0.0.1:3080
```

repo 裡曾經有一個 TUI 套件，但在正式發布前一週被刪掉了——這不是「還沒做」，是刻意選擇 Web 優先。

也有 headless 模式用於伺服器和自動化：

```bash
pnpm dsh --profile headless "task description"
```

repo 裡有 `apps/cli` 目錄，但發布時的重心明確在 Web。社群已經有人做了 [deepseek-harness-desktop](https://github.com/nichdel/deepseek-harness-desktop)，用 Electron 把 Web UI 包成桌面應用。

這個選擇跟其他 coding agent 相反——Claude Code 和 Codex CLI 是 CLI 原生，opencode 和 Pi 是 TUI 原生，dsh 是 Web 原生。好處是跨平台和遠端存取不需要額外處理；代價是本地開發的低延遲體驗比不上原生 TUI。

## 技術架構

TypeScript，strict mode，ESM，pnpm。所有套件命名為 `@deepseek-ai/dsh-<name>`。測試用 Vitest，snapshot-based 驗證，要求每個檔案 100% 覆蓋率。

repo 結構：

| 目錄 | 內容 |
|---|---|
| `packages/core` | 產品 API 骨幹：session、system-prompt、tools、agent、agent-loop |
| `packages/llm` | DeepSeek provider 實作 |
| `packages/shell` | bash 和程序執行 |
| `packages/web` | 搜尋和 fetch provider |
| `packages/subagent` | 子代理派發（Claude Code / Codex bridge） |
| `packages/workflow` | worker-thread provider |
| `packages/hooks` | Claude Code / Codex hook bridge |
| `vendor/` | vendored Cordis 原始碼 |
| `python/` / `native/` | SDK 和 runtime 元件 |

## 社群生態

發布一週內已經有超過 1,080 個社群外掛。多個社群維護的外掛目錄（DSH Plugin Store、DeepseekPlugin.org、dsharness.io）出現。社群外掛透過 GitHub 的 `dsh-plugin` 標籤被發現。

這個速度跟 dsh 的「Everything is a Plugin」設計有直接關係——貢獻一個 plugin 的門檻遠低於 fork 一個 monolithic agent。你不需要理解整個 codebase，只需要實作一個 Service 介面、宣告依賴、掛進 context。

## Developer Preview：風險

dsh 明確標注為 **developer preview**，AGENTS.md 裡寫得很直接：

> foundation over compatibility during its pre-release phase, with no external consumers yet, allowing free restructuring of packages and formats.

幾個實際風險：

**API 會破壞性變更**。v0.1.x 的 API 沒有穩定承諾。session 用單調版本號（`SCHEMA_VERSION`、`SESSION_FORMAT_VERSION`），但格式本身可以隨時改。

**Cordis 的學習曲線**。waterfall、inject、effect——這些概念不難，但它們組合起來的行為不直覺。一個 plugin 的 waterfall listener 可以悄悄改變另一個 plugin 的行為，debug 時很難追蹤。

**Web UI 的侷限**。瀏覽器環境裡跑 agent 有天然限制——檔案存取走 HTTP、shell 執行走 WebSocket，延遲比本地 TUI 高。長 session 的穩定性也還沒有大規模驗證。

**星數 ≠ 生產驗證**。184,000 星裡有多少是 DeepSeek 品牌效應，有多少是真正在用的開發者，目前沒有資料可以判斷。

## 跟其他 Coding Agent 的差異

dsh 最根本的差異不在功能，在定位：

**Claude Code、Codex CLI、opencode、Pi** 是 agent——它們內建一套完整的 coding 工作流，你用它或擴充它。

**dsh** 是 agent 框架——它提供組裝 agent 的基礎設施，讓你把模型適配器、工具、agent loop、UI 全部換成自己的。Claude Code 的 Extension API 讓你加工具；dsh 的 Cordis 讓你換掉 agent loop 本身。

這也是它能把 Claude Code 和 Codex 當子代理的原因——它不是在同一層競爭，而是在更上面一層做協調。

從 [harness 演化](/posts/ai/2026-03-28-harness-engineering-evolution)的角度看，dsh 代表的是一個新的方向：**harness 本身也應該是可組合的**。之前的 harness 設計（Claude Code 的 hooks、Pi 的 Extensions、omp 的 Rust crate）都假設 harness 的核心結構是固定的，擴充發生在邊緣。dsh 不做這個假設。

## 整體來說

DeepSeek Harness 的「Everything is a Plugin」不只是一句口號——Cordis kernel 確實讓系統的每一層都是可抽換的，而且四種 runtime 模式展示了同一個框架可以有多不同的形態。Code 模式的「模型寫程式而不是呼叫工具」和 Creator 模式的「在 agent 裡做 agent」都是其他 coding agent 沒有的設計。

但 v0.1 就是 v0.1。API 會壞、Web UI 有延遲、Cordis 的間接性讓 debug 變難、星數不等於穩定度。如果你現在需要一個可靠的 coding agent，Claude Code 或 opencode 仍然是更安全的選擇。如果你想要的是**一個可以自己定義 agent 形態的框架**——願意接受 breaking change、願意讀 Cordis 文件、願意在 Web UI 裡工作——dsh 是目前唯一認真做這件事的開源方案。

一週內 1,080 個社群外掛至少說明一件事：「Everything is a Plugin」不只降低了使用門檻，也降低了貢獻門檻。這在開源生態裡是很值錢的。

## 參考資料

- [deepseek-ai/deepseek-harness（GitHub）](https://github.com/deepseek-ai/deepseek-harness)
- [Cordis：A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/cordis)
- [DeepSeek V4-Pro 發布公告](https://api-docs.deepseek.com/news/news0813)
- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- 站內：[安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
