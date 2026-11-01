---
title: "Product Builder 面試日練 — 2026-10-30：Growth & Experimentation"
date: 2026-10-30
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "星期五輪到 Growth & Experimentation——先練 Growth Loop 的三步驟建造法與 Nir Eyal 的 Hook Model，再拆一題 PracHub 收錄的 Slack 面試真題：怎麼幫 Slack 開出新的 product-led growth 擴散路徑；案例是 Calendly 投資人 Blake Bartlett 親口講述的排程病毒迴圈——為什麼這個迴圈不用額外設計，『兩個人同時有同一個需求』這件事本身就夠。"
tldr: "今天的骨架是兩個框架：先用 Growth Loop 找出產品裡已經半成形的迴圈——不是憑空發明一個分享機制，是找『使用者已經在做，只差一步就能帶來新使用者』的行為，裝上輸入、行動、輸出三個指標；再用 Nir Eyal 的 Hook Model（Trigger、Action、Variable Reward、Investment）判斷一個功能能不能讓使用者自己回來，而不是每次都靠推播硬拉回來。練習題是 PracHub 收錄的 Slack 真實面試題：怎麼幫 Slack 開出更多 product-led growth 的擴散路徑——拆解示範先問『成長指的是新 workspace、既有團隊更活躍，還是免費轉付費』鎖定範圍，再從 Slack 已經在跑的跨公司 channel 共享這個半成形迴圈下手，而不是硬加一個邀請按鈕，同時要準備好回答 IT 團隊對治理失控的質疑。案例是 Calendly 投資人暨董事 Blake Bartlett 接受 Sacra 專訪時的說法：Calendly 的病毒迴圈不是設計出來的，是因為『排程』這個任務本身就是兩個人同時遇到同一個問題——這個判斷標準（工作流程本身有沒有牽涉到非使用者）就是今天拿來排序 Slack pathway 優先順序的同一套邏輯。"
series:
  name: "Product Builder 面試日練"
  order: 72
---

> 🌏 [English version](/posts/daily/2026-10-30-product-builder-interview-daily-en)

## 今日主題

星期五輪到 Growth & Experimentation。這類面試最常見的失分模式是一聽到「成長」就反射性開藥方——加分享按鈕、辦邀請獎勵、推播通知——卻沒先確認這題講的成長是哪一段，現在的產品本來就靠什麼機制在長。今天先練兩個判斷框架：怎麼從產品裡已經在跑的行為找出可以放大的迴圈，以及怎麼判斷一個功能能不能讓使用者自己形成習慣回來，而不是每次都要被推播拉回來。練習題換成一題更貼近真實 PM 工作場景的題目：不是「設計一個新功能」，而是「在一個已經有複雜既有使用者群的產品上，開出新的成長路徑，還要顧到治理風險」。

## 核心框架速記

### Growth Loop：找產品裡已經半成形的迴圈，裝上三個指標

Growth Loop（有時也叫 growth flywheel）跟傳統的獲客漏斗不一樣：漏斗是線性的，走到底就結束；迴圈會把輸出重新餵回輸入，一圈比一圈滾得快。建造迴圈的方法不是憑空發明一個分享機制，是先找使用者已經在做、而且會碰到非使用者的行為——分享連結、匯出檔案、公開頁面、邀請——挑其中已經存在但還沒放大的那個,而不是硬加一個新按鈕。

| 迴圈類型 | 運作方式 |
|---|---|
| Viral（病毒） | 既有使用者的行為本身觸及到還不是使用者的人 |
| Content（內容） | 使用者產生或產品產生的內容被搜尋或社群帶來新流量 |
| Paid（付費） | 把營收重新投入廣告 |
| Sales（銷售） | 產品使用轉化成可以擴張的付費帳號 |

找到候選迴圈後,給每一步配一個事件與一個負責人——輸入(例如 workspace\_created)、行動(例如 file\_shared)、輸出(例如 invitee\_signed\_up)——在改動之前先記錄基準值,再把「重新投入」那一步做成可追蹤的產品功能,而不是一次性的行銷活動。面試常見的扣分點是只選一個主迴圈投入,卻同時想做好幾個——多數團隊一次只該顧好一個迴圈,等它的 yield 跟週期時間摸透了,才輪到下一個。

### Hook Model:Trigger → Action → Variable Reward → Investment

Nir Eyal 在《Hooked: How to Build Habit-Forming Products》裡提出的四階段迴圈,解釋的是使用者為什麼會「自己想回來」,而不是每次都要被外部觸發(推播、email)硬拉回來:

1. **Trigger(觸發)**:外部觸發來自產品本身(通知、圖示);內部觸發是使用者重複使用後,跟某個情緒或routine產生的連結(例如無聊就想刷)。
2. **Action(行動)**:使用者為了滿足觸發而做的最簡單動作,動作越簡單,轉成習慣的機率越高。
3. **Variable Reward(變動獎勵)**:獎勵不可預期,才會持續讓人想回來——Eyal 把獎勵分成三種:tribe(社群認同)、hunt(獲取資源或資訊)、self(自我能力感)。
4. **Investment(投入)**:使用者放進時間、資料、努力或社交資本,一方面讓產品對他更有價值,一方面預先埋下下一次的觸發。

```diagram
title: Hook Model 四階段迴圈
desc: 使用者被觸發後採取行動、得到不可預期的獎勵、投入時間或資料,投入會寫進習慣強度,讓下一次的觸發從外部提示變成內部習慣,每繞一圈,使用者自己想回來的習慣強度就更強。
caption: 簡化示意:Variable Reward 實際分成 tribe、hunt、self 三種類型,Trigger 也分外部與內部,圖裡簡化成四個階段呈現迴圈結構。
step: 使用者被觸發(外部提示或內部情緒連結)
step: 為了滿足觸發採取最簡單的行動
step: 得到不可預期的變動獎勵,才會持續想回來
step: 投入時間、資料或努力,寫進習慣強度
step: 習慣強度變強,下一次的觸發更可能是內部的,不靠推播
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M128 196H168" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--dashed" d="M220 168V72" marker-end="url(#arrow)" data-step="5"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">Trigger</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">觸發</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">Action</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">行動</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">Variable Reward</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">變動獎勵</text>
  </g>

  <g data-step="4">
    <rect class="dg-box dg-box--accent" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">Investment</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">投入</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">習慣強度</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈都變強</text>

  <text class="dg-edge" x="148" y="182" text-anchor="end" dominant-baseline="central" data-step="4">寫入</text>
  <text class="dg-edge" x="230" y="120" text-anchor="start" dominant-baseline="central" data-step="5">讀出</text>
</svg>
```

這個框架對面試的用處是:被問「怎麼讓使用者養成習慣」時,先講清楚現在的觸發是內部還是外部——外部觸發要花錢買,內部觸發才是真正省錢的留存引擎——再講投入這一步具體要使用者放進什麼,而不是只講「獎勵要夠吸引人」。

## 今日練習題

### 題目

你是 Slack 的產品經理。要怎麼開出更多 product-led growth 的路徑,也就是靠產品本身、不靠業務團隊,把新使用者和團隊帶進來、讓他們活躍起來、帶向付費方案?請說明你會新增或強化哪些路徑、會先做哪一個,以及怎麼知道它有效。

(來源:PracHub,《Slack product-led growth: new self-serve acquisition, activation and expansion loops》收錄的真實面試題)

### 拆解思路

1. **釐清問題**:先問三件事——這裡的成長指的是新 workspace 變多、既有 workspace 裡的活躍成員變多,還是免費團隊轉付費?要聚焦在小團隊自己註冊,還是從一個 team 擴散到大公司裡的其他 team(後續再靠 sales 成交)?定價與免費方案的額度算不算在這題的範圍內?
2. **定義使用者與現有迴圈**:把 Slack 現有的自帶擴散機制列出來——邀請連結、跨公司共享的 channel、app 整合、免費方案——針對每一個問「這個迴圈現在在哪一步斷掉」,而不是假設它們都運作良好。
3. **結構化分析**:用 Growth Loop 框架挑一個已經半成形、只缺最後一步的迴圈優先做。例如跨公司共享的 channel 本來就會讓外部協作者看到 Slack,但目前可能沒有把「看到」轉成「註冊」的明確路徑——這種「使用者已經在做,只差補一步」的迴圈,比憑空設計一個新機制風險低、起步快。
4. **提出方案**:講清楚選定的 segment、要新增或強化的具體 pathway、排序的理由(impact 對 effort),並主動帶出風險——員工在公司管不到的情況下建立 workspace 會讓 IT 跟資安團隊質疑治理失控,邀請機制做得太鬆會變成 spam,過度自助化也可能跟現有的 sales-led 企業銷售動線衝突。
5. **定義成功**:每條 pathway 配自己的指標與 guardrail——不能只看註冊數,要看這批新團隊在 30 天內有多少比例活躍起來或轉付費;並準備好回答「如果只能跟主管報一個指標,你會報哪一個」這類收斂式追問。

### 範例回答(面試時可以這樣講)

> **先問清楚『成長』指的是哪一段,再決定要不要動地圖。** 我會先確認這題講的成長是新 workspace 多起來、既有 workspace 裡活躍成員變多,還是免費團隊轉付費——這三個答案會指向完全不同的方案。假設拿到的答案是『要更多免費團隊自己註冊,也要讓他們轉付費』,我會先畫出 Slack 現有的自帶擴散機制:邀請連結、跨公司共享的 channel、app 整合、免費方案,再找每一個在哪一步斷掉。
>
> **從『已經半成形的迴圈』裡挑,不是憑空發明。** 跨公司共享 channel 這個機制很特別——它本來就會讓外部協作者看到 Slack,但目前沒有把這個曝光轉成註冊的明確路徑。我會把這個列為第一個要強化的 pathway,因為使用者已經在做這件事了,我只是補上『看到之後怎麼變成註冊』中間缺的那一步,不是硬塞一個新的分享按鈕進去。
>
> **方案要連著風險一起講。** 強化這條迴圈會讓更多個人在公司管不到的情況下建立 workspace,IT 團隊一定會抱怨治理問題——我會同時準備一個讓 IT 看得到、管得到這些新 workspace 的配套。成功的定義是這條 pathway 帶來的免費團隊,有多少比例在 30 天內轉成活躍使用,不是單看註冊數——註冊數上升、活躍度沒跟上,代表只是換個管道製造雜訊。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 先定義這題的成長指的是哪一段(新使用者、既有活躍度,還是轉付費) | |
| 畫出現有迴圈在哪裡斷掉,而不是空手造一個新迴圈 | |
| 方案依 segment 與 impact/effort 排序,講清楚為什麼先做這個 | |
| 主動講到治理、spam、跟 sales-led 動線衝突這類風險 | |
| 每條 pathway 都配對應指標與 guardrail,不是只看單一虛榮指標 | |
| 加分:判斷這個產品適合用病毒式迴圈,還是該靠「無聊」但扎實的動作(快速啟用、誠實的方案限制) | |

## 今日案例

**Calendly:排程本來就是「兩個人同時有同一個需求」,病毒迴圈不用額外設計**

Calendly 投資人暨董事 Blake Bartlett(OpenView 合夥人)接受 Sacra 專訪時說明,Calendly 並不是發明了排程連結這個概念——TimeTrade、ScheduleOnce 等工具更早就存在,但那些工具不是 product-led:收到邀請的人看到的只是一次性的排程連結,用完就忘了,沒有任何「變成使用者」的行動呼籲。Calendly 把這段體驗改成完全自助式:收件人點進排程連結,看到的不只是約時間的介面,還有免費建立自己 Calendly 頁面的明確入口。Bartlett 指出關鍵在於排程這件事「本身就是兩個人同時遇到同一個問題」——雙方都在找彼此都方便的時間,只要有人把解法擺在眼前,收件人不想再來回寄信,就會順勢點下去變成新使用者。他形容這個迴圈「像雪球滾下山坡,只會越滾越大」,而且完全不需要靠獎勵或提示去催化,是工作流程本身自帶的。

**面試連結**:被問「怎麼幫產品設計病毒迴圈」時,多數候選人會先想「加一個邀請好友的按鈕」。Calendly 案例示範該先問的問題是「這個工作流程本身,有沒有本來就牽涉到一個還不是使用者的人」——有,才值得投資做病毒迴圈;沒有,硬加分享提示只會變成使用者體感的摩擦,不會變成成長引擎。這個判斷標準,剛好可以直接用在今日練習題「哪個 Slack pathway 值得先做」的排序邏輯上。

## 延伸閱讀

- [Growth Loops: A Builder's Guide to Compounding Growth](https://amplitude.com/explore/product/growth-loops) — Amplitude 整理的四種迴圈類型與三步驟建造法,今日框架一出處
- [7 Product-Led Growth Examples for B2B Companies](https://thehigherpitch.com/blogs/product-led-growth-examples/) — Calendly 案例的完整脈絡,以及另外六種 B2B PLG motion 的適用條件與崩潰點
- [The Growth Loop Audit: Find What Compounds](https://kokasexton.com/growth-loop-audit-find-what-compounds/) — 稽核現有迴圈(acquisition、activation、retention、referral)的檢查清單,互補今日的 Growth Loop 框架

## 參考資料

- [Slack product-led growth: new self-serve acquisition, activation and expansion loops — PracHub](https://prachub.com/interview-questions/slack-product-led-growth-new-self-serve-acquisition-activation-and-expansion-loops) — 今日練習題出處
- [Growth Loops: A Builder's Guide to Compounding Growth — Amplitude](https://amplitude.com/explore/product/growth-loops) — 核心框架一:Growth Loop 的迴圈類型與指標設計
- [The Hooked Model: How to Manufacture Desire in 4 Steps — Nir Eyal](https://www.nirandfar.com/how-to-manufacture-desire/) — 核心框架二:Hook Model 原作者網站的完整說明
- [Blake Bartlett, partner at OpenView, on the future of product-led growth — Sacra](https://sacra.com/research/blake-bartlett-openview-future-product-led-growth/) — 今日案例原始訪談出處,Calendly 病毒迴圈的第一手說法
- [7 Product-Led Growth Examples for B2B Companies — The Higher Pitch](https://thehigherpitch.com/blogs/product-led-growth-examples/) — 今日案例的二次引用與適用條件補充
