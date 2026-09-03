---
title: "融資速報｜AIR Security 兩輪 Seed 合計 $50M"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, funding, daily, air-security, agent-security]
lang: zh-TW
description: "Agent 供應鏈安全新創 AIR Security 出匿蹤，兩輪 Seed 合計募得 $50M，Sequoia 與 Greenoaks 分別領投"
tldr: "AIR Security 出匿蹤，公布兩輪 Seed 合計 $50M，第一輪 $10M 由 Sequoia 領投、第二輪 $40M 由 Greenoaks 領投。這筆錢代表 VC 願意在「Agent 供應鏈安全」這個還沒被驗證營收規模的細分賽道，直接押注創辦人背景與時機，而不等產品先跑出 Series A 等級的成長曲線。"
series:
  name: "AI Agent Funding"
  order: 18
---

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | AIR（AIR Security，以色列 / 美國） |
| 輪次 | Seed（分兩輪合併揭露） |
| 金額 | $50M（第一輪 $10M + 第二輪 $40M） |
| 領投 | Sequoia Capital（第一輪）、Greenoaks（第二輪） |
| 跟投 | Swish, Netz，及天使投資人 Zach Frankel（Cognition 總裁）、Yinon Costica（Wiz 共同創辦人）、Ofir Erlich（Eon 共同創辦人）、Anne Neuberger、Omer Adam、Varun Anand（Clay 共同創辦人） |
| 估值 | 未公布 |
| 累計融資 | $50M（公司剛結束匿蹤模式，此為對外揭露的首輪資金） |
| 成立年份 | 約 2026 年初（CTech 報導稱公司「六個月大」） |
| 員工數 | 約 40 人 |

## 這家公司做什麼

AIR 是做「AI Agent 供應鏈安全」的公司——當企業讓 Agent 存取越來越多系統、越來越多 Skill、外掛與 MCP Server 時，AIR 要當這條供應鏈的守門人，在有害的工具或內容進到 Agent 的 context 之前先攔下來。

平台分三層：先做「可見度」，盤點一家公司環境裡實際在跑的 Agent，同時揪出員工用未經 IT 核准的 AI 工具或私人帳號的情況；再做「即時防火牆」，攔截並分析 Agent 的每一步動作（例如載入某個 Skill、抓取某個網址的內容），阻擋不符安全標準的行為；最後是「白名單」機制，AIR 自己維護一份持續重新驗證的 Skill／外掛清單——因為一個原本核准過的 Skill，可能因為它依賴的套件更新，或開發者帳號被盜，而變成有風險的版本。創辦人 Yair Saban 說，目前平台掃到的外掛與 Skill 裡，約 27% 會被篩掉。

兩位創辦人 Yair Saban（CEO）與 Niv Hoffman（CTO）都出身以色列情報單位 8200 部隊的攻擊型資安背景。公司目前已有 20 多家客戶，約四分之一是大型企業，需求最強的產業是金融服務與製藥業——這兩個產業對「工具鏈是否可信」的敏感度本來就高於一般企業。

## 這筆融資的信號

### 對 Agent 生態的意義

AIR 切入的不是「Agent 本身安不安全」，而是「Agent 用的工具鏈安不安全」——Skill、外掛、MCP Server 這些讓 Agent 連上外部世界的元件，正在形成一條新的軟體供應鏈，卻還沒有像作業系統驅動程式那樣的簽章與驗證機制。Sequoia 合夥人 Bogomil Balkansky 把這個問題定義為「基礎設施問題先於資安問題」：要對企業裡所有 Agent 碰到的每一個 Skill、外掛、MCP Server、子 Agent 做即時、持續的重新驗證，這件事本身的規模與工程難度，比寫一個更好的掃描器要高得多。

### 投資人在賭什麼

值得注意的是這輪資金完全跳過典型的 Series A 驗證關卡——公司甚至還在匿蹤狀態，Sequoia 就先投了第一輪 Seed，隔幾週 Greenoaks 又加碼第二輪。這代表兩家基金押注的是創辦人背景（Unit 8200 攻擊型資安經驗）與市場時機（Agent 大規模上生產環境的窗口正在打開），而非等產品先跑出可驗證的營收曲線。同賽道的 Zenity 一個月前才剛拿下 $125M Series C（見 quidproquo watchlist section B7），Noma Security 去年也拿下 $100M Series B——AIR 用「還沒有 Series A」的階段就吸引到同等級的頂級基金，某種程度上反映這個賽道的競爭已經進入搶時間而非搶驗證的階段。

### 值得觀察的數字

- 兩輪 Seed 合計 $50M，遠高於一般 Seed 輪的規模（Zenity、Noma 這類公司走到 $100M+ 都是在 Series B/C 階段），顯示 Agent 安全賽道的估值起點已經被墊高；
- 20 多家客戶中約 25% 是大型企業，代表產品驗證階段已經越過純 PoC，進到有付費大客戶的階段；
- 平台自稱篩掉約 27% 掃到的 Skill／外掛，這個數字本身也是 AIR 用來說服市場「供應鏈裡真的有風險」的核心證據。

## Watchlist 狀態

AIR 尚未在 watchlist 中。建議加入 section B7（Agent 安全 / 治理 / 資安技術），與已追蹤的 Zenity、Noma Security 同組比較——AIR 的差異化在於用「即時防火牆」保護 Agent 的 context 輸入端，而非 Zenity 走的治理與姿態管理路線，值得後續觀察兩種架構誰先跑出更明確的客戶留存數字。

## 今日收穫

AIR 用「還沒有 Series A」的階段拿到 Sequoia 和 Greenoaks 這種通常只在後期輪才會出現的基金，跟一個月前 Zenity 用成熟 Series C 拿到類似規模的資金放在一起看，說明 Agent 安全這個賽道現在有兩種完全不同的資金邏輯同時運作：一種是等營收曲線出來再重注（Zenity 路線），一種是賭創辦人背景與時機、直接在 Seed 階段就給到後期輪等級的支票（AIR 路線）。這代表市場還沒有共識「哪種架構會贏」，資金反而先在賭「誰會先卡到位置」。

## 參考資料

- [AIR raises $50M to help companies vet the skills and add-ons AI agents use](https://techcrunch.com/2026/09/01/air-raises-50m-to-help-companies-vet-the-skills-and-add-ons-ai-agents-use) — TechCrunch
- [Six-month-old AIR Security raises $50 million to build inline firewall for AI agents](https://www.calcalistech.com/ctechnews/article/r13apdnugg) — CTech (Calcalistech)
