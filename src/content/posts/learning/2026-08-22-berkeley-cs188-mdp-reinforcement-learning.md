---
title: "CS188 MDP 與強化學習：從 Value Iteration 到 Q-Learning"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, reinforcement-learning, mdp, q-learning]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 4
tldr: "Lecture 9–12 與 Project 3 用同一個 Gridworld 對照已知模型的 value iteration、未知模型的 Q-learning，以及用 features 泛化的 approximate Q-learning。"
description: "Berkeley CS188 Spring 2026 MDP、value iteration、Q-learning 與 Project 3 的實作導讀。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning-en)

搜尋假設你能列出 successor；強化學習則要在不確定結果與延遲 reward 下學會行動。[Lecture 9–12](https://inst.eecs.berkeley.edu/~cs188/sp26/)先建立 MDP，再進入 RL；[Project 3](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj3/)依序實作 value iteration、Q-learning、epsilon-greedy 與 approximate Q-learning。

## 先分清 planning 和 learning

Value iteration 已知 transition 與 reward model，透過 Bellman update 計算 value；Q-learning 不需要先知道模型，而從 `(state, action, reward, nextState)` 經驗更新 Q-value。兩者最後都能導出 policy，但資訊來源不同。若把這條邊界弄混，公式只剩符號代換。

實作時特別檢查 synchronous update：某一輪的新 value 應全部由上一輪產生，而不是邊掃 state 邊使用剛更新的值。Q-learning 則要把 learning rate、discount 與 exploration 分開觀察；epsilon-greedy 的隨機動作是蒐集資訊，不是程式失控。

## 從 table 到 features

Tabular Q-learning 每個 state-action pair 各自學值，遇到大型 Pacman state space 很難泛化。Approximate Q-learning 把 Q-value 寫成 features 與 weights 的組合，讓相似情境共享經驗。先用 identity extractor 驗證它與 tabular 版本一致，再換成較有意義的 features，能把問題縮到「表示改變後，更新規則有沒有仍然成立」。

建議先在小 Gridworld 手算一次 Bellman update，再跑單一 autograder case；最後比較 training 關閉 exploration 前後的 policy。不要只看平均分數，要能指出 agent 為什麼選那個 action。

系列導航：[上一篇：CSP 與多代理搜尋](/posts/learning/2026-08-22-berkeley-cs188-csp-multi-agent)｜[下一篇：Bayes nets 與 Ghostbusters](/posts/learning/2026-08-22-berkeley-cs188-bayes-ghostbusters)

## 參考資料

- [CS188 textbook — MDPs](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html)
- [CS188 textbook — Reinforcement Learning](https://inst.eecs.berkeley.edu/~cs188/textbook/rl/rl.html)
- [CS188 Spring 2026 Project 3](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj3/)
