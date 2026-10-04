---
title: "AI Engineer 面試日練 — 2026-10-05：ML Fundamentals"
date: 2026-10-05
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一輪到 ML Fundamentals——Grid Search、Random Search、Bayesian Optimization 三種超參數搜尋策略的效率差距、Huber Loss 怎麼在 MSE 跟 MAE 之間找離群值的折衷、維度詛咒為什麼讓 PCA 不只是降維工具，加一題 Pinterest 真實面試題：梯度消失的成因，以及 ReLU、Leaky ReLU、ELU 三種激活函數各自用什麼數學代價去緩解它。"
tldr: "今天的 ML Fundamentals 輪練涵蓋四個核心概念：Grid Search／Random Search／Bayesian Optimization 的超參數搜尋效率差距(Bayesian 用代理模型記住過去試驗，大約少 7 倍迭代、快 5 倍)、Huber Loss 用一個轉折點 delta 把 MSE 的平滑梯度跟 MAE 的離群值穩健性縫在一起、維度詛咒如何讓距離度量在高維空間失效、以及 PCA 當降維工具之外更深一層的角色。練習題來自 Pinterest Machine Learning Engineer 面試(PracHub 2026 題庫)：解釋深層神經網路梯度消失的成因，並討論 ReLU、Leaky ReLU、ELU 三種激活函數各自用什麼數學代價去緩解，拆解思路把「連鎖律乘積趨近於零」到「换激活函數换到的是哪種新問題」串成一套完整的推理鏈。"
series:
  name: "AI Engineer 面試日練"
  order: 47
---

> 🌏 [English version](/en/posts/daily/2026-10-05-ai-interview-daily-en)

## 今日主題

星期一輪到 ML Fundamentals，今天選的四個概念跟練習題都圍繞同一條線：模型訓練過程裡「哪裡會失控、失控了要用什麼數學工具補救」。超參數搜尋決定你有沒有效率找到好設定，Huber Loss 決定離群值會不會把迴歸模型帶偏，維度詛咒決定你的距離度量在高維空間還有沒有意義，梯度消失則是深層網路訓練本身會不會失敗。這些都是 phone screen 到 onsite 都會出現的「為什麼」追問，背定義過不了關，面試官要聽的是數學機制跟 trade-off。

## 核心概念速記

### Grid Search、Random Search、Bayesian Optimization——超參數搜尋在「記不記得過去試驗」上分道

Grid Search 在一個固定網格上窮舉所有組合，連續型超參數也只能離散成固定間距，完全不記得前一次試驗的結果，是最慢但最窮舉的基準線。Random Search 改成隨機抽樣組合，拿掉了網格的離散限制，速度比 Grid Search 快，但本質上還是「盲試」，不會根據已經跑過的結果調整下一次要試哪裡。Bayesian Optimization 的關鍵差異是它會建一個代理模型（通常是高斯過程）去預測每個設定可能有多好，再用 acquisition function 在「試已知有效的區域」跟「探索未知區域」之間做取捨，每跑完一輪就讓代理模型的預測更準。實務上的效率差距很具體：常見的報告是 Bayesian Optimization 比 Grid Search 少用大約 7 倍的迭代次數、快 5 倍收斂，面試時能講出「代理模型 + acquisition function」這個機制，比只背三個名字更能顯示理解深度。

### Huber Loss——用一個轉折點把 MSE 的平滑跟 MAE 的穩健縫在一起

MSE（均方誤差）對誤差取平方，離群值的誤差被放大，梯度對大誤差非常敏感，訓練容易被少數離群值拉歪；MAE（平均絕對誤差）對所有誤差一視同仁，對離群值穩健，但在誤差接近零時梯度不連續、不利於梯度下降收斂到精確解。Huber Loss 設一個轉折閾值 delta：誤差小於 delta 時用平方項（保留 MSE 在小誤差區域平滑收斂的優點），誤差大於 delta 時切換成線性項（保留 MAE 對離群值不過度放大的優點）。面試官常見的追問是「delta 怎麼選」：delta 越小，模型越接近 MAE、對離群值越穩健但收斂變慢；delta 越大，越接近 MSE、收斂快但離群值的影響力變大，實務上常用殘差分布的某個分位數（如中位數附近的尺度）去設定起點，再用驗證集調整。

### 維度詛咒——高維空間不是「更多資訊」，是距離度量先失效

隨著特徵維度增加，資料點在特徵空間裡變得越來越稀疏——要維持同樣的資料密度，需要的樣本量隨維度指數成長，這代表任何依賴「夠近的鄰居」才有意義的方法（KNN、以密度為基礎的分群）在高維空間會先失效：高維空間裡任意兩點的距離差距會被壓縮，最近的鄰居跟最遠的鄰居在相對意義上變得差不多遠，距離這個概念本身失去鑑別力。這也是為什麼維度詛咒不只是「特徵太多跑比較慢」的效能問題，而是模型假設本身的失效。PCA 常被當成降維工具來緩解這個問題，但面試時更深一層的講法是：PCA 不是單純丟棄特徵，而是找出資料變異量最大的正交方向，用更少的維度保留最多的資訊量，同時順便讓距離度量在投影後的低維空間裡重新有鑑別力。

### 梯度消失——反向傳播的連鎖律乘積，在深層網路裡會指數級縮小

反向傳播計算每一層權重的梯度時，要把當前層的梯度乘上前面每一層激活函數的導數。Sigmoid、tanh 這類飽和型激活函數，在輸入值很大或很小時導數會趨近於 0，網路深度越深，這些小於 1 的導數連乘起來，淺層的梯度就會指數級縮小到幾乎等於零——這代表淺層的權重幾乎學不到東西，訓練停滯。這正是今天練習題要深入拆解的核心機制，激活函數的選擇會直接決定這個連鎖乘積會不會塌陷。

## 今日練習題

### 題目

Vanishing Gradient Problem：What causes gradients to vanish in deep neural networks? Discuss how different activation functions (such as ReLU, Leaky ReLU, and ELU) mitigate this issue, and explain their mathematical trade-offs.

**來源**：Pinterest Machine Learning Engineer 面試題庫（PracHub 2026）　**難度**：中等　**環節**：Technical Phone Screen / Virtual Onsite ML theory round

### 拆解思路

1. **先釐清問題**：跟面試官確認要討論的網路深度跟原本用的激活函數（通常預設是 sigmoid/tanh 深層網路出問題），這決定你要不要主動延伸到「換激活函數之後還留下什麼問題」。
2. **建立框架**：先講成因（連鎖律乘積 + 飽和型激活函數導數趨近於零），再講不同激活函數怎麼緩解，最後講激活函數之外還有哪些輔助手段。
3. **深入核心**：Sigmoid、tanh 的導數在飽和區趨近 0，深層網路裡這些小於 1 的導數連乘，梯度指數級縮小。ReLU 在正值區間導數恆為 1，解決了飽和問題，但換來新的風險——Dying ReLU：一旦某個神經元的加權輸入恆為負，它的輸出跟梯度就永遠是 0，這個神經元等於死掉、再也不會被更新。Leaky ReLU 在負值區間給一個很小的固定斜率（如 0.01），讓梯度不會完全歸零，用極小的計算成本換掉 dying neuron 的風險。ELU 在負值區間用指數函數讓輸出平滑漸近到 -α，除了避免梯度歸零，還讓輸出的均值更接近 0（有助於加速收斂），但指數運算的計算成本比 Leaky ReLU 高。
4. **收尾**：總結成一句話——「ReLU 解決飽和但引入 dying neuron，Leaky ReLU 跟 ELU 都是用負值區間的設計去換不同的 trade-off：Leaky ReLU 換的是最低成本的梯度保底，ELU 換的是更平滑的輸出分布跟更高的計算成本」，並補一句現代深層網路通常不會只靠換激活函數，還會搭配殘差連接（讓梯度有捷徑可以跳過飽和層）跟 He initialization 這類配合 ReLU 系激活函數設計的權重初始化方法一起處理。

### 範例回答（面試時可以這樣講）

> **先講成因**：梯度消失的根源在反向傳播的連鎖律——計算淺層權重的梯度時，要把當前層的梯度一路乘上後面每一層激活函數的導數。Sigmoid 跟 tanh 在輸入值偏大或偏小時會進入飽和區，導數趨近於 0，網路越深，這些小於 1 的數字連乘起來，淺層的梯度會指數級縮小到幾乎學不到東西，這也是為什麼早期深層網路很難訓練超過幾層。
>
> **換激活函數換到的是什麼**：ReLU 在正值區間導數恆為 1，直接解決了飽和造成的梯度塌陷，是後來深層網路能疊到幾十層的關鍵原因之一。但 ReLU 不是沒有代價——如果某個神經元的加權輸入持續是負值，它的輸出跟梯度都會卡在 0，這個神經元就永久死掉，稱為 Dying ReLU。Leaky ReLU 的解法是在負值區間保留一個很小的固定斜率，用幾乎為零的額外計算成本，確保梯度不會完全歸零。ELU 則在負值區間用指數函數做平滑過渡，優點是輸出的均值會更接近 0、有助於加速收斂，但指數運算的計算成本比 Leaky ReLU 高，是用計算量換平滑性跟收斂速度。
>
> **比激活函數更完整的答案**：我會補一句，現代深層網路處理梯度消失不會只靠換激活函數，還會搭配殘差連接，讓梯度可以透過跳接直接傳回淺層，不用完全依賴連乘路徑；權重初始化也要配合激活函數選擇，例如 He initialization 是專門為 ReLU 系列設計的，跟 Xavier initialization 假設的激活函數特性不同。單獨換激活函數是治標，三者搭配才是現在深層網路訓練穩定的完整做法。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有講清楚連鎖律乘積 + 飽和型激活函數導數趨近於零的成因 | |
| 有指出 ReLU 解決飽和但引入 Dying ReLU 的新問題 | |
| 有講出 Leaky ReLU 跟 ELU 各自的負值區間設計跟對應的數學代價 | |
| 有提到計算成本（Leaky ReLU 低、ELU 高）這個 trade-off 維度 | |
| 有延伸到激活函數之外的輔助手段（殘差連接、對應的權重初始化） | |
| 加分項:能講出 He initialization 跟 Xavier initialization 假設的激活函數特性不同 | |

## 延伸閱讀

- [Pinterest Machine Learning Engineer Interview Questions & Guide 2026 | PracHub](https://prachub.com/interview-guide/pinterest-machine-learning-engineer-interview-questions-guide-2026) — 今日練習題的原始出處，收錄多道 Pinterest ML Engineer 面試的真實題目與追問。
- [AutoML Explained: What It Is and Why It Matters | Fritz AI](https://fritz.ai/automl-explained) — Grid Search／Random Search／Bayesian Optimization 效率比較表的來源，含具體的迭代次數與速度數字。
- [Data Science Interview Questions and Answers | GeeksforGeeks](https://www.geeksforgeeks.org/data-science/data-science-interview-questions-and-answers) — Huber Loss 與維度詛咒段落的延伸,涵蓋更多 2026 年版資料科學面試常見問法。

## 參考資料

- [Pinterest Machine Learning Engineer Interview Questions & Guide 2026 | PracHub](https://prachub.com/interview-guide/pinterest-machine-learning-engineer-interview-questions-guide-2026) — 練習題「Vanishing Gradient Problem」的原文題目與面試環節標注來源。
- [AutoML Explained: What It Is and Why It Matters | Fritz AI](https://fritz.ai/automl-explained) — 核心概念「Grid Search、Random Search、Bayesian Optimization」段落的來源。
- [Data Science Interview Questions and Answers | GeeksforGeeks](https://www.geeksforgeeks.org/data-science/data-science-interview-questions-and-answers) — 核心概念「Huber Loss」段落的來源。
- [Dimensionality Reduction Explained – PCA, t-SNE, UMAP and Autoencoders | DataExpertise](https://www.dataexpertise.in/dimensionality-reduction-pca-tsne-umap-autoencoders-explained/) — 核心概念「維度詛咒」與 PCA 段落的來源。
