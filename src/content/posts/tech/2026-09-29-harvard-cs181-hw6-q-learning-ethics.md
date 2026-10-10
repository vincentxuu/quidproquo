---
title: "Harvard CS181 HW6（四）：Q-learning 玩 Swingy Monkey 與 Embedded EthiCS"
date: 2026-09-29
category: tech
tags: [harvard, cs181, q-learning, reinforcement-learning, ai-ethics, homework]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 14
type: guide
tldr: "HW6 Problem 3（20 分）要你寫一個表格式 Q-learning agent 玩類 Flappy Bird 的 Swingy Monkey，最低標準是 100 局內至少一次超過 50 分，還要再加一個自選的改進。Problem 5（10 分）是 250 字內的倫理題：假設社群平台的使用者政治立場愈來愈極端，用 RL 的概念解釋 reward 設計可能怎麼推了一把。"
description: "Harvard CS1810 Spring 2026 HW6 Problem 3 與 Problem 5 導讀：Swingy Monkey 的狀態、動作與遊戲程式裡實際的獎勵值，starter notebook 的三個 agent 類別與容易踩的坑，Q-learning 與 ε-greedy（對照 Lecture 22 與 Section 10），以及 Embedded Ethics 題的思考框架與存取限制。"
draft: false
glossary:
  - term: "Q-learning"
    aliases: ["Q 學習"]
    definition: "不需要環境模型的 RL 演算法：每走一步，就把 Q(s, a) 往「拿到的獎勵 + γ × 下一個狀態最好的 Q 值」拉近一點。因為目標用的是最好的下一步，而不是實際會走的下一步，所以是 off-policy。"
    context: "HW6 Problem 3 要你自己實作，不准用外部 RL 程式碼。"
  - term: "ε-greedy"
    aliases: ["epsilon-greedy"]
    definition: "以 1−ε 的機率選目前 Q 值最高的動作，以 ε 的機率隨機選，藉此在利用與探索之間取得平衡。"
    context: "題目特別推薦讓 ε 隨時間遞減。"
---

> 🌏 [English version](/en/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW6](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6)（`hw6_release.tex/pdf/ipynb`、`p3src/`，due 2026-05-01）、[Section 10 講義](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10.pdf)、2026 的 [Lecture 22](https://drive.google.com/file/d/1b2X1RZAH9bFtww-JYwQvUWwEC-poI05C/view) 與 [Lecture 23](https://drive.google.com/file/d/1TWidw3N7kYmN5Zr6SvJXVDEcK3xYbWRi/view) 投影片為準，全部於 2026-09-29 實際打開。投影片連結來自[官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)講題儲存格（xlsx 匯出才看得到）。本課整體為 **A3**，但 4 月 23 日的 Embedded EthiCS 講課在課表上只寫「see recording」，沒有公開連結，也找不到 2026 的講義或模組頁，這一堂是 **A0**：本篇不推測它講了什麼。

這是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)的第 14 篇。上一篇 [HW6（三）](/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning)在已知轉移機率的 Gridworld 裡做規劃。這篇拿掉「已知」：agent 只能邊玩邊學。

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [harvard-cs181 — official course materials and recording index](https://harvard-ml-courses.github.io/cs181-web/syllabus)

## 在學期裡的位置

依 [2026 官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)：

| 日期 | 內容 |
|---|---|
| 4 月 16 日（四） | Reinforcement Learning I（Lecture 22：從未知環境學習） |
| 4 月 17 日（五） | HW6 發布 |
| 4 月 21 日（二） | Reinforcement Learning II（Lecture 23：用 deep RL 放大）；Section 10 MDPs and RL |
| 4 月 23 日（四） | Embedded EthiCS（see recording） |
| 5 月 1 日（五） | HW6 截止 |

本篇涵蓋 HW6 的兩題：Problem 3 Reinforcement Learning（20 分）與 Problem 5 Embedded Ethics（10 分）。

## 從規劃到試錯

上一題你手上有 `get_transition_prob`，可以直接把 Bellman 方程裡的期望值算出來。[Lecture 22](https://drive.google.com/file/d/1b2X1RZAH9bFtww-JYwQvUWwEC-poI05C/view) 開頭就把這個前提拿掉：你被丟進一個世界，不知道規則，只能靠試錯。資料變成一連串的 `(s_t, a_t, r_t, s_{t+1})`。

投影片給了兩條路：先從經驗估出轉移模型再規劃（model-based），或跳過模型直接學價值函數（model-free）。Q-learning 屬於後者。[Section 10](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10.pdf) 說明為什麼要學 Q 而不是 V：沒有轉移模型時，光有 V 沒辦法比較不同動作會帶你去哪；有了 Q，直接取 `argmax_a Q(s, a)` 就好。

## Swingy Monkey：題目與程式碼各說了什麼

[題目](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex)用 2013 年爆紅的 *Flappy Bird* 開場。Swingy Monkey 裡你控制一隻猴子盪藤蔓、閃樹幹，每個時間步只有兩個動作：`0` 是順著藤蔓往下盪，`1` 是跳到新的藤蔓。

每一步 agent 會收到一個狀態字典，單位都是螢幕像素：

```text
{ 'score': <目前分數>,
  'tree':   { 'dist': <到下一根樹幹的距離>,
              'top':  <樹幹缺口的上緣高度>,
              'bot':  <樹幹缺口的下緣高度> },
  'monkey': { 'vel':  <猴子的垂直速度>,
              'top':  <猴子頂端高度>,
              'bot':  <猴子底端高度> } }
```

題目列了幾個隨機來源：跳躍高度不一、樹幹缺口的垂直位置不同、每局的重力不同、樹幹間距不同。打開 [`p3src/SwingyMonkeyNoAnimation.py`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/p3src/SwingyMonkeyNoAnimation.py) 可以看到具體設定：

| 項目 | 程式裡的值 |
|---|---|
| 重力 | 每局從 {1, 4} 隨機選一個 |
| 跳躍 | 初速從平均 15 的 Poisson 分布抽 |
| 通過一根樹幹 | 獎勵 +1 |
| 撞到樹幹 | 獎勵 −5，遊戲結束 |
| 掉出畫面底部或跳出頂部 | 獎勵 −10，遊戲結束 |
| 其他時間步 | 獎勵 0 |

題目文字裡有一句容易讀錯：「You get points for successfully passing tree trunks without hitting them, falling off the bottom of the screen, or jumping off the top.」照程式碼，出界是扣 10 分並結束遊戲，不是加分。

## Starter notebook 的結構

[`hw6_release.ipynb`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.ipynb) 的 Problem 3 段落有三個 agent 類別：

- **`RandomJumper`**：10% 機率跳的隨機 agent，拿來看介面。它已經示範了 `discretize_state`：把「到樹幹的水平距離」除以 200、「樹幹缺口上緣減猴子頂端」除以 100，取整數當作兩個格子索引。Q 表的形狀是 `(2, 1400 // 200, 900 // 100)`，也就是 2 個動作 × 7 × 9。
- **`Learner`**：你要寫的類別，`action_callback` 裡已經列好三步：離散化目前狀態、用上一步和這一步做 Q-learning 更新、用 ε-greedy 選下一個動作。
- **`GravityLearner`**：標註「more advanced agent, don't need this for full credit」。它已經寫好完整的 Q-learning 更新，並用第一個時間步猴子下落的距離推估這局的重力，把重力加進狀態。

最後的 `run_games(agent, hist, 100, 100)` 預設跑 100 局，每局結束後呼叫 `learner.reset()`，分數存進 `hist`。

**要求**分兩部分：

1. 自己實作 ε-greedy 的 Q-learning，調整學習率 α、折扣 γ、探索率 ε。不准用外部 RL 程式碼。
2. 再用一個自選的方法改進表現。題目舉的例子有：推估每局的重力、修改獎勵函數、讓 ε 遞減（題目特別推薦）、改狀態特徵。

最低標準是 **在第 100 局之前至少一次超過 50 分**。報告用一到兩段說明表現與決策理由，而且至少要附一張圖或表，比較不同參數的表現，例如不同參數下分數對局數的曲線。題目也提醒：把狀態和動作離散化再跑 Q-learning 就夠了，不需要神經網路。

## Q-learning 的更新，以及它跟 SARSA 差在哪

Section 10 與 Lecture 22 的更新式：

```text
Q(s, a) ← Q(s, a) + α · [ r + γ · max_{a'} Q(s', a') − Q(s, a) ]
```

Lecture 22 用同一個例子對照 SARSA 和 Q-learning：`γ = 0.9`、`α = 0.5`，在 `S1` 往上走、拿到 0、落在 `S2`；`Q(S2, Left) = 2`、`Q(S2, Right) = 10`、`Q(S1, Up) = 5`，而策略下一步會選 Left。

- SARSA 用實際會走的 Left：目標是 `0 + 0.9 × 2 = 1.8`，更新後 `Q(S1, Up) = 5 + 0.5 × (1.8 − 5) = 3.4`。
- Q-learning 用最好的下一步 Right：目標是 `0 + 0.9 × 10 = 9`，更新後 `Q(S1, Up) = 5 + 0.5 × (9 − 5) = 7`。

Section 10 的說法是：SARSA 學的是「我實際做的事值多少」，Q-learning 學的是「我下一步能做的最好的事值多少」，所以在適當條件下，就算 agent 一直在探索，Q-learning 仍然會收斂到最佳 Q 值。這個例子也是 Section 10 的 Exercise 3.3。

**ε 要怎麼設**：Lecture 22 說 ε-greedy 是最簡單的探索方法，但對「很久之後才有獎勵」的動作序列不太有效。常見做法是讓 ε 隨時間遞減：一開始設 1（純隨機探索），最後降到 0 或 0.01。

## 寫 `Learner` 時值得檢查的地方

以下是讀 starter code 時看到、值得自己驗證的細節，不是官方說明：

- **更新時機錯一步**：`action_callback` 被呼叫時，你拿到的是「新狀態」，而 `reward_callback` 給的是上一個動作的獎勵。所以更新的是 `Q[last_action][last_state]`，目標用的是這一步的新狀態。`GravityLearner` 的寫法可以參考。
- **遊戲結束那一步**：從 `SwingyMonkeyNoAnimation.py` 看，撞到樹幹或出界時，遊戲會先呼叫 `reward_callback` 給負獎勵，再呼叫一次 `action_callback`。這讓你有機會把最後一次懲罰更新進 Q 表。
- **`reset()` 要自己補**：`run_games` 每局結束都會呼叫 `learner.reset()`，但 `Learner` 模板裡沒有這個方法。照 `RandomJumper` 的寫法把 `last_state`、`last_action`、`last_reward` 清成 `None`，下一局第一步就要處理「還沒有上一步」的情況。
- **負的格子索引**：猴子頂端高於樹幹缺口上緣時，`rel_y` 會是負數。NumPy 的負索引不會報錯，而是從陣列尾端倒著取，可能讓兩個完全不同的狀態共用同一格。
- **最後一格程式碼**：`agent = RandomJumper()`、`agent = Learner()`、`agent = GravityLearner()` 三行都沒註解掉，照原樣執行時跑的是最後一行的 `GravityLearner`。
- **分數很吵**：重力、樹幹位置、跳躍高度都隨機，而且程式沒有固定亂數種子。比較參數時，每組多跑幾次再比較，比單跑一次可靠。
- **要看動畫**：預設匯入的是沒有動畫的 `SwingyMonkeyNoAnimation`，速度快很多；想看畫面改成匯入 `p3src.SwingyMonkey`。環境需要 `pygame`，[`requirements.txt`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/requirements.txt) 裡是 2.6.1 版。題目也附了助教 Q-learner 的[示範影片](https://youtu.be/xRD6xBQbauw)。

## 表格的極限

[Lecture 23](https://drive.google.com/file/d/1TWidw3N7kYmN5Zr6SvJXVDEcK3xYbWRi/view) 接著講表格法為什麼撐不住：狀態如果是一張相機影像，可能的狀態數比宇宙原子還多。解法是用神經網路近似 Q（DQN，加上 experience replay 與 target network），或直接最佳化策略（policy gradient、actor-critic）。Swingy Monkey 之所以能用表格，是因為你已經把連續的像素距離切成少數幾格。題目要你「改狀態特徵」時，其實就是在這個取捨上找位置：格子切得愈細，能表達的愈多，但每一格被走到的次數愈少，學得愈慢。

## Problem 5：Embedded Ethics（10 分）

題目要你在 **250 字以內**回答：Facebook、TikTok、X 這類社群平台大量使用強化學習，許多學者認為這些平台助長了政治極化，也就是有某種政治傾向的使用者，觀點隨時間愈來愈極端。假設某平台的使用者確實如此，用你學到的 RL，提出一個可能的解釋：平台選的 reward function 可能怎麼促成這個結果。題目說答案要看得出你認真想過社會技術脈絡，但不需要面面俱到。

題目開頭提到一堂「Fairness in Model Selection」的課。2026 課表上沒有這個名稱的講課，唯一的倫理講課是 4 月 23 日的「Embedded EthiCS – see recording」，而錄影沒有公開。

**可以用來搭框架的官方材料**（都來自課程本身的 RL 概念，不是這題的答案）：

- **reward 是代理指標**：平台真正在乎的是營收或長期使用，能量測的是點擊、停留時間、留言。2024 學期 [Lecture 21 的 scribe notes](https://harvard-ml-courses.github.io/cs181-web/static/lec21/21-scribe-notes.pdf) 有一段「Reward Design: Story in the World」正好在講這件事：停留時間與留言數被當成「有吸引力」的指標，而人們往往在令人不安或極端的貼文上停留更久、有爭議的貼文留言更多，於是更分化的內容被推上來。那是 2024 年的筆記，不代表 2026 課堂講過同樣的例子。
- **策略會改變狀態分布**：Section 10 在講 agent 與環境互動時寫道，策略的選擇會形塑未來狀態與獎勵的分布。在推薦系統裡，使用者的偏好本身就是狀態的一部分，而推薦這個動作會改變它。
- **折扣與長期目標**：γ 決定 agent 多在乎遠期的獎勵。一個 reward 只看當下互動的系統，跟一個會考慮使用者長期福祉的系統，學到的策略可能很不一樣。
- **探索與利用**：一直利用「目前看起來最能吸引你的內容」，就不會去試其他內容。

[Embedded EthiCS @ Harvard](https://embeddedethics.seas.harvard.edu/cs-181-spring-2023/) 的模組庫裡，CS 181 的模組頁列到 Spring 2023（主題是機器學習設計中的偏誤，用醫療演算法的種族偏誤當案例）。那是更早學期的模組，跟 2026 這題的 RL 與極化主題不同，只能當作了解這個計畫風格的參考。

## 延伸閱讀

站內從不同角度講同一批概念，不取代本篇：

- [CS221 Lecture 8：MDPs II：不知道轉移模型時如何學 Q 值](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning)
- [CS188 MDP 與強化學習：從 Value Iteration 到 Q-Learning](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning)
- [CMU 07-280 Lecture 22：不知道 Dynamics 時如何做 Q-learning](/posts/ai/2026-08-22-cmu-07280-lecture-22-reinforcement-learning)
- [Deep Reinforcement Learning：把 RLHF 放回強化學習的框架裡](/posts/ai/2026-08-16-cs230-deep-rl-and-rlhf)（CS230，接 Lecture 23 的 deep RL）

## 下一篇

HW6 是最後一份作業。下一篇 [期末檢核與系列收尾](/posts/tech/2026-09-29-harvard-cs181-final-checkpoint) 用官方的 final checklist 與練習題，把下半學期收斂起來。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS1810 Spring 2026 HW6 題目（hw6_release.tex）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex)
- [CS1810 Spring 2026 HW6 notebook（hw6_release.ipynb）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.ipynb)
- [HW6 Swingy Monkey 遊戲程式（p3src/）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6/p3src)
- [CS1810 2026 官方課表（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS1810 2026 Lecture 22：Reinforcement Learning 1 投影片](https://drive.google.com/file/d/1b2X1RZAH9bFtww-JYwQvUWwEC-poI05C/view)
- [CS1810 2026 Lecture 23：Reinforcement Learning 2 投影片](https://drive.google.com/file/d/1TWidw3N7kYmN5Zr6SvJXVDEcK3xYbWRi/view)
- [Section 10：Markov Decision Processes and Reinforcement Learning](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10.pdf)（[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10_soln.pdf)）
- [CS181 2024 Lecture 21 scribe notes（Reward Design）](https://harvard-ml-courses.github.io/cs181-web/static/lec21/21-scribe-notes.pdf)
- [Embedded EthiCS @ Harvard：CS 181 Spring 2023 模組](https://embeddedethics.seas.harvard.edu/cs-181-spring-2023/)
- [Sutton & Barto, 2018. Reinforcement Learning: An Introduction（第二版）](http://incompleteideas.net/book/RLbook2020.pdf)（課程 [Resources 頁](https://harvard-ml-courses.github.io/cs181-web/resources)列出）
