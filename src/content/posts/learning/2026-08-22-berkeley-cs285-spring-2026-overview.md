---
title: "Berkeley CS285 Spring 2026 導讀：25 講、5 份作業與自學邊界"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, deep-reinforcement-learning, self-study, ai-course]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "Spring 2026 CS185/285 公開 25 講投影片、9 組討論課資料、5 份作業與 starter code；當期錄影在 bCourses，HW4 預設 H100，不能把它包裝成零成本公開課。"
description: "整理 Berkeley CS185/285 Spring 2026 的公開教材、六篇導讀路線、先修條件、錄影限制與作業運算成本。"
series:
  name: "Berkeley CS285 Spring 2026 導讀"
  order: 1
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)

[Berkeley CS185/285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/) 是 Sergey Levine 開設的深度強化學習課。公開頁面列出 25 講投影片、9 組 discussion section、5 份作業與兩個預設期末專案；[starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026) 也能匿名下載。這是一門能實際跟做的 A3 教材型課程，但不是完整公開課。

關鍵缺口是影片。[syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/) 明寫 Spring 2026 錄影位於 bCourses Media Gallery，校外自學者通常無法存取。[官方 resources 頁](https://rail.eecs.berkeley.edu/deeprlcourse/resources/)列出的 Fall 2023 公開錄影只能當歷史替代資源；主線仍以 2026 投影片、section 與作業為準。

## 六篇怎麼讀

| 篇次 | 官方內容 | 要回答的問題 |
| --- | --- | --- |
| 1 | 全課地圖 | 能取得什麼、缺什麼、要先會什麼 |
| 2 | L1–4、Sections 1–2、HW1 | 模仿學習為何會遇到分布偏移 |
| 3 | L5–10、Sections 3–5、HW2–3 | policy gradient、actor-critic、DQN、SAC 如何接起來 |
| 4 | L11–18、Sections 6–9、HW4–5 | 推論觀點、LLM RL、model-based 與 offline RL |
| 5 | L19–25 | exploration、理論、多任務與開放問題 |
| 6 | 五份作業、期末專案 | 哪些能用 CPU，哪些需要 GPU 與預算 |

## 先修不是「會寫 Python」而已

官方要求 [CS189 或同等機器學習背景](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)，並假設讀者熟悉強化學習、數值最佳化與機器學習。若 MDP、Bellman equation、梯度與機率分布還不熟，先讀 Sutton & Barto 第 3、4 章，再做 CS188 的 MDP 單元。今晚可以做的檢查是：不看資料，寫出 state、action、transition、reward、policy 與 value function 的關係；卡住就先補基礎。

## 運算成本要先看

HW1、HW2 適合 CPU 起步。[HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) 多數實驗可在本機跑，但官方估計 MsPacman 與 HalfCheetah 即使用 GPU 也可能各花約三小時。[HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf) 的官方流程預設使用 Modal H100，且包含四個必要訓練 run。[HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf) 每個 run 最長約六小時，還要跨演算法與任務調參。

課程獲得的 Modal 支援是給修課學生的資源，不是公開教材附贈額度。自學者應先跑最小設定驗證程式，再決定是否租 GPU；不要先把全部實驗排進雲端。

## 這系列不會假裝補回缺少的課堂

沒有 bCourses，就少了教師口頭說明、即時修正、Ed 討論、Gradescope 回饋與助教 office hours。文章會解釋投影片與作業之間的結構，卻不會虛構講者說過什麼，也不會把 Fall 2023 影片標成 2026。

自學完成標準也因此改成可驗證的產物：一份推導筆記、一個通過小型環境的實作、一張跨 seed 結果表，以及一段失敗分析。這比「看完 25 講」更接近課程真正要求的能力。

## 參考資料

- [CS185/285 Spring 2026 官方課站](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS185/285 Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- [CS185/285 resources 與歷史版本](https://rail.eecs.berkeley.edu/deeprlcourse/resources/)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
