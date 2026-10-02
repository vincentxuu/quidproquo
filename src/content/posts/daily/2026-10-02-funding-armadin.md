---
title: "融資速報｜Armadin Series B $255.5M，用 AI Agent 打 AI Agent 的攻防賽局"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, funding, daily, armadin, agent-security]
lang: zh-TW
description: "Mandiant 創辦人 Kevin Mandia 的新創 Armadin 完成 a16z 與 Accel 共同領投的 $255.5M Series B，估值衝破 $2.5B，用自主 AI Agent 群組扮演攻擊者，七個月內融了 $445M"
tldr: "Armadin 完成 $255.5M Series B，由 a16z 與 Accel 共同領投，估值超過 $2.5B。這輪錢代表的趨勢是：當 AI 讓攻擊者找漏洞、串攻擊鏈的速度快過人類紅隊能反應的速度時，「用 AI Agent 打 AI Agent」正從概念驗證變成資本願意重注的獨立賽道。"
series:
  name: "AI Agent Funding"
  order: 61
---

> 🌏 [English version](/en/posts/daily/2026-10-02-funding-armadin-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Armadin（美國） |
| 輪次 | Series B |
| 金額 | $255.5M |
| 領投 | Andreessen Horowitz（a16z）、Accel（共同領投） |
| 跟投 | Bain Capital Ventures、Redpoint（新投資人）；8VC、Ballistic Ventures、Google Ventures、In-Q-Tel、Kleiner Perkins、Menlo Ventures（既有投資人回投） |
| 估值 | 超過 $2.5B（上一輪 2026 年 3 月正式launch 時募得 $189.9M，未揭露估值） |
| 累計融資 | $445M |
| 成立年份 | 2025（2025 年 9 月由 Kevin Mandia 創辦，2025 年底先拿 $24M Seed，2026 年 3 月才正式公開launch） |
| 員工數 | launch 時約 60+ 人（CNBC，2026 年 3 月數據，目前未更新） |

## 這家公司做什麼

Armadin 是做「自主攻擊性安全（autonomous offensive security）」的公司——它不是像傳統滲透測試公司那樣派人定期手動攻打客戶系統，而是派一群自主 AI Agent 24 小時扮演攻擊者，持續在客戶的攻擊面上尋找、串接漏洞。

核心產品是一套「自主 Agent 群組」，用推理能力模仿熟練攻擊者的思路，把個別看起來風險不高的弱點串成完整的攻擊鏈——從邊界的未授權遠端程式碼執行、到橫向移動、最後拿下整個雲端環境的控制權。企業與政府的安全團隊因此能看到「今天這一刻」真實可被利用的攻擊路徑與影響範圍，在對手動手前先補起來。創辦人 Kevin Mandia 曾創辦 Mandiant，2014 年以 $1B 賣給 FireEye，FireEye／Mandiant 後來又在 2022 年被 Google 以 $5.4B 收購。

目前客戶包含多家財星 500 大企業與政府機構，launch 後七個月內已在生產環境執行「agentic attack campaigns」。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪融資最值得注意的不是金額，而是它標誌著一個新賽道正式成形——「用 AI Agent 攻擊，來訓練 AI Agent 防守」。隨著前沿模型把「漏洞公開到可用攻擊程式」的時間大幅壓縮，傳統的週期性滲透測試與各自獨立評分的掃描器都已經跟不上節奏；Armadin 賭的是，唯一能跟上攻擊者速度的防禦，就是每天拿最好的攻擊能力去訓練它。這跟同屬 Agent 安全領域、但走防守／治理路線的 Zenity、Lakera 等公司形成明顯對比——Armadin 選的是進攻路線。

### 投資人在賭什麼

a16z 合夥人 David George 的說法很直接：「每一次重大平台轉移都會造就新一代的安全領導者，AI 是我們見過最大的轉移。」他們押注的其實是 Kevin Mandia 本人的信譽——他曾親自處理過史上最重大的幾次資安事件，又成功把 Mandiant 賣到 Google。Accel 合夥人 Ping Li 則從 Series A 就一路加碼，說明 Accel 看重的是「用 AI 驅動的攻擊性安全」這個定位能不能在賽道還沒被巨頭卡位前先確立標準。

### 值得觀察的數字

- 從 2025 年 9 月創辦、2025 年底 $24M Seed、2026 年 3 月 launch 募得 $189.9M，到這輪 $255.5M Series B，總融資 $445M 只花了約一年，速度遠高於一般資安新創
- 七個月前正式公開 launch 時都還沒揭露估值，這輪 Series B 一次跳到 $2.5B，是典型「資本追著敘事跑」的估值曲線
- 作為對比，前述融資速報樣本中同屬 Agent 安全領域的 ZenGuard Series B 僅 $50M、估值 $400M；Armadin 的金額與估值都高出 5 倍以上，顯示市場對「進攻型」Agent 安全敘事的溢價明顯更高於「防守型」

## Watchlist 狀態

Armadin 尚未在 watchlist 中。建議加入 section B7（Agent 安全／治理），但需標註它與該 section 現有公司（Zenity、Lakera、Noma Security 等防守／治理路線）的路線差異——Armadin 走的是「自主攻擊性安全」，追蹤重點放在：這種「用 Agent 攻擊換防禦」的模式會不會催生監管或責任歸屬爭議（畢竟客戶等於授權一群自主 Agent 持續對自己系統發起真實攻擊）。

## 今日收穫

Armadin 這輪融資提醒了一件容易被忽略的事：Agent 安全市場目前絕大多數敘事都在講「怎麼防住失控的 Agent」，但 Armadin 走的是完全相反的路——「用失控邊緣的 Agent 去主動找自己的破洞」。當攻防兩端都開始用 Agent 對打，安全產業原本「防守永遠慢攻擊一步」的假設,可能會被重新定義成「誰的 Agent 群組推理得更快、更像真正的攻擊者」。

## 參考資料

- [AI cybersecurity startup Armadin valued at over $2.5 billion after new funding round](https://www.reuters.com/legal/transactional/ai-cybersecurity-startup-armadin-valued-over-25-billion-after-new-funding-round-2026-10-01)
- [Exclusive | AI Cyber Startup Armadin Raises $255.5 Million Amid Funding Surge](https://www.wsj.com/pro/cybersecurity/ai-cyber-startup-armadin-raises-255-million-f5e8f52a)
- [Armadin Raises $255.5 Million Series B to Scale Effective Autonomous Security](https://www.prnewswire.com/news-releases/armadin-raises-255-5-million-series-b-to-scale-effective-autonomous-security-302895278.html)
- [Kevin Mandia raised $190 million Armadin after prior sale to Google](https://www.cnbc.com/2026/03/10/kevin-mandia-raised-190-million-armadin-after-prior-sale-to-google.html)
