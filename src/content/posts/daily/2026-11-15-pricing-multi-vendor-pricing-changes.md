---
title: "定價追蹤｜Gemini 4 Carbon／Argon 到期日拍板 12/1 翻倍，GPT-5.6 Sol 促銷 11/30 收官無新價"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, pricing, daily, google, openai]
lang: zh-TW
description: "Google 把 Gemini 4 Carbon 與 Argon 的促銷到期日訂在 2026-12-01（input/output 雙雙翻倍），OpenAI 同一週讓 GPT-5.6 Sol 的促銷價在 11/30 到期卻還沒公布接下來的價格，兩大廠商的定價時程集中收斂到月底同一週"
tldr: "Gemini 4 Carbon／Argon 的促銷到期日拍板為 2026-12-01，期滿 input/output 雙雙翻倍（$2/$10→$4/$20）；GPT-5.6 Sol 的促銷價同樣在 11/30 到期，但 OpenAI 官方頁面只寫了到期日，沒有公布接下來的新價。"
series:
  name: "AI Pricing Watch"
  order: 36
---

> 🌏 [English version](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes-en)

## 變更摘要

兩件本站先前就追過、但當時都「有漲價機制、沒有確定日期」的促銷窗口，這週同時補上了到期日——而且都落在月底同一週。Google 在 [Gemini 4 Carbon 的 10/29 模型卡](/posts/daily/2026-10-29-model-google-gemini-4-carbon) 裡寫的是「促銷結束後倍增，到期日未公布」；現在官方定價頁與 changelog 已經把日期訂在 **2026-12-01**，Carbon 和沿用同一張促銷卡的 Argon 一起從 $2.00/$10.00 跳到 $4.00/$20.00，雙雙翻倍。同一週，OpenAI 的 GPT-5.6 Sol 促銷也從「至少跑到 11/21」這種沒有上限的下限說法，改成了明確的「到 2026-11-30 為止」——但官方只給了到期日，沒有給到期後的新價，8 月降價前的 $5.00/$30.00 舊價會不會回來，目前無法確認。兩家公司不約而同在同一週把「促銷何時結束」的不確定性，換成了「結束後多少錢」的新不確定性。(Anthropic 的 Claude Sonnet 4.5 退役日同樣是 11/30，但這件事本站已在 [10/23 報導過](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement)，這裡只作為時間點對照，不重複計入本次變動。)

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| Gemini 4 Carbon Input | $2.00/1M tokens（促銷，到期日未定） | $4.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Carbon Output | $10.00/1M tokens（促銷，到期日未定） | $20.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Input | $2.00/1M tokens（促銷） | $4.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Output | $10.00/1M tokens（促銷） | $20.00/1M tokens | ↑100% | 2026-12-01 |
| GPT-5.6 Sol Input（促銷） | $4.00/1M tokens（到期日從「至少 11/21」改為「11/30」） | 未公布 | 未知 | 2026-11-30 後 |
| GPT-5.6 Sol Output（促銷） | $20.00/1M tokens（同上） | 未公布 | 未知 | 2026-11-30 後 |

## 成本試算

**場景**：一個同時用 Gemini 4 Carbon 做資安分析、用 GPT-5.6 Sol 做一般推理的團隊，每天各跑 2,000 次任務（Carbon 平均 3,000 input + 1,000 output tokens；Sol 平均 2,000 input + 800 output tokens）

| | 11 月（現行促銷價） | 12 月（Carbon 確定新價；Sol 假設恢復 8 月前舊價 $5/$30） | 月差 |
|---|---|---|---|
| Gemini 4 Carbon 成本/月 | $960 | $1,920 | +$960（↑100%） |
| GPT-5.6 Sol 成本/月 | $1,440 | $2,040（假設性，官方未公布新價） | +$600（↑42%，假設） |
| **合計** | **$2,400/月** | **$3,960/月（含假設）** | **+$1,560（↑65%，含假設）** |

Carbon 的部分是硬數字，官方已經把 12/1 的新價寫進定價頁；Sol 的部分純屬推算——拿 OpenAI 8 月降價前的 $5.00/$30.00 當「如果促銷結束就恢復原價」的上限情境，實際新價可能更低（延長促銷）也可能沒公布前先維持 $4/$20，這裡只是提供一個抓預算上限的參考點，不是官方數字。

## 對開發者/企業的影響

### 誰受衝擊最大

把 Carbon／Argon 當主力模型、呼叫量大的團隊受衝擊最直接——100% 的漲幅沒有緩衝期,12/1 一到就整段生效,不像有些廠商會先給舊 ID 一段緩衝期才轉導新價。GPT-5.6 Sol 的情況則是另一種風險：不是確定會漲,而是「不知道會不會漲、漲多少」,這種不確定性本身就讓抓年度預算的團隊很難做決策,比起已知的漲幅反而更棘手。

### 競爭格局影響

12/1 之後的主要模型價格排名（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Claude Fable 5.2 | $8.00 | $40.00 | 11/9 剛降價兩成（見 [11/13 報導](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut)） |
| Claude Mythos 5.2 | $8.00 | $40.00 | 限定資安驗證夥伴 |
| Claude Opus 5.5 | $4.00 | $20.00 | — |
| **Gemini 4 Carbon（12/1 起）** | **$4.00** | **$20.00** | 促銷結束，與 Opus 5.5 同價但 AA Intelligence Index 分數相近 |
| **Gemini 4 Argon（12/1 起）** | **$4.00** | **$20.00** | 促銷結束，AA 分數明顯低於同價的 Opus 5.5 |
| GPT-5.6 Sol（11/30 前） | $4.00 | $20.00 | 到期後價格未知 |
| GPT-6.1 Sol | $2.00 | $10.00 | 無到期日，OpenAI 官方推薦接替 GPT-5 / o3 的目標 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |

12/1 之後，Carbon 和 Argon 的牌價會跟 Claude Opus 5.5 打平，但第三方評測站 Artificial Analysis 的 Intelligence Index 顯示，同一張 $4/$20 價格，Argon 的分數明顯落後 Opus 5.5，Carbon 則大致相當——這張促銷卡撐住的「用資安能力打出同價更高分」的優勢，在漲價後打了折扣。

### 行動建議

- 如果你在用 Gemini 4 Carbon 或 Argon：12/1 前把這次漲價算進下個月的預算，不要假設促銷會延長——Google 這次是給了明確到期日，不是前幾次那種「至少到」的下限寫法
- 如果你在用 GPT-5.6 Sol 且用量大：OpenAI 自己的 deprecations 頁面已經把 GPT-6.1 Sol（$2/$10，無到期日）列為 GPT-5／o3 的接替模型，現在就評估換過去，不要等 11/30 看新價再決定——換了至少省一半，等了可能什麼都不會變
- 如果你是用 Carbon 做資安相關工作流：12/1 之後它跟 Opus 5.5 同價，值得照本篇的競爭格局表重新跑一次 eval，確認資安能力的溢價是否還值得

## 時效提醒

⏰ **促銷到期日（Gemini 4 Carbon／Argon）**：2026-12-01。到期後 input/output 雙雙從 $2.00/$10.00 漲到 $4.00/$20.00，官方定價頁與 changelog 已經寫明新價，沒有緩衝期。

⏰ **促銷到期日（GPT-5.6 Sol）**：2026-11-30。到期後價格未定——官方模型頁只更新了到期日措辭（從「至少到 11/21」改成「到 11/30」），尚未公布接下來的新費率。

## 今日收穫

這次兩家廠商的共同動作不是「漲價」，是「把模糊的到期日變成確定的到期日」——這件事本身比漲價金額更值得記。Carbon 在 10/29 剛發布時，促銷到期是「未公布」，等於開發者完全沒辦法排預算；現在雖然確定要漲 100%，但至少知道哪天要漲，可以提前規劃。GPT-5.6 Sol 則是反過來的半步：到期日確定了，但新價還懸著,這種「只公布時間、不公布金額」的做法,其實比完全不公布更適合觀察——它代表廠商已經決定要在那天改變什麼,只是還沒決定改成什麼,這種中間狀態通常維持不了太久,值得在 11/30 前後盯緊官方頁面。

## 參考資料

- [OpenAI: API Pricing（官方定價頁，GPT-5.6 Sol 促銷到期日措辭）](https://developers.openai.com/api/docs/pricing)
- [OpenAI: Model deprecations（官方頁，GPT-6.1 Sol 列為 GPT-5／o3 接替模型）](https://developers.openai.com/api/docs/deprecations)
- [Anthropic: Model deprecations（官方頁，確認 Claude Sonnet 4.5 退役日 2026-11-30）](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Anthropic: Models overview（官方模型總覽，含現行費率對照）](https://platform.claude.com/docs/en/models/overview)
- [tokencost.app: LLM API Price Changes, November 2026: The Dec 1 Cliff（2026-11-14，彙整並附連結到 Google／OpenAI／Anthropic 官方定價與停用頁）](https://tokencost.app/blog/llm-api-price-changes-november-2026)
