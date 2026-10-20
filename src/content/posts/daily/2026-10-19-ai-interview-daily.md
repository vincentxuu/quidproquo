---
title: "AI Engineer 面試日練 — 2026-10-19：ML Fundamentals"
date: 2026-10-19
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一主題 ML Fundamentals：從 Amazon ML Engineer 真實面試題出發，練習怎麼把 class imbalance、regularization、評估指標三件事講成一條完整的優化邏輯。"
tldr: "今天的核心是 bias-variance trade-off、L1/L2 regularization 的數學直覺、gradient descent 變體怎麼選，以及一個很容易被忽略的評估陷阱：重複拿 validation 分數去調參，本身就是一種資料洩漏。練習題取自 Amazon ML Engineer onsite 的真實問法——資料不平衡時怎麼處理，並從優化角度解釋 L1/L2 怎麼運作——這類問題的關鍵不是背公式，是能把資料層面、模型層面、評估層面的手段分開講清楚。"
series:
  name: "AI Engineer 面試日練"
  order: 61
---

> 🌏 [English version](/posts/daily/2026-10-19-ai-interview-daily-en)

## 今日主題

星期一固定練 ML Fundamentals：loss function、regularization、optimization、evaluation metrics、bias-variance 這幾塊幾乎是所有 ML/AI Engineer 面試的地基題。公司不會只問定義,真正要看的是你能不能把這些概念串成一條完整的決策鏈——資料出了什麼問題、模型怎麼回應、評估時又該換哪個指標。這類題目常出現在 phone screen 的技術關卡，答得散(只背定義、不接資料和評估)是最常見的失分點。

## 核心概念速記

### Bias-variance trade-off

模型太簡單(參數太少)會有高 bias、低 variance,也就是欠擬合;模型太複雜(參數太多)會變成低 bias、高 variance,也就是過擬合。面試時要能講出具體訊號:訓練誤差和驗證誤差都高且接近,通常是高 bias;訓練誤差很低但驗證誤差明顯higher,通常是高 variance。調整方向也要對應講出來——高 bias 加特徵、加模型容量;高 variance 加 regularization、加資料、做 ensemble。

### L1 vs L2 regularization

L1(Lasso)在 loss function 裡加權重絕對值的懲罰項,梯度在零點附近是常數,會把不重要特徵的權重直接壓到零,等於自動做了 feature selection,但也因為在零點不可微分,訓練上需要 subgradient 或 proximal gradient 這類方法。L2(Ridge)加的是權重平方的懲罰項,梯度跟權重大小成正比,效果是把所有權重同步縮小而不會變成零,計算上有 closed-form 解更穩定,但不會自動做特徵篩選。面試時這題常被包裝成「資料不平衡、overfitting 嚴重,你怎麼處理」,要能把 L1/L2 的差異接回實際場景選型。

### Gradient descent 變體怎麼選

Batch gradient descent 每次用全部資料算梯度,方向準但每一步很貴;Stochastic gradient descent(SGD)每次只用一筆樣本,更新快但梯度雜訊大、收斂路徑會震盪;Mini-batch 介於兩者之間,是工業界預設選項,透過 batch size 控制梯度估計的 variance 和每步運算成本的平衡。面試官常會追問 batch size 怎麼選——太小震盪嚴重難收斂,太大接近 batch gradient descent、失去 SGD 的 regularization 效果(雜訊本身能幫忙跳出壞的局部最小值)。

### 評估指標的資料洩漏陷阱

一個常被忽略的細節:如果反覆拿 validation set 的分數去調超參數、選模型,其實就是在把 validation 資料的資訊間接「洩漏」進模型裡,這跟 test set 污染是同一種風險,只是更隱蔽。正確做法是用 nested cross-validation,或者把資料切成 train / validation / test 三層,test set 只在最終評估時用一次。面試時被問「你怎麼確保模型沒有 overfit 到你的評估流程本身」,答出這點會明顯拉高分數。

## 今日練習題

### 題目

公司的訓練資料裡,少數類別(minority class)的樣本數遠少於多數類別,模型在上面出現明顯 overfitting。請說明你會怎麼處理這個 class imbalance 問題,並從優化的角度解釋 L1 跟 L2 regularization 分別怎麼運作。

**來源**：Amazon Machine Learning Engineer onsite（整理自 IGotAnOffer 面試指南）　**難度**：中等　**環節**：onsite

### 拆解思路

1. **先釐清問題**：先問清楚不平衡的比例(是 1:10 還是 1:1000)、這是分類還是迴歸問題、少數類別的樣本品質如何(是真的稀少還是標註有問題)、以及這個模型上線後的延遲與誤判成本限制。
2. **建立框架**：把手段分成三層講——資料層面(resampling、合成樣本)、模型層面(regularization、cost-sensitive loss)、評估層面(換指標)。先講框架再填細節,面試官會覺得你是有系統地在拆問題,不是想到哪講到哪。
3. **深入核心**：這題的技術核心在 L1/L2 的梯度行為差異——L1 的懲罰項梯度是常數,會把不重要權重壓到零做隱性特徵篩選,但在不平衡資料裡容易把少數類別僅有的幾個關鍵特徵也壓掉;L2 的懲罰項梯度跟權重大小成正比,縮小所有權重但保留全部特徵,在樣本稀少時通常更穩定。要講清楚:regularization 本身解決的是過擬合,不是 class imbalance 本身,兩者要分開處理。
4. **收尾**：總結成一句話——「regularization 讓模型不要在少數樣本上硬記噪音,但分佈不均的根本問題還是要靠資料策略和指標選擇來補」,再補一句生產環境會怎麼監控(data drift、定期重新校正 threshold)。

### 範例回答（面試時可以這樣講）

> **先看資料本身**：我會先確認不平衡比例跟業務情境——如果是信用卡盜刷偵測這種 1:1000 等級的不平衡,我會先做 class-weighted sampling 或是對少數類別做 SMOTE 這類合成樣本,而不是直接丟給模型硬練。同時我會檢查少數類別樣本是不是標註品質有問題,因為樣本少的時候,一兩筆錯誤標註對模型的影響會被放大。
>
> **再看模型與優化目標**：如果資料策略之後 overfitting 還是明顯,我會在 loss function 上加 regularization。L1 的懲罰項對權重取絕對值,梯度是固定方向,會把不重要特徵的權重直接壓到零,相當於自動做特徵選擇,但在樣本稀少的情境下有風險——它可能連少數類別僅有的幾個關鍵訊號特徵都一起壓掉。L2 的懲罰項對權重取平方,梯度跟權重大小成正比,效果是讓所有權重同步縮小但不會變成零,在樣本量小、特徵之間關聯性高的情況通常更穩,所以我會先選 L2 或 Elastic Net 作為起點,再用驗證集決定要不要加 L1 做稀疏化。
>
> **最後接到生產環境**：評估上我不會用 accuracy,會換成 precision/recall 和 PR-AUC,因為不平衡資料下 accuracy 可以高到 99% 但完全抓不到少數類別。上線後我會持續監控 data drift,因為 class 比例在生產環境常常會隨時間漂移,需要定期重新校正分類門檻。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚 imbalance 的比例與業務情境 | |
| 有把資料層面、模型層面、評估層面的手段分開講 | |
| 有講清楚 L1 稀疏化 vs L2 縮小權重的梯度直覺差異 | |
| 有指出 regularization 解決的是過擬合，不是 class imbalance 本身 | |
| 有提到評估指標要換成 precision/recall/PR-AUC 而非 accuracy | |
| 加分：提到上線後 data drift 監控與門檻重新校正 | |

## 延伸閱讀

- [What Is Regularization? L1, L2, Dropout, and Early Stopping Explained — Unite.AI](https://www.unite.ai/what-is-regularization-l1-l2-dropout-and-early-stopping-explained/) — 把 L1/L2 之外的 dropout、early stopping 也放進同一個「對抗過擬合」的框架裡講，適合補強本篇沒展開的部分。
- [MLQuestions — GitHub](https://github.com/andrewekhalel/MLQuestions) — 69 題涵蓋 ML fundamentals、deep learning、CV、NLP、統計與 coding 的面試問答集，可以當每週練習的題庫來源。

## 參考資料

- [Amazon Machine Learning Engineer Interview (questions, process, prep) — IGotAnOffer](https://igotanoffer.com/blogs/tech/amazon-machine-learning-engineer-interview) — 本篇練習題的原始問法來源。
- [Top Machine Learning Interview Questions and Answers — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — XGBoost 二階優化（gradient + Hessian）與內建 regularization 設計的解說，對應「核心概念」的進階延伸。
- [What Is Regularization? L1, L2, Dropout, and Early Stopping Explained — Unite.AI](https://www.unite.ai/what-is-regularization-l1-l2-dropout-and-early-stopping-explained/) — 對應「L1 vs L2 regularization」一節的技術細節。
- [MLQuestions — GitHub](https://github.com/andrewekhalel/MLQuestions) — 對應「評估指標的資料洩漏陷阱」一節的概念來源。
