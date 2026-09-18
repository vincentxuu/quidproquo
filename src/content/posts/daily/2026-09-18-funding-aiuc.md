---
title: "融資速報｜AIUC Series A $40M，替 AI Agent 做稽核與保險"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, funding, daily, aiuc, agent-security]
lang: zh-TW
description: "AI Agent 稽核與保險新創 AIUC 完成 $40M Series A，由 Ribbit Capital 領投，用 SOC 2 式的認證標準把 Agent 風險變成可承保的資產"
tldr: "AIUC 完成 $40M Series A，由 Ribbit Capital 領投，累計融資 $55M。這筆錢代表企業級 AI Agent 部署的瓶頸已經從「模型夠不夠聰明」轉移到「風險能不能被稽核與承保」。"
series:
  name: "AI Agent Funding"
  order: 39
---

> 🌏 [English version](/en/posts/daily/2026-09-18-funding-aiuc-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | AIUC / Artificial Intelligence Underwriting Company（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $40M |
| 領投 | Ribbit Capital |
| 跟投 | First Harmonic（另有報導提及 Terrain 參與） |
| 估值 | 未公開（官方新聞稿與多篇報導均未揭露本輪估值數字） |
| 累計融資 | $55M（含 2025 年由 NFDG 領投的 $15M 種子輪） |
| 成立年份 | 創辦人 Rune Kvist、Rajiv Dattani，2025 年中從 stealth 模式公開亮相（另有報導寫 2024） |
| 員工數 | 未公開 |

## 這家公司做什麼

AIUC 是做 AI Agent 風險稽核與保險的公司——它把「這個 Agent 安不安全」這個問題,變成一張可以買保險的稽核報告。

核心產品是 AIUC-1,一套仿照 SOC 2 設計的認證標準,針對每個 Agent 跑約 5,000 組風險與攻擊組合測試,涵蓋 prompt injection、幻覺、資料外洩、未授權操作等情境,每季重新稽核以跟上新出現的威脅。公司的差異化在於「Underwriting」——AIUC 不只發認證,還與 Lloyd's of London 合作,把稽核結果直接轉換成實際的保險保單,ElevenLabs 是第一家拿到 AIUC-1 背書保單的公司,保額達 $50M,涵蓋幻覺導致的損失、資料外洩與工具誤操作等風險。

目前已取得 AIUC-1 認證的公司包括 Cursor、ElevenLabs、Harvey、KPMG、Lovable、UiPath 與 Fin,標準本身由超過 250 位來自 Fortune 1000 企業的資安與風險主管透過 AIUC Consortium 共同制定。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪資金的用途很明確:把 AIUC-1 的覆蓋範圍從「Agent 層」擴張到「前沿模型層」。官方新聞稿直接點出企業採用 AI 的瓶頸已經從「模型能力夠不夠」轉移到「證據夠不夠」——很多企業在 pilot 階段就核准了 AI Agent,但卡在資安審查這一關過不去,因為沒有人能保證系統會不會踩線。AIUC 想做的是把這個「信任缺口」變成一個可以量化、可以承保的產業層,而不是留給每家企業各自摸索。

### 投資人在賭什麼

Ribbit Capital 過去十多年專注金融服務領域的信任基礎設施投資,這次領投的邏輯很直接:AI 正在走上金融業曾經走過的路——當一個產業的風險大到無法單靠自律解決時,標準、稽核與保險三者結合才能撐起大規模採用。這與 AIUC 自己引用的電力史類比呼應:當年電線走火問題頻傳,是保險公司出錢成立 Underwriters Laboratories 制定安全標準,UL 標章才因此變成美國家電的預設信任機制。Ribbit 押注的是 AIUC 能複製同樣的路徑,成為 AI Agent 版的 UL。

### 值得觀察的數字

- AIUC-1 的測試組合數達 5,000 組,且每季重新稽核一次——這個更新頻率明顯高於傳統 SOC 2 認證(通常一年一次),反映 Agent 行為的風險面比傳統軟體變化更快
- 種子輪到 A 輪之間只隔了約一年多(2025 年中種子輪 $15M → 2026 年 9 月 A 輪 $40M),融資節奏遠快於多數企業軟體新創的典型週期
- 已認證客戶名單涵蓋 Cursor、ElevenLabs、Harvey、UiPath 等多個不同賽道的頭部 Agent 公司,顯示 AIUC-1 不是綁定單一垂直領域的標準,而是想做跨賽道的通用信任層

## Watchlist 狀態

AIUC 尚未在 watchlist 中。建議加入 section B7（Agent 安全 / 治理 / 資安技術）,追蹤重點：AIUC-1 認證 + Lloyd's of London 保險組合,Series A $40M 由 Ribbit Capital 領投,已有 Cursor、ElevenLabs、Harvey、UiPath 等公司完成認證。

## 今日收穫

多數 Agent 安全新創在做的是「攔截」——在 Agent 犯錯前擋下來；AIUC 選的是「承保」——先假設 Agent 一定會出錯,再把出錯的財務後果轉移給保險市場。這個切入點聰明的地方在於,它不需要說服企業相信 Agent 100% 安全,只需要說服企業「風險已經被定價,你可以買單」,這對急著把 Agent 從 pilot 推向生產環境、但又不敢對自己客戶打包票的企業來說,是一個更容易通過內部審查的說法。

## 參考資料

- [AIUC raises $40M Series A from Ribbit & First Harmonic to build confidence infrastructure for frontier AI](https://www.prnewswire.com/news-releases/aiuc-raises-40m-series-a-from-ribbit--first-harmonic-to-build-confidence-infrastructure-for-frontier-ai-302879036.html)
- [AIUC Raises $40 Million to Certify Enterprise AI Agents](https://www.securityweek.com/aiuc-raises-40-million-to-certify-enterprise-ai-agents/)
- [AIUC Raises $40M to Build the Certification and Insurance Layer That Makes Agent Governance Auditable](https://finance.yahoo.com/technology/ai/articles/aiuc-raises-40m-build-certification-145719739.html)
