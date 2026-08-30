---
title: "迴歸表的 coef、SE、t、F、R2 要怎麼一起讀？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 16
tldr: "迴歸表不是 p 值清單；coef、SE、t、F、R2 分別回答效果大小、不確定性、單一係數、整體模型與樣本內解釋力。"
description: "迴歸輸出表入門：讀 coef、standard error、t、p-value、F test、R2 與 adjusted R2，並連到 ML baseline 和 feature effect 報告。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-regression-dashboard-en)

第一次看到迴歸輸出表，最容易做的事是掃 p-value：小於 0.05 就圈起來，大於 0.05 就跳過。這樣寫考卷很危險，因為迴歸表的每一欄回答的問題不同。`coef` 在講估計效果，`SE` 在講不確定性，`t` 和 p-value 在講單一係數是否明顯偏離 0，`F` 在看整體模型，`R2` 在描述樣本內解釋力。

你可以把迴歸表當成儀表板，而不是一排星號。讀的順序通常是：先看模型在解什麼題，再看係數方向和大小，接著看標準誤與檢定，最後看整體表現和診斷。

## coef 和 SE 要一起讀

迴歸係數 `coef` 的語境是：「控制其他變數後，這個 predictor 增加一單位，response 的平均值估計改變多少。」多元迴歸裡的「控制其他變數後」很關鍵，因為每個係數是在其他 predictors 留在模型中的條件下解釋。

標準誤 `SE` 則是在說這個係數估計有多不穩。係數大但 SE 也大，代表估計很晃；係數小但 SE 很小，可能表示一個穩定但效果不大的關係。

單一係數的 t 統計量通常是：

```text
t = coefficient / standard error
```

它衡量係數離 0 有幾個標準誤遠。

## 手算例題：讀一列係數

假設某迴歸表裡，`hours_studied` 這個變數的係數是 1.5，標準誤是 0.5。

先算 t：

```text
t = 1.5 / 0.5 = 3
```

若樣本數夠大或自由度下查表，`|t| = 3` 通常會對應到相當小的 p-value。考試答案要補上比「顯著」更完整的解釋：

```text
控制模型中的其他變數後，讀書時數每增加 1 小時，成績平均估計增加 1.5 分。
這個估計離 0 約 3 個標準誤，資料提供該係數不為 0 的統計證據。
```

這裡要分清楚兩件事。1.5 是效果大小的估計；t 和 p-value 是不確定性下的檢定。p-value 很小不代表效果一定大，係數很大也不代表估計一定穩。

## F test 和 R2 看的是不同層次

單一 t 檢定看某一個係數。整體 F test 常見的 H0 是：

```text
H0: beta1 = beta2 = ... = betap = 0
```

也就是所有斜率係數都沒有線性解釋力。F test 顯著，代表整體模型至少有一些 predictor 提供解釋力；它不告訴你每個 predictor 都有用。

`R2` 描述樣本中 response 變異有多少比例被模型解釋。`R2 = 0.60` 可以白話解釋成：在這批樣本裡，模型解釋了約 60% 的 `Y` 變異。

但 R2 有幾個限制。第一，它是樣本內指標，不保證 test set 表現。第二，加入更多變數通常不會讓 R2 下降，所以多元迴歸常看 adjusted R2。第三，R2 高不代表因果，只代表模型在樣本內和 outcome 有較強的線性關聯。

## 題型怎麼辨識

看到 regression output，先把題目拆成四種問法。

第一，問某個變數影響方向或大小：看 coefficient，並用語境解釋單位。第二，問是否顯著：看 `coef / SE`、t、p-value。第三，問模型整體是否有解釋力：看 F test。第四，問模型解釋程度：看 R2 或 adjusted R2。

如果題目問「控制其他變數後」，通常是在考多元迴歸係數解釋。如果題目問「模型是否整體顯著」，不要拿單一 p-value 作答。若題目問預測好不好，R2 只能提供部分線索，最好還要看 train/test 評估。

## 這在 ML / AI 哪裡會用到

多元迴歸常是 ML 專案的第一個可解釋 baseline。它未必打得贏 tree、boosting 或 neural network，但它可以快速回答：哪些 features 的方向合理？效果量大概在哪裡？資料是否有明顯不穩的變數？

在模型報告裡，迴歸表也能幫你避免只談 metric。假設你做一個 churn prediction 專案，複雜模型 accuracy 較高，但線性 baseline 顯示某些 feature 的係數方向和業務理解相反，這可能是資料洩漏、共線性或切分方式錯誤的警訊。

另外，feature effect 報告要小心語言。你可以寫「控制其他變數後，某 feature 與 outcome 的平均變化有關」。若沒有實驗設計或因果識別，不要直接寫「某 feature 造成 outcome 改變」。

## 常見錯誤

- 只看 p-value，不讀 coefficient 的方向和大小。
- 把 SE 當成變數本身的標準差。
- F test 顯著就宣稱每個 predictor 都有用。
- R2 高就宣稱模型泛化好或關係有因果。
- 解釋多元迴歸係數時漏掉「控制其他變數後」。

## 練習題

1. 一列迴歸輸出給 `coef = -0.8`、`SE = 0.2`，請算 t，並寫出係數語境解釋。
2. 說明單一 t 檢定和整體 F test 分別回答什麼問題。
3. 寫一句正確的 R2 解釋，再寫一句常見錯誤解釋。
4. 用 ML baseline 場景說明：為什麼一個可解釋的線性模型仍然值得先跑？

## 下一篇怎麼接

到這裡，線性模型處理的是數值 outcome。下一篇會進入分類問題：當 outcome 是 0/1 時，logistic regression 會把線性分數轉成機率，並把你帶到 classification、threshold 和 cross entropy。

## 章節級參考對照

- OpenIntro / OpenStax：regression output、係數、SE、t test、F test、R2。
- Stanford CS109：模型解釋、預測與 uncertainty 的差異。
- scikit-learn：linear baseline、feature inspection 與 model evaluation。

## 參考資料

- [Regression Output, Coef, SE, t, F, and R2 in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Multiple Regression Coefficients, F Test, and R2](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models](https://scikit-learn.org/stable/modules/linear_model.html)
- [scikit-learn Model Evaluation: Regression Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
