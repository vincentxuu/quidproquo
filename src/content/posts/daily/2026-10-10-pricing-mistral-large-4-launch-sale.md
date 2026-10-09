---
title: "定價追蹤｜Mistral Large 4 促銷五折開賣，Input $0.68、Output $2.09，無到期日"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, pricing, daily, mistral]
lang: zh-TW
description: "Mistral 10/6 公開預覽旗艦模型 Large 4，API 促銷價 input $0.68、output $2.09（USD/1M tokens），是官方掛牌價 $1.36/$4.18 的五折，官方未公布促銷到期日"
tldr: "Mistral 於 2026-10-06 公開預覽旗艦模型 Large 4（Le Chonk），官方公告與文件卡掛牌價是 input $1.36、output $4.18（USD/1M tokens，cached input $0.14），但 API 實際收費頁面直接打五折：input $0.68、output $2.09（cached $0.07），降幅剛好 50%。促銷沒有公布到期日，這是繼 09-30 Gemini 4 Argon『促銷無到期日』之後本系列第二次記錄到同一種打法。模型權重與完整授權條款要等到月底才會發布。"
series:
  name: "AI Pricing Watch"
  order: 21
---

> 🌏 [English version](/en/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale-en)

## 變更摘要

Mistral 在 2026-10-06 公開預覽新旗艦模型 Large 4 時，官方公告正文和文件卡都寫著掛牌價 input $1.36、output $4.18（USD/1M tokens），但 Mistral Studio 和 OpenRouter 上實際收費的數字是掛牌價的五折：input $0.68、output $2.09，標著「50% off」卻沒附任何到期日。這不是單一廠商的個案——09-30 發表的 Gemini 4 Argon 也是同一套打法：先用促銷價讓新模型看起來親民，但不給倒數計時，規劃預算的團隊等於是在替廠商承擔「這個價格能撐多久」的風險。對照 Large 4 本身的定位（主打資安能力、權重要等到月底才放出來），這次促銷更像是搶在開源權重發布前，先用低價把開發者引進 API 試用。

## 前後對照

| 項目 | 促銷價（現在） | 標準價（promo 結束後） | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $0.68/1M tokens | $1.36/1M tokens | ↑100% | 未公告（無到期日） |
| Output | $2.09/1M tokens | $4.18/1M tokens | ↑100% | 未公告（無到期日） |
| Cached Input（維持輸入價 10%） | $0.07/1M tokens | $0.14/1M tokens | ↑100% | 未公告（無到期日） |

官方公告正文與文件卡只標示掛牌價 $1.36/$4.18，促銷價只出現在 Mistral Studio 實際扣款的介面和 OpenRouter 的「50% off」標籤上，兩邊都沒有寫促銷期限。這跟 09-28 OpenAI 在 GPT-5.6 Sol 促銷頁上明確寫「保證至 2026-11-21」的做法正好相反（見 [09-28 定價追蹤](/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut)）。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens）。

| | 促銷價 | 標準價 | 月差 |
|---|---|---|---|
| Input 成本/月（450M tokens） | $306.00 | $612.00 | $306.00 |
| Output 成本/月（150M tokens） | $313.50 | $627.00 | $313.50 |
| **合計** | **$619.50/月** | **$1,239.00/月** | **$619.50（↑100%）** |

因為促銷是「輸入、輸出、快取」三項均一打五折，帳單結構不會因促銷結束而改變——只是整張帳單原封不動翻倍。如果團隊現在用促銷價簽長期合約或把 Large 4 寫進生產架構的成本模型，一旦促銷結束，帳單會在沒有預警的情況下直接翻倍。

## 對開發者/企業的影響

### 誰最受益

目前最適合吃到這個促銷價的是「正在評估但還沒上生產」的團隊——用促銷價先跑 POC、測試資安與法律 Agent 這類 Large 4 主打的場景，成本只有標準價的一半。但因為權重要等到月底才發布、授權條款目前連名字都沒公布，真正要把 Large 4 嵌進長期架構的團隊，現階段最多只能把它當成「API 試用」，不適合押注促銷價做正式產品定價。

### 競爭格局影響

把 Large 4 跟同屬「中階開源／開放權重」價位帶的模型放在一起比較（USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Mistral Large 3（前代） | $0.50 | $1.50 | 完整開源 Apache 2.0，已可下載權重 |
| DeepSeek V4 Pro（off-peak） | $0.66 | $1.98 | 非尖峰時段折扣價 |
| **Mistral Large 4（促銷價）** | **$0.68** | **$2.09** | 權重未發布，僅開放 API 預覽 |
| DeepSeek V4 Pro（peak） | $1.32 | $3.96 | 尖峰時段標準價 |
| **Mistral Large 4（標準價）** | **$1.36** | **$4.18** | 促銷結束後的掛牌價 |
| GLM 5.3（Mistral 代管） | $1.40 | $4.40 | 同一平台上的中國開源模型，無促銷風險 |

這張表最值得注意的地方：Large 4 的促銷價卡在 DeepSeek V4 Pro 兩個時段之間，看起來跟同級開源模型打平；但掛牌標準價一出來，就直接貴過 Mistral 自己代管的 GLM 5.3——换句話說，促銷結束後，Large 4 在這個價位帶反而失去價格優勢，只能靠資安能力這類差異化功能說服客戶留下來。

### 行動建議

- 如果你在評估 Large 4 但還沒上生產：用促銷價先跑測試沒問題，但預算規劃直接套標準價 $1.36/$4.18，不要假設促銷價會撐到正式導入的那一天
- 如果你已經在用 Mistral Large 3（Apache 2.0、權重已開放）：沒有急迫理由現在就換，Large 4 的權重和授權條款都還沒確定，等月底細節公布後再評估遷移成本
- 如果你在同價位帶選型且重視成本穩定：GLM 5.3（Mistral 代管）現在的價格已經接近 Large 4 的標準價，沒有「促銷結束就翻倍」的風險，適合需要可預測成本的團隊
- 把「促銷沒有到期日」本身當成供應商評估的一個風險項目——這是這個系列第二次記錄到同一套打法（上一次是 09-30 的 Gemini 4 Argon），值得假設它會變成業界常態，而不是個案

## 時效提醒

⏰ **促銷到期日**：官方未公布。Mistral Studio 和 OpenRouter 上的「50% off」標籤都沒有附帶期限，第三方分析站（Artificial Analysis、OpenRouter）在發表後數日內查證，也都確認找不到官方公布的到期日期。現在規劃成本的團隊應該同時用促銷價和標準價各算一份預算。

## 今日收穫

上次記錄 Gemini 4 Argon 的「無到期日促銷」時，以為是單一廠商的特例；這次 Mistral Large 4 用幾乎一樣的手法——官方公告寫掛牌價，實際扣款介面悄悄打五折、不解釋也不設期限——說明「促銷沒有到期日」正在變成新模型上市的標準打法之一，不只是巧合。對追蹤定價的人來說，看到新模型公告裡的價格數字時，第一件事應該是去查實際扣款頁面是否跟公告正文一致，而不是預設兩者永遠相同。

## 參考資料

- [Mistral 官方公告：Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4)
- [OpenRouter：Mistral Large 4 API Pricing & Providers](https://openrouter.ai/mistralai/mistral-large-4-0)
- [Artificial Analysis：Mistral Large 4 Preview - Intelligence, Performance & Price Analysis](https://artificialanalysis.ai/models/mistral-large-4)
- [本站先前記錄：Mistral Large 4 模型卡](/posts/daily/2026-10-07-model-mistral-large-4)
- [本站先前記錄：Gemini 4 Argon 促銷無到期日](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing)
