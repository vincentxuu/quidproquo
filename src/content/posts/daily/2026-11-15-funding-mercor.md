---
title: "融資速報｜Mercor Series D $750M（估值達 $20B，NVIDIA、Salesforce 跟投）"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, funding, daily, mercor, agent-evaluation]
lang: zh-TW
description: "AI 資料與評測公司 Mercor 完成 $750M Series D，估值一年內從 $10B 翻倍到 $20B，NVIDIA、Salesforce、Benchmark 等跟投，業務重心從訓練前沿模型的人力資料，轉向幫企業評測與訓練自己的 AI agent"
tldr: "Mercor 完成 $750M Series D，估值從一年前的 $10B 翻倍到 $20B，NVIDIA、Salesforce、Benchmark、General Catalyst 等跟投。這筆錢代表的趨勢：AI 評測與訓練基礎設施的買方正從前沿實驗室擴散到一般企業，Mercor 想把自己從「幫 OpenAI/Anthropic 找標注員」的公司，變成每家企業訓練自己 agent 的基礎設施層。"
series:
  name: "AI Agent Funding"
  order: 137
---

> 🌏 [English version](/posts/daily/2026-11-15-funding-mercor-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Mercor（美國，舊金山） |
| 輪次 | Series D |
| 金額 | $750M |
| 領投 | 未指名單一領投方，由多家機構共同參與 |
| 跟投 | Benchmark、Felicis、Fundomo、Apollo 關聯基金、G Squared、General Catalyst、Glade Brook Capital、NVIDIA、Salesforce、Sapphire Ventures、StepStone Group、XTX Ventures、Zoom |
| 估值 | $20B（前一輪 Series C 為 $10B，一年內翻倍） |
| 累計融資 | 未完整揭露（已知 Series C $350M + 本輪 $750M，至少 $1.1B） |
| 成立年份 | 2023 |
| 員工數 | 700 人（Tech Funding News 報導） |

## 這家公司做什麼

Mercor 是做 AI 訓練與評測資料的公司——用超過 500 萬名各領域專家組成的網路，幫前沿 AI 實驗室和企業訓練、評測模型與 agent。

核心產品邏輯是「每個行業都需要自己的 agent，而每個 agent 的表現好壞，需要那個行業的真實專家來判斷」。公司原本的業務是連結 AI 公司和各領域專業人士，讓這些人提供領域知識來訓練前沿模型；今年透過收購 Deeptune（一個花兩年重建數百個企業應用程式作為 agent 訓練環境的團隊），把能力延伸成幫一般企業針對自己的實際工作流程建立客製化評測基準（evals），藉此判斷 AI agent 在特定公司的系統、政策和品質標準下到底好不好用。

目前服務對象涵蓋前沿實驗室、大型科技公司、開源模型開發商到 Fortune 500 企業，7 月時公司揭露年化營收超過 $2B（但其中約 60-70% 會分給承包的專家，淨營收估計在 $600M-$800M 之間），今年也在舊金山之外開了紐約和倫敦辦公室。在同類的 AI 資料/評測市場，主要對手是 Scale AI（已被 Meta 投資 49% 股權，估值約 $14B）和據稱正洽談超過 $25B 估值募資的 Surge AI。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪募資的敘事明確從「幫模型公司找訓練資料的供應商」切換成「幫每家企業訓練和評測自己的 agent 的基礎設施層」。Mercor 押的賭注是：隨著開源模型越來越強，企業不再需要從零訓練模型，而是拿一個夠強的開源模型做後訓練（post-training），這時候真正稀缺的不是算力或模型，而是「這個 agent 在我公司的工作流程裡到底做得好不好」的客製化評測能力——這正是 Mercor 想把自己卡位在的位置。

### 投資人在賭什麼

NVIDIA、Salesforce、Zoom 這類跟投名單本身就是訊號——它們不只是財務投資人，更像是潛在客戶兼生態夥伴，透過投資綁定未來用 Mercor 評測自家 agent 產品的關係。Sapphire Ventures 總裁 Jai Das 的說法是「Mercor 做出了很難複製的東西」，而 Mercor 聯合創辦人 Adarsh Hiremath 把邏輯講得更直白：「每家部署 AI 的公司都需要知道它有沒有用，而答案對每家公司都不一樣」——這句話本身就是在賣「客製化評測」這個生意的必要性。

### 值得觀察的數字

```diagram
title: Mercor 估值一年內的變化
desc: 從 Series C 的 $10B 到 Series D 的 $20B，估值在約一年內翻倍。
caption: 數字來自 Mercor 官方部落格（2026-11-10）與 Tech Funding News 報導。
---
<svg viewBox="0 0 640 220">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">估值（$B）</text>
  <line class="dg-grid" x1="306" y1="40" x2="306" y2="192"/>
  <text class="dg-small" x="306" y="206" text-anchor="middle">10</text>

  <rect class="dg-bar dg-bar--soft dg-c-muted" x="160" y="46" width="146" height="40"/>
  <rect class="dg-bar dg-c-accent" x="160" y="118" width="292" height="40"/>
  <line class="dg-axis" x1="160" y1="40" x2="160" y2="192"/>

  <text class="dg-sub" x="314" y="66" dominant-baseline="central">$10B（2025-10，Series C）</text>
  <text class="dg-label dg-text--accent" x="460" y="138" dominant-baseline="central">$20B（2026-11，Series D）</text>
</svg>
```

- 估值從 $10B 到 $20B、整整翻倍，只花了約一年——比多數 AI 基礎設施公司的估值成長速度更快，顯示投資人把「agent 評測」當成和「模型本身」同等重要的稀缺資源
- 年化營收 $2B（毛額），扣掉付給專家的 60-70% 分成後，淨營收估計 $600M-$800M——意味著 $20B 估值對淨營收的倍數大約落在 25-33x，比同業 Scale AI 被 Meta 投資時的估值倍數更高
- 競爭對手 Surge AI 據稱正在洽談超過 $25B 的估值募資，比 Mercor 現在的 $20B 還高——顯示這個子領域的估值競賽還沒有停

## Watchlist 狀態

Mercor 已在 watchlist section D3，原追蹤重點記錄的是「AI 招募平台、$350M Series C、$2B 估值」，資訊已經過期——建議更新為「AI 評測/後訓練基礎設施、$750M Series D、$20B 估值（一年內翻倍）」，並把定位從單純的招募/標注平台，調整成企業 agent 評測與後訓練的基礎設施層。

## 今日收穫

Mercor 這輪最有意思的訊號不是估值翻倍本身，而是它正在示範一種「把人力標注生意，重新包裝成企業基礎設施」的路徑——當模型本身越來越商品化，真正稀缺、能收費的東西從「誰能訓練出最強模型」變成「誰能證明這個 agent 在我的工作流程裡真的管用」，Mercor 賭的是後者才是接下來十年的生意。

## 參考資料

- [Organizing human intelligence for the entire economy](https://www.mercor.com/blog/series-d/)
- [Mercor doubles valuation to $20B with $750M Series D to train and test AI agents for enterprises](https://techfundingnews.com/mercor-doubles-valuation-to-20b-with-750m-series-d-to-train-and-test-ai-agents-for-enterprises/)
- [Mercor raises $750m at a $20bn valuation to train AI on every job](https://thenextweb.com/news/mercor-750m-series-d-20bn-valuation)
