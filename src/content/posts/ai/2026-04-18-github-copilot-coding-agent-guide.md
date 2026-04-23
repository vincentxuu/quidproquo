---
title: "GitHub Copilot Coding Agent：把 Issue 丟給 AI，讓它自己開 PR"
date: 2026-04-18
type: guide
category: ai
tags: [github, copilot, coding-agent, ai-agent, github-actions, sandbox, pr-automation]
lang: zh-TW
tldr: "GitHub Copilot Coding Agent 讓你把 Issue 指派給 Copilot，它在雲端沙箱裡自動開 branch、寫程式、跑 CI、開 PR。成功關鍵是設好 AGENTS.md，沒設定的話 agent 容易跑偏。適合定義清楚的中型任務，需 Pro+（每月 1,500 premium requests）或 Enterprise 方案。"
description: "深入介紹 GitHub Copilot Coding Agent 的核心概念、Issue 指派流程、AGENTS.md 設定、沙箱機制、GitHub Actions 整合、與 Claude Code / Cursor / Codex 的比較，以及適用情境與限制。"
draft: false
---

GitHub Copilot Coding Agent 讓你直接在 Issue 頁面把任務指派給 Copilot，它在雲端沙箱裡把問題解掉、開 branch、跑測試，最後送出 PR 等你 review。這篇整理它的工作流程、真實使用經驗、設定要點，以及跟其他 coding agent 的取捨。

## 定位：GitHub 內建的非同步 coding agent

Copilot Coding Agent 跟 IDE 裡的 Copilot 補全或 Copilot Chat 是完全不同的東西——它是**非同步執行、有自己沙箱**的 agent，不是你打字它回應的對話模型。

| | Copilot Chat（IDE） | Copilot Coding Agent |
|---|---|---|
| 執行模式 | 同步，你在旁邊 | 非同步，你去做別的事 |
| 執行環境 | 你的本機 | GitHub 雲端沙箱 |
| 輸出 | 程式碼片段、建議 | Branch + PR |
| 適合任務 | 小範圍補全、解釋 | 中型功能、bug fix |

跟其他 coding agent 的最大差異是**完全整合在 GitHub 工作流裡**，不需要另外安裝工具或切換環境。有用戶評價「GitHub 第一次真正做到了 IDE-less 體驗」——你可以在 Issue 指派完就關掉電腦，agent 自己跑完會開 PR 通知你。

## 怎麼把 Issue 指派給 Copilot

有幾個入口都可以觸發：

- **GitHub Issues**：在右側 Assignees 選「Copilot」，或留言 `/assign @github-copilot`
- **Agents panel**：在 GitHub 上直接開 ad hoc 任務，不需要先建 Issue
- **VS Code**：在編輯器裡指定任務
- **手機 app**：離開電腦時處理小任務

指派後，Copilot 會自動：
1. 分析 Issue 內容和 repo 的 codebase
2. 建立新 branch（預設命名 `copilot/fix-<issue-number>`）
3. 在沙箱裡執行 coding loop
4. 開 draft PR，附上工作摘要說明它的設計決策

你可以在 PR timeline 看到每個步驟的 log——搜了哪些檔案、呼叫了哪些工具、為什麼做某個決定。

**把 Issue 當 prompt 寫**是這個流程的關鍵心態。描述越清楚、預期結果越具體，agent 表現越好。模糊的 Issue 會導致 agent 跑偏或開出要大改的 PR。

## AGENTS.md：最被忽略但最重要的設定

實際用下來最常見的問題是：**沒設定 AGENTS.md，agent 的第一個 PR 就跑偏了**。

AGENTS.md（放在 repo 根目錄或子目錄）是給 agent 的說明書，告訴它這個 repo 是什麼、怎麼 build、用什麼規範。GitHub 分析超過 2500 個 repo 的結果是：「說明太模糊」是最常見的失敗原因，「你是個有幫助的 coding assistant」完全不夠——「你是負責寫 React 元件測試的工程師，遵循以下範例，絕對不能修改 source code」才有效。

一份有效的 AGENTS.md 需要包含：

```markdown
# Project Overview
這是一個用 Next.js + TypeScript 寫的電商平台後台。

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.x
- DB: PostgreSQL (via Prisma)
- Testing: Vitest + Testing Library

## Build & Test Commands
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`

## Code Standards
- 所有新功能需附帶對應的 unit test
- 使用 Zod 做 API input validation
- 命名用英文，commit message 用英文

## Project Structure
- `app/`: Next.js App Router 頁面
- `components/`: 共用 UI 元件
- `lib/`: 工具函式、DB 操作
- `tests/`: 測試檔案
```

Copilot 也支援 `.github/copilot-instructions.md`、以及 `CLAUDE.md`、`GEMINI.md`——跨工具的設定可以共用。

## Agent 的工作流程

```
Issue 指派
   ↓
Clone repo → 讀 AGENTS.md → 分析 codebase → 制定計畫
   ↓
工具呼叫 loop（read / edit / bash / search）
   ↓
跑 CI（GitHub Actions）→ 看結果 → 修 failing test
   ↓
安全掃描（secret scanning / dependency check / code scan）
   ↓
開 draft PR + 工作摘要
   ↓
你 review → 核准 / 要求修改
```

2026 年加入了**安全掃描整合**：agent 會在開 PR 前自動跑 code scanning、secret scanning 和 dependency vulnerability check，有問題直接在 PR 裡標記，不會等到你手動 review 才發現。

## 真實常見用途

根據社群回饋，最常被指派給 Coding Agent 的任務：

**高成功率的任務類型**：
- **Bug fix**：錯誤訊息明確、有 test coverage 的 bug，成功率最高
- **文件補寫**：補 JSDoc、更新 README、新增 API 文件
- **加 validation**：在現有表單或 API 加輸入驗證
- **補測試**：針對現有功能補 unit test
- **CI 更新**：加新的 lint step、更新 GitHub Actions workflow
- **小功能**：「在 user profile 頁加 email 通知開關」這類範圍明確的需求

**常被提到的進階用法**：

技術債批次處理——用 Agents panel 一次丟多個 backlog 任務，讓 agent 並行跑，人去做需要創意思考的工作。把技術債從「沒時間處理」變成「指派出去等 PR」。

UI 測試截圖——搭配 Playwright MCP server，讓 agent 啟動瀏覽器跑你的 app、截圖存進 PR。適合 responsive design、dark mode、UI regression 等視覺驗證，截圖比 code diff 更直覺。

文件驗證——把使用者文件當成可執行指令，讓 agent 模擬 first-time user 跟著步驟走，找出哪些步驟有問題或缺失。

## 跟 GitHub Actions 的整合

Copilot Coding Agent 跟 Actions 是雙向整合：

**agent 消費 Actions 結果**：agent 開 PR 後，你平常設定的 CI workflow 自動跑，agent 讀 Check runs 結果，有失敗就再改。

**Actions 主動觸發 agent**：CI pipeline 可以直接呼叫 Coding Agent，讓自動化管線變成 agent 的觸發點：

```yaml
# 範例：label 為 copilot 的 issue 自動指派給 agent
on:
  issues:
    types: [labeled]

jobs:
  assign-to-copilot:
    if: github.event.label.name == 'copilot'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-copilot-coding-agent@v1
        with:
          issue-number: ${{ github.event.issue.number }}
```

實際應用：flaky test 出現時自動開 Issue 並指派給 Copilot 修、dependency security alert 自動觸發升版 PR。

## 沙箱安全機制

每個 session 跑在 GitHub 管理的隔離容器：

- 網路預設受限，不能任意打外部服務
- 容器在 session 結束後銷毀，沒有持久化狀態
- Secrets（Actions Secrets）**預設不注入沙箱**，需明確設定才能使用
- Token 只有 repo 最小必要權限（read contents + write pull requests）

安全限制的實際影響：如果任務需要呼叫你的 staging API 或存取私有 registry，要先搞清楚哪些 secrets 要開放，否則 agent 會卡住。

## 跟其他 coding agent 的比較

| | Copilot Coding Agent | Claude Code | Cursor Agent | OpenAI Codex |
|---|---|---|---|---|
| 執行地點 | GitHub 雲端 | 本機 | 本機 | 雲端 |
| 觸發方式 | Issue、Actions、panel | CLI | IDE 內 | API / CLI |
| 整合深度 | GitHub 原生 | 通用 | VS Code | 通用 |
| 非同步 | ✅ | ❌（本機掛著） | ❌ | ✅ |
| 控制粒度 | 低（任務層） | 高（可中途介入） | 中 | 低 |
| 模型 | GPT-4o / o3 | Claude | Claude / GPT | GPT-4o / o3 |

Copilot Coding Agent 最大優勢是**零摩擦**——不需要在本機開任何東西，指派完就可以關電腦。代價是控制力低：你對 agent 如何解讀任務、做哪些搜尋，只能從 PR log 事後看，無法即時調整。

Claude Code 的優勢在於更靈活的任務定義和直接控制（可以中途 interrupt、調整方向），適合需要來回溝通的複雜任務。Cursor Agent 跟 IDE 整合更深，UI 調整、視覺反饋很重要的任務體驗更好。

## 適用情境

**適合**：
- Issue 描述清楚、範圍明確的任務
- 有良好 test coverage 的 repo——agent 能用測試驗證改動
- 多個 PR 要並行處理但人手不夠
- 已在用 GitHub Issues 追蹤工作的團隊

**不適合**：
- 需要多次來回澄清的模糊需求
- 大規模重構或架構調整——diff 太大難以 review
- 需要存取私有 secrets 或外部 API 的複雜整合
- Repo 沒有測試覆蓋——agent 比較容易改錯不自知

## 計費

Copilot Coding Agent 目前開放給 **Copilot Pro+** 和 **Copilot Enterprise**：

| 方案 | 月費 | Premium requests/月 | Coding Agent |
|---|---|---|---|
| Copilot Free | 免費 | 50 | ❌ |
| Copilot Pro | $10 | 300 | ❌ |
| Copilot Pro+ | $39 | 1,500 | ✅ |
| Copilot Enterprise | 另計 | 更高額度 | ✅ |

超出額度的 premium request 另計 **$0.04/request**。

**2026-04-20 收費調整**：GitHub 收緊了個人方案的使用上限，Pro+ 的額度是 Pro 的 5 倍以上；同時暫停受理 Pro、Pro+、Student 新用戶報名（Copilot Free 仍可新增）。Opus 模型也從 Pro 方案移除，Pro+ 則保留 Opus 4.7。

注意有兩個費用來源：
1. **Premium requests**：一個 agent session 消耗 10–50 個，視任務複雜度
2. **GitHub Actions minutes**：agent 跑在 Actions 上，會消耗你的 Actions 配額

跟 Claude Managed Agents 的 session-hour 計費不同，這套以 request 數計費，加上 Actions minutes，難以精確預估單一任務的總花費。

## 整體來說

Copilot Coding Agent 的核心取捨是**便利性換控制權**。對已在 GitHub 工作流的團隊，它是最低摩擦的方式把定義清楚的任務交給 AI——不需要改工具鏈、不需要學新 CLI。真正讓它好用的前提是**設好 AGENTS.md**，讓 agent 理解你的 repo 規範；沒有這份文件，agent 容易在第一個 PR 就跑偏，需要大量來回修改。

如果任務是「Issue 開好了、規格明確、有 test coverage，但就是沒時間一個個做」，Copilot Coding Agent 直接插入現有工作流的能力讓它很有競爭力。需要細粒度控制或大規模重構，Claude Code 或本機 agent 還是更合適。

## 參考資料

- [About GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)
- [Best practices for using Copilot to work on tasks](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks)
- [5 ways to integrate GitHub Copilot coding agent into your workflow](https://github.blog/ai-and-ml/github-copilot/5-ways-to-integrate-github-copilot-coding-agent-into-your-workflow/)
- [How to write a great agents.md: Lessons from over 2,500 repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [What's new with GitHub Copilot coding agent](https://github.blog/ai-and-ml/github-copilot/whats-new-with-github-copilot-coding-agent/)
- [GitHub Copilot coding agent 101](https://github.blog/ai-and-ml/github-copilot/github-copilot-coding-agent-101-getting-started-with-agentic-workflows-on-github/)
- [Automating Copilot coding agent with GitHub Actions](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks/automating-copilot-coding-agent-with-github-actions)
- [Assigning and completing issues with coding agent](https://github.blog/ai-and-ml/github-copilot/assigning-and-completing-issues-with-coding-agent-in-github-copilot/)
- [My First Impressions of GitHub Copilot's Coding Agent](https://manjit28.medium.com/my-first-impressions-of-github-copilots-coding-agent-bae730a1d69d)
- [Claude Managed Agents：把 agent 外殼和沙箱都交給 Anthropic](/posts/ai/2026-04-12-claude-managed-agents-intro)
