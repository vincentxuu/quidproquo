---
title: "OpenAI Codex 完整方案分析：ChatGPT 生態系的 Agent 整合"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, openai-codex, pricing, gpt-5, chatgpt, model-routing]
lang: zh-TW
tldr: "Codex 綁定 ChatGPT 訂閱（$20-200/mo），GPT-5.4 + mini 自動路由是亮點，CLI 支援 Plan 模式與 API Key 模式雙軌計費。"
description: "深入分析 OpenAI Codex 2026 年的訂閱方案、CLI 計費模式、GPT-5.4 模型路由、多 Agent 架構與適用場景。"
draft: false
---

OpenAI Codex 不是一個獨立產品，而是 ChatGPT 生態系的延伸。理解這一點，才能正確評估它的定價與適用場景。這篇從產品定位、訂閱方案、CLI 計費、模型路由到最新更新，完整拆解 Codex 的方案設計。

## 產品定位

Codex 的核心策略是**綁定 ChatGPT 訂閱**。它不像 Claude Code 或 Gemini CLI 那樣作為獨立的開發者工具存在，而是 ChatGPT 生態系中專注於程式碼任務的 agent 功能。

使用者可以透過三種介面存取 Codex：

| 介面 | 說明 |
|------|------|
| **Web App** | ChatGPT 網頁版內建的 Codex 功能，直接在對話中使用 |
| **CLI** | 終端機 agent，支援本地 codebase 操作 |
| **IDE Extension** | VS Code 等編輯器擴充，整合開發環境 |

三種介面共用同一套訂閱額度，不需要分別付費。這意味著你的 ChatGPT Plus 訂閱同時涵蓋了 Codex 的使用權。

## 訂閱方案

Codex 的計費完全依附於 ChatGPT 訂閱層級。以下是各方案的定位與限制：

| 方案 | 月費 | Codex 額度 | 適用對象 |
|------|------|-----------|---------|
| **Free / Go** | $0 | 有限且暫時性存取，功能受限 | 試用、輕度使用者 |
| **Plus** | $20/mo | 約 160 則訊息 / 3 小時（GPT-5.2） | 個人開發者 |
| **Pro** | $200/mo | 約為 Plus 的 6-7 倍額度 | 重度使用者、專業開發者 |
| **Team** | $25-30/user/mo | Team 級別共享額度 | 小型團隊 |
| **Business / Enterprise** | 客製報價 | 整合 Slack Bots、GitHub Actions | 企業、大型組織 |

幾個重點：

- **Free / Go 方案**的 Codex 存取是暫時性的，不保證長期可用，適合評估但不適合日常開發。
- **Plus 方案**的 160 則訊息 / 3 小時是以 GPT-5.2 為基準。使用更高階模型時，實際可用訊息數會更少。
- **Pro 方案**提供 6-7 倍於 Plus 的額度，對需要大量 agent 操作的開發者來說，每 token 的單位成本明顯更低。
- **Business / Enterprise** 支援 Slack bot 整合與 GitHub Actions 自動化，適合需要將 Codex 嵌入既有 DevOps 流程的團隊。

## CLI 計費雙軌

Codex CLI 提供兩種計費模式，開發者可以根據使用場景切換：

### Plan 模式（預設）

使用 ChatGPT 訂閱額度，**不產生額外費用**。CLI 操作直接扣訂閱方案的 credit，和在 ChatGPT 網頁版使用 Codex 完全等價。

適合日常開發任務——修 bug、寫功能、跑 code review，額度通常夠用。

### API Key 模式

自備 API key，按 token 計費。適合需要大量自動化、CI/CD 整合、或超出訂閱額度的場景。

| 模型 | Input（每 M tokens） | Output（每 M tokens） |
|------|---------------------|----------------------|
| **codex-mini** | $1.50 | $6.00 |
| **GPT-5** | $1.25 | $10.00 |

**Prompt caching** 可享 75% 折扣，這對重複性高的自動化任務（如 CI pipeline 中反覆分析同一 repo）特別有利。

兩種模式的切換是即時的，不需要重新安裝或設定。開發者可以在日常工作用 Plan 模式（免費），遇到大量自動化需求時切換到 API Key 模式。

## 內建模型路由

這是 Codex 方案設計中最值得注意的特色。Codex 不讓使用者手動選模型，而是**自動判斷每個子任務該用哪個模型**。

### 路由機制

| 模型 | 角色 | 任務類型 |
|------|------|---------|
| **GPT-5.4** | 指揮官 | 規劃、協調、判斷、複雜推理 |
| **GPT-5.4 mini** | 執行者 | 範圍明確的子任務、平行處理 |

運作方式：

1. GPT-5.4 接收任務後，制定執行計畫
2. 將可平行化的子任務拆分給 GPT-5.4 mini
3. GPT-5.4 mini 完成子任務後回報
4. GPT-5.4 整合結果、做最終判斷

### 額度計算

**GPT-5.4 mini 只消耗 GPT-5.4 額度的 30%**。這意味著當系統自動將任務路由到 mini 時，你的訂閱額度可以用更久。以 Pro 方案為例，如果一半的任務被路由到 mini，實際可用的總任務量比純用 GPT-5.4 多出約 35%。

這個設計的關鍵在於**使用者不需要手動介入**。你不需要判斷「這個任務該用大模型還是小模型」——系統自動決定。對比需要手動切換模型的工具，這降低了認知負擔。

## 2026 年 3 月更新

2026 年 3 月的更新是 Codex 近期最大的版本升級：

| 項目 | 內容 |
|------|------|
| **核心模型** | 升級至 GPT-5.4，取代先前的 GPT-5.2 |
| **路由模型** | 新增 GPT-5.4 mini，專門處理較輕量的子任務 |
| **Codex Security** | 進入 Research Preview，可掃描程式碼安全漏洞 |
| **Parallel Agents** | 支援多個 agent 同時處理不同任務 |
| **Worktrees** | 支援 Git worktree 隔離，每個 agent 在獨立分支工作 |
| **Skills** | 可定義可重用的工作流程範本 |
| **Automations** | 支援自動化觸發器（如 PR 建立時自動 review） |

Parallel agents + worktrees 的組合特別實用：多個 agent 可以同時在不同 git worktree 中工作，互不干擾。例如一個 agent 修 bug、另一個寫測試、第三個更新文件，全部平行進行。

## Credit 機制

Codex 使用 credit 制而非單純的訊息數計算。Credit 消耗量取決於：

- **使用的模型**：GPT-5.4 消耗較多，GPT-5.4 mini 只消耗 30%
- **任務複雜度**：需要更多推理步驟的任務消耗更多 credit
- **推理深度**：深度思考模式會額外消耗 credit

幾個關鍵規則：

1. **訂閱方案不會超額計費**——額度用完就等下個週期，不會自動扣款
2. **可以購買額外 credit** 來補充額度
3. **手動切換到 GPT-5.4 mini** 可以延長剩餘額度的使用壽命
4. Credit 消耗在 ChatGPT 設定頁面可即時查看

這個設計避免了「用到一半突然收到高額帳單」的風險，對於預算敏感的個人開發者或小型團隊來說是重要的保障。

## 適用場景

Codex 最適合以下情境：

- **已經在 ChatGPT 生態系的使用者**：如果你已經訂閱 ChatGPT Plus 或 Pro，Codex 幾乎是零邊際成本的額外能力
- **想要內建自動模型路由的團隊**：不需要自己設計 routing logic，GPT-5.4 / mini 的自動分派開箱即用
- **ChatGPT Pro 使用者**：$200/mo 的方案提供最高性價比的 agent 額度，特別是搭配自動路由後的實際可用量
- **需要 Enterprise 整合的組織**：Slack bot、GitHub Actions、SSO 等企業功能在其他 Agent CLI 工具中較少見

不太適合的場景：需要完全本地模型、需要自訂 routing 策略、或不在 OpenAI 生態系的團隊。

## 系列文章

本文是 Agent CLI 訂閱與計費系列的一部分。完整的多工具比較與模型路由分析請參考：

**→ [Agent CLI 訂閱方案與多模型路由完整比較](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)**

## 參考資料

- [Pricing – Codex | OpenAI Developers](https://developers.openai.com/codex/pricing)
- [Introducing Codex | OpenAI](https://openai.com/index/introducing-codex/)
- [Codex | AI Coding Partner from OpenAI](https://openai.com/codex/)
- [OpenAI Codex Pricing 2026 | Get AI Perks](https://www.getaiperks.com/en/articles/codex-pricing)
- [OpenAI Codex in March 2026: What's New | LaoZhang AI](https://blog.laozhang.ai/en/posts/openai-codex-march-2026)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
