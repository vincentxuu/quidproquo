---
title: "MIT 6.S191 Lecture 1：深度學習的最小骨架"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 2
tldr: "2026 第 1 講從感知器、前向傳播、loss 到 gradient descent，建立後續九講共用的語言。"
description: "MIT 6.S191 2026 Lecture 1 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l01-deep-learning-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 1 講是 **深度學習的最小骨架**。從感知器、前向傳播、loss 到 gradient descent，建立後續九講共用的語言。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 把單一神經元寫成加權和、bias 與非線性 activation
- 沿著多層網路追蹤 tensor shape，而不是只記架構名稱
- 說清楚 loss 衡量什麼，以及 gradient descent 如何改參數

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


一條完整概念鏈是：輸入先經過加權和與 activation 形成預測，loss 把預測和目標壓成可比較的數值，反向傳播再用 chain rule 把責任分回每個參數。限制是：loss 下降只表示你選的目標變好，不保證資料外推或實際用途也變好。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L1.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=II4giR4vOOo)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

看完後，自己畫一個兩層網路，替每條邊標出 shape；再用 Lab 1 Part 1 驗證圖上的矩陣乘法。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 1 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L1.pdf)
- [Lecture 1 官方影片](https://www.youtube.com/watch?v=II4giR4vOOo)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
