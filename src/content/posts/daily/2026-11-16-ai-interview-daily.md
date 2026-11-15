---
title: "AI Engineer 面試日練 — 2026-11-16：ML Fundamentals"
date: 2026-11-16
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一主題 ML Fundamentals：從 MeetAssist 收錄的真實面試題出發，練習怎麼把「資料洩漏」拆成四種不同來源逐一排查，而不是只背一句「test data 不能碰到 train」。"
tldr: "資料洩漏不是一句「test 不能碰到 train」就講完的概念,要分成 target leakage（特徵本身藏著答案或未來資訊）、preprocessing leakage（scaling／encoding 在切分前就 fit 了全資料）、temporal leakage（時間序列用到預測當下還不存在的資訊）跟 group leakage（同一個使用者或裝置同時出現在 train 跟 validation）四種來源,面試官要聽到的是你會先問清楚資料結構再逐一排查,而不是背一句通用答案。"
series:
  name: "AI Engineer 面試日練"
  order: 89
---

> 🌏 [English version](/posts/daily/2026-11-16-ai-interview-daily-en)

## 今日主題

星期一固定練 ML Fundamentals。資料洩漏（data leakage）是少數幾乎每個 ML 面試迴圈都會碰到的主題——無論是 technical screening 的概念題,還是 onsite 給一段 pipeline 程式碼要你抓問題。它危險的地方在於,洩漏發生時模型的離線指標往往「好得不正常」,如果你只會背「test data 不能碰到 train」這句話,面試官一追問具體怎麼發生、怎麼抓,很容易就露餡。今天的練習題把洩漏拆成四種不同機制,練的是面試時怎麼把一個模糊的警訊收斂成具體、可驗證的排查步驟。

## 核心概念速記

### 資料洩漏不是一種,是四種不同機制

Target leakage 是特徵本身藏著只有在知道答案之後才會存在的資訊（例如用「是否已核退」當特徵去預測「這張保單會不會出險」）；preprocessing leakage 是在切分 train/validation 之前,就對全資料做了 scaling、imputation 或 target encoding,讓驗證集的統計資訊偷偷流進訓練過程；temporal leakage 是時間序列資料裡用到了預測當下根本還不存在的未來資訊；group leakage 是同一個使用者、裝置或帳號的多筆紀錄被拆到 train 跟 validation 兩邊,模型學到的其實是「認得這個人」而不是真正的規律。四種機制的共同本質都是「資訊提早出現」,但面試官要聽到的是你能把它們分開診斷,不是一句話全部打包回答。

### Preprocessing leakage 最容易被忽略,因為程式碼看起來是對的

很多人知道不能把 test data 拿去訓練模型,卻忘記 `fit_transform` 這類前處理步驟一樣算訓練的一部分。如果在切分 train/test 之前就對整份資料做標準化或 target encoding,驗證集的均值、變異數或類別頻率就已經滲進訓練流程,即使後面的模型訓練本身完全乾淨,評估分數依然會被灌水。正確做法是把前處理包進 `Pipeline`,讓 cross-validation 的每一折都只用那一折的訓練資料去 `fit` 前處理步驟,再套用到驗證資料上。

### 時間序列的洩漏陷阱是「look-ahead bias」

時間序列資料如果用隨機切分做 cross-validation,驗證集裡的樣本時間可能早於某些訓練樣本,等於讓模型「看到未來」去預測「過去」。正確做法是用 `TimeSeriesSplit` 之類只往前看的切分方式,並在訓練窗與驗證窗之間留一段 gap——因為標籤本身通常需要等一段時間才能確定（例如「30 天內是否流失」),這段等待期如果沒留出來,訓練當下根本拿不到那筆標籤,驗證集卻拿到了,一樣是洩漏。做 lag 或 rolling window 特徵時更要注意邊界,窗口不能跨到驗證期的資料。

### 分組洩漏是「樣本獨立性」被打破

如果同一個使用者在資料裡出現了十筆紀錄,隨機切分很可能讓這十筆有的進 train、有的進 validation。模型只要學會「記住這個使用者的其他行為模式」,就能在驗證集上表現得特別好,但這種好表現換到全新使用者身上完全不會重現。正確做法是用 `GroupKFold`,確保同一個分組（使用者、裝置、帳號）整組只出現在 train 或只出現在 validation 一邊,不能切開。

```diagram
title: ML pipeline 裡資料洩漏在哪一步發生
desc: 特徵工程、train/validation 切分、前處理 fit 三個階段各自對應一種資料洩漏來源,問題要等到模型訓練與評估階段,才會以不正常地好的離線分數浮現出來。
caption: 簡化示意：省略資料收集與特徵選擇等前置步驟。
step: 特徵工程階段可能發生 target leakage——特徵本身藏著只有知道答案後才會有的資訊
step: Train/Val 切分階段可能發生 temporal 或 group leakage——切分方式搞錯了時間先後或分組
step: 前處理 fit 階段可能發生 preprocessing leakage——scaling／encoding 在切分前就 fit 了全資料
step: 問題會在模型訓練與評估階段,以不正常地好的離線分數浮現出來
---
<svg viewBox="0 0 744 232">
  <path class="dg-line" d="M164 56H196" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M356 56H388" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M540 56H572" marker-end="url(#arrow)" data-step="4"/>

  <path class="dg-line dg-line--warn dg-line--dashed" d="M92 88V140" marker-end="url(#arrow-warn)" data-step="1"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M276 88V140" marker-end="url(#arrow-warn)" data-step="2"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M464 88V140" marker-end="url(#arrow-warn)" data-step="3"/>

  <g data-step="1">
    <rect class="dg-box" x="20" y="24" width="144" height="64" rx="6"/>
    <text class="dg-label" x="92" y="47" text-anchor="middle" dominant-baseline="central">特徵工程</text>
    <text class="dg-sub" x="92" y="67" text-anchor="middle" dominant-baseline="central">原始資料→訓練特徵</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="196" y="24" width="160" height="64" rx="6"/>
    <text class="dg-label" x="276" y="47" text-anchor="middle" dominant-baseline="central">Train/Val 切分</text>
    <text class="dg-sub" x="276" y="67" text-anchor="middle" dominant-baseline="central">決定誰進驗證</text>
  </g>
  <g data-step="3">
    <rect class="dg-box" x="388" y="24" width="152" height="64" rx="6"/>
    <text class="dg-label" x="464" y="47" text-anchor="middle" dominant-baseline="central">前處理 fit</text>
    <text class="dg-sub" x="464" y="67" text-anchor="middle" dominant-baseline="central">fit 統計量</text>
  </g>
  <g data-step="4">
    <rect class="dg-box" x="572" y="24" width="152" height="64" rx="6"/>
    <text class="dg-label" x="648" y="47" text-anchor="middle" dominant-baseline="central">模型訓練與評估</text>
    <text class="dg-sub" x="648" y="67" text-anchor="middle" dominant-baseline="central">分數在這裡失真</text>
  </g>

  <g data-step="1">
    <rect class="dg-box dg-box--warn" x="20" y="140" width="144" height="72" rx="6"/>
    <text class="dg-label dg-text--warn" x="92" y="167" text-anchor="middle" dominant-baseline="central">target leak</text>
    <text class="dg-sub" x="92" y="187" text-anchor="middle" dominant-baseline="central">特徵藏答案</text>
  </g>
  <g data-step="2">
    <rect class="dg-box dg-box--warn" x="196" y="140" width="160" height="72" rx="6"/>
    <text class="dg-label dg-text--warn" x="276" y="167" text-anchor="middle" dominant-baseline="central">temporal/group</text>
    <text class="dg-sub" x="276" y="187" text-anchor="middle" dominant-baseline="central">切分搞錯維度</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="388" y="140" width="152" height="72" rx="6"/>
    <text class="dg-label dg-text--warn" x="464" y="167" text-anchor="middle" dominant-baseline="central">preprocessing</text>
    <text class="dg-sub" x="464" y="187" text-anchor="middle" dominant-baseline="central">fit 太早</text>
  </g>
</svg>
```

## 今日練習題

### 題目

What is data leakage, and how would you identify and prevent it in a modeling workflow?

**來源**：MeetAssist 真實面試題庫（320 場面試樣本中出現 3 次，最近一次 2026-10-18）　**難度**：中等　**環節**：onsite scenario / mid-level

### 拆解思路

1. **先釐清問題**：面試時先問清楚資料的結構——是不是時間序列、有沒有同一實體重複出現的分組結構、pipeline 裡的前處理目前是在哪個階段做的。這題如果直接套公式答「test 不能碰到 train」,等於放棄了展現你知道洩漏有好幾種來源的機會。
2. **建立框架**：把洩漏按來源分成四類來講——特徵層級（target leakage）、前處理層級（preprocessing leakage）、時間層級（temporal leakage）、分組層級（group leakage）,每一類配一句「怎麼發生」加一句「怎麼防」,結構清楚比例子多更重要。
3. **深入核心**：挑一到兩類具體展開,講出可驗證的診斷訊號——例如單一特徵的重要性異常高、train 跟 validation 分數幾乎沒有差距（太好以至於不合理)、或換成 `GroupKFold`／`TimeSeriesSplit` 後分數明顯下滑。能講出「分數下滑才是正常」這個反直覺的結論,是這題的分水嶺。
4. **收尾**：補一句「這些檢查應該寫進 pipeline 的 code review 清單,不是上線後才靠監控發現」,把答案從「知道定義」收到「怎麼變成團隊的工程習慣」。

### 範例回答（面試時可以這樣講）

> **先把洩漏拆成四種來源**：我會先問清楚這是不是時間序列資料、有沒有同一使用者重複出現。資料洩漏的核心是「預測時用不到的資訊,卻在訓練時用到了」,具體會長成四種樣子——特徵本身藏著答案或未來資訊（target leakage）、前處理在切分前就 fit 了全資料（preprocessing leakage）、時間序列用到預測當下還不存在的未來資料（temporal leakage）,以及同一個使用者的紀錄被拆進 train 跟 validation 兩邊（group leakage）。
>
> **診斷上我會找三個訊號**：單一特徵的重要性異常高、遠超過其他特徵一個量級，這通常代表它偷偷藏著答案；train 跟 validation 分數幾乎沒有差距，對一般監督式學習來說這不是好事，反而該懷疑哪裡洩漏了；以及換成正確的切分方式（時間序列用 `TimeSeriesSplit` 並留 gap，有分組結構用 `GroupKFold`）之後，分數如果明顯下滑，代表之前的高分是洩漏撐出來的，這個下滑才是比較接近真實上線表現的數字。
>
> **防範上我會把前處理包進 `Pipeline`**，讓 scaling、imputation、target encoding 都在每一折的訓練資料上單獨 `fit`，再套用到驗證資料，而不是在切分前先對全資料做一次。時間序列額外留出標籤確認所需的等待期，分組資料一律用 `GroupKFold`。最後我會把這幾項檢查寫進 pipeline 的 code review 清單，而不是等上線後指標崩掉才回頭查，因為那時候成本已經是重新訓練加上向利害關係人解釋為什麼離線分數不可信。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有把資料洩漏拆成至少三種不同來源（target／preprocessing／temporal／group） | |
| 有提出具體可驗證的診斷訊號（特徵重要性異常、train/val 分數差距過小） | |
| 有講出為什麼換成正確切分方式後分數下滑才是正常現象 | |
| 有提到前處理要包進 Pipeline、在每個 CV fold 內單獨 fit | |
| 有針對時間序列或分組資料提出對應的切分方式（TimeSeriesSplit／GroupKFold） | |
| 加分：把檢查收斂成工程流程（code review 清單),不是等上線後才靠監控發現 | |

## 延伸閱讀

- [Machine Learning Interviews and How to Spot Data Leakage — DEV Community](https://dev.to/henry123/machine-learning-interviews-and-how-to-spot-data-leakage-20g5) — 補完今天「診斷訊號」這一節，示範面試時怎麼用具體例子說明洩漏的識別過程。
- [How to Discuss Data Leakage, Drift, and Model Monitoring in ML Interviews — Interview Node](https://www.interviewnode.com/post/how-to-discuss-data-leakage-drift-and-model-monitoring-in-ml-interviews) — 把資料洩漏延伸到上線後的 drift 跟監控，適合練完這題後接著複習 10/26 練過的 drift 診斷題。

## 參考資料

- [41 Cross-validation and Data Leakage Interview Questions — MeetAssist](https://meetassist.io/interview-questions/machine-learning/validation) — 本篇練習題「What is data leakage, and how would you identify and prevent it in a modeling workflow?」的原始出處與出現頻率統計，屬於 ML fundamentals 面試題庫的 validation 分類。
- [12. Common pitfalls and recommended practices — scikit-learn 官方文件](https://scikit-learn.org/stable/common_pitfalls.html) — 對應「Preprocessing leakage」一節，官方文件說明為什麼要用 Pipeline 避免驗證集統計資訊滲入訓練。
- [8.1. Pipelines and composite estimators — scikit-learn 官方文件](https://scikit-learn.org/stable/modules/compose.html) — 對應「正確做法是把前處理包進 Pipeline」一節，官方文件說明 Pipeline 如何確保每折只用訓練資料 fit 前處理步驟。
