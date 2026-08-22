---
title: "MIT 6.S191 Lecture 7：AI 三法則：安全要落在可觀測與評估"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 8
tldr: "2026 第 7 講從 Asimov 的文學法則出發，討論現代 AI 安全協定的限制，以及 trace、測試資料與持續評估。"
description: "MIT 6.S191 2026 Lecture 7 雙語學習筆記：核心概念、觀看重點、可立即完成的練習與官方教材。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-l07-three-laws-ai-en)

[MIT 6.S191 2026](https://introtodeeplearning.com/) 第 7 講是 **AI 三法則：安全要落在可觀測與評估**。從 Asimov 的文學法則出發，討論現代 AI 安全協定的限制，以及 trace、測試資料與持續評估。這篇只依 2026 官方投影片與影片整理；不把 2025 的同名內容混進來。

## 這一講要帶走什麼

- 知道抽象安全原則不能直接變成系統保證
- 把 observability 視為事後調查與改進的前提
- 用固定測試集追蹤模型或 prompt 更新造成的退步

這些概念的共同點是：不能只會認名詞。你要能指出輸入、輸出、學習訊號與限制，才算真的接上後續內容。


安全原則要經過 policy、可觀測事件、測試案例與告警門檻，才會變成能執行的控制。trace 能回答系統做過什麼，固定 evaluation set 能回答新版是否退步；兩者仍無法證明所有未知情境都安全。

## 建議觀看方式

先快速看一遍[官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L7.pdf)的章節與圖，再看[官方影片](https://www.youtube.com/watch?v=XKOpA7iaJvg)。第二遍遇到公式或架構圖就暫停，用自己的符號重畫；影片播完後，不回看資料，寫下三個核心概念與一個仍不確定的地方。

## 今晚就能做的練習

替自己的 AI 功能保存十個代表案例、輸入輸出與版本；下一次更新後逐項重跑。

完成標準不是「看完」。你應留下可檢查的圖、計算、程式輸出或短筆記，並能向另一個人解釋其中一個失敗點。

## 這篇沒有涵蓋什麼

6.S191 是高強度入門課，本篇也只做單講導航，不替代完整影片、數學推導或正式作業回饋。若某個主題需要嚴格理論，應接一學期制課程或原始論文。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [Lecture 7 官方投影片](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L7.pdf)
- [Lecture 7 官方影片](https://www.youtube.com/watch?v=XKOpA7iaJvg)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
