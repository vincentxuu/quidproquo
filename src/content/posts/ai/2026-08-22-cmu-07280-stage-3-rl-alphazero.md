---
title: "CMU 07-280 階段複習三：從 MDP、Q-learning 到 AlphaZero"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, reinforcement-learning, mcts, alphazero]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 27
type: deep-dive
tldr: "第三階段把 value、policy、bootstrapping、function approximation 與 MCTS 接成 AlphaZero：network 提供先驗與估值，search 改善決策，self-play 再產生下一輪資料。"
description: "整合 CMU 07-280 Spring 2026 的 MDP、reinforcement learning、deep RL、MCTS 與 Building AlphaZero 作業。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-stage-3-rl-alphazero-en)

前兩階段的資料集通常先給定答案：搜尋有 goal，監督式學習有 label，語言模型有下一個 token。Reinforcement learning 改變資料生成方式。Agent 的 action 會改變後續 state，reward 可能延遲出現，而 policy 又決定自己將看到哪些經驗。

07-280 的第三階段從 MDP 建模，走過 value iteration、Q-learning 與 function approximation，再用 MCTS 與 self-play 收束到 Building AlphaZero。官方公開了 worksheet、部分 solutions 與作業入口，卻沒有完整逐講錄影；HW12 的舊 PDF 直連在本文查核時已回傳 404。因此本篇只對可匿名驗證的官方課程頁與 Recitation 14 下結論，不假裝擁有完整 grader。

## MDP 先把不確定性寫清楚

Markov decision process 用 state `s`、action `a`、transition `P(s'|s,a)`、reward `R` 與 discount `γ` 描述 sequential decision problem。Bellman optimality equation 把長期價值拆成眼前 reward 與下一步最佳價值：

```text
V*(s) = max_a Σ_s' P(s'|s,a) [R(s,a,s') + γV*(s')]
```

這不是單純遞迴公式。它說明 value 是一致性條件：如果你對下一個 state 的估值改變，現在 action 的排序也必須更新。Model-based dynamic programming 已知 transition；model-free RL 則要從 sample transitions 估計同一個結構。

今晚可以畫一個三狀態 MDP，指定兩個 actions 與 reward，手算兩輪 value iteration。不要直接跑程式；先觀察 reward 如何一輪一輪往前傳，才會理解 bootstrapping 為何既有效又可能不穩。

## Q-learning 把最佳化目標放進 sample update

Q-learning 不需要先知道完整 transition table。看到 `(s, a, r, s')` 後，用 temporal-difference error 更新：

```text
δ = r + γ max_a' Q(s', a') - Q(s, a)
Q(s, a) ← Q(s, a) + αδ
```

`max` 讓 target 指向目前估計的最佳下一步；`α` 控制新 sample 改變舊估值的幅度。探索仍是獨立問題：如果 policy 永遠選當下最高 Q 的 action，未試過的選項可能永遠沒有資料。

Deep RL 用 neural network 近似 Q 或 policy/value functions，擺脫表格大小限制，也引入相關 samples、moving targets 與 optimization instability。Replay buffer、target network 等技巧是在修這些互動問題，不是神經網路自動帶來的保證。

## MCTS 讓估值只花在目前需要的分支

Monte Carlo Tree Search 在 selection、expansion、evaluation／simulation 與 backup 之間反覆。和固定深度 minimax 相比，它能把更多 budget 放到看起來有希望或仍不確定的分支。探索項通常同時考慮平均價值與 visit count，避免過早鎖死。

標準 MCTS 可以用隨機 rollout 評估 leaf。AlphaZero 類系統則讓 network 同時輸出 policy prior 與 value estimate：policy 告訴 search 哪些 actions 值得先看，value 避免每次都把遊戲 rollout 到終局。Search 並沒有被 network 取代，而是被 network 導引。

## AlphaZero 是資料生成迴圈

[Spring 2026 Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)把訓練資料寫成 `(s_t, π_t, z_t)`：目前 state、MCTS 改善後的 action distribution，以及最終結果。迴圈可以壓成：

```text
network → policy/value priors → MCTS → improved action distribution
    ↑                                      ↓
    └──── train on self-play (s, π, z) ← play game
```

這個設計把「規劃」與「學習」互相當老師。MCTS 用額外計算改善 network 的即時選擇；self-play 把改善後的選擇存成資料，再更新 network。它也形成回饋風險：探索不足時，資料只覆蓋目前 policy 願意到達的區域；錯誤估值可能透過 search 與 retraining 被放大。

## 公開材料能做到哪裡

[官方 assignment table](https://www.cs.cmu.edu/~07280/)確認 HW12 是 online programming 的 Building AlphaZero，並連到 notebook；Recitation 14 與 solution 則公開 policy/value heads、self-play tuples 和 policy-guided tree selection。這足以重建概念鏈，卻不足以複製正式班的測試、算力與 feedback。

校外實作不必先追求完整棋力。選 tic-tac-toe 或 Connect Four 的縮小版本，先讓每個 state 經 MCTS 產生 visit-count distribution，再確認 backup 後 root value 方向正確。最後才接 network。若一開始就把 self-play、GPU training 與完整 tree search 全開，錯誤會藏在三個迴圈交界處。

## 第三階段的通關條件

你應該能區分 environment reward、value estimate 與 search statistics；能手算一次 Q-learning update；能解釋 `π_t` 為何是 search 產生的訓練 target，而不是環境直接給的 label。最重要的是，能畫出資料從 self-play 回到 network 的完整路徑。

做到這裡，07-280 的課程設計才真正閉合：Lecture 2 的 search 並沒有被 ML 章節丟掉，而是在 AlphaZero 裡回來；神經網路也不只是分類器，而成為 search 的 prior 與 evaluator。

## 參考資料

- [CMU 07-280 official course site and assignment table](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [MDP notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MDPs.pdf)
- [Approximate Q-learning notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Approx_Q-learning.pdf)
- [Recitation 14: AlphaGo／AlphaZero](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)
- [Recitation 14 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)
