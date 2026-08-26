---
title: "融資速報｜Trajectory Series A $40M"
date: 2026-08-19
category: daily
tags: [ai-agent, funding, daily, trajectory, continual-learning]
lang: zh-TW
description: "AI Agent 持續學習基礎設施 Trajectory 完成 $40M A 輪，Sequoia 領投，3 個月內估值從 $115M 跳到 $300M"
tldr: "Trajectory 完成 $40M Series A，由 Sequoia Capital 領投，估值 $300M（Seed 輪 3 個月後成長 2.6 倍）。這筆錢代表 Agent 優化的戰場正從「換更大的模型」轉向「讓部署中的 Agent 從真實使用訊號中持續變聰明」。"
series:
  name: "AI Agent Funding"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-19-funding-trajectory-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Trajectory（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $40M |
| 領投 | Sequoia Capital |
| 跟投 | NVIDIA、Bessemer Venture Partners |
| 估值 | $300M（Seed 輪為 $115M，3 個月內成長約 2.6 倍） |
| 累計融資 | $55M |
| 成立年份 | 2026 |
| 員工數 | 14 人（LinkedIn，2026 年 8 月） |

## 這家公司做什麼

Trajectory 是做「持續學習」（continual learning）基礎設施的公司——讓已經上線的 AI Agent 能從真實使用中的訂正、重新提問、編輯等訊號持續變聰明，而不是停留在訓練當下的靜態能力。

核心產品是一個輕量 SDK，接進客戶產品後捕捉使用者的 traces、corrections、re-prompts、edits 等訊號，再用「self-distillation policy optimization」技術把這些真實世界的修正回饋，程式化地更新 Agent 未來的決策路徑——不論客戶用開源或閉源模型，都能透過調整 prompt、模型參數，甚至整個 agent harness 來持續優化，不必依賴人工顧問團隊逐案調校。

目前客戶包括 Clay（AI 銷售）、Decagon（AI 客服）、Harvey（AI 法律）、Mercor、Rogo 等知名 AI-native 公司，部分已進入生產環境。創辦團隊來自 Google DeepMind、Apple、OpenAI、Meta Superintelligence Labs 等研究機構，2026 年 5 月才剛結束隱身模式。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪錢釋放的訊號是：Agent 賽道的競爭焦點正從「誰的底層模型更強」轉向「誰能讓部署中的 Agent 自己變聰明」。過去企業要客製化開源模型，得靠顧問團隊手動微調；Trajectory 把這個過程自動化，直接針對「agent harness」（Agent 如何呼叫工具、如何處理錯誤）做持續優化，而不只是換一個更大的底層模型。

### 投資人在賭什麼

Sequoia 在短短 3 個月內從 Seed 輪的觀望者變成 Series A 領投方（Bessemer 是唯一橫跨兩輪的既有投資人），賭的是「continual learning」會成為所有 agentic 產品的必要中介層——就像每個部署模型的公司都需要一個持續學習迴路，而不是每次都重新訓練。NVIDIA 加入跟投，延續其一貫策略：卡位大量消耗運算資源、且黏著在 AI 基礎設施關鍵節點的新創。

### 值得觀察的數字

- 估值從 Seed 輪的 $115M 到 Series A 的 $300M，3 個月內成長約 2.6 倍，融資速度罕見地快；
- 團隊僅 14 人就拿下 $55M 累計融資，人均融資額超過 $390 萬，反映的是頂尖研究背景（DeepMind、OpenAI、Apple、Meta Superintelligence）帶來的高溢價，而非既有營收證明；
- 客戶名單（Clay、Decagon、Harvey、Mercor、Rogo）都是估值數十億美元的 agentic 新創，顯示 Trajectory 選擇「賣鏟子給淘金者」的打法，卡在其他 AI 獨角獸的核心基礎設施位置。

## Watchlist 狀態

Trajectory 尚未在 watchlist 中。建議加入 section B6（Agent 可觀測性/評估），與 Braintrust、Arize AI、LangSmith 同組追蹤，追蹤重點：從真實使用訊號（traces/corrections）持續優化 agent 決策路徑的「持續學習」基礎設施，$40M Series A，估值 $300M。

## 今日收穫

以前認為「Agent 優化」主要靠換更好的底層模型或寫更精細的 prompt，但 Trajectory 的打法提醒我們：真正難以複製的優化訊號其實藏在生產環境的真實修正紀錄裡——誰能把這些訊號自動變成訓練資料，誰就掌握了比單純換模型更持久的優勢。

## 參考資料

- [Trajectory raises $40M Series A at $300M valuation](https://dealroom.co/news/144435-trajectory-raises-40m-series-a-at-300m-valuation/) — Dealroom
- [Trajectory Raises $40M in Series A Funding at $300M Post-Money Valuation](https://www.finsmes.com/2026/08/trajectory-raises-40m-in-series-a-funding-at-300m-post-money-valuation.html) — FinSMEs
- [Trajectory Raises $40M Series A](https://www.thesaasnews.com/news/trajectory-raises-40m-series-a) — The SaaS News
