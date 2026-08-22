---
title: "強化學習：MDP、價值迭代與連續狀態"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, reinforcement-learning, mdp, value-iteration, fitted-value-iteration]
lang: zh-TW
tldr: "第 19 章用 Bellman 方程把長期決策拆成一步更新，並從已知 MDP 的 value iteration 走到模型學習與連續狀態近似。"
description: "導讀 CS229 2026 主講義第 19 章：從 MDP 與 Bellman 方程，到價值迭代、模型學習與連續狀態近似。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 20
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 19 章（印刷頁 227–243）。這是 2026 notes 的逐章導讀，不是任何學期錄影重建；本文整理決策問題的數學骨架與近似方法，不逐一複製全部證明。

## MDP 把延遲後果放進模型

Markov decision process（MDP）由狀態集合 \(S\)、動作集合 \(A\)、轉移機率 \(P_{sa}\)、折扣 \(\gamma\) 與 reward \(R\) 組成。Markov 假設表示：給定目前狀態與動作，下一狀態不再依賴更早歷史。

策略 \(\pi\) 下的價值函數為

\[
V^\pi(s)=\mathbb{E}\left[\sum_{t=0}^{\infty}\gamma^t R(s_t,a_t)\mid s_0=s,\pi\right].
\]

折扣 \(0\le\gamma<1\) 同時表達遠期 reward 權重，也讓無限和與 Bellman operator 的收斂性更容易處理。

## Bellman 方程與兩種迭代

最優價值滿足

\[
V^*(s)=\max_a\left[R(s,a)+\gamma\sum_{s'}P_{sa}(s')V^*(s')\right].
\]

value iteration 反覆套用右側 backup，直到價值穩定，再選出使括號最大的動作。policy iteration 則交替進行 policy evaluation 與 policy improvement：先算目前策略的價值，再對每個狀態改選更好的動作。

兩者都依賴已知模型與可列舉狀態。若轉移未知，可用觀測次數估計 \(P_{sa}(s')\)，用樣本平均估計 reward，再對學得的 MDP 規劃。但只照現行策略收資料會看不到其他動作的結果，因此探索不是附加功能，而是模型辨識的一部分。

## 連續狀態為何需要近似

每一維切成 \(k\) 格、共有 \(d\) 維時，網格有 \(k^d\) 個狀態；這就是維度災難。粗略離散化還會把同一格內的狀態視為相同，製造 piecewise-constant 決策。

一條路是直接學動態，例如

\[
s_{t+1}=As_t+Ba_t+\epsilon_t,
\]

再用模型規劃。另一條路是 fitted value iteration，以 \(V_\theta(s)=\theta^\top\phi(s)\) 近似價值：抽樣狀態與下一狀態、計算 Bellman target，再把 target 回歸到特徵。它把動態規劃轉成反覆的監督式學習，但函數近似、抽樣分布與 bootstrap target 彼此作用，不能沿用有限表格 value iteration 的普遍收斂保證。

## 假設與失效點

- 狀態若沒有包含預測未來所需資訊，Markov 假設就失敗。
- 學得模型的微小偏差會在長期規劃中累積。
- 只利用不探索，可能把「沒看過」誤當成「不好」。
- 離散化受 \(k^d\) 爆炸限制；函數近似則引入表示偏差與訓練不穩定。
- reward 定義的是最佳化目標，不保證等同真正需求。

## 與相鄰章節的銜接

第 18 章把 LLM token 生成視為有限期 MDP，直接最佳化 policy。第 19 章補上 value-based 的完整語言；下一章將在連續狀態與動作下加入線性動態、二次 reward 與高斯噪音，得到可精確求解的 LQR/LQG。

## 練習

為一個含位置與速度的簡化平衡車寫出 \(S,A,P,R,\gamma\)。比較每維各切 20 格的離散化狀態數，與使用十個 basis functions 的線性價值近似。指出兩者各自最可能遺失的資訊。

## 參考資料

- [CS229 Lecture Notes 第 19 章：強化學習、MDP 與價值迭代（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=228)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)
