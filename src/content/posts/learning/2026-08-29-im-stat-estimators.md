---
title: "好估計量怎麼判斷：不偏、變異、MSE 要看哪個？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 14
tldr: "估計量是用樣本推母體的計算規則；判斷它好不好，要一起看 bias、variance 與 MSE。"
description: "估計量入門：分清估計量與估計值，手算 bias、variance、MSE，並連到 validation score 與模型泛化判斷。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-estimators-en)

估計量這個詞很容易讓初學者覺得抽象。其實你每天都在用估計量：用樣本平均估母體平均、用樣本比例估真正轉換率、用 validation accuracy 估模型未來表現。估計量是一個規則；估計值是這個規則套到某一批資料後得到的數字。

例如「把所有樣本加總後除以 n」是估計量。你這次抽到 25 筆，算出平均 82，82 是估計值。考試問估計量時，重點會放在這個規則長期來看有什麼性質，而不是評論 82 這個數字看起來漂不漂亮。

## 三個判斷：bias、variance、MSE

第一個判斷是 bias。若估計量記為 `T`，目標參數是 `theta`：

```text
Bias(T) = E[T] - theta
```

如果 `E[T] = theta`，這個估計量是不偏的。意思是在相同抽樣方式下重複很多次，估計值的長期平均會對準目標參數。

第二個判斷是 variance。估計量不偏，仍然可能很不穩。每次抽樣都會得到差很多的估計值，考試會說它變異數大；實務上會說這個估計很抖。

第三個判斷是 MSE：

```text
MSE(T) = E[(T - theta)^2] = Var(T) + Bias(T)^2
```

MSE 把偏誤和波動放在同一個尺度。這也是為什麼有時候一個帶一點 bias 的估計量，反而可能比完全不偏但波動很大的估計量更好。

## 手算例題：兩個估計量誰比較好

假設 `X1` 和 `X2` 是獨立樣本，兩者期望值都是 `mu`，變異數都是 `sigma^2`。現在有兩個估計 `mu` 的規則：

```text
T1 = (X1 + X2) / 2
T2 = (3X1 + X2) / 4
```

先看 `T1` 的期望值：

```text
E[T1] = E[(X1 + X2) / 2]
      = (E[X1] + E[X2]) / 2
      = (mu + mu) / 2
      = mu
```

所以 `T1` 不偏。

再看 `T2`：

```text
E[T2] = E[(3X1 + X2) / 4]
      = (3E[X1] + E[X2]) / 4
      = (3mu + mu) / 4
      = mu
```

`T2` 也不偏。bias 判斷到這裡已經不夠，下一步要比較 variance。

因為 `X1`、`X2` 獨立：

```text
Var(T1) = Var((X1 + X2) / 2)
        = (1/4)Var(X1) + (1/4)Var(X2)
        = sigma^2 / 2
```

`T2` 的權重是 `3/4` 和 `1/4`：

```text
Var(T2) = (9/16)Var(X1) + (1/16)Var(X2)
        = 10sigma^2 / 16
        = 0.625sigma^2
```

`T1` 的變異數是 `0.5sigma^2`，比 `T2` 小。兩者都不偏時，`T1` 更有效率。

這題的關鍵在順序：先問期望值有沒有對準，再問波動多大。很多人看到兩個估計量就憑直覺選「比較平均」的那個；考試要的是用 expectation 和 variance 證明。

## MSE 何時會翻盤

再看一個短例子。估計量 A 不偏，`Var(A) = 9`。估計量 B 的 bias 是 1，`Var(B) = 2`。

```text
MSE(A) = 9 + 0^2 = 9
MSE(B) = 2 + 1^2 = 3
```

B 有偏，但 MSE 比 A 小。這種 tradeoff 在機器學習很常見：你願意引入一點偏誤，換取大幅降低波動，最後泛化表現可能更穩。

## 這在 ML / AI 哪裡會用到

validation accuracy 是估計量。你用一批驗證資料估模型在未來資料上的表現。如果驗證集很小，這個估計量變異就大；今天看起來模型 A 贏，換一批資料可能模型 B 贏。

average loss 也是估計量。訓練時你看到的 mini-batch loss，是用一小批資料估整體 objective。mini-batch 太小，loss 會抖；batch 變大，估計比較穩，但計算成本也上升。

regularization 也能用估計量的語言理解。某些限制會讓模型有一點 bias，卻降低 variance。MSE 拆解把這件事說得很直接：總錯誤同時看偏誤和波動。

## 常見錯誤

- 把估計量和估計值混在一起。
- 只檢查不偏性，沒有比較 variance 或 MSE。
- 看到 bias 就認定估計量一定比較差。
- 權重估計量算 variance 時忘記權重要平方。
- 用一次 validation score 的高低判斷模型穩定勝出。

## 練習題

1. 給定 `E[T] = theta + 2`，寫出 bias，並判斷是否不偏。
2. 比較兩個估計量：A 不偏但 `Var = 9`；B 的 `bias = 1` 且 `Var = 2`，請計算 MSE。
3. 若 `T = 0.8X1 + 0.2X2`，且 `X1`、`X2` 獨立同分布，請寫出 `E[T]` 與 `Var(T)`。
4. 用 validation accuracy 說明：為什麼小測試集會讓模型選擇不穩？

## 下一篇怎麼接

估計量回答「用什麼規則推參數」。下一篇會把這個規則放進最熟悉的模型：簡單線性迴歸。它用一條線估 `X` 和 `Y` 的平均關係，也是統計和 supervised learning 的共同入口。

## 章節級參考對照

- OpenIntro / OpenStax：估計量、不偏性、variance 與 MSE。
- Stanford CS109：估計、抽樣波動與期望值計算。
- scikit-learn：validation score、bias-variance 與泛化判斷。

## 參考資料

- [Estimator Bias, Variance, and MSE in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Point Estimation, Bias, Variance, and MSE](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn User Guide: Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn User Guide: Underfitting and Overfitting](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
