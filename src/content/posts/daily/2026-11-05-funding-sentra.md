---
title: "融資速報｜Sentra Series C $150M（Capital One Ventures 領投，守住 AI Agent 能碰到的企業資料）"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, funding, daily, sentra, agent-security]
lang: zh-TW
description: "以色列資安新創 Sentra 完成 $150M Series C，由 Capital One Ventures 領投，專注在 AI agent 能存取哪些企業資料的治理層"
tldr: "Sentra 完成 $150M Series C，由 Capital One Ventures 領投並進董事會，累計融資超過 $260M。這筆錢代表企業開始把「AI agent 能碰到哪些資料」當成獨立的資安投資項目，而不是等事後再補救。"
series:
  name: "AI Agent Funding"
  order: 124
---

> 🌏 [English version](/posts/daily/2026-11-05-funding-sentra-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Sentra（以色列特拉維夫／美國紐約雙總部） |
| 輪次 | Series C |
| 金額 | $150M |
| 領投 | Capital One Ventures（同時取得董事會席次） |
| 跟投 | Bessemer Venture Partners、Zeev Ventures、Standard Investments、Munich Re Ventures、Key1 Capital（皆為既有投資人加碼） |
| 估值 | 未揭露 |
| 累計融資 | $260M+ |
| 成立年份 | 2021 |
| 員工數 | 未揭露 |

## 這家公司做什麼

Sentra 是一家資料安全公司,專長是搞清楚企業的敏感資料存放在哪裡、誰（包括哪個 AI agent）能碰到它,而不是等 agent 做壞事之後才去補救。

核心產品圍繞「資料優先」的治理邏輯:先對客戶的雲端資料做分類（哪些是 PII、財務資料、機密文件),再疊一張身分地圖——記錄哪些人類使用者、服務帳號、AI agent 分別繼承了哪些存取權限。當某個 agent 的行為出現異常,系統能回頭還原「這個 agent 當時能碰到哪些資料」給資安團隊調查,而不是像多數同類產品把重心放在監控 agent 執行時的即時行為。整個流程在客戶自己的環境內運作,敏感資料不會傳到 Sentra。兩位創辦人 Asaf Kochan（前以色列情報單位 8200 部隊指揮官）與 Yoav Regev（前 8200 網路部門負責人）都是資安老兵,2021 年創立公司。過去一年營收成長超過 300%。

## 這筆融資的信號

### 對 Agent 生態的意義

Sentra 這輪補上的是企業部署 AI agent 時容易漏掉的一塊:多數「Agent 安全」新創(像 Zenity、WitnessAI)盯的是 agent 執行時做了什麼動作;Sentra 反過來從資料端下手——agent 能不能先天就碰不到它不該碰的東西,事後出問題時能不能馬上查清楚它碰過哪些資料。兩種角度正在同時拿到大額資金,顯示企業買盤認為這是互補的兩層防線,而不是二選一。

```diagram
title: Sentra 的資料優先治理
desc: AI agent 要存取企業資料前，先經過身分與權限地圖檢查，只放行已核准的最小存取範圍；事故發生時可回頭還原這個 agent 當時碰過哪些資料。
caption: 簡化示意：實際產品依客戶環境設定規則，細節因部署而異。
step: AI agent 發出資料存取請求
step: 比對身分地圖與最小必要權限範圍
step: 核准範圍內放行，範圍外擋下或標記
step: 事故發生時回頭還原這個 agent 當時碰過哪些資料
---
<svg viewBox="0 0 440 240">
  <rect class="dg-box" x="8" y="92" width="112" height="56" rx="6" data-step="1"/>
  <text class="dg-label" x="64" y="111" text-anchor="middle" dominant-baseline="central" data-step="1">AI agent</text>
  <text class="dg-sub" x="64" y="131" text-anchor="middle" dominant-baseline="central" data-step="1">發出存取請求</text>

  <path class="dg-line" d="M120 120H164" marker-end="url(#arrow)" data-step="2"/>

  <rect class="dg-box dg-box--accent" x="164" y="92" width="112" height="56" rx="6" data-step="2"/>
  <text class="dg-label" x="220" y="111" text-anchor="middle" dominant-baseline="central" data-step="2">權限地圖</text>
  <text class="dg-sub" x="220" y="131" text-anchor="middle" dominant-baseline="central" data-step="2">比對最小必要範圍</text>

  <path class="dg-line" d="M276 120H320" marker-end="url(#arrow)" data-step="3"/>

  <rect class="dg-box" x="320" y="92" width="112" height="56" rx="6" data-step="3"/>
  <text class="dg-label" x="376" y="111" text-anchor="middle" dominant-baseline="central" data-step="3">放行／擋下</text>
  <text class="dg-sub" x="376" y="131" text-anchor="middle" dominant-baseline="central" data-step="3">範圍外標記</text>

  <path class="dg-line dg-line--dashed" d="M376 148V196H64V148" marker-end="url(#arrow)" data-step="4"/>
  <text class="dg-edge" x="220" y="212" text-anchor="middle" dominant-baseline="central" data-step="4">事故發生時回頭還原存取紀錄</text>
</svg>
```

### 投資人在賭什麼

領投方 Capital One Ventures 是銀行自有創投,直接取得董事會席次,代表這不只是財務投資,也是金融業對「企業內部怎麼管 AI agent 碰資料」這個問題的策略布局——金融業是對資料存取稽核要求最嚴的產業之一。既有投資人 Bessemer、Zeev Ventures 等全數回頭加碼,顯示這些早期投資人對公司 300% 年成長的信心沒有動搖。值得注意的是對照組 Zenity 在今年 8 月也拿到 Norwest 領投的 $125M Series C,兩家公司几乎同時在資安大廠眼中變成「AI agent 治理」賽道裡的頭部玩家,只是切入角度不同(Zenity 偏行為監控,Sentra 偏資料治理)。

### 值得觀察的數字

- 累計融資突破 $260M,是公司 2021 年成立以來融資規模最大的一輪,也是本輪與前一輪($50M Series B,2025 年 4 月)之間相隔僅約一年半,融資節奏明顯加快
- 過去一年營收成長超過 300%,是公司連續第二輪融資公告裡提到的同一個成長數字,顯示成長曲線尚未出現明顯放緩
- $150M 在以色列企業軟體 Series C 交易裡排進第 95 百分位(Dealroom 統計),反映市場對「AI agent 資料治理」這個細分賽道的溢價程度不低於 Agent 安全賽道其他玩家

## Watchlist 狀態

Sentra 尚未在 watchlist 中。建議加入 section B7（Agent 安全/治理/資安技術），但需註記:現有 B7 名單裡的 Zenity、WitnessAI、Noma Security 多數從「agent 行為監控」角度切入,Sentra 是少見的「資料優先」治理路線——先管好資料能不能被碰到,而不是盯著 agent 執行時做了什麼,追蹤重點建議標註為「資料存取治理」以便跟其他 B7 公司的「行為監控」區分。

## 今日收穫

Sentra 跟 Zenity 幾乎同時拿到同等級的大額融資,但解法完全相反——這代表「Agent 安全」還沒有收斂成單一的標準答案,市場目前同時買「先管資料」跟「先管行為」兩種賭法,而不是把其中一種當成輸家淘汰掉。

## 參考資料

- [AI Security Startup Sentra Raises $150 Million to Police Autonomous Agents](https://www.wsj.com/pro/cybersecurity/ai-security-startup-sentra-raises-150-million-to-police-autonomous-agents-4ab9da29)
- [Sentra raises $150M to control what AI agents can reach in corporate data](https://siliconangle.com/2026/11/04/sentra-raises-150m-to-control-what-ai-agents-can-reach-in-corporate-data)
- [Agentic Data Security Firm Sentra Raises $150 Million](https://www.securityweek.com/agentic-data-security-firm-sentra-raises-150-million)
