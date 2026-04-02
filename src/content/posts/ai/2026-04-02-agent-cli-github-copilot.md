---
title: "GitHub Copilot 完整方案分析：從免費到企業級的五層定價策略"
date: 2026-04-02
category: ai
tags: [agent-cli, github-copilot, pricing, premium-requests, agent-mode]
lang: zh-TW
tldr: "GitHub Copilot 五層定價（Free/$10/$39/$19/$39），Premium Requests 是核心貨幣，Agent Mode 讓 AI 自主多步驟編輯，Coding Agent 可將 Issue 直接轉為 PR。"
description: "深入分析 GitHub Copilot 2026 年的五層定價、Premium Requests 機制、Agent Mode、Coding Agent、多模型支援等核心功能。"
draft: false
---

GitHub Copilot 從 2021 年的「自動補全外掛」，演變成 2026 年的**完整 AI 開發平台**。它不再只是 VS Code 裡的 Tab 鍵——而是涵蓋聊天、Agent Mode、Coding Agent、Code Review 的全方位方案。

這篇從定價結構開始，逐一拆解每個核心功能，幫你判斷它是否適合你的工作流程。

> 本文是 [Agent CLI 訂閱方案與多模型路由全攻略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing/) 的子篇。

## 五層定價方案

GitHub Copilot 目前提供五個層級，從個人免費版到企業級全覆蓋：

| 方案 | 月費 | Premium Requests | 目標用戶 | 重點差異 |
|------|------|-----------------|----------|----------|
| **Free** | $0 | 50 次/月 | 學生、個人嘗鮮 | 基本聊天與補全 |
| **Pro** | $10/user | 300 次/月 | 個人開發者 | 完整功能基線 |
| **Pro+** | $39/user | 1,500 次/月 | 重度用戶 | 全部前沿模型（Opus 4.6、o3） |
| **Business** | $19/user | 300 次/月 | 團隊與組織 | 組織管理、政策控管 |
| **Enterprise** | $39/user | 1,000 次/月 | 大型企業 | 需搭配 GH Enterprise Cloud（$21/user），實際成本 **$60/user/月** |

幾個關鍵觀察：

- **Free 方案是真正可用的**：50 次 Premium Requests 對輕度使用者足夠完成日常查詢。
- **Pro 是性價比甜蜜點**：$10/月拿到 300 次 Premium Requests，平均 $0.033/次。
- **Pro+ 鎖定模型愛好者**：唯一能用 Opus 4.6、o3 等全部前沿模型的個人方案。
- **Enterprise 的隱藏成本**：表面 $39，但必須搭配 GitHub Enterprise Cloud 的 $21/user/月，總計 $60。這是選型時最常被忽略的數字。

## Premium Requests 機制

Premium Requests 是 Copilot 的**核心計費貨幣**。理解它的運作方式，直接影響你能用多少、用多好。

### 基本規則

- 每月 1 號重置，**未用完的額度不累積**。
- 超額使用按 **$0.04/次** 計費（需啟用 overage）。
- 不同模型消耗不同數量的 Premium Requests。

### 模型與消耗對照

| 模型 | 消耗倍率 | 說明 |
|------|---------|------|
| GPT-4.1、Sonnet 4.6 | 1x | 標準消耗 |
| Gemini 2.5 Flash | 0.25x | 4 次呼叫 = 1 Premium Request |
| GPT-4.5 | ~50x | 一次呼叫 ≈ 50 Premium Requests |
| Opus 4.6、o3 | 高倍率 | 僅 Pro+ 可用，消耗較高 |

這意味著：**選對模型可以把額度用得更久**。日常簡單問答用 Gemini Flash，複雜架構設計才用高倍率模型。

### Agent Mode 的計費邏輯

Agent Mode 執行多步驟任務時會自主進行工具呼叫（讀檔案、跑指令、修改程式碼）。計費規則是：

- **只有使用者發送的 prompt 計為 Premium Request**
- Agent 自主進行的工具呼叫**不額外計費**

這是非常重要的設計——它讓 Agent Mode 的成本可預測。一次複雜的多步驟任務，無論 Agent 內部迭代幾次，對你而言都是一次 Premium Request 消耗。

## 多模型支援

Copilot 是目前主流 AI 開發工具中**模型選擇最廣的**之一，支援三大家族：

| 提供商 | 可用模型 | 方案限制 |
|--------|---------|---------|
| **OpenAI** | GPT-4.1、GPT-4.5、o3 | GPT-4.5/o3 僅 Pro+ |
| **Anthropic** | Sonnet 4.6、Opus 4.6 | Opus 4.6 僅 Pro+ |
| **Google** | Gemini 2.5 Flash、Gemini 2.5 Pro | Flash 全方案可用 |

**Free 方案**可使用 Sonnet 4.6 和 GPT-4.1，這已經是相當強的基線。**Pro+** 則解鎖所有前沿模型，適合需要在不同任務間切換最佳模型的使用者。

模型切換在聊天介面中即時完成，不需要額外設定。

## Agent Mode

Agent Mode 是 Copilot 從「補全工具」轉型為「Agent」的關鍵功能，已在 **VS Code** 和 **JetBrains IDE** 上正式 GA。

### 運作方式

1. 你描述任務（例如：「把這個 REST API 從 Express 遷移到 Hono」）
2. Agent 自動判斷需要編輯哪些檔案
3. 執行終端機指令（安裝依賴、跑測試）
4. 遇到錯誤會自動迭代修正
5. 產出最終變更供你 review

### 實際體驗

- **多步驟推理**：不是一次吐完，而是邊做邊想，根據中間結果調整策略。
- **終端機整合**：可以跑 `npm install`、`pytest`、`cargo build` 等指令，根據輸出決定下一步。
- **錯誤迭代**：如果測試失敗，Agent 會讀取錯誤訊息、修改程式碼、重新測試，直到通過或達到迭代上限。

Agent Mode 消耗 Premium Requests，但如前述，只計使用者 prompt，不計工具呼叫。

## Coding Agent

Coding Agent 是 Agent Mode 的**非同步版本**——你不需要盯著它做。

### 工作流程

1. 在 GitHub Issue 中指派 Copilot 作為 assignee
2. Copilot 在背景環境中自主工作
3. 完成後自動開啟 Pull Request
4. 你 review PR、合併或要求修改

### 資源消耗

- 消耗 **GitHub Actions minutes**（執行環境）
- 每個 session 消耗 **1 次 Premium Request**
- 適合明確定義的、中小規模任務（修 bug、加測試、重構函式）

### 限制

Coding Agent 目前最適合範圍清晰的任務。對於模糊需求或需要大量架構決策的任務，仍然建議使用互動式 Agent Mode。

## Agentic Code Review

2026 年 3 月推出的 Agentic Code Review 功能，讓 Copilot 不只是標記問題，而是**主動理解整個專案脈絡**後給出建議。

核心能力：

- **蒐集專案上下文**：不只看 diff，還會讀取相關檔案、了解架構。
- **具體建議修改**：不只說「這裡有問題」，而是直接建議程式碼變更。
- **自動產生修復 PR**：對於明確的修正，可以直接生成修復 PR。

這讓 code review 的效率大幅提升——特別是在大型團隊中，reviewer 不一定熟悉每個模組的上下文。

## 適用場景分析

### 最適合使用 Copilot 的情境

| 情境 | 原因 |
|------|------|
| **已深度使用 GitHub 生態系** | Issue → Coding Agent → PR → Code Review 全鏈路整合 |
| **需要多 IDE 支援** | VS Code、JetBrains、Neovim、Xcode 都有支援 |
| **預算敏感** | Free 方案即可開始，$10/月就有完整功能 |
| **團隊協作** | Business/Enterprise 方案提供組織管理與政策控管 |

### 需要考慮的限制

- **CLI 體驗較弱**：Copilot 的主力場景是 IDE 內，純終端機使用體驗不如 Claude Code 或 Codex CLI。
- **Enterprise 成本較高**：$60/user/月的實際成本在大規模部署時需要仔細評估 ROI。
- **模型選擇綁定方案**：想用最強模型必須升級到 Pro+（$39/月），而 Claude Code 只要有 API key 就能用任何模型。

### $10/月的安全網

Pro 方案的定位很明確：**用最低的成本拿到最完整的功能集**。300 次 Premium Requests 對大多數開發者的日常工作足夠，超額也只需 $0.04/次，不會出現意外帳單爆炸的情況。

如果你不確定自己需要哪個 AI 開發工具，Copilot Pro 是風險最低的起點。

## 系列文章

本文是 Agent CLI 訂閱方案系列的一部分。完整比較請見主文：

**→ [Agent CLI 訂閱方案與多模型路由全攻略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing/)**
