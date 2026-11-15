---
title: "AI Engineer 面試日練 — 2026-11-02：ML Fundamentals"
date: 2026-11-02
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一主題 ML Fundamentals：從 Apple MLE 的真實面試題出發，練習怎麼把 bias-variance tradeoff 從背定義講成「規模變大時槓桿怎麼換」的工程判斷。"
tldr: "今天的核心是 bias-variance tradeoff 在「規模變大」這個條件下會怎麼變化：資料量變大會在同樣模型複雜度下自然壓低 variance，所以規模夠大時常常可以負擔得起更複雜的模型而不過擬合；L1／L2 正則化的差別是幾何上的（diamond 有角 vs circle 沒有角），bagging 降 variance、boosting 降 bias 則是用演算法設計直接對應誤差分解裡的兩項；優化器選 SGD 還是 Adam，也是另一種规模下的 trade-off（Adam 收斂快但記憶體多三倍、可能收斂到較平的 minima 而略為犧牲泛化）。練習題取自 Apple Machine Learning Engineer 面試的真實問法——解釋 bias-variance tradeoff，以及規模變大時你會怎麼想——這類題目的陷阱是只會背公式，答不出「規模」這個條件到底改變了什麼。"
series:
  name: "AI Engineer 面試日練"
  order: 75
---

> 🌏 [English version](/posts/daily/2026-11-02-ai-interview-daily-en)

## 今日主題

星期一固定練 ML Fundamentals。今天這題幾乎是 ML 面試裡最常見的「送分題」——bias-variance tradeoff——但 Apple 的問法加了一個關鍵條件：「規模變大時你會怎麼想」。這個條件讓一道背定義題變成工程判斷題：面試官不是在考你會不會寫出 Error = Bias² + Variance + Irreducible error，是在考你知不知道規模變大之後，原本的槓桿會怎麼換——資料變多、訓練變成分散式、調參的成本結構都不一樣了，你選模型的邏輯要跟著變,不能照搬教科書上那套固定答案。

## 核心概念速記

### Bias-Variance Tradeoff：誤差分解的兩項各自是什麼

Bias 是模型太簡化造成的誤差（underfitting）——像拿線性模型硬套一個明顯非線性的關係；variance 是模型對訓練資料太敏感造成的誤差（overfitting）——像一棵深到會記住雜訊的決策樹。總誤差可以分解成 Bias² + Variance + 不可消除的雜訊（irreducible error），模型複雜度往上調，bias 會下降但 variance 會上升，目標是找到兩項加起來最小的那個甜蜜點，不是一味把模型做複雜或做簡單。

### L1 跟 L2 正則化的差別是幾何上的，不是隨便選一個就好

兩者的約束區域形狀不同：L1（Lasso）的約束是一個鑽石形，角落剛好落在座標軸上，所以損失函數的等高線往外擴張時很容易先碰到角落——角落上代表某個係數剛好等於 0，這就是 L1 會把特徵「選掉」、產生稀疏解的幾何原因；L2（Ridge）的約束是一個圓形,沒有角,等高線碰到圓的任何一點都不會剛好落在座標軸上,所以 L2 只會把係數一起往 0 的方向壓縮變小,但很少真的壓到 0。實務上要特徵選擇用 L1,要穩定的全域收縮用 L2,兩個都要就用 Elastic Net。

### Bagging 降 variance，Boosting 降 bias——不是兩種差不多的 ensemble 手法

Bagging（如 random forest）讓多個高 variance、低 bias 的模型（深樹）在不同的資料子集上各自過擬合，再把結果平均掉,利用平均降低整體 variance,bias 基本不變;boosting（如 gradient boosting）則是讓多個簡單、高 bias 的弱模型依序修正前一棵的殘差,每一輪都在縮小目前解不掉的系統性誤差,所以降的是 bias,但序列式疊加也可能把 variance 疊高、容易在不穩定的訊號上過擬合。面試時被問「這個場景你選 bagging 還是 boosting」,答案要對應到「現在的誤差主要是哪一項」,不是背「boosting 準確率通常比較高」這種片面結論。

### 優化器選擇：SGD 跟 Adam 的 trade-off 跟著規模變

Adam 用一階與二階動量的指數移動平均來自動調整每個參數的學習率,在稀疏梯度或非凸的深度網路損失曲面上收斂通常比 vanilla SGD 快,實測在稀疏資料上能少 40–60% 的 epoch 達到同等效果,但代價是要多存一階、二階動量,記憶體用量大約是 SGD 的三倍,每次迭代的計算開銷也多 20–30%。另一個常被引用的觀察是 Adam 的自適應步長有時會收斂到比較平坦（flat）的 minima,泛化能力略輸給 SGD 收斂到的解,所以業界常見策略是前期用 Adam 快速收斂,訓練尾段切換成 SGD 做精修。規模變大時,記憶體與通訊成本會被放大,這個 trade-off 在分散式訓練上會變得更明顯,不是單機訓練時那種「選哪個都差不多」的無關緊要選項。

## 今日練習題

### 題目

Explain the bias-variance tradeoff and how you'd think about it when selecting a model at scale.

**來源**：Apple Machine Learning Engineer 面試 ML fundamentals 輪（整理自 IGotAnOffer 面試指南）　**難度**：中等　**環節**：onsite ML fundamentals round

### 拆解思路

1. **先釐清問題**：「at scale」這個詞本身是模糊的,面試時值得先反問一句釐清——是指資料量大到要分散式訓練、要服務的線上流量規模,還是指要同時維護大量模型。不同的「scale」改變的槓桿不一樣,答錯方向等於白講。
2. **建立框架**：先把 Error = Bias² + Variance + Irreducible error 講清楚,定義 bias 跟 variance 各自對應什麼失效模式,再說明模型複雜度跟兩者的反向關係——這是整題的地基,沒有這層,後面講規模只是空話。
3. **深入核心**：規模變大時,地基上的槓桿會換位置——資料量變大,在同樣模型複雜度下,variance 會自然下降（更多樣本讓模型對訓練集的雜訊不那麼敏感),這意味著規模夠大時,原本會過擬合的複雜模型現在可能負擔得起了,不代表更複雜永遠更好,但決策邊界確實往複雜的方向推移。分散式訓練改變了有效 batch size 跟梯度雜訊,需要搭配 learning rate warm-up／scaling rule,不能直接照搬單機時代的超參數。手動調正則化在大規模下的試錯成本變高,所以要靠 ensemble 的分工——bagging 負責壓 variance、boosting 負責壓 bias——取代一次次重新調單一模型的正則化強度。
4. **收尾**：總結成一句話——「選模型不是選『最強』的那個,是依照資料規模跟工程成本,找出 bias 跟 variance 加總起來最小的那個點,而且規模變大時這個點會往更複雜的方向移動」,再補一句生產環境的務實做法:先在小樣本子集上畫學習曲線,便宜地驗證 bias/variance 大致走向,確認方向對了才真正投入全量規模化訓練,最終還是要靠 A/B test 的業務指標驗證,不是只看離線的 bias/variance 分析。

### 範例回答（面試時可以這樣講）

> **先把地基講清楚**：Bias-variance tradeoff 講的是把總誤差拆成三項——Bias 的平方加 Variance 再加不可消除的雜訊。Bias 是模型太簡單抓不住資料的結構,Variance 是模型對訓練資料太敏感,換一批資料結果就差很多。模型複雜度往上調,Bias 通常會降,但 Variance 會升,所以不是模型越複雜越好,是要找兩項加起來最小的那個甜蜜點。
>
> **規模變大之後槓桿會換位置**：如果問題是在規模夠大的情境下怎麼選模型,我會先強調一件常被忽略的事——資料量變大,在同樣模型複雜度下 Variance 會自然往下降,因為更多樣本讓模型沒那麼容易被少數雜訊帶偏。這代表規模夠大時,我可能可以負擔得起比小資料時更複雜的模型而不過擬合,決策邊界會往複雜的方向移動,但這不是說規模大就該無限疊加複雜度。分散式訓練還會改變 batch size 跟梯度雜訊的性質,我會搭配 learning rate scaling rule 去校正,而不是直接沿用單機時代調好的超參數。
>
> **工程上怎麼落地**：手動一次次調單一模型的正則化強度,在大規模下的試錯成本很高,所以我會傾向用 ensemble 的分工取代——bagging 像 random forest 拿去壓 Variance,boosting 拿去壓 Bias,依照目前觀察到的誤差主要落在哪一項來選。實際動手前,我會先在一個小樣本子集上畫學習曲線,便宜驗證 bias/variance 大致走向,方向對了才投入全量訓練,最後還是要靠 A/B test 的業務指標驗證,不能只看離線分析就下結論。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有寫出 Bias² + Variance + Irreducible error 的分解,並正確定義 bias 跟 variance 各對應哪種失效模式 | |
| 有講出「資料規模變大 → 同樣複雜度下 variance 自然下降 → 可以負擔更複雜的模型」這個規模特有的推論,而不是只背靜態定義 | |
| 有提到至少一種正則化或 ensemble 手段,並對應到它分別處理 bias 還是 variance（L1/L2、bagging vs boosting） | |
| 有提到分散式訓練或大規模情境下,學習率/優化器需要跟著調整,不能照搬單機超參數 | |
| 有提到用小樣本學習曲線先驗證方向、再投入全量規模化訓練的省成本做法 | |
| 加分：提到正式上線後要靠 A/B test 業務指標驗證,不是只看離線 bias/variance 分析就下結論 | |

## 延伸閱讀

- [L1 vs L2 Regularization: The Geometric Intuition Behind Each — MetricGate](https://metricgate.com/blogs/regularization-l1-vs-l2-intuition) — 用鑽石形跟圓形約束區域的幾何圖解釋為什麼 L1 會把係數壓到剛好 0、L2 不會，延伸閱讀面試常被追問的「為什麼」。
- [Optiver Machine Learning Engineer Interview Guide — InterviewQuery](https://www.interviewquery.com/interview-guides/optiver-machine-learning-engineer) — bagging 降 variance、boosting 降 bias 的對應說明，搭配高波動市場情境下怎麼選的實例。

## 參考資料

- [Apple Machine Learning Engineer Interview (questions, process, prep) — IGotAnOffer](https://igotanoffer.com/en/advice/apple-machine-learning-engineer-interview) — 本篇練習題「Explain the bias-variance tradeoff and how you'd think about it when selecting a model at scale」的原始問法來源，列在 Apple MLE fundamentals 輪常見問題。
- [Machine Learning Engineer Interview Prep (2026): Skills, Salary & Questions — DataInterview](https://www.datainterview.com/blog/machine-learning-engineer-interview-prep) — 對應「Bias-Variance Tradeoff」一節的誤差分解定義與用語來源。
- [L1 vs L2 Regularization: The Geometric Intuition Behind Each — MetricGate](https://metricgate.com/blogs/regularization-l1-vs-l2-intuition) — 對應「L1 跟 L2 正則化的差別是幾何上的」一節，鑽石與圓形約束區域的幾何說明來源。
- [Optiver Machine Learning Engineer Interview Guide — InterviewQuery](https://www.interviewquery.com/interview-guides/optiver-machine-learning-engineer) — 對應「Bagging 降 variance，Boosting 降 bias」一節的 ensemble 分工說明來源。
- [Stochastic Gradient Descent vs Adam Optimizer: Convergence on Sparse Data — Patsnap Eureka](https://eureka.patsnap.com/report-stochastic-gradient-descent-vs-adam-optimizer-convergence-on-sparse-data) — 對應「優化器選擇：SGD 跟 Adam 的 trade-off」一節的記憶體用量與收斂速度數字來源。
