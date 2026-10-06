---
title: "融資速報｜Hadrian Series B $40M，用 Agent 互打 Agent 的攻防新戰場"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, funding, daily, hadrian, agent-security]
lang: zh-TW
description: "荷蘭滲透測試新創 Hadrian 完成 Forgepoint Capital International 與 SmartFin 共同領投的 $40M Series B，主打用自家 AI Agent 模擬攻擊者節奏，對抗已經在用 Agent 自動化攻擊鏈的駭客"
tldr: "Hadrian 完成 $40M Series B，由 Forgepoint Capital International 與 SmartFin 共同領投，累計募資達 $65M。這輪錢代表的趨勢是：攻防兩邊都在把人力換成 Agent，資安產業的下一個戰場不是「人 vs. AI」，而是「Agent vs. Agent」。"
series:
  name: "AI Agent Funding"
  order: 71
---

> 🌏 [English version](/en/posts/daily/2026-10-07-funding-hadrian-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Hadrian（荷蘭，阿姆斯特丹） |
| 輪次 | Series B |
| 金額 | $40M |
| 領投 | Forgepoint Capital International, SmartFin |
| 跟投 | HV Capital, Motive Partners, Picus Capital, Oetker Ventures |
| 估值 | 未揭露（官方新聞稿未公布本輪估值） |
| 累計融資 | $65M |
| 成立年份 | 2021 |
| 員工數 | 80+ 人（Forgepoint 官方部落格揭露，橫跨阿姆斯特丹總部與美國、英國辦公室） |

## 這家公司做什麼

Hadrian 是做「Agentic 攻擊面測試」的公司——把企業資安團隊原本要外包給人工滲透測試團隊的工作，換成由 AI Agent 24 小時連續執行。

核心產品分兩塊：Atlas 持續繪製企業對外的數位足跡（攻擊面），用 AI Agent 驗證哪些暴露的資產真正可被利用；Nova 則是隨時可啟動的 Agentic 滲透測試，水準比照甚至超過人工測試。兩個產品共用同一套上下文，資安團隊可以從「持續可見」直接接到「深入測試」，不用每次從頭來。公司引用自家數據：掃描工具抓到的弱點裡只有 0.47% 真正可被利用，意味著團隊平常盯著的告警裡 99.5% 其實不用動作——Hadrian 的賣點就是把這個比例的噪音濾掉。

客戶包括 McKesson、NBC Universal、Francisco Partners、Total Energies、Amadeus、Leroy Merlin、Damen Shipyard 等財星 500 大與跨國企業。創辦人 Rogier Fischer 與 Olivier Beg 從 13 歲就一起在論壇上以白帽駭客身分合作，Fischer 曾創辦並退出歐洲最早的加密貨幣交易所之一 LiteBit，兩人在 2021 年與 Maurice Clin 共同創立 Hadrian。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪募資的時機點很關鍵：新聞稿直接點名 Anthropic 近期揭露犯罪集團與國家級駭客已經在用其模型自動化整條攻擊鏈、自寫零日漏洞，資安攻防的節奏正式進入「機器對機器」。Hadrian 的定位是用 Agent 對抗 Agent——人類只設定任務目標與做最終判斷，中間的掃描、驗證、重複測試全部交給 AI。這代表資安 Agent 的賽道正從「輔助人力」進化成「以 Agent 速度對抗 Agent 速度」，攻防兩端的自動化程度會互相拉抬。

### 投資人在賭什麼

領投方 Forgepoint 和 SmartFin 看中的不是技術新穎度，而是商業驗證：Hadrian 已經打贏多場對抗老牌資安大廠與其他 AI 原生新創的正面技術評測，且企業合約金額與續約率都在成長。SmartFin 合夥人 Saumitra Dubey 的說法直指目標是幫 Hadrian 做成「九位數營收」的全球資安領導者——這不是押注概念，是押注一家已經有付費財星 500 大客戶的公司能不能把規模做大。

### 值得觀察的數字

- 客戶數據顯示只有 0.47% 的掃描工具告警真正可被利用，也就是 99.5% 的告警是噪音——這個數字解釋了為什麼「持續驗證」比「更多掃描」更值錢
- 87% 的企業資安團隊目前仍仰賴人工滲透測試（Hadrian 自家基準報告），代表這個市場的自動化滲透率還很低，上升空間大
- 本輪 $40M 把累計募資推到 $65M，相較於 Zenity（$38M B 輪 + $27M C 輪）等同賽道玩家，Hadrian 單輪金額更大，顯示資安 Agent 賽道的輪次規模正在往上走

## Watchlist 狀態

Hadrian 尚未在 watchlist 中。建議新增至 section B7（Agent 安全/治理/資安技術，與 Zenity、Onyx Security、Cyera、HiddenLayer 同組），追蹤重點：Hadrian 主打的是「攻擊面測試」而非「Agent 運行時監控」，跟 Zenity/Onyx 這類防守 Agent runtime 的公司屬於資安 Agent 賽道裡不同的切入點，值得對照兩種商業模式哪個先規模化。

## 今日收穫

資安產業過去的敘事是「用 AI 幫人類分析師省時間」，Hadrian 和它引用的 Anthropic 威脅報告合在一起看，講的是另一件事：攻擊者已經先把整條攻擊鏈自動化了，防守方如果還停在「AI 輔助人力」，速度上注定輸一截——這輪募資其實是防守方承認「要打 Agent 速度的仗，就得先換上 Agent 速度的武器」。

## 參考資料

- [Hadrian raises $40M to tackle the AI hacking cyber security crisis](https://hadrian.io/blog/hadrian-40m-raised-to-tackle-the-ai-hacking-cyber-security-crisis)
- [Hadrian Raises $40M to Tackle the AI Hacking Cyber Security Crisis](https://www.morningstar.com/news/business-wire/20261006531461/hadrian-raises-40m-to-tackle-the-ai-hacking-cyber-security-crisis)
- [Hadrian: Why We Invested - Forgepoint Capital](https://forgepointcap.com/perspectives/hadrian-why-we-invested)
