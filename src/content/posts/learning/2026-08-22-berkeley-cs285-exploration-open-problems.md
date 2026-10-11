---
title: "Berkeley CS285 L19–25：探索、RL 理論、多任務學習與開放問題"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, exploration, reinforcement-learning, multi-task-learning]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "最後七講從 exploration 與理論界線，經兩講期中複習，走到 advanced exploration、multi-task RL 與仍未解決的研究問題。"
description: "導讀 CS285 Spring 2026 第 19–25 講，整理探索、理論、複習、多任務學習與開放問題。"
series:
  name: "Berkeley CS285 Spring 2026 導讀"
  order: 5
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

[官方 agenda](https://rail.eecs.berkeley.edu/deeprlcourse/)最後七講是 Exploration、RL Theory、兩講 Midterm Review、Advanced Exploration、Multi-task RL，以及 Challenges and Open Problems。這不是零散收尾，而是回頭問前面演算法在哪些條件下可靠，以及面對新任務時能不能重用經驗。

## 課程影片來源

2026-10-10 即時核對：講師已把 Spring 2026 講課錄影公開在 RAIL 的 YouTube 頻道（播放清單「CS 185/285: Deep Reinforcement Learning (Spring 2026)」，27 支，2026-08-15 起公開）。講次編號與官方投影片清單一致，這些錄影對應本文涵蓋的講次。課程 syllabus 仍寫錄影在 bCourses、課站也仍連到 Fall 2023 播放清單，但觀看這些錄影不需要它們。此處嵌入其中兩講，其餘請見播放清單。

```youtube
url: https://www.youtube.com/watch?v=tHq2gcdtumQ
title: CS 185/285 (Spring 2026): Lecture 19, Exploration
```

```youtube
url: https://www.youtube.com/watch?v=TjnD0sY4e0Y
title: CS 185/285 (Spring 2026): Lecture 25, Challenges and Open Problems
```

原始影片：[CS 185/285 (Spring 2026): Lecture 19, Exploration](https://www.youtube.com/watch?v=tHq2gcdtumQ)、[CS 185/285 (Spring 2026): Lecture 25, Challenges and Open Problems](https://www.youtube.com/watch?v=TjnD0sY4e0Y)

課程與錄影入口：

- [官方課程與錄影入口](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：Lecture 19 字幕開場是期中考行政說明與「這週是考試範圍內最後的新內容：exploration 與 RL theory」，接著講 exploration，內容有 multi-armed bandit、相對最佳貝氏策略的 regret、以及用 state 密度估計做 exploration bonus；字幕沒有 UCB、Thompson sampling 之類具名方法的明確討論，RL Theory 屬下一講。Lecture 25 字幕是回顧性、非深度技術的一講（講者明說），整理整學期內容與看法，並預告客座講者；與本文把它當「開放問題」的定位相符。本文 L21–24 與「research memo」等建議為本站整理，非影片內容。

## L19–20：探索與保證

Exploration 處理短期 reward 與資訊價值的衝突；RL Theory 則把直覺轉成假設、樣本需求與 regret／performance 的界線。讀投影片時，把每個結論旁邊補上成立條件。少了 tabular、coverage、realizability 等條件，保證很容易被誤用到深度 RL 實務。

## L21–22：複習也是診斷

兩講 Midterm Review 應該用來閉卷重建課程，而不是再看一次摘要。拿白紙畫出 imitation learning、policy gradient、actor-critic、Q-learning、control as inference、model-based 與 offline RL 的關係；每條連線寫出「解決的問題」與「新引入的風險」。

## L23–24：更難的探索與跨任務重用

Advanced Exploration 延伸到稀疏 reward 與表示層面的資訊取得。Multi-task RL 則問多個 task 能否共享 representation、policy 或資料。自學動作很具體：挑前面做過的一個環境，改變 reward 或 dynamics，觀察原 policy 是直接遷移、微調後恢復，還是完全失敗。

## L25：把「open problem」寫成可測試問題

最後一講應產出一頁 research memo：問題、現有方法、核心假設、失敗案例、最小實驗。不要只寫「sample efficiency 很重要」；改寫成可量測的問題，例如固定互動 budget 時，某種 representation 是否讓兩個新 task 的回報更快上升。

當期講課錄影可在 RAIL YouTube 頻道的 2026 播放清單觀看（[Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/) 尚未更新，仍寫在 bCourses）。若使用[官方 resources 頁](https://rail.eecs.berkeley.edu/deeprlcourse/resources/)列出的 Fall 2023 等歷史影片補概念，筆記要明示年份，並以 2026 投影片題目為準。完整存取邊界見[系列總覽](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。在 RAIL 頻道找到公開的 Spring 2026 CS 185/285 播放清單，嵌入兩講對應錄影，狀態由僅附官方入口改為已附影片。
- 2026-10-10：修正過時的錄影說法。「錄影在 bCourses」改寫為講課錄影可在 RAIL YouTube 頻道觀看。
- 2026-10-10：依字幕核對影片內容。確認兩支影片就是 Lecture 19 與 25，主題與本文相符；補註 L19 只涵蓋 exploration（theory 在下一講）。

## 參考資料

- [CS185/285 Spring 2026 官方課站](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS185/285 Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- [官方 resources 與歷史版本](https://rail.eecs.berkeley.edu/deeprlcourse/resources/)
