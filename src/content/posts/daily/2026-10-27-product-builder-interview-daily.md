---
title: "Product Builder 面試日練 — 2026-10-27：Metrics & Analytics"
date: 2026-10-27
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: zh-TW
description: "用北極星指標的指標樹拆解（廣度／深度／頻率／速度）練一道 metrics diagnostics 真題——Instagram Stories 單日掉 7%，案例是 Spotify 早期把北極星指標從『註冊數』換成『活躍使用者聆聽時長』的真實決定。"
tldr: "Metrics 面試最常考的不是背指標名詞，是拿到一個掉下來的數字時，能不能用一套可重複的程序把它拆開查，而不是憑直覺亂猜原因。今天的核心框架是北極星指標的指標樹拆解——把一個太抽象、單一團隊兩週衝刺內摸不到的北極星指標，拆成廣度、深度、頻率、速度四個可以直接被某個小隊影響的輸入指標，範例取自一個 AI 寫作平台把『每週成功產出的 AI 草稿數』拆成四個槓桿的做法。練習題是 PM 面試圈廣泛引用的 diagnostics 真題：『Instagram Stories 單日掉了 7%，DAU 也掉 5%，你會怎麼查？』,拆解示範先把指標定義釐清、再用地理／平台／用戶群分段定位問題範圍、接著把時間軸和內部改版或外部事件對齊、同時排除埋點或計算邏輯本身出錯的可能，最後才下結論並給出後續監控建議，而不是看到數字掉就急著講故事。案例是 Spotify 在早期擴張階段的真實選擇——如果當時選了『總註冊數』當北極星指標，成長團隊會把力氣全部花在把人拉進門，但 Spotify 選了『活躍使用者的聆聽時長』，讓這個數字同時餵養 Discover Weekly 等演算法推薦、也直接決定免費層的廣告庫存量與付費轉換的自然驅動力，示範了『虛榮指標』和『能擷取真實價值的指標』之間的差別怎麼在真實公司的決策裡發生。"
series:
  name: "Product Builder 面試日練"
  order: 69
---

> 🌏 [English version](/posts/daily/2026-10-27-product-builder-interview-daily-en)

## 今日主題

Metrics 面試考的不是你能不能背出 AARRR 或北極星指標這些名詞——這些名詞 Google 五秒就查得到。真正在考的是，當面試官丟給你一個「某個數字突然掉了」的場景，你能不能用一套可重複的程序把它拆開查，而不是憑直覺講一個聽起來合理的故事就結案。這類題目在 PM 面試裡被稱為 diagnostics（診斷題），和另外四類（success metrics、experimentation、metric definition、trade-off analysis）一起構成 metrics 面試的主要考法。今天就用北極星指標的指標樹拆解法，練一道 diagnostics 真題。

## 核心框架速記

### 框架一：北極星指標的指標樹拆解

北極星指標本身通常太抽象，一個小隊在兩週衝刺裡摸不到它。做法是往下拆成四個可以直接被某個小隊影響的輸入指標——廣度（影響的使用者或團隊有多廣）、深度（單次使用拿到的價值密度）、頻率（多常回來用）、速度（多快拿到價值）。下圖是一個 AI 寫作平台的實際拆解：北極星指標是「每週成功產出的 AI 草稿數」。

```diagram
title: 北極星指標的指標樹拆解
desc: 北極星指標往下拆成廣度、深度、頻率、速度四個可被團隊直接影響的輸入指標，範例取自一個 AI 寫作平台把「每週成功產出的 AI 草稿數」拆解成四個槓桿。
caption: 範例與框架整理自 productspur.substack.com《Deconstructing the North Star Metric》。
---
<svg viewBox="0 0 640 208">
  <path class="dg-line" d="M320 84V100"/>
  <path class="dg-line" d="M80 100H560"/>
  <path class="dg-line" d="M80 100V128"/>
  <path class="dg-line" d="M240 100V128"/>
  <path class="dg-line" d="M400 100V128"/>
  <path class="dg-line" d="M560 100V128"/>

  <rect class="dg-box dg-box--accent" x="210" y="20" width="220" height="64" rx="6"/>
  <text class="dg-label" x="320" y="43" text-anchor="middle" dominant-baseline="central">北極星指標</text>
  <text class="dg-sub" x="320" y="64" text-anchor="middle" dominant-baseline="central">每週成功 AI 草稿數</text>

  <rect class="dg-box" x="12" y="128" width="136" height="64" rx="6"/>
  <text class="dg-label" x="80" y="151" text-anchor="middle" dominant-baseline="central">廣度</text>
  <text class="dg-sub" x="80" y="172" text-anchor="middle" dominant-baseline="central">每週活躍寫手數</text>

  <rect class="dg-box" x="172" y="128" width="136" height="64" rx="6"/>
  <text class="dg-label" x="240" y="151" text-anchor="middle" dominant-baseline="central">深度</text>
  <text class="dg-sub" x="240" y="172" text-anchor="middle" dominant-baseline="central">平均文件字數</text>

  <rect class="dg-box" x="332" y="128" width="136" height="64" rx="6"/>
  <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">頻率</text>
  <text class="dg-sub" x="400" y="172" text-anchor="middle" dominant-baseline="central">每週開工天數</text>

  <rect class="dg-box" x="492" y="128" width="136" height="64" rx="6"/>
  <text class="dg-label" x="560" y="151" text-anchor="middle" dominant-baseline="central">速度</text>
  <text class="dg-sub" x="560" y="172" text-anchor="middle" dominant-baseline="central">輸入到匯出秒數</text>
</svg>
```

這張圖的四個英文對照是 Breadth（廣度）、Depth（深度）、Frequency（頻率）、Speed（速度）。拆完之後，每個槓桿才能指派給一個小隊當 OKR——例如成長小隊負責廣度（優化工作空間的 onboarding，增加 48 小時內送出的邀請數），核心產品小隊負責深度（加上情境感知的範本建議），平台小隊負責速度（把模型推論延遲從 4.5 秒壓到 1.2 秒）。面試時被問「怎麼把一個抽象的北極星指標變成可執行的團隊目標」，這套拆法就是答案骨架。

### 框架二：面試官真正在打分的四個維度

PM 面試教練 Aakash Gupta 整理了多數公司對 metrics 題的評分邏輯，拆成四個獨立維度——漏掉任何一項都會被標記為弱，不能用其他維度補分：

| 評分維度 | 考的是什麼 |
|---|---|
| 結構化提問 | 有沒有先問對的澄清問題，把所有關係方和指標的正負面都列出來，不急著下結論 |
| 指標選擇 | 挑的指標是不是真的能代表這個問題的核心，而不是隨便抓一個順手的數字 |
| 操作定義 | 選出來的指標是否敏感、可信、好算、可除錯、可解讀、對不同群體公平 |
| 取捨評估 | 有沒有講到正負兩面的影響，以及可能需要設的護欄／警示指標 |

## 今日練習題

### 題目

「Instagram Stories 的使用量今天掉了 7%，DAU 也掉了 5%，你會怎麼查？」
（來源：PM 面試教練 Aakash Gupta 整理的 diagnostics 類真題，屬於他分類的五大 metrics 題型之一，廣泛出現在 Meta 風格的 analytical/execution 面試輪次。）

### 拆解思路

1. **釐清指標定義**：先問清楚「Stories 使用量」具體算的是什麼——是發文數、觀看數，還是互動數？掉的 7% 是對昨天還是對上週同一天？是全球還是某個市場的數字？不把分母問清楚，後面的分析都會建立在錯的基礎上。
2. **排除埋點或計算問題**：在深究使用者行為之前，先確認這不是儀表板本身出錯——有沒有換過追蹤邏輯、有沒有資料管線延遲、計算口徑是否被悄悄改過。這是最常被跳過、但最容易打錯方向的一步。
3. **用分段定位範圍**：按地理、平台（iOS vs Android）、使用者群（新使用者 vs 老使用者）、進入路徑切分，看掉的量是全面性還是集中在某個切片。集中在一個切片，問題範圍就瞬間縮小。
4. **把時間軸對上事件**：把掉點發生的精確時間和內部改版（新功能上線、A/B 測試開跑）、外部事件（平台政策變動、競品動作、季節性）對齊，找出時間上最貼合的解釋，而不是先有結論再找證據。
5. **下結論並定義後續**：講清楚目前最可能的原因、信心程度，以及如果要進一步確認需要看哪些資料；同時提出要不要設一個監控警示，讓這類掉點下次能更快被抓到。

### 範例回答（面試時可以這樣講）

> **先框住問題再動手**：「我會先確認這 7% 指的是哪個具體動作——發文、觀看還是回覆——以及掉點是全球性的還是集中在某個市場，因為這決定了我接下來要查的方向完全不同。」**排除假訊號**：「在往下挖使用者行為之前，我會先去問資料團隊，過去 24 小時追蹤邏輯或計算口徑有沒有變動，因為我見過不少『指標掉了』最後其實是埋點改錯,這一步幾分鐘就能排除，不做的話很可能白忙一場。」**分段定位**：「假設資料是乾淨的,我會把掉點按平台、地區、新舊使用者拆開看。如果掉點集中在 iOS 新使用者,那方向會轉向最近的 App Store 更新或新手引導流程;如果是全面性的,那更可能是演算法分發或外部事件。」**對齊時間軸**：「我會把掉點的精確時刻和公司這週上線的任何改版、以及任何外部新聞對齊,找出時間上最貼合的解釋。」**收斂與建議**：「最後我會給出目前最可能的假設和信心程度，並建議針對這個指標設一個每日的自動警示閾值，讓類似掉點下次能在幾小時內被發現,而不是等到有人手動發現才開始查。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先把指標定義和比較基準問清楚 | |
| 有主動排除埋點／計算邏輯出錯的可能，不是直接跳到使用者行為 | |
| 有用至少一個維度（地理／平台／使用者群）做分段定位 | |
| 有把時間軸和內部改版或外部事件對齊 | |
| 有給出結論的信心程度，不是講得像唯一真相 | |
| 加分項：有提到設監控警示或護欄指標，避免下次晚發現 | |

## 今日案例

**Spotify：早期就選了「聆聽時長」而不是「註冊數」當北極星指標**

Spotify 在早期擴張階段面對一個常見的分岔路：成長團隊想衝註冊數，商業團隊想衝付費轉換數。如果選了「總註冊數」當核心營運指標，產品團隊的力氣會全部導向更猛的 onboarding 漏斗、更重的促銷折扣、更具侵入性的推薦邀請——使用者被拉進門之後，打開一次、覺得難用、再也沒回來，這些註冊數本質上是死掉的成長。Spotify 選的是「活躍使用者的聆聽時長」：這個指標同時做了三件事——證明使用者真的把 Spotify 融入日常生活（通勤、健身、唸書），餵養 Discover Weekly 等演算法推薦模型（聽得越久，行為資料越多，推薦越準，產品越難被取代），以及直接驅動商業模式（免費層使用者聽得越久，廣告庫存越多；高使用量本身建立產品依賴，不需要強力付費牆也能自然驅動轉換）。這是「虛榮指標」和「能擷取真實價值的指標」最清楚的對照：註冊數讓團隊在週報裡感覺良好，聆聽時長才真正和留存、商業結果掛鉤。

**面試連結**：被問「幫 X 產品設計一個北極星指標」或「這兩個候選指標你選哪個」時，Spotify 這個案例可以直接當論證素材——先講清楚兩個候選指標各自會把團隊的力氣導向哪裡，再用「哪個指標更能代表使用者真正拿到的價值，而不是漏斗頂端的虛榮數字」收斂到結論。

## 延伸閱讀

- [Product Metrics Interview: GAME Framework and 93 Questions](https://www.news.aakashg.com/p/product-metrics-interview) — Aakash Gupta 整理的 metrics 面試全景，含 5 大題型分類與評分維度細節。
- [Every Product Needs a North Star Metric](https://amplitude.com/blog/product-north-star-metric) — Amplitude 官方的北極星指標框架說明，可對照指標樹拆解法的原始脈絡。
- [Your product team doesn't need a "North Star Metric"](https://blog.ravi-mehta.com/p/your-product-team-doesnt-need-a-north) — 前 Tinder／Vimeo 產品長 Ravi Mehta 的反方觀點，提醒北極星指標被濫用時會變得空洞。

## 參考資料

- [Lesson 51: Deconstructing the North Star Metric (NSM)](https://productspur.substack.com/p/lesson-51-deconstructing-the-north) — 指標樹拆解框架（廣度／深度／頻率／速度）與 Spotify 案例的主要來源，對應「核心框架速記」與「今日案例」。
- [Product Metrics Interview: GAME Framework and 93 Questions](https://www.news.aakashg.com/p/product-metrics-interview) — 「Instagram Stories 掉 7%」真題與四維度評分表的來源，對應「今日練習題」與「核心框架速記」框架二。
- [Product Execution PM Interview - Reddit Root Cause Analysis Case Study](https://www.toughtongueai.com/blog/product-execution-pm-interview-reddit-root-cause-analysis) — 內部因素／外部因素／系統技術問題的分類方式，對應「拆解思路」步驟 2 與步驟 4。
