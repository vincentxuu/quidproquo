---
title: "定價追蹤｜Vertex AI 今天停用 Gemini 2.5 全系列，Gemini API 卻說「還沒退役」"
date: 2026-10-20
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google Cloud 在 2026-10-20 停用 Vertex AI 上的 gemini-2.5-pro／flash／flash-lite，但同一天 Gemini 開發者 API 的官方頁面仍寫「無停用日期」；最便宜的 Flash-Lite 遷移到建議替代後成本反而漲 221%。"
tldr: "Google Cloud 在 2026-10-20 停用 Vertex AI（Gemini Enterprise Agent Platform）上的 gemini-2.5-pro、gemini-2.5-flash、gemini-2.5-flash-lite，但 Gemini 開發者 API 的官方頁面同一時間仍列這三個模型「無停用日期」——呼叫入口決定你的模型還能活多久。遷移到官方建議替代後，2.5 Pro 使用者反而更省錢（input 貴 20% 但 output 降 10%），2.5 Flash 使用者成本打平，2.5 Flash-Lite 使用者則要多付超過兩倍。"
series:
  name: "AI Pricing Watch"
  order: 25
---

> 🌏 [English version](/posts/daily/2026-10-20-pricing-google-vertex-ai-gemini-2-5-sunset-en)

## 變更摘要

Google Cloud 的 Vertex AI（現稱 Gemini Enterprise Agent Platform）在 2026 年 10 月 20 日——也就是今天——正式停用 `gemini-2.5-pro`、`gemini-2.5-flash`、`gemini-2.5-flash-lite` 三個模型。但同一批模型在 Gemini 開發者 API（`ai.google.dev`）的官方停用公告頁上，寫的卻是「無停用日期」，只限制新專案不能選用、建議改用 3.x 系列。同一個模型名字，兩個官方文件給出完全不同的答案，差別只在你從哪個入口打進去。更值得注意的是成本方向並不一致：遷移到官方建議的替代模型後，2.5 Pro 使用者其實更省錢，2.5 Flash 使用者成本打平，但最便宜的 2.5 Flash-Lite 使用者遷移後成本可能暴增超過兩倍——這跟「模型退役＝官方幫你降價」的直覺完全相反。

## 前後對照

| 項目 | 舊（Vertex AI，今日停用） | 新（官方建議替代） | 變化 | 生效日 |
|---|---|---|---|---|
| Gemini 2.5 Pro Input（≤200K） | $1.25/1M tokens | Gemini 3.5 Flash：$1.50/1M tokens | ↑20% | 2026-10-20 |
| Gemini 2.5 Pro Output（≤200K） | $10.00/1M tokens | Gemini 3.5 Flash：$9.00/1M tokens | ↓10% | 2026-10-20 |
| Gemini 2.5 Flash Input | $0.30/1M tokens | Gemini 3.5 Flash-Lite：$0.30/1M tokens | 持平 | 2026-10-20 |
| Gemini 2.5 Flash Output | $2.50/1M tokens | Gemini 3.5 Flash-Lite：$2.50/1M tokens | 持平 | 2026-10-20 |
| Gemini 2.5 Flash-Lite Input | $0.10/1M tokens | Gemini 3.1 Flash-Lite：$0.25/1M tokens | ↑150% | 2026-10-20 |
| Gemini 2.5 Flash-Lite Output | $0.40/1M tokens | Gemini 3.1 Flash-Lite：$1.50/1M tokens | ↑275% | 2026-10-20 |

官方在 Vertex AI 模型生命週期頁面為每個退役模型列了不只一個替代選項：`gemini-2.5-pro` 可選 `gemini-3.8-flash` 或 `gemini-3.5-flash`；`gemini-2.5-flash` 可選 `gemini-3.8-flash` 或 `gemini-3.5-flash-lite`；`gemini-2.5-flash-lite` 可選 `gemini-3.8-flash`、`gemini-3.1-flash-lite`，或自行部署的 Gemma 4。上表選的是同一價格定位的選項，不是官方列在第一位的 `gemini-3.8-flash`——如果你把所有退役模型都無差別換成 `gemini-3.8-flash`（促銷價 $0.75/$3.75，2026-12-31 後 $1.50/$7.50），2.5 Flash 和 2.5 Flash-Lite 的成本漲幅會更誇張。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），原本跑在 Gemini 2.5 Flash-Lite 上，遷移到官方建議的同價位替代 Gemini 3.1 Flash-Lite。

| | Gemini 2.5 Flash-Lite（舊） | Gemini 3.1 Flash-Lite（新） | 月增 |
|---|---|---|---|
| Input 成本/月（450M tokens） | $45.00 | $112.50 | $67.50 |
| Output 成本/月（150M tokens） | $60.00 | $225.00 | $165.00 |
| **合計** | **$105.00/月** | **$337.50/月** | **$232.50（↑221%）** |

這張表只算到 2026-10-20 失效的強制遷移，沒算進 2.5 Flash-Lite 原本的免費額度（Gemini API 的 Flash-Lite 有每日 1,500 次免費請求，Vertex AI 的企業用量通常早就超過這個額度，所以多數生產環境感受到的是全額漲價）。反過來，如果原本跑在 Gemini 2.5 Pro 上處理同樣流量，遷移到 Gemini 3.5 Flash 之後：Input 成本從 $562.50/月漲到 $675.00/月（↑20%），但 Output 成本從 $1,500.00/月降到 $1,350.00/月（↓10%），兩者加總後幾乎打平（$2,062.50 → $2,025.00，↓1.8%）。

## 對開發者/企業的影響

### 誰最受益

把高階推理任務跑在 Gemini 2.5 Pro 上的團隊是這次停用的最大贏家——遷移到 Gemini 3.5 Flash 之後幾乎零成本變化,卻拿到一個更新、速度更快的模型世代。相對地,用 Gemini 2.5 Flash-Lite 做高量、低複雜度任務（分類、簡單擷取、客服分流）的團隊受傷最深：這一層原本就是靠「單價夠低才能大量跑」生存,強制遷移後單價直接翻倍到三倍,原本的成本模型可能整個不成立。

### 競爭格局影響

遷移後各替代模型在目前定價排名中的位置（USD/1M tokens，2026-10-19 快照）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Gemini 2.5 Flash-Lite（停用中） | $0.10 | $0.40 | 今天之後 Vertex AI 打不到 |
| **Gemini 3.1 Flash-Lite（接替選項）** | **$0.25** | **$1.50** | 目前最便宜的 Gemini 3.x 文字模型 |
| Gemini 3.5 Flash-Lite | $0.30 | $2.50 | 2.5 Flash 的同價位替代 |
| GPT-6 Luna | $0.10 | $0.50 | OpenAI 入門模型,仍比 3.1 Flash-Lite 便宜 |
| Claude Haiku 5.5 | $0.10 | $0.50 | 與 GPT-6 Luna 持平,仍比 3.1 Flash-Lite 便宜 |
| Gemini 3.5 Flash | $1.50 | $9.00 | 2.5 Pro 的同價位替代 |
| Gemini 3.8 Flash | $0.75 / $1.50 | $3.75 / $7.50 | 促銷價至 2026-12-31,之後漲價 |

這次停用之後,Google 自家入門級模型的最低價從 $0.10/$0.40（2.5 Flash-Lite）墊高到 $0.25/$1.50（3.1 Flash-Lite）,而 OpenAI 的 GPT-6 Luna 和 Anthropic 的 Claude Haiku 5.5 都還停在 $0.10/$0.50——這批退役把 Google 在超低價入門模型這個區間的優勢讓給了競爭對手。

### 行動建議

- 先查你實際呼叫的是哪個入口：如果是直接打 Gemini API（`generativelanguage.googleapis.com`),今天不會壞,但新專案已經選不到舊模型,遲早要遷移;如果是走 Vertex AI／Gemini Enterprise Agent Platform,今天起這三個模型的請求會直接失敗。
- 用 2.5 Flash-Lite 跑高量任務的團隊,遷移前先用真實流量跑一次成本試算——漲幅可能超過 2 倍,值得同時評估降低呼叫量（加大快取、合併請求）或改用開源自架模型（Gemma 4）分攤部分流量。
- 用 2.5 Pro 的團隊可以直接遷移,順便重新跑一次 eval：3.5 Flash 定位是「Flash 速度、接近 Pro 能力」,複雜任務的表現可能不完全等同原本的 Pro。
- 不要把 Gemini API 的「無停用日期」當成安全保證——infro.io 的整理指出 Gemini API 的日期是「最早可能停用日」,實際公告常常來得突然,Vertex AI 這次就是從 2026 年 6 月的「不早於 10 月 16 日」改成最終的 10 月 20 日。

## 時效提醒

⚠️ **停用日期**：2026-10-20（今天）。`gemini-2.5-pro`、`gemini-2.5-flash`、`gemini-2.5-flash-lite` 在 Vertex AI／Gemini Enterprise Agent Platform 上全面停用,過期請求直接失敗,官方表示遷移後時程「可能延長,但不會提前」。遷移指南：[Model versions and lifecycle](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)。

## 今日收穫

同一個模型 ID,Google 自己的兩份官方文件給出矛盾的答案：Vertex AI 的生命週期頁面寫「今天停用」,Gemini API 的停用公告頁同一週卻寫「無停用日期」。過去追蹤 deprecation 習慣只看「模型名字」有沒有出現在停用清單,這次提醒要多問一句「我打的是哪個入口」——同一份模型卡在不同雲端介面上可能活在完全不同的時間軸。更意外的是成本方向：直覺上「被強迫遷移」應該伴隨降價安慰,但這次只有 Pro 層級拿到降價,最依賴低單價才能跑量的 Flash-Lite 層級反而漲了 221%,說明「退役」不等於「平價」,每一層都要分開算。

## 參考資料

- [Model versions and lifecycle | Gemini Enterprise Agent Platform（官方：Vertex AI 停用日期 2026-10-20，含替代模型對照表）](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions)
- [Gemini deprecations | Gemini API（官方：gemini-2.5-pro／flash／flash-lite「No shutdown date announced」）](https://ai.google.dev/gemini-api/docs/deprecations)
- [Gemini Developer API pricing（官方：2.5 Pro／Flash／Flash-Lite 與 3.x 系列定價）](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini 2.5 on Vertex AI Retires October 20: What to Switch To (and What It Costs) | Medium](https://medium.com/@shtse8/gemini-2-5-on-vertex-ai-retires-october-20-what-to-switch-to-and-what-it-costs-b56dd29479bd)
- [Vertex AI Shutdowns This Week: Gemini 2.5 on October 20, 16 Open Models on October 21 | DevelopersDigest](https://www.developersdigest.tech/blog/vertex-ai-shutdowns-october-2026)
- [AI model deprecation calendar: OpenAI, Anthropic, Google | INFRO（Gemini API 與 Vertex AI 日期口徑差異的整理）](https://infro.io/blog/ai-model-deprecation-calendar)
