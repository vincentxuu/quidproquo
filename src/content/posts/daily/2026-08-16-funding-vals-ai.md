---
title: "融資速報｜Vals AI Series A $40M"
date: 2026-08-16
category: daily
tags: [ai-agent, funding, daily, vals-ai, model-evaluation]
lang: zh-TW
description: "獨立 AI 模型評測新創 Vals AI 完成 $40M Series A，Andreessen Horowitz 領投，估值 $400M，主打用真實工作任務取代學術考題"
tldr: "Vals AI 完成 $40M Series A，由 Andreessen Horowitz 領投，估值 $400M。這筆錢代表 VC 開始把「AI 獨立評測」當成 AI 經濟必要的信任層基礎設施來投資，而不是錦上添花的排行榜網站。"
series:
  name: "AI Agent Funding"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-08-16-funding-vals-ai-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Vals AI（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $40M |
| 領投 | Andreessen Horowitz (a16z) |
| 跟投 | 8VC、Pear VC、Bloomberg Beta（既有投資人）、HRT Ventures、Next Ladder Ventures（新投資人） |
| 估值 | $400M（前一輪 Seed 未揭露估值） |
| 累計融資 | $45M（$5M Seed + $40M Series A） |
| 成立年份 | 2024 |
| 員工數 | ~15 人（LinkedIn，年增 67%） |

## 這家公司做什麼

Vals AI 是做獨立 AI 模型評測的公司——用真實世界的專業任務，而不是學術考題，來衡量一個 LLM 到底能不能勝任工作。

核心產品是把法律、金融、醫療、程式等領域的專家找來，把他們手上的真實工作流程轉換成評測基準，再搭配自動化評分系統，把模型輸出的最終成果評到專業水準。私有測試集只跑有限次數以避免被污染或針對性優化，整套評測基礎設施能在拿到新模型存取權後幾小時內產出結果。基準會定期淘汰重建——今年 5 月，Vals 就把已經飽和的企業財務基準 CorpFin 換成新的 Excel 建模測試。這次融資同時發布了三項新產品：讓客戶用自己的 GitHub repo 建立程式碼基準的 Vals Smith、涵蓋資安/心理健康/AI 安全的前沿風險基準，以及擴大到整體經濟範疇的 Vals Index 2.0。

目前 Vals 的評測結果已被 OpenAI、Anthropic、Google、Meta、xAI 引用在各自的 model card 中，企業客戶則用它的分數來決定哪個模型能上線。公司自述 2025 年全年營收成長 8 倍，客戶數翻倍，團隊規模在過去六個月內成長 3 倍。此前僅在 2024 年募得 $5M 種子輪，由 8VC、Bloomberg Beta、Pear VC 投資。

## 這筆融資的信號

### 對 Agent 生態的意義

模型正在從「回答問題」轉向「動手做事」——尤其是 Agent 一跑就是數小時甚至數天的無人監督長任務。選錯模型付出的代價不再只是 token 費用,而是整條自動化流程失控的風險。與此同時，公開學術基準正在失效：資料集飽和、洩漏進訓練語料，或直接變成模型刻意優化的目標，一個模型可以在排行榜上看起來很聰明，實際丟進真實的多步驟工作卻整個垮掉。Vals 想把自己卡在「模型供應商」和「企業採用決策」中間，成為雙方都能信任的裁判層。融資會用來擴大 Vals Smith、前沿風險基準和 Vals Index 2.0 這三條產品線。

### 投資人在賭什麼

a16z 合夥人 Jennifer Li 宣布投資時的邏輯很直白：每個夠大的市場最終都需要一個獨立記分員——信貸市場有 Moody's 和 S&P，公開市場有獨立審計師，產品製造業有 UL 認證。當賣方（模型廠商）掌握的資訊比買方（企業）多、又有強烈動機把自己包裝得更好時，可信的第三方測量才能讓市場運作起來。a16z 過去投過 OpenAI、Anduril、Databricks、Stripe 這類基礎設施型賭注，這次用相對小的 $40M 支票，賭的是「AI 信任層」會像信用評等一樣成為整個產業繞不開的必要基礎設施。

### 值得觀察的數字

- 累計融資從 $5M（2024 Seed，估值未揭露）跳到 $45M（估值 $400M），公司未公布明確的估值倍數對比，但兩年內從種子輪走到 4 億美元估值的爬升速度不低；
- 公司自述 2025 全年營收成長 8 倍、客戶數翻倍、團隊 6 個月內成長 3 倍，目前約 15 名員工，屬於極輕資產團隊撐起高估值的樣本；
- 同一週期內，「獨立 AI 評測」這個賽道有多種路線同時被資助：LMArena 用使用者投票排名的方式募得 $150M、估值 $1.7B（是 Vals 估值的 4 倍多），Trismik 用心理計量學方法募得 £2.2M，Datacurve 則用私有程式碼資料集募得 $15M Series A——顯示 VC 正在同時押注好幾種「誰來當 AI 裁判」的技術路線，而不是賭單一贏家。

## Watchlist 狀態

Vals AI 尚未在 watchlist 中。建議加入 section B6（Agent 可觀測性 / 評估），追蹤重點：獨立 AI 模型評測基礎設施，$40M Series A，a16z 領投，估值 $400M。

## 今日收穫

原本以為「AI 評測/排行榜」是可有可無的行銷工具，但這輪融資顯示 VC 已經把它當成獨立的基礎設施賽道在下注——而且是同時資助好幾種互斥的技術路線（眾包投票、私有專家基準、心理計量學），賭的不是誰的方法論最好，而是賭「AI 需要一個誰都信任的裁判」這個需求本身一定會存在。

## 參考資料

- [Investing in Vals](https://a16z.com/announcement/investing-in-vals/) — Andreessen Horowitz
- [a16z leads $40M Vals AI round at $400M valuation to test AI on real-world tasks](https://techfundingnews.com/a16z-leads-40m-vals-ai-round-at-400m-valuation-to-test-ai-on-real-world-tasks/) — Tech Funding News
- [Vals AI Raises $40 Million Series A At $400 Million Valuation As Revenue Grows 8x](https://pulse2.com/vals-ai-raises-40-million-series-a-at-400-million-valuation-as-revenue-grows-8x/) — Pulse2
