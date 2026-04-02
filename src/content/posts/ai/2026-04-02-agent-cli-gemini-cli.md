---
title: "Gemini CLI 完整方案分析：業界最慷慨免費額度的終端 Agent"
date: 2026-04-02
category: ai
tags: [agent-cli, gemini-cli, google, pricing, free-tier, terminal-agent]
lang: zh-TW
tldr: "Gemini CLI 免費提供 60 req/min、1,000 req/day，含 Gemini 2.5 Pro 和 1M token context window。Google 開源專案，多數開發者完全不需要付費。"
description: "深入分析 Google Gemini CLI 的免費額度、三種認證方式、付費方案、核心功能與適用場景。"
draft: false
---

Gemini CLI 是 Google 推出的開源終端機 AI coding agent，原始碼在 [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)。它把 Gemini 模型直接帶進你的 terminal，而且核心賣點非常直接：**大多數開發者完全不需要付費**。

這篇拆解 Gemini CLI 的免費額度設計、三種認證方式、付費方案、核心功能，以及 2026 年的重要更新。

## 產品定位

Gemini CLI 是 Google 對「終端 Agent」賽道的回應。和 Claude Code、GitHub Copilot CLI 不同，它從第一天就是**開源專案**，任何人都可以 fork、修改、貢獻。背後是 Google 的 Gemini 模型家族，原生整合 Google Search 和 Vertex AI 生態系。

定位上，它瞄準的是**希望在終端裡用 AI 完成開發任務、但不想為此付月費**的開發者。Google 的策略很明確：用極度慷慨的免費額度把人拉進來，讓 Gemini 生態成為預設選擇。

## 免費額度：核心賣點

Gemini CLI 的免費額度設計是業界最激進的。只需要一個 Google 帳號，你就能獲得：

| 項目 | 免費額度 |
|------|----------|
| **請求頻率** | 60 requests / min |
| **每日上限** | 1,000 requests / day |
| **模型** | Gemini 2.5 Pro |
| **Context Window** | 1,000,000 tokens |
| **多模態** | 完整支援（圖片、程式碼、文件） |
| **Web Search** | 內建 Google Search grounding |
| **內建工具** | 全部功能，無刪減 |

Google 怎麼定出這個數字？他們分析了內部開發者的實際使用數據，找出**使用量最高的開發者**的消耗量，然後把免費上限設定在那個數字的 **2 倍**。換句話說，即使是 Google 內部最重度的開發者，免費額度也綽綽有餘。

這個策略的意思很清楚：**絕大多數開發者永遠不會碰到付費牆**。你拿到的不是閹割版，而是包含最強模型（2.5 Pro）、最大 context window（1M tokens）、所有核心功能的完整版本。

## 三種認證方式

Gemini CLI 支援三種認證路線，對應不同的使用情境和計費方式：

| 認證方式 | 費用 | 模型 | Context Window | 適用場景 |
|----------|------|------|----------------|----------|
| **Google Account**（Gemini Code Assist for Individuals） | 免費 | Gemini 2.5 Pro | 1M tokens | 個人開發者日常使用 |
| **Gemini API Key**（免費層） | 免費 | Flash 模型限定 | 依方案 | 程式化呼叫、CI/CD |
| **Vertex AI**（Express Mode） | 免費（無需設定帳單） | 依配額 | 依方案 | GCP 生態整合 |

三條路線的關鍵差異：

- **Google Account** 是最推薦的路線。登入 Google 帳號即可，自動獲得上面列的完整免費額度，模型家族由系統自動選擇（預設導向 2.5 Pro）。
- **Gemini API Key（免費層）** 只能用 Flash 模型，不包含 Pro。適合需要程式化存取但不想走 Google 帳號認證的場景。
- **Vertex AI Express Mode** 不需要設定 Google Cloud 帳單，適合已經在 GCP 生態裡的團隊做快速測試。

## 付費方案

當免費額度不夠用時（雖然大多數人不會碰到這個情況），Gemini CLI 有以下付費選項：

| 方案 | 費用 | 說明 |
|------|------|------|
| **Google AI Pro** | $19.99/mo | 1 個月免費試用，提升用量上限 |
| **AI Ultra** | $124.99 / 3 個月（約 $42/mo） | 最高額度，重度使用者方案 |
| **Workspace（Gemini Code Assist Subscription）** | 透過 Google Cloud 訂閱 | 企業團隊方案，含管理功能 |
| **Pay-as-you-go** | API Key 或 Vertex AI 按量計費 | 按 token 計價，無上限 |

**注意**：Google AI Plus（消費者訂閱方案）目前**不適用**於 CLI 的 API 用量。如果你已經訂閱了 Google AI Plus，那個額度不會帶到 Gemini CLI 上。這是一個常見的混淆點。

Pay-as-you-go 路線適合需要在 CI/CD 或自動化流程中大量呼叫 Gemini 的場景。沒有每日上限，純粹按 token 計費。

## 核心功能

Gemini CLI 的功能集涵蓋了終端 Agent 的主要需求：

- **1M Token Context Window**——這是目前所有 Agent CLI 中最大的上下文視窗。對大型 monorepo 來說特別有價值，可以一次載入整個模組的程式碼進行分析。
- **多模態能力**——支援圖片輸入，可以截圖丟給它分析 UI、閱讀圖表、理解設計稿。
- **Google Search Grounding**——內建 Google Search，agent 可以即時搜尋網路資訊來輔助回答。不需要額外設定或付費。
- **檔案操作**——讀取、建立、修改檔案，執行 shell 指令。標準的 Agent 工具組。
- **程式碼分析**——理解程式碼結構、追蹤 call graph、識別 pattern。
- **專案管理工具**——任務追蹤、進度管理等內建工具。
- **Session 管理**——對話歷史持久化，可以在不同 session 之間切換。

其中 1M context window 是最大的差異化優勢。Claude Code 的 Opus 雖然推理更深，但 context window 小得多。在需要同時理解大量檔案的場景中，Gemini CLI 的大上下文是不可取代的。

## 2026 年重要更新

幾個需要注意的 2026 年變動：

- **2026 年 3 月：預付帳單制變更**——Google Cloud 的帳單機制調整為預付制，影響 Vertex AI 路線的付費用戶。如果你走 Google Account 免費額度，不受影響。
- **2026 年 6 月 1 日：Gemini 2.0 Flash-Lite 停用**——如果你的工作流程依賴 Flash-Lite 模型，需要在這之前遷移。建議改用 Flash 或 2.5 Pro。
- **免費額度綁定 Google Cloud Project**——免費上限目前是綁在 Google Cloud project 層級，不是個人 API key 層級。這表示同一個 project 下的所有 key 共享額度。

## 適用場景

Gemini CLI 特別適合以下開發者：

- **想要免費高品質 CLI Agent 的人**——免費額度涵蓋 2.5 Pro 和完整功能，對大多數個人開發者來說足夠。不需要信用卡，不需要訂閱，登入 Google 帳號就能用。
- **大型 Monorepo 開發者**——1M token context window 讓你可以一次載入大量程式碼。如果你的專案動輒數十萬行，這個 context 大小是真正的生產力差異。
- **Google / GCP 生態系用戶**——已經在 Google Cloud 上的團隊可以無縫整合 Vertex AI，權限管理和計費都走既有的 GCP 架構。
- **重視開源的開發者**——完整開源、可以 fork 和客製化。相比 Claude Code 或 Copilot CLI 的閉源模式，這對某些團隊是決定性的因素。

如果你需要的是最深的推理能力（複雜架構設計、多步驟 debug），Claude Code 的 Opus 仍然是更好的選擇。但如果你的主要需求是「免費、夠好、context 夠大」，Gemini CLI 目前無人能出其右。

## 系列文章

這篇是 Agent CLI 系列的一部分。關於多模型路由和訂閱方案的跨工具比較，請參考：

**→ [Agent CLI 訂閱方案與多模型路由策略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing/)**

## 參考資料

- [Gemini CLI | GitHub](https://github.com/google-gemini/gemini-cli)
- [Gemini CLI: Quotas and Pricing](https://google-gemini.github.io/gemini-cli/docs/quota-and-pricing.html)
- [Gemini Developer API Pricing | Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Set up your coding assistant with Gemini MCP and Skills | Google AI](https://ai.google.dev/gemini-api/docs/coding-agents)
- [Gemini Pricing in 2026 for Individuals, Orgs & Developers | Finout](https://www.finout.io/blog/gemini-pricing-in-2026)
