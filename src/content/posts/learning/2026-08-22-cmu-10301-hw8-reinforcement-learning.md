---
title: "CMU 10-301 HW8：從 MDP 到 Reinforcement Learning 更新規則"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, reinforcement-learning, mdp]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "HW8 把 state、action、reward、transition 與 value update 接起來，驗收你能否區分環境動態、policy 與估計誤差。"
description: "CMU 10-301/601 Spring 2026 HW8 Reinforcement Learning 的概念地圖與本機驗收策略。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 8 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw8-reinforcement-learning-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw8.zip) 完整題名是 **Homework 8: Reinforcement Learning**，屬於 written＋programming。Written 題組包含 synchronous/asynchronous value iteration、演算法比較與選擇、REINFORCE walkthrough、actor-critic/A2C 與 empirical questions；程式要在 Atari Pong 實作 policy/value networks、n-step returns、policy/value loss 與 A2C 訓練。ZIP 提供 `agent.py` starter、`environment.py`、`utils.py`、`test_runner.py` 與 `requirements.txt`；本次公開 bundle 未見 reference output，正式 hidden tests 仍在 Gradescope。

## 先把 MDP 元件分開

逐一寫出 state、action、reward、transition、discount 與 terminal condition。接著才推 Bellman target 或更新規則。最常見錯誤是把 terminal state 繼續 bootstrap、混淆即時 reward 與 return，或用 evaluation 的資料改變 policy。

## 第一個可執行動作與完成判準

先在 [bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw8.zip) 目錄建立環境並安裝明列依賴：

```bash
conda create -n HW8 python=3.12
conda activate HW8
pip install -r requirements.txt
```

先跑 `test_runner.py`，再嘗試 Pong training。完成判準是公開 tests 覆蓋的 network shapes、n-step return 與 loss 計算通過，固定 seed 能啟動並持續訓練，且 reward curve 與設定都有紀錄；沒有 reference output 與 hidden tests，不能以單次高分宣稱完成官方驗收。

## 參考資料
- [HW8 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw8.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
