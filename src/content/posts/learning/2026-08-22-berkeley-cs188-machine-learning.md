---
title: "CS188 決策與機器學習：從 VPI、Naive Bayes 到 Attention"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, machine-learning, deep-learning, attention]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 6
tldr: "Lecture 19–25 把 rational decisions、VPI 與 ML 接起來，Project 5 再用 PyTorch 實作 regression、分類、CNN、attention 與 optional character-GPT。"
description: "Berkeley CS188 Spring 2026 後段的理性決策、機器學習、深度學習、LLM 與 Project 5 實作導讀。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-machine-learning-en)

[Lecture 19–25](https://inst.eecs.berkeley.edu/~cs188/sp26/)先談 rational decisions 與 value of perfect information，再進入 decision trees、linear regression、Naive Bayes、neural networks、language models 與 fine-tuning。[Project 5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/)則把後半段落到 PyTorch：non-linear regression、手寫數字與語言分類、CNN、attention，以及 optional character-GPT。

## 這不是另一門完整深度學習課

P5 的作用是讓廣義 AI 課的學生碰到現代 ML workflow：定義 model、forward pass、loss、optimizer、batch 與 training loop。它涵蓋面廣，但不取代專門的最佳化、表示學習或大模型課。把每題當成一個介面練習，比追求在短時間內補齊全部理論更實際。

## 先讓小模型可解釋地工作

從 regression 開始時，先讓 input／output shape、loss 下降與 held-out behavior 都能說清楚，再進分類。digit classifier 練 multiclass loss；language identification 要處理序列；CNN 題加入 spatial inductive bias；attention 題則要求理解 query、key、value 的張量關係。

[官方 P5 規格](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/)另提醒 NumPy 2.0 可能造成相容性問題，遇到相關錯誤可使用 1.24.3 或其他低於 2.0 的版本。這是版本重現問題，不要在模型程式裡用奇怪 workaround 掩蓋環境差異。

每完成一題，記錄 baseline、loss curve 與一類失敗案例。local autograder 能檢查介面與門檻，卻不會替你解釋為何模型錯；那一例才是自學者要補的分析。

系列導航：[上一篇：Bayes nets 與 Ghostbusters](/posts/learning/2026-08-22-berkeley-cs188-bayes-ghostbusters)｜[下一篇：結業路線](/posts/learning/2026-08-22-berkeley-cs188-completion-route)

## 參考資料

- [CS188 textbook — Machine Learning](https://inst.eecs.berkeley.edu/~cs188/textbook/ml/machine-learning.html)
- [CS188 textbook — Naive Bayes](https://inst.eecs.berkeley.edu/~cs188/textbook/ml/naive-bayes.html)
- [CS188 Spring 2026 Project 5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/)
