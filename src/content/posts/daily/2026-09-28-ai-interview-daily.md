---
title: "AI Engineer 面試日練 — 2026-09-28：ML Fundamentals"
date: 2026-09-28
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一輪到 ML Fundamentals——bagging 跟 boosting 到底各自在減哪一項誤差、XGBoost 靠二階近似橫掃表格資料的原因、正規化跟標準化怎麼選、AdamW 為什麼要把 weight decay 從 loss 裡拆出來，加一題 C3 AI 真實面試題：講出經典 bagging 演算法並解釋為什麼能降低 variance。"
tldr: "今天的 ML Fundamentals 輪練涵蓋五個核心概念：bagging 跟 boosting 分別在打誰的主意(variance vs bias)、boosting 為什麼加太多輪會 overfit 但 random forest 不會、XGBoost 靠梯度加 Hessian 的二階近似跟目標函數內建正則化橫掃表格資料的原因、正規化跟標準化該怎麼選(看演算法假設不是看資料本身)，以及 AdamW 為什麼要把 weight decay 從 loss function 的 L2 懲罰項裡拆出來單獨處理。練習題來自 C3 AI 的 Data Scientist 真實面試:先講出經典的 bagging 演算法、解釋 bootstrap aggregation 為什麼能降低 variance，再被追問換成 boosting 又是靠什麼機制取捨，拆解思路把五個概念串成一套完整的 ensemble 決策框架。"
series:
  name: "AI Engineer 面試日練"
  order: 40
---

> 🌏 [English version](/en/posts/daily/2026-09-28-ai-interview-daily-en)

## 今日主題

星期一輪到 ML Fundamentals，這是所有 AI Engineer 面試的地基——不管後面考不考 LLM 或 agent，面試官幾乎都會先確認你對「誤差從哪裡來、模型為什麼會學壞」有沒有紮實的直覺。今天選的練習題圍繞 ensemble 方法，因為 bagging 跟 boosting 的取捨是最容易被問「然後呢」的一組概念：光背出定義過不了關，面試官想看的是你能不能講清楚它們各自在解決偏差變異分解裡的哪一塊，這正是從 phone screen 到 onsite 都會用到的能力。

## 核心概念速記

### Bagging 減 variance，boosting 減 bias，兩者打的是不同的仗

Bagging（bootstrap aggregating）讓多個模型各自在隨機抽樣的子集上獨立訓練，再把結果平均或投票；因為每個模型看到的資料不同、彼此的錯誤不太相關，平均之後雜訊會互相抵消，減少的是 variance，對高 variance、低 bias 的模型（像深度決策樹）效果最好，Random Forest 是典型代表。Boosting 則是序列訓練，每個新模型專門修正前一個模型答錯的地方，等於是把一群 high bias、low variance 的弱學習器（像淺層決策樹）逐步疊加成強學習器，減少的是 bias。面試官常見的追問是「為什麼 boosting 加越多輪反而可能 overfit，但 random forest 不會」：因為 boosting 持續在逼近訓練誤差，樹的棵數等同模型複雜度的旋鈕，加太多就會把雜訊也學進去；而 bagging 的每一棵樹是獨立訓練再平均，多加樹只是讓平均更穩定，不會讓整體複雜度隨樹數持續上升。

### XGBoost 橫掃表格資料，靠的是二階近似加上目標函數內建正則化

XGBoost 跟傳統 gradient boosting 的差異，在於它用損失函數的二階泰勒展開（同時用梯度跟 Hessian）去逼近每個候選分裂點的品質，這讓每次分裂都能算出一個閉式解的分數，而不用像一階方法那樣只靠梯度方向試探。同時它把正則化直接寫進目標函數裡——`gamma` 控制分裂要帶來多少增益才值得做，`lambda` 對葉節點權重做 L2 懲罰——等於在每一步分裂決策裡就內建了「值不值得更複雜」的判斷，而不是訓練完才靠剪枝補救。面試時如果被問「XGBoost 為什麼比 GBM 快又準」，講出「二階資訊讓每次分裂決策更精準、正則化在目標函數裡而不是事後加」，會比只講「因為它比較新」更有說服力。

### 正規化跟標準化怎麼選，看演算法的假設，不是看資料長什麼樣

正規化（min-max scaling）把特徵壓縮到固定區間（通常是 0 到 1），標準化（z-score scaling）把特徵轉成平均值 0、標準差 1 的分布。判斷標準不是「資料看起來比較適合哪個」，而是「你要餵給哪種演算法」：依賴距離計算的演算法（KNN、K-means、SVM 的 RBF kernel）通常需要縮放到同一尺度，避免尺度大的特徵主導距離；假設資料接近高斯分布、或本身對中心化資料敏感的演算法（線性迴歸的係數解釋、PCA、許多神經網路的初始化假設）比較適合標準化。正規化對離群值很敏感，因為區間的上下界會被離群值直接拉開；標準化雖然也會被離群值影響平均值跟標準差，但相對穩健一些。面試時能講出「先看演算法假設，再決定要不要縮放、縮放成哪一種」，比背兩個定義的差異更接近 senior 等級的回答。

### AdamW 把 weight decay 從 L2 懲罰項裡拆出來，是因為 Adam 的自適應學習率會扭曲 L2 的效果

在傳統的隨機梯度下降裡，L2 正則化（在 loss 上加係數平方和的懲罰項）跟 weight decay（直接把權重乘上一個小於 1 的係數再更新）在數學上是等價的。但 Adam 這類自適應優化器會用每個參數各自的梯度歷史去調整學習率，這代表如果把 L2 懲罰寫進 loss，它的效果會被自適應學習率放大或縮小，跟原本「均勻縮小所有權重」的 weight decay 意圖不一致。AdamW 的做法是把 weight decay 從梯度更新裡解耦出來，直接對權重做固定比例的衰減，不受自適應學習率影響。面試時的重點是講清楚「L2 在 loss 裡 vs weight decay 在更新規則裡，在 SGD 下等價，但在 Adam 下不等價」，這是很多人會混淆、但用 Adam 系列優化器做微調時必須知道的細節。

### KNN 的 k 值選擇，是偏差變異取捨的另一種具體呈現

KNN 是最簡單的非參數方法：對一個新樣本，找出訓練集裡最近的 k 個點，用多數決（分類）或平均（迴歸）做預測，沒有真正的訓練階段，所有計算成本都發生在預測時。k=1 時模型完全記住訓練集裡最近的那一個點，等同高 variance；k 很大時預測會被平滑成接近全域多數決，等同高 bias。選 k 的做法是用交叉驗證找兩者的甜蜜點，二元分類時偏好奇數 k 避免平手。面試官想聽到的是你能把「調 k 值」講成偏差變異取捨的一個具體實例，而不是當成一個獨立的超參數在背。

## 今日練習題

### 題目

C3 AI 的 Data Scientist 面試裡有一題會先要你講出經典的 bagging 演算法是哪一個、解釋 bootstrap aggregation 為什麼能降低 variance；面試官接著追問：「如果換成 boosting，取捨的機制又是什麼？兩者能不能結合著用？」

**來源**：改編自 PracHub 面試題庫（C3 AI，Data Scientist）　**難度**：中等　**環節**：phone screen / 技術基礎

### 拆解思路

1. **先釐清問題**：確認面試官要的是單純的機制解釋，還是想聽到你能不能把 bagging、boosting 放進同一個決策框架裡比較——這決定你要不要主動延伸到「什麼情境選哪一個」。
2. **建立框架**：先講清楚兩者各自對應偏差變異分解的哪一塊(bagging 減 variance、boosting 減 bias)，再回答具體機制(bagging 靠獨立抽樣加平均、boosting 靠序列修正殘差)，最後才進到延伸應用(能不能混用)。
3. **深入核心**：Random Forest 的自助抽樣(bootstrap sampling)讓每棵樹看到的資料有重疊但不完全相同，樹與樹之間的預測誤差因此弱相關，平均之後才能真正壓低 variance；如果樹之間高度相關，平均並不會帶來多少 variance 的下降。Boosting 的核心是每一輪都在擬合前一輪的殘差(或梯度)，這代表它天生就在降低訓練誤差、也就是降低 bias，但也因此比 bagging 更容易在資料雜訊上 overfit，需要靠學習率跟樹的深度去控制。
4. **收尾**：如果被問到能不能結合，可以講「先用 boosting 訓練出幾組模型，再對這些模型的輸出做 bagging 式平均，用意是同時吃到 boosting 降 bias 跟 bagging 降 variance 的好處」，但也要誠實講清楚這種混合法在小資料集上未必划算，因為 boosting 本身在資料量不足時就容易對少數樣本過度擬合。

### 範例回答（面試時可以這樣講）

> **先定位兩者在減什麼**：Bagging 是同時訓練多個獨立模型再平均，目的是降低 variance；Random Forest 是最典型的例子，靠自助抽樣讓每棵樹看到略有不同的資料，樹跟樹的錯誤因此弱相關，平均之後雜訊互相抵消。Boosting 是序列訓練，每一輪都在修正前一輪答錯的地方,本質上是在降低 bias，AdaBoost 跟 Gradient Boosting／XGBoost 都是這個邏輯。
>
> **機制怎麼落地**：Bagging 之所以能降 variance，關鍵是「模型之間要夠不相關」——如果每棵樹都看幾乎一樣的資料、選幾乎一樣的特徵，平均起來效果有限，這也是 Random Forest 除了抽樣還要隨機選特徵子集的原因。Boosting 的風險在另一端：它持續在逼近訓練誤差，樹的棵數等於模型複雜度，加太多輪就會把雜訊當成訊號學進去，所以一定要搭配 learning rate 縮小每一步的貢獻，跟限制樹的深度來控制過擬合。
>
> **能不能混用**：可以，作法是先用 boosting 訓練出幾組偏差較低的模型，再對它們的輸出做平均，同時吃到兩種效果。但我會誠實提到這在小資料集上不一定划算，因為 boosting 本身在資料量不足時就容易對少數樣本過度擬合，混合方法的邊際效益要實際跑交叉驗證確認,不能只靠直覺假設疊加一定更好。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚 bagging 減 variance、boosting 減 bias 的分工 | |
| 有解釋 bagging 靠「模型間弱相關」才能真正壓低 variance | |
| 有講出 boosting 為什麼容易 overfit，以及 learning rate／樹深度怎麼控制 | |
| 有舉出對應的具體演算法(Random Forest／AdaBoost／XGBoost) | |
| 有回答混用的可能性，而不是斷然說「不行」或「都可以」 | |
| 加分項:提到混用效益要靠交叉驗證驗證，不是靠直覺假設 | |

## 延伸閱讀

- [C3 AI Interview Questions (Updated 2026) | PracHub](https://prachub.com/companies/c3-ai) — 今日練習題來源，記錄 C3 AI Data Scientist 面試裡 bagging 與 bias-variance 的真實問法。
- [Machine Learning Interview Questions and Answers (2026) | goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — XGBoost 二階近似跟 KNN 偏差變異段落的延伸，涵蓋更多表格資料模型的面試常見追問。
- [Regularisation Techniques in Machine Learning – L1, L2, Dropout, Early Stopping and Beyond | DataExpertise](https://www.dataexpertise.in/regularisation-techniques-machine-learning-l1-l2-dropout/) — AdamW 跟 weight decay 解耦段落的延伸，額外涵蓋 dropout 跟 early stopping 的面試問法。

## 參考資料

- [C3 AI Interview Questions (Updated 2026) | PracHub](https://prachub.com/companies/c3-ai) — 今日練習題「bagging 演算法與 bootstrap aggregation 為什麼能降低 variance」的來源，是 AI Engineer 面試 ML Fundamentals 環節的常見真實題型。
- [Machine Learning Interview Questions and Answers (2026) | goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — 核心概念「XGBoost 橫掃表格資料」與「KNN 的 k 值選擇」段落的來源。
- [Regularisation Techniques in Machine Learning – L1, L2, Dropout, Early Stopping and Beyond | DataExpertise](https://www.dataexpertise.in/regularisation-techniques-machine-learning-l1-l2-dropout/) — 核心概念「AdamW 把 weight decay 從 L2 懲罰項裡拆出來」段落的來源。
- [Normalization vs Standardization | GeeksforGeeks](https://www.geeksforgeeks.org/machine-learning/normalization-vs-standardization/) — 核心概念「正規化跟標準化怎麼選」段落的來源。
- [ML Interview Q Series: How do Bagging and Boosting methods differ | Rohan Paul](https://www.rohan-paul.com/p/ml-interview-q-series-how-do-bagging) — 練習題拆解思路中「bagging／boosting 混用」段落的來源。
