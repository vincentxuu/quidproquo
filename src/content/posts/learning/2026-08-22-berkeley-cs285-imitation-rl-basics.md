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

[官方課表](https://rail.eecs.berkeley.edu/deeprlcourse/)把前四講排成 Introduction、Behavioral Cloning、Behavioral Cloning Part 2 與 RL Basics。這段主線不是先背演算法，而是先看 supervised learning 控制器在哪裡壞掉，再引入能用 reward 學習的 RL 問題。

## L1–2：把控制先寫成監督式學習

Behavioral cloning 用 expert 的 state-action pair 訓練 policy。訓練損失容易理解，真正的問題是部署後 policy 會造訪 expert 資料沒有涵蓋的 state；一個小錯誤可能把下一步推得更遠。先在紙上畫出「訓練分布」與「policy 自己造成的分布」，再讀投影片，會比只記 covariate shift 更有用。

## L3 與 Sections 1–2：失敗要能被看見

Section 1 補 PyTorch，Section 2.1 複習機率，Section 2.2 直接處理 BC distributional shift。L3 進一步處理模仿學習，而 [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf) 要比較 MSE policy、DAgger 與 flow-matching policy。DAgger 的重點是讓 expert 對 learner 實際造訪的 state 重新標示，逐步修補資料分布。

## L4：何時必須進入 RL

RL Basics 把問題改寫成 MDP：policy 產生 trajectory，trajectory 累積 reward，而 transition dynamics 讓今天的 action 影響明天的 state。這也說明模仿學習與 RL 的分界：有 expert action 時可直接學；只有結果好壞時，必須處理 credit assignment 與探索。

## HW1 實作與成本

[Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1) 使用 `uv` 與 Weights & Biases。這份作業適合從本機 CPU 起步；完整運算依據見[作業成本表](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)。完成時至少保留三樣產物：reward curve、自行產生的行為影片，以及 MSE、DAgger、flow matching 的質性差異。

公開 PDF 與 code 足以實作，卻不等於擁有完整修課支援；差異統一列在[系列總覽的存取邊界](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。

## 參考資料

- [CS185/285 Spring 2026 官方課站](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW1：Imitation Learning](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)
- [HW1 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1)
