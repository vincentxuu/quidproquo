---
title: "融資速報｜Pathos AI 完成 $237M Series E（BMS 用股權換平台使用權，估值 17 個月翻 1.9 倍到 $3B）"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, funding, daily, pathos-ai, healthcare-agent]
lang: zh-TW
description: "AI 製藥公司 Pathos AI 完成 $237M Series E，由 Bristol Myers Squibb 領投——BMS 換得 Pathos Foundry 平台跨組合使用權與神經科學領域三年獨家權"
tldr: "Pathos AI 完成 $237M Series E，由 Bristol Myers Squibb 領投，估值來到 $3B，距離 Series D 的 $1.6B 僅 17 個月。這筆錢的信號：BMS 不是純財務投資，而是用股權換 Pathos Foundry 平台的跨組合使用權與神經科學三年獨家權——大藥廠開始把「投資 AI biotech」當成取得內部 agent 平台能力的捷徑。"
series:
  name: "AI Agent Funding"
  order: 107
---

> 🌏 [English version](/posts/daily/2026-10-25-funding-pathos-ai-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Pathos AI（美國，紐約市） |
| 輪次 | Series E |
| 金額 | $237M |
| 領投 | Bristol Myers Squibb（BMS） |
| 跟投 | 既有投資人（未具名揭露；前輪投資人包含 New Enterprise Associates、Revolution Growth、Lightbank、Builders VC） |
| 估值 | $3B（Series D 時為 $1.6B，17 個月內成長 1.9 倍） |
| 累計融資 | $704M（Series D 後為 $467M） |
| 成立年份 | 2022 |
| 員工數 | ~100 人（Tracxn，2026 年 9 月） |

## 這家公司做什麼

Pathos AI 是一家自己開發藥物的 AI 臨床階段生技公司——它不是把 AI 工具賣給藥廠，而是用自己的 AI 平台做出投資組合與臨床試驗決策，自己把藥往臨床推。

核心是 Foundry 平台，由數千個專門化 AI agent 組成，即時整合臨床資料、基因組學、生物樣本資料與不斷變化的競爭格局，持續判斷一個藥物項目「下一步該怎麼走」。跟 Isomorphic Labs、Recursion 這類主打「用 AI 預測分子結構」的公司不同，Pathos 的差異化在決策層——用 Foundry 決定該從哪裡 in-license 哪個臨床資產、該怎麼調整臨床試驗設計、該在哪個生物亞群身上下注，把「做出對的藥物開發決策」本身變成可規模化的能力。

目前管線有四個臨床階段項目：JSKN-016（TROP2/HER3 雙特異性抗體藥物複合體，正推向註冊性試驗）、pocenbrodib（授權自 Novo Nordisk，用於轉移性去勢抗性前列腺癌與復發／難治性多發性骨髓瘤）、AZD4241（與 AstraZeneca 合作的 ER PROTAC）、DO-2（次世代 MET 酪氨酸酶抑制劑）。它的「客戶」不是訂閱使用者，而是 BMS、Novo Nordisk、AstraZeneca、Tempus 這類藥廠與資料夥伴的多年策略合作。

## 這筆融資的信號

### 對 Agent 生態的意義

Foundry 用數千個 AI agent 即時整合臨床、基因組、生物樣本資料與競爭格局——這是 agent 架構少見地被大規模用在高風險、長週期、單次決策成本極高的藥物開發決策上，不是客服或寫程式碼那類容錯高、可以重來的任務。這筆錢會用來擴大 Foundry 的能力，並把 JSKN-016 推向註冊性試驗，等於直接拿募資的錢去驗證「agent 能做臨床決策」這個論點站不站得住。

### 投資人在賭什麼

這輪最關鍵的細節不是金額，而是交易結構：BMS 領投的同時，拿到 Pathos Foundry 平台在其更廣泛研發組合裡的非獨家使用權，以及神經科學領域三年的獨家使用權。這不是單純財務投資，而是用股權換平台能力的捆綁交易——同一時間，Pathos 共同創辦人 Eric Lefkofsky 創辦的 Tempus AI 也跟 Pathos 簽了一份五年 $55M 的資料授權合約，由 Tempus 替阿茲海默症建一個去識別化的長期資料集，交給 Foundry 分析。換句話說，BMS 賭的是「把 Pathos 在腫瘤領域驗證過的 agent 決策方法複製到神經科學」，不是單純押注一家 AI biotech 能不能把新藥送上市。

### 值得觀察的數字

```diagram
title: Pathos AI 估值成長：Series C 到 Series E
desc: Pathos AI 的估值從 Series C 的 0.6 億美元，經 Series D 的 1.6 億美元，17 個月內成長到 Series E 的 3 億美元。
caption: 估值換算：基線 y=300，每十億美元 60 單位（y = 300 − 數值 × 60），縱軸自 0 起。數據來自 Pathos AI 官方公告。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">估值（十億美元）</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">4</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">2</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="146" y="264" width="72" height="36"/>
    <rect class="dg-bar dg-bar--soft" x="306" y="204" width="72" height="96"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="466" y="120" width="72" height="180"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="182" y="254" text-anchor="middle" dominant-baseline="central">$0.6B</text>
  <text class="dg-sub" x="342" y="194" text-anchor="middle" dominant-baseline="central">$1.6B</text>
  <text class="dg-label dg-text--accent" x="502" y="110" text-anchor="middle" dominant-baseline="central">$3B</text>

  <text class="dg-sub" x="182" y="320" text-anchor="middle" dominant-baseline="central">C 輪</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">D 輪</text>
  <text class="dg-label dg-text--accent" x="502" y="320" text-anchor="middle" dominant-baseline="central">E 輪</text>
</svg>
```

- 估值從 Series C 的 $600M（2024 年 10 月）→ Series D 的 $1.6B（2025 年 5 月，7 個月內 2.7 倍）→ Series E 的 $3B（2026 年 10 月，17 個月內再 1.9 倍），三輪之間完全沒有放緩
- 累計融資來到約 $704M，支撐的是只有四個臨床階段資產的管線——換算下來每個臨床資產背後站著超過 $175M 的募資規模，遠高於同階段傳統腫瘤生技公司的募資密度
- 跟 Tempus 的資料授權合約本身就標了價：五年 $55M，這筆錢不是拿去燒在實驗室，而是直接買一個全新疾病領域（神經科學）的資料基礎設施

## Watchlist 狀態

Pathos AI 尚未在 watchlist 中。建議加入 section D5（醫療 AI），追蹤重點：agentic AI 藥物開發平台 Foundry、這輪 $237M Series E 與 BMS 的股權換平台使用權合作模式，以及後續能否把腫瘤領域的決策方法真正複製到神經科學。

## 今日收穫

之前以為 agent 架構主要還是落在寫程式碼、客服這類容錯高、可以重來的任務裡，但 Pathos 把幾千個 agent 用在藥物開發這種「一次臨床試驗設計錯了可能燒掉一整年」的高風險決策上，而且已經有大藥廠用真金白銀驗證。更值得記住的是 BMS 這次出資的方式——不是單純寫一張支票，而是把投資跟「換得平台使用權」綁在一起，這可能是大藥廠跟 AI biotech 之後合作的新模板：投資不只是財務回報，也是取得內部 agent 能力的捷徑。

## 參考資料

- [Pathos AI Secures $237 Million in Series E Financing to Scale Agentic AI Drug Development Platform and Advance Oncology Pipeline](https://www.businesswire.com/news/home/20261023421846/en/Pathos-AI-Secures-$237-Million-in-Series-E-Financing-to-Scale-Agentic-AI-Drug-Development-Platform-and-Advance-Oncology-Pipeline)
- [AI drug firm Pathos raises $237 million, pushing valuation to $3 billion](https://www.statnews.com/2026/10/23/pathos-ai-bristol-myers-squibb-tempus-deal/)
- [BMS leads Pathos AI's $237M series E alongside Alzheimer's link-up](https://www.fiercebiotech.com/biotech/pathos-ai-closes-237m-series-e-heels-bms-alzheimers-link)
- [Pathos AI secures $365M series D to fund trial of Novo Nordisk solid tumor drug](https://www.fiercebiotech.com/biotech/pathos-ai-secures-365m-series-d-fund-trial-novo-nordisk-solid-tumor-drug)
- [Pathos AI Closes $62M Oversubscribed Series C Round of Financing to Accelerate its Platform Approach to Drug Development](https://www.pathos.com/pathos-ai-closes-62m-oversubscribed-series-c-round-of-financing-to-accelerate-its-platform-approach-to-drug-development)
- [Pathos - 2026 Company Profile, Team, Funding & Competitors](https://tracxn.com/d/companies/pathos/__DDvj4Qd5ok9EjmtuluEF-4z04XfiRfbxlVn1Bk8G08o)
