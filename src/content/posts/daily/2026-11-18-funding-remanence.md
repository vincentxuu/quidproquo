---
title: "融資速報｜Remanence 種子輪 $30M（EQT Ventures／FirstMark 共同領投）"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, funding, daily, remanence, agent-infrastructure]
lang: zh-TW
description: "法國新創 Remanence 完成 $30M 種子輪，由 EQT Ventures 與 FirstMark 共同領投，把企業 AI agent 的執行資料轉換成企業自有的 post-trained 模型"
tldr: "Remanence 完成 $30M 種子輪，由 EQT Ventures 與 FirstMark 共同領投，由三位 H Company 前研究員創立，把企業 AI agent 的執行資料變成企業自己擁有、能持續改進的模型。這筆錢代表的訊號：當企業用 agent 的規模變大，「誰擁有 agent 跑出來的資料與模型」開始變成比模型效能本身更值錢的問題。"
series:
  name: "AI Agent Funding"
  order: 143
---

> 🌏 [English version](/posts/daily/2026-11-18-funding-remanence-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Remanence（法國，巴黎） |
| 輪次 | Seed |
| 金額 | $30M |
| 領投 | EQT Ventures、FirstMark |
| 跟投 | Zero Prime、Emblem、Drysdale、Global Founders Capital、Yellow；天使投資人包括 Datadog CEO Olivier Pomel、Mirakl 共同創辦人 Philippe Corrot、Pigment 共同創辦人 Romain Niccoli、Synthesia 共同創辦人 Victor Riparbelli 與 Steffen Tjerrild |
| 估值 | 未揭露 |
| 累計融資 | $30M（首輪） |
| 成立年份 | 2026 年（本輪為公司首次公開募資） |
| 員工數 | 未揭露（三位共同創辦人團隊,計劃優先在巴黎招募,倫敦與舊金山設點） |

## 這家公司做什麼

Remanence 是做「把企業自己的 AI agent 執行資料變成企業自有模型」的公司——主張企業部署 agent 愈多,產生的執行資料(execution trace)就愈多,但多數企業沒有基礎設施把這些資料轉成能持續改進的專屬模型,結果資料被浪費,企業也持續依賴外部模型供應商。

產品把企業既有 AI 模型的執行軌跡,轉換成客製化的訓練環境,再用強化學習對開源權重模型(open-weight model)做 post-training——agent 在模擬的企業環境裡練習任務、做決策、從錯誤中學習,系統依結果調整模型參數。隨著 agent 持續產生更多資料,模型可以不斷重新訓練,滾動改善準確度並跟上工作流程的變化。企業可以把資料留在自己的基礎設施裡,自行決定訓練與部署發生的位置,最終擁有模型權重與衍生出來的智慧資產。

三位共同創辦人 Pierre-Louis Cedoz、Hamza Benchekroun、Axel Moyal 都曾在法國 AI 實驗室 H Company 共事,主導過開源權重 Holo 模型的 post-training,該模型在電腦操作(computer-use)benchmark 上超越多個領先的開源與閉源模型,團隊另有 Google DeepMind、Meta、InstaDeep 的經驗。目前已與歐美法務、客服、企業軟體領域的設計合作夥伴展開試用。

## 這筆融資的信號

### 對 Agent 生態的意義

這是「企業 agent 資料主權」開始被資本認真定價的一個樣本。隨著企業部署的 agent 數量增加,執行資料的規模也跟著變大,Remanence 的賭注是:比起持續租用通用模型的 API,企業最終會想把這些資料轉成自己擁有、能持續迭代的專屬模型——這把戰場從「哪個模型最強」,挪到「誰能幫企業把自己的資料變成資產」。

### 投資人在賭什麼

EQT Ventures 合夥人 Tom Mendoza 的邏輯是企業 AI 的下一階段核心問題是「誰擁有智慧」,企業部署愈多 agent,產生的資料愈多,但多數企業缺乏把資料轉成持續改進模型的基礎設施,他押注團隊的技術深度能補上這個缺口。FirstMark 普通合夥人 Matt Turck 則指出,post-training 這件事目前只有少數實驗室內部的人真正會做——Remanence 團隊在 H Company 做出打敗前沿實驗室模型的 Holo,現在要把這個能力變成每家企業都能用的產品,這是比「又一個 agent 框架」更稀缺的技術壁壘。

### 值得觀察的數字

```diagram
title: Remanence 的持續學習循環
desc: 企業部署的 agent 產生執行資料，經強化學習 post-training 後變成企業自有的專屬模型，再部署回 agent 使用，形成持續改進的閉環。
caption: 流程依 Remanence 官方說明與 Tech Funding News 報導整理。
---
<svg viewBox="0 0 640 280">
  <path class="dg-line" d="M200 68H440" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 96V176" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 204H200" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M120 176V96" marker-end="url(#arrow)"/>

  <g>
    <rect class="dg-box" x="40" y="40" width="160" height="56" rx="6"/>
    <text class="dg-label" x="120" y="60" text-anchor="middle" dominant-baseline="central">企業 AI agent</text>
    <text class="dg-sub" x="120" y="80" text-anchor="middle" dominant-baseline="central">產生執行 trace</text>
  </g>

  <g>
    <rect class="dg-box" x="440" y="40" width="160" height="56" rx="6"/>
    <text class="dg-label" x="520" y="60" text-anchor="middle" dominant-baseline="central">轉換為訓練環境</text>
    <text class="dg-sub" x="520" y="80" text-anchor="middle" dominant-baseline="central">Remanence 平台</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="440" y="176" width="160" height="56" rx="6"/>
    <text class="dg-label dg-text--accent" x="520" y="196" text-anchor="middle" dominant-baseline="central">Post-Training</text>
    <text class="dg-sub" x="520" y="216" text-anchor="middle" dominant-baseline="central">強化學習／RL</text>
  </g>

  <g>
    <rect class="dg-box dg-box--store" x="40" y="176" width="160" height="56" rx="6"/>
    <text class="dg-label" x="120" y="196" text-anchor="middle" dominant-baseline="central">企業自有專屬模型</text>
    <text class="dg-sub" x="120" y="216" text-anchor="middle" dominant-baseline="central">權重歸企業所有</text>
  </g>

  <text class="dg-edge" x="100" y="136" text-anchor="middle" dominant-baseline="central">部署</text>
</svg>
```

- $30M 種子輪規模,在這篇整理到的三筆融資裡是最小的一筆,但天使投資人名單(Datadog、Mirakl、Pigment、Synthesia 創辦人)含金量偏高,代表產業內部對這個問題有共識,不是單純財務投資人的賭注。
- 對照同賽道:Bespoke Labs 以 $40M 種子 + A 輪做「企業模擬環境」、Mercor 以 $750M D 輪、$20B 估值做「agent 評測與訓練環境」、River AI 以 $1.1B 做「開源模型微調與強化學習 API」——Remanence 的切入點是「用企業自己的 agent trace 當訓練環境」,而不是通用的模擬場景,訂價邏輯與對手不同,目前難以直接比較估值倍數。
- 公司未揭露目前客戶數與試用成效的量化指標,「已與法務、客服、企業軟體領域的設計合作夥伴展開試用」是目前唯一可查證的落地訊號。

## Watchlist 狀態

Remanence 尚未在 watchlist 中。建議加入 section B4(Agent 記憶 / Context)或新增「企業 agent 資料主權 / 持續學習」子類,追蹤重點:把企業 agent 執行資料轉成自有 post-trained 模型、$30M Seed、EQT Ventures 與 FirstMark 領投,與 Bespoke Labs、Mercor、River AI 同屬相鄰但不同切入點的賽道。

## 今日收穫

多數「agent 訓練基礎設施」公司賣的是通用模擬環境,Remanence 賣的是「用你自己的 agent 真實跑出來的資料當訓練環境」——這代表下一階段的差異化,可能不是誰的模擬場景蓋得更像真實世界,而是誰能最快把客戶自己產生的真實執行資料,轉成客戶拿得走、看得懂、能持續迭代的專屬模型。

## 參考資料

- [Synthesia and Datadog CEOs back AI startup Remanence in $30M funding round - Tech.eu](https://tech.eu/2026/11/17/synthesia-and-datadog-ceos-back-french-ai-startup-remanence/)
- [Ex-H Company researchers' Remanence raises $30M to turn AI agent data into models companies own - Tech Funding News](https://techfundingnews.com/ex-h-company-researchers-remanence-raises-30m-to-turn-ai-agent-data-into-models-companies-own/)
