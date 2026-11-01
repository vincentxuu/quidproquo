---
title: "融資速報｜Plato Series A $16M（模擬職場訓練 AI Agent，Nava Ventures 領投）"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, funding, daily, plato, agent-training-environment]
lang: zh-TW
description: "AI agent 訓練環境公司 Plato 完成 $16M Series A，Nava Ventures 領投，Microsoft AI 執行長 Mustafa Suleyman 個人跟投，把真實工作複製成可重複使用的強化學習模擬環境"
tldr: "Plato 完成 $16M Series A，由 Nava Ventures 領投，Gradient Ventures、Transpose Platform 與 Microsoft AI 執行長 Mustafa Suleyman 跟投，累計融資 $19M。這筆錢的信號：當 agent 要在真實系統裡下單、改資料、動錢，沒人敢讓模型直接在生產環境裡「邊做邊學」——於是訓練環境本身變成一個獨立的基礎設施層。"
series:
  name: "AI Agent Funding"
  order: 113
---

> 🌏 [English version](/posts/daily/2026-10-29-funding-plato-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Plato（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $16M |
| 領投 | Nava Ventures |
| 跟投 | Gradient Ventures, Transpose Platform, Mustafa Suleyman（Microsoft AI 執行長，個人投資） |
| 估值 | 未揭露 |
| 累計融資 | $19M（Seed + 本輪 $16M） |
| 成立年份 | 2025 |
| 員工數 | 未揭露 |

## 這家公司做什麼

Plato 是做 AI agent 訓練與評估模擬環境的公司——把客服、人資、財務、會計、醫療行政等真實工作複製成可重複重置的模擬職場,讓 AI 實驗室在裡面訓練與測試 agent,而不用冒著讓模型在真實系統裡下單、改資料、動錢的風險。

核心技術是找各領域的專業人士,把他們實際工作中用到的工具、會遇到的狀況、該符合的規範,原封不動複製成模擬環境,再供 AI 實驗室做強化學習（reinforcement learning）：模型在裡面反覆嘗試任務、取得回饋、修正行為。Plato 的評估不只看任務是否完成,還檢查「怎麼完成」——例如完成一筆採購不代表成功,如果模型超出預算上限,就不算達標；系統也會檢查模型有沒有鑽模擬環境的漏洞來刷高分。兩位共同創辦人 Robert Farlow 與 Pranav Putta 分別來自 Yutori（訓練 computer-use 模型的標註平台）與 MultiOn（訓練 computer-use 模型),對「怎麼讓 agent 從練習中學會做事」有第一手經驗。

目前公開案例聚焦在客服、人資、財務會計與醫療行政這幾個領域,官方未公布具體客戶名單與營收數據。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪融資呼應一個正在成形的子領域：agent 訓練環境本身正從「AI 實驗室自己土法煉鋼搭建」,變成一個有專門公司服務的基礎設施層。同期還有 micro1 宣布投入 $1B 打造類似的練習環境,6 月時 Patronus AI 也拿了 $50M 做 agent 壓力測試模擬——這些案例共同指向同一個判斷：當 agent 要處理的任務從「回答問題」變成「採取行動」,模型光靠靜態資料集已經練不出來,需要能互動、能給回饋、能重置重來的環境,而這類環境的建置成本和專業門檻,正好適合外包給專門公司做。

### 投資人在賭什麼

Nava Ventures 創辦人 Freddie Martignetti 的說法很直接：一開始被 Plato「大規模建置高擬真環境」的技術能力吸引,後來意識到 Plato 其實是一個「數據實驗室」,在支援全球最前沿的模型開發。這個定位轉變很關鍵——Nava 不是把 Plato 當成一個垂直應用公司投,而是當成跟頂尖 AI 實驗室綁定的資料基礎設施公司投,這類公司的客戶集中度高、議價力強,一旦被幾家大型 AI 實驗室採用為標準訓練管線,很難被取代。Mustafa Suleyman 以個人身份投資也值得注意：作為 Microsoft AI 執行長,他直接下注的對象通常反映他自己對「agent 下一步需要什麼基礎設施」的判斷。

### 值得觀察的數字

- Seed 到 Series A 僅間隔約一年,累計融資僅 $19M,相對克制——對比 coding agent 或 agent 安全賽道動輒 $50M 以上的 B 輪,Plato 目前仍停留在驗證階段,還沒進入資本密集的擴張期
- 同期 micro1 宣布投入 $1B 做類似的訓練環境,規模是 Plato 這輪的 60 倍以上,顯示這個子領域已經出現資本量級差距懸殊的參與者——Plato 的定位更接近「精品、高擬真度」路線,而非規模戰
- 公司成立僅一年多（2025 年創立）就拿到 Microsoft AI 執行長親自跟投,說明這個階段的 agent 訓練環境賽道,早期背書的訊號價值可能比財務數字更重要

## Watchlist 狀態

Plato 尚未在 watchlist 中。建議加入 section B6（Agent 可觀測性/評估),追蹤重點：模擬職場 RL 訓練環境,$16M Series A,Nava Ventures 領投,Mustafa Suleyman 個人跟投。

## 今日收穫

一直以為 agent 訓練的瓶頸是模型架構或演算法,但 Plato、micro1、Patronus AI 同時在做的事說明瓶頸其實更基礎：沒有足夠擬真、可重複、可安全重置的練習場,agent 就只能在真實系統裡用使用者的真錢真資料來試錯——訓練環境本身,可能才是讓 agent 從「能聊天」進化到「能辦事」最卡的那一關。

## 參考資料

- [Plato Raises $16 Million to Build the Training Grounds for AI's Next Leap Into Real Work](https://www.prnewswire.com/news-releases/plato-raises-16-million-to-build-the-training-grounds-for-ais-next-leap-into-real-work-302921832.html)
- [Plato raises $16M to build fake offices where AI agents learn real jobs](https://thenextweb.com/news/plato-16m-series-a-simulated-workplaces-ai-agents)
- [Workplace simulation startup Plato raises $16M led by Nava Ventures](https://www.axios.com/pro/enterprise-software-deals/2026/10/28/workplace-simulation-plato-16-million-nava)
