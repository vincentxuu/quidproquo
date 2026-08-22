---
title: "2026 下半年 Harness 大戰：五個框架同時重寫，你該怎麼看"
date: 2026-08-22
category: ai
type: deep-dive
tags: [harness-engineering, coding-agent, omp, pi, opencode, deepseek, claude-code, open-source]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 27
tldr: "2026 年 8 月，OMP 2 全 Rust 重寫、Pi v2 底層換引擎、Opencode 2 三層替換、DeepSeek Harness 從零發布、Claude Code 持續迭代——五個 coding agent 同時在動。這篇把它們攤開比，不是為了排名次，而是看出三條不同的架構路線和一個共同方向。"
description: "2026 下半年 coding agent 框架的五路競爭態勢：全 Rust 重寫、極簡主義升級、runtime 遷移、plugin kernel、持續迭代。三條架構路線與一個共同方向。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en)

2026 年 8 月同時發生了太多事：

- [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness) 從 Pi fork 變成全 Rust 獨立 codebase，~41 個 crate
- [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable) 把 AgentHarness v2 API 升 stable，底層換 CBOR + Unix socket
- [Opencode 2](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent) Bun 換 Node、Tauri 換 Electron、API 全部重來
- [DeepSeek Harness](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel) 從零發布，Cordis plugin kernel，9 天 184K 星
- Claude Code 持續迭代，Extension API、hooks、MCP 整合

每個都已經有[各自的深度介紹](/tags/harness-engineering)。這篇不重複個別分析，而是把它們擺在一起看——它們各自賭了什麼、放棄了什麼、對 harness 的未來做了什麼假設。

## 先把數字攤開

截至 2026-08-22：

| 框架 | 語言 | Stars | 授權 | 狀態 | 背後組織 |
|---|---|---|---|---|---|
| [OMP 2](https://github.com/can1357/oh-my-pi) | Rust | 26.4K | MIT | Pre-release | Stencil Labs Inc. |
| [Pi v2](https://github.com/earendil-works/pi) | TypeScript | 95.4K | MIT | Stable (v0.84.0) | Earendil Inc. (PBC) |
| [Opencode 2](https://github.com/anomalyco/opencode) | TypeScript | ~200K | MIT | Beta | Anomaly |
| [dsh](https://github.com/deepseek-ai/deepseek-harness) | TypeScript | 184K+ | MIT | Dev Preview (v0.1) | DeepSeek |
| Claude Code | TypeScript | 閉源 | 商業 | GA | Anthropic |

五個框架，四個 MIT 開源，一個閉源商業。四個用 TypeScript（或以 TypeScript 為主），一個用 Rust 重寫。全部都在 2026 年做了重大變更或首次發布。

## 三條架構路線

這五個框架可以歸進三條不同的路線。不是功能比較——是對「harness 應該長什麼樣」的不同回答。

### 路線一：把 runtime 重寫到不依賴任何外部

**代表：OMP 2**

OMP 2 的核心主張是：coding agent 不應該依賴使用者機器上裝了什麼。不應該 shell out 到 `rg`、不應該依賴系統的 bash、不應該假設 `node` 在 PATH 上。解法是把所有東西都編進一顆 binary——自製 bash 引擎、in-process coreutils、tree-sitter AST、甚至內嵌 CPython 3.14t。

這條路的代價是**複雜度**。~41 個 Rust crate、pinned nightly toolchain、edition 2024。要貢獻程式碼，你需要會 Rust；要 debug 問題，你需要讀 Rust。社群參與的門檻比 TypeScript 高一個量級。

但它解決了一個其他框架都沒正面處理的問題：**跨平台一致性**。同一顆 binary 在 macOS、Linux、Windows 上的行為一樣，不需要 WSL、不需要安裝 coreutils、不需要處理 shell 差異。

### 路線二：保持小核心、升級底層品質

**代表：Pi v2、Claude Code**

Pi v2 和 Claude Code 走的是類似的路線：核心功能不大改，但底層品質持續提升。Pi 把 session 從記憶體物件換成 lane-based durable model，把線路協定從 JSON 換成 CBOR——但工具數量還是 4 個，README 裡還是明確不做 MCP 和 sub-agents。

Claude Code 也是：hooks、Extension API、MCP 整合都是漸進式的擴充，核心的 agent loop 和工具系統沒有破壞性重寫。

這條路的假設是：**harness 的核心結構已經對了，需要的是把基礎做紮實，而不是重新發明**。好處是穩定、可預測、使用者不需要重新學習。代價是如果核心假設錯了，修正的成本很高——因為整個生態已經建立在現有結構上。

### 路線三：harness 本身也應該是可組合的

**代表：dsh、Opencode 2（部分）**

DeepSeek Harness 的 Cordis plugin kernel 是這條路線最激進的表述：模型適配器、工具、agent loop、UI 全部都是 plugin，都可以換。你不只是在 harness 上加功能，你可以換掉 harness 本身的每一層。

Opencode 2 的 persistent backend + HTTP API + SDK 也帶有類似的精神——它不只是一個 agent，它讓你把 agent 當 building block 嵌進自己的系統。

這條路的假設是：**沒有人知道 harness 最終應該長什麼樣，所以應該讓每一層都可以實驗**。好處是彈性最高；代價是學習曲線（Cordis 的 waterfall + inject + effect 組合）和 debug 難度（間接層越多越難追蹤）。

## 一個共同方向：Session 持久化

所有正在重寫的框架都在做同一件事：**讓 session 活得比程序久**。

- OMP 2：content-addressed blob storage + append-only session transcripts
- Pi v2：lane-based v4 Session model，durable operations
- Opencode 2：persistent backend service，關 UI 再開 session 還在
- dsh：session storage 是 Cordis plugin，可抽換不同的持久化後端

這不是巧合。當 agent session 從「跑 5 分鐘改一個 bug」演進到「跑 5 小時做一個功能」，session 的耐久性就變成必要條件。[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)——而系統不能因為一次程序中斷就失去所有狀態。

## 生態系的分裂與交叉

有趣的是這些框架之間不是純粹的競爭關係。

**dsh 可以把 Claude Code 和 Codex 當子代理**。它不是在同一層競爭，而是在上面做協調。一個實際部署可能是：Claude Code 留在編輯器裡，dsh 跑在伺服器上派發任務。

**Opencode 2 讀 `.claude/skills/`**。這意味著從 Claude Code 切到 opencode 2 時，你的 skill 不需要重寫。skill 正在變成跨工具的可攜資產。

**OMP 2 和 Pi 已經不會合流**。OMP 2 不再是 Pi 的 fork，是完全獨立的 Rust codebase。兩個專案的技術方向完全不同，使用者必須二選一。

**Earendil、Anomaly、Stencil Labs、DeepSeek**——四個不同的公司，四種不同的商業壓力。MIT 授權保證了程式碼的自由，但不保證維護的持續。哪個框架能長期活下來，取決於背後的組織能不能找到可持續的商業模式。

## 怎麼選

決策不是「哪個最好」——是「你需要什麼」。

```
你最在意什麼？
│
├─ 穩定性和生態系 → Claude Code
│   閉源、有 Anthropic 支撐、最大的使用者基數
│
├─ 可讀性和極簡 → Pi v2
│   4 個工具、整個 codebase 可以讀完、MIT
│
├─ 多 session 並行和 SDK → Opencode 2 (beta)
│   persistent backend、HTTP API、跨工具 skill
│
├─ 跨平台一致性 → OMP 2 (pre-release)
│   全 Rust、單一 binary、不依賴系統工具
│
└─ 自定義 agent 形態 → dsh (dev preview)
    Cordis plugin kernel、一切可換、Web UI
```

如果你現在就要在生產環境用，選 Claude Code 或 Pi v2——兩個都已經 stable，只是方向不同（全功能 vs 極簡）。

如果你願意冒 beta / pre-release 的風險，選你最需要的那個特性——multi-session（opencode 2）、全 Rust（omp 2）、全 plugin（dsh）。

## 接下來看什麼

從 [harness 演化](/posts/ai/2026-03-28-harness-engineering-evolution)的角度看，2026 下半年是 **harness 方法論的分歧期**。之前大家在同一條路上走——讓模型能用工具、加 context、做安全檢查。現在路分叉了：

- 要不要把整個 runtime 自己做（OMP 2）
- 要不要讓 harness 的每一層都可換（dsh）
- 要不要把 agent 做成可程式化的服務（Opencode 2）
- 要不要在不改定位的前提下升級底層（Pi v2）

這些路線不會馬上分出勝負。要看的不是 2026 年 8 月誰的星數最多，而是 2027 年年中哪條路線產出了最多可靠的 production 部署。

星數是注意力的度量，不是品質的度量。184,000 星和 26,000 星的框架可能到頭來一個比另一個更可靠——我們現在不知道。

唯一確定的事：[harness 的設計比模型本身更影響結果](/posts/ai/2026-08-10-model-component-harness-system)。五個框架同時重寫，說明這個領域的所有參與者都認同這個前提——分歧只在「那 harness 應該怎麼做」。

## 參考資料

- 站內：[OMP 2：從 Pi fork 到全 Rust 重寫](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)
- 站內：[Pi v2：AgentHarness API 升穩](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable)
- 站內：[Opencode 2：Bun 換 Node、Tauri 換 Electron](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)
- 站內：[DeepSeek Harness（dsh）：Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)
- 站內：[omp v1：batteries-included 分支](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)
- 站內：[Pi：極簡主義的 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)
- 站內：[Opencode：開源 AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)
- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- [OMP 2（GitHub）](https://github.com/can1357/oh-my-pi)
- [Pi（GitHub）](https://github.com/earendil-works/pi)
- [Opencode（GitHub）](https://github.com/anomalyco/opencode)
- [DeepSeek Harness（GitHub）](https://github.com/deepseek-ai/deepseek-harness)
