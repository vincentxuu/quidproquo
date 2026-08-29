---
title: "融資速報｜Onyx Security Series B $113M"
date: 2026-08-29
category: daily
tags: [ai-agent, funding, daily, onyx-security, agent-security]
lang: zh-TW
description: "Onyx Security 完成 $113M Series B，由 Bessemer 領投，估值約 $640M——要做「AI Agent 版的 CrowdStrike」"
tldr: "Onyx Security 出關僅四個月就拿下 $113M Series B，由 Bessemer Venture Partners 領投，估值約 $640M。這筆錢代表 VC 把「監控 Agent 每一步推理、在動作生效前攔截」的控制層,視為下一個資安世代的基礎設施。"
series:
  name: "AI Agent Funding"
  order: 15
---

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Onyx Security（美國紐約 / 以色列特拉維夫） |
| 輪次 | Series B |
| 金額 | $113M |
| 領投 | Bessemer Venture Partners |
| 跟投 | Cyberstarts, TCV, Conviction, FirstMark, Vintage Investment Partners, QuantumLight, G Squared |
| 估值 | 約 $640M（Calcalist 估算,官方未正式公布;較出關時的估值「數倍成長」） |
| 累計融資 | $153M（Seed $5M + Series A $35M + 本輪 $113M） |
| 成立年份 | 2024（Series B 公告時稱「創立滿兩年」） |
| 員工數 | 未正式揭露,官方稱團隊橫跨美國與以色列業務開發、工程與行銷 |

## 這家公司做什麼

Onyx Security 是一套「企業版 AI 控制平面」——當公司裡的 AI Agent 開始接觸真實系統時,Onyx 卡在 Agent 和它要操作的工具之間,即時監看 Agent 每一步推理過程,在動作真正生效前先攔截、修正或阻擋。

核心產品用自家專有模型追蹤 Agent 的完整決策鏈,而不只是過濾輸入輸出的文字。系統會找出環境裡所有正在跑的 Agent、記錄各自的行為模式、即時檢查每個動作,一旦某個動作偏離預期就由「守門 Agent」即時判斷放行、改寫或封鎖,必要時才拉人進來確認。目前平台已保護超過 110 萬個 Agent、即時檢查逾 6600 萬次 AI 工作階段(session),客戶橫跨金融、能源、醫療、保險等 Fortune 500 企業,Revolut 是公開客戶之一;Anthropic 也在 2026 年 6 月宣布與 Onyx 整合,協助企業客戶安全導入 AI。

公司由 Maxim Bar Kogan 與 Gil Elbaz 共同創辦,兩人皆出身以色列情報與空軍體系,團隊約 80 人,橫跨以色列、美國與加拿大。

## 這筆融資的信號

### 對 Agent 生態的意義

這筆錢落地的時間點,剛好卡在同一波「Agent 行為治理」資金潮的正中間:Zenity 在 8 月初拿下 $125M Series C、Obsidian Security 8 月拿下 $85M Series D、Alice(原 ActiveFence)8 月拿下 $140M——短短一個月內,至少四家公司在「監控 Agent 實際做了什麼」這個細分賽道裡各自募到九位數資金。這代表 Agent 安全的重心正從「防止模型說錯話」(prompt injection、jailbreak 防護)轉移到「防止 Agent 做錯事」(執行期權限、行為監控、kill switch),而且投資人已經認定這是獨立的預算科目,不是模型安全的附屬功能。

### 投資人在賭什麼

Bessemer 在公開部落格裡把賭注講得很直白:「每一次技術革命都會誕生一家世代級的資安公司——網路誕生了 Palo Alto Networks,端點誕生了 CrowdStrike,雲端誕生了 Wiz。」他們認定 AI Agent 是下一場革命,而 Onyx 有機會成為那家「世代級公司」。Bessemer 從 90 年代就持續押注資安賽道,習慣在產品和營收都還沒成形前就進場——這次是他們把同一套打法用在「Agent 控制平面」這個新類別上。

### 值得觀察的數字

- 出關僅四個月,營收成長四倍,顯示企業導入 Agent 監控的急迫性遠高於一般資安工具的採用速度;
- 累計融資從出關時的 $40M(Seed $5M + Series A $35M)一路衝到 Series B 後的 $153M,估值同期跳到約 $640M,四個月內估值「數倍成長」;
- 保護超過 110 萬個 Agent、檢查逾 6600 萬次 session——這個規模意味著客戶已經在生產環境大量部署 Agent,而不是還在試點階段。

## Watchlist 狀態

Onyx Security 尚未在 watchlist 中。建議加入 section B7(Agent 安全 / 治理 / 資安技術),與 Zenity、Protect AI、Lakera 並列追蹤,追蹤重點:即時 Agent 推理鏈監控與動作攔截、$113M Series B(Bessemer 領投)、Anthropic 官方整合。

## 今日收穫

這輪跟同期 Zenity、Obsidian、Alice 的募資放在一起看,共同點很清楚:沒有一家在賭「更聰明的過濾器」擋住模型講錯話,全部都在賭「攔截 Agent 的動作」才是唯一站得住腳的控制點。邏輯是一旦 Agent 開始用機器速度串接真實系統(拿到憑證、呼叫 API、改資料庫),事前的模型層防護就來不及了——真正能擋下傷害的位置,只剩「動作發生前的最後一道關卡」。這也是為什麼 Bessemer 敢把 Onyx 拿來類比 CrowdStrike:CrowdStrike 賭的不是防毒特徵碼,而是端點上的即時行為監控,邏輯是一樣的,只是把「端點」換成了「Agent」。

## 參考資料

- [Onyx Security Raises $113M Series B to Control Advanced AI](https://finance.yahoo.com/technology/ai/articles/onyx-security-raises-113m-series-210500945.html) — Business Wire（官方新聞稿）
- [Onyx Security: defining cybersecurity in the agentic era](https://www.bvp.com/news/onyx-security-defining-cybersecurity-in-the-agentic-era) — Bessemer Venture Partners（官方公告）
- [AI security startup Onyx raises $113 million Series B at $640 million valuation](https://www.calcalistech.com/ctechnews/article/b1fsjydszg) — Calcalist / Ctech
- [Israeli cyber startup raises $113m to secure and control autonomous AI agents](https://www.timesofisrael.com/israeli-cyber-startup-raises-113m-to-secure-and-control-autonomous-ai-agents/) — The Times of Israel
