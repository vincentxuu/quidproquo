---
title: "CMU 10-301 HW5：用 NumPy 拆開 Neural Network 與 Backpropagation"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, neural-network, backpropagation]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "HW5 的價值在於不靠自動微分，親手追蹤 forward shapes、cache 與 backward gradients。"
description: "CMU 10-301/601 Spring 2026 HW5 Neural Networks 的計算圖讀法與本機梯度檢查。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 5 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw5-neural-networks-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw5.zip) 完整題名是 **Homework 5: Neural Networks**，屬於 written＋programming。Written 以 feed-forward／backpropagation 手算與 empirical questions 為主；程式要用單一 hidden layer、sigmoid 與 softmax 做 OCR 字母分類。ZIP 提供 `neuralnet.py` starter、small train/validation CSV、`tests.py`、unit-test data、incorrect finder 與 visualizer；medium／large datasets 與正式 reference solution 不在公開 ZIP。

## 從計算圖讀程式

為每個 tensor 標 shape，forward 時只存 backward 真正需要的 cache。反向傳播先寫局部導數，再沿圖累積；不要一口氣抄成長公式。batch 維度、bias broadcasting 與 loss normalization 是最常見的靜默錯誤。

## 第一個可執行動作與完成判準

先在 [bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw5.zip) 的 handout 目錄跑：

```bash
python -m unittest tests
```

再用 small CSV 執行 handout 的 `neuralnet.py` 介面，做 finite-difference gradient check，最後嘗試 overfit 極小子集。完成判準是公開 unit tests 通過、small data 的每 epoch loss 與 labels／metrics 格式正確、數值梯度吻合；官方明說公開 tests 不完整，因此不能等同 Gradescope 全過。

## 參考資料
- [HW5 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw5.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
