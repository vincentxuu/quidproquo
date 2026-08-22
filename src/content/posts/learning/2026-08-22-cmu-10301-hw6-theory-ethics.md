---
title: "CMU 10-301 HW6：Learning Theory、MLE／MAP 與公平指標"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, learning-theory, ai-ethics]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "HW6 把 generalization、MLE/MAP、probabilistic learning、公平指標與社會影響放在同一份 written 作業，逼你說清楚假設與取捨。"
description: "導讀 CMU 10-301/601 Spring 2026 HW6 的理論、估計與公平性分析。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 6 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw6-theory-ethics-en)

[官方 HW6 ZIP](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw6.zip) 內 PDF 的完整題名是 **Homework 6: Learning Theory, MLE/MAP, Fairness Metrics, and Societal Impact**；[coursework 索引](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html) 使用較短名稱 Learning Theory and Ethics。它是純 written 作業，題組包括 learning theory、MLE/MAP、probabilistic learning、fairness metrics、societal impacts/unintended consequences 與 society, ethics, and ML。ZIP 提供 PDF、LaTeX template、fairness CSV 與題目圖檔，沒有 starter code 或 reference answers。

## 同一條主線：模型為何值得相信

Learning theory 問從 sample 推到 population 的條件；MLE/MAP 問估計使用什麼資料與 prior；公平指標問不同錯誤如何分配。三者都不是單一數字裁決，而是先把假設、目標與受影響群體寫清楚。

## 第一個檢查動作與完成判準

第一個動作是打開 [ZIP 裡的 `fairness_dataset.csv`](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw6.zip)，先確認欄位、群體與 label/prediction 定義，再計算任何 metric。完成判準是：每個 bound／estimator 都列出假設；fairness 題能由 CSV 重算；社會影響題明確分開資料可支持的數學結果與價值判斷。官方沒有答案，不能把自算結果標為官方驗證。

## 參考資料
- [HW6 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw6.zip)
- [Spring 2026 course home and policies](https://www.cs.cmu.edu/~mgormley/courses/10601/)
