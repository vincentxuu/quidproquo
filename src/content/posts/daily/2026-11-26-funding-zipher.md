---
title: "融資速報｜Zipher Series A $45M，用 Agent 管理企業資料工作負載"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, funding, daily, zipher, agent-infrastructure]
lang: zh-TW
description: "以色列新創 Zipher 完成 $45M Series A（累計 $53M），由 Maor Investments 與 Glilot Capital 共同領投，用 AI Agent 自主決定企業資料工作負載怎麼跑"
tldr: "Zipher 完成 $45M Series A（連同種子輪累計 $53M），由 Maor Investments 與 Glilot Capital 共同領投，讓 AI Agent 自主決定企業資料工作負載的運算資源、框架與排程。Hertz 等 Fortune 500 客戶回報運算成本降 25–40%，信號是資料基礎設施的下一層要為「Agent 製造的工作負載」重新設計。"
series:
  name: "AI Agent Funding"
  order: 154
---

> :globe: [English version](/posts/daily/2026-11-26-funding-zipher-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Zipher（以色列／美國，Tel Aviv、New York） |
| 輪次 | Series A |
| 金額 | $45M |
| 領投 | Maor Investments、Glilot Capital（透過早期成長基金 Glilot+ 共同領投） |
| 跟投 | TLV Partners（原種子輪領投方回投） |
| 估值 | 未揭露 |
| 累計融資 | $53M（$8M 種子輪，2024/8，TLV Partners 領投；$45M Series A） |
| 成立年份 | 2024 |
| 員工數 | ~40 人（紐約、特拉維夫兩地辦公室） |

## 這家公司做什麼

Zipher 是幫企業資料平台裝上「自主決策層」的公司——不是給人用的 BI 工具，是給 AI Agent 用的資料基礎設施。由以色列情報單位 Unit 8200 退役的 Dan Coster（CEO）與 Yoav Gill Ben Ephraim（CTO，前 Payoneer 資料平台負責人、曾在 Microsoft 任職）在 2024 年共同創立。

核心產品讓企業只需設定效能目標、SLA 與預算，Zipher 的 Agent 就自動決定每個資料處理任務怎麼跑：選運算引擎、配置資源、挑框架、排程執行,甚至重寫程式碼與語法。平台跑在 AWS、Azure、Google Cloud 三大雲上，串接 dbt、Databricks Workflows、Apache Airflow、Azure Data Factory 與 Terraform 等既有工具鏈，整個決策過程不需要資料團隊手動介入。

目前客戶包含多家 Fortune 500 企業，租車公司 Hertz 是公開案例——其企業資料分析與 BI 平台主管回報運算成本降低 25% 到 40%。Zipher 對外宣稱整體 Fortune 500 客戶平均有 40–60% 的成本效率提升、SLA 達成率改善達 80%，多數客戶在導入兩週內就看到效果；這些數字是公司自己提供的,不是第三方獨立測試結果。

```diagram
title: Zipher 累計融資：$8M 種子輪 → $45M Series A
desc: Zipher 從 2024/8 的 $8M 種子輪，到 2026/11 的 $45M Series A，單輪規模放大逾 5.6 倍，累計融資 $53M。
caption: 資料來源：Calcalist、SiliconANGLE、Pulse2（2026/11 報導）。換算：基線 y=300，每 $1M 對應 5 單位，縱軸從 0 起。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">金額（$M）</text>
  <line class="dg-grid" x1="72" y1="75" x2="612" y2="75"/>
  <line class="dg-grid" x1="72" y1="188" x2="612" y2="188"/>
  <text class="dg-small" x="64" y="75" text-anchor="end" dominant-baseline="central">45</text>
  <text class="dg-small" x="64" y="188" text-anchor="end" dominant-baseline="central">22.5</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="180" y="260" width="80" height="40"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="380" y="75" width="80" height="225"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="220" y="250" text-anchor="middle" dominant-baseline="central">8</text>
  <text class="dg-label dg-text--accent" x="420" y="65" text-anchor="middle" dominant-baseline="central">45</text>

  <text class="dg-sub" x="220" y="320" text-anchor="middle" dominant-baseline="central">2024/8 種子輪</text>
  <text class="dg-label dg-text--accent" x="420" y="320" text-anchor="middle" dominant-baseline="central">2026/11 Series A</text>
</svg>
```

## 這筆融資的信號

### 對 Agent 生態的意義

這輪資金將投入三個方向：擴大研發團隊、加強北美銷售與市場團隊支援擴張,以及把業務延伸到歐洲、中東非洲、拉丁美洲與亞太。CEO Coster 把定位說得很直接——他們要解決的是 Snowflake、Databricks 這類資料平台公司不碰的問題：不是儲存和算力本身,而是「誰來替暴增的 Agent 工作負載做決策」。這代表資料基礎設施的競爭正在往上多長出一層——人類工程師原本手動調校的工作,現在變成一塊獨立的 Agent 決策層市場。

### 投資人在賭什麼

Glilot Capital 共同創辦人 Arik Kleinstein 的說法點出了這輪投資邏輯:「幾年內大多數企業工作負載會由 Agent 建立，不是人。企業將停止購買給團隊操作的基礎設施工具，轉而購買結果——每個工作負載都要按時、按預算完成，而且沒有人在旁邊看著。」他強調 Zipher 從第一天就能交出省錢成果,且不犧牲 SLA 或可靠性，這個「立即 ROI」是 Glilot 透過早期成長基金 Glilot+ 加碼的理由。Maor Investments 合夥人 Ilai Pines 則強調對創辦團隊的信心:「資料基礎設施已經複雜到人工管理不了，自主化是必然的下一步。」兩家機構都是以色列本地基礎設施/資安賽道的常見投資方，押注的是「技術團隊能不能把自主決策做到企業敢用」。

### 值得觀察的數字

- 從 2024/8 的 $8M 種子輪到現在的 $45M Series A，單輪規模放大超過 5.6 倍，顯示投資人對「Agent 專用資料基礎設施」這個子賽道的信心正在快速堆高。
- 40 人團隊募到 $53M，平均每人對應超過 $1.3M 資金——對一家仍在建基礎設施層、客戶數未公開的公司來說,是偏高的資本密度,反映這類底層基礎設施的研發成本本身就高。
- Hertz 公開的 25–40% 成本降幅，低於公司宣稱的整體 Fortune 500 客戶平均 40–60%——兩個數字出自同一間公司，落差值得後續追蹤是否只是客戶間差異，還是宣傳數字偏樂觀。

## Watchlist 狀態

Zipher 尚未在 watchlist 中。建議加入 section D7（Data Analytics / BI），追蹤重點：Agent 自主決策的資料工作負載基礎設施，$45M Series A，Maor Investments 與 Glilot Capital 領投，Fortune 500 客戶包含 Hertz。

## 今日收穫

Snowflake、Databricks 解決的是「人要怎麼查資料」，Zipher 賭的是另一個問題:當發出資料工作負載的不再是少數工程師、而是大量自主運作的 Agent，誰來一個一個幫這些工作負載挑引擎、配資源、抓預算？這層「吸收 Agent 製造出來的混亂」的基礎設施,聽起來不炫，但可能比 Agent 本身的智能更快變成剛需。

## 參考資料

- [Zipher lands $53M to put AI agents, not data engineers, in charge of data workloads](https://siliconangle.com/2026/11/24/zipher-lands-53m-to-put-ai-agents-not-data-engineers-in-charge-of-data-workloads)
- [Zipher A Data Analytics Platform Built For Agents Raises $53 Million](https://forbes.com/sites/timkeary/2026/11/24/zipher-a-data-platform-built-by-agents-for-agents-raises-53-million)
- [Israeli startup Zipher raises $45 million Series A to automate corporate data infrastructure](https://calcalistech.com/ctechnews/article/bkreuwq1xg)
- [Zipher Secures $53 Million To Automate How Companies Run Cloud Data Workloads](https://pulse2.com/zipher-secures-53-million-to-automate-how-companies-run-cloud-data-workloads)
- [AI agents data infrastructure co Zipher raises $53m](https://en.globes.co.il/en/article-ai-agents-data-infrastructure-co-zipher-raises-53m-1001564675)
