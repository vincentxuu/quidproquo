---
title: "CMU 07-280 Lecture 21：Bellman Equation 如何解 Markov Decision Process"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, reinforcement-learning, markov-decision-process, dynamic-programming]
lang: zh-TW
tldr: "第 21 講把隨機序列決策寫成已知 dynamics 的 MDP，以 Bellman backup 定義 value 與 Q-value，再用 value iteration 或 policy iteration 求最佳 policy。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 21：MDP 組件、Markov property、discounted return、Bellman updates、value iteration 與 policy iteration。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 21
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-21-markov-decision-processes-en)

**CMU 07-280 Spring 2026 Lecture 21** 從「預測下一 token」切換到「選一連串 actions」。官方題目是 *Markov Decision Processes*。本講的關鍵限制很重要：transition probabilities 與 rewards 已知；問題是如何規劃，而不是如何從互動資料學出環境。

## 官方材料與讀取範圍

本文完整讀取 [Lecture 21 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec21_MDPs.pdf)、[MDP pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MDPs.pdf)、[Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf)，並核對 [HW11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) 的 racing problem。官方頁沒有 Spring 2026 逐講公開錄影，本文不虛構課堂口述。

## 承上問題：expectimax tree 會無限展開

Adversarial search 已經出現 chance nodes 與 expected value。若 agent 每一步都可能以不同機率抵達新 state，並且 horizon 很長，直接畫完整 expectimax tree 會重複遇到相同 states，也可能無限展開。

MDP 把重複結構壓成 state graph。標準組件是 states `S`、actions `A`、transition function `P(s'|s,a)`、reward `R(s,a,s')`，以及可能的 terminal states。Policy `π(s)` 指定每個 state 要採取的 action。

Markov property 的意思不是「歷史不存在」，而是 state 已包含預測未來所需資訊：給定現在 state，未來與更早歷史條件獨立。若 state representation 漏掉速度、庫存或對手資訊，問題本身可能不再 Markov。

## 完整概念脈絡：value、Q-value 與 Bellman backup

在 policy `π` 下，state value 是從 `s` 出發的 expected discounted return：

\[
V^\pi(s)=\mathbb E_\pi\left[\sum_{t=0}^{\infty}\gamma^t r_t\mid s_0=s\right].
\]

Discount `0≤γ<1` 讓遠期 reward 權重遞減，也使無限 horizon sum 在 bounded rewards 下收斂。Optimal value 滿足 Bellman optimality equation：

\[
V^*(s)=\max_a\sum_{s'}P(s'\mid s,a)
\left[R(s,a,s')+\gamma V^*(s')\right].
\]

括號裡是「立即 reward + 下一 state 的 discounted value」。`Q*(s,a)` 把第一個 action 固定：

\[
Q^*(s,a)=\sum_{s'}P(s'\mid s,a)
[R(s,a,s')+\gamma\max_{a'}Q^*(s',a')].
\]

Value iteration 從任意 `V_0` 反覆做 Bellman optimality backup，收斂後抽取 greedy policy。Policy iteration 則交替做 policy evaluation 與 policy improvement：先算目前 policy 的 value，再對每個 state 改成 one-step lookahead 最佳 action。

## 可重做推導：要現在領 2，還是冒險領 5

考慮單一非終止 state `s`，兩個 actions：

- `Stop`：直接進 terminal，reward `2`；
- `Try`：一半機率進 terminal 得 `5`，一半機率回到 `s` 得 `0`。

令 `γ=0.9`。若選 `Try`，Bellman action value 是：

\[
Q(s,Try)=0.5(5)+0.5(0+0.9V(s))=2.5+0.45V(s).
\]

`Stop` 的 value 是 `2`。假設最佳 action 是 `Try`，解 fixed point：

\[
V(s)=2.5+0.45V(s)
\Rightarrow 0.55V(s)=2.5
\Rightarrow V(s)\approx4.545.
\]

結果確實大於 `2`，所以假設自洽，最佳 policy 選 `Try`。這個推導也顯示為何不能只比較 immediate reward：回到相同 state 的 future value 必須一起算。

若從 `V_0(s)=0` 做 value iteration，`V_1=2.5`、`V_2=3.625`、`V_3≈4.131`，逐步靠近 fixed point。每次 backup 都相當於把可見 horizon 往後推一層。

## Recitation／HW 對應

Recitation 11 用 racing car MDP 要求寫出 transition、reward、discount 影響，並做 policy iteration。HW11 把同一問題正式列入 written homework：states 是 `{0,2,3,4,5,Done}`，`Move` 會隨機前進，`Stop` 取得當前位置 reward；學生要做四輪 value iteration、抽取 optimal policy，再改變 `γ`。

這個對應很精準：投影片給演算法，recitation 先拆 state table，homework 要學生完成數值。公開 PDF 能讓自學者重做題目；Gradescope submission、批改與回饋仍受限。

## 延伸對照：MDP planning 還不是 reinforcement learning

本講的 value iteration 需要完整 `P` 與 `R`。若 agent 不知道 action 會帶去哪裡，也不知道 reward distribution，就不能直接做這個 expectation sum。Lecture 22 才把 model 換成 samples，進入 reinforcement learning。

另一個限制是 state space。即使 dynamics 已知，state 太多也無法保存每個 `V(s)`。Lecture 23 會用 features 與 function approximation 處理這個問題。先把「model unknown」與「state too large」分開，後面才不會把所有困難都模糊叫成 RL。

## 今晚可做動作

把上面的 `Stop/Try` MDP 寫成五行迴圈，從 `V_0=0` 做二十次 value iteration。改測 `γ=0,0.5,0.9`，記錄收斂值與 greedy action。然後刻意把「是否已嘗試過」設成會影響 transition、卻不放進 state，觀察 Markov assumption 為何失效。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 21 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec21_MDPs.pdf)
- [CMU 07-280 MDP pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MDPs.pdf)
- [CMU 07-280 Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf)
- [CMU 07-280 Recitation 11 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
