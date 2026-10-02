---
title: "融資速報｜Supabase 加碼 $150M 收購 Turso，4 個月內第二次擴大 Agent 資料庫版圖"
date: 2026-10-03
category: daily
type: digest
tags: [ai-agent, funding, daily, supabase, ai-infrastructure]
lang: zh-TW
description: "開源 Postgres 平台 Supabase 在 6 月 $500M Series F 後再拿下 GIC 領投的 $150M 加碼資金，同步收購資料庫新創 Turso，瞄準 AI Agent 大量、即時建立資料庫的需求"
tldr: "Supabase 完成由 GIC 領投的 $150M 新一輪資金，距離 6 月的 $500M Series F 僅 4 個月，同步收購 Turso 以支援 Agent 大量建立隔離資料庫的工作負載。這筆錢代表的趨勢是：後端基礎設施的客戶正從人類開發者快速轉向會自己開資料庫的 AI Agent，籌資節奏被迫跟著 Agent 的用量曲線加速。"
series:
  name: "AI Agent Funding"
  order: 64
---

> 🌏 [English version](/en/posts/daily/2026-10-03-funding-supabase-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Supabase（美國，舊金山 / 新加坡） |
| 輪次 | 新一輪資金（Series F 加碼延伸，距原始輪僅 4 個月） |
| 金額 | $150M |
| 領投 | GIC |
| 跟投 | CapitalG（Alphabet 旗下成長基金）、IronArc、SquarePeg |
| 估值 | 延續 2026 年 6 月 Series F 的 $10.5B（本輪未公布新估值） |
| 累計融資 | 約 $1.19B（2026 年 6 月 Series F $500M 時累計 $1.04B，加上本輪 $150M） |
| 成立年份 | 2020 年（創辦人 Paul Copplestone、Ant Wilson） |
| 員工數 | 約 350 人（2026 年中數據） |

## 這家公司做什麼

Supabase 是開源的 Postgres 後端服務平台——把資料庫、身分驗證、檔案儲存、Edge Functions、即時訂閱和向量搜尋打包成一套可以在週末就上線的後端，定位是「開源版 Firebase」。

核心產品圍繞 PostgreSQL 打造完整後端堆疊，目前已有超過 1,300 萬名開發者使用，250,000 多家企業客戶包括 PwC、麥當勞、GitHub Next 和 Mozilla。2026 年最大的變化是客戶結構:超過一半的新資料庫是由 AI 工具自動建立，Claude Code 更是當年最大的資料庫建立來源之一，Cursor、Bolt.new、Lovable 等「vibe coding」工具也都把 Supabase 當成預設後端。

這次同步宣布收購 Turso——一家做隨需資料庫基礎設施的公司，技術上能讓系統在不幫每個資料庫配一台獨立機器的情況下,大量產生隔離的資料庫實例,客戶包括 Superhuman、Sauna.ai 和 Mastra。兩家公司合併後,Supabase 要解決的問題是:當 Agent 每個任務都要開一個新資料庫時,傳統「每個資料庫對應一台機器」的供應模式規模會撐不住。

## 這筆融資的信號

### 對 Agent 生態的意義

這是 Supabase 在 7 個月內第三次對外募資(2025 年 10 月 Series E、2026 年 6 月 Series F、現在這輪),募資間隔越來越短,直接反映的是用量曲線本身在加速,而不是單純追逐估值。官方公告把自己定位為「agentic infrastructure 的領導者」,而不是「開發者工具公司」,顯示後端基礎設施賽道的敘事已經從「服務人類開發者」轉向「服務會自己寫程式、自己開資料庫的 Agent」。Turso 收購補的正是這個場景下最先撐不住的一塊:單一資料庫的建立與管理成本,必須隨 Agent 數量線性甚至超線性下降。

### 投資人在賭什麼

GIC 在 4 個月內兩次加碼同一家公司(6 月領投 $500M Series F,10 月再領投這輪 $150M),顯示它判斷 Supabase 的成長曲線還沒被前一輪定價完全反映。CapitalG 是 Alphabet 的獨立成長基金,過去投資邏輯偏好已經有清楚企業採用曲線、而非早期概念驗證的公司——Supabase 250,000+ 的客戶數和 70% AI 工具建立資料庫的比例,符合這個「規模已經起來,賭的是能不能守住」的階段。

### 值得觀察的數字

- ARR 從 2025 年的 $70M 成長到 2026 年估計 $170M,年增約 143%,但估值從 Series E 的 $5B 到 Series F 的 $10.5B 僅 8 個月內翻倍,估值成長速度快於營收成長速度
- 資料庫新建數量年增 600%,其中 60-70% 由 AI 工具或 Agent 自動建立(來源因統計口徑略有差異),是這輪募資敘事的核心證據
- 累計融資 7 輪約 $1.04B(至 Series F)在 6 年內完成,其中後 3 輪($200M Series D、約 $100-143M Series E、$500M Series F)在 14 個月內密集完成,籌資節奏明顯加速

## Watchlist 狀態

Supabase 和 Turso 均尚未在 watchlist 中。建議將 Supabase 加入 watchlist,歸類到接近 B4(Agent 記憶 / Context)或新增「Agent 資料層」子類別,追蹤重點:開源 Postgres 後端 + Agent 大量建立隔離資料庫的供給能力,本輪 $150M 加碼 + 收購 Turso。

## 今日收穫

這輪融資的特別之處不是金額,而是節奏:Supabase 在 4 個月內從 $500M Series F 又加碼 $150M,說明當客戶從「人類開發者」換成「自己開資料庫的 Agent」之後,連募資週期都被迫跟著 Agent 的用量曲線縮短——基礎設施公司的成長節奏,正在被它服務的非人類使用者重新定義。

## 參考資料

- [Supabase Announces $150M in New Funding and Turso Acquisition](https://www.prnewswire.com/news-releases/supabase-announces-150m-in-new-funding-and-turso-acquisition-302896752.html)
- [Supabase Raises $150 Million and Acquires Turso to Scale Agentic Database Infrastructure](https://www.tipranks.com/news/private-companies/supabase-raises-150-million-and-acquires-turso-to-scale-agentic-database-infrastructure)
- [Supabase Raises $150 Million, Acquires Turso to Scale Agentic Databases](https://www.citybiz.co/article/913344/supabase-raises-150-million-acquires-turso-to-scale-agentic-databases)
- [Supabase Revenue, Valuation, Funding & Investors | Multiples](https://multiples.vc/private-comps/supabase)
