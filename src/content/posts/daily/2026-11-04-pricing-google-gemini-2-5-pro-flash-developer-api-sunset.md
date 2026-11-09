---
title: "定價追蹤｜Gemini 2.5 Pro／Flash 補上 Developer API 停用日：12/1 自動轉導，帳單卻可能變便宜"
date: 2026-11-04
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google 在 2026-11-02 的 Gemini API release notes 為 gemini-2.5-pro 與 gemini-2.5-flash 補上 Developer API 停用日 2026-12-01，過期自動轉導並改按新模型計費；2.5 Pro 轉去 3.8 Flash 後，即使等到促銷結束也比原價省 13%"
tldr: "Google 在 2026-11-02 的 Gemini API release notes 補上 gemini-2.5-pro 與 gemini-2.5-flash 的 Developer API 停用日（2026-12-01），逾期自動轉導並改按新模型計費。2.5 Pro 轉去 Gemini 3.8 Flash，就算等到 3.8 Flash 促銷結束（2027-01-01 起）仍比原價省 13%；2.5 Flash 轉去 Gemini 3.5 Flash-Lite 則價格完全不變。我們在 10/20 的報導中點出 Developer API 當時對這三個模型都寫「無停用日期」，這次官方補齊了日期。"
series:
  name: "AI Pricing Watch"
  order: 32
---

> 🌏 [English version](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset-en)

## 變更摘要

我們在[10/20 的報導](/posts/daily/2026-10-20-pricing-google-vertex-ai-gemini-2-5-sunset)指出，Vertex AI 已經停用 `gemini-2.5-pro`／`gemini-2.5-flash`／`gemini-2.5-flash-lite`，但同一批模型在 Gemini 開發者 API（`ai.google.dev`）的[官方停用公告頁](https://ai.google.dev/gemini-api/docs/deprecations)上仍寫「無停用日期」。兩週後的 2026-11-02，Google 在 Gemini API release notes 裡把這個缺口補上了：`gemini-2.5-pro` 與 `gemini-2.5-flash` 的 Developer API 停用日定在 2026 年 12 月 1 日，過期後不是直接關閉端點，而是自動把請求轉導到新模型並按新模型的費率計費——`gemini-2.5-pro` 轉去 `gemini-3.8-flash`，`gemini-2.5-flash` 轉去 `gemini-3.5-flash-lite`。`gemini-2.5-flash-lite` 不受影響，官方寫「無停用日期，持續可用至另行通知」。這次轉導最反直覺的地方是方向：2.5 Pro 使用者被轉去的 3.8 Flash，就算等到 3.8 Flash 自己的促銷期在 2027 年 1 月 1 日結束，標準價仍然比原本的 2.5 Pro 便宜；2.5 Flash 使用者轉去 3.5 Flash-Lite 則是價格一分不差地照搬。「停用」這次沒有變成漲價事件。

## 前後對照

| 項目 | 舊（gemini-2.5-pro 標準價） | 新（轉導至 gemini-3.8-flash，2026-12-01～2026-12-31 促銷價） | 變化 | 生效日 |
|---|---|---|---|---|
| Input（≤200K tokens） | $1.25/1M tokens | $0.75/1M tokens | ↓40% | 2026-12-01 |
| Output（≤200K tokens） | $10.00/1M tokens | $3.75/1M tokens | ↓62.5% | 2026-12-01 |
| Input（2027-01-01 起標準價） | $1.25/1M tokens | $1.50/1M tokens | ↑20% | 2027-01-01 |
| Output（2027-01-01 起標準價） | $10.00/1M tokens | $7.50/1M tokens | ↓25% | 2027-01-01 |

| 項目 | 舊（gemini-2.5-flash） | 新（轉導至 gemini-3.5-flash-lite） | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $0.30/1M tokens | $0.30/1M tokens | 持平 | 2026-12-01 |
| Output | $2.50/1M tokens | $2.50/1M tokens | 持平 | 2026-12-01 |
| Context Caching | $0.03/1M tokens | $0.03/1M tokens | 持平 | 2026-12-01 |

轉導只對「過去曾實際呼叫過」這兩個模型的既有帳號生效——官方寫「Access through the API is limited to existing users who have actively used it in the past」，新專案在 Google AI Studio 已經選不到 2.5 Pro／2.5 Flash。官方同時提醒，3.8 Flash 和 3.5 Flash-Lite 在取樣參數、`thinking_budget`、function response 的比對規則、PDF token 計費方式上都有破壞性變更，轉導前要先讀[官方遷移指南](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8#migrate-to-gemini-3-8-flash)，不是單純換個模型名字就能無痛接軌。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），分別算原本掛在 2.5 Pro 和 2.5 Flash 上的團隊。

| | gemini-2.5-pro（原價） | 轉導至 3.8 Flash（12 月促銷價） | 轉導至 3.8 Flash（2027-01 起標準價） |
|---|---|---|---|
| Input 成本/月（450M tokens） | $562.50 | $337.50 | $675.00 |
| Output 成本/月（150M tokens） | $1,500.00 | $562.50 | $1,125.00 |
| **合計** | **$2,062.50** | **$900.00（↓56.4%）** | **$1,800.00（↓12.7%）** |

| | gemini-2.5-flash（原價） | 轉導至 3.5 Flash-Lite |
|---|---|---|
| Input 成本/月（450M tokens） | $135.00 | $135.00 |
| Output 成本/月（150M tokens） | $375.00 | $375.00 |
| **合計** | **$510.00** | **$510.00（持平）** |

2.5 Pro 的使用者即使完全不做任何成本優化，只是放著被官方自動轉導，12 月當月帳單先砍 56%，隔年 1 月促銷結束後回升，但仍比原本的 2.5 Pro 低 12.7%。對比 10/20 報導裡 Vertex AI 的 2.5 Flash-Lite 使用者遷移後成本暴增超過兩倍，這次 Developer API 的轉導方向完全相反。

## 對開發者/企業的影響

### 誰最受益

用 2.5 Pro 跑長輸出、重推理任務（長報告生成、多步驟 agent）的團隊受益最大——output 降幅（12 月 ↓62.5%、1 月後仍 ↓25%）遠大於 input，而這類任務正是 output token 佔比最高的場景。用 2.5 Flash 的團隊沒有成本變化，但因為轉導是強制的，仍要花時間跑一次 API 相容性測試，確認 `thinking_budget` 和 function calling 的行為沒有在無聲中改變輸出品質。

### 競爭格局影響

轉導後的 Gemini 模型放回主要模型定價排名（USD/1M tokens，均為標準價）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna／Claude Haiku 5.5（起） | $0.10 | $0.50 | 最便宜的高能力分層 |
| Gemini 3.5 Flash-Lite（2.5 Flash 轉入目標） | $0.30 | $2.50 | 轉導後價格不變 |
| GPT-6.1 Terra | $1.00 | $5.00 | — |
| Gemini 3.8 Flash（2026-12 促銷價，2.5 Pro 轉入目標） | $0.75 | $3.75 | 促銷至 2026-12-31 |
| **Claude Sonnet 5.5** | **$2.00** | **$10.00** | — |
| Gemini 3.8 Flash（2027-01-01 起標準價） | $1.50 | $7.50 | — |
| Claude Opus 5.5 | $4.00 | $20.00 | — |

2.5 Pro 使用者被動轉導後，不管落在哪個時間點，output 價格都還是遠低於 Claude Sonnet 5.5，這跟「被停用的模型只能換到更貴/更差的替代品」的常見劇本不同——Google 這次是用一個更新、更便宜的模型吃掉舊模型的既有使用者。

### 行動建議

- 如果你在用 `gemini-2.5-pro`：不用急著自己找替代，官方轉導後的成本本來就比原價低，但要在 12/1 前先用小流量測過 3.8 Flash 的輸出品質和 breaking change 清單，別等自動轉導當天才發現 function calling 行為變了
- 如果你在用 `gemini-2.5-flash`：成本不變，但同樣要在 12/1 前做一次相容性測試，重點看 PDF 輸入的 token 計費方式是否影響你的成本估算
- 如果你在用 `gemini-2.5-flash-lite`：這次不受影響，但別忘了它遷移到 Vertex AI 時的替代模型（10/20 報導）成本暴增超過兩倍，兩個入口的政策完全獨立，不能假設 Developer API 的寬鬆待遇也適用於 Vertex AI

## 時效提醒（如有促銷/sunset）

⚠️ **停用日期**：2026-12-01。`gemini-2.5-pro` 與 `gemini-2.5-flash` 的 API 請求將在此日起自動轉導至 `gemini-3.8-flash` 與 `gemini-3.5-flash-lite` 並改按新費率計費。遷移指南：[Gemini 3.8 Flash 遷移指南](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8#migrate-to-gemini-3-8-flash)。

## 今日收穫

10/20 報導時我們把「同一個模型，Vertex AI 和 Developer API 給出不同停用日」當成一個治理缺口在點名。兩週後 Google 補上了日期，但補上的方式顛覆了我們當時的預設——我們預期停用通常意味著要接受更貴或更差的替代品（10/20 報導裡 2.5 Flash-Lite 遷移成本就暴增超過兩倍），這次卻是「被停用的模型使用者，靜靜被轉去一個更便宜的新模型」。這提醒一件事：追蹤定價變動不能只看「漲了多少」，同一家公司同一時間的不同停用／轉導政策，方向可能完全相反，要逐個模型查，不能用上一次的結論套下一次。

## 參考資料

- [Google: Gemini deprecations（官方停用公告頁，含 gemini-2.5-pro／gemini-2.5-flash 的 2026-12-01 停用日與轉導規則）](https://ai.google.dev/gemini-api/docs/deprecations)
- [Google: Gemini Developer API pricing（官方定價頁，gemini-3.8-flash／gemini-3.5-flash-lite 現行與促銷後費率）](https://ai.google.dev/gemini-api/docs/pricing)
- [Google: What's new in Gemini 3.8（官方遷移指南與促銷到期日）](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.8)
- [Data Studios: Gemini 2.5 Pro and 2.5 Flash API reroute to 3.8 Flash and 3.5 Flash-Lite on December 1（2026-11-02 報導，確認 release notes 發布日）](https://www.datastudios.org/post/gemini-api-reroutes-gemini-2-5-pro-2-5-flash-december-1-3-8-flash-3-5-flash-lite)
- [本系列 10/20：Vertex AI 今天停用 Gemini 2.5 全系列，Gemini API 卻說「還沒退役」](/posts/daily/2026-10-20-pricing-google-vertex-ai-gemini-2-5-sunset)
- [本系列 10/17：Google 補上 Gemini 4 Argon 促銷到期日](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline)
