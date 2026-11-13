---
title: "Product Builder 面試日練 — 2026-11-13：Growth & Experimentation"
date: 2026-11-13
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "拆一題 Slack PM 面試真題——怎麼在既有的邀請、跨公司頻道、App 整合這些自然擴散路徑之外,找出新的 product-led growth 迴圈——再用 Zoom 的免登入連結迴圈收尾,看獲客、留存、擴大三段哪裡最容易被誤診。"
tldr: "成長迴圈的強度(k)只有留存率(r)夠高時才有意義,面試被問『怎麼讓產品自己長』時,先去抓迴圈哪一段的轉換率最低,而不是急著加一個新的擴散功能。"
series:
  name: "Product Builder 面試日練"
  order: 86
---

> 🌏 [English version](/posts/daily/2026-11-13-product-builder-interview-daily-en)

## 今日主題

Product-led growth 類的面試題常常被候選人答成「列出幾個成長手法」,但面試官真正要看的是你能不能先定位「迴圈卡在哪一段」,再決定要加哪個手法。今天用 Growth Flywheel(獲客→留存→擴大)跟 Hook Model 兩個框架,拆一題真實流出的 Slack PM 面試題——怎麼在既有的自然擴散路徑之外找新迴圈——再用 Zoom 早期靠免登入連結滾出來的病毒式成長案例,看同一套框架套在不同產品上會長出什麼不同答案。

## 核心框架速記

### Growth Flywheel 飛輪三階段(獲客 → 留存 → 擴大)

```diagram
title: 成長飛輪
desc: 新使用者透過分享或邀請進入產品(獲客),完成首次價值動作後轉為活躍使用者並寫入使用者網路(啟用),既有人脈已經在網路裡拉高回訪(留存),使用者邀請同事或升級付費(擴大),擴大帶來的新使用者再從更大的網路重新進入獲客階段。
caption: 簡化示意:啟用是最容易被誤診成獲客問題的一段,因此標成重點。
step: 新使用者透過分享連結或邀請加入(獲客)
step: 完成第一次關鍵價值動作,轉為活躍使用者(啟用),寫入使用者網路
step: 既有人脈已經在網路裡,拉高回訪頻率(留存)
step: 邀請同事、升級付費方案(擴大)
step: 擴大帶來的新使用者,從更大的網路重新進入獲客階段
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
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">獲客</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">分享連結・邀請加入</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">啟用</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">完成首次價值動作</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">留存</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">形成使用習慣</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">擴大</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">邀請同事・升級付費</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">使用者網路</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈變大</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">轉換</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">拉高回訪</text>
</svg>
```

| 階段 | 核心問題 | 常見誤診 |
|---|---|---|
| **Acquire 獲客** | 使用者怎麼第一次發現並進入產品 | 把流量不足當成唯一問題,其實卡點在下一段的啟用 |
| **Retain 留存** | 使用者有沒有養成固定回訪的習慣 | 只看整體留存曲線,沒拆出哪個族群在流失 |
| **Expand 擴大** | 既有使用者怎麼帶來更多使用者或營收 | 只做付費轉換,沒做會回頭餵養獲客的邀請迴圈 |

迴圈強度不是只看「每個使用者帶來幾個新使用者」這一個數字就夠。留存率決定迴圈能轉幾圈——留存率太低,使用者在迴圈真正轉起來之前就先流失,迴圈強度再高都補不回來這個缺口。

### Hook Model 四步鉤子(Nir Eyal)

| 步驟 | 內容 | 面試會問的角度 |
|---|---|---|
| **Trigger 觸發** | 外部通知或內部情緒(焦慮、無聊)把使用者帶回產品 | 觸發是不是太依賴外部推播,內部觸發有沒有養成 |
| **Action 行動** | 用最少摩擦力完成的最小動作 | 這個動作是不是真的對應使用者要的結果,還是為了湊數字 |
| **Variable Reward 不定回饋** | 結果有變化性,下次打開前不確定會看到什麼 | 回饋是不是真的不確定,還是變成每次都一樣的機械式回饋 |
| **Investment 投入** | 使用者留下的東西(資料、人脈、聲望)讓下一輪觸發更有效 | 這個投入會不會反而拉高使用者的轉出成本,變成負面體驗 |

Investment 這一步直接接回成長飛輪——使用者投入的人脈或資料,就是飛輪中心「使用者網路」每一圈變大的來源。

## 今日練習題

### 題目

「你是 Slack 的 PM。怎麼在產品本身(不靠銷售團隊)找出更多把新使用者和團隊帶進來、讓他們實際用起來、再帶到付費方案的路徑?請說明會新增或強化哪些路徑、先做哪一個、以及怎麼知道它有沒有生效。」(來源:PracHub 整理的 Slack PM 面試真題,題型為 Product Design & Strategy,難度 medium)

### 拆解思路

1. **釐清問題**:先問面試官——「成長」指的是新 workspace 數、既有 workspace 裡更多活躍成員,還是免費轉付費的轉換率?範圍要不要包含調整定價與免費方案額度,還是只能動產品本身?
2. **定義使用者,先列出既有迴圈**:Slack 現在已經在跑的自然擴散路徑有邀請、跨公司共享頻道、App 整合、免費方案,把每一條放進 Acquire / Retain / Expand 三格,標出現在卡在哪一段。
3. **結構化分析**:用迴圈強度的概念檢查每條路徑——留存率夠不夠高,讓迴圈真的轉得起來?如果某條路徑的獲客數字很好看,但留存率低,代表迴圈還沒轉起來使用者就流失了,加強這條路徑的擴散功能只是浪費力氣,該修的是留存。
4. **提出方案**:挑一個族群(例如跨公司協作者,或大企業內部先自己冒出來的小團隊)設計新路徑,同時放進風險對沖——Slack 特有的風險是 IT 治理(員工自己開出公司管不到的 workspace)、邀請被當垃圾信,以及跟 enterprise 銷售動線互相打架。
5. **定義成功**:每條路徑各自的北極星(新 workspace 數、既有 workspace 活躍成員數),加上護欄指標(IT 投訴件數、邀請濫發檢舉數),避免只看頂層成長數字卻忽略治理代價。

### 範例回答(面試時可以這樣講)

> **先定範圍,再定位卡點**:「這題我會先確認『成長』指的是新 workspace、既有 workspace 的活躍成員,還是免費轉付費,因為三個目標對應的路徑完全不同。我會先把 Slack 現在已經在跑的自然擴散路徑列出來——邀請、跨公司共享頻道、App 整合、免費方案——分別放進獲客、留存、擴大三格,看哪一段轉換率最低。」
>
> **用迴圈強度檢查,不急著加新功能**:「如果某條路徑的獲客數字很漂亮,但留存率低,我不會先加強它的擴散功能,因為迴圈強度要留存率夠高才有意義——使用者還沒轉第二圈就流失,加再多分享按鈕都沒用。我會先選一個留存率已經不錯、但擴散路徑還很弱的族群,比如跨公司協作者,針對他們設計新的邀請入口。」
>
> **把風險放進方案,不是事後補**:「因為是 Slack,我會在方案裡直接放進 IT 治理的對沖——比如新路徑只對已有企業方案的網域開放自動加入,避免員工開出公司管不到的 workspace。成功指標我會用新 workspace 數加活躍成員數兩個北極星,護欄指標是 IT 投訴件數跟邀請濫發檢舉數,確保成長不是拿治理風險換來的。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 有沒有先問清楚「成長」指的是哪個指標,縮小範圍 | |
| 有沒有先列出既有的自然擴散路徑,再找新路徑 | |
| 有沒有用迴圈強度(留存率 r 與擴散係數 k)判斷卡在哪一段 | |
| 方案裡有沒有放進這個產品特有的風險對沖 | |
| 有沒有講出北極星跟護欄指標各是什麼 | |
| 加分項:有沒有說明為什麼不是獲客問題,而是留存或啟用問題 | |

## 今日案例

**Zoom 靠免登入連結滾出來的病毒式成長**

早期的視訊會議軟體要先排 demo、談企業授權、裝笨重的桌面外掛才能用。Zoom 把流程改成任何人點一個連結,三秒內就能進入會議,不用先建帳號。結果是每一場會議的主持人體驗到流暢的畫質,而每一位被邀請進會議的人,都變成一次免費的產品觸點——不需要靠銷售團隊一個個打陌生電話,光靠會議連結本身的擴散,就把使用者規模滾到數百萬量級。這個迴圈能轉起來的前提,是「加入」這個動作本身的摩擦力被壓到幾乎是零——這正是 Hook Model 裡 Action 這一步的核心要求。

**面試連結**:這個案例可以直接拿來反駁「成長 = 多加一個分享按鈕」這種簡化答案——Zoom 真正做對的事是先把加入會議的摩擦力壓到最低,讓每一次被動邀請都能順利轉成一次啟用,迴圈才轉得起來。面試被問「怎麼讓產品自己長」時,先檢查你的核心動作摩擦力夠不夠低,比直接討論要不要加病毒式功能更有說服力。

## 延伸閱讀

- [Product-Led Growth (PLG) for SaaS: The 2026 Guide](https://www.userflow.com/blog/product-led-growth-the-ultimate-guide-for-saas-success) — 免費方案、無卡試用、開源三種進入模式怎麼決定病毒係數,以及自助採用和協助導入怎麼並存。
- [Viral Loops in SaaS (2026): Dropbox to Notion, 7 Teardowns + Free K-Factor Calculator](https://www.flowjam.com/blog/viral-loop-examples-saas-the-definitive-playbook-for-engineering-self-sustaining-growth) — 七個真實 SaaS 病毒迴圈拆解,附病毒係數計算器。
- [Where to begin with product-led growth](https://givechariot.substack.com/p/where-to-begin-with-product-led-growth) — 為什麼啟用卡點最常被誤診成獲客問題,以及怎麼用產品工程背景設計可快速驗證的成長實驗。

## 參考資料

- [Slack product-led growth: new self-serve acquisition, activation and expansion loops](https://prachub.com/interview-questions/slack-product-led-growth-new-self-serve-acquisition-activation-and-expansion-loops) — 今日練習題原題與評分要點出處。
- [Lesson 52: Product-Led Growth (PLG) Architecture & Flywheels](https://productspur.substack.com/p/lesson-52-product-led-growth-plg) — Zoom 免登入連結病毒迴圈案例,以及 Acquire / Retain / Expand 三階段飛輪框架出處。
- [Retention Loops Explained for SMB SaaS (2026)](https://churntools.com/blog/retention-loops) — 留存率 r 決定迴圈強度 k 能否發揮作用的數學說明出處。
- [Where to begin with product-led growth](https://givechariot.substack.com/p/where-to-begin-with-product-led-growth) — 啟用常被誤診成獲客問題這個論點的出處。
