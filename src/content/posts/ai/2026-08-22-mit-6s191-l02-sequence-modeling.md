---
title: "MIT 6.S191 Lecture 2：序列模型：從 RNN 到注意力"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 3
tldr: "2026 第 2 講處理文字、音訊與時間序列中「順序會改變意義」的問題，並連到 Lab 1 的音樂生成。"
description: "MIT 6.S191 2026 Lecture 2 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l02-sequence-modeling-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 2 講是 **序列模型：從 RNN 到注意力**。處理文字、音訊與時間序列中「順序會改變意義」的問題，並連到 Lab 1 的音樂生成。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 理解 recurrent state 如何把過去帶到下一步
- 辨認長序列中的 gradient 與記憶瓶頸
- 把 attention 看成依查詢選取資訊，而不是神祕模組

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


序列模型先把當前 token 與先前狀態合成新狀態，再用它預測下一步；RNN 把記憶壓在固定狀態裡，attention 則讓每個位置直接依查詢取用其他位置。兩者都不會自動理解長期因果，序列變長仍會帶來記憶體、計算與資料品質問題。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L2.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=d02VkQ9MP44)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

選一段 ABC 樂譜，手工切出輸入與下一字元目標；完成後再進 Lab 1 Part 2。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 2 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L2.pdf)
- [Lecture 2 官方影片](https://www.youtube.com/watch?v=d02VkQ9MP44)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
