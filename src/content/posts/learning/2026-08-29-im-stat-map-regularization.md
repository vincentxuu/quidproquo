---
title: "MAP 為什麼會把先驗變成 regularization？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 34
tldr: "MAP 為什麼會把先驗變成 regularization？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 34 篇：MAP 為什麼會把先驗變成 regularization？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-map-regularization-en)

Bayesian inference 給你整個 posterior，但實務上有時只需要一個代表性答案。MAP，maximum a posteriori estimate，就是 posterior 最大的參數值。

這聽起來像是貝氏統計裡的一個估計量，和 ML 裡的 regularization 好像很遠。其實兩者非常接近：當你最大化 posterior，等同於同時看 likelihood 和 prior；把它取 log 後，prior 會變成 objective function 裡的懲罰項。

這篇要把這座橋拆開。看懂之後，你會知道 ridge、lasso、weight decay 不只是「避免 overfitting 的技巧」，也可以讀成「模型偏好哪一種參數形狀」。

## 從 posterior 最大化開始

MLE 找的是讓資料最合理的參數：

```text
theta_MLE = argmax_theta p(data | theta)
```

MAP 找的是 posterior 最大的參數：

```text
theta_MAP = argmax_theta p(theta | data)
```

根據 Bayes rule：

```text
p(theta | data) proportional to p(data | theta) p(theta)
```

所以：

```text
theta_MAP = argmax_theta p(data | theta) p(theta)
```

取 log 後，乘法變加法：

```text
theta_MAP = argmax_theta [log p(data | theta) + log p(theta)]
```

這就是 regularization 的入口。`log p(data | theta)` 對應資料擬合；`log p(theta)` 對應參數偏好。

如果改成最小化 loss，通常會寫成：

```text
minimize negative log likelihood + penalty
```

## Gaussian prior 怎麼變成 L2 penalty

假設參數 `w` 的 prior 是以 0 為中心的 Gaussian：

```text
w ~ N(0, sigma^2)
```

它的 log prior 會包含：

```text
log p(w) = constant - w^2 / (2 sigma^2)
```

MAP 要最大化：

```text
log likelihood + log prior
```

等價地，也可以最小化：

```text
negative log likelihood + w^2 / (2 sigma^2)
```

`w^2` 就是 L2 penalty 的形狀。若參數是向量，會變成所有權重平方和：

```text
||w||_2^2
```

這表示 Gaussian prior 偏好權重靠近 0，但通常不會把權重直接壓成剛好 0。它比較像把每個權重往小的方向拉。

## Laplace prior 怎麼變成 L1 penalty

如果 prior 改成 Laplace distribution，它的 log prior 會含有絕對值：

```text
log p(w) = constant - lambda |w|
```

取負號後，objective 裡出現：

```text
lambda |w|
```

這就是 L1 penalty 的形狀。L1 常和 sparsity 連在一起，因為它比較容易讓某些權重變成 0。從統計角度看，Laplace prior 表示你相信很多參數應該接近 0，少數參數可以留下明顯效果。

所以考試遇到 MAP 和 regularization，不要只背「Gaussian 對 L2、Laplace 對 L1」。要能從 `log prior` 的形狀推出 penalty。

## 手算例題：比較兩個參數解

假設有兩個候選參數解 A 和 B。它們在資料上的 negative log likelihood 分別是：

```text
NLL(A) = 100
NLL(B) = 96
```

只看資料，B 比 A 好，因為 NLL 比較低。

現在加入 L2 penalty，令 `lambda = 0.5`，兩個解的平方和是：

```text
||w_A||^2 = 4
||w_B||^2 = 16
```

regularized objective 是：

```text
objective = NLL + lambda ||w||^2
```

所以：

```text
objective(A) = 100 + 0.5 × 4 = 102
objective(B) = 96 + 0.5 × 16 = 104
```

加入 prior / penalty 後，A 反而比較好。這不表示 A 對訓練資料擬合更好，而是 A 在「資料擬合」和「參數不要太極端」的折衷下比較好。

## regularization 強度怎麼理解

`lambda` 越大，模型越重視 penalty。參數會被拉得更小，variance 通常下降，bias 可能上升。

`lambda` 越小，模型越接近 MLE。它能更自由地貼資料，bias 可能較低，但 variance 和 overfitting 風險會上升。

在 ML 實務裡，`lambda` 通常靠 validation performance 或 cross-validation 選。Regularization 追求的是沒看過資料上的穩定表現；只用 training loss 會偏向選出 penalty 太弱、太貼訓練資料的模型。

## 題型怎麼辨識

看到 MAP，先寫：

```text
log posterior = log likelihood + log prior + constant
```

看到 Gaussian prior，檢查 `log prior` 是否會產生平方懲罰。

看到 Laplace prior，檢查 `log prior` 是否會產生絕對值懲罰。

看到題目問 bias-variance tradeoff，就從 regularization 強度說起：強 penalty 讓模型更保守，弱 penalty 讓模型更貼資料。

## 這在 ML / AI 哪裡會用到

Ridge regression、lasso、logistic regression 的 penalty、神經網路裡的 weight decay，都可以用 MAP 的角度理解。它們的共同點是限制模型不要用太大的參數去解釋訓練資料。

這在 AI 系統裡很實際。資料量小、feature 多、模型自由度高時，沒有 regularization 的模型很容易把訓練資料的噪音也學進去。加上 penalty 等於告訴模型：除非資料真的有強烈證據，否則不要把權重推太大。

但 regularization 不是越強越好。太強會讓模型學不到真訊號，像把所有 feature 都壓到沒用。正確做法是把 regularization strength 當成 hyperparameter，用 validation set 或 cross-validation 選。

## 常見錯誤

- 把 MAP 說成 MLE 的別名，漏掉 prior。
- 忘記取 log 後，posterior 會變成 log likelihood 加 log prior。
- 只背 Gaussian 對 L2，沒有從 log prior 推出平方項。
- 以為 L2 regularization 會讓很多權重剛好變成 0；這比較接近 L1 的效果。
- 用 training loss 選 regularization strength，反而選到最容易 overfit 的設定。

## 練習題

1. 寫出 `log posterior = log likelihood + log prior + constant`，並說明 MAP 在最大化哪一項。
2. 說明 Gaussian prior 為什麼會對應到 L2 regularization；Laplace prior 為什麼會對應到 L1 regularization。
3. 若 `NLL(A)=50`、`||w_A||^2=2`，`NLL(B)=48`、`||w_B||^2=10`，`lambda=0.5`，哪個解的 regularized objective 較小？
4. 若 regularization strength 變大，參數通常會往哪裡移動？這對 bias 與 variance 有什麼影響？
5. 在 ML 訓練中，你會用 training loss 還是 validation performance 選 regularization strength？為什麼？

## 下一篇怎麼接

MAP 把 Bayes、likelihood 和 regularization 接起來。下一篇會收束第二層：把估計、檢定、信賴區間、likelihood、Bayes、bootstrap 放回同一張推論地圖，讓你知道看到題目時該先選哪種問題語言。

## 章節級參考對照

- OpenIntro、OpenStax 與 Stanford CS109 支撐 Bayes rule、likelihood 與 posterior 的基本關係。
- 本文把 MAP 轉成 log posterior 後對照 ML 裡的 objective function，說明 prior 如何變成 penalty。
- scikit-learn Model Evaluation 支撐用 validation / evaluation performance 選擇模型與超參數的情境。

## 參考資料

- [本篇主題 MAP and Regularization：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
