---
title: "從基礎神經網路走到 Deep Learning｜CMU 10-301 作業 7"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, deep-learning, neural-network]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "HW7 在 HW5 的 backpropagation 地基上加入深度模型的架構與訓練問題，重點是診斷而非只把網路加深。"
description: "CMU 10-301/601 Spring 2026 HW7 Deep Learning 的銜接方式、實作邊界與自評。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 7 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw7-deep-learning-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip) 完整題名是 **Homework 7: Deep Learning**，屬於 written＋programming。Written 題組包括 CNN、RNN、Transformers and AutoDiff 與 empirical questions；程式則在 TinyStories 子集上實作 RNN cell、self-attention、hybrid language model、validation 與 generation。ZIP 提供 `rnn.py` starter、公開 unit tests/test data、tokenizer、tiny train/validation stories、loss/metrics reference、Colab notebook 與 environment file。

## 先建立診斷順序

固定小資料與 random seed，依序檢查 shape、初始 loss、單步梯度、能否 overfit，再比較架構。若 training loss 不動，先查 activation、normalization 與 learning rate；若 training 好而 validation 差，再談 regularization。不要把所有故障都叫 overfitting。

## 第一個可執行動作與完成判準

先依 [bundle 的 environment file](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip) 建環境：

```bash
conda env create -f environment.yml
```

接著用 `test_runner.py` 跑公開測試，再以 tiny stories 執行 validation/generation。完成判準是 RNN cell、attention、hybrid LM、train、validate、generation 公開 tests 通過，並重現 tiny loss/metrics 的允許範圍；公開 tests 與 tiny references 不能代替 Gradescope hidden tests。

## 用 loss 記錄練習診斷

以下是本文自編的教學例子，不是官方作業答案。

自編兩次實驗：A 的 training loss 從 1.0 降到 0.2，validation 從 1.0 升到 1.3；B 的兩個 loss 都停在 1.0。A 顯示訓練集擬合變好、驗證變差，先查過擬合與資料分布；B 沒有成功擬合訓練資料，先查訓練流程與梯度。

**檢查與答案：** 能否只憑 B 說網路容量太小？答案不能。先確認權重有更新、梯度非零與資料/label 正確，再用極小子集測能否 overfit，才縮小診斷範圍。

## 更新紀錄

- 2026-10-11：補上自編例子、完整計算或推理，以及理解檢查答案。

## 參考資料
- [HW7 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
