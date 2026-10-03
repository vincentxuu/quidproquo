---
title: "定價追蹤｜Gemini 4 Argon 促銷價 $2/$10，promo 結束後倍增到 $4/$20，但 Google 沒給到期日"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: zh-TW
description: "Google 官方部落格確認：Gemini 4 Argon API 促銷期 input $2、output $10（USD/1M tokens），promo 結束後標準價倍增為 $4/$20，但官方沒公布促銷到期日"
tldr: "Google 於 2026-09-30 發表 Gemini 4 Argon，API 促銷價 input $2.00、output $10.00（USD/1M tokens，cached input $0.10），promo 結束後標準價倍增為 $4.00/$20.00（cached $0.20）——漲幅 100%。官方公告只在註腳寫『促銷期結束後』會調整，沒給任何到期日期，且目前僅開放給受信任資安夥伴，一般 API 存取時程未定。"
series:
  name: "AI Pricing Watch"
  order: 16
---

> 🌏 [English version](/en/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing-en)

## 變更摘要

Google 在 2026-09-30 發表 Gemini 4 Argon，官方部落格把定價寫在正文裡、卻把最關鍵的數字塞進一條註腳：促銷期 input $2、output $10（USD/1M tokens），促銷期結束後調整為 $4/$20，漲幅剛好 100%。這不是「降價公告」也不是「調漲公告」，是「上市價先打五折，之後漲回去」的標準打法——但 Google 沒有說促銷期多久，這代表現在用 Argon 規劃成本的團隊，等於是在一個沒有倒數計時的優惠期裡做預算。更特別的是，Argon 目前只透過 Fairwind Program 開放給受信任的資安防禦夥伴，一般開發者還拿不到 API，定價卻已經先公布了。

## 前後對照

| 項目 | 促銷價（現在） | 標準價（promo 結束後） | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $2.00/1M tokens | $4.00/1M tokens | ↑100% | 未公告（無到期日） |
| Output | $10.00/1M tokens | $20.00/1M tokens | ↑100% | 未公告（無到期日） |
| Cached Input（95% off input） | $0.10/1M tokens | $0.20/1M tokens | ↑100% | 未公告（無到期日） |

官方原文只有一句話：「After the introductory period expires, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply.」（促銷期結束後，將適用 $4／$20 的價格）——没有日期、没有「幾個月內」之類的範圍。對照同一天的其他發表，這跟 OpenAI 在 GPT-5.6 Sol 促銷頁上明確寫「保證至 2026-11-21」的作法完全相反（見 [09-28 定價追蹤](/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut)）。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），假設團隊現在就能用 Argon API（實際上目前僅開放資安夥伴，此處純粹試算價格落差）。

| | 促銷價 | 標準價 | 月差 |
|---|---|---|---|
| Input 成本/月 | $900 | $1,800 | $900 |
| Output 成本/月 | $1,500 | $3,000 | $1,500 |
| **合計** | **$2,400/月** | **$4,800/月** | **$2,400（↑100%）** |

如果一個團隊在促銷期簽下長期合約或把 Argon 寫進生產架構，帳單有可能在毫無預警的情況下整整翻倍——這是「無到期日促銷」跟「有到期日促銷」對預算規劃最大的差別：後者至少能排時間表，前者只能假設隨時會漲。

## 對開發者/企業的影響

### 誰最受益

目前唯一能用到促銷價的是 Fairwind Program 裡的資安防禦夥伴——這批使用者本來就是 Google 找來測試、免費或低成本導入的早期合作對象，促銷價對他們更多是象徵意義，不是真正的成本考量。等 Argon 開放給一般 API 客戶和 Google AI Ultra 訂閱者時，促銷期可能已經過了一半甚至結束，一般開發者反而最難吃到完整的促銷窗口。

### 競爭格局影響

主要模型目前的定價排名（input／output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | 最便宜的高能力模型 |
| Claude Haiku 4.5 | $1.00 | $5.00 | Anthropic 最便宜的一般用模型 |
| GPT-6 Sol | $2.00 | $10.00 | 長期標準價，無促銷期限制 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | 長期標準價，無促銷期限制 |
| **Gemini 4 Argon（促銷價）** | **$2.00** | **$10.00** | 跟 Sol／Sonnet 5.5 同價，但這是臨時價 |
| Claude Opus 5.5 | $4.00 | $20.00 | 長期標準價 |
| **Gemini 4 Argon（標準價）** | **$4.00** | **$20.00** | promo 結束後落在跟 Opus 5.5 同一個價位帶 |
| GPT-6 Astra | $10.00 | $50.00 | 最貴的旗艦模型 |
| Fable 5.1 | $10.00 | $50.00 | 最貴的旗艦模型 |

這張表最值得注意的地方：Argon 的促銷價精準卡在 Sol／Sonnet 5.5 的價位帶，標準價又精準卡在 Opus 5.5 的價位帶——Google 等於是用促銷價先讓 Argon 看起來跟中階模型同價，吸引使用者上手，實際長期價格卻是比照旗艦級的 Opus 5.5。

### 行動建議

- 如果你是 Fairwind Program 裡的資安夥伴：現在就能用促銷價，但規劃下一季預算時直接用 $4/$20 標準價試算，不要假設促銷價會撐到你的下一次結算週期
- 如果你在等 Argon 開放一般 API：先不用急著把它寫進架構設計的成本模型，等官方公布促銷到期日或你實際拿到存取權限後再算，現在算出來的數字隨時可能是錯的
- 如果你在 Sonnet 5.5／GPT-6 Sol 跟 Argon 之間選型：前兩者是確定的長期價格，Argon 促銷價雖然現在打平，但之後極可能變成兩倍貴——除非 Argon 的長文本輸出（100 萬 token）或資安能力有不可取代的理由，否則現階段不該只看促銷價做決定
- 如果你的團隊需要可預測的多年成本：把「沒有到期日的促銷價」本身當成一個風險項目寫進供應商評估，跟「有明確到期日的促銷價」分開看待

## 時效提醒

⏰ **促銷到期日**：官方未公布。Google 僅在發表文章的註腳聲明「促銷期結束後」價格調整為 $4/$20，沒有給出任何時間範圍。多家第三方分析（DataCamp、NeuralTrust、Artificial Analysis）在發表後數日內查證，均確認官方公告裡找不到到期日。現在規劃成本的團隊應該同時用促銷價和標準價各算一份預算，而不是只用促銷價。

## 今日收穫

之前看促銷定價公告，習慣性假設「促銷」就一定附帶到期日，頂多日期寫得隱晦；這次才注意到有些公告根本不給到期日，只給「promo 結束後」這種條件式的未來時間點。這種寫法對廠商更有彈性——可以隨時結束促銷而不違背任何承諾——但對規劃預算的團隊來說，等於把「這個價格能用多久」的風險完全轉嫁給客戶。看定價公告時，「有沒有到期日」本身就該是一個要主動核對的欄位，不能預設它存在。

## 參考資料

- [Google：Gemini 4 Argon: our next era of frontier intelligence](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon)
- [Yahoo Finance：Google's Gemini 4 Argon Closes the Pricing Triangle](https://finance.yahoo.com/technology/ai/articles/google-gemini-4-argon-closes-235954585.html)
- [DataCamp：Gemini 4 Argon: Features, Benchmarks, Pricing, and Access](https://www.datacamp.com/blog/gemini-4-argon)
