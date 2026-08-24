---
title: "2026 下半年 Harness 大戰：八大框架重寫、三家模型商入場，110+ CLI 怎麼看"
date: 2026-08-22
category: ai
type: deep-dive
tags: [harness-engineering, coding-agent, omp, pi, opencode, deepseek, claude-code, open-source, grok-build, muse-code, antigravity-cli, amp, codex-cli]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 30
tldr: "2026 年 8 月，不只五個框架在動。OMP 2、Pi v2、Opencode 2、dsh、Claude Code 之外，Google（Antigravity CLI）、Meta（Muse Code）、xAI（Grok Build）三家模型商直接下場做 coding agent，加上 Amp、Cline 2.0、Codex CLI Rust 重寫，共八個以上框架同時有架構級變動。再算進 110+ 個 CLI 工具，H2 2026 是 harness 方法論的分裂期。本文從四條架構路線、一個共同方向、一場信任危機拆解。"
description: "2026 下半年 coding agent 框架八路競爭態勢：全 Rust 重寫、極簡升級、plugin kernel、模型商自建 agent。四條架構路線、一個共同方向、一場信任危機、110+ CLI 遍地開花。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en)

2026 年 8 月同時發生了太多事。

獨立框架在重寫：

- [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness) 從 Pi fork 變成全 Rust 獨立 codebase，~41 個 crate
- [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable) 把 AgentHarness v2 API 升 stable，底層換 CBOR + Unix socket
- [Opencode 2](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent) Bun 換 Node、Tauri 換 Electron、API 全部重來
- [DeepSeek Harness](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel) 從零發布，Cordis plugin kernel，9 天 184K 星
- [Amp](/posts/tech/2026-08-19-amp-frontier-agent) 推出 Orbs（臨時 VM），event-driven 架構
- Claude Code 持續迭代，Extension API、hooks、MCP 整合

模型商直接下場做 agent：

- [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)：Google 用 Go 取代 [Gemini CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)，閉源，121 指令
- [Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent)：Meta 首款 coding agent，Muse Spark 1.2 模型與 harness 共同訓練
- [Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident)：xAI 的 Rust agent，845K 行，Arena Mode，開源三天前爆出隱私事件

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
| [Antigravity CLI](https://cloud.google.com/products/antigravity) | Go | 閉源 | 商業 | GA | Google |
| [Muse Code](https://musecodes.io) | 未公開 | 閉源 | 商業 | Early Beta | Meta |
| [Grok Build](https://github.com/xai-org/grok-build) | Rust | ~24.5K | Apache 2.0 | Public Beta | xAI |
| [Amp](https://ampcode.com) | TypeScript | 閉源 | 商業 | GA | Sourcegraph |
| [Codex CLI](https://github.com/openai/codex) | Rust | 116K | Apache 2.0 | GA | OpenAI |
| [Cline](https://github.com/cline/cline) | TypeScript | 45K+ | Apache 2.0 | GA (SDK + CLI) | Cline |

十一個有架構級變動的框架。六個閉源商業，五個開源。五個用 TypeScript，三個用 Rust，一個用 Go，兩個未公開。背後是十一家不同的組織——其中三家是模型商。

## 四條架構路線

這些框架歸進四條路線。不是功能比較——是對「harness 應該長什麼樣」的不同回答。

### 路線一：把 runtime 重寫到不依賴任何外部

**代表：OMP 2**

OMP 2 的核心主張是：coding agent 不應該依賴使用者機器上裝了什麼。不應該 shell out 到 `rg`、不應該依賴系統的 bash、不應該假設 `node` 在 PATH 上。解法是把所有東西都編進一顆 binary——自製 bash 引擎、in-process coreutils、tree-sitter AST、甚至內嵌 CPython 3.14t。

[Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident) 也用 Rust，但動機完全不同。OMP 2 的 ~41 個 crate 是從頭設計的模組化架構；Grok Build 的 845K 行是 SpaceXAI 內部 monorepo 的切片，不接受外部貢獻。同一個語言選擇，兩種完全不同的架構意圖。

這條路的代價是**複雜度**。Rust 的社群參與門檻比 TypeScript 高一個量級。但 OMP 2 解決了一個其他框架都沒正面處理的問題：**跨平台一致性**。同一顆 binary 在 macOS、Linux、Windows 上的行為一樣。

### 路線二：保持小核心、升級底層品質

**代表：Pi v2、Claude Code**

Pi v2 和 Claude Code 走的是類似的路線：核心功能不大改，但底層品質持續提升。Pi 把 session 從記憶體物件換成 lane-based durable model，把線路協定從 JSON 換成 CBOR——但工具數量還是 4 個，README 裡還是明確不做 MCP 和 sub-agents。

Claude Code 也是：hooks、Extension API、MCP 整合都是漸進式的擴充，核心的 agent loop 和工具系統沒有破壞性重寫。

這條路的假設是：**harness 的核心結構已經對了，需要的是把基礎做紮實，而不是重新發明**。好處是穩定、可預測、使用者不需要重新學習。代價是如果核心假設錯了，修正的成本很高——因為整個生態已經建立在現有結構上。

### 路線三：harness 本身也應該是可組合的

**代表：dsh、Opencode 2（部分）、Amp（部分）**

DeepSeek Harness 的 Cordis plugin kernel 是這條路線最激進的表述：模型適配器、工具、agent loop、UI 全部都是 plugin，都可以換。你不只是在 harness 上加功能，你可以換掉 harness 本身的每一層。

Opencode 2 的 persistent backend + HTTP API + SDK 帶有類似的精神——它不只是一個 agent，它讓你把 agent 當 building block 嵌進自己的系統。[Amp](/posts/tech/2026-08-19-amp-frontier-agent) 的 Orbs 是另一個變體：把執行環境本身抽象成臨時 VM，讓 agent 在隔離環境裡跑，失敗就丟掉重來。

這條路的假設是：**沒有人知道 harness 最終應該長什麼樣，所以應該讓每一層都可以實驗**。好處是彈性最高；代價是學習曲線和 debug 難度。

### 路線四：模型商自己做 agent

**代表：Antigravity CLI、Muse Code、Grok Build**

2026 下半年最明顯的趨勢之一：模型商不再只提供 API，而是直接做完整的 coding agent。

[Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google) 是 Google 用 Go 重寫的閉源工具，取代了原本 Apache 2.0 的 [Gemini CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)。它不只是模型的 wrapper——121 個指令、多 agent 編排、原生 OS sandbox，這是一個完整的開發環境。

[Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent) 把模型與 harness 共同訓練——Muse Spark 1.2 不是先訓練模型再套 agent loop，而是模型行為和 agent 目標作為一個單元最佳化。persistent sub-agent + worktree 隔離也不是其他框架常見的設計。

[Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident) 有 8 個平行子 agent 和 Arena Mode（讓多個 agent 競爭再挑最好的）。並行度是目前所有框架中最高的。

[Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent) 從 TypeScript 重寫為 Rust（2025 年中），116K 星，走的也是模型商自建的路線。

這條路線的假設是：**模型和 harness 應該垂直整合**。模型商擁有模型、擁有分發管道、擁有使用者關係——如果 harness 是競爭優勢，為什麼要讓第三方做？

代價是：使用者被綁定在單一模型生態系裡。Antigravity CLI 預設只用 Gemini（雖然支援 Claude 和 GPT），Muse Code 預設只用 Muse Spark，Grok Build 預設只用 Grok。獨立框架如 Pi、dsh、Opencode 天生支援多模型，模型商的 agent 則天生偏好自家模型。

## 一個共同方向：Session 持久化

不管走哪條路線，所有正在重寫的框架都在做同一件事：**讓 session 活得比程序久**。

- OMP 2：content-addressed blob storage + append-only session transcripts
- Pi v2：lane-based v4 Session model，durable operations
- Opencode 2：persistent backend service，關 UI 再開 session 還在
- dsh：session storage 是 Cordis plugin，可抽換不同的持久化後端
- Muse Code：append-only event log，`muse resume` 可從崩潰恢復
- Grok Build：每個子 agent 在自己的 git worktree 裡，plan/search/build 三階段

這不是巧合。當 agent session 從「跑 5 分鐘改一個 bug」演進到「跑 5 小時做一個功能」，session 的耐久性就變成必要條件。[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)——而系統不能因為一次程序中斷就失去所有狀態。

## 一場信任危機

2026 年 7-8 月集中爆發了三個信任事件，每一個都指向 coding agent 獨有的風險：

**Grok Build 靜默上傳整個 repo**。2026 年 7 月 12 日，安全研究員 Cereblab 公開網路擷取，證明 Grok Build 在使用者不知情的情況下把整個 Git repository（含 `.env`、SSH key、commit history）上傳到 Google Cloud Storage。上傳流量是對話流量的 27,800 倍。xAI 在三天後開源，但[資料外洩的程式碼仍然在 binary 裡](/posts/tech/2026-08-24-grok-build-xai-privacy-incident)，只靠 server-side flag 關閉。

**Muse Code 的 Contributor 定價**。Meta 把 API 定價和訓練權綁在一起：標準方案 $1.25/$4.25/M tokens，Contributor 方案 $0.10/$0.20——便宜 20 倍，但[你的程式碼進入 Meta 的訓練管線](/posts/tech/2026-08-24-muse-code-meta-coding-agent)。沒有粒度控制，全有或全無。

**Antigravity CLI 從開源轉閉源**。Google 把 10 萬星的 Apache 2.0 專案 Gemini CLI 替換成閉源的 Antigravity CLI，只給了 [28 天轉換期](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)。同時免費配額從每天約 1,000 次砍到約 20 次，削減 98%。

這三個事件不是孤立事故。它們指向一個結構性問題：**coding agent 比任何以往的開發工具都有更深的存取權**。它能讀整個 codebase、看 Git history、碰 `.env` 和 SSH key。這個信任面跟 web app 或 IDE plugin 完全不同。

開源是信任的基礎，但不是充分條件。Grok Build 開源了，資料外洩的程式碼還在裡面。真正的問題是：你信任的是程式碼，還是背後組織的政策決定？

## 110+ CLI 遍地開花

上面討論的是有架構級變動的框架。但 2026 年 8 月的 coding agent CLI 不只這些——總數超過 110 個。

**第一層：模型商官方 CLI**。Claude Code、[Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)、[Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent)、[Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident)、[Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)、Kimi Code CLI。模型商自己做 harness，綁定自家模型，用分發管道推廣。

**第二層：創投支持的獨立工具**。[Pi](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)、[Opencode](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)、[dsh](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)、[Amp](/posts/tech/2026-08-19-amp-frontier-agent)、Cline、[Kiro](/posts/ai/2026-04-02-agent-cli-kiro)、Devin。有公司支撐、有商業模式（或在找商業模式）、多數支援多模型。

**第三層：社群重寫和 fork**。[Claw Code](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation)（Claude Code 的 Rust clean-room 重寫，172K+ 星）、[OpenClaw](https://github.com/nicepkg/openclaw)（387K 星）、[Hermes Agent](/posts/ai/2026-08-18-hermes-agent-terminal-backends)（235K 星）、[OMP](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)。星數驚人，但維護模式和品質差異大——有的是活躍社群專案，有的是「agent 管理的博物館展品」（有星數但缺少持續的人類維護）。

**第四層：小型和利基工具**。100+ 個不到 5K 星的 CLI，各自解決特定問題——某個語言的專用 agent、某個 IDE 的整合、某個工作流程的自動化。大多數不會長期存活，但少數可能成為下一個 Pi。

這個數字的意義不在於「你應該試哪一個」——而是 coding agent 的需求是真的。110+ 個工具同時存在，說明市場拉力夠強。但整合還沒發生。

## 生態系的分裂與交叉

這些框架之間不是純粹的競爭關係。

**dsh 可以把 Claude Code 和 Codex 當子代理**。它不是在同一層競爭，而是在上面做協調。一個實際部署可能是：Claude Code 留在編輯器裡，dsh 跑在伺服器上派發任務。Kiro 的 Crew autonomous orchestrator 也是類似的定位。

**Opencode 2 讀 `.claude/skills/`**。這意味著從 Claude Code 切到 Opencode 2 時，你的 skill 不需要重寫。skill 正在變成跨工具的可攜資產。

**Cline 2.0 把 SDK 抽出來**。IDE 可以嵌入任意 agent，不只是 Cline 自己的。這讓「harness 在哪裡跑」和「用哪個 agent」解耦。

**OMP 2 和 Pi 已經不會合流**。OMP 2 不再是 Pi 的 fork，是完全獨立的 Rust codebase。兩個專案的技術方向完全不同，使用者必須二選一。

**模型商之間的 agent 不互通**。Antigravity CLI 不會用 Claude、Muse Code 不會用 Gemini、Grok Build 不會用 GPT（除非透過 OpenRouter）。模型商的 agent 天生是封閉花園。獨立框架（Pi、dsh、Opencode）天生是開放的。

**背後的組織決定存活**。Earendil、Anomaly、Stencil Labs、DeepSeek、Google、Meta、xAI、Sourcegraph、OpenAI、Cline——十家不同的公司，十種不同的商業壓力。MIT / Apache 2.0 授權保證了程式碼的自由，但不保證維護的持續。

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
├─ 自定義 agent 形態 → dsh (dev preview)
│   Cordis plugin kernel、一切可換、Web UI
│
├─ 最高並行度 → Grok Build (public beta)
│   8 個平行子 agent、Arena Mode、注意隱私風險
│
├─ Google 生態系整合 → Antigravity CLI
│   閉源、Gemini 優先、121 指令集
│
└─ 極低成本（接受訓練權交換）→ Muse Code (early beta)
    Contributor 方案 20x 折扣、品質仍追趕中
```

如果你現在就要在生產環境用，選 Claude Code 或 Pi v2——兩個都已經 stable，只是方向不同（全功能 vs 極簡）。

如果你願意冒 beta / pre-release 的風險，選你最需要的那個特性——multi-session（Opencode 2）、全 Rust（OMP 2）、全 plugin（dsh）。

如果你在模型商的生態系裡，那個模型商的 agent 是自然起點——但要清楚你在接受什麼（閉源、單一模型傾向、可能的隱私風險）。

## 接下來看什麼

從 [harness 演化](/posts/ai/2026-03-28-harness-engineering-evolution)的角度看，2026 下半年是 **harness 方法論的分裂期**。之前大家在同一條路上走——讓模型能用工具、加 context、做安全檢查。現在路分叉了：

- 要不要把整個 runtime 自己做（OMP 2）
- 要不要讓 harness 的每一層都可換（dsh）
- 要不要把 agent 做成可程式化的服務（Opencode 2）
- 要不要在不改定位的前提下升級底層（Pi v2）
- 要不要由模型商垂直整合（Antigravity、Muse Code、Grok Build）

除了路線之爭，還有三個結構性問題會在接下來六個月浮現：

**信任標準**。Grok Build 的隱私事件已經證明「開源」不等於「安全」。coding agent 需要什麼樣的信任機制？審計、沙箱、流量監控、資料保留政策——這些目前沒有業界共識。

**整合壓力**。110+ 個 CLI 不可能全部存活。哪些會被併購、哪些會停止維護、哪些會找到利基——整合期可能在 2027 年上半年開始。

**skill 可攜性**。`.claude/skills/` 已經被多個框架讀取。如果 skill 格式變成事實標準，框架之間的切換成本就會大幅降低——這對模型商的封閉花園策略不利。

這些路線不會馬上分出勝負。要看的不是 2026 年 8 月誰的星數最多，而是 2027 年年中哪條路線產出了最多可靠的 production 部署。

星數是注意力的度量，不是品質的度量。184,000 星和 26,000 星的框架可能到頭來一個比另一個更可靠——我們現在不知道。

唯一確定的事：[harness 的設計比模型本身更影響結果](/posts/ai/2026-08-10-model-component-harness-system)。八個框架同時重寫、三家模型商同時入場，說明這個領域的所有參與者都認同這個前提——分歧只在「那 harness 應該怎麼做」和「誰應該做」。

## 參考資料

- 站內：[OMP 2：從 Pi fork 到全 Rust 重寫](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)
- 站內：[Pi v2：AgentHarness API 升穩](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable)
- 站內：[Opencode 2：Bun 換 Node、Tauri 換 Electron](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)
- 站內：[DeepSeek Harness（dsh）：Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)
- 站內：[Antigravity CLI：Google 用 Go 取代 Gemini CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)
- 站內：[Muse Code：Meta 首款 Coding Agent](/posts/tech/2026-08-24-muse-code-meta-coding-agent)
- 站內：[Grok Build：xAI 的隱私事件](/posts/tech/2026-08-24-grok-build-xai-privacy-incident)
- 站內：[Amp：Sourcegraph 的 Frontier Agent](/posts/tech/2026-08-19-amp-frontier-agent)
- 站內：[Codex CLI：OpenAI 的 Coding Agent](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)
- 站內：[Claw Code：Rust 重寫 Claude Code](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation)
- 站內：[Hermes Agent：Terminal Backends](/posts/ai/2026-08-18-hermes-agent-terminal-backends)
- 站內：[omp v1：batteries-included 分支](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)
- 站內：[Pi：極簡主義的 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)
- 站內：[Opencode：開源 AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)
- 站內：[Gemini CLI：Google 的 Terminal Agent](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)
- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- [OMP 2（GitHub）](https://github.com/can1357/oh-my-pi)
- [Pi（GitHub）](https://github.com/earendil-works/pi)
- [Opencode（GitHub）](https://github.com/anomalyco/opencode)
- [DeepSeek Harness（GitHub）](https://github.com/deepseek-ai/deepseek-harness)
- [Grok Build（GitHub）](https://github.com/xai-org/grok-build)
- [Codex CLI（GitHub）](https://github.com/openai/codex)
- [Cereblab 隱私研究報告](https://cereblab.com/research/grok-build-privacy)
