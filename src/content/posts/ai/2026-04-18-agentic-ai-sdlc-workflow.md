---
title: "把 AI Agent 接進開發流程：從 SDLC 五大階段看怎麼做"
date: 2026-04-18
type: guide
category: ai
tags: [agentic-ai, sdlc, coding-agents, github-actions, claude-code, spec-driven-development, ai-workflow]
lang: zh-TW
tldr: "Agentic AI 不只是 autocomplete，而是能自主執行多步驟任務的 AI 系統。這篇文章拆解 SDLC 的五大階段，說明每個階段能從哪裡切入、怎麼從 CLI 工具走到全流程自動化，以及目前最值得追蹤的外部資源。"
description: "從需求設計到維運監控，拆解 Agentic AI 如何嵌入 SDLC 的五大階段，包含實作起步建議、multi-agent 架構模式，以及 2025-2026 年最值得讀的參考資料。"
draft: false
---

2025 年底開始，一個詞越來越常出現在工程師的對話裡：**Agentic AI**。

它不是比 autocomplete 更準的程式碼建議，而是一種完全不同的工作模式——AI 接收一個目標，自主規劃步驟、執行工具、處理錯誤，最後產出結果。Stripe 每週靠它 merge 1,300 個 PR，Spotify 最優秀的工程師從去年 12 月起就沒有親手寫過一行程式碼。

這篇文章想回答一個實際問題：**如果你也想把 Agentic AI 接進日常開發流程，要從哪裡開始？**

---

## 先釐清一件事：Agentic AI 跟一般 AI 工具的差異

一般 AI 工具（Copilot autocomplete、ChatGPT 問答）是**反應式**的——你問，它答，結束。

Agentic AI 是**主動式**的——你給它一個目標，它會：

1. 規劃達成目標需要的步驟
2. 呼叫工具（讀寫檔案、執行測試、查 API）
3. 根據結果調整下一步
4. 遇到錯誤自我修復，不是丟給你

這個差異決定了它能嵌入 SDLC 的方式。

---

## SDLC 五大階段 × Agentic AI

### 1. 需求與設計（Planning & Design）

Agent 能做的事：
- 讀取 PRD 或一段描述，自動拆分 user story 和技術任務
- 根據現有 codebase 產生驗收測試草稿
- 記錄架構決策（Architecture Decision Records）

**切入點**：在 Linear 或 GitHub Issues 建一個 prompt，讓 Claude 把模糊需求轉成具體技術任務。關鍵是要先寫 spec——目前業界最高共識的最佳實踐是 **spec-driven development**：先定義要做什麼，再讓 agent 去做。

---

### 2. 程式碼編寫（Coding）

Agent 能做的事：
- 接收任務 → 理解 codebase → 寫程式 → 跑測試 → 修錯 → commit
- 安全漏洞掃描、程式碼審查、加上 type annotation
- 跨多個檔案的重構與遷移

**切入點**：Claude Code CLI 就是這個階段的起點。給它一個任務描述，它會在你的 repo 裡自主執行。不需要任何基礎設施，裝好 CLI 就能開始。

---

### 3. 測試（Testing）

Agent 能做的事：
- 分析 diff 範圍 → 自動補充對應的單元測試和整合測試
- 產生 E2E 測試腳本
- 生成測試資料

**切入點**：把「幫我針對這個 PR 補測試」變成 CI pipeline 的一步。agent 讀 diff、找沒測到的路徑、補測試、commit。

---

### 4. 部署與安全（Deploy & Security）

Agent 能做的事：
- 偵測 CI 失敗 → 分析錯誤 → 嘗試修復 → 重新 push
- IaC 程式碼生成與驗證
- PR review：讀 diff、留有意義的評論

**切入點**：GitHub Agentic Workflows（目前 technical preview）讓你用 Markdown 描述一個 workflow，底下可以跑 Claude Code 或 Copilot 作為 coding agent engine，由 GitHub Actions 觸發執行。

---

### 5. 維運與監控（Ops & Monitor）

Agent 能做的事：
- 訂閱 alert → 判斷根因 → 開 issue 或直接嘗試 hotfix
- 瓶頸分析與效能建議
- 生成給新成員的上手文件

**切入點**：這個階段門檻最高，通常需要先把前四個階段走熟，再來考慮 on-call agent。

---

## 實作起步建議

從複雜度由低到高：

| 層級 | 做法 |
|------|------|
| **入門** | Claude Code CLI 做單一任務（寫功能、修 bug、補測試） |
| **進階** | 設定 Hooks，讓 agent 在 commit/push 時自動執行檢查 |
| **自動化** | GitHub Agentic Workflows：用 Markdown 定義，事件觸發 |
| **全流程** | Claude API + Agent SDK 串接 GitHub Webhook，multi-agent 分工 |

大多數團隊從**入門**就能感受到差異。不需要等「準備好」才開始。

---

## 三個關鍵設計原則

從矽谷一線公司（Stripe、Ramp、Coinbase、Spotify）的實際部署中，可以歸納出三個共同原則：

**1. Spec first**
先寫規格，再讓 agent 執行。給 agent 一個清楚的終態描述，比給它一步步指令有效得多。

**2. 沙箱隔離**
每個 agent 任務跑在隔離環境中，不能碰 production、不能碰 internet。爆炸半徑要控制在可接受的範圍。

**3. Human-in-the-loop 在哪裡**
高風險操作（force push、production deploy）保留人工確認。哪些可以 auto-merge、哪些要 review，要事先定義清楚，不要讓 agent 自己決定。

---

## 參考資料

- [GitHub Agentic Workflows 官方介紹](https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/)
- [GitHub Next: Agentic Workflows 專案](https://githubnext.com/projects/agentic-workflows/)
- [How to build reliable AI workflows with agentic primitives (GitHub Blog)](https://github.blog/ai-and-ml/github-copilot/how-to-build-reliable-ai-workflows-with-agentic-primitives-and-context-engineering/)
- [The New SDLC: A Practical Guide to Agentic Engineering](https://alexlavaee.me/blog/new-sdlc-agentic-engineering/)
- [Agentic SDLC: The AI-Powered Blueprint Transforming Software Development](https://www.baytechconsulting.com/blog/agentic-sdlc-ai-software-blueprint)
- [Modernizing the SDLC process with Agentic AI (Microsoft / Medium)](https://medium.com/data-science-at-microsoft/modernizing-the-sdlc-process-with-agentic-ai-8330163bca29)
- [Agentic Coding Best Practices (Blink)](https://blink.new/blog/agentic-coding-best-practices)
- [AI-Driven SDLC: Build Secure, Scalable Software with AI](https://ranthebuilder.cloud/blog/ai-driven-sdlc/)
- [Securing the Agentic Development Lifecycle (Cycode)](https://cycode.com/blog/securing-adlc/)
- [An AI-led SDLC with Azure and GitHub (Microsoft Community Hub)](https://techcommunity.microsoft.com/blog/appsonazureblog/an-ai-led-sdlc-building-an-end-to-end-agentic-software-development-lifecycle-wit/4491896)
- [Top 10 Agentic AI Repos in 2025 (ODSC)](https://odsc.medium.com/the-top-ten-github-agentic-ai-repositories-in-2025-1a1440fe50c5)
