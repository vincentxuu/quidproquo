---
title: "MIT 6.S191 Lecture 9：大規模平行訓練：記憶體與通訊才是邊界"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 10
tldr: "2026 第 9 講從 GPU 記憶體壓力進入 checkpointing、offloading、ZeRO、FSDP 與多種 parallelism，理解擴展不是只加卡。"
description: "MIT 6.S191 2026 Lecture 9 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l09-parallel-training-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 9 講是 **大規模平行訓練：記憶體與通訊才是邊界**。從 GPU 記憶體壓力進入 checkpointing、offloading、ZeRO、FSDP 與多種 parallelism，理解擴展不是只加卡。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 把參數、gradient、optimizer state 與 activation 分開估算
- 分辨 data、tensor、pipeline 與 context parallelism 切的是什麼
- 知道節省記憶體常會增加重算或通訊

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


先算參數、gradient、optimizer state 與 activation 的記憶體，再決定切分方式：data parallel 複製模型、tensor parallel 切算子、pipeline parallel 切層、context parallel 切序列。每種切分都把部分記憶體壓力換成通訊、同步或 pipeline bubble。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L9.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=UZZD9d9YqnQ)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

替一個模型列四欄記憶體帳，再決定先用 checkpointing、sharding 或換小模型；不要從「要幾張 GPU」倒推。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 9 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L9.pdf)
- [Lecture 9 官方影片](https://www.youtube.com/watch?v=UZZD9d9YqnQ)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
