---
title: "Berkeley CS285 L5–10：Policy Gradient、Actor-Critic、DQN 與 SAC"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, policy-gradient, q-learning, actor-critic]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "L5–10 用 policy-based 與 value-based 兩條路建立深度 RL 核心；HW2 可用 CPU，HW3 的 Atari 與 HalfCheetah 則約需數小時 GPU。"
description: "導讀 CS285 Spring 2026 第 5–10 講、Sections 3–5，以及 policy gradient、DQN、SAC 作業。"
series:
  name: "Berkeley CS285 Spring 2026 導讀"
  order: 3
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

第 5–10 講形成課程的演算法核心：[官方 agenda](https://rail.eecs.berkeley.edu/deeprlcourse/)依序是 Policy Gradients、Actor Critic、Value-Based RL、Q-learning in Practice，以及兩講 Advanced Policy Gradients。讀法應沿著「估計什麼、資料從哪來、偏差與變異怎麼交換」前進。

## 課程影片來源

2026-10-10 即時核對：講師已把 Spring 2026 講課錄影公開在 RAIL 的 YouTube 頻道（播放清單「CS 185/285: Deep Reinforcement Learning (Spring 2026)」，27 支，2026-08-15 起公開）。講次編號與官方投影片清單一致，這些錄影對應本文涵蓋的講次。課程 syllabus 仍寫錄影在 bCourses、課站也仍連到 Fall 2023 播放清單，但觀看這些錄影不需要它們。此處嵌入其中兩講，其餘請見播放清單。

```youtube
url: https://www.youtube.com/watch?v=S0D9REIVdg4
title: CS 185/285 (Spring 2026): Lecture 5, Policy Gradients
```

```youtube
url: https://www.youtube.com/watch?v=PCOyNjwyFvk
title: CS 185/285 (Spring 2026): Lecture 7, Value-Based RL
```

原始影片：[CS 185/285 (Spring 2026): Lecture 5, Policy Gradients](https://www.youtube.com/watch?v=S0D9REIVdg4)、[CS 185/285 (Spring 2026): Lecture 7, Value-Based RL](https://www.youtube.com/watch?v=PCOyNjwyFvk)

課程與錄影入口：

- [官方課程與錄影入口](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

查核日期：2026-10-10。

## Policy-based：直接改善 policy

L5 從 trajectory objective 推出 policy gradient；reward-to-go、baseline 與 advantage 都是在不改目標的前提下降低估計變異。L6 的 actor-critic 用 critic 估計 actor 的更新訊號，換來可能的 function-approximation bias。Section 3 把兩者接起來，Section 5 再處理進階 policy gradient。

[HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf) 要實驗 reward-to-go 與 neural-network baseline。它適合 CPU 起步；完整估時與硬體分界見[作業成本表](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)。不要只交最好曲線；自學時至少固定環境，跑三個 seed 並報 mean 與個別曲線。

## Value-based：學會評價 action

L7–8 從 Bellman backup 進入 DQN 與實務穩定技巧。L9–10 回到更進階的 policy gradient，使讀者能比較 on-policy 與 off-policy、discrete 與 continuous action 的取捨。Section 4 把 DQN 與 SAC 並列，是最適合做一張比較表的地方：更新目標、replay buffer、target network、entropy term 各自解決什麼問題。

[HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) 實作 DQN 與 SAC。[starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw3) 同時包含便宜與昂貴的環境；GPU 估時見[作業成本表](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)。先用 sanity-check environment 驗證 loss、replay 與 evaluation，再啟動昂貴 run。

## 完成標準

最後應能不看筆記回答：policy gradient 為何高變異、critic 如何降低變異又引入偏差、DQN 為何需要 replay 與 target network、SAC 的 entropy 為何有用。回答不了，就回到推導與最小實驗，不要直接堆算力。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。在 RAIL 頻道找到公開的 Spring 2026 CS 185/285 播放清單，嵌入兩講對應錄影，狀態由僅附官方入口改為已附影片。

## 參考資料

- [CS185/285 Spring 2026 官方課站](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW2：Policy Gradients](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)
- [HW3：Q-Learning and Actor-Critic](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
