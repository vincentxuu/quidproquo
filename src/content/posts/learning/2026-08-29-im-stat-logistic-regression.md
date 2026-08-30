---
title: "分類模型為什麼要先學 log odds？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 17
tldr: "logistic regression 把線性分數接到 0 到 1 的機率；讀懂 odds、log odds、odds ratio，才不會把分類模型係數解釋錯。"
description: "Logistic regression 入門：從機率、odds、log odds、sigmoid、odds ratio 到分類 threshold 與 cross entropy。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-logistic-regression-en)

前面幾篇迴歸都在處理數值 outcome：成績、時間、銷售額、分數。可是考試和 ML 專案常遇到另一種問題：會不會流失、是否錄取、是否違約、模型答對或答錯。答案只有 0/1，直接拿線性迴歸預測會出問題，因為直線可能給出小於 0 或大於 1 的「機率」。

logistic regression 的做法，是先算一個線性分數，再把它轉成 0 到 1 之間的機率。它看起來像分類模型，底層仍然保留迴歸的語言：係數、解釋、標準誤、檢定和預測。

## 從 probability 到 log odds

不要一開始就背 sigmoid。先把三層關係排好。

第一層是機率 `p`，範圍在 0 到 1。假設某使用者流失機率是 0.8，代表同類條件下流失事件很可能發生。

第二層是 odds：

```text
odds = p / (1 - p)
```

如果 `p = 0.8`，odds 是：

```text
0.8 / 0.2 = 4
```

意思是流失和未流失的機會比是 4 比 1。

第三層是 log odds：

```text
log odds = log(p / (1 - p))
```

logistic regression 讓 log odds 等於一條線：

```text
log(p / (1 - p)) = b0 + b1 x
```

所以係數 `b1` 的直接解釋不是「機率增加 b1」。它表示 `x` 增加一單位時，log odds 增加 `b1`。如果要轉回 odds ratio，就看：

```text
odds ratio = exp(b1)
```

## 手算例題：從線性分數算機率

假設模型是：

```text
log(p / (1 - p)) = -2 + 0.8x
```

現在 `x = 3`。先算線性分數：

```text
z = -2 + 0.8 × 3 = 0.4
```

再用 sigmoid 把它轉成機率：

```text
p = 1 / (1 + exp(-z))
  = 1 / (1 + exp(-0.4))
  ≈ 0.599
```

答案要寫成語境句：「在這個模型下，`x = 3` 的個體屬於正類的估計機率約為 59.9%。」

再看係數。`b1 = 0.8`，odds ratio 是：

```text
exp(0.8) ≈ 2.23
```

語境解釋是：「`x` 增加一單位時，正類的 odds 估計乘上約 2.23。」這句話仍然是模型條件下的關聯解釋，不要直接寫成因果。

## 機率估計和分類決策要分開

logistic regression 先給機率。你要把它變成類別，還需要 threshold。常見門檻是 0.5，但 0.5 不是天經地義。

如果模型用來抓詐欺交易，你可能寧願門檻低一點，多抓一些可疑案件，再交給人工複核。如果模型用來自動拒絕貸款，錯誤成本很高，門檻和流程就要更保守。

因此分類模型要分成兩句話看：

```text
probability estimation: 這筆資料屬於正類的估計機率是多少？
classification decision: 在某個 threshold 與錯誤成本下，要把它判成哪一類？
```

考試若問 logistic regression 係數，先解釋 log odds 或 odds ratio。若問分類表現，再接 confusion matrix、precision、recall、threshold。

## 這在 ML / AI 哪裡會用到

logistic regression 是 binary classifier 的基本款。它能當 baseline，也能當可解釋模型。當複雜模型表現只贏一點點時，你至少要知道它比這個簡單模型多解決了什麼。

它也把統計推論接到 ML loss。當 `Y` 是 0/1 時，logistic regression 常用 Bernoulli likelihood；最大化這個 likelihood，會對應到機器學習常見的 binary cross entropy。這讓你看懂很多分類模型的訓練目標：模型其實在調整每筆資料的正類機率，再由 threshold 轉成決策。

大型語言模型評估也會用到同樣觀念。你可能要預測某回答是否會被使用者接受、某段輸出是否違規、某個 retrieval 結果是否相關。這些都是二元或近似二元 outcome；logistic regression 提供一個透明的起點。

## 常見錯誤

- 把 logistic regression 係數直接解釋成機率增加量。
- 忘記 odds、log odds、odds ratio 是三個不同尺度。
- 把 `p = 0.6` 直接當成一定分類為正類，沒有說明 threshold。
- 用 accuracy 評估所有分類問題，忽略 precision、recall 與錯誤成本。
- 看到係數為正就寫成因果效果。

## 練習題

1. 給定 `b0 = -1`、`b1 = 0.5`、`x = 4`，算出 `z` 與 `p = 1 / (1 + exp(-z))`。
2. 把 `b1 = 0.5` 轉成 odds ratio，並寫一句語境解釋。
3. 說明 threshold 從 0.5 改成 0.8 時，正類預測數量可能如何改變。
4. 設計一個 binary classifier 場景，分別寫出 probability estimation 和 classification decision。

## 下一篇怎麼接

logistic regression 需要你熟悉條件機率與二元 outcome。下一篇會回到更基礎的離散機率表：joint PMF、marginal、conditional 和變數轉換，都是後面 probabilistic model 的底層語言。

## 章節級參考對照

- OpenIntro / OpenStax：logistic regression、odds、log odds、odds ratio 與係數解釋。
- Stanford CS109：classification probability、likelihood 與 Bernoulli model。
- scikit-learn：classifier、threshold、classification metrics 與 linear model baseline。

## 參考資料

- [Logistic Regression, Log Odds, and Odds Ratio in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Logistic Regression](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [scikit-learn Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
