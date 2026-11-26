---
title: "定價追蹤｜OpenAI 12/23 停用 GPT-5.6 Sol／Terra，Codex 遷到 GPT-6.2 Sol 直接省一半"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 官方 X 帳號公告：GPT-5.6 Sol 將於 2026-12-23 從 ChatGPT Chat／Work／Codex 停用，GPT-5.6 Terra 同日退出 Work／Codex；官方 API deprecations 頁面目前還沒列入這兩個模型 ID"
tldr: "OpenAI 官方 X 帳號宣布 GPT-5.6 Sol／Terra 將於 2026-12-23 從 ChatGPT Chat／Work／Codex 停用，建議遷到 11/17 上線的 GPT-6.2 Sol——同規格 input/output 牌價直接砍半（$4/$20 → $2/$10）。但 GPT-5.6 Terra 沒有被指定替代模型，且官方 API deprecations 頁面目前還沒把這兩個 ID 列進停用清單。"
series:
  name: "AI Pricing Watch"
  order: 41
---

> :globe: [English version](/posts/daily/2026-11-26-pricing-openai-gpt-5-6-sol-terra-retirement-en)

## 變更摘要

OpenAI 官方 ChatGPT X 帳號在 11/23 發了一則用詞輕鬆、內容很硬的公告：「每個模型都有自己的全盛期，GPT-5.6 的全盛期到了。12/23 起，我們會在 Chat 停用 GPT-5.6 Sol，在 Work 和 Codex 停用 GPT-5.6 Sol 和 Terra。」同一則貼文把兩件事綁在一起——GPT-6.2 Sol 擴大上線到 ChatGPT 的 Chat 分頁（之前只在 Work 和 Codex，11/17 上線），以及 GPT-5.6 這一代兩個模型的明確退役日。對照官方定價頁，GPT-6.2 Sol 的牌價（$2/$10，USD/1M tokens）只有 GPT-5.6 Sol 現行促銷價（$4/$20）的一半，等於「退役公告」同時也是「降價公告」——但只對 Sol 成立，Terra 這次完全沒有被指定接替對象。更值得注意的是，這則退役日只出現在產品端的官方貼文，查了一次 [OpenAI 官方 API deprecations 頁面](https://developers.openai.com/api/docs/deprecations)，`gpt-5.6-sol`／`gpt-5.6-terra` 目前都還沒被列進停用清單——如果你是直接呼叫 API（不是用 ChatGPT 介面），這份公告對你是否生效，目前沒有官方文件可以確認。

```diagram
title: GPT-5.6 Sol／Terra 退役時程
desc: GPT-6.2 Sol 11/17 先上線 Work／Codex，11/23 擴大到 Chat 並同時公告 12/23 退役 GPT-5.6 Sol／Terra；11/30 是 GPT-5.6 Sol 促銷價原本的到期日，落在公告之後、退役之前。
caption: 日期以 2026 年為準，比例尺：1 天 ≈ 14.17px，起點 11/17（x=90）。
step: 11/17 GPT-6.2 Sol 上線 Work／Codex
step: 11/23 GPT-6.2 Sol 擴大到 Chat；同時公告 12/23 停用 GPT-5.6 Sol／Terra
step: 11/30 GPT-5.6 Sol 促銷價原定到期日（官方未公布促銷後新價）
step: 12/23 GPT-5.6 Sol／Terra 全面停用（Chat／Work／Codex）
---
<svg viewBox="0 0 700 320">
  <path class="dg-axis" d="M90 170H600"/>

  <rect class="dg-band" x="175" y="286" width="425" height="24"/>
  <text class="dg-small" x="387" y="298" text-anchor="middle" dominant-baseline="central">公告後 30 天通知期</text>

  <g data-step="1">
    <line class="dg-rule" x1="90" y1="122" x2="90" y2="164"/>
    <circle class="dg-dot" cx="90" cy="170" r="4"/>
    <text class="dg-label" x="90" y="86" text-anchor="middle" dominant-baseline="central">GPT-6.2 Sol 上線</text>
    <text class="dg-sub" x="90" y="108" text-anchor="middle" dominant-baseline="central">11/17・Work／Codex</text>
  </g>
  <g data-step="2">
    <line class="dg-rule" x1="175" y1="176" x2="175" y2="218"/>
    <circle class="dg-dot dg-dot--accent" cx="175" cy="170" r="6"/>
    <text class="dg-label dg-text--accent" x="175" y="232" text-anchor="middle" dominant-baseline="central">擴大到 Chat</text>
    <text class="dg-sub" x="175" y="254" text-anchor="middle" dominant-baseline="central">11/23・同時公告 12/23 退役</text>
  </g>
  <g data-step="3">
    <line class="dg-rule" x1="274" y1="122" x2="274" y2="164"/>
    <circle class="dg-dot" cx="274" cy="170" r="4"/>
    <text class="dg-label" x="274" y="86" text-anchor="middle" dominant-baseline="central">Sol 促銷價到期</text>
    <text class="dg-sub" x="274" y="108" text-anchor="middle" dominant-baseline="central">11/30・官方未公布新價</text>
  </g>
  <g data-step="4">
    <line class="dg-rule" x1="600" y1="176" x2="600" y2="218"/>
    <circle class="dg-dot dg-dot--accent" cx="600" cy="170" r="6"/>
    <text class="dg-label dg-text--accent" x="600" y="232" text-anchor="middle" dominant-baseline="central">全面停用</text>
    <text class="dg-sub" x="600" y="254" text-anchor="middle" dominant-baseline="central">12/23・Chat／Work／Codex</text>
  </g>
</svg>
```

## 前後對照

| 項目 | 舊（12/23 前） | 新（建議遷移對象） | 變化 | 生效日 |
|---|---|---|---|---|
| GPT-5.6 Sol Input | $4.00/1M tokens（促銷價） | GPT-6.2 Sol：$2.00/1M tokens | ↓50% | 2026-12-23 |
| GPT-5.6 Sol Output | $20.00/1M tokens（促銷價） | GPT-6.2 Sol：$10.00/1M tokens | ↓50% | 2026-12-23 |
| GPT-5.6 Sol Cached Input | $0.40/1M tokens | GPT-6.2 Sol：$0.10/1M tokens | ↓75% | 2026-12-23 |
| GPT-5.6 Terra Input | $2.00/1M tokens | 官方未指定替代模型 | — | 2026-12-23 |
| GPT-5.6 Terra Output | $12.00/1M tokens | 官方未指定替代模型 | — | 2026-12-23 |

官方 [API Pricing 頁](https://developers.openai.com/api/docs/pricing) 在 `gpt-5.6-sol` 這行底下特別註記「GPT-5.6 Sol's promotional pricing is available until November 30, 2026」——這個促銷到期日本站在 [11/15 的報導](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes) 裡就提過，當時官方只給到期日、沒給促銷後的新價。現在退役日（12/23）直接蓋過了這個問題：促銷到期後的 23 天裡，模型的新標準價可能根本不會公布，因為整個模型快要消失了。

## 成本試算

**場景**：一個用 Codex 跑 GPT-5.6 Sol 做程式碼生成與審查的團隊，每天 2,000 次請求（平均 3,000 input tokens + 1,000 output tokens），30 天計。

| | GPT-5.6 Sol（現行促銷價） | GPT-6.2 Sol（遷移後） | 月省 |
|---|---|---|---|
| Input 成本/月（180M tokens） | $720.00 | $360.00 | $360.00 |
| Output 成本/月（60M tokens） | $1,200.00 | $600.00 | $600.00 |
| **合計** | **$1,920.00/月** | **$960.00/月** | **$960.00（↓50%）** |

這張試算故意用促銷價當基準而不是假設中的「標準價」——因為官方從沒公布 GPT-5.6 Sol 的標準價會是多少。換句話說，不管 11/30 之後 GPT-5.6 Sol 會不會先漲價一段再退役，現在就把 model string 換成 `gpt-6.2-sol`，都是穩賺 50% 的動作，不需要等任何不確定的中間價格公告。

## 對開發者/企業的影響

### 誰最受益

把 Codex 或 ChatGPT Work 當生產工具、呼叫 GPT-5.6 Sol 的開發團隊受益最直接——這次是官方主動把退役和降價綁在一起公告，不像 11/16 報導的 GPT-5／o3 停用那次，mini 層換代反而漲價 150%-300%。只要能接受遷移測試的成本，Sol 層這次沒有「換代等於漲價」的陷阱。

### 競爭格局影響

遷移後主要「中階」模型的價格排名（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6.1 Terra | $1.00 | $5.00 | 現行 Terra 層，非這次公告指定的替代對象 |
| **GPT-6.2 Sol（遷移後）** | **$2.00** | **$10.00** | GPT-5.6 Sol 的建議替代，與 Claude Sonnet 5.5 同價 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |
| GPT-5.6 Terra（現行，將退役） | $2.00 | $12.00 | Input 跟 Sol 同價帶，Output 卡在 Sol 和 Terra 之間，沒有乾淨的對應層 |

GPT-5.6 Terra 退役後最尷尬的地方正是這張表——它的 input 卡在 Sol 的價位，output 又比 Sol 便宜、比 Terra 貴，不上不下。這也可能是官方這次沒有直接指定它的替代模型的原因：現有的 GPT-6.1 Terra 或 GPT-6 Luna 都跟它的定位不完全對齊。

### 行動建議

- 如果你在用 Codex／ChatGPT Work 跑 GPT-5.6 Sol：現在就可以把 model string 換成 `gpt-6.2-sol`，省一半又不用等到 12/23 被迫切換，先用自己的任務跑一輪回歸測試
- 如果你在用 GPT-5.6 Terra：不要自動假設官方會延用 `gpt-6.1-terra` 或 `gpt-6-luna` 當替代——官方這次沒指定，先用兩個候選各跑一次你自己的 eval，看哪個在品質和價格的折衷點比較接近現在的 Terra
- 如果你是透過原始 API（不是 ChatGPT 介面）呼叫 `gpt-5.6-sol`／`gpt-5.6-terra`：先查一次 [官方 deprecations 頁面](https://developers.openai.com/api/docs/deprecations) 確認這兩個模型 ID 有沒有被列入——截稿前還沒有，代表這份公告的範圍可能只限 ChatGPT 產品介面，不代表原始 API 呼叫一定會同時失效

## 時效提醒（如有促銷/sunset）

:warning: **停用日期**：2026-12-23。GPT-5.6 Sol 將從 ChatGPT Chat、Work、Codex 三個介面停用；GPT-5.6 Terra 將從 Work、Codex 停用。官方貼文沒有提供額外的遷移指南連結，也沒有說明對原始 API 呼叫的影響範圍。

## 今日收穫

這次公告最有意思的地方不是「降價」或「漲價」，是退役日和促銷到期日的時間差：促銷到期日（11/30）排在退役公告之後、退役日（12/23）之前，等於夾在中間——如果你只盯著「促銷到期後會漲多少」，會一直等不到答案，因為官方根本不打算在那個時間點公布新標準價,模型直接在 23 天後整個消失。追蹤定價變動久了會發現,「這次公告解決了什麼問題」比「這次公告公布了什麼數字」更重要——這次解決的是本站 11/15 報導裡那個懸而未決的「促銷後新價是多少」,答案不是一個數字,是「這個問題不會再有意義」。另外官方產品公告和 API deprecations 頁面不同步，也是看公告時該主動核對的一個欄位，不能假設兩邊永遠一致。

## 參考資料

- [ChatGPT 官方 X 貼文（原始公告，12/23 停用 GPT-5.6 Sol／Terra）](https://x.com/ChatGPT/status/2124981905380569283)
- [9to5Mac：ChatGPT expands GPT-6.2 Sol as OpenAI sets retirement date for two models](https://9to5mac.com/2026/11/23/chatgpt-expands-gpt-6-2-sol-as-openai-sets-retirement-date-for-two-models/)
- [OpenAI：API Pricing（官方定價頁，GPT-5.6 Sol／Terra／GPT-6.2 Sol 現行費率與促銷註記）](https://developers.openai.com/api/docs/pricing)
- [OpenAI：Deprecations（官方 API 停用清單，查證時尚未列入 gpt-5.6-sol／gpt-5.6-terra）](https://developers.openai.com/api/docs/deprecations)
- [本系列 11/15：Gemini 4 Carbon／Argon 到期日拍板，GPT-5.6 Sol 促銷 11/30 收官無新價](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes)
- [本系列 11/16：OpenAI 12/11 停用 GPT-5／o3 全系列](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown)
