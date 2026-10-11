---
title: "MIT 6.S191 Lecture 5：強化學習：用回報取代標準答案"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 6
tldr: "2026 第 5 講把 agent、environment、state、action、reward 與 policy 接成互動迴圈，理解信用分配與探索。"
description: "MIT 6.S191 2026 Lecture 5 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l05-reinforcement-learning-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 5 講是 **強化學習：用回報取代標準答案**。把 agent、environment、state、action、reward 與 policy 接成互動迴圈，理解信用分配與探索。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=1ij3dweHu-0
title: MIT 6.S191: Reinforcement Learning
```

原始影片：[MIT 6.S191: Reinforcement Learning](https://www.youtube.com/watch?v=1ij3dweHu-0)

課程與錄影入口：

- [mit-6s191 — official course materials and recording index](https://introtodeeplearning.com/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：字幕涵蓋 agent／environment／state／action／reward、discounted return、Q function 與 deep Q network（Atari Breakout 例子）、policy gradient、sparse／延遲 reward、探索與利用的取捨，以及 RL 用在 LLM 對齊；與本文相符。

## 這一講要帶走什麼

- 分清 immediate reward 與長期 return
- 理解 policy gradient 為何提高高回報動作的機率
- 辨認 sparse reward、exploration 與不穩定訓練的風險

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


互動鏈是 policy 依 state 選 action，environment 回傳下一個 state 與 reward，再把多步 reward 彙整成 return。policy gradient 用取樣軌跡估計更新方向，因此 reward 設計、探索範圍與估計變異都會改變學到的行為。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L5.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=1ij3dweHu-0)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

替一個簡單遊戲寫下 state、action、reward 與終止條件；如果 reward 一行寫不清楚，就先別訓練。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。主題相符，沒有需要更正的地方。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 5 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L5.pdf)
- [Lecture 5 官方影片](https://www.youtube.com/watch?v=1ij3dweHu-0)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
