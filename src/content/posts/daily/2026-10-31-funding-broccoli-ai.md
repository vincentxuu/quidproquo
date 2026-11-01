---
title: "融資速報｜Broccoli AI Series B $30M（居家服務業 AI agent，Khosla Ventures 連續領投）"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, funding, daily, broccoli-ai, home-services]
lang: zh-TW
description: "水管工／HVAC／電工等居家服務業前台 AI agent Broccoli AI 完成 $30M Series B，Khosla Ventures 連續兩輪領投，營收自 Series A 起成長三倍，員工數一年內從 15 人衝到 150 人"
tldr: "Broccoli AI 完成 $30M Series B，加上同次首次揭露的 $22M Series A，累計 Series A+B $52M，由 Khosla Ventures 連續領投。這筆錢的信號：vertical agent 的下一個戰場不是再卷一個 coding agent，而是深入藍領、中小企業市場，讓 AI 變成水管工、HVAC 師傅的「幽靈辦公室員工」。"
series:
  name: "AI Agent Funding"
  order: 117
---

> 🌏 [English version](/posts/daily/2026-10-31-funding-broccoli-ai-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Broccoli AI（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $30M |
| 領投 | Khosla Ventures |
| 跟投 | Y Combinator, Operator Partners |
| 估值 | 約 $300M（據傳聞消息來源，公司未證實；前一輪估值未揭露） |
| 累計融資 | $53.5M（YC 種子輪 $1.5M + Series A $22M + Series B $30M，Series A 為本次揭露時首次公開） |
| 成立年份 | 2024（創辦人 2024 年 1 月抵達舊金山，原為電動車 API 創業後轉型） |
| 員工數 | 150+ 人（12 個月前約 15 人，10 倍成長） |

## 這家公司做什麼

Broccoli AI 是做居家服務業（水管工、HVAC、電工）前台自動化的 AI agent 公司——它賣的不是聊天機器人,而是直接接起客戶來電、把工單寫進業主原本就在用的排班軟體、追蹤未成交的估價單、並提醒客戶續約保養合約的 agent。

核心差異化在於「不要業主改習慣」：Broccoli 不要求業主換掉現有的排班/記帳系統,而是把 agent 接進既有工作流程裡,處理掉業主口中「下午五點後沒人接電話」「技師寫完估價單沒人追」這類最惱人的瑣事。目前超過 1,500 家企業在用,包括 Ace Hardware Home Services、Mr. Electric、Any Hour Group,過去七個月也從水管/HVAC/電工擴展到屋頂、泳池維護、車庫門、居家裝修等類別。

兩位創辦人 AJ Jain 與 Aditya Ketkar 是印度 BITS Pilani 的同學,2024 年初抵達舊金山前,先做過校園外送 app、面試培訓班、歐洲電動車 API 等多次創業嘗試都未能規模化。2024 年 5、6 月,兩人帶著筆記本(不帶電腦)走訪北加州約 140 家承包商店面,最終在沙加緬度水管行 Armstrong Plumbing 找到第一位客戶 Marcelle Flowers——她後來成為 Broccoli 的 COO。公司說 AI 目前能處理約 80% 的任務,相當於一間典型承包商辦公室 30% 的人力工作量,剩下 20%(漏水、火災等緊急狀況)仍轉給真人處理。

## 這筆融資的信號

### 對 Agent 生態的意義

Broccoli 證明 vertical agent 不需要靠自建新基礎設施取勝——它直接插進業主原本就在用的排班/記帳軟體,把 agent 當成「幽靈辦公室員工」而非換掉整套系統。更值得注意的是創辦人的打法：不是先寫程式再找客戶,而是先帶著筆記本蹲在水管行裡幾個月,用真人觀察換取 domain knowledge,再回頭寫程式。這代表 vertical agent 下一階段的競爭優勢,可能不在模型本身,而在「創辦人願不願意花時間搞懂一個傳統產業怎麼運作」。

### 投資人在賭什麼

Khosla Ventures 連續兩輪(Series A、Series B)都親自領投,中間只隔九個月,顯示對成長曲線的信心沒有因為第一輪後觀望而動搖。Khosla 長期偏好「長尾中小企業市場規模夠大、但軟體滲透率低」的賽道——居家服務業在美國是數千億美元規模的分散市場,多數業主連雲端排班系統都還沒上,留給 AI agent 切入的空間遠比已經被 SaaS 卷過的企業軟體市場大。

### 值得觀察的數字

```diagram
title: Broccoli AI 累計融資：YC 種子輪到 Series B
desc: Broccoli AI 先前只公開過 YC 種子輪 150 萬美元，本次連同 Series B 一併首次揭露 Series A 的 2200 萬美元，九個月後的 Series B 則達 3000 萬美元，三輪皆由 Khosla Ventures（A、B 輪）與 Y Combinator 參與。
caption: 數字依 Fortune（2026-10-28）報導整理；縱軸從 0 起算，網域 0–32（US$M），k=(300−60)÷32=7.5，長條頂 y=300−金額×7.5。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">融資金額（US$M）</text>
  <line class="dg-grid" x1="72" y1="225" x2="612" y2="225"/>
  <line class="dg-grid" x1="72" y1="150" x2="612" y2="150"/>
  <text class="dg-small" x="64" y="225" text-anchor="end" dominant-baseline="central">10</text>
  <text class="dg-small" x="64" y="150" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="105" y="289" width="90" height="11"/>
    <rect class="dg-bar dg-bar--soft" x="275" y="135" width="90" height="165"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="445" y="75" width="90" height="225"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="150" y="279" text-anchor="middle" dominant-baseline="central">$1.5M</text>
  <text class="dg-sub" x="320" y="125" text-anchor="middle" dominant-baseline="central">$22M</text>
  <text class="dg-label dg-text--accent" x="490" y="65" text-anchor="middle" dominant-baseline="central">$30M</text>

  <text class="dg-sub" x="150" y="320" text-anchor="middle" dominant-baseline="central">YC 種子輪</text>
  <text class="dg-sub" x="320" y="320" text-anchor="middle" dominant-baseline="central">Series A</text>
  <text class="dg-label dg-text--accent" x="490" y="320" text-anchor="middle" dominant-baseline="central">Series B</text>
</svg>
```

- 員工數一年內從 15 人成長到 150 人以上,10 倍成長速度遠超過一般 Series B 階段公司
- 營收自 Series A 起成長三倍(公司未揭露絕對數字);Y Combinator 另揭露 Broccoli 預訂金額(booking)年化run rate 已超過 $10 億,預估年底 ARR 將超過 $60M
- 累計融資 $53.5M 換來約 $300M 估值(倍數約 5.6x),相對這波 AI 融資熱潮中動輒 20-50x 的估值倍數明顯保守,反映投資人對「服務密集、毛利結構接近傳統 SaaS」的 vertical agent 公司估值邏輯仍偏謹慎

## Watchlist 狀態

Broccoli AI 尚未在 watchlist 中。目前 296 家清單裡沒有專門對應「居家服務業 AI agent」的 section,建議加入最相近的 D11(Workflow 自動化),追蹤重點：居家服務業(水管/HVAC/電工)前台 agent,接電話、排班、估價追蹤,Khosla Ventures 連續領投 A、B 輪。

## 今日收穫

Broccoli 兩位創辦人的履歷裡有好幾次創業失敗,共同點是都想靠「更聰明的技術」取勝,直到他們放下電腦、帶著筆記本在水管行蹲了三個月,才找到真正能規模化的產品。這提醒我們：vertical agent 的護城河往往不是模型能力(人人都能接 API),而是「有沒有人願意花時間真正搞懂一個傳統產業的日常」——這件事無法用更多運算資源加速,只能用時間換。

## 參考資料

- [Meet the Baby Boomer whose life changed when 2 Gen Z AI founders walked into her plumbing business](https://fortune.com/2026/10/28/broccoli-ai-funding-khosla-ventures-marcelle-flowers-plumbing-gen-z-founders/)
- [Broccoli AI Raises $52 Million Across Series A and B Rounds at $300 Million Valuation](https://www.globalstartupsinsights.com/funding/san-francisco/broccoli-ai-raises-52-million-across-series-a-and-b-rounds-at-300-million-valuation/)
- [Startup Funding News Today, October 29, 2026](https://techstartups.com/2026/10/29/startup-funding-news-today-october-29-2026-braid-casap-furiosaai-upwind-foundry-robotics-plato-more/)
- [Armstrong Plumbing Helped Broccoli AI Build Its Call Product](https://www.tokenpost.com/news/business/42843)
