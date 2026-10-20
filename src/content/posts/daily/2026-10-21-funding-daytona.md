---
title: "融資速報｜Daytona Series B $60M（AI Agent 專用雲獨角獸）"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, funding, daily, daytona, agent-sandbox]
lang: zh-TW
description: "Daytona 完成 $60M Series B，由 FirstMark 領投，估值達 $1B，主張 AI Agent 需要獨立於傳統雲端架構之外的「Agent 原生」運算基礎設施"
tldr: "Daytona 完成 $60M Series B，FirstMark 領投，估值 $1B。這筆錢的信號：當企業開始部署數千上萬個 AI Agent，雲端運算的單位不再是「給人用的虛擬機」，而是「60 毫秒內生成、用完就丟的 Agent 沙箱」。"
series:
  name: "AI Agent Funding"
  order: 97
---

> 🌏 [English version](/posts/daily/2026-10-21-funding-daytona-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Daytona（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $60M |
| 領投 | FirstMark |
| 跟投 | Stripe 創辦人 Patrick Collison、Shopify 創辦人 Tobi Lütke、Perplexity 創辦人 Aravind Srinivas、Quora 創辦人 Adam D'Angelo、Zoom 創辦人 Eric Yuan，以及 Qualcomm Ventures、Samsung Next、Okta Ventures |
| 估值 | $1B（獨角獸；本輪約 $50M 來自既有投資人加碼） |
| 累計融資 | 約 $91M |
| 成立年份 | 2023 |
| 員工數 | 未揭露 |

## 這家公司做什麼

Daytona 是做「AI Agent 專用雲」的公司——當 AI Agent 需要寫程式、瀏覽網頁或操作企業軟體時，它需要一台電腦來執行這些動作，Daytona 就是在 60 毫秒內生成、設定好、用完即可丟棄的那台虛擬機。

公司 2023 年創立時原本做的是給企業用的軟體開發環境自動化，共同創辦人 Ivan Burazin、Goran Draganić 與 Vedran Jukić 看到 AI Agent 同樣需要電腦後，把原本的客戶群讓給競爭對手、重寫整套產品，在只剩三個月營運資金時重新上線這個「Agent 原生雲」。核心技術差異在速度：傳統雲端供應商（AWS、Azure、GCP）生成一台虛擬機要 30 秒到數分鐘，Daytona 靠預先把設定好的機器快照分散佈署到實體伺服器硬碟，讓 Agent 需要時直接掛載運算資源、恢復快照，把開機時間壓到 60 毫秒，也能把一台執行中的電腦複製成兩台，讓 Agent 同時嘗試不同做法。

目前客戶包含 Anthropic、OpenAI、NVIDIA、Cursor、Cognition、Meta、Cohere 等主要 AI 公司，其中 AI 資料公司 Snorkel 已在平台上佈署超過一百萬個沙箱。公司營收年化成長率在 1 月到 9 月間成長 25 倍，平均每月成長 50.9%。

## 這筆融資的信號

### 對 Agent 生態的意義

Daytona 把自己定位成「下一代基礎設施不是人用的雲，是 Agent 用的雲」——這跟 CoreWeave、Nebius 這類專門做 GPU 訓練與推論的「neocloud」不同，Daytona 的伺服器裝的是傳統 CPU，用來讓 Agent「做事」而不是「思考」。創辦人 Burazin 用 Meta 九月推出的個人助理 Muse 當例子估算：如果 Muse 的每個對話背後都要配一台電腦，要服務一億使用者需要 $28 億的沙箱運算資源——這個數字暗示隨著 Agent 部署規模擴大，運算成本結構會從「GPU 主導」轉向「GPU + 大量 CPU 沙箱」並重。

### 投資人在賭什麼

FirstMark 合夥人 Matt Turck 公開表態「下一次基礎設施轉移，是從以人為中心的雲端原語，轉向 Agent 原生的雲端原語」，把這輪投資定位成基礎設施層級的賭注，而不是單一應用的賭注。跟投名單裡出現 Stripe、Shopify、Perplexity、Zoom、Quora 創辦人等一整排科技公司創辦人，而非典型機構 LP，意味著這些曾經打造過大規模基礎設施的人，個人判斷「Agent 需要專屬運算環境」這個論點成立。

### 值得觀察的數字

- 60 毫秒的沙箱生成時間，相較傳統雲端的 30 秒到數分鐘，快了至少 500 倍，直接對應 Agent 工作負載「短時間、高頻次」的運算特性
- 營收年化成長率 1 月到 9 月間成長 25 倍，平均每月成長率 50.9%，顯示 Agent 沙箱需求目前處於早期爆發階段
- Snorkel 單一客戶就佈署超過一百萬個沙箱，顯示單一企業內部的 Agent 工作負載規模，已經遠超傳統「每人一台虛擬機」的運算假設

## Watchlist 狀態

Daytona 已在 watchlist section B8（沙箱 / 執行環境），與 E2B、Runloop、Cloudflare Sandboxes 同組比較。追蹤重點更新為：$60M Series B、$1B 估值，FirstMark 領投，客戶含 Anthropic、OpenAI、NVIDIA、Cursor、Cognition，60 毫秒沙箱生成速度為核心差異化指標。

## 今日收穫

多數人把「Agent 基礎設施」想成模型推理的延伸，但 Daytona 的賭注是反過來的——模型推理（GPU）只解決 Agent「怎麼想」，Agent 真正要「做事」靠的是 CPU 跑的沙箱，而且這一層的運算需求會隨 Agent 部署規模線性甚至超線性放大。當一家公司能把「給人用的雲」跟「給 Agent 用的雲」切成兩種完全不同的基礎設施產品，還能找到 Stripe、Shopify、Zoom 創辦人集體下注，說明這個切分已經不只是技術論點，是正在發生的資本配置轉移。

## 參考資料

- [Exclusive: Daytona, a startup building the 'agentic cloud,' valued at $1 billion in latest funding round](https://fortune.com/2026/10/20/daytona-startup-building-the-agentic-cloud-valued-at-1-billion-in-latest-funding-round/)
- [Daytona hits $1B valuation with $60M Series B for AI agent cloud](https://tech.eu/2026/10/20/daytona-hits-1b-valuation-with-60m-series-b-for-ai-agent-cloud)
- [Daytona Raises $60M in Series B Funding](https://www.finsmes.com/2026/10/daytona-raises-60m-in-series-b-funding.html)
