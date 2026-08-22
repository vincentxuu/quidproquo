---
title: "CS188 Bayes Nets 與 Ghostbusters：看不見 Ghost 時怎麼推論"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, bayesian-network, probabilistic-inference, particle-filter]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 5
tldr: "Lecture 13–18 與 Project 4 從 factor operations、variable elimination 走到 exact inference 與 particle filtering，讓 Pacman 用有雜訊的距離感測追蹤看不見的 ghosts。"
description: "Berkeley CS188 Spring 2026 Bayes nets、HMM、exact inference、particle filtering 與 Ghostbusters 專案導讀。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs188-bayes-ghostbusters-en)

[Lecture 13–18](https://inst.eecs.berkeley.edu/~cs188/sp26/)從 probability、Bayes nets、exact inference、sampling 一路進到 HMM 與 particle filtering。[Project 4 Ghostbusters](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/)把這些概念放進一個具體任務：Pacman 看不見 ghost，只拿得到帶雜訊的 Manhattan distance，要維護位置的 belief distribution 並追上目標。

## Factor 操作不是機械表格

Join factors 把相容資訊合起來，eliminate 則對不再需要的變數加總；variable elimination 的結果與順序密切相關。實作每一步都應先寫出「目前 factor 代表哪個條件分布」，再檢查 unconditioned／conditioned variables，而不是只對 dictionary key 做操作。

## Observe 與 elapse time 是兩種更新

收到 sensor reading 時，belief 依 likelihood 重新加權並 normalize；時間前進而沒有直接觀察時，則用 ghost movement model 推進分布。兩者交替，就是 filtering 的核心。[官方 P4 規格](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/)明載，若所有粒子權重變成零，particle filter 必須重新初始化，不能從空分布抽樣。

官方畫面會以亮暗呈現 posterior。這不只是視覺效果：寫完每個 update 後，先問「新證據應讓哪些格子變亮」「移動模型應把質量往哪裡推」，再看 autograder。能預測圖形方向，比只看到 test passed 更能證明理解。

## 自學順序

先手算一個兩變數 factor 的 join／eliminate，再做 exact inference；確認 belief 更新與 normalize 正確後，才進 particle filtering。最後讓 greedy BustersAgent 依各 ghost 最可能位置行動，觀察「最可能」與完整不確定性之間的取捨。

系列導航：[上一篇：MDP 與強化學習](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning)｜[下一篇：決策與機器學習](/posts/learning/2026-08-22-berkeley-cs188-machine-learning)

## 參考資料

- [CS188 textbook — Bayes Nets](https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/representation.html)
- [CS188 textbook — HMMs](https://inst.eecs.berkeley.edu/~cs188/textbook/hmms/markov.html)
- [CS188 Spring 2026 Project 4](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/)
