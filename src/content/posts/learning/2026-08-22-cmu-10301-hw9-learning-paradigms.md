---
title: "CMU 10-301 HW9：用 Ensembles、k-Means、PCA 與推薦系統收束全課"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, clustering, pca, recommender-systems]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "最後一份 written 作業把 ensemble、clustering、representation 與 recommendation 並列，驗收你能否按問題結構選學習典範。"
description: "CMU 10-301/601 Spring 2026 HW9 Learning Paradigms 的四主題整合與結業自評。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 9 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw9-learning-paradigms-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip) 完整題名是 **Homework 9: Learning Paradigms**，也是最後一份、純 written 作業。四個主要題組依序是 PCA、k-Means、Ensemble Methods 與 Recommender Systems。ZIP 提供 PDF、LaTeX template、題目圖與少量作圖資料檔；沒有 starter code、完整 dataset 或 reference answers。

## 四個主題的共同問題

Ensemble 問如何組合多個預測器；k-means 問沒有 label 時如何以距離組群；PCA 問如何保留主要變異；推薦系統問如何利用稀疏的使用者—項目訊號。方法不同，但都要求先說清楚 objective、representation 與失敗條件。

## 第一個檢查動作與結業驗收

沒有必要的程式命令；先開啟 [ZIP 的 LaTeX template 與 figures/data](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip)，確認每張圖對應 PCA、k-means 或 recommender 題組後再計算。完成判準是能手跑 k-means assignment/update、計算二維 PCA 方向、解釋 ensemble 的 bias/variance 取捨與推薦資料的稀疏性，最後畫出全課方法選擇圖。官方未提供答案，不把自行推導寫成官方驗證。

## 參考資料
- [HW9 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip)
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
