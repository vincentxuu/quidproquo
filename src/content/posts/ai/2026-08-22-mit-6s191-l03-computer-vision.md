---
title: "MIT 6.S191 Lecture 3：電腦視覺：卷積如何保留空間結構"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 4
tldr: "2026 第 3 講從影像張量、卷積與 pooling 走到辨識系統，替 Lab 2 的 MNIST 與臉部偵測打底。"
description: "MIT 6.S191 2026 Lecture 3 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l03-computer-vision-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 3 講是 **電腦視覺：卷積如何保留空間結構**。從影像張量、卷積與 pooling 走到辨識系統，替 Lab 2 的 MNIST 與臉部偵測打底。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 算出 kernel、stride 與 padding 改變後的 feature-map 尺寸
- 理解 weight sharing 為何比全連接層適合影像
- 把準確率拆成資料分布與失敗案例來看

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


卷積的概念鏈是局部 receptive field、共享權重、逐層擴大的有效視野，再接分類或偵測輸出。這帶來平移相關的歸納偏好，卻不等於模型對旋轉、遮擋、光線或新族群自然穩健；這些仍要用對應測試資料驗證。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L3.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=pqIcoskUuWs)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

拿一張小影像手算一次 3×3 convolution，再到 Lab 2 Part 1 對照 PyTorch 輸出 shape。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 3 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L3.pdf)
- [Lecture 3 官方影片](https://www.youtube.com/watch?v=pqIcoskUuWs)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
