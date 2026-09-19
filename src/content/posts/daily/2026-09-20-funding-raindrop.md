---
title: "融資速報｜Raindrop Series A $35M，抓 Agent 在生產環境裡的無聲失敗"
date: 2026-09-20
category: daily
type: digest
tags: [ai-agent, funding, daily, raindrop, agent-observability]
lang: zh-TW
description: "Agent 監控新創 Raindrop 完成 $35M Series A，由 CRV 領投，累計融資 $50M，同時推出 Simulations 讓團隊在上線前用生產流量測試 Agent 變更"
tldr: "Raindrop 完成 $35M Series A，由 CRV 領投，累計融資來到 $50M。這輪錢代表投資人賭的是「Agent 可觀測性」已經從加分項變成必需品——當 Agent 一次跑好幾個小時、呼叫上千次工具，人已經沒辦法即時盯著每一步，勢必需要專門的系統幫忙抓出「安靜地做錯事」的時刻。"
series:
  name: "AI Agent Funding"
  order: 43
---

> 🌏 [English version](/en/posts/daily/2026-09-20-funding-raindrop-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Raindrop（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $35M |
| 領投 | CRV |
| 跟投 | Lightspeed Venture Partners, Y Combinator，另有 OpenAI、Anthropic、Thinking Machines 的資深研究員以個人身分跟投 |
| 估值 | 未揭露 |
| 累計融資 | $50M（Series A 前已募得 $15M） |
| 成立年份 | 2023 年 |
| 員工數 | 約 9 人（Y Combinator 公司頁面，募資前規模） |

## 這家公司做什麼

Raindrop 是做 Agent 生產環境監控的公司——它把自己定位成「Sentry for AI Agents」，專門抓 Agent 上線之後「安靜地做錯事」的時刻，而不是等用戶抱怨才知道出了問題。

核心產品讀取生產環境裡 Agent 的完整執行軌跡（trajectory），用語意層級的異常偵測抓出幻覺回答、工具誤用、或是模型升級之後行為悄悄改變等問題。當異常出現時，工程團隊能看到「什麼變了、什麼時候開始變、影響了哪些用戶」，並附上大量真實案例佐證，而不是只給一個抽象的錯誤率數字。這次募資同時發表的新產品 Simulations，把生產環境的真實流量和既有測試案例拿來重播，套用在一個提議中的 Agent 變更上，再跑一次異常偵測——等於讓一般團隊也能用上前沿實驗室（OpenAI、Anthropic）內部拿來測試自家模型的那套方法，在改動真正上線前先看到「這個改動會改變什麼」。

目前客戶包括 Vercel、Framer、Clay 以及數家 Fortune 100 企業。創辦人 Zubin Koticha（CEO）與 Alexis Gauba 是二次創業者，兩人先前共同創辦的 DeFi 選擇權平台 Opyn 後來被 Coinbase 收購，處理過超過 $150 億美元的交易量；第三位共同創辦人 Ben Hylak 一同組成團隊，公司 2023 年成立於舊金山。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪錢的用途很明確：擴大異常偵測研究、把產品推向更多企業客戶、以及把 Simulations 從研究預覽推向正式產品。Raindrop 引用 METR 的研究指出，Agent 能獨立完成的任務長度大約每七個月翻一倍，單次執行動輒橫跨好幾天、呼叫上千次工具——這代表傳統「靠人盯著看」的品質把關方式已經跟不上規模，必須有專門系統把「執行軌跡」變成可審視、可溯源的資料。

### 投資人在賭什麼

CRV 領投的邏輯，加上 Lightspeed、Y Combinator 續投，再疊上 OpenAI、Anthropic、Thinking Machines 一線研究員親自以天使身分下注，指向同一個判斷：Agent 可觀測性不是「模型變強之後才需要」的下游需求，而是模型公司自己內部就已經在用的方法論，現在正在被商品化成一個獨立的市場層。CEO Koticha 的說法是「Agent 現在一跑就是好幾個小時、呼叫上千次工具，牽涉真實金錢、真實健康資料、真實客戶——一旦做錯事，它會很有說服力地錯下去，直到有人剛好發現為止」，這正是 Raindrop 要填補的空隙。

### 值得觀察的數字

- 累計融資 $50M，其中這輪 Series A 就佔 $35M，顯示投資人對「Agent 可觀測性」這個子領域的信心在過去幾輪之間明顯加碼
- 客戶名單已經涵蓋 Vercel、Framer、Clay 這幾家本身就是重度 Agent 部署者的公司，等於是被最懂 Agent 風險的客群驗證過
- 團隊規模僅約 9 人就拿下 Fortune 100 等級客戶，人力密度極低，顯示產品本身的接入門檻和價值主張足夠直接

## Watchlist 狀態

Raindrop 尚未在 watchlist 中。建議加入 section B6（Agent 可觀測性／評估），與 Arize AI、Braintrust、LangSmith、Galileo AI 並列追蹤，追蹤重點：生產環境 Agent 軌跡的語意異常偵測，以及上線前用真實流量模擬變更影響的 Simulations 產品。

## 今日收穫

過去看 Agent 可觀測性,常把它想成「幫 LLM 應用加個 log 系統」的延伸功能,但 Raindrop 的 Simulations 提醒我一件更根本的事：當 Agent 任務長度每七個月翻倍、一次執行橫跨數天,「上線後才發現問題」這件事本身的代價正在指數上升——於是「上線前先用生產流量模擬」不再是錦上添花的 QA 流程,而是變成跟前沿實驗室訓練自家模型一樣等級的基礎設施,這也是為什麼連 OpenAI、Anthropic 的研究員會親自下場投資這類公司。

## 參考資料

- [Raindrop Announces Series A and $50M in Total Funding Led by CRV to Protect the World from AI Agent Failures](https://finance.yahoo.com/technology/ai/articles/raindrop-announces-series-50m-total-190300152.html)
- [Raindrop Raises Series A](https://www.thesaasnews.com/news/raindrop-series-a/)
- [Raindrop Series A takes it to $50m for agent monitoring](https://thenextweb.com/news/raindrop-series-a-50m-crv-agent-failures-simulations)
- [Raindrop: Sentry for AI Agents | Y Combinator](https://www.ycombinator.com/companies/raindrop)
