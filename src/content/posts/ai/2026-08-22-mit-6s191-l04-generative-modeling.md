---
title: "MIT 6.S191 Lecture 4：生成模型：從潛在空間到 diffusion"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 5
tldr: "2026 第 4 講區分生成與判別問題，整理 VAE、GAN 與 diffusion 的學習目標，並接到 Lab 2 的 DB-VAE。"
description: "MIT 6.S191 2026 Lecture 4 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 4 講是 **生成模型：從潛在空間到 diffusion**。區分生成與判別問題，整理 VAE、GAN 與 diffusion 的學習目標，並接到 Lab 2 的 DB-VAE。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 說明 latent variable 為何能表示資料中的變化因素
- 分辨 reconstruction、adversarial 與 denoising 目標
- 知道生成品質高不等於資料偏差已消失

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


VAE 把輸入編碼成分布、從 latent space 取樣，再解碼重建；GAN 讓 generator 與 discriminator 對抗；diffusion 則學習逐步逆轉加噪過程。三條路的 loss 不同，因此「哪個生成得好」必須先定義 fidelity、diversity 與下游用途。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L4.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=R8V8CbuxryI)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

替 VAE 畫出 encoder、取樣與 decoder，標出 loss 的兩部分，再進 Lab 2 Part 2。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 4 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L4.pdf)
- [Lecture 4 官方影片](https://www.youtube.com/watch?v=R8V8CbuxryI)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
