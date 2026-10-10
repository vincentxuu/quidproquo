---
title: "Berkeley CS285 L1–4：模仿學習、分布偏移與 RL 基礎"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, imitation-learning, reinforcement-learning, self-study]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "前四講從 behavioral cloning 走到 MDP；HW1 再用 MSE policy、DAgger 與 flow matching，讓分布偏移從概念變成可觀察的失敗。"
description: "導讀 CS285 Spring 2026 第 1–4 講、Sections 1–2 與 HW1，建立模仿學習到強化學習的第一段主線。"
series:
  name: "Berkeley CS285 Spring 2026 導讀"
  order: 2
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[官方課表](https://rail.eecs.berkeley.edu/deeprlcourse/)把前四講排成 Introduction、Behavioral Cloning、Behavioral Cloning Part 2 與 RL Basics。這段主線不是先背演算法，而是先看 supervised learning 控制器在哪裡壞掉，再引入能用 reward 學習的 RL 問題。

## 課程影片來源

2026-10-10 即時核對：講師已把 Spring 2026 講課錄影公開在 RAIL 的 YouTube 頻道（播放清單「CS 185/285: Deep Reinforcement Learning (Spring 2026)」，27 支，2026-08-15 起公開）。講次編號與官方投影片清單一致，這些錄影對應本文涵蓋的講次。課程 syllabus 仍寫錄影在 bCourses、課站也仍連到 Fall 2023 播放清單，但觀看這些錄影不需要它們。此處嵌入其中兩講，其餘請見播放清單。

```youtube
url: https://www.youtube.com/watch?v=yatA09E0J00
title: CS 185/285 (Spring 2026): Lecture 2, Supervised Learning of Behaviors
```

```youtube
url: https://www.youtube.com/watch?v=FcpIul7rAEE
title: CS 185/285 (Spring 2026): Lecture 4, Reinforcement Learning Basics
```

原始影片：[CS 185/285 (Spring 2026): Lecture 2, Supervised Learning of Behaviors](https://www.youtube.com/watch?v=yatA09E0J00)、[CS 185/285 (Spring 2026): Lecture 4, Reinforcement Learning Basics](https://www.youtube.com/watch?v=FcpIul7rAEE)

課程與錄影入口：

- [官方課程與錄影入口](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：Lecture 2 字幕涵蓋 behavioral cloning、distributional shift（含數學推導）與 DAgger（附無人機穿越森林的例子），並預告 flow matching／diffusion 等複雜分布表示；Lecture 4 字幕前段接續上一講的 flow matching policy 與 HW1，之後定義 MDP（state、action、reward、transition）與 POMDP，並說明模仿學習與 RL 的差別。本文「L3 與 Sections」與 HW1 細節屬本站依官方資料整理，嵌入的兩講不涵蓋；字幕中沒有出現 credit assignment 一詞，探索僅短暫帶過。

## L1–2：把控制先寫成監督式學習

Behavioral cloning 用 expert 的 state-action pair 訓練 policy。訓練損失容易理解，真正的問題是部署後 policy 會造訪 expert 資料沒有涵蓋的 state；一個小錯誤可能把下一步推得更遠。先在紙上畫出「訓練分布」與「policy 自己造成的分布」，再讀投影片，會比只記 covariate shift 更有用。

## L3 與 Sections 1–2：失敗要能被看見

Section 1 補 PyTorch，Section 2.1 複習機率，Section 2.2 直接處理 BC distributional shift。L3 進一步處理模仿學習，而 [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf) 要比較 MSE policy、DAgger 與 flow-matching policy。DAgger 的重點是讓 expert 對 learner 實際造訪的 state 重新標示，逐步修補資料分布。

## L4：何時必須進入 RL

RL Basics 把問題改寫成 MDP：policy 產生 trajectory，trajectory 累積 reward，而 transition dynamics 讓今天的 action 影響明天的 state。這也說明模仿學習與 RL 的分界：有 expert action 時可直接學；只有結果好壞時，必須處理 credit assignment 與探索。

## HW1 實作與成本

[Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1) 使用 `uv` 與 Weights & Biases。這份作業適合從本機 CPU 起步；完整運算依據見[作業成本表](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)。完成時至少保留三樣產物：reward curve、自行產生的行為影片，以及 MSE、DAgger、flow matching 的質性差異。

公開 PDF 與 code 足以實作，卻不等於擁有完整修課支援；差異統一列在[系列總覽的存取邊界](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。在 RAIL 頻道找到公開的 Spring 2026 CS 185/285 播放清單，嵌入兩講對應錄影，狀態由僅附官方入口改為已附影片。
- 2026-10-10：依字幕核對影片內容。確認兩支影片是 Lecture 2 與 4，內容與本文相符；補註 credit assignment 一詞影片未出現。

## 參考資料

- [CS185/285 Spring 2026 官方課站](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW1：Imitation Learning](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)
- [HW1 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1)
