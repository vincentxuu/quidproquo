---
title: "Agent CLI 完整指南：設計邏輯、工具比較與使用原則"
date: 2026-04-01
type: guide
category: ai
tags: [agent-cli, claude-code, codex-cli, gemini-cli, opencode, pi, kiro, aider, amp, cursor-cli, agentic-ai, developer-tools, cli, mcp, context-engineering]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 1
tldr: "Agent CLI 不是更聰明的補全工具，而是能讀懂 codebase、執行多步驟任務、操作真實環境的 AI 代理。Claude Code、Codex CLI、Gemini CLI、OpenCode、Aider、Pi、Kiro、Amp、Cursor CLI... 工具越來越多，但底層共享一套設計邏輯——理解這套邏輯，才能真正用好它們。"
description: "完整比較 Claude Code、OpenAI Codex CLI、Gemini CLI、OpenCode、Aider、Pi、Kiro（AWS）、Amp、Cursor CLI 等主流 Agent CLI 工具的核心機制，並說明上下文工程、工具使用、權限控制等最佳實踐。"
draft: false
---

2025 年之前，AI coding assistant 的使用場景大多是補全（Copilot）或問答（ChatGPT）。你輸入，它輸出，你複製貼上，你決定要不要用。

2025 年後，Agent CLI 改變了這個模式。你輸入一個任務，它去讀 codebase、跑測試、改程式碼、提 PR——整個過程你可以去喝咖啡。

這篇介紹 Agent CLI 的設計邏輯、主流工具的差異，以及如何用好它們。每個工具都有各自的詳細專文，這篇作為導覽地圖。

## 什麼是 Agent CLI

Agent CLI 是跑在終端機的 AI coding agent。和傳統補全工具的根本差異在於：它不只是回答你的問題，而是有能力**在你的環境裡採取行動**。

典型的能力組合：

- 讀取整個 repo（不只是你選取的片段）
- 執行 shell 指令（跑測試、安裝套件、git 操作）
- 讀寫檔案系統
- 呼叫外部 API 和 MCP 工具
- 在多個步驟之間維持上下文和計畫

這讓它從「問答助手」變成「能夠執行任務的代理」。

## 主流工具

### Claude Code（Anthropic）

由 Anthropic 開發，模型是 Claude Sonnet / Opus。定位是**開發者日常工作的主要代理**，而非單點輔助工具。

核心設計：**CLAUDE.md 系統**讓你在 repo 或 `~/.claude/` 放工作守則；**Skills 系統**把常用工作流程封裝成 slash command；**Hooks** 在工具呼叫事件插入自動化邏輯；**MCP 整合**接入外部工具；**Sub-agent 架構**支援平行派遣子代理。

功能最完整，適合作為主力開發工具。按 Anthropic API token 計費。

**→ [Claude Code：Anthropic 終端機 AI Coding Agent 完整介紹](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent)**

---

### Codex CLI（OpenAI）

OpenAI 的開源 Agent CLI（Apache-2.0，~106.6k stars），用 Rust 打造。可綁 **ChatGPT 訂閱方案**（Plus / Pro / Team / Enterprise）直接使用，或自備 API key。

核心設計：**AGENTS.md 系統**對應 CLAUDE.md；**三種授權模式**（suggest / auto-edit / full-auto）；**沙箱隔離**（macOS 用 Apple Sandbox，Linux 用 Docker）；**完全本地執行**，狀態不上傳。

適合需要嚴格控制執行環境、或想自訂 agent 行為的開發者。

**→ [Codex CLI：OpenAI 開源終端機 Coding Agent 完整介紹](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)**

---

### Antigravity CLI（Google）

Google 現在的終端 agent。它接替的 **Gemini CLI 已於 2026/06/18 對個人帳號停止服務**——那個「每天 1,000 次免費請求」的方案不存在了，Gemini CLI 本身只剩企業授權與付費 API key 兩條路徑（repo 仍以 Apache-2.0 維護，~106.6k stars）。

Antigravity CLI 以 Go 重寫，與 Antigravity 2.0 桌面版共用同一套 server-side harness，保留 Agent Skills、Hooks、Subagents（Extensions 改稱 plugins），主打非同步背景工作流。代價是**不再開源**。

**→ [Antigravity CLI：Google 終端機 AI Agent 完整介紹](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)**

---

### OpenCode

開源 AI coding agent（**TypeScript**，MIT，~198.7k stars，repo 在 `anomalyco/opencode`），內建 TUI 介面，另有桌面版。最大特色是**支援 75+ LLM**——可接 Anthropic、OpenAI、Ollama 本地模型、任何 OpenAI-compatible API。供應商清單走 Models.dev。

核心設計：LSP 整合讓 agent 有 IDE 等級的程式碼理解；**雙 agent 模式**（planning agent + execution agent 分工）；Vim 風格編輯器；SQLite session 管理。

**→ [OpenCode：開源 AI 終端機 Coding Agent 完整介紹](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)**

---

### Aider（Paul Gauthier）

最老牌的 terminal pair programming 工具（~48.3k GitHub stars，repo 在 `Aider-AI/aider`），純 CLI，Python 打造，Apache-2.0。支援 100+ LLM——官方推薦的型號每代都在換，以 repo 的 leaderboard 為準。最大特色是**自動 git commit**——每次 AI 修改都自動建立 commit，方便 review 和 rollback。

核心設計：`--architect` 模式（高能力模型出架構、低成本模型實作）；`--watch` 模式偵測 AI comment 自動觸發；SWE-bench 成績優異。

最適合只想要輕量、可靠的 terminal pair programmer，不需要複雜 agent 功能的開發者。但**維護節奏在 2026 年明顯放緩**（最後一版 PyPI 是 2026-02、最後 commit 2026-05），選型前請看專文的數字。

**→ [Aider：最老牌的終端 AI Pair Programmer，以及它現在的維護狀況](/posts/tech/2026-08-19-aider-terminal-pair-programming)**

---

### Pi（Mario Zechner）

極簡主義的開源 coding harness，用 TypeScript 打造，用 Bun runtime 跑。核心只有 **4 個工具**（read、write、edit、bash）和 300 字 system prompt——設計哲學就是「拒絕複雜度」。

核心設計：透過 Extensions、Skills、Prompt Templates 擴充；Ollama 已內建 `ollama launch pi` 一鍵啟動。刻意不做 MCP、sub-agents、plan mode、權限彈窗，每一項都給你自己補的做法。repo 已改名 `earendil-works/pi`（~93k stars），npm scope 是 `@earendil-works`。

**→ [Pi Coding Agent：極簡主義的開源終端機 Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)**

---

### Kiro CLI（AWS）

AWS 官方產品（前身是 **Amazon Q Developer CLI**），提供 IDE（Code OSS fork）和獨立 CLI 兩種形式。

核心設計：**Spec 驅動開發**——用 EARS notation 把自然語言需求轉成結構化 requirements + 驗收條件，再生成架構設計和 task list，最後 agent 逐步執行；**Agent Hooks** 在存檔等事件自動觸發；支援 multimodal 輸入；原生 MCP；預設走 **Auto 模式**（混合 frontier 與專用模型動態切換，比指定單一 frontier 模型省 credit），付費方案另可指定 premium 模型。

適合在 AWS 生態重度使用、或偏好 spec-first 開發流程的團隊。官網：[kiro.dev](https://kiro.dev)

---

### Cursor CLI（Anysphere）

Cursor AI IDE 推出的獨立 CLI，一行安裝：`curl https://cursor.com/install -fsS | bash`。定位是「在任何環境交付程式碼」——不需要開 IDE，直接在 terminal 跑 agent。

核心設計：支援所有 Cursor 模型——自家的 Grok 4.6 / 4.5 與 Composer 2.5，加上各家 frontier model（兩者分屬不同的額度池）；**Shell Mode** 讓 agent 直接執行 shell 指令並顯示輸出；**Headless 模式**適合 CI pipeline 和腳本自動化；**GitHub Actions 整合**可觸發 nightly docs update、安全審查等工作流；MCP 整合。

可獨立使用，不需要搭配 Cursor IDE，適合 CI/CD 自動化或想在 terminal 用 Cursor 訂閱模型的開發者。官網：[cursor.com/cli](https://cursor.com/cli)

---

### GitHub Copilot CLI（GitHub / Microsoft）

GitHub 官方的 terminal agent，綁 **GitHub Copilot 訂閱方案**（Free / Pro / Team / Enterprise），不需額外付費。在 terminal 提供 chat 介面，可自主讀寫檔案、執行指令，完成 bug fix、功能開發、文件更新、測試補全等任務。

核心設計：**Autopilot 模式**（`--allow-all`）讓 agent 完全自主執行，不需逐步確認；預設只存取當前目錄下的檔案，跨目錄需要明確授權；支援 **custom instructions**（`.github/copilot-instructions.md`）設定專案規範；與 GitHub 生態深度整合（PR review、issue triage、GitHub Actions）。

適合已有 GitHub Copilot 訂閱、且在 GitHub 生態工作的開發者——不需額外開通任何 API。2026-02-25 正式 GA，所有方案（含 Free）都包含。

**→ [GitHub Copilot CLI：把 agent 開在 GitHub 這個平台上](/posts/tech/2026-08-19-github-copilot-cli)**

---

### Amp（Amp Frontier Corporation）

原本是 Sourcegraph 的產品，**2025 年 12 月已獨立成 Amp Frontier Corporation**，npm 套件也從 `@sourcegraph/amp` 改為 `@ampcode/cli`。2026 年初砍掉 editor extension 專注 CLI 路線——這只是它一長串「砍功能」清單中的一項。

現在的主軸是 **orbs**（關掉筆電仍繼續跑的遠端機器），計費在 2026-07-18 首度加入月費訂閱（Megawatt $20 / Gigawatt $200），此前只有 pay-as-you-go。

適合願意跟著前沿一路換、受得了功能隨時被砍的開發者。

**→ [Amp：靠「砍功能」定義自己的 coding agent](/posts/tech/2026-08-19-amp-frontier-agent)**

---

## 工具對比一覽

| 工具 | 開源 | 模型 | 特色 | Stars |
|------|------|------|------|-------|
| Claude Code | 否 | Claude | Skills + Hooks + Sub-agent，功能最完整 | — |
| Codex CLI | Apache-2.0 | ChatGPT 方案 / API key | 沙箱隔離，三種授權模式 | ~106.6k |
| Antigravity CLI | 否 | Gemini 系列 | 接替 Gemini CLI，非同步背景工作流 | — |
| Gemini CLI | Apache 2.0 | Gemini 系列 | **個人方案已於 2026/6 終止**，只剩企業與 API key | ~106.6k |
| OpenCode | MIT | 75+ LLM | TUI + LSP，不綁供應商 | ~198.7k |
| Aider | Apache 2.0 | 100+ LLM | 自動 git commit，最老牌 | ~48.3k |
| Pi | MIT | 任意 | 極簡 4 工具、極短 prompt | ~93k |
| Kiro CLI | 否 | Auto / premium 模型 | Spec-first，AWS 官方 | — |
| Cursor CLI | 否 | 自家模型 + 各家 frontier | IDE 延伸，headless/CI | — |
| GitHub Copilot CLI | 否 | Copilot 模型 | 綁 Copilot 訂閱，GitHub 生態整合 | — |
| Amp | 否 | 多模型（模式決定） | orbs 遠端長跑，砍功能出名 | — |

## 核心設計模式：上下文工程

Agent CLI 好不好用，30% 取決於模型能力，70% 取決於你給它的上下文。

**上下文檔案（CLAUDE.md / AGENTS.md / GEMINI.md）**——告訴 agent 這個專案的規範、禁止事項、工作流程，以及任何沒辦法從 code 本身推導出來的事。

一個好的上下文檔案：

```markdown
# Project Context
這個專案是 ... 用 ... tech stack，部署在 ...

# Commit 規範
每次 commit 使用 conventional commits 格式：feat / fix / docs / refactor

# 不要做的事
- 不要用 `git add .`，逐一加入要 commit 的檔案
- 不要在沒問清楚的情況下刪除檔案
- 測試跑過之前不要 commit

# 工作流程
1. 改程式碼前先讀懂相關的測試
2. 改完跑 `npm test`
3. 用 TDD 方式處理 bug fix
```

原則：**具體指令優於模糊原則**（「遵守 clean code」沒用）；**禁止事項要明確**（agent 不知道你覺得理所當然的限制）；**分層管理**（全域放通用習慣，repo 根目錄放專案規範）。

## 工具使用與授權模式

**只讀工具**（通常可以自動允許）：讀取檔案、搜尋 codebase、git log / diff

**寫入工具**（建議要求確認）：編輯/新建/刪除檔案、git commit / push

**執行工具**（最高風險）：執行 shell 指令、呼叫外部 API

把授權模式設成「完全自動」然後抱怨 agent 做了你不想要的事，是最常見的錯誤。

## 有效使用的實踐原則

**任務分解而非一次全給：**
```
❌ "幫我把這個 codebase 從 REST API 改成 GraphQL"
✅ "先列出所有對外的 REST endpoint，不要動任何程式碼"
   → 確認後："把 /users GET 和 POST 改成 GraphQL，其他先不動"
```

**讓 agent 先 plan 再 execute：**
```
> claude "我想重構 auth module，先告訴我你打算怎麼做，不要動任何檔案"
```

**把可重複的工作流程封裝起來：** 每次 commit 都輸入同樣指示就是應該封裝的訊號。Claude Code 的 Skills、Pi 的 Prompt Templates、Kiro 的 Custom Agents 都是這個用途。

**驗證的責任在你：** Agent 不會告訴你它做錯了。讓 agent 自己跑測試確認通過、重要操作前看 `git diff`——這些步驟不能省。

## 整體來說

```
選擇邏輯：
Claude Code   → 功能最完整，適合主力日常
Codex CLI     → 開源可控，適合需要沙箱隔離
Gemini CLI    → 免費額度大，適合輕量嘗試或長 context
OpenCode      → 不綁 LLM，適合多模型混用或本地部署
Aider         → 自動 git commit，適合輕量 pair programming
Pi            → 極簡，適合理解底層或客製 harness
Kiro CLI      → Spec-first，適合 AWS 生態或規格驅動團隊
Cursor CLI    → IDE 延伸，適合 Cursor 使用者補上 terminal/CI
GitHub Copilot CLI → 已有 Copilot 訂閱，適合 GitHub 生態工作者
Amp           → orbs 遠端長跑，適合跟緊前沿、不怕介面變動
```

核心取捨：投資上下文工程的前期成本，換取後期每個任務的效率乘數。對在同一個 repo 長期工作的開發者，這個投資回收很快。

---

## 參考資料

- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code)
- [OpenAI Codex CLI GitHub](https://github.com/openai/codex)
- [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli)
- [OpenCode GitHub](https://github.com/anomalyco/opencode)
- [Aider GitHub](https://github.com/Aider-AI/aider)
- [Pi Coding Agent GitHub](https://github.com/earendil-works/pi)
- [Antigravity CLI 官方公告](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Kiro 官方網站](https://kiro.dev)
- [GitHub Copilot CLI 官方文件](https://docs.github.com/en/copilot/github-copilot-in-the-cli/about-github-copilot-in-the-cli)
- [Amp](https://ampcode.com)
- [Cursor CLI 官方網站](https://cursor.com/cli)
- [AGENTS.md 標準草案](https://agentsmd.org/)
- [Model Context Protocol（MCP）規格](https://modelcontextprotocol.io/)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)

## 更新紀錄

- 2026-08-19：補上 Aider、GitHub Copilot CLI、Amp 三篇專文連結，兌現本文「每個工具都有詳細專文」的說法；修正 Amp 的歸屬（已於 2025-12 從 Sourcegraph 獨立為 Amp Frontier Corporation，npm 套件改名 `@ampcode/cli`）與它現在的主軸（orbs、2026-07 才有的訂閱制）；補記 Aider 維護放緩與 Copilot CLI 已於 2026-02-25 GA
- 2026-08-18：全面校對工具現況。①**Gemini CLI 個人方案已於 2026/6/18 終止**，該節改寫為 Antigravity CLI，選型清單與對照表一併更新；②修正 OpenCode 的語言與 repo（Go → **TypeScript**、`opencode-ai/opencode` → `anomalyco/opencode`）；③修正三個失效或錯誤的 repo 連結：Aider（`paul-gauthier` → `Aider-AI`）、Pi（`badlogic/lemmy` → `earendil-works/pi`）、OpenCode；④更新 star 數：Codex 71k → ~106.6k、Gemini CLI ~99.8k → ~106.6k、Aider 42.7k → ~48.3k，補上 OpenCode ~198.7k 與 Pi ~93k；⑤移除寫死的模型型號（Kiro 的 Sonnet 4.5、Cursor 的 Opus 4.6／GPT-5.2／Gemini 3 Pro、Aider 的 Claude 3.7／o1），改以層級或現行機制描述；⑥補上 Pi「刻意不做什麼」的設計主張
