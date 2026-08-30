---
title: "Likelihood ratio test 怎麼比較兩個巢狀模型？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 27
tldr: "LRT 比較受限模型和完整模型的 log likelihood 差；只有在 nested model 與近似條件成立時，常見卡方參考分布才有意義。"
description: "Likelihood ratio test 入門：full model、restricted model、nested condition、卡方近似與 ML model comparison。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-likelihood-ratio-test-en)

MLE 幫你在一個模型裡找到最合理的參數。Likelihood Ratio Test，簡稱 LRT，往前問一步：如果有一個比較簡單的受限模型，和一個比較自由的完整模型，多出來的彈性有沒有真的讓資料合理很多？

這個問題很常見。你可能想知道多加一個 predictor 是否有用，logistic regression 裡某個係數是否需要留下，或一個限制條件是否太強。LRT 用 likelihood 來比較兩個模型，而不是只看其中一個係數的 t 值。

## full model 和 restricted model

LRT 的兩個模型通常要是 nested。意思是 restricted model 可以看成 full model 加上限制後得到的版本。

例子：

```text
Full model:       logit(p) = beta0 + beta1 x1 + beta2 x2
Restricted model: logit(p) = beta0 + beta1 x1, with beta2 = 0
```

restricted model 是 full model 的特例，因為只要把 `beta2` 設成 0，就回到較簡單的模型。

LRT 的直覺是：full model 比較自由，likelihood 通常不會比 restricted model 差。多參數本來就更容易貼資料，因此真正要問的是改善幅度有多大。

## 統計量怎麼算

常見 LRT statistic 是：

```text
2(log L_full - log L_restricted)
```

因為 full model 通常 log likelihood 較大，所以這個值通常是非負。若兩個模型差很多，統計量會大。

在常見規則條件下，且兩模型 nested，這個統計量近似服從卡方分布：

```text
2(log L_full - log L_restricted) ~ chi-square(df)
```

自由度通常是兩模型的參數數量差。

## 手算例題：兩個 log likelihood

假設完整模型的 log likelihood 是：

```text
log L_full = -120
```

受限模型的 log likelihood 是：

```text
log L_restricted = -126
```

LRT statistic：

```text
2(log L_full - log L_restricted)
= 2(-120 - (-126))
= 2(6)
= 12
```

如果 full model 比 restricted model 多 2 個參數，自由度是：

```text
df = 2
```

接著把 12 和 `chi-square(df = 2)` 比較。5% 顯著水準下，自由度 2 的臨界值約 5.991；12 更大，所以拒絕 restricted model。語境結論可以寫：「資料提供統計證據顯示受限模型限制太強，完整模型帶來的 likelihood 提升超過多加參數可合理解釋的程度。」

## nested 條件為什麼重要

LRT 的常見卡方近似仰賴 nested model 和一些規則條件。若兩個模型不是巢狀，例如一個用 `x1`、另一個用完全不同的 `x2`，不能直接拿這個卡方近似當標準答案。

非 nested 模型比較通常會改看 AIC、BIC、cross-validation、held-out log loss，或其他模型選擇方法。這些方法問題意識相近：比較模型表現時，要把複雜度和泛化風險放進來。

考試看到 LRT，第一句最好先確認：

```text
Are the models nested?
What is the parameter difference?
Which model is restricted?
```

這三件事比急著代公式更重要。

## 這在 ML / AI 哪裡會用到

ML 裡未必直接使用傳統 LRT，但模型比較一直存在。你比較的是不同 feature set、不同 prompt template、不同 reranker、不同 classifier。更自由的模型常常在訓練資料上比較好，問題是它有沒有真的帶來可泛化的改善。

LRT 提醒你一件事：多參數或多自由度帶來的表現提升，要扣回複雜度與不確定性。這和 validation loss、AIC/BIC、cross-validation 的精神相通。

在 logistic regression 或 GLM 這類較統計的模型裡，LRT 也常用來比較完整模型和刪掉某些變數的受限模型。若 LRT 顯著，代表那些被限制掉的參數整體上提供了資料支持。

## 常見錯誤

- 沒確認 nested model，就直接套卡方近似。
- full 和 restricted 的 log likelihood 放反，算出負的統計量。
- 自由度沒有用參數數量差。
- LRT 顯著後，直接宣稱每個新增參數都單獨顯著。
- 在 ML 模型比較裡只看 training loss，沒有處理複雜度和泛化。

## 練習題

1. 給定 `log L_full = -80`、`log L_restricted = -85`，計算 LRT statistic。
2. 若 full model 多 2 個參數，寫出近似參考分布與自由度。
3. 說明 nested model 是什麼，並寫一個非 nested 反例。
4. 用 validation loss 比較模型時，說明它和 LRT 的問題意識有什麼相似。

## 下一篇怎麼接

LRT 把 likelihood 用在模型比較。下一篇會看 Neyman-Pearson：在控制第一型錯誤的前提下，怎麼設計最有檢定力的拒絕規則。

## 章節級參考對照

- OpenIntro / OpenStax：likelihood ratio、hypothesis testing、卡方近似與模型比較基礎。
- Stanford CS109：likelihood 觀點與 nested model 比較直覺。
- scikit-learn：validation loss、cross-validation 與 model selection 語境。

## 參考資料

- [Likelihood Ratio Test, Nested Models, and Chi-Square Approximation in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Hypothesis Testing and Chi-Square Tests](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Log Loss and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Cross-Validation and Model Selection](https://scikit-learn.org/stable/modules/cross_validation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
