---
title: "融資速報｜Snorkel AI Series E $350M，估值半年翻近 3 倍，賣的是 Agent 訓練用的「資料工廠」"
date: 2026-09-26
category: daily
type: digest
tags: [ai-agent, funding, daily, snorkel-ai, training-data]
lang: zh-TW
description: "AI 訓練資料公司 Snorkel AI 完成 $350M Series E，Insight Partners 與 S32 共同領投，估值 17 個月內從 $1.3B 漲到 $3.5B，年化營收成長 18 倍，賣的是給 AI 實驗室的客製訓練資料集與強化學習環境"
tldr: "Snorkel AI 完成 $350M Series E，由 Insight Partners 與 S32 共同領投，估值較 17 個月前的 $1.3B（Series D）漲近 3 倍到 $3.5B，年化經常性收入 12 個月內成長 18 倍到 $375M。這輪錢的信號是：當前沿模型的訓練瓶頸已經從「算力夠不夠」轉移到「訓練資料和強化學習環境夠不夠精緻」，資料供應鏈本身正在變成一個能獨立募到超大輪的基礎設施層。"
series:
  name: "AI Agent Funding"
  order: 52
---

> 🌏 [English version](/en/posts/daily/2026-09-26-funding-snorkel-ai-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Snorkel AI（美國） |
| 輪次 | Series E |
| 金額 | $350M |
| 領投 | Insight Partners、S32（Section 32）共同領投 |
| 跟投 | Addition、Lightspeed、Greylock、GV、Wells Fargo、Third Point、March、Blumberg、Allegis、Standard VC、Frontline |
| 估值 | $3.5B（17 個月前 Series D 時為 $1.3B，漲近 3 倍） |
| 累計融資 | 未完整揭露（Series D 為 $100M，本輪再加 $350M） |
| 成立年份 | 2019 年商業化推出（源自 Stanford AI 實驗室 4 年研究） |
| 員工數 | 未揭露 |

## 這家公司做什麼

Snorkel AI 是做 AI 訓練資料的公司——給 AI 實驗室和企業提供訓練模型所需的高品質資料集，讓客戶不用自己從零建立資料標註團隊。

公司最早提供的是資料標註自動化軟體，2025 年轉型成「資料即服務」（data-as-a-service）：不再只是賣工具，而是直接交付做好的完整資料集。做法是混合式的——不是純粹靠人力標註市場，而是用自家軟體和模型合成生成資料，再搭配領域專家審核修正，並近期擴大到提供強化學習（RL）環境與評估環境，這些正是訓練「會自主行動、需要在多步驟任務裡被獎勵訊號校正」的 AI Agent 所需要的資料型態。

由於 Snorkel 賣的是完整資料集和 RL 環境，而非純粹人力工時，付給領域專家的費用計入銷售成本，不像 Mercor（年化營收 $2B）、Handshake（$1B）、Micro1（$500M）等同類「AI 資料實驗室」把人力費用打進頭條營收數字——這代表 Snorkel 的營收成長更貼近實際毛利貢獻。

## 這筆融資的信號

### 對 Agent 生態的意義

模型能力的邊界正在往「資料能不能餵到位」推移：光有更大的模型和更多算力，如果沒有夠精緻的訓練資料和貼近真實任務的強化學習環境，模型在複雜多步驟任務上的表現還是上不去。Snorkel 把這一層獨立出來變成可以直接採購的基礎設施，等於是把「怎麼準備 Agent 訓練所需的資料」，從每個 AI 實驗室各自摸索，變成一個有專業供應商的產業鏈環節。

### 投資人在賭什麼

Insight Partners 與 S32 共同領投，賭的邏輯很直接：只要前沿模型競賽持續下去，AI 實驗室對高品質訓練資料的需求就會持續超過供給，而 Snorkel 靠軟體＋人類專家的混合模式，能比純人力標註平台做出更難被複製的資料品質與規模化能力。同期還有 Mercor、Handshake、Micro1 等公司在同一個「AI 資料實驗室」賽道快速衝營收，顯示這不是單一公司的個案,而是整個資料供應鏈類別正在被重新定價。

### 值得觀察的數字

- 年化經常性收入 12 個月內成長 18 倍到 $375M——這個成長速度遠高於多數企業軟體公司,反映的是 AI 實驗室訓練資料需求的爆發式成長,而非漸進式的客戶擴張
- 估值 17 個月內從 $1.3B 漲到 $3.5B（漲幅約 2.7 倍),漲勢集中在最近一年,對應的正是強化學習環境與 Agent 訓練需求興起的時間點
- 同類公司 Mercor 年化營收已達 $2B、Handshake 破 $1B、Micro1 達 $500M——但這些數字含 60-70% 直接付給人力專家的成本,實際淨營收遠低於頭條數字,Snorkel 因為計價模式不同,$375M 更接近真實營收規模

## Watchlist 狀態

Snorkel AI 尚未在 watchlist 中。目前 watchlist 沒有專門的「AI 訓練資料／RL 環境」分類，跟現有 section B6（Agent 可觀測性／評估）有部分重疊（Snorkel 也提供評估環境），但核心業務是訓練資料供應鏈而非可觀測性工具。建議先掛在 B6 下追蹤，若後續有更多同類公司（Mercor、Handshake、Micro1）進入 Agent 訓練資料賽道，再考慮拆出獨立分類。

## 今日收穫

過去把「資料標註」當成 AI 供應鏈裡偏低階、容易被自動化取代的一環，但 Snorkel 這輪讓我重新理解：當訓練對象從「回答問題的模型」變成「會自主執行多步驟任務的 Agent」，資料的複雜度也跟著跳一個等級——不再是單純的標籤，而是完整的強化學習環境與獎勵訊號設計，這正是需要軟體加人類專家混合才做得出來、也才值得用一輪 $350M 去搶市場的東西。

## 參考資料

- [Snorkel AI triples valuation to $3.5B as demand for AI training data booms](https://techcrunch.com/2026/09/22/snorkel-ai-triples-valuation-to-3-5b-as-demand-for-ai-training-data-booms/)
- [Snorkel AI Raises $350M to Scale the Data Factory for Frontier AI](https://www.prnewswire.com/news-releases/snorkel-ai-raises-350m-to-scale-the-data-factory-for-frontier-ai-302886796.html)
- [Snorkel AI Raises $350 Million At $3.5 Billion Valuation To Expand Agentic Data Factory](https://pulse2.com/snorkel-ai-raises-350-million-at-3-5-billion-valuation-to-expand-agentic-data-factory/)
