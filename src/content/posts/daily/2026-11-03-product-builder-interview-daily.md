---
title: "Product Builder 面試日練 — 2026-11-03：Metrics & Analytics"
date: 2026-11-03
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: zh-TW
description: "用 AARRR 海盜指標定位問題落在哪個漏斗階段，再用 OEC（整體評估準則）框架判斷一個營收暴增的 A/B 測試能不能上線，案例是 Bing 一個放了半年的廣告標題改版，真上線測出年化破億美元營收。"
tldr: "今天的練習題是外送 App 完成訂單單週掉 12%，但真正的重點不是背出 AARRR 這五個字母，是練習怎麼把一個籠統的『訂單掉了』定位到漏斗的哪一段——是新使用者打開 App 的那一步（Acquisition/Activation），還是老使用者回購的那一步（Retention），因為兩種掉法要查的方向完全不同。第二個框架是 OEC（Overall Evaluation Criterion，整體評估準則）：A/B 測試不能只看單一主要指標有沒有漲，因為主要指標可能用犧牲使用者體驗換來的短期暴增，所以要同時盯著一組護欄指標，確認漲幅不是拿長期信任去換的。案例是 Ron Kohavi 與 Stefan Thomke 在 Harvard Business Review 公開的第一手敘述：Bing 一個把廣告標題和第二行文字合併顯示的改版想法，在待辦清單裡放了半年才排進測試，一上線監控系統就跳出『好得不像真的』警報——營收漲幅遠超預期，團隊第一反應不是慶祝，是先排查是不是記錄重複計算的 bug，排查後確認沒有 bug，再檢查護欄指標（使用者體驗相關數字）有沒有被犧牲，確認沒有之後才正式上線，年化貢獻超過一億美元，是 Bing 史上單一改版帶來最大的營收成長。"
series:
  name: "Product Builder 面試日練"
  order: 76
---

> 🌏 [English version](/posts/daily/2026-11-03-product-builder-interview-daily-en)

## 今日主題

Metrics 面試最容易讓人掉分的地方，不是算錯一個百分比，是看到「指標掉了」或「指標漲了」就直接下結論。指標掉了，要先定位是漏斗的哪一段出問題，因為新使用者卡住和老使用者流失要查的方向完全不同；指標漲了也不能直接慶祝，因為漲幅可能是犧牲了使用者體驗換來的短期假象。今天用兩個框架練這兩件事：AARRR 海盜指標負責定位問題發生在漏斗的哪一站，OEC（整體評估準則）負責判斷一個漂亮的 A/B 測試結果能不能真的上線。

## 核心框架速記

### 框架一：AARRR 海盜指標

把使用者從第一次接觸產品到帶來營收的全程，拆成五個階段，每個階段對應不同的卡住方式與查法：

| 階段 | 問題 | 常見指標 |
|---|---|---|
| **A**cquisition 獲取 | 使用者從哪裡來，來了多少 | 新安裝數、各管道轉換率 |
| **A**ctivation 啟動 | 第一次使用有沒有摸到核心價值 | 完成註冊到首次下單的轉換率 |
| **R**etention 留存 | 會不會回來用第二次、第三次 | 次週留存率、回購率 |
| **R**eferral 推薦 | 會不會主動帶新使用者進來 | 邀請碼使用率、口碑轉換率 |
| **R**evenue 營收 | 能不能從使用行為中賺到錢 | 客單價、付費轉換率 |

一個「完成訂單掉了」的指標，可能是 Acquisition 端新使用者變少、Activation 端新使用者下單失敗率升高，也可能是 Retention 端老使用者不回購——三種掉法的根因完全不同，面試官期待你先講清楚是哪一段，再往下挖。

### 框架二：OEC（Overall Evaluation Criterion，整體評估準則）

A/B 測試不能只盯一個主要指標。Ron Kohavi（前 Bing 實驗平台負責人）提出的做法是：每個實驗先定義一個 OEC，它通常是一個主要指標（例如營收）加上一組護欄指標（例如頁面載入速度、使用者回訪率、客訴量）。主要指標負責回答「這個改版有沒有用」，護欄指標負責回答「這個改版有沒有偷偷犧牲了什麼」——因為搜尋引擎永遠可以用多塞廣告的方式短期衝高營收，但長期會把使用者推走，單看營收這一個數字會被騙。

## 今日練習題

### 題目

「一個外送 App 的完成訂單數，單週掉了 12%，你會怎麼查？」（來源：PMMockr 練習題庫，官方標註為原創假設性練習題，非驗證雇主真題）

### 拆解思路

1. **釐清問題**：先問面試官「完成訂單」的定義——是下單後成功出餐，還是出餐後成功送達？再問這 12% 是相對整體大盤的季節性波動，還是明顯偏離過去趨勢的異常掉幅，避免把正常的週期波動誤判成事故。
2. **驗證指標本身**：在深挖原因前，先排除是埋點或計算邏輯出錯——例如某次改版後「完成」狀態的判定條件被改掉，導致數字看起來掉了，但使用者體感沒變。
3. **用 AARRR 定位漏斗段**：把掉幅拆到開單數（Acquisition/Activation，有多少人打開 App 並嘗試下單）與完成率（從下單到成功送達的轉換率）兩段，分別看是哪一段在掉——開單數沒掉但完成率掉，問題在供給端或物流端；開單數本身就掉，問題在前端入口或獲客管道。
4. **分段定位**：針對確認掉幅的那一段，再用地區、裝置、付款方式、餐廳類別切一次，找出掉幅是不是集中在某個子群——例如只在某個城市掉，很可能是當地運力或某個合作餐廳出問題，不是全站性的產品缺陷。
5. **排序假設並行動**：把需求端（使用者不想下單）、供給端（餐廳或騎手不足）、可靠度（App 當機、付款失敗）三類假設按影響範圍排序，先查影響範圍最大的那一類，找到根因後定出修復動作與驗證方式，而不是看到一個像的原因就直接結案。

### 範例回答（面試時可以這樣講）

> **先定義，再定位**：「我會先跟面試官確認『完成訂單』是出餐完成還是送達完成，還要確認 12% 是跟上週比，還是跟去年同期比——因為外送本身有明顯的週間與節日波動，我不想把季節性當成事故來查。假設確認後是真的異常掉幅，我會先排除埋點問題，看看是不是某次後端改版動到了訂單狀態的判定邏輯。」
>
> **用漏斗定位，不要一次查全部**：「接著我會把掉幅拆到兩段——有多少人打開 App 並送出訂單，跟送出訂單後有多少成功送達。如果開單數沒變，問題在完成率這一段，通常是供給端（餐廳出餐慢、騎手不足）或可靠度（付款失敗、系統逾時）；如果開單數本身就掉了，問題更可能在前端入口或某個獲客管道出狀況。我會先切地區跟裝置看掉幅是不是集中的——全站性的掉幅跟只在某個城市掉的掉幅，代表的問題規模完全不同。」
>
> **收在行動與驗證**：「假設切下去後發現只在某個城市的完成率掉，我會先去查那個城市最近有沒有運力或合作餐廳異動，找到根因後不會只做一次性修復，我會定一個領先指標——像是那個城市的平均出餐等待時間——持續觀察完成率有沒有回到正常區間，而不是看到數字回升一天就結案。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有沒有先釐清指標定義，排除埋點或計算邏輯出錯 | |
| 有沒有用漏斗把掉幅定位到具體哪一段，而不是籠統地說「查一下」 | |
| 有沒有用地區/裝置/子群再切一次，確認掉幅是不是集中的 | |
| 假設有沒有分需求/供給/可靠度三類，按影響範圍排序查 | |
| 有沒有定出修復後的驗證方式，不是查到原因就結案 | |
| 加分項：有沒有區分「正常季節性波動」跟「真異常」的判斷標準 | |

## 今日案例

**Bing：一個放了半年的小改版，年化貢獻超過一億美元營收，但差點被自己的警報系統擋下來**

Ron Kohavi 與 Stefan Thomke 在 Harvard Business Review 公開的敘述裡講過一個經典案例：2012 年，一位 Bing 工程師提出一個小改版——把廣告標題和第二行文字合併成一行更長的標題。這個想法在優先順序清單裡放了半年都沒人排，因為看起來太小，不像值得優先投入的改版。終於排進測試後，A/B 實驗一上線，監控系統就跳出「好得不像真的」警報——營收漲幅遠超正常範圍。多數團隊看到這種異常漲幅會想直接慶祝，但 Bing 的團隊第一反應是懷疑這是 bug，先去排查是不是記錄重複計算或追蹤邏輯出錯。排查確認沒有 bug 之後，團隊沒有就此結案，而是接著檢查 OEC 裡的護欄指標——使用者體驗相關的數字（例如使用者有沒有因為頁面變擠而提前離開）有沒有被犧牲。確認護欄指標沒有被犧牲，這個改版才正式上線，最終營收漲幅達 12%，換算年化貢獻超過一億美元，是 Bing 史上單一改版帶來最大的營收成長。

```diagram
title: Bing 廣告標題測試的護欄指標判斷
desc: 一個放了半年的小改版，正式上線測試後觸發營收暴增警報，團隊沒有直接慶祝，而是先排除 bug、再確認護欄指標沒有被犧牲，最後才正式上線。
caption: 案例與數字出自 Kohavi、Thomke 於 Harvard Business Review 的第一手敘述：正式上線後年化貢獻超過一億美元營收。
step: 合併廣告標題與第二行文字的改版想法，在待辦清單裡放了半年
step: 終於排進排程，正式跑 A/B 測試
step: 監控系統跳出「好得不像真的」警報，營收漲幅遠超預期
step: 團隊先假設是 bug 或重複計算，排查記錄與計算邏輯
step: 排查後確認沒有 bug，接著檢查護欄指標——使用者體驗數字有沒有被犧牲
step: 護欄指標沒有被犧牲，確認是真實效果，正式上線，年化貢獻超過一億美元營收
---
<svg viewBox="0 0 440 520">
  <path class="dg-line" d="M220 66V96" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M220 152V182" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M220 238V268" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M220 324V354" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line" d="M220 410V440" marker-end="url(#arrow)" data-step="6"/>

  <g data-step="1">
    <rect class="dg-box" x="70" y="10" width="300" height="56" rx="6"/>
    <text class="dg-label" x="220" y="29" text-anchor="middle" dominant-baseline="central">想法在待辦清單</text>
    <text class="dg-sub" x="220" y="49" text-anchor="middle" dominant-baseline="central">合併標題與第二行，放了半年</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="70" y="96" width="300" height="56" rx="6"/>
    <text class="dg-label" x="220" y="115" text-anchor="middle" dominant-baseline="central">跑 A/B 測試</text>
    <text class="dg-sub" x="220" y="135" text-anchor="middle" dominant-baseline="central">終於排入實驗排程</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="70" y="182" width="300" height="56" rx="6"/>
    <text class="dg-label" x="220" y="201" text-anchor="middle" dominant-baseline="central">觸發警報</text>
    <text class="dg-sub" x="220" y="221" text-anchor="middle" dominant-baseline="central">好得不像真的，營收漲幅異常</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="70" y="268" width="300" height="56" rx="6"/>
    <text class="dg-label" x="220" y="287" text-anchor="middle" dominant-baseline="central">排查 bug</text>
    <text class="dg-sub" x="220" y="307" text-anchor="middle" dominant-baseline="central">檢查記錄與計算邏輯</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="70" y="354" width="300" height="56" rx="6"/>
    <text class="dg-label" x="220" y="373" text-anchor="middle" dominant-baseline="central">檢查護欄指標</text>
    <text class="dg-sub" x="220" y="393" text-anchor="middle" dominant-baseline="central">使用者體驗數字沒被犧牲</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--store" x="70" y="440" width="300" height="56" rx="6"/>
    <text class="dg-label" x="220" y="459" text-anchor="middle" dominant-baseline="central">正式上線</text>
    <text class="dg-sub" x="220" y="479" text-anchor="middle" dominant-baseline="central">年化貢獻超過一億美元營收</text>
  </g>
</svg>
```

**面試連結**：這個案例可以直接拿來回答「你怎麼判斷一個 A/B 測試結果能不能信？」——很多人會答「看 p-value 顯著就信」，但顯著不代表安全，顯著的營收漲幅也可能是犧牲使用者體驗換來的。Bing 的做法示範了一個更完整的答案：異常漂亮的結果先當警報處理、排查 bug，再回頭檢查護欄指標有沒有被犧牲，兩關都過了才算數。拿今天的外送題來說，就算查出某個改動讓完成率漲了，也要同時確認客訴量或退單率沒有同步上升，否則漲的只是表面數字。

## 延伸閱讀

- [The Surprising Power of Online Experiments](https://hbr.org/2017/09/the-surprising-power-of-online-experiments) — Ron Kohavi 與 Stefan Thomke 在 Harvard Business Review 的原文，今天案例的完整敘述與 OEC 概念出處。
- [Large Scale Experimentation at Bing](https://blogs.bing.com/search-quality-insights/2013/8/Large-Scale-Experimentation-at-Bing) — Bing 官方部落格說明護欄指標如何在大規模實驗平台裡自動偵測異常。
- [PM Interview Questions by Skill Area](https://www.pmmockr.com/pm-interview-questions) — 今天練習題的原始題庫，附其他 metrics、strategy、execution 類練習題與解法大綱可以接著練。

## 參考資料

- [The Surprising Power of Online Experiments](https://hbr.org/2017/09/the-surprising-power-of-online-experiments) — Bing 廣告標題測試案例、12% 營收漲幅與年化破億美元數字的原始出處。
- [Large Scale Experimentation at Bing](https://blogs.bing.com/search-quality-insights/2013/8/Large-Scale-Experimentation-at-Bing) — OEC 與護欄指標在 Bing 實驗平台的實作說明。
- [PM Interview Questions by Skill Area](https://www.pmmockr.com/pm-interview-questions) — 練習題「外送 App 完成訂單單週掉 12%」出處，收錄於站內 metrics（analytics）分類的練習題，官方標註為原創假設性練習題。
