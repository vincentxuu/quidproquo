---
title: "CMU 10-301 HW4：把 Logistic Regression 從 likelihood 寫成分類器"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, logistic-regression, optimization]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "HW4 把機率解釋、cross-entropy 梯度與程式實作綁在一起，驗收的是一條可追蹤的訓練流程。"
description: "CMU 10-301/601 Spring 2026 HW4 Logistic Regression 的推導、實作與本機驗收方法。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 4 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw4-logistic-regression-en)

[官方 ZIP 內 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw4.zip) 完整題名是 **Homework 4: Logistic Regression**，屬於 written＋programming。Written 題組包含 linear regression、logistic-regression warm-up／analysis／adversarial attack、vectorization and pseudocode、word embeddings and gender biases，以及 empirical questions。程式要先以 `feature.py` 將 Yelp sentiment text 轉成 GloVe 平均向量，再以 `lr.py` 訓練 logistic regression。ZIP 提供兩份 starter 與 `glove_embeddings.txt`；資料與部分 reference output 由課程作業環境配發，這個公開 ZIP 並未包含它們。

## 能力交付點

先手算單筆樣本的 logit、機率、loss 與梯度，再讓程式逐項重現。若只看最終 accuracy，sign 錯誤、平均方式或 bias 處理都可能被資料偶然掩蓋。訓練迴圈至少要能輸出每 epoch loss，並固定資料順序與初始化。

## 第一個可執行動作與完成判準

先解開 [bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw4.zip)，執行 `python feature.py --help` 與 `python lr.py --help`，確認 starter 的參數介面；公開 ZIP 缺 Yelp train/validation/test，因此不能誠實給出一條可完成官方資料流程的命令。取得合法資料後，再做 finite-difference gradient check。完成判準是 feature 檔格式可重現、單筆 gradient 通過數值檢查、train/validation/test 輸出齊全；沒有官方資料與 hidden tests 時只能算部分完成。

## 參考資料
- [HW4 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw4.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
