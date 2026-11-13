---
title: "融資速報｜Kalepa Series B $75M（Updata Partners 領投，等了五年才再融資的保險 AI）"
date: 2026-11-08
category: daily
type: digest
tags: [ai-agent, funding, daily, kalepa, insurance-ai]
lang: zh-TW
description: "保險核保 AI 公司 Kalepa 完成 $75M Series B，由 Updata Partners 領投，估值 $470M，距上一輪融資已隔五年且持續現金流為正"
tldr: "Kalepa 完成 $75M Series B，由 Updata Partners 領投，估值 $470M，距 2021 年的 Series A 隔了五年。這筆錢代表「AI agent 處理任務、人類專家簽核」的分工模式，在保險這種高風險監管產業裡已經被客戶的真實採購驗證。"
series:
  name: "AI Agent Funding"
  order: 128
---

> 🌏 [English version](/posts/daily/2026-11-08-funding-kalepa-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Kalepa（美國，紐約） |
| 輪次 | Series B |
| 金額 | $75M |
| 領投 | Updata Partners |
| 跟投 | IA Ventures、Inspired Capital（兩者皆為 2021 年 Series A 的既有投資人回頭加碼） |
| 估值 | $470M（上一輪 2021 年 Series A 僅 $14M，公司成立以來最大一輪） |
| 累計融資 | $91M |
| 成立年份 | 2018 |
| 員工數 | 未揭露（宣布 2027 年底前團隊規模翻倍） |

## 這家公司做什麼

Kalepa 是一家幫保險公司做核保、定價、組合管理的「專業級 AI」公司——客戶是保險公司裡的核保員（underwriter），不是消費者。

核心產品是一個協調多個 AI agent 的作業平台：有新保單提交進來時，Kalepa 自動把相關資料、風險評估、承保準則整理在同一個工作區，依任務的複雜度與風險高低決定要不要讓 AI agent 直接處理，還是轉交給人類核保員簽核。公司特別強調「自主程度是依任務動態調整」，不是整條流程都丟給 AI 自己跑，所有結果都能回溯稽核。目前客戶包括 W.R. Berkley、Bowhead Specialty、AmRisc 等主要保險公司與 MGA（管理代理機構），過去一年平台處理的工作量成長了 4 倍。

創辦人 Paul Monasterio 有 MIT 核能科學博士學位，創業前在 Applied Predictive Technologies（後被 Mastercard 以 $6 億收購）、Mastercard、Facebook 工作；共同創辦人 Daniel Hillman 同樣出身 Applied Predictive Technologies 銷售團隊。兩人都不是保險業出身，Monasterio 稱這種「外來者視角」是優勢之一。

## 這筆融資的信號

### 對 Agent 生態的意義

Kalepa 這輪補上的是 Agent 討論裡常被忽略的一塊：在真正高風險、強監管的產業裡，「AI agent 處理、人類專家簽核」的分工模式已經被客戶用真金白銀的採購決定驗證過，不是概念驗證階段。這筆錢計劃用在三件事：擴充 AI 產品線、進入新市場、把團隊規模在 2027 年前翻倍。

```diagram
title: Kalepa 的任務分派邏輯
desc: 每筆核保任務依複雜度與風險被分派給 AI agent 或人類專家，無論誰做，結果都會留下可回溯的稽核紀錄。
caption: 簡化示意：實際分派規則依客戶與任務類型設定，細節因部署而異。
step: 新保單/核保任務進入系統
step: 依複雜度與風險評估分派
step: 低風險任務由 AI agent 直接完成，結果可回溯稽核
step: 高風險或需核准任務轉交人類專家處理，結果可回溯稽核
---
<svg viewBox="0 0 480 260">
  <rect class="dg-box" x="8" y="102" width="120" height="56" rx="6" data-step="1"/>
  <text class="dg-label" x="68" y="121" text-anchor="middle" dominant-baseline="central" data-step="1">核保任務</text>
  <text class="dg-sub" x="68" y="141" text-anchor="middle" dominant-baseline="central" data-step="1">進入系統</text>

  <path class="dg-line" d="M128 130H168" marker-end="url(#arrow)" data-step="2"/>

  <rect class="dg-box dg-box--accent" x="168" y="102" width="120" height="56" rx="6" data-step="2"/>
  <text class="dg-label" x="228" y="121" text-anchor="middle" dominant-baseline="central" data-step="2">風險評估</text>
  <text class="dg-sub" x="228" y="141" text-anchor="middle" dominant-baseline="central" data-step="2">決定分派對象</text>

  <path class="dg-line" d="M288 130H308V46H328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M288 130H308V222H328" marker-end="url(#arrow)" data-step="4"/>

  <rect class="dg-box" x="328" y="18" width="140" height="56" rx="6" data-step="3"/>
  <text class="dg-label" x="398" y="37" text-anchor="middle" dominant-baseline="central" data-step="3">AI agent</text>
  <text class="dg-sub" x="398" y="57" text-anchor="middle" dominant-baseline="central" data-step="3">低風險直接完成，可稽核</text>

  <rect class="dg-box" x="328" y="194" width="140" height="56" rx="6" data-step="4"/>
  <text class="dg-label" x="398" y="213" text-anchor="middle" dominant-baseline="central" data-step="4">人類專家</text>
  <text class="dg-sub" x="398" y="233" text-anchor="middle" dominant-baseline="central" data-step="4">高風險人工簽核，可稽核</text>
</svg>
```

### 投資人在賭什麼

領投方 Updata Partners 是一家成長股權（growth equity）基金，過去主導過 CData 的 $1.4 億 Series B（2021）與 Nerdio 的 $1.17 億 Series B（2022）——這兩家都是已經找到產品市場契合、靠成長資本而非燒錢驗證商模的公司。選 Kalepa 的邏輯類似：公司已經現金流為正超過兩年，這次融資不是為了活下去，而是為了在已驗證的商模上加速擴張。原有投資人 IA Ventures 和 Inspired Capital 全數回頭加碼,顯示早期投資人對五年後營收三倍成長的結果沒有失望。

### 值得觀察的數字

- 距上一輪融資整整五年（2021 年 $1,400 萬 Series A → 2026 年 $7,500 萬 Series B），估值從未揭露金額跳到 $4.7 億，是典型的「慢而穩」而非「快速燒錢換成長」路線
- 過去一年營收與客戶數都成長 3 倍，平台處理工作量成長 4 倍，核保員人均保費成長 30–60%，報價時間縮短 58%，綜合成本率改善 960 個基點,報價轉成交率翻倍——六個數字同時公布,比多數同輪次公司只秀一兩個指標的作法更經得起檢驗
- 保險核保 AI 這個細分賽道同期還有 Federato（2025 年 11 月 Goldman Sachs Alternatives 領投 $1 億 Series D,累計超過 $1.8 億）、Sixfold（2026 年 1 月 $3,000 萬 Series B）、Artificial Labs（$4,500 萬 Series B）在搶市場,Kalepa 的差異化主張是「自主程度依任務分級」而非像 Sixfold 主打的「端到端全自動核保」

## Watchlist 狀態

Kalepa 尚未在 watchlist 中。目前 watchlist 的 D 系列涵蓋客服（D1）、銷售（D2）、招聘（D3）、法律（D4）、醫療（D5）、合規風險（D6）、分析（D7）、電商（D8）、工業（D9）、企業搜尋/RPA（D10）、自動化（D11），沒有保險垂直 AI 的對應分類。建議新增 section D12（保險垂直 AI），納入 Kalepa 及其對手 Federato、Sixfold、Artificial Labs 做橫向追蹤，追蹤重點：核保工作流程的人機分工比例與現金流健康度(不是只看融資金額)。

## 今日收穫

多數 Agent 公司的敘事是「越自主越好,越快取代人類越厲害」,但 Kalepa 用五年才再融資、現金流為正超過兩年的紀錄反而證明了另一條路:在真正有監管責任的產業裡,投資人願意用高估值獎勵「AI 做它做得好的部分、人做它該做的部分」這種刻意不追求全自動的分工設計,而不是獎勵燒錢衝自主程度的公司。

## 參考資料

- [Kalepa Raises $75 Million Series B at a $470 Million Valuation to Expand Professional Grade AI Across Insurance](https://kalepa.com/news-posts/kalepa-raises-75-million-series-b)
- [Five years after its Series A, insurance AI startup Kalepa raises $75M at $470M valuation](https://techfundingnews.com/kalepa-75m-series-b-updata-insurance-ai/)
- [AI-powered insurance startup Kalepa valued at $470 million](https://www.businessinsurance.com/ai-powered-insurance-startup-kalepa-valued-at-470-million/)
- [Kalepa raises $75m to scale AI across insurance](https://fintech.global/2026/11/06/kalepa-raises-75m-to-scale-ai-across-insurance/)
