---
title: "CS188 搜尋與 Heuristic：從 DFS、BFS 到 A* 的 Pacman 實作"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, search, heuristic, pacman]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 2
tldr: "Lecture 1–4 與 Project 1 把 DFS、BFS、UCS、A*、state representation 和 heuristic 串成同一套搜尋工具；關鍵不是背演算法，而是看清楚 frontier、cost 與 state 各自改變什麼。"
description: "以 Berkeley CS188 Spring 2026 Project 1 為主線，整理搜尋演算法、狀態表示、heuristic 設計與本機 autograder 的自學順序。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-search-heuristics-en)

CS188 的第一段用 Pacman 回答一個基本問題：在不知道答案路徑的情況下，agent 要依什麼順序展開可能狀態？[Lecture 1–4 的課表](https://inst.eecs.berkeley.edu/~cs188/sp26/)依序處理 agents、uninformed search、A* 與 local search；[Project 1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)則要求你實作 DFS、BFS、UCS、A*，再設計 corners 與 food search 的 heuristic。

## 先固定共同骨架

四種 graph search 都可以看成同一個迴圈：從 frontier 取出節點、檢查目標、展開 successor、避免重複狀態。DFS 與 BFS 改的是 frontier 順序；UCS 用累積成本排序；A* 再加入對剩餘成本的估計。若四份程式碼大量重複，通常代表共同抽象還沒看清楚。

## 最難的是 state，不是公式

P1 的 corners problem 刻意要求你不要把整個 `GameState` 當搜尋狀態。位置相同、已造訪角落不同的兩個局面，未來目標不同；ghost 或無關食物資訊又不該塞進 state。好的 state 只保存「會影響後續合法動作與目標判定」的資訊。

heuristic 則必須在速度與正確性間守住界線。[官方 P1 規格](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)要求 food heuristic 保持 consistent；一個看似聰明但高估或前後不一致的估計，可能讓 A* 失去保證。先做容易證明的 lower bound，再用 autograder 看展開節點數，不要反過來猜評分門檻。

## 建議操作順序

1. 不看程式，先寫出四種演算法的 frontier 規則。
2. 完成 DFS／BFS，確認相同迷宮因展開順序不同而走出不同路。
3. 完成 UCS／A*，分開檢查 path cost 與 heuristic。
4. 為 corners state 寫一句「此 tuple 足以預測什麼」。說不出來就先別寫 code。
5. 每次只跑一題或一個 test case；本機 autograder 是主要回饋，不需要 Gradescope。

完成 P1 後，真正該帶走的是三個問題：state 是否保留了必要資訊、frontier 代表什麼偏好、heuristic 是否只提供安全的方向感。這三問會一路回到後面的 MDP、Bayes nets 與 planning。

系列導航：[上一篇：課程總覽](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)｜[下一篇：CSP 與多代理搜尋](/posts/learning/2026-08-22-berkeley-cs188-csp-multi-agent)

## 參考資料

- [CS188 Spring 2026 course calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 textbook — Search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html)
- [CS188 Spring 2026 Project 1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)
