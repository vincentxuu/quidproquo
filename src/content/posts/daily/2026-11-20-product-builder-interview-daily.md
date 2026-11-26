---
title: "Product Builder 面試日練 — 2026-11-20：Growth & Experimentation"
date: 2026-11-20
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "Growth & Experimentation 面試日練:用 loop 與 funnel 的差別、Hook Model 四步驟拆解黏著度,再用 Slack 的 PLG 擴張題練一次結構化回答。"
tldr: "今天的核心是 funnel 線性成長、loop 會複利,而 Hook Model 的「投入」正是讓下一圈觸發更容易被接住的關鍵——練習題是 Slack 如何開出新的自助成長管道,今日案例是 Dropbox 雙邊推薦計畫把註冊量永久拉高 60% 的真實數字。"
series:
  name: "Product Builder 面試日練"
  order: 93
---

> :globe: [English version](/posts/daily/2026-11-20-product-builder-interview-daily-en)

## 今日主題

Growth 面試常見的陷阱,是把成長單純當成「流量 × 轉換率」的數學題,一路問到底就停在 funnel 思維。但面試官真正想聽到的,是你分不分得清楚 funnel 跟 loop 的差別——funnel 每個新使用者都要重新從頭花錢買進來,loop 則是這一圈的產出變成下一圈的輸入,會自己複利。今天先練 loop 怎麼運作、黏著度怎麼設計,再用一道 Slack 的產品導向成長(PLG)擴張題,練習怎麼把「我們要怎麼成長」拆成具體、可驗證的管道。

## 核心框架速記

### 框架一:Loop 會複利,Funnel 不會——Hook Model 拆解黏著度怎麼來的

Funnel 是一條走到底就結束的路(認知→註冊→啟用→付費),每一個新客都要在頂端重新灌進去。Loop 則是一個封閉的環:這一圈的產出,變成下一圈的輸入,所以會自己長大。差別可以寫成一個簡化公式:月活使用者的成長因子约等於「留存率 r + 迴圈強度 k」——k 是每個活躍使用者平均帶來幾個新活躍使用者。這個公式的重點不是算得多準,而是看出 r 的槓桿遠大於 k:留存率太低,迴圈還沒轉到第二圈使用者就先流失光了,所以留存永遠要先打底,迴圈強度才有意義。

落地到產品設計,loop 內部怎麼運作要靠 Nir Eyal 的 Hook Model 四步驟:

```diagram
title: 黏著度飛輪:Hook Model 四步驟
desc: 使用者從內部觸發開始採取低摩擦的核心行動,行動產生的資料寫進個人化資產,個人化資產讓這次的獎勵更貼合使用者,使用者因此投入更多資料或設定,讓下一次觸發更容易被接住,一圈比一圈黏。
caption: 示意:實際產品通常要先驗證核心行動的頻率是否吻合使用情境,才能設計出會良性循環的 Hook。
step: 內部觸發促使使用者打開產品
step: 使用者採取低摩擦的核心行動,行為資料寫進個人化資產
step: 個人化資產讓這次的獎勵更貼合使用者,獎勵保持變動不固定
step: 使用者因為獎勵而投入資料或設定,墊高下次離開的成本
step: 投入讓下一次內部觸發更容易被接住,回到第一步,但黏著度比上一圈高
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">觸發</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">內部焦慮或習慣</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">行動</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">低摩擦核心動作</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">變動獎勵</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">依個人化資產調整</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">投入</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">資料・設定・內容</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">個人化資產</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈累積更多</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">校準</text>
</svg>
```

四步驟裡最常被面試者漏講的是「投入」——使用者放進去的資料、設定或內容,才是讓下一次觸發更容易被接住、轉換成本也跟著墊高的關鍵,少了這一步,循環只是一個「使用者會回來」的習慣描述,不會複利。

### 框架二:Growth Flywheel——Acquire、Retain、Expand 三段怎麼接起來

公司層級的成長,通常拆成三個互相餵養的階段:

| 階段 | 要回答的問題 | 典型機制 |
|---|---|---|
| Acquire(取得) | 新使用者怎麼在零登入摩擦下嚐到價值? | 免費試用、開源、免費版、連結即用(不用帳號) |
| Retain(留存) | 哪個每週重複的核心動作,讓使用者持續回來? | 個人化儀表板、團隊內的訊息紀錄、持續累積的工作成果 |
| Expand(擴張) | 使用者在工作流裡的哪個卡點,會自然推他升級? | 用量上限、席位邀請、進階功能的模態視窗 |

Slack 跟 Zoom 是這套 flywheel 最常被拿來對照的兩個例子:Slack 靠「一個工程師先用,一週內拉進五個同事,一個月整個部門離不開訊息紀錄」的自下而上擴散,等公司要超過免費版的訊息上限或要企業級的安全控管,才由下而上逼出採購;Zoom 則是把「點連結就能加入會議、不用註冊帳號」做到極致,讓每一位與會者都變成一次產品曝光,靠這個取得迴圈取代掉傳統視訊會議軟體要先排 demo、談企業授權的銷售流程。兩者的擴張(Expand)都不是年度合約續約推動的,而是使用量自然撞到上限後,使用者自己要求升級。

## 今日練習題

### 題目

「你是 Slack 的產品經理。請設計更多產品導向成長(PLG)的管道——也就是讓產品本身、而不是銷售團隊,把新使用者和團隊帶進來、讓他們真的開始用、再帶到付費方案。說明你會新增或強化哪些管道、先做哪一個,以及你要怎麼知道它真的有效。」(來源:PracHub Slack PM 面試題庫,2026-05-31)

### 拆解思路

1. **先問清楚「成長」指的是什麼**:是更多新 workspace、既有 workspace 裡更多活躍成員,還是更多免費團隊轉付費?範圍不同,該優先做的管道完全不一樣。
2. **盤點既有的自助循環,找出斷在哪**:Slack 本來就靠邀請、跨公司共用頻道、App 整合、免費版在擴散,先畫出這些既有迴圈,找出哪一段流失最嚴重(例如:邀請寄出但對方沒裝、免費版訊息上限觸發後沒人管理續約)。
3. **針對選定的客群,列出具體管道並排優先序**:用影響力 × 實作成本排序,而不是把所有想到的點子都列出來。
4. **替每個管道定指標與護欄**:主指標(例如邀請轉換率)之外,一定要有護欄指標——IT 治理風險、邀請被當成騷擾的投訴率。
5. **先回答「怎麼知道有效」,再往下談規模化**:一個管道要先在小範圍验证出「真的推進了啟用或付費」的因果關係,才值得投入資源擴大。

### 範例回答(面試時可以這樣講)

> **先鎖定客群,再談管道**:「我會先把範圍收斂在『單一公司裡已經有一群人在用免費版 Slack,但還沒觸發採購』這群使用者,因為 Slack 過去最強的擴散路徑就是這種跨部門蔓延。既有的邀請流程已經覆蓋了『個人邀同事』,但在『一個團隊的使用習慣,怎麼自然外溢到隔壁團隊』這一段其實是斷的——現在只能靠員工自己口頭推薦。」
>
> **具體管道,從影響力最大、實作成本最低的先做**:「第一個管道是把『跨頻道共用一個文件或工作流程』的動作,變成一個明顯的邀請入口,而不只是一個分享連結;第二個是在免費版觸碰到訊息歷史上限時,把『匯出並保留訊息紀錄』包裝成一次清楚的升級提案,而不是單純封鎖查詢。這兩個都是從使用者已經在做的事情長出來的管道,不需要教育使用者新的行為。」
>
> **指標跟護欄一起講,不要只講轉換率**:「我會追蹤每個管道的邀請送出率、對方安裝並活躍的比例,但同時盯著 IT 治理投訴率跟『被標記為騷擾』的邀請比例作為護欄——因為 Slack 過去最大的風險不是沒人要用,是用得太野讓公司 IT 覺得失控,反而提早觸發抵制而不是觸發採購。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 有沒有先問清楚「成長」指新使用者、活躍度,還是付費轉換 |
| 有沒有先盤點既有迴圈、找出斷點,而不是憑空想新點子 |
| 管道有沒有排優先序,而不是全部列出來 |
| 每個管道有沒有主指標 + 護欄指標 |
| 有沒有講清楚怎麼驗證管道真的有效,才擴大規模 |
| 加分項:有沒有提到自助擴散跟既有銷售團隊之間可能的衝突 |

## 今日案例

**Dropbox 雙邊推薦計畫:把成長從「買流量」換成「複利的 loop」**

2008 年,Dropbox 透過搜尋廣告取得一個新客要花 233 到 388 美元,而年繳付費方案只賣 99 美元,這筆帳完全算不過來。創辦人 Drew Houston 把成長邏輯換成產品內建的雙邊推薦:使用者邀朋友註冊並安裝,邀請人跟被邀的新使用者各拿到額外的免費儲存空間(最初 250MB,後續調整),上限內可以一直疊加。邀請入口做進註冊流程跟 App 裡最常被看到的位置,還能直接匯入聯絡人、用進度條顯示已賺到多少空間,整套機制都在產品裡,不是另外跑一個行銷活動。根據 Houston 在 2010 年公開分享的數字,這個推薦計畫把 Dropbox 從 2008 年 9 月的約 10 萬名註冊使用者,帶到 2010 年 1 月的約 400 萬名,推薦計畫讓每日註冊量永久拉高了約 60%,高峰時推薦貢獻了當天新註冊的 35%。

**面試連結**:這個案例是框架一「loop 會複利」最乾淨的實例——儲存空間這個獎勵剛好是 Dropbox 使用者最想要的東西,成本又隨硬碟價格下滑而持續降低,雙邊設計讓邀請人覺得是「送禮物」而不是「求人幫忙」,被邀的人又因為邀請來自朋友而更信任。面試被問到「怎麼設計一個會自己長大的成長機制」時,可以用這個案例的三個條件回答:獎勵要跟產品核心價值綁在一起、對公司的邊際成本要夠低、兩邊都要覺得自己有拿到好處,三個條件缺一個,複製這個計畫的人大多失敗。

## 延伸閱讀

- [Retention Loops Explained for SMB SaaS](https://churntools.com/blog/retention-loops) — 今天框架一「r + k」成長因子公式與 Hook Model 四步驟的主要出處,附一個可調參數的複利計算器。
- [Lesson 52: Product-Led Growth (PLG) Architecture & Flywheels](https://productspur.substack.com/p/lesson-52-product-led-growth-plg) — 框架二 Acquire-Retain-Expand flywheel 的 Slack、Zoom 案例來源。
- [Growth Marketing Interview Questions (and How to Answer Them)](https://knowtheroom.ai/interview-questions/growth-marketing/) — 整理成長類面試常見的「怎麼讓註冊量翻倍」「CAC 突然變貴怎麼查」等問題與回答框架,適合搭配今天的練習題一起準備。

## 參考資料

- [Slack product-led growth: new self-serve acquisition, activation and expansion loops](https://prachub.com/interview-questions/slack-product-led-growth-new-self-serve-acquisition-activation-and-expansion-loops) — 今日練習題的原始出處,含澄清問題、強答案標準與追問。
- [Dropbox Referral Program Case Study: Growth From 100K to 4M](https://mynameiskalam.com/case-studies/dropbox-referral-program/) — 今日案例的數字來源,引用 Drew Houston 2010 年公開分享的成長數字。
- [Retention Loops Explained for SMB SaaS](https://churntools.com/blog/retention-loops) — 框架一 loop vs funnel 複利公式與 Hook Model 四步驟拆解的出處。
- [Lesson 52: Product-Led Growth (PLG) Architecture & Flywheels](https://productspur.substack.com/p/lesson-52-product-led-growth-plg) — 框架二 flywheel 三階段與 Slack、Zoom 案例描述的出處。
