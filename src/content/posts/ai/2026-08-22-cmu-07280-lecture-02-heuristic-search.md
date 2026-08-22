---
title: "CMU 07-280 Lecture 2 導讀：從 UCS、Greedy 到 A* 的 heuristic search"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, search, a-star, algorithms]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 2
tldr: "Lecture 2 把搜尋拆成 problem、frontier 與 priority：UCS 看已付成本，Greedy 看估計剩餘成本，A* 用 `f=g+h` 合併兩者；tree 與 graph search 的最優條件並不相同。"
description: "完整導讀 CMU 07-280 Spring 2026 Heuristic Search：搜尋問題表示、tree／graph search、DFS、BFS、UCS、Greedy、A*、admissibility 與 consistency。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-02-heuristic-search-en)

這是 **CMU 07-280 Spring 2026 Lecture 2：Heuristic Search**。核心不在背五種演算法，而在看清它們如何用不同 priority 排同一個 frontier。搜尋結果的完整性、成本與記憶體需求，往往在「下一個展開誰」那一刻就決定了。

## 官方材料與讀取範圍

本文完整讀取 [inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec2_Heuristic_Search_inked.pdf)、[Search pre-reading](https://www.cs.cmu.edu/~07280/notes/search/search_prereading.html)、[Recitation 1 worksheet](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)及其[solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1_sol.pdf)，並核對 [HW1](https://www.cs.cmu.edu/~07280/assignments/hw1_blank.pdf)。沒有公開逐講錄影；inked slides 只代表投影片上的書寫痕跡，不等於逐字稿。

## 承上問題：表示完成後，下一步探索哪個狀態

Lecture 1 要求先寫清楚輸入與表示。Lecture 2 把一個 search problem 明確化為 initial state、actions、transition model、action cost 與 goal test。演算法操作的不是世界本身，而是由這些定義產生的 state-space graph。

同一個 state 可能經不同路徑抵達。**Tree search**把每條路徑當成不同 search node；**graph search**另存 explored set，避免重複展開 state。前者可能反覆繞圈，後者節省工作，卻必須小心「過早關閉」一個稍後能用更低成本抵達的 state。

## 完整概念脈絡：frontier priority 就是策略

共同骨架是：把起點放進 frontier，反覆取出一個 node；若到達目標就回傳路徑，否則產生 successors 再放回 frontier。差異只在 frontier 怎麼排序：

| 策略 | priority | 直覺 |
|---|---:|---|
| DFS | 最深或後進先出 | 沿一條路走到底 |
| BFS | depth | 先找步數最少的路 |
| UCS | `g(n)` | 先展開累積成本最低者 |
| Greedy | `h(n)` | 先看起來離目標最近者 |
| A* | `g(n)+h(n)` | 同時算已付與估計剩餘成本 |

`h(n)` 是 heuristic，估計從 node 到最近目標的剩餘成本。若 `h(n) ≤ h*(n)`，它是 **admissible**：不高估真正剩餘成本。A* tree search 因而不會讓次佳解在最優路徑之前「看起來更便宜」。

Graph search 還需要更強的 **consistency**：對每條 `n → n'`，滿足 `h(n) ≤ c(n,n') + h(n')`。它等價於沿路的 `f=g+h` 不下降，讓 state 首次從 priority queue 取出時，已經有最低成本路徑。Recitation solution 特別指出：admissible 不必然 consistent；課程版 A* graph search 只靠 admissibility 不能保證最優。

## 可重做的小例子：Greedy 為什麼會輸給 A*

考慮兩條從 `S` 到 `G` 的路：

```text
S --2--> A --2--> G
S --1--> B --10-> G
h(A)=2, h(B)=1, h(G)=0
```

Greedy 只比較 `h`，會先選 `B`，接著到 `G`，總成本 11。A* 在第一步比較：

```text
f(A)=g(A)+h(A)=2+2=4
f(B)=g(B)+h(B)=1+1=2
```

A* 也先展開 `B`，但此時 `G` 的 `f=11`；frontier 裡的 `A` 仍只有 4，所以 A* 會回頭展開 `A`，最後找到成本 4 的路。差別不是 A* 從不走錯方向，而是它不會因為「看起來近」就忘記已付成本。

## Recitation／HW 對應

Recitation 1 先要求把 Tower of Hanoi 寫成 search problem，再比較 admissible 與 consistent heuristics，最後逐步執行 DFS、BFS、UCS、Greedy 與 A*。Solution 的反例是本講最值得自己重畫的部分：尤其是「A* graph search 搭 admissible heuristic 是否必然 optimal」。

HW1 把同一能力移到帶方向與速度的導航狀態，要求分析 branching factor、dead ends、heuristic 是否高估，以及各策略可能回傳哪條路。這不是換皮套公式；方向與速度加入 state 後，原本只看幾何距離的 heuristic 可能失真。

## 延伸對照：heuristic 是額外知識，不是免費答案

BFS 與 UCS 不需要目標方向知識，代價是廣泛展開。Greedy 與 A* 把領域知識放進 `h`，搜尋效率因而取決於 heuristic 品質。`h=0` 使 A* 退化成 UCS；`h=h*` 則幾乎直接指出最優路，但計算 `h*` 本身通常就等於解完原問題。

Heuristic 設計的真正問題是：能否用比搜尋便宜的計算，提供足夠準確而且保留所需保證的下界。

## 今晚可以做的動作

1. 不看 solution，完成 Recitation 1 的 DFS、BFS、UCS、Greedy、A* explored order。
2. 為八數碼拼圖寫兩個 heuristic：錯位塊數與 Manhattan distance，逐一說明為何不高估。
3. 自畫一張 admissible 但 inconsistent 的三節點圖，再手跑課程版 A* graph search。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 2 — Heuristic Search, inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec2_Heuristic_Search_inked.pdf)
- [07-280 Search pre-reading](https://www.cs.cmu.edu/~07280/notes/search/search_prereading.html)
- [07-280 Spring 2026 Recitation 1](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
- [Recitation 1 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1_sol.pdf)
- [07-280 Spring 2026 Homework 1](https://www.cs.cmu.edu/~07280/assignments/hw1_blank.pdf)
