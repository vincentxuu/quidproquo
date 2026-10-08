---
title: "融資速報｜Rein Security Series A $25M"
date: 2026-10-09
category: daily
type: digest
tags: [ai-agent, funding, daily, rein-security, agent-security]
lang: zh-TW
description: "Agent 執行期安全新創 Rein Security 完成 $25M Series A，由 Glilot Capital 與 Sienna Venture Capital 共同領投，用 sidecar 技術即時監控企業 AI Agent 的每個動作"
tldr: "Rein Security 完成 $25M Series A，由 Glilot Capital 與 Sienna Venture Capital 共同領投，總募資來到 $35M。這筆錢代表的趨勢：企業部署 AI Agent 的速度已經超過能安全管控它們的速度，runtime 層的即時監控正在變成下一代基礎設施標配。"
series:
  name: "AI Agent Funding"
  order: 78
---

> 🌏 [English version](/en/posts/daily/2026-10-09-funding-rein-security-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Rein Security（美國紐約／以色列特拉維夫共同總部） |
| 輪次 | Series A |
| 金額 | $25M |
| 領投 | Glilot Capital、Sienna Venture Capital（共同領投） |
| 跟投 | Corner Ventures、Atlacle、RNP Capital Advisors |
| 估值 | 未揭露 |
| 累計融資 | $35M（含 2026 年 1 月的 $8M Seed） |
| 成立年份 | 2024 |
| 員工數 | ~31 人（Calcalist 報導） |

## 這家公司做什麼

Rein Security 是做「Agent 執行期安全」的公司——當企業部署的 AI Agent 在生產環境裡實際執行動作時，Rein 即時監控它跑過的每一行程式碼、碰到的每個資源，在它做出有害行為之前攔截下來。

核心產品用專利的 sidecar 技術在 runtime 層運作，不需要把公司或客戶資料導流經過 gateway 或 proxy。這個架構同時處理兩個方向的風險：一是企業自己做的 Agent 權限過大、行為失控；二是外部攻擊者用 AI 驅動的手法針對這些 Agent 動手，例如藏在 PDF 裡的 prompt injection。Rein 的研究團隊 Agent Breakers 在 Black Hat USA 2026 上示範了如何攻破一家美國前五大零售商的 AI 購物助理，顯示這類風險已經不是理論推演。

目前客戶包括服務逾 24 萬客戶的 Dun & Bradstreet、以及服務逾 300 萬活躍客戶的 Lemonade。自 2026 年 1 月正式發布以來，營收成長 8 倍、客戶數成長 5 倍。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪募資把「Agent 安全」從監控告警（posture/vulnerability management）推向更主動的 runtime 攔截，呼應整個子領域的轉向：安全團隊要的不只是事後知道 Agent 做了什麼，而是在它動手的瞬間就能擋下來。

### 投資人在賭什麼

Glilot Capital 此前投過 Agent 安全同業，對這個子領域的早期判斷力已經累積一輪；Sienna Venture Capital 的邏輯是「現有框架沒有為 Agent 的自主性設計過」。兩家共同領投，賭的是 Rein 的 sidecar 架構能在企業大規模部署 Agent 之前，先卡住這個新基礎設施層的位置。

### 值得觀察的數字

- Gartner 預估 AI 安全市場規模將從 2026 到 2027 年成長 68.7%，來到近 $4.8B，2028 年逼近 $7.7B
- 不到一年營收成長 8 倍、客戶數成長 5 倍，是這輪敢用「成長期」而非「早期概念」敘事募資的底氣
- 同期 Agent 安全同業 Reco 也完成 $55M 融資，顯示這個子領域今年密集吸金，不是單一個案

## Watchlist 狀態

Rein Security 尚未在 watchlist 中。建議加入 section B7（Agent 安全/治理），與 Zenity、Protect AI、Lakera 同組，追蹤重點：runtime sidecar 架構、Fortune 500 客戶滲透率。

## 今日收穫

Rein 不是在賭「企業會不會需要 Agent 安全」，而是在賭「安全要發生在 Agent 動手的那一刻，不是動手之後」——這跟傳統 app 安全先做漏洞掃描、再補救的順序正好相反，說明 Agent 的自主性已經迫使安全產業重排了防守時序。

## 參考資料

- [Rein Security Raises $25 Million to Secure the AI Agents Enterprises Build and Stop the Ones That Attack Them | PRNewswire](https://www.prnewswire.com/news-releases/rein-security-raises-25-million-to-secure-the-ai-agents-enterprises-build-and-stop-the-ones-that-attack-them-302901591.html)
- [Rein Security raises $25 million Series A as companies struggle to control their AI agents | Calcalist](https://www.calcalistech.com/ctechnews/article/rkf52cnimg)
- [Rein Security Raises $25 Million in Series A for AI Agent Controls | TokenPost](https://www.tokenpost.com/news/business/27984)
