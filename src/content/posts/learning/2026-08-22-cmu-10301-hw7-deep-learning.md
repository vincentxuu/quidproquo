---
title: "CMU 10-301 HW7：從基礎神經網路走到 Deep Learning"
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

## 參考資料
- [HW7 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
