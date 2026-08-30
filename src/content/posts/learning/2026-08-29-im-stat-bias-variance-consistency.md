---
title: "點估計的 bias、variance、consistency 各在檢查什麼？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 23
tldr: "bias 看估計中心有沒有歪，variance 看抽樣波動，MSE 合併兩者，consistency 則問樣本變大時估計量會不會靠近真值。"
description: "點估計品質導讀：bias、variance、MSE、consistency 的定義、手算例題，以及 ML bias-variance tradeoff。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-bias-variance-consistency-en)

第 14 篇已經用入門方式看過估計量。這篇往前推一層：如果你有好幾個估計方法，該怎麼判斷哪個比較好？考試常見的判斷標準是 bias、variance、MSE 和 consistency，而不是「這個公式比較熟」。

這四個詞都在看估計量的長期表現。你手上只會有一批資料、一個估計值；但統計推論關心的是：如果同樣方法重複用很多次，它平均會不會歪？每次會不會抖很大？樣本數增加時會不會靠近真值？

## bias：中心有沒有歪

估計量 `T` 用來估參數 `theta`。bias 定義為：

```text
Bias(T) = E[T] - theta
```

如果 `E[T] = theta`，就說 `T` 是 unbiased estimator。這表示在相同抽樣設計下重複很多次，估計值的平均會對準 `theta`。

不偏不代表每一次都準。它只描述長期中心位置。有些不偏估計量波動很大，一次抽樣拿到的估計值可能離真值很遠。

## variance：每次抽樣會抖多大

variance 看估計量在重複抽樣下的波動。兩個估計量都不偏時，variance 小的通常比較有效率。因為它不只長期對準，也比較不容易因某一批樣本而偏離太遠。

考試常用線性組合練這件事。若：

```text
T = aX1 + bX2
```

且 `X1`、`X2` 獨立、變異數都是 `sigma^2`，那：

```text
Var(T) = a^2 sigma^2 + b^2 sigma^2
```

權重要平方，這是常見計算錯誤。

## MSE：把偏誤和波動放在一起

MSE 定義為：

```text
MSE(T) = E[(T - theta)^2]
       = Var(T) + Bias(T)^2
```

它把兩種錯誤放在一起：估計中心偏離真值，以及估計值本身波動。這讓你能比較「不偏但很抖」和「有一點偏但穩很多」的估計量。

## 手算例題：bias 和 MSE 可能給不同答案

估計量 A 不偏，變異數是 4。估計量 B 的 bias 是 1，變異數是 1。

先算 A：

```text
Bias(A) = 0
MSE(A) = Var(A) + Bias(A)^2 = 4 + 0 = 4
```

再算 B：

```text
Bias(B) = 1
MSE(B) = Var(B) + Bias(B)^2 = 1 + 1^2 = 2
```

若只看 bias，A 比較好，因為 A 不偏。若看 MSE，B 比較好，因為它雖然有一點偏，但波動小很多。這題的重點是：估計量品質要看你採用哪個準則，看到「unbiased」還要繼續檢查 variance 和 MSE。

## consistency：樣本變大會不會靠近真值

consistency 問的是樣本數增加時，估計量是否會收斂到目標參數。直覺寫法是：

```text
Tn -> theta as n -> infinity
```

更正式一點會說機率收斂。入門階段先掌握意思：資料越多，估計量應該越靠近真值。

consistency 和 finite-sample unbiasedness 不同。不偏是在每個固定樣本數下看期望值是否對準。consistent 是看樣本數變大後是否靠近真值。一個估計量可能小樣本有偏，但隨著樣本數增加，偏誤消失並收斂到真值。

## 這在 ML / AI 哪裡會用到

ML 裡常講 bias-variance tradeoff，其實就是這套語言的延伸。太簡單的模型可能 high bias，因為它連主要關係都抓不到，表現成 underfitting。太複雜的模型可能 high variance，因為它對訓練資料細節太敏感，表現成 overfitting。

regularization 常用一點 bias 換較低 variance。限制模型不要太自由，可能讓訓練分數變差一點，但 test set 表現更穩。這和 MSE 裡 `Var + Bias^2` 的拆解一致。

模型評估也有 consistency 的問題。隨著測試資料增加，accuracy 或 average loss 應該更穩定地靠近未來資料上的真實表現。如果測試資料來源一直改變，樣本數再大也不一定代表估計可靠，因為 identical distribution 的條件可能已經壞掉。

## 常見錯誤

- 看到 unbiased 就直接判斷最好，沒有看 variance 或 MSE。
- 把 bias 當成某一次估計值的誤差，而不是長期期望的偏差。
- 算線性組合 variance 時忘記權重要平方。
- 把 consistency 當成小樣本一定準。
- 把 ML 裡的 high bias / high variance 當成口號，沒有接回 underfitting、overfitting 和泛化誤差。

## 練習題

1. 給定 `E[T] = theta - 1`，計算 bias，並判斷是否不偏。
2. 若 `Var(A) = 4`、`Bias(A) = 0`，`Var(B) = 1`、`Bias(B) = 1.5`，計算兩者 MSE。
3. 寫一句話分辨 finite-sample unbiasedness 與 consistency。
4. 用 underfitting / overfitting 說明 bias-variance tradeoff，並各舉一個模型選擇例子。

## 下一篇怎麼接

這篇比較估計量品質。下一篇會進到一種具體估參數的方法：Method of Moments。它用樣本矩去對母體矩，讓你從資料的 summary statistic 解回分布參數。

## 章節級參考對照

- OpenIntro / OpenStax：估計量品質、bias、variance 與 MSE。
- Stanford CS109：抽樣波動、估計量長期行為與收斂直覺。
- scikit-learn：bias-variance tradeoff、underfitting、overfitting 與泛化評估。

## 參考資料

- [Point Estimation, Bias, Variance, and MSE in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Estimation and Sampling Variability](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Example: Underfitting vs Overfitting](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
