---
title: "融資速報｜Metano Seed $12M（Sierra Ventures 領投，AI agent 安全）"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, funding, daily, metano, agent-security]
lang: zh-TW
description: "AI agent 安全新創 Metano 出關隱身模式，完成 $12M 種子輪，Sierra Ventures 領投，用即時情境圖 Hive 統一監控企業內所有 agent 行為"
tldr: "Metano 完成 $12M 種子輪，由 Sierra Ventures 領投，一出關隱身模式即通過 SOC 2 Type 2 與 ISO 27001 認證並正式上線。這筆錢代表 agent 安全這個子領域,正從「單點工具」走向「跨端點、雲端、SaaS 的統一情境層」。"
series:
  name: "AI Agent Funding"
  order: 149
---

> :globe: [English version](/posts/daily/2026-11-21-funding-metano-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Metano（美國，加州 San Jose） |
| 輪次 | Seed |
| 金額 | $12M |
| 領投 | Sierra Ventures |
| 跟投 | Correlation Ventures、High Alpha、360 ONE |
| 估值 | 未揭露 |
| 累計融資 | $12M（首輪對外揭露的資金） |
| 成立年份 | 未揭露（創辦人團隊來自 ServiceNow、Zscaler、Palo Alto Networks、FireEye、Microsoft） |
| 員工數 | 未揭露 |

## 這家公司做什麼

Metano 是做 AI agent 執行期安全防護的公司——當企業把 AI agent 放進端點、程式碼環境、雲端基礎設施和 SaaS 應用裡執行時,Metano 負責發現這些 agent、理解它們在做什麼,並在它們做出危險動作前擋下來。

核心產品分三層:先「發現」——找出企業內所有已核准與未核准的 AI agent、MCP 伺服器、skill 與軟體套件,連同它們的存取權限和潛在風險面一併列出;再用自家的即時情境圖 Hive「理解」——把一次 agent 工作階段裡的任務、身分、工具、資料存取和實際動作串在一起分析,判斷這個 agent 的行為是否符合它原本被賦予的任務;最後「執行」防護——在 agent 實際運作的地方（包括繞過傳統網路閘道的場景）套用集中管理的安全政策,即時擋下危險動作。公司稱其偵測邏輯對應 MITRE ATLAS 與 OWASP Top 10 for Agentic Applications 兩套業界框架,出關當天已完成 SOC 2 Type 2 稽核並取得 ISO 27001:2022 認證。

```diagram
title: Metano 的三層 agent 防護機制
desc: Metano 先發現企業內所有 agent／MCP 伺服器／skill，再用 Hive 情境圖把一次工作階段的任務、身分、工具與動作串起來判斷是否異常，最後在 agent 實際運作的地方套用政策即時阻擋。
caption: 簡化示意：三層依序執行，Hive 是串連前後兩層判斷依據的關鍵層。資料來自 Metano 官方出關公告（2026-11-19）。
---
<svg viewBox="0 0 640 220">
  <path class="dg-line" d="M210 60H390" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M210 170H390" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="30" y="30" width="180" height="60" rx="6"/>
  <text class="dg-label" x="120" y="54" text-anchor="middle" dominant-baseline="central">發現</text>
  <text class="dg-sub" x="120" y="74" text-anchor="middle" dominant-baseline="central">agent／MCP／skill 清單</text>

  <rect class="dg-box dg-box--accent" x="230" y="100" width="180" height="60" rx="6"/>
  <text class="dg-label dg-text--accent" x="320" y="124" text-anchor="middle" dominant-baseline="central">理解（Hive）</text>
  <text class="dg-sub" x="320" y="144" text-anchor="middle" dominant-baseline="central">情境圖判斷行為是否異常</text>

  <rect class="dg-box" x="430" y="30" width="180" height="60" rx="6"/>
  <text class="dg-label" x="520" y="54" text-anchor="middle" dominant-baseline="central">執行防護</text>
  <text class="dg-sub" x="520" y="74" text-anchor="middle" dominant-baseline="central">即時政策擋下危險動作</text>

  <path class="dg-line" d="M320 100V90" marker-end="url(#arrow)" transform="translate(-100,0)"/>
  <path class="dg-line dg-line--accent" d="M320 100V90" marker-end="url(#arrow-accent)" transform="translate(100,0)"/>
</svg>
```

目前已有客戶案例公開,包括印度 IT 服務商 Sigmoid 的資安長在官方稿中表示,Metano 讓公司能「安全地採用 AI,同時降低影子風險與敏感資料外洩」。公司另設有 MARS Labs 研究團隊,專門研究惡意 skill、被竄改的軟體依賴與 MCP 連線漏洞等新型態威脅。

## 這筆融資的信號

### 對 Agent 生態的意義

Metano 出關時強調的差異化不是「多一個掃描工具」,而是「統一情境層」——企業現有的資安產品大多各自保護單一基礎設施層（端點、雲端或 SaaS),缺乏跨層串連 agent 行為的能力。這代表 agent 安全這個子領域正從 2025 年「先把風險點一個個補起來」的階段,進入「用單一情境圖統一判斷」的整合期,跟兩年前雲端資安從單點工具走向 CNAPP（雲端原生應用保護平台）整合的路徑相似。

### 投資人在賭什麼

Sierra Ventures 管理合夥人 Mark Fernandes 在官方稿中直接點名「每一次安全平台轉移都會出現少數幾家掌握新控制點的公司」,把賭注押在 agent 是資安史上最大的平台轉移之一。這個邏輯本身不是新創見——幾乎所有投 agent 安全的 VC 都用類似說法——但 Metano 團隊來自 ServiceNow、Zscaler、Palo Alto Networks、FireEye、Microsoft 等老牌資安公司的背景,是 Sierra 用來說服自己「這團隊知道怎麼把安全產品賣進企業」的具體依據,而不是單純賭題材。

### 值得觀察的數字

- Metano 出關當天已完成 SOC 2 Type 2 稽核並取得 ISO 27001:2022 認證——對一家剛公開募資的種子輪公司而言,這個合規速度明顯快於同階段新創的平均水準,代表團隊從創立第一天就在為進企業銷售做準備,而非先做產品再補規範。
- $12M 種子輪只有 4 家機構投資人（Sierra Ventures 領投,Correlation Ventures、High Alpha、360 ONE 跟投),沒有天使輪或個人投資人名單對外揭露,顯示這輪募資走的是機構對機構的傳統模式,跟近期部分 agent 新創愛找知名天使站台的做法不同。
- 公司提供 30 天免費的 Eval Edition 讓企業資安團隊自行掃描環境——這是「先讓客戶看到自己的風險數字,再談採購」的典型資安銷售策略,代表 Metano 判斷目前市場還在教育階段,而非馬上要搶市占。

## Watchlist 狀態

Metano 尚未在 watchlist 中。建議加入 section B7（agent 安全/治理），與 Zenity、Protect AI、Noma Security 等並列追蹤，重點放在 Hive 跨層情境圖的技術路線與企業採用速度。

## 今日收穫

Metano 選擇在出關當天就同時公布 SOC 2 Type 2 與 ISO 27001 認證,而不是先衝產品、晚點再補規範——這跟多數 agent 新創「先搶市場再補安全」的順序正好相反。對一家賣「安全」給企業的公司來說,認證本身就是產品的一部分,不是附加價值,這點值得其他想賣進企業客戶的 agent 新創參考。

## 參考資料

- [Metano Emerges from Stealth to Unify AI Agent Security Across the Enterprise - Metano](https://metano.ai/resources/metano-emerges-from-stealth)
- [Metano Emerges From Stealth With $12 Million Seed Funding for AI Agent Security Platform - citybiz](https://www.citybiz.co/article/936203/metano-emerges-from-stealth-with-12-million-seed-funding-for-ai-agent-security-platform/)
