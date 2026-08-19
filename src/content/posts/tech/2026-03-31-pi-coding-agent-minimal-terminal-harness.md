---
title: "Pi Coding Agent：極簡主義的開源終端機 Coding Harness"
date: 2026-03-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, ollama, openclaw]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 10
tldr: "Pi 是 Mario Zechner 打造的極簡 coding agent（TypeScript、MIT、約 93K stars），只有 4 個核心工具與極短 system prompt，其餘全靠 Extensions／Skills／Prompt Templates 自己疊。刻意不做 MCP、sub-agents、plan mode、權限彈窗。repo 已改名 earendil-works/pi，npm scope 換成 @earendil-works。"
description: "Pi Coding Agent 的設計哲學、架構、核心功能、擴充機制、與 OpenClaw 的關係，以及與其他 coding agent 的差異。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en)

Pi 是由 Mario Zechner（GitHub: badlogic）打造的開源 coding agent，核心理念是「極簡但可擴充」：只附帶 4 個工具和一份極短的 system prompt——剩下的都讓使用者自己決定。官網 [pi.dev](https://pi.dev/)，repo 在 [earendil-works/pi](https://github.com/earendil-works/pi)，MIT 授權，約 93K stars。

## 安裝

```bash
# npm 安裝
npm install -g @earendil-works/pi-coding-agent

# 透過 Ollama 一鍵啟動
ollama launch pi
```

> **套件與 repo 都改名了**：npm scope 從 `@mariozechner` 換成 `@earendil-works`，GitHub 從 `badlogic/pi-mono` 換成 `earendil-works/pi`（舊網址會 301）。既有的全域安裝可以走 `pi update --self`，它會依版本檢查端點回傳的套件名自動換過去。

## 設計哲學

Pi 刻意不做的事情跟它做的事情一樣重要：

### 只有 4 個核心工具

| 工具 | 功能 |
|---|---|
| `read` | 讀取檔案 |
| `write` | 寫入檔案 |
| `edit` | 編輯檔案 |
| `bash` | 執行 shell 指令 |

沒有內建 sub-agents、沒有 plan mode、沒有 MCP——但這些都可以透過 Extensions 自己加。

官方把「不做什麼」列得比「做什麼」還清楚，每一項都附上替代做法：

| 不內建 | 官方建議的替代 |
|---|---|
| MCP | 寫成帶 README 的 CLI 工具（走 Skills），或自己寫 extension 加 MCP 支援 |
| Sub-agents | 用 tmux 開多個 Pi instance，或用 extension 自己做 |
| 權限彈窗 | 跑在容器裡，或用 extension 做符合自己環境的確認流程 |
| Plan mode | 把計畫寫成檔案，或用 extension／套件補 |
| 內建 to-do | 用 `TODO.md` |
| 背景 bash | 用 tmux，觀察性更好也能直接互動 |

這個清單本身就是 Pi 的設計主張：**與其內建所有功能然後讓你關掉不要的，不如給你 primitives 自己組。**

### 極短的 System Prompt

大多數 coding agent 的 system prompt 動輒數千字。Pi 刻意壓到極短，讓 prompt cache 命中率最高、token 消耗最低。也因為 system prompt 短，你才有空間做真正的 context engineering——決定什麼進 context window、怎麼管理它。

## 核心功能

| 功能 | 說明 |
|---|---|
| 4 種運行模式 | Interactive（互動）、Print/JSON（輸出）、RPC（程序整合）、SDK（嵌入應用） |
| Compaction | 接近 context limit 時自動摘要舊訊息，可透過 Extension 自訂摘要策略 |
| Skills | 按需載入的能力包（指令 + 工具），不會佔用 prompt cache |
| Dynamic Context | Extension 可在每個 turn 前注入訊息、過濾歷史、實作 RAG 或長期記憶 |
| 多供應商 | 15+ 家：Anthropic、OpenAI、Google、Azure、Bedrock、Mistral、Groq、Cerebras、xAI、Hugging Face、Kimi For Coding、MiniMax、NVIDIA、OpenRouter、Ollama 等，API key 或 OAuth 皆可 |
| 模型切換 | Session 中途用 `/model` 或 `Ctrl+L` 切換，`Ctrl+P` 循環常用模型 |
| 樹狀 session | Session 以樹狀結構儲存，`/tree` 可跳回任一點續接，所有分支存在同一個檔案；`/export` 匯出 HTML、`/share` 上傳 gist |
| 訊息插隊 | agent 工作中仍可送訊息：`Enter` 是 steering（當前工具跑完就插入），`Alt+Enter` 是 follow-up（等它做完）|

## 擴充機制

Pi 的擴充系統是 TypeScript 模組，能存取：

- **工具**：新增自訂工具
- **指令**：新增自訂指令
- **鍵盤快捷鍵**：綁定自訂操作
- **事件**：監聽 agent 生命週期事件
- **TUI**：完整存取終端機 UI

透過 Extension，你可以自己實作 sub-agents、plan mode、權限控管、沙盒、MCP 整合等。Pi 的態度是：與其內建所有功能然後讓你關掉不要的，不如讓你只載入你需要的。

## TUI 引擎

Pi 的 TUI 底層是 `@mariozechner/pi-tui`，特色包括：

- 無閃爍差分渲染
- CSI 2026 同步輸出
- 括號貼上處理
- 行內圖片支援（Kitty / iTerm2 協定）
- 自動完成與 overlay 對話框

## 與 OpenClaw 的關係（已經變了）

過去常見的說法是「OpenClaw 是外殼、Pi 是它的 agent runtime 核心」。**這個描述已經過期。**

兩邊現在的官方說法並不一致，兩個都列出來：

- **OpenClaw 這邊**：官方文件現在寫的是內建 runtime id 就是 `openclaw`，`pi` 是會被正規化掉的 legacy 別名，並明講「已經沒有外部 agent 框架套件」。也就是 Pi 那部分已經被吸收進 OpenClaw 自己的程式碼，不再是一個外掛的依賴。細節見 [OpenClaw 參考篇](/posts/ai/2026-03-28-openclaw-pi-reference)。
- **Pi 這邊**：pi.dev 仍把 OpenClaw 列為 SDK 模式的實際整合案例。

比較安全的理解是：**Pi 的 SDK 模式曾經（也仍被官方引用為）OpenClaw 的嵌入範例，但 OpenClaw 的內建 runtime 已經不再是「掛上去的 Pi」。** 如果你在設定檔裡看到 `pi` 這個 runtime id，那是 legacy 別名。

作者本人對這段關係的公開評論也值得一讀——Pi 被放進 OpenClaw 之後，他的 issue tracker 開始湧入大量由 OpenClaw instance 自動產生的內容，最後他用「PR 一律自動關閉並要求人類用自己的話重寫 issue」當過濾器。這是開源專案被 agent 生態放大後的真實副作用。

Pi 本來就可以完全獨立使用，不需要 OpenClaw。

## 有人把 Pi 反過來做了：omp

Pi 的「刻意不做」清單，正好是另一個人的待辦清單。`can1357/oh-my-pi`（指令叫 `omp`）是 Pi 的 fork，2025-12-31 開張，八個月累積 18,392 個 commit、25,706 stars。它把 Pi 拒絕的東西全部補上：內建工具 7 個變 31 個，加上 14 個 LSP 操作、28 個 DAP 操作、subagent、advisor、權限模式。

分岔不只在功能層——omp 多了約 80,000 行 Rust，把 grep、shell、AST、PTY 全部搬進 in-process，語言組成從 Pi 的「TypeScript 8.5 MB、C 10 KB」變成「TypeScript 50.1 MB、Rust 5.2 MB」。

兩邊都是 MIT，omp 的 LICENSE 版權雙掛。細節見 [omp（Oh My Pi）：把 Pi 的極簡主義翻過來的 batteries-included 分支](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)。

## 資源需求

Pi 可以跑在非常小的模型上：

| 場景 | 模型層級 |
|---|---|
| 輕量使用 | 1.7B 級本地模型（如 Qwen3:1.7b） |
| 一般開發 | Sonnet 級 / GPT-5 級中階模型 |
| 複雜任務 | Opus 級 / 旗艦模型 |

具體型號每季都在換，這裡只講層級。重點是 Pi 對小模型特別友善——極短的 system prompt 和 4 個工具，讓 1.7B 的本地模型也還跑得動，這是功能齊全的 harness 做不到的。

## 與其他 Coding Agent 的比較

| | Pi | Claude Code | Codex CLI | OpenCode |
|---|---|---|---|---|
| 語言 | TypeScript | TypeScript | Rust | TypeScript |
| 核心工具 | 4 個 | 多個 | 多個 | 多個 |
| 設計哲學 | 極簡可擴充 | 功能完整 | OpenAI 生態整合 | 模型自由度 |
| 內建 sub-agents | ❌（Extension 可加） | ✅ | ✅ | ✅ |
| 內建 MCP | ❌（Extension 可加） | ✅ | ✅ | ❌ |
| 最小可用模型 | 1.7B | 需大型模型 | 需 OpenAI 模型 | 彈性 |
| 內建 plan mode | ❌ | ✅ | ✅ | ✅（plan agent）|

## 典型使用場景

1. **極簡開發**：只需要基本的讀寫編輯能力，不想要複雜功能
2. **自訂 agent**：用 Extension 系統打造完全客製化的 coding workflow
3. **本地小模型**：接 Ollama 跑 1.7B 模型，在低資源環境下工作
4. **嵌入應用**：用 SDK 模式把 Pi 嵌入自己的產品
5. **OpenClaw 核心**：作為 OpenClaw Gateway 的 agent runtime

## 與其他工具的定位差異

Pi 的核心優勢：極簡設計帶來的低 token 消耗和高 prompt cache 命中率、TypeScript Extension 的無限擴充性、以及對小模型的友善支援。適合喜歡「自己動手」、想要完全掌控 agent 行為的開發者。

## 參考資料

- [Pi 官方網站 pi.dev](https://pi.dev/)
- [GitHub - earendil-works/pi](https://github.com/earendil-works/pi)
- [Pi 作者部落格：打造極簡 coding agent 的心得](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Mario Zechner 演講：Building pi in a World of Slop（AI Engineer）](https://www.youtube.com/watch?v=RjfbvDXpFls)
- [OpenClaw 參考篇：Pi 已經被吸收掉了](/posts/ai/2026-03-28-openclaw-pi-reference)
- [omp（Oh My Pi）：把 Pi 的極簡主義翻過來的 batteries-included 分支](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)
- [GitHub - can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)

## 更新紀錄

- 2026-08-18：對照 pi.dev 與 repo 翻新。①repo 已由 `badlogic/pi-mono` 改名為 `earendil-works/pi`，npm scope 換成 `@earendil-works`，安裝指令一併更新；②**改寫〈與 OpenClaw 的關係〉**——原文的「Pi 是 OpenClaw 的 AI 核心引擎」分層表已過期，OpenClaw 官方現在的內建 runtime id 就是 `openclaw`、`pi` 只是 legacy 別名，兩邊說法的不一致也一併標出；③補上官方「刻意不做什麼」的完整清單與替代做法、15+ 供應商、樹狀 session、訊息插隊機制；④比較表修正 OpenCode 的語言（Go → TypeScript）；⑤移除寫死的模型型號，改講層級；⑥合併重複的參考資料區塊，移除已 410 的外部連結
- 2026-08-19：新增〈有人把 Pi 反過來做了：omp〉一節，補上 fork `can1357/oh-my-pi` 的存在與規模數字（31 工具、~80k 行 Rust、18,392 commits），並在參考資料互連專文。
