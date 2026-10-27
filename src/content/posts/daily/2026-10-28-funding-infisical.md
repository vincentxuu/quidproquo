---
title: "融資速報｜Infisical Series B $40M（Elad Gil 連續兩輪領投，押注 Agent 憑證安全）"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, funding, daily, infisical, agent-security]
lang: zh-TW
description: "開源機密管理平台 Infisical 完成 $40M Series B，估值 $600M，由 Elad Gil 連續第二輪領投，核心賣點是讓 AI agent 存取企業系統時不需要真正拿到密碼"
tldr: "Infisical 完成 $40M Series B，估值 $600M，由 Elad Gil 連續第二輪領投，Gradient 與 Y Combinator 跟投。這筆錢的信號：當 AI agent 變成企業裡一種新的「使用者」，傳統「把密碼交給它」的存取模式本身就是漏洞，Infisical 賭的是機密管理會從開發者工具變成 Agent 安全的必要基礎設施。"
series:
  name: "AI Agent Funding"
  order: 110
---

> 🌏 [English version](/posts/daily/2026-10-28-funding-infisical-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Infisical（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $40M |
| 領投 | Elad Gil |
| 跟投 | Gradient, Y Combinator |
| 估值 | $600M（Series A 未揭露估值，無法估算漲幅） |
| 累計融資 | 約 $59.3M（Series A 前累積 $19.3M + 本輪 $40M） |
| 成立年份 | 2022 |
| 員工數 | ~20 人（Pitchbook） |

## 這家公司做什麼

Infisical 是做機密管理（secrets management）的資安基礎設施公司——幫企業集中管理 API 金鑰、憑證、資料庫密碼這些敏感憑證，並在開發流程、CI/CD pipeline 與雲端基礎設施裡安全地注入這些機密，不用再把密碼寫死在設定檔或到處複製貼上。

核心產品是開源的機密管理平台，近年擴展到憑證管理（certificate management）與 SSH 金鑰管理，現在的重點轉向「Agent Vault」：讓企業在不把真正密碼交給 AI agent 的前提下，仍能授權 agent 存取關鍵系統——用可隨時撤銷、範圍受限的動態憑證取代永久性密鑰，確保 agent 即使被攻擊或誤用，也無法把憑證外洩給其他工具或 LLM 供應商。

目前客戶超過 1,300 家、30 萬名開發人員使用，開源專案累積超過 3 萬顆 GitHub star，每天保護 100 億筆機密資料。客戶包括 Airbus、Volkswagen、Hugging Face、OpenRouter、Wise 等。

## 這筆融資的信號

### 對 Agent 生態的意義

AI agent 正在成為企業裡一種新型的「使用者」——它們需要存取原始碼、資料庫、雲端基礎設施才能完成任務，但又不能像人類員工一樣被信任直接持有密碼。Infisical 的 Agent Vault 想解決的正是這個落差：把「給 agent 的存取權」和「給 agent 的密碼」拆開。這筆錢會用在擴大工程與銷售團隊，並把既有的機密管理基礎設施進一步往 Agent 專屬的憑證層延伸。

### 投資人在賭什麼

Elad Gil 連續兩輪領投 Infisical（Series A $16M、這次 Series B $40M），他的說法是「AI agent 正在成為企業裡全新一類的使用者，確保它們的存取安全將是下個十年最大的資安挑戰之一」。相較於從零開始講 Agent 安全故事的新創，Infisical 是先用機密管理站穩開發者工具的位置，再把既有的大規模開源分發基礎（3 萬+ star、30 萬開發者）轉向 Agent 場景——這是 Elad Gil 一貫偏好的「市場需求已驗證，再加 AI 題材」路線。

### 值得觀察的數字

- 3 萬+ GitHub star、1,300+ 客戶、30 萬開發者、每天保護 100 億筆機密——代表的是一個已經有大規模分發基礎的開源專案在往 Agent 安全轉型，而不是從零建立使用者基礎
- Series A（2025 年 6 月，$16M）到這次 Series B 之間不到一年半，同一位投資人連續兩輪領投，反映的是對執行力的持續信心，而不是單輪賭注

## Watchlist 狀態

Infisical 尚未在 watchlist 中。建議加入 section B7（Agent 安全/治理/資安技術），追蹤重點：Agent 憑證/機密管理（Agent Vault）、Elad Gil 連續領投。

## 今日收穫

多數 Agent 安全新創都是從「監控 agent 的行為」切入，但 Infisical 的路線是從更底層的「agent 根本不該拿到密碼」下手——這其實是用機密管理這個成熟類別去重新定義 Agent 安全的邊界，而不是在 agent runtime 上疊加一層新的監控產品。

## 參考資料

- [Infisical Raises $40 Million at $600 Million Valuation to Secure the AI Agent Economy](https://www.prnewswire.com/news-releases/infisical-raises-40-million-at-600-million-valuation-to-secure-the-ai-agent-economy-302920994.html)
- [This $600 Million Startup Is Helping Keep Company Secrets Away From AI Agents](https://www.forbes.com/sites/rashishrivastava/2026/10/27/this-600-million-startup-is-helping-keep-company-secrets-away-from-ai-agents/)
