---
title: "AI Engineer 面試日練 — 2026-11-23：ML Fundamentals"
date: 2026-11-23
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一主題 ML Fundamentals：從真實面試題出發，練習為什麼 AUC 很高的詐欺模型拿去加總成預期損失金額會整個算錯，以及怎麼用 reliability diagram、ECE 跟 Brier score 分解把「排序很準」跟「機率可信」這兩件事分開診斷。"
tldr: "AUC 高只代表模型排得準，不代表它吐出來的機率數字可以直接拿去加總或算期望損失；校準（calibration）要另外用 reliability diagram 跟 ECE 檢查，miscalibrate 常見原因是樹模型/SVM 把機率推向極端、深度網路天生過度自信，或是做了 class reweighting 卻忘記機率基準跟著偏移，修正用 Platt scaling 或 isotonic regression，但一定要在模型沒見過的資料上 fit，否則校準結果本身就是假的。"
series:
  name: "AI Engineer 面試日練"
  order: 96
---

> :globe: [English version](/posts/daily/2026-11-23-ai-interview-daily-en)

## 今日主題

星期一固定練 ML Fundamentals。今天的主題是機率校準（probability calibration）——一個很容易被「AUC 很高就是好模型」這句話蓋過去的面試重點。校準考的不是「模型排得準不準」，而是「模型吐出來的那個機率數字，能不能直接拿去做決策」：信用卡盜刷模型給 0.8，代表這群交易裡真的有 80% 是盜刷，還是只是模型自己比較有自信？這個區別在「你的模型要怎麼接上業務決策」這類環節特別容易被問到，因為很多人背得出 Platt scaling、isotonic regression 這些名詞，卻講不清楚什麼時候該檢查、什麼時候真的需要修。

## 核心概念速記

### 校準跟 discrimination 是兩件不同的事，AUC 看不出校準好壞

一句話：AUC 問的是「正例的分數有沒有排在負例前面」，校準問的是「分數本身等不等於真正的機率」。模型可以把所有正例都排在負例之前，AUC 等於 1，卻把每個正例都標成 0.9、每個負例標成 0.1——排序完全正確，數字卻離真相很遠。任何把分數做單調轉換的校準方法（Platt scaling、isotonic regression）理論上完全不會動到排序，AUC 不會變，但機率的可信度會差很多，面試官要聽到你知道這是兩個獨立的軸，不是「AUC 高了校準自然就好」。

### 不同模型往錯的方向不一樣，不是隨機亂飄

樹模型的 bagging/boosting 跟以 margin 為核心的 SVM，傾向把機率推向極端（0 或 1 附近罕見，中間值被擠向兩側呈 S 型），因為多棵樹投票平均會抹掉接近 0 或 1 的機會；而現代深度網路用 cross-entropy 訓練，模型容量越大反而越容易「過度自信」，predict 出來的 softmax 機率系統性偏高。另一個常被忽略的來源是訓練時做了 class reweighting 或對少數類別過採樣——這會讓模型輸出的機率基準（base rate）跟著訓練分佈位移，上線後看到的真實發生率卻沒有變，於是整批機率系統性地偏高或偏低。

### 診斷用 reliability diagram + ECE，量化用 Brier score 的三項分解

Reliability diagram（也叫 calibration curve）把預測機率切成幾個 bin，畫出每個 bin 的平均預測值 vs 實際正例比例，落在對角線上才算校準；ECE（Expected Calibration Error）把每個 bin 的落差依樣本數加權平均成一個數字，越小越好。更進一步，Brier score 可以分解成 reliability（校準誤差）− resolution（模型能不能分辨難易）+ uncertainty（資料本身的不確定性，由 base rate 決定的下限），這個分解很關鍵：一個 Brier score 很低的模型，如果 base rate 本來就很極端（例如詐欺率 1%），大部分的低分其實來自 uncertainty 項、不是模型真的校準得好，面試官問「Brier score 0.009 是不是很棒」時，答案要從這個分解講起。

### 修正方法要配資料量，而且永遠在模型沒見過的資料上 fit

Platt scaling（對原始分數 fit 一個一維 logistic regression）只有兩個參數，小樣本就能穩定 fit，但假設校準曲線是對稱的 S 型，不一定符合所有模型的偏誤方向；isotonic regression 擬合任意單調的階梯函數，更有彈性，但樣本數不到大約一千筆就容易過擬合出鋸齒狀的校準曲線。兩種方法都有一個不能妥協的前提：calibrator 一定要在模型訓練時沒見過的資料上 fit——如果直接拿 train fold 的預測去 fit calibrator，校準出來的其實是模型對訓練資料的自信程度，不是模型對新資料的真實機率，等於又製造了一層新的洩漏。

```diagram
title: 機率校準三階段：三份資料不能互換
desc: 訓練、校準、驗證各自要用模型沒見過的資料，哪一階段偷用了前一階段用過的資料，結果都會比實際情況好看。
caption: 簡化示意：省略交叉驗證與多類別校準的細節。
step: 在 train fold 上訓練基礎模型
step: 在模型沒訓練過的 calibration fold 上做預測，fit Platt scaling 或 isotonic regression；如果直接用 train fold 來 fit，calibrator 學到的只是模型對訓練資料的自信，不是真正的事後機率
step: 在兩份資料都沒碰過的 test fold 上畫 reliability diagram、算 ECE；如果拿 calibration fold 來驗證，ECE 看起來很漂亮，其實只是驗證了 calibrator 記得自己剛才學過的東西
---
<svg viewBox="0 0 680 220">
  <path class="dg-line" d="M200 56H240" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M420 56H460" marker-end="url(#arrow)" data-step="3"/>

  <path class="dg-line dg-line--warn dg-line--dashed" d="M330 88V140" marker-end="url(#arrow-warn)" data-step="2"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M550 88V140" marker-end="url(#arrow-warn)" data-step="3"/>

  <g data-step="1">
    <rect class="dg-box" x="20" y="24" width="180" height="64" rx="6"/>
    <text class="dg-label" x="110" y="47" text-anchor="middle" dominant-baseline="central">訓練基礎模型</text>
    <text class="dg-sub" x="110" y="67" text-anchor="middle" dominant-baseline="central">train fold</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="240" y="24" width="180" height="64" rx="6"/>
    <text class="dg-label" x="330" y="47" text-anchor="middle" dominant-baseline="central">Fit Calibrator</text>
    <text class="dg-sub" x="330" y="67" text-anchor="middle" dominant-baseline="central">calibration fold</text>
  </g>
  <g data-step="3">
    <rect class="dg-box" x="460" y="24" width="180" height="64" rx="6"/>
    <text class="dg-label" x="550" y="47" text-anchor="middle" dominant-baseline="central">驗證校準</text>
    <text class="dg-sub" x="550" y="67" text-anchor="middle" dominant-baseline="central">test fold</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--warn" x="240" y="140" width="180" height="64" rx="6"/>
    <text class="dg-label dg-text--warn" x="330" y="163" text-anchor="middle" dominant-baseline="central">用 train fold fit</text>
    <text class="dg-sub" x="330" y="183" text-anchor="middle" dominant-baseline="central">是自信不是機率</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="460" y="140" width="180" height="64" rx="6"/>
    <text class="dg-label dg-text--warn" x="550" y="163" text-anchor="middle" dominant-baseline="central">拿校準用的資料驗</text>
    <text class="dg-sub" x="550" y="183" text-anchor="middle" dominant-baseline="central">結果是假象</text>
  </g>
</svg>
```

## 今日練習題

### 題目

Your fraud model ranks transactions well (AUC 0.848), but Finance wants to forecast next month's total fraud losses by summing up the model's predicted probabilities across all transactions. The model's average predicted probability on a recent test month was 0.313, while only 0.974% of transactions in that month were actually fraud. How do you explain this discrepancy to Finance, and how would you check a model's probabilities in general?

**來源**：改寫自 Pallav Mahapatra Interview Bank 真實面試題庫（Evaluation 分類 Q7）　**難度**：中等偏上　**環節**：onsite scenario / take-home

### 拆解思路

1. **先釐清問題**：先問清楚這個模型訓練時有沒有做 class reweighting 或對少數類別過採樣——如果有，輸出的機率基準本來就不等於真實發生率，這是最常見也最快能定位的原因。同時確認 Finance 要的是「排序」（哪些交易最可能是詐欺，拿去人工複查）還是「加總金額」（算整個月的預期損失），這兩種用法對校準的敏感度完全不同。
2. **建立框架**：把問題拆成「discrimination 有沒有問題」跟「calibration 有沒有問題」兩條線分開講——AUC 0.848 已經回答了第一條線沒問題，第二條線才是這題真正要考的。
3. **深入核心**：講出可驗證的診斷步驟——reliability diagram 看平均預測值在哪個區間系統性偏高，ECE 量化偏差大小，Brier score 拆成 reliability/resolution/uncertainty 三項，排除「這只是因為詐欺率本來就很低」的干擾。接著講修正：在沒訓練過的一份資料上 fit Platt scaling，驗證 AUC 不變但平均預測值貼近真實發生率，且一定要在第三份、calibrator 也沒見過的資料上做最終驗證。
4. **收尾**：把答案收到「跟 Finance 說清楚可以直接用加總的機率，還是只能用來排序」，校準這件事不是為了讓模型看起來更準，而是為了讓下游的人知道這個數字能不能直接拿去做算術。

### 範例回答（面試時可以這樣講）

> **先把這個現象定位成校準問題，不是排序問題**：AUC 0.848 代表模型對交易的相對風險排序是準的——真正詐欺的交易，分數確實比較高。但 Finance 想做的是把機率「加總」成金額，這個用法要求的是校準，不是排序。平均預測機率 0.313 遠高於實際發生率 0.974%，這代表模型系統性高估，通常是因為訓練時對少數類別做了 reweighting 或過採樣，讓模型輸出的機率基準跟著訓練分佈偏移，但真實上線資料的發生率沒有變。
>
> **診斷上我會畫 reliability diagram、算 ECE，再看 Brier score 的分解**：用等頻 bin 畫出每個 bin 的平均預測值跟實際正例比例，如果整條曲線都在對角線上方，代表模型全面高估，不是局部問題。ECE 把這個偏差量化成一個數字方便追蹤。同時我會把 Brier score 拆成 reliability、resolution、uncertainty 三項——在 1% 這種極端 base rate 下，即使模型亂猜，Brier score 本身也會因為 uncertainty 項很小而顯得漂亮，所以不能只看總分，要確認低分是不是真的來自校準誤差小，而不是 base rate 本身就低。
>
> **修正上我會在模型沒訓練過的一份資料上 fit Platt scaling**，因為樣本量通常不到一千筆，isotonic regression 容易過擬合出不穩定的階梯曲線；fit 完之後驗證 AUC 沒有變（因為是單調轉換），但平均預測值貼近 0.974%，而且用第三份、calibrator 也沒碰過的資料做最終確認，不能直接拿 fit calibrator 用的那份資料來驗收，那只是驗證了 calibrator 記得自己剛學過的東西。最後我會明確告訴 Finance：校準後的機率可以安全加總，校準前的只能用來排序，不能拿來算金額。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有把「discrimination（AUC）」跟「calibration」區分成兩個獨立問題 | |
| 有指出 class reweighting／過採樣是機率系統性偏移的常見原因 | |
| 有提到用 reliability diagram + ECE 診斷，而不是只看單一總分 | |
| 有講出 Brier score 的三項分解，解釋為什麼極端 base rate 下低分不等於校準好 | |
| 有提到 calibrator 要在模型沒見過的資料上 fit，最終驗證要用第三份資料 | |
| 加分：把答案收斂成「校準後能不能直接加總」這個業務決策，不只是技術名詞堆疊 | |

## 延伸閱讀

- [1.16. Probability calibration — scikit-learn 官方文件](https://scikit-learn.org/stable/modules/calibration.html) — 官方文件對 Platt scaling、isotonic regression 跟 `CalibratedClassifierCV` 的完整說明，補完「修正方法」這一節的實作細節。
- [Evaluation: Measuring Models Honestly — Interview Bank](https://www.pallavlabs.com/learn/machine-learning/evaluation--interview-bank) — 今天練習題的原始出處，同一系列還有 Brier score 分解跟 log loss vs Brier score 的延伸討論題，適合接著練。

## 參考資料

- [Evaluation: Measuring Models Honestly — Interview Bank · Pallav Mahapatra](https://www.pallavlabs.com/learn/machine-learning/evaluation--interview-bank) — 本篇練習題改寫自其中 Q7「Does 30% mean 30%?」的詐欺損失預測情境，屬於 ML fundamentals 面試題庫的 evaluation 分類，文中也有對 Brier score reliability/resolution/uncertainty 分解的說明。
- [1.16. Probability calibration — scikit-learn 1.9.1 documentation](https://scikit-learn.org/stable/modules/calibration.html) — 對應「修正方法要配資料量」一節，官方文件說明 Platt scaling（sigmoid）跟 isotonic regression 的適用資料量與 calibrator 必須在獨立資料上 fit 的理由。
- [Top 30 Scikit-learn Interview Questions (2026) — DataInterview](https://www.datainterview.com/blog/scikit-learn-interview-questions) — 對應「不同模型往錯的方向不一樣」一節，文中以 gradient boosting 定價情境具體說明 `CalibratedClassifierCV` 的 `sigmoid`／`isotonic`／`temperature` 三種校準方法選擇。
