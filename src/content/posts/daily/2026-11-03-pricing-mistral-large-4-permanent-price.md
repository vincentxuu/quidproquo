---
title: "定價追蹤｜Mistral Large 4 促銷「到期」結果是變成永久價：$0.70／$2.10"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, pricing, daily, mistral]
lang: zh-TW
description: "Mistral 10/29 開放 Large 4 權重的同一天，把原本無到期日的促銷價直接改成正式掛牌價：input $0.70、output $2.10（USD/1M tokens），只比促銷價貴 2-3%，比官方原掛牌價 $1.36/$4.18 低了近五成"
tldr: "Mistral 在 2026-10-29 開放 Large 4 權重的同一天公告，把它從 10/6 預覽時「五折促銷、無到期日」的定價直接訂為正式掛牌價：input $0.70、cached input $0.07、output $2.10（USD/1M tokens），比促銷前的掛牌價 $1.36/$0.14/$4.18 低了 48.5%／50%／49.8%，但只比促銷價貴了 2.9%／0%／0.5%。10/10 本系列就點出這種「無到期日促銷」讓開發者承擔『帳單何時翻倍』的風險——這次 Mistral 選擇把促銷價留住，而不是讓它消失。"
series:
  name: "AI Pricing Watch"
  order: 31
---

> 🌏 [English version](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price-en)

## 變更摘要

Mistral 在 2026-10-06 公開預覽旗艦模型 Large 4 時，官方文件卡掛牌價是 input $1.36、output $4.18（USD/1M tokens），但 Studio 和 OpenRouter 上實際收費打五折：input $0.68、output $2.09，而且沒有公布促銷到期日（見[10/10 定價追蹤](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale)）。三週後的 2026-10-29，Mistral 在[開放 Large 4 權重的公告](https://mistral.ai/news/mistral-large-4-oss/)裡，用一句話把這個問題解決了：「Starting today, Mistral Large 4 is priced at $0.70 input / M, $0.07 cached input / M, and $2.10 output / M tokens.」沒有打「限時」或「促銷」的字樣——這就是正式掛牌價。換算下來新價只比原本的促銷價貴了 2-3%，等於 Mistral 選擇把五折價格永久留住，而不是讓開發者擔心的「帳單何時無預警翻倍」真的發生。這次定價調整和開放權重同一天公告，時間點本身就是訊號：一旦模型可以自己下載自架，官方 API 價格就得貼著自架的邊際成本走，不能再靠「先用促銷價把人釣進來、之後悄悄漲回原價」這種打法。

## 前後對照

| 項目 | 原掛牌價（10/6–10/28） | 促銷價（10/6–10/28，無到期日） | 新永久價（10/29 起） | 變化（對原掛牌價） | 生效日 |
|---|---|---|---|---|---|
| Input | $1.36/1M tokens | $0.68/1M tokens | $0.70/1M tokens | ↓48.5% | 2026-10-29 |
| Cached Input | $0.14/1M tokens | $0.07/1M tokens | $0.07/1M tokens | ↓50% | 2026-10-29 |
| Output | $4.18/1M tokens | $2.09/1M tokens | $2.10/1M tokens | ↓49.8% | 2026-10-29 |

新永久價跟促銷價幾乎是同一個數字：input 只貴 $0.02（+2.9%）、output 只貴 $0.01（+0.5%）、cached input 完全沒變。官方公告和文件卡目前都只列新永久價，原掛牌價 $1.36/$4.18 已經從文件卡上消失；Batch API 的價格官方仍未單獨公布，站方抓取記錄顯示目前沒有列出 Large 4 的 batch 費率。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），延用 10/10 文章的同一個場景以便直接對照。

| | 原掛牌價 | 促銷價（10/6–10/28） | 新永久價（10/29 起） | 月省（對原掛牌價） |
|---|---|---|---|---|
| Input 成本/月（450M tokens） | $612.00 | $306.00 | $315.00 | $297.00 |
| Output 成本/月（150M tokens） | $627.00 | $313.50 | $315.00 | $312.00 |
| **合計** | **$1,239.00** | **$619.50** | **$630.00** | **$609.00（↓49.1%）** |

關鍵數字是 $630.00 對 $619.50：如果 10/10 的評估期就已經在用促銷價試跑，轉成永久價之後月費只多 $10.50（+1.7%），而且從此不用再擔心「促銷結束」這件事——跟原掛牌價比，省下來的 $609/月（49.1%）是確定會留住的,不是隨時可能被收回的促銷折扣。

## 對開發者/企業的影響

### 誰最受益

10/10 當時建議「只拿促銷價做 POC、別押注長期架構」的團隊，現在可以把 Large 4 直接寫進生產成本模型——新永久價和當時的促銷價只差 1.7%，不用重新跑一次預算審核。同時因為權重已經開放（Mistral Ecosystem Open-Weight license，修改版 MIT），需要自架或資料主權考量的企業（公告裡提到的歐洲銀行 La Banque Postale 是案例）也多了「API 先試、確定要用再自架」的路徑，不用在模型還沒開源時就押注。

### 競爭格局影響

把 Large 4 的新舊價格放回同一張競爭格局表（USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Mistral Large 3（前代） | $0.50 | $1.50 | 完整開源 Apache 2.0 |
| DeepSeek V4 Pro（off-peak） | $0.66 | $1.98 | 非尖峰時段折扣價 |
| **Mistral Large 4（新永久價）** | **$0.70** | **$2.10** | 權重已開放，無到期日 |
| DeepSeek V4 Pro（peak） | $1.32 | $3.96 | 尖峰時段標準價 |
| GLM 5.3（Mistral 代管） | $1.40 | $4.40 | 同平台中國開源模型 |
| ~~Mistral Large 4（原掛牌價）~~ | ~~$1.36~~ | ~~$4.18~~ | 10/29 起已下架，文件卡不再列出 |

Large 4 從「這個價位帶裡最貴的選項」直接跳到「第二便宜」，只輸给自家的上一代 Large 3。第三方比價站 [TokenCost](https://tokencost.app/blog/mistral-large-4-open-weights-price-cut) 用 Artificial Analysis 的 Intelligence Index v5.0 重新算過單次任務成本：Large 4（medium 推理模式）和 GLM 5.3（low 模式）拿到幾乎同分（23.1），但 Large 4 便宜 10%；拉到 high／max 模式比較，GLM 5.3 多拿 5.7 分但要價 $5.01，Large 4 的 high 模式只要 $2.06。不過跳出開放權重這個圈子看，GPT-6.1 Terra 用八分之一的錢拿到多 16 分，Claude Haiku 5.5 用更低價格贏 3.6 分——Large 4 的降價縮小了跟專有模型的差距，但沒有打平。

### 行動建議

- 如果你 10 月評估期就在用促銷價試跑：不用做任何事，新永久價只比促銷價貴 1.7%，可以直接把這個數字寫進正式預算
- 如果你在評估開放權重模型要不要自架：先比 TokenCost 算出的單任務成本（$2.06 高模式 vs GLM 5.3 的 $5.01），Large 4 現在是同分數裡最便宜的選項，但要留意它的 output token 用量比 GPT-6.1 Terra 等專有模型高很多，實際帳單取決於你的任務平均輸出長度
- 如果你需要純粹比每 token 價格最低：[GPT-6.1 Terra（input $1/output $5）](https://aibusinessweekly.net/p/openai-api-pricing)和 Claude Haiku 5.5 在單任務成本上仍然領先，Large 4 的優勢是權重可自架、資料不出境

## 今日收穫

10/10 文章把「促銷打五折卻不給到期日」當成一個風險訊號：開發者等於在替廠商承擔「這個價格能撐多久」的不確定性。三週後的結果反而是正面案例——Mistral 沒有讓促銷悄悄消失讓帳單翻倍,而是直接把促銷價（只上調 2-3%）變成永久掛牌價,並且在開放模型權重的同一天公告。這揭示一個比「促銷何時到期」更值得追蹤的訊號：當一個模型即將開放權重、讀者可以自己算出自架的邊際成本時,官方 API 價格本來就得貼著那條線走,不然促銷結束後的掛牌價只是把客戶推向自架或轉單,廠商自己沒有留住生意的理由。

## 參考資料

- [Mistral: Mistral Large 4 open-weight release（官方公告，含新永久價）](https://mistral.ai/news/mistral-large-4-oss/)
- [Mistral docs: Mistral Large 4 model card](https://docs.mistral.ai/models/mistral-large-4-0)
- [TokenCost: Mistral Large 4 Price Cut, $0.70/$2.10, Open Weights（含促銷前掛牌價、成本試算）](https://tokencost.app/blog/mistral-large-4-open-weights-price-cut)
- [本系列 10/10：Mistral Large 4 促銷五折開賣，無到期日](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale)
- [AI Business Weekly: OpenAI API Pricing 2026（GPT-6.1 Terra／Sol／Luna 現行定價）](https://aibusinessweekly.net/p/openai-api-pricing)
