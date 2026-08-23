---
title: "CS188 CSP 與多代理搜尋：Minimax、Alpha-Beta、Expectimax 怎麼選"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, multi-agent, minimax, constraint-satisfaction]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 3
tldr: "Lecture 5–8 先用 CSP 練變數、限制與搜尋順序，再由 Project 2 實作 minimax、alpha-beta 與 expectimax；三者差別在對其他 agent 行為的假設。"
description: "Berkeley CS188 Spring 2026 的 CSP、game trees 與 Project 2 多代理 Pacman 自學導讀。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-csp-multi-agent-en)

[Lecture 5–8](https://inst.eecs.berkeley.edu/~cs188/sp26/)把兩類問題排在一起：CSP 用變數、domain 與 constraints 壓縮組合搜尋；game trees 則加入會回應你的其他 agent。[Project 2](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/)讓 Pacman 面對 ghosts，依序實作 reflex agent、minimax、alpha-beta pruning、expectimax 與 evaluation function。

## CSP：先縮小選擇，再進入對局

[官方 CSP 教材](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/csps.html)把問題寫成 variables、每個 variable 的 domain，以及限制可同時成立 assignment 的 constraints。最基本的 backtracking 每次替一個 variable 選值；ordering heuristics 決定先選哪個 variable、先試哪個 value，propagation 則在每次 assignment 後刪除已不可能的候選值。它們不改答案集合，而是避免走進早已能判定失敗的分支。

可執行的練習是先打開官方 Discussion 2 的 CSP worksheet：選一題，畫出前三層 backtracking tree；接著分別套用 minimum remaining values 與 forward checking，圈出因此不必展開的節點。對完官方 solution 後，再進 Project 2。這能把「搜尋順序」與「推論刪值」分開，而不是只記縮寫。

## 三個演算法其實是三種世界觀

Minimax 假設對手會選讓你最差的動作；alpha-beta 不改答案，只剪掉不可能影響決策的分支；expectimax 則以機率模型取代「永遠最壞」的對手。[官方 P2 規格](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/)甚至提醒，正確的 agent 在部分測試仍會輸——輸贏不是演算法正確性的單一證據。

實作時先定義一個完整 ply：P2 把 Pacman 一步加上所有 ghosts 的回應算成一層。若 depth 的意義弄錯，遞迴結構看似合理，展開數卻會完全不對。

## Evaluation function 是模型的一部分

搜尋深度有限時，leaf state 的評分就是 agent 看得到的世界。把距離、食物、ghost 危險與剩餘目標塞成一個分數並不難；難的是讓每一項都有一致尺度，並用固定亂數種子與多局測試分辨進步和運氣。

建議先在紙上畫一棵含兩個 ghosts 的小樹，標出 agent index 與 depth 何時更新，再寫 recursion。完成 minimax 後才加 pruning，最後只替換 ghost node 的聚合規則做 expectimax。這樣每一步都能對回一個清楚假設。

系列導航：[上一篇：搜尋與 heuristic](/posts/learning/2026-08-22-berkeley-cs188-search-heuristics)｜[下一篇：MDP 與強化學習](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning)

## 參考資料

- [CS188 Spring 2026 calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 textbook — CSPs](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/csps.html)
- [CS188 textbook — Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html)
- [CS188 Spring 2026 Project 2](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/)
