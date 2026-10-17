---
title: "融資速報｜Opsin $21M 新一輪（Agent 安全）"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, funding, daily, opsin, agent-security]
lang: zh-TW
description: "Opsin 完成 $21M 新一輪融資，由 SYN Ventures 與 Race Capital 共同領投，把治理焦點從資料外洩擴大到 agent 的行為本身"
tldr: "Opsin 完成 $21M 新一輪融資，由 SYN Ventures 與 Race Capital 共同領投，累計融資約 $28M。這筆錢的信號：企業資安支出正從「agent 能不能存取什麼」擴大到「agent 實際做了什麼」，兩位前資安創業者領投，把 agent 安全視為下一代資安基礎設施層。"
series:
  name: "AI Agent Funding"
  order: 94
---

> 🌏 [English version](/posts/daily/2026-10-18-funding-opsin-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Opsin（美國，加州聖荷西） |
| 輪次 | $21M 新一輪（外部報導未標示輪次字母；前一輪為 $7M Seed） |
| 金額 | $21M |
| 領投 | SYN Ventures、Race Capital（共同領投） |
| 跟投 | 未揭露（公開報導僅提及兩家領投方） |
| 估值 | 未揭露 |
| 累計融資 | 約 $28M（前一輪 $7M Seed ＋ 本次 $21M） |
| 成立年份 | 2024 |
| 員工數 | ~20 人（Business Insider） |

## 這家公司做什麼

Opsin 是做「AI agent 行為治理」的資安公司——當企業員工用 Microsoft Copilot、Claude、ChatGPT Enterprise、Gemini 等工具自己搭 agent 時，Opsin 幫資安團隊看清楚這些 agent 到底在做什麼、能存取什麼、有沒有偏離原本設計的目的。

核心產品是一個叫 Risk Graph 的治理平台：先把不同平台對 agent 的分類方式統一成單一的 agent 模型，再把 agent 的身分、權限、資料存取、工具呼叫、即時行為串成一張持續學習的風險圖譜。當 agent 的行為跨出政策邊界，Opsin 可以隔離該 agent、擋下該次操作，或通知 agent 擁有者去修正——定位自己是從「資料外洩防護」升級到「行為治理」。創辦人 James Pham（MIT 畢業）與 Oz Wasserman 都曾在 Abnormal Security 共事，2022 年離開後找上工程背景的 Jeremy Mailen 一起創辦 Opsin。

目前服務近 20 家企業客戶，橫跨醫療、金融服務、製造等受監管產業，包括 Culligan、Barry-Wehmiller、Wellstar Health System、UiPath。Opsin 自己分析客戶的 agent 活動後發現：93% 存在風險失衡的工具連接擁有完整、不受限的系統存取權限，而只有 1/200 的操作需要先取得人工核准——這組數字是這次融資公吿裡最具體的市場證據。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪錢主要拿去擴編銷售與工程團隊、加速 Risk Graph 的產品開發。值得注意的是公開報導裡沒有人提到正式的輪次字母，也沒有揭露估值——對比同期不少 AI 資安公司高調公布估值倍數，Opsin 選擇把敘事重心放在「93% 失衡工具擁有完整存取權」這類具體風險數字上，而不是融資規模本身。這呼應了一個更大的轉變：隨著企業把更多工作實際交給 agent 去做，資安預算正從「agent 能存取什麼」的靜態權限審查，擴大到「agent 實際做了什麼」的即時行為監控——這正是 Opsin 把自己定位成「agent 安全第二代」的理由。

### 投資人在賭什麼

兩位領投合夥人都是資安老兵出身，而不是純財務投資人。Race Capital 的 Alfred Chuang 是 BEA Systems 共同創辦人兼前 CEO，2001 年把公司做到以 $8.5B 賣給 Oracle，2020 年才轉做創投；SYN Ventures 的 Glenn Chisholm 則是 SaaS 資安公司 Obsidian Security 的共同創辦人兼前 CEO。兩人過去都是「把一家企業軟體／資安公司做大做出場」的操盤者，而非單純財務型 VC——這類背景的投資人押注 Opsin，等於是在賭「agent 安全」會重演當年 SaaS 資安（Obsidian）或企業中介軟體（BEA）的成長曲線：先有一波新的運算範式（agent 自主行動），再長出一層對應的治理基礎設施。

### 值得觀察的數字

- 93% 的風險失衡工具連接擁有完整、不受限的系統存取權，只有 1/200 的操作需要人工核准——這個比例如果在更大樣本上成立，代表多數企業部署 agent 時其實完全沒有設置最小權限原則，等同於資安界公認最危險的設定錯誤被普遍套用在新的 agent 層。
- 公司從 2024 年成立到完成 $21M 新一輪僅約兩年，期間已累積近 20 家企業客戶（含 Fortune 500 等級的 UiPath、Wellstar Health System）——落地速度快於典型資安新創，反映企業對「agent 失控」的焦慮已經轉換成實際採購預算，而非還停留在觀望階段。
- 本輪沒有揭露估值與個別跟投方，是本系列近期報導的融資案中少見的低透明度案例，但兩家領投方合夥人的操盤背景（BEA $8.5B 出場、Obsidian Security 創辦與出場）本身就是另一種「背書」訊號，彌補了財務數字的空白。

## Watchlist 狀態

Opsin 尚未在 watchlist 中。建議加入 section B7（Agent 安全／治理／資安技術，目前收錄 ZenGuard 等同類公司），追蹤重點：Risk Graph 治理模型（識別 agent 身分／權限／行為並即時隔離風險）、93% 工具過度授權的客戶數據、$21M 新一輪未揭露估值但領投方具操盤級資安創業背景。

## 今日收穫

這輪融資最耐人尋味的不是金額本身，而是兩位領投合夥人的背景——他們不是先當投資人再學資安，而是先把資安／企業軟體公司做大出場，才轉身去投下一個世代的同類問題。這代表在「agent 安全」這個還沒有標準答案的新賽道裡，市場現在更相信「曾經解決過同類問題的操盤手」判斷力，勝過單純看財務指標的早期估值模型。

## 參考資料

- [Opsin Security Raises $21M to Secure Enterprise AI Agents（官方公告）](https://www.opsinsecurity.com/blog/opsin-raises-21m-to-expand-its-risk-protection-layer)
- [This startup raised $21 million to clean up the AI agent mess hitting companies（Business Insider）](https://www.businessinsider.com/opsin-expands-21-m-to-tackle-ai-agents-in-businesses-2026-10)
- [Opsin Raises $21 Million Led By SYN Ventures And Race Capital For AI Agent Security（Pulse2）](https://pulse2.com/opsin-raises-21-million-led-by-syn-ventures-and-race-capital-for-ai-agent-security/)
