---
title: "融資速報｜Mave 完成 $34M 融資（Agentic SecOps 讓 Agent 接管事件調查）"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, funding, daily, mave, agent-security]
lang: zh-TW
description: "Mave 完成 $34M 融資（含 $28M Series A），由 Red Dot Capital Partners 領投，用 AI Agent 串連企業既有安全工具，不集中化資料就能數分鐘內調查 100% 告警"
tldr: "Mave 完成 $34M 融資，其中 $28M 為 Series A，由 Red Dot Capital Partners 領投。這筆錢的信號：SecOps 的下一個戰場不是「買更多安全工具」，而是「讓 Agent 在既有工具之間自己跑完調查」——Mave 的 ARR 一年內成長超過 4 倍，證明企業已經在為「Agent 接手事件調查」付費，不只是概念驗證。"
series:
  name: "AI Agent Funding"
  order: 103
---

> 🌏 [English version](/posts/daily/2026-10-23-funding-mave-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Mave（以色列，特拉維夫） |
| 輪次 | Series A（含先前種子輪，表中金額為合計公佈金額） |
| 金額 | $34M（其中 $28M 為 Series A，另有先前 $6M 種子輪） |
| 領投 | Red Dot Capital Partners（Series A 領投） |
| 跟投 | Lumir Growth Partners（Series A）；既有投資人 Dell Technologies Capital、Emerge Ventures（原種子輪領投方，本輪加碼） |
| 估值 | 未揭露 |
| 累計融資 | $34M |
| 成立年份 | 2025 |
| 員工數 | ~20–30 人（公司揭露 30+ 人，募資後計劃擴編超過一倍） |

## 這家公司做什麼

Mave 是做「Agentic SecOps」（代理式安全維運）的公司——它讓 AI Agent 串連企業既有、分散的安全工具，在不要求企業把資料集中到單一昂貴資料庫的前提下，自動完成威脅偵測、調查與回應。

核心做法是讓 Agent 以每個安全工具的「原生語言」查詢，即時拉取身份狀態、資產所有權、當下系統設定等傳統 SIEM 查不到的上下文，再把結果整合成一份完整的事件脈絡，在數分鐘內調查 100% 的告警、過濾假警報、辨識相關攻擊活動，並在安全團隊預先設定的規則下執行已核准的回應動作（如隔離系統、停用受駭身份）。底層架構混合了專用工作流程、微調過的小型語言模型（SLM）與前沿大型語言模型（LLM），並記錄每一次查詢、決策與動作以供稽核追溯。

目前客戶包含 Fortune 50 企業與全球 MSSP（受管理安全服務供應商），平台已部署在 200 多個 SOC（安全維運中心）中，服務受高度監管的金融與醫療產業客戶，過去一年 ARR 成長超過 400%，且已拿下多筆七位數規模合約。

## 這筆融資的信號

### 對 Agent 生態的意義

Mave 的定位直接點出傳統 SIEM 架構的限制——SIEM 只能看到被收集進去的那部分資料，而身份狀態、資產所有權、即時系統設定這些關鍵脈絡「活在別處」。Mave 不要求企業搬資料，而是讓 Agent 去「問」每個既有工具，這代表 Agent 安全／SecOps 這個子領域的架構共識正在形成：與其讓企業為 Agent 重建一套新的資料基礎設施，不如讓 Agent 適應企業既有的破碎工具生態。這跟監控「Agent 本身會不會作惡」的行為監控類公司是互補而非競爭的兩層——Mave 管的是「用 Agent 抓攻擊者」，行為監控類公司管的是「企業自己的 Agent 會不會作惡」。

### 投資人在賭什麼

領投方 Red Dot Capital Partners 合夥人 Atad Peled 的說法很直接：「SecOps 市場早該被重新發明。現有平台與想取代它們的新創有同一個缺陷——覆蓋範圍是預算決策，不是安全決策，而且兩者都不是為一個由 AI Agent 運行的世界打造的。」這句話點出的投資邏輯是：傳統 SIEM／SOC 廠商按資料量或座位收費的商業模式，在 AI 加速攻擊速度的環境下已經過時，Red Dot 賭的是「把安全判斷工作從資料層解耦」這個架構選擇本身就是護城河，而非賭單一功能的準確率。兩位創辦人均出身以色列 8200 部隊，CEO 曾任 Wing Security go-to-market 負責人，CTO 曾是 Alterya 第一名員工並在公司被 Chainalysis 收購前升任研發副總，團隊的資安老兵背景也是早期投資人（Dell Technologies Capital、Emerge Ventures）押注的重點。

### 值得觀察的數字

- ARR 一年成長超過 400%，且已有七位數合約——相較於本輪只拿到 $28M Series A（同日另一則融資 Flapping Airplanes 拿到 $1B），顯示 Mave 走的是「用業績證明再擴大」的穩健路線，而非用敘事堆估值
- 平台已部署於 200+ SOC，公司僅 20–30 人，人均服務 SOC 數偏高，反映產品高度自動化、單位經濟規模效益明顯
- 種子輪僅 $6M，Series A 一次跳到 $28M（近 5 倍），在沒有揭露估值的狀況下，金額本身的跳升幅度是目前唯一可比較的信號

## Watchlist 狀態

Mave 尚未在 watchlist 中。建議加入 section B7（Agent 安全/治理/資安技術），與 Zenity、Protect AI、Lakera 等現有公司並列比較，追蹤重點：用 Agent 串連既有安全工具而非集中資料的架構路線，以及 400% ARR 成長率後續能否延續。

## 今日收穫

過去理解「Agent 安全」多半指「防止 Agent 做壞事」（行為監控、護欄），但 Mave 代表的是另一個方向——「用 Agent 去抓壞人」。當攻擊本身已經由 AI 加速到分鐘級，防守方如果還停留在「人工跨系統拼湊證據」的速度，差距只會擴大。Mave 的賭注是：防守方的 Agent 化不是奢侈品，而是跟上攻擊速度的必要條件，這跟「資安預算每年都在成長但美國企業一年因控管失敗損失高達 $300 億」的現實相互呼應。

## 參考資料

- [Mave Raises $34 Million to Build the Agentic SecOps System for the Modern Enterprise](https://www.prnewswire.com/news-releases/mave-raises-34-million-to-build-the-agentic-secops-system-for-the-modern-enterprise-302916859.html)
- [Mave Raises $28M Series A, Bringing Total Funding to $34M for Agentic SecOps](https://www.unite.ai/mave-raises-28m-series-a-34m-funding-agentic-secops/)
- [Mave raises $34M to help enterprises detect and stop cyberattacks using AI agents](https://techstartups.com/2026/10/22/mave-raises-34m-to-help-enterprises-detect-and-stop-cyberattacks-using-ai-agents/)
