---
title: "MIT 6.S191 Lecture 6：新前沿：模型之外還要選問題"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 7
tldr: "2026 第 6 講把深度學習放進新應用與真實限制，提醒讀者先定義資料、輸出、評量與失敗條件。"
description: "MIT 6.S191 2026 Lecture 6 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l06-new-frontiers-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 6 講是 **新前沿：模型之外還要選問題**。把深度學習放進新應用與真實限制，提醒讀者先定義資料、輸出、評量與失敗條件。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 把酷炫 demo 還原成可檢驗的 task definition
- 區分模型能力、資料可得性與部署限制
- 在選架構前先寫 baseline 與 failure condition

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


從應用倒推模型時，先把需求寫成可量測輸出，再找可取得的資料與 baseline，最後才選模型。這條順序能揭露一個常被 demo 蓋住的限制：模型能力即使足夠，標註、延遲、隱私或錯誤成本仍可能讓專案不可部署。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L6.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=ev7cLSd-ySE)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

挑一個想做的題目，用六行寫完問題、輸入、輸出、資料、baseline 與失敗條件。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 6 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L6.pdf)
- [Lecture 6 官方影片](https://www.youtube.com/watch?v=ev7cLSd-ySE)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
