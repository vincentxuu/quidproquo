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

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 4 講是 **生成模型：從潛在空間到 diffusion**。區分生成與判別問題，整理 VAE 與 GAN 的學習目標（本講影片沒有講 diffusion，講者把它留到 Lecture 6），並接到 Lab 2 的 DB-VAE。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=R8V8CbuxryI
title: MIT 6.S191: Deep Generative Modeling
```

原始影片：[MIT 6.S191: Deep Generative Modeling](https://www.youtube.com/watch?v=R8V8CbuxryI)

課程與錄影入口：

- [mit-6s191 — official course materials and recording index](https://introtodeeplearning.com/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：字幕涵蓋監督與非監督學習的對照、密度估計與樣本生成、autoencoder、VAE（均值與變異數、KL 正則化、reparameterization）、GAN（generator 與 discriminator）與 CycleGAN，並說明今天的 Lab 是用 VAE 對臉部偵測去偏。字幕沒有講 diffusion：講者明說 diffusion 留到「明天的 Lecture 6」，所以本文把 diffusion 與 denoising 寫成本講影片內容並不成立，已改為指向 Lecture 6 影片。

## 這一講要帶走什麼

- 說明 latent variable 為何能表示資料中的變化因素
- 分辨 reconstruction 與 adversarial 目標（denoising／diffusion 在 Lecture 6 影片才講）
- 知道生成品質高不等於資料偏差已消失

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


VAE 把輸入編碼成分布、從 latent space 取樣，再解碼重建；GAN 讓 generator 與 discriminator 對抗；diffusion 則學習逐步逆轉加噪過程（這一段不在本講影片內，見 Lecture 6）。三條路的 loss 不同，因此「哪個生成得好」必須先定義 fidelity、diversity 與下游用途。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L4.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=R8V8CbuxryI)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

替 VAE 畫出 encoder、取樣與 decoder，標出 loss 的兩部分，再進 Lab 2 Part 2。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。字幕沒有講 diffusion（講者說留到 Lecture 6），已更正本文中把 diffusion 與 denoising 算進本講影片的說法；frontmatter 的 title／tldr 仍含 diffusion，未動。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 4 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L4.pdf)
- [Lecture 4 官方影片](https://www.youtube.com/watch?v=R8V8CbuxryI)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
