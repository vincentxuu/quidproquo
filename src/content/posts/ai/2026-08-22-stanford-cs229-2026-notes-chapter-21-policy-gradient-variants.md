---
title: "策略梯度及其變體：REINFORCE 與 PPO"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, policy-gradient, reinforce, ppo, reinforcement-learning]
lang: zh-TW
tldr: "第 21 章從 log-derivative trick 推出 REINFORCE，再用 reward-to-go、baseline 與 PPO clipping 控制 policy-gradient 的高變異與更新幅度。"
description: "導讀 CS229 2026 主講義第 21 章：REINFORCE 的 log-derivative 推導、reward-to-go、baseline 與 PPO clipped surrogate。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 22
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-21-policy-gradient-variants-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 21 章（印刷頁 258–265）。這是 2026 notes 的逐章導讀，不是任何學期錄影重建；本文保留 REINFORCE 與 PPO 的核心推導、直覺和限制，不逐行複製全部證明。

## REINFORCE 不需要知道環境公式

有限期軌跡記為 \(\tau=(s_0,a_0,\ldots,s_T)\)，隨機策略為 \(\pi_\theta(a\mid s)\)。目標是最大化折扣總 reward：

\[
\eta(\theta)=\mathbb{E}_{\tau\sim P_\theta}\left[\sum_{t=0}^{T-1}\gamma^tR(s_t,a_t)\right].
\]

REINFORCE 只要求能與環境互動、採樣轉移並取得 reward，不需要知道轉移或 reward 的解析式，也不必先學它們。

## Log-derivative trick 讓梯度可採樣

若把一條軌跡的 payoff 寫成 \(f(\tau)\)，則

\[
\nabla_\theta\mathbb{E}_{P_\theta}[f(\tau)]
=\mathbb{E}_{P_\theta}[\nabla_\theta\log P_\theta(\tau)f(\tau)].
\]

軌跡機率包含初始狀態、環境轉移與策略機率；只有策略依賴 \(\theta\)，因此未知轉移項在微分後消失：

\[
\nabla_\theta\log P_\theta(\tau)=\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t).
\]

直覺是：高 reward 軌跡中的動作會被提高機率，低 reward 軌跡則得到較小或反向的權重。這個 Monte Carlo estimator 無偏，但變異可能很大。

## Reward-to-go 與 baseline

時間 \(t\) 的動作不會影響更早的 reward，因此可把整條軌跡回報換成從 \(t\) 開始的 reward-to-go。又因 score function 的期望為零，減去只依賴狀態的 baseline \(B(s_t)\) 不會改變期望梯度：

\[
\nabla_\theta\log\pi_\theta(a_t\mid s_t)\bigl(R_{\ge t}-B(s_t)\bigr).
\]

若 \(B\) 近似 value function，括號就是 advantage 的估計。baseline 的價值在降低變異，不是改變最佳化目標；估得不精確仍可能有用。

## PPO 如何重用舊策略資料

vanilla policy gradient 是 on-policy：更新後，舊軌跡不再來自目前策略。PPO 以舊策略 \(\pi_{old}\) 採樣，定義每個時間點的 likelihood ratio

\[
r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{old}(a_t\mid s_t)}.
\]

它用 \(r_t\hat A_t\) 修正動作分布，並採用 clipped contribution：

\[
\min\left(r_t\hat A_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\hat A_t\right).
\]

正 advantage 的動作若已被提高太多，目標不再獎勵繼續增加；負 advantage 的動作若已被壓低太多，也不再獎勵繼續下降。它允許同一批資料做多次局部更新，但 state distribution 仍來自舊策略，所以這是局部 surrogate，不是完全消除 off-policy 偏差。實務上也常用 GAE 改善 advantage 的 bias–variance 取捨。

## 假設與失效點

- REINFORCE 的無偏不代表樣本效率高；長 horizon 與稀疏 reward 會放大變異。
- baseline 若依賴所選動作，不能直接沿用「不改期望」的論證。
- PPO clipping 限制樣本動作上的 incentive，不等於保證整體策略 KL 有硬上限。
- 舊策略 state distribution 未被 likelihood ratio 完整修正，更新只能視為局部近似。
- reward 設計錯誤時，演算法只會更有效率地最佳化錯誤代理。

## 與相鄰章節的銜接

第 20 章利用已知或學得的結構做 model-based control；第 21 章直接從 rollout 學策略。它也回扣第 18 章：LLM RLVR 中的 token-level PPO、group-relative baseline 與其他變體，都建立在本章的 score-function 與 advantage 骨架上。

## 練習

給兩條長度三的軌跡，每一步 reward 分別為 \((2,3,5)\) 與 \((1,1,0)\)，並令 \(\gamma=1\)。先寫出各時間點的 reward-to-go，再假設每個狀態的 baseline 都是 2，計算 advantage 的符號。最後令 \(\epsilon=0.2\)，分別解釋 \(\hat A>0,r=1.4\) 與 \(\hat A<0,r=0.7\) 時 PPO clipping 做了什麼。

## 參考資料

- [CS229 Lecture Notes 第 21 章：策略梯度、REINFORCE 與 PPO（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=259)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)
