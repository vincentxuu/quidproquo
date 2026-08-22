---
title: "MIT 6.S191 Lecture 8：AI for Science：把領域結構放進學習流程"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 9
tldr: "2026 第 8 講以科學發現循環為主線，說明 simulator、AI emulator 與實驗如何合作，而不是把科學簡化成通用預測。"
description: "MIT 6.S191 2026 Lecture 8 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l08-ai-for-science-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 8 講是 **AI for Science：把領域結構放進學習流程**。以科學發現循環為主線，說明 simulator、AI emulator 與實驗如何合作，而不是把科學簡化成通用預測。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 分清真實實驗、模擬器與 AI surrogate 的角色
- 理解 invariance 與 conservation law 為何能約束模型
- 把速度提升與科學有效性分開驗證

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


科學工作流從 hypothesis 進入 experiment；昂貴實驗可先由 simulator 近似，再用 AI emulator 加速部分計算，最後仍回到實驗驗證。emulator 若離開訓練分布或違反守恆條件，速度再快也不能當作新科學結論。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L8.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=rZACoZD8AG8)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

選一個科學問題，畫出 hypothesis、experiment、simulator 與 AI emulator 的資料流，標出必須回到真實世界驗證的位置。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 8 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L8.pdf)
- [Lecture 8 官方影片](https://www.youtube.com/watch?v=rZACoZD8AG8)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
