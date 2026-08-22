---
title: "Berkeley CS288（一）：從 n-gram、詞表示到文字分類"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, nlp, language-model, text-classification]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "前四組教材先建立可計數、可表示、可分類的文字模型；A1 再要求從 n-gram、perceptron 做到 NBOW MLP。"
description: "導讀 CS288 Spring 2026 的 Introduction、n-gram LM、Word Representation、Text Classification 與 Assignment 1。"
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 1 }
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs288-foundations-en)

CS288 前四組[官方投影片](https://cal-cs288.github.io/sp26/)處理同一個問題：文字如何先變成可計算的對象，再變成可學習的預測問題。順序是 Introduction、n-gram Language Models、Word Representation、Text Classification。

## n-gram：先把語言模型寫成條件機率

n-gram 以有限上下文近似完整歷史，訓練可以落到計數與平滑，評估則落到 held-out likelihood 或 perplexity。它的重要性不是「仍比 Transformer 強」，而是提供一個能檢查資料切分、未知詞與機率正規化的 baseline。

## 詞表示：從稀疏索引到可學習幾何

one-hot 向量只保存身分；distributed representation 讓相似詞能共享統計強度。讀這一段時要一直問：表示是從什麼 objective 學到、距離代表什麼、未知詞怎麼處理。不要把漂亮的鄰近詞例子直接當成語義已被完整捕捉。

## 分類：把表示送進決策邊界

文字分類把文件轉成特徵，再以線性或多層模型做預測。perceptron 的錯誤驅動更新讓權重與特徵仍可直接觀察；NBOW MLP 則把 embeddings、非線性與 batching 帶進來。兩者並排，才能看出效能提升來自表示、容量、最佳化還是運算方式。

## A1 怎麼驗收這四組概念

[Assignment 1](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment1.pdf) 分兩部分：在 WikiText-102 訓練 n-gram 與 neural n-gram LM；再於 SST-2 與 20 Newsgroups 實作 perceptron 和 NBOW MLP。[starter repository](https://github.com/akshat57/cs288-sp26-a1) 公開，但正式評分有 hidden labels、提交次數與套件限制。

校外練習可保留公開 starter 的資料切分與 unit tests，自訂一張表比較模型、特徵、參數量、dev accuracy 與每千筆推論時間。不要把課程解答放到公開 repo。

## 參考資料

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Assignment 1 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment1.pdf)
- [Assignment 1 starter repository](https://github.com/akshat57/cs288-sp26-a1)

