---
title: "CMU 07-280 Lecture 22：不知道 Dynamics 時如何做 Q-learning"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, reinforcement-learning, q-learning, temporal-difference]
lang: zh-TW
tldr: "第 22 講保留 MDP 骨架，拿掉已知 transition 與 reward 的假設；TD learning 用一步 sample 更新 value，Q-learning 再以 off-policy target 直接學最佳 action values。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 22：model-based/model-free RL、Monte Carlo、TD(0)、Q-learning 與 exploration。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 22
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-22-reinforcement-learning-en)

Lecture 21 可以對所有 successor states 做 expectation，因為 `P` 與 `R` 已知。**CMU 07-280 Spring 2026 Lecture 22** 拿掉這項特權：agent 只能採取 action、看到 reward 與 next state，再從 samples 學習。官方題目就是 *Reinforcement Learning*。

## 官方材料與讀取範圍

本文完整讀取 [Lecture 22 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec22_RL.pdf)、[Recitation 12](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12_sol.pdf)，並檢查公開的 [RL programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/)。官方頁沒有 Spring 2026 逐講公開錄影，本文只依公開 slides、recitation 與程式骨架說明。

Programming directory 可匿名查看部分 code，但 Gradescope tests、submission 與助教回饋不公開；「程式碼可見」不等同「作業完整可評分」。

## 承上問題：Bellman expectation 裡的 `P` 從哪裡來

Known MDP 可以離線做 value／policy iteration。未知環境下有兩條路：

- **model-based**：從 samples 估計 transition `T(s,a,s')` 與 reward `R(s,a,s')`，再解估計出的 MDP；
- **model-free**：不顯式重建 `T,R`，直接從 experience 學 value 或 Q-value。

Passive RL 固定 policy，只評估它；active RL 還要改善 policy。另一條獨立軸是 on-policy／off-policy：更新 target 使用目前 behavior policy 的 action，或使用另一個目標 policy（例如 greedy best action）。

## 完整概念脈絡：從完整 return 到一步 TD target

Monte Carlo evaluation 等 episode 結束，用實際 cumulative return 更新 encountered states。它不需要 model，卻必須等到完整結果，variance 也可能很高。

Temporal Difference `TD(0)` 不等 episode 結束。觀察 transition `(s,r,s')` 後，用目前估計 bootstrap：

\[
V(s)\leftarrow V(s)+\alpha
\underbrace{[r+\gamma V(s')-V(s)]}_{\text{TD error}}.
\]

Q-learning 把 value 擴成 state-action pairs，並用下一 state 的最佳 action 當 target：

\[
Q(s,a)\leftarrow Q(s,a)+\alpha
[r+\gamma\max_{a'}Q(s',a')-Q(s,a)].
\]

它是 off-policy：behavior 可以用 exploration 收集資料，target 仍朝 greedy policy。若永遠只取目前 `argmax`，未試過的 action 永遠沒有資料，因此投影片加入 exploration function，實務上常用 `ε`-greedy：大多利用目前最佳 action，少部分隨機探索。

## 可重做小例子：一筆 transition 的 Q update

假設目前：

```text
Q(s, left) = 1.0
Q(s', up) = 2.0
Q(s', right) = 3.0
r = 0.5, gamma = 0.9, alpha = 0.2
```

Q-learning target 是：

\[
y=0.5+0.9\max(2,3)=3.2.
\]

TD error 是 `3.2-1.0=2.2`，所以：

\[
Q_{new}(s,left)=1.0+0.2(2.2)=1.44.
\]

同一 transition 重複更新時，target 也會隨 successor Q-values 改變。這是 bootstrapping 的力量與風險：不用等 episode 結束，但正在追逐由自己估計出的 target。

比較 SARSA 可以看出 off-policy 差異。若 behavior 在 `s'` 因探索實際選 `up`，SARSA target 是 `0.5+0.9(2)=2.3`；Q-learning 仍用 greedy `right` 的 `3.0`。兩者回答的不是同一個 policy evaluation 問題。

## Recitation／HW 對應

Recitation 12 先要求指出 MDP 到 RL 少了哪些資訊，再計算 TD 與 Q-learning updates，最後區分 model-based/model-free、passive/active、on/off-policy。這種分類不是背名詞；它決定 target 用哪個 action、資料從哪個 policy 來。

RL programming assignment 提供 Gridworld 與 Q-learning agent 骨架，要求實作 `getQValue`、`computeValueFromQValues`、`computeActionFromQValues`、`update` 與 exploration behavior。自學時最值得保留的是把 policy extraction 與 learning update 分開測試；正式 autograder 不公開，需自行寫 deterministic toy cases。

## 延伸對照：sampling error 與 planning error

Value iteration 的誤差來自有限 iterations 或 state approximation；tabular Q-learning 還多了 sampling noise 與 exploration coverage。若某 action 幾乎沒被訪問，`Q` 不可靠不是因 Bellman equation 錯，而是資料不足。

Tabular Q-learning 也假設每個 `(s,a)` 都能存一格。Pac-Man、影像或連續控制不可能窮舉；Lecture 23 會用 `Q_θ(s,a)` 讓不同 states 共享 features。那一步會再加入 approximation 與 optimization error。

## 今晚可做動作

建立兩個 states、兩個 actions 的 deterministic MDP，列出真實 optimal Q-table。用固定 transition sequence 手算前三次 Q-learning，再寫程式比對。之後打開 `ε=0.2` 跑 1,000 steps，分別記錄每個 action 的 visit count 與 Q error；不要只看最後 cumulative reward。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 22 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec22_RL.pdf)
- [CMU 07-280 Recitation 12](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12.pdf)
- [CMU 07-280 Recitation 12 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12_sol.pdf)
- [CMU 07-280 reinforcement-learning programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
