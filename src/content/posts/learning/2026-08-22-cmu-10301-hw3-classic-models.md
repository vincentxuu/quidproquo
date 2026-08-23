---
title: "CMU 10-301 HW3：比較 K-NN、Perceptron 與 Linear Regression"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, knn, perceptron, linear-regression]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "HW3 是純 written 作業，以 decision tree 回顧，再比較 K-NN、Perceptron 與 Linear Regression 的 inductive bias、誤差與 model selection。"
description: "導讀 CMU 10-301/601 Spring 2026 HW3 的四類模型比較與自學驗收。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 3 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw3-classic-models-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip) 完整題名是 **Homework 3: Decision Trees, K-NN, Perceptron, Regression**，是純 written 作業。主要題組是 decision tree revisited、regression tree、k-nearest neighbors、perceptron 與 linear regression；題內再處理 overfitting、error rates 與 model selection。ZIP 只有 PDF、LaTeX template 與題目圖檔，沒有 starter code、dataset 或 reference output。

## 不要把它讀成四份公式表

這份作業的主線是：同一批資料換一種 representation 或 decision boundary，哪個模型會先失敗？K-NN 的距離、perceptron 的線性可分性、regression 的 loss，以及 tree 的切分偏好，都在回答不同問題。

## 第一個檢查動作與完成判準

這份作業沒有安全且必要的第一個程式命令。第一個動作是打開 [PDF／LaTeX bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip)，先列出五個題組各自依賴的假設，再開始計算。完成判準是每題同時有結果與假設說明，並能對 XOR、含離群值直線、高維稀疏點預測各模型行為；因官方未提供答案，不能把自行推導稱為官方驗證。

## 參考資料
- [HW3 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip)
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
