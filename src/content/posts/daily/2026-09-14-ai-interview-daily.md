---
title: "AI Engineer 面試日練 — 2026-09-14：ML Fundamentals"
date: 2026-09-14
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "今天練 ML 基礎面試最常見的五個概念——bias-variance tradeoff、L1/L2/Elastic Net 正則化、overfitting/underfitting 的判斷與修法、cross-validation 怎麼選、precision/recall/F1/AUC-ROC 該用哪個——搭配一題「模型上線後表現變差」的排查題。"
tldr: "今天的 ML Fundamentals 輪練涵蓋 bias-variance tradeoff、L1(Lasso)/L2(Ridge)/Elastic Net 正則化的差異、overfitting 與 underfitting 的偵測與修復、K-fold/stratified/time-series cross-validation 的選擇，以及 precision、recall、F1、AUC-ROC 在不同業務情境下該優先看哪個。練習題是一道經典的排查題:模型在開發環境表現很好,上線後卻明顯變差,面試官想看你有沒有系統化的除錯框架,而不是憑直覺猜。"
series:
  name: "AI Engineer 面試日練"
  order: 26
---

> 🌏 [English version](/en/posts/daily/2026-09-14-ai-interview-daily-en)

## 今日主題

星期一輪到 ML Fundamentals,這是幾乎每場 ML/AI Engineer 面試都會出現的底層考點——不是考你背過幾個公式,而是考你能不能在白板上把「為什麼這個模型會這樣」講清楚。2026 年的面試指南依然把 bias-variance、正則化、cross-validation、evaluation metrics 列為 phone screen 最常見的四大主題,因為這些概念是後面所有系統設計題(feature store、監控、A/B test)的地基。今天練的內容,對應的是面試前段最容易被問到、也最容易因為講得太生硬而扣分的部分。

## 核心概念速記

### Bias-variance tradeoff

模型不能同時把 bias 跟 variance 都壓到最低——把模型變複雜以降低 bias(更貼近訓練資料)通常會拉高 variance(對訓練資料的雜訊更敏感);反過來簡化模型會拉高 bias、降低 variance。面試時最好講成一個連續光譜,而不是二選一:目標是找到讓「測試誤差」最小的複雜度,而不是讓訓練誤差趨近於零。

### L1、L2、Elastic Net 正則化

正則化是在 loss function 上加一個懲罰項,阻止模型把權重養得過大。L1(Lasso)加的是係數絕對值總和 `Loss + λΣ|wᵢ|`,會把部分係數直接壓到 0,等於自動做特徵選擇,適合「大部分特徵其實沒用」的情境。L2(Ridge)加的是係數平方總和 `Loss + λΣwᵢ²`,會把所有係數往 0 收縮但不會歸零,適合「大部分特徵都有點用」的情境。Elastic Net 兩者都加,`λ` 這個正則化強度要靠 cross-validation 調。

### Overfitting 與 underfitting:怎麼判斷、怎麼修

Overfitting 是模型把訓練資料的雜訊也背下來了——訓練誤差低、測試誤差高,判斷方式是看 train/validation 準確率的落差夠不夠大。修法:加正則化(L1/L2/dropout)、簡化模型、加訓練資料、用 cross-validation、加 early stopping。Underfitting 是模型太簡單,訓練誤差跟測試誤差都高。修法:換更複雜的模型、加特徵、降低正則化強度、訓練更久。面試時把兩者的「症狀」講出來,比單背修法更有說服力。

### Cross-validation 怎麼選

K-fold CV 把資料切成 K 份,輪流拿 K-1 份訓練、1 份驗證,平均結果,比單一次 train/validation 切分更能反映真實的泛化能力。Stratified K-fold 在切分時保留每個 fold 裡的類別比例,對不平衡資料集是必要的,不然某個 fold 可能完全沒有正樣本。Time-series cross-validation 必須尊重時間順序——永遠只能用「未來」資料去驗證用「過去」資料訓練出的模型,亂切分會直接造成資料洩漏。

### Evaluation metrics:什麼情境看什麼指標

Accuracy 在類別不平衡時會騙人——1% 正樣本的資料集,全猜負類都有 99% 準確率。Precision(猜為正的裡面有多少是真的正)在誤判成本高時要優先看,例如垃圾郵件過濾錯殺重要信件;Recall(真正的正樣本裡抓到多少)在漏判成本高時要優先看,例如癌症篩檢漏掉真病例。AUC-ROC 是 threshold-independent 的排序能力指標,適合還沒決定 threshold、或要跨多個操作點比較模型時用;正樣本極稀少時則該看 precision-recall AUC 而不是 ROC AUC。

## 今日練習題

### 題目

一個模型在開發環境(離線驗證集)上表現很好,上線之後效果卻明顯變差。你會怎麼一步步排查?

**來源**：DataExpertise《Machine Learning Interview Questions and Answers — Top 60 for 2026》　**難度**：中等偏進階　**環節**：phone screen / onsite 系統排查題

### 拆解思路

1. **先釐清問題**：先問清楚「變差」是怎麼量化的——是哪個 metric 掉了、掉了多少、是從上線那一刻就掉,還是過一陣子才慢慢變差;是所有使用者族群一起掉,還是特定 segment 特別明顯;上線前後 feature pipeline 或資料來源有沒有變動。這些答案會決定你接下來要往哪個方向查。
2. **建立框架**：按「最常見到最少見」排查——第一層查 pipeline bug(訓練跟服務時 feature 算法是不是同一份邏輯,training-serving skew);第二層查資料分布飄移(production 的輸入分布是不是跟訓練資料不一樣了);第三層查 concept drift(feature 跟 target 之間的關係本身變了);第四層回頭查訓練階段有沒有資料洩漏(用了正式環境根本拿不到的未來資訊)。
3. **深入核心**：最容易被面試官追問的技術細節是 training-serving skew——同一個「使用者過去 7 天平均訂單數」這種 feature,如果訓練時是用一次性批次 SQL 算的,上線時卻是即時累加算的,兩邊的計算時間點、缺值填補方式很可能對不上,而且離線驗證完全測不出來,因為離線用的就是訓練那份邏輯。
4. **收尾**：提出怎麼建立監控閉環,不只是這次修好,而是下次能更快發現——feature distribution drift 告警(比較線上跟訓練分布的統計量)、prediction distribution 監控(模型輸出分布突然位移通常比等真實 label 回來更早發現問題)、新模型上線前先跑 shadow deployment 比對線上線下預測是否一致。

### 範例回答（面試時可以這樣講）

> **先框定範圍**：我會先確認「表現變差」的具體定義——是哪個 metric、掉了多少百分比、是全面下滑還是特定 segment,以及上線前後 feature pipeline 有沒有異動,這決定了我要從 pipeline bug 還是分布飄移查起。
>
> **系統化排查**：我會按機率排序查——先比對訓練跟線上服務的 feature 計算邏輯是不是同一份程式碼,這是最常見也最容易查的 training-serving skew;接著拉線上輸入資料的統計量(平均值、缺值率、類別分布)跟訓練資料對比,看有沒有明顯的 distribution shift;如果兩者都排除,才往 concept drift 或訓練階段的資料洩漏去查,因為這兩個成因通常要花更久時間才能證實。
>
> **預防勝於排查**：這次修完之後,我會補上 feature drift 告警跟 prediction distribution 監控,讓下次分布飄移在真實業務指標受影響之前就被抓到,並且要求任何模型改版都先跑一段時間的 shadow deployment 再正式切流量。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先釐清「變差」怎麼量化、哪個 segment、上線前後有沒有變動 | |
| 提到 training-serving skew(訓練與服務 feature 計算邏輯不一致) | |
| 提到 data / concept drift 的差異 | |
| 沒有漏掉訓練階段本身資料洩漏的可能性 | |
| 排查順序有邏輯(先查最常見、最好驗證的原因) | |
| 加分項：提出監控閉環(drift alert、prediction monitoring、shadow deployment)防止再發生 | |

## 延伸閱讀

- [Master the Bias-Variance Tradeoff: Top 10 Interview Questions — Analytics Vidhya](https://www.analyticsvidhya.com/blog/2025/08/bias-variance-tradeoff/) — 用十道題把 bias-variance 從定義講到實務判斷,適合補強今天沒展開的細節。
- [bias-and-variance-interview-questions — Devinterview-io (GitHub)](https://github.com/Devinterview-io/bias-and-variance-interview-questions) — 題庫形式整理的 bias-variance 面試問答,適合當作口頭練習的題庫。
- [Crash Course to Crack Machine Learning Interview - Part 1: Bias vs Variance — buildml](https://buildml.substack.com/p/crash-course-to-crack-machine-learning) — 從一個完整面試準備系列的角度切入 bias-variance,對應到系列後續還會講的其他主題。

## 參考資料

- [Machine Learning Interview Questions and Answers — Top 60 for 2026 — DataExpertise](https://www.dataexpertise.in/machine-learning-interview-questions-answers-2026/) — 正則化(L1/L2/Elastic Net)、overfitting/underfitting 判斷與修法、cross-validation 選擇、evaluation metrics 段落與今日練習題的來源。
- [Master the Bias-Variance Tradeoff: Top 10 Interview Questions — Analytics Vidhya](https://www.analyticsvidhya.com/blog/2025/08/bias-variance-tradeoff/) — Bias-variance tradeoff 概念表述的參考來源。
