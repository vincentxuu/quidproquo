---
title: "微軟 AB-620 備考路徑：Copilot Studio 這條低程式碼的 agent 線"
date: 2026-08-18
type: guide
category: ai
tags: [certification, azure, copilot-studio, agents, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 6
tldr: "AB-620 是微軟 agent 認證線裡的低程式碼那條——考的是 Copilot Studio 上的 agent flows、adaptive cards、computer use、MCP tools、A2A 與 Fabric data agent，不是寫 Python。三塊權重 30-35 / 40-45 / 20-25，最重的是整合與擴充。官方規格：$165、120 分鐘、及格 700、效期一年、13 種語言含繁體中文，是微軟三張 agent 證照裡唯一有在地化的。已經 GA，但練習測驗還沒開放。"
description: "微軟 AB-620（AI Agent Builder Associate）備考指南，依官方 study guide 的三塊技能權重拆解 Copilot Studio 的 agent 建置、企業系統整合與 ALM，附五週時程換算依據、與 AI-103 及 AB-100 的分工，以及一年效期與免費續期規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)，所有「怎麼準備」都指回微軟官方訓練，不含考古題。查證日期：2026-08-18。

微軟現在有三張 agent 相關認證，AB-620 是其中**唯一不要求你寫 Python 的那張**。它的戰場在 Copilot Studio：agent flows、adaptive cards、computer use、MCP tools、A2A 協定、Fabric data agent。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

官方認證頁對考生的描述是「professional developer or advanced builder」，並列出你**該熟悉**的東西：Power Fx、Microsoft Dataverse、Power Platform 環境與元件、Microsoft 365 Copilot、Microsoft Foundry、adaptive cards；生成式 AI 概念要到中階，含**模型、編排、RAG、MCP、A2A 協定**；還要有 prompt engineering 與 REST API 整合經驗。

同一頁也直接列出「你會做的事」：把 agent 接上 Foundry、MCP server、自訂 connector、API、Microsoft Fabric，以及用 **computer use** 自動化任務。

**適合**：在 Copilot Studio 上做企業 agent 的開發者、顧問、ISV 夥伴。**特別適合台灣讀者的一點**：這張有繁體中文，而且是微軟三張 agent 證照裡唯一在地化的 —— AI-500 與 AB-100 都只有英文。

**不適合**：想證明 code-first 能力的人。那條線是 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide) 與其上的 AI-500，考的是 Python、Agent Framework、LangGraph、CI/CD，跟這張幾乎不重疊。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AB-620 |
| 認證名稱 | AI Agent Builder Associate |
| 狀態 | **已 GA**（頁面已無 beta 標記） |
| 費用 | **$165 USD**（依國家或地區定價） |
| 時間 | **120 分鐘** |
| 題數 | 官方未公布 |
| 題型 | 官方不事先揭露；頁面寫「You may have interactive components to complete as part of this exam」 |
| 及格 | **700**（此數字來自 study guide，認證頁本身沒列） |
| 效期 | **1 年**（免費線上續期評量） |
| 語言 | **13 種**，含繁體中文 |
| 先修 | **無** |
| 練習測驗 | **尚未提供** —— 官方寫「usually available within 8 weeks of the exam being out of beta and generally available」 |

**練習測驗還沒開放這件事要納入計畫**：這張沒有官方模擬題可用，只能靠學習路徑的實作與 exam sandbox 熟悉介面。

## 三塊技能權重

| 技能 | 比重 |
|---|---|
| Plan and configure agent solutions | 30–35% |
| **Integrate and extend agents in Copilot Studio** | **40–45%** |
| Test and manage agents | 20–25% |

**整合那塊佔了將近一半**，這決定了準備策略：與其把時間花在規劃概念，不如把每一種整合方式實際接一次。

## 逐塊準備

### Plan and configure agent solutions（30–35%）

**官方考什麼**：規劃與企業系統整合、身分策略、通路與部署、負責任 AI 策略；評估安全與治理考量；規劃**可重用的 agent 元件**；區分內部或外部受眾的 agent 設計。

Agent flows 那半段很具體：建立 agent flow、建立 **human-in-the-loop 的 agent flow**、設定 actions 與 connectors、監控 agent flow、加入輸入輸出參數、**在 agent flow 裡做錯誤處理**。

Topics 那半段：把 agent flow 加進 topic、設定回應格式、在 topic 裡加工具、用**自訂 prompt**／**自訂知識來源**／**API 與 Send HTTP request** 設定進階回應、設定 generative answers 節點、設定 **adaptive cards**、管理變數。

**怎麼準備**：這塊是 Copilot Studio 的操作面，**照著官方學習路徑實際建一次就過半**。重點放在 human-in-the-loop 與錯誤處理 —— 這兩個是「會做 demo」與「能上線」的分界，也是官方特別列出來的。

### Integrate and extend agents in Copilot Studio（40–45%，最重）

**官方考什麼**，四個方向：

**接知識來源** —— Copilot connectors、Power Platform connectors、Azure AI Search。

**加工具** —— 設定與監控 agent 的 **computer use**、設定 **MCP tools**、用既有自訂 connector 加工具、把 REST API 加進 agent。

**多 agent 協作** —— 在 Copilot Studio 裡設計多 agent 方案、**整合 Foundry agent**、整合既有 agent、**整合 Fabric data agent**、用 **A2A 協定**建立多 agent 方案。

**與 Azure 整合** —— 用 Azure AI Search 搭 Foundry 設定 generative answers、讓自訂 prompt 使用 **Foundry model catalog**、用 **Application Insights** 監控 agent。

**怎麼準備**：這塊沒有捷徑，四個方向各接一次。**MCP tools 與 A2A 是這張最新的考點**，站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)可以補協定層的實務理解。computer use 則建議實際跑一次再看監控畫面 —— 官方把「configure **and monitor** computer use」寫成同一條技能。

### Test and manage agents（20–25%）

**官方考什麼**：建立測試集、選擇評估方法、檢視測試結果；ALM —— 建立 solution、把既有 agent 加進 solution、建立與使用 environment variables、**實作並擴充 Power Platform Pipelines**。

**怎麼準備**：這塊是 Power Platform 的傳統 ALM，跟 agent 本身關係較小。有 Power Platform 背景的人這塊幾乎不用準備；沒有的人要花時間，因為 solution 與 pipeline 的概念在 Copilot Studio 之外。

## 五週時程與換算依據

**換算方式**：官方三條學習路徑的**標示時數合計 8 小時 29 分**，但那是內容時數，不含實作與消化。以權重配比、並對最重的整合塊加倍，得到五週。

以每週 5–7 小時、共五週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 study guide + 跑 exam sandbox + [Design agent conversations and responses using topics](https://learn.microsoft.com/en-us/training/paths/design-agent-conversations-responses-topics-copilot-studio/)（2 小時 17 分，3 模組） | 沒有練習測驗，sandbox 是唯一能先熟悉介面的方式 |
| 第 2 週 | Plan and configure 剩下的部分：agent flows 與 human-in-the-loop | 這塊佔 30–35%，且是後面整合的基礎 |
| 第 3–4 週 | **Integrate and extend（40–45%）**：[多 agent 方案](https://learn.microsoft.com/en-us/training/paths/design-build-multi-agent-solutions-copilot-studio/)（2 小時 54 分）＋[企業系統整合](https://learn.microsoft.com/en-us/training/paths/integrate-agents-enterprise-systems-copilot-studio/)（3 小時 18 分） | 最重的一塊，兩週分別做「多 agent」與「外部整合」 |
| 第 5 週 | Test and manage（20–25%）+ 全面複習 | ALM 概念收尾 |

**講師課要等**：對應的講師課 [AB-620T00-A](https://learn.microsoft.com/en-us/training/courses/ab-620t00)（三天）頁面寫著「**This course will be available on 9/18/2026**」——但上面那三條學習路徑現在就能自學，不用等課。

**失敗成本**：微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)是第一次沒過等 24 小時、之後每次 14 天、12 個月內最多 5 次，每次都要付費。

## 這張在微軟三張 agent 證照裡的位置

| 證照 | 定位 | 最重的一塊 | 語言 |
|---|---|---|---|
| **AB-620**（本文） | 低程式碼建造者，Copilot Studio | 整合與擴充 40–45% | 13 種，含繁中 |
| **AI-500**（beta） | code-first 工程師，Python / Agent Framework / LangGraph | 開發 30–35% | 僅英文 |
| **AB-100** | 架構師，ROI 與跨產品治理 | 部署與治理 40–45% | 僅英文 |

**只有一條官方明訂的階梯**：AI-103 → AI-500（後者的 Certification prerequisites 寫死必須先取得前者）。**AB-620 沒有先修條件**，可以直接考。

不過 AB-620 出現在 AB-100 的「可用於此 expert 認證的 associate 證照」清單裡，暗示了 Copilot Studio 這側的路徑是 AB-620 → AB-100 —— 但官方文字**沒有把它寫成必要條件**，所以不要當成規定。

## 一年效期與續期

跟 AI-103 相同：**效期一年，續期免費**，形式是線上、非監考、開書的評量，只在到期前六個月開放，過期就得整張重考。完整規則見 [AI-103 那篇的最後一節](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)。

有一個小狀況值得知道：**AB-620 的專屬續期頁目前還不存在**（`/ai-agent-builder-associate/renew/` 回 404），只有通用的續期規則頁。這通常代表第一批持證者還沒到續期窗口，不是沒有續期路徑。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 三塊權重 | 30-35 / 40-45 / 20-25 | 每季 |
| study guide 版本 | 無「Skills measured as of」日期、無 change log | 每季 |
| 練習測驗 | **尚未提供** | 每月 |
| 專屬續期頁 | 尚未上線（404） | 每季 |
| 語言 | 13 種含繁中 | 每半年 |

## 參考資料

- [AI Agent Builder Associate 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/ai-agent-builder-associate/)
- [AB-620 官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-620)
- [微軟認證續期規則](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [考試時長與考場體驗說明](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
