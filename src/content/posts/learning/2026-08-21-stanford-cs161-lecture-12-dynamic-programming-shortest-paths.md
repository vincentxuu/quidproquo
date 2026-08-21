---
title: "Stanford CS161 Lecture 12：用動態規劃重寫 Bellman–Ford 與 Floyd–Warshall"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, dynamic-programming, shortest-path]
lang: zh-TW
type: deep-dive
description: "逐段拆解 Stanford CS161 Winter 2026 第 12 講：從 Bellman–Ford 的分層狀態理解動態規劃，再推導 Floyd–Warshall 全點對最短路徑。"
tldr: "動態規劃先精確定義子問題，再用 optimal substructure 寫 recurrence，最後依相依順序填表；Bellman–Ford 以 edge 數分層，Floyd–Warshall 則以允許的中繼頂點分層。"
draft: false
series:
  name: "Stanford CS161 導讀"
  order: 13
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-12-dynamic-programming-shortest-paths-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)第 13 篇，對應 **Stanford CS161, Winter 2026, Lecture 12**。官方課名是 **Dynamic Programming: Bellman-Ford and Floyd-Warshall**，上課日期為 2026 年 2 月 18 日，講師是 Ellen Vitercik。

本文依照[官方 Lecture 12 頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-12-dynamic-programming-bellman-ford-and-floyd-warshall)、公開 notes 與 slides PDF 整理。Canvas-only 錄影未作為來源。Lecture 11 從 relaxation 與權重條件比較 Dijkstra、Bellman–Ford；這一講刻意重訪 Bellman–Ford，但重點換成「狀態、遞迴式、填表順序」，再把同一套方法推到 all-pairs shortest paths。

## Bellman–Ford 其實已經是一張 DP 表

給定 weighted directed graph `G=(V,E)`、`n=|V|`、`m=|E|` 與 source `s`。定義：

```text
d^(k)[v] = 從 s 到 v、最多使用 k 條 edges 的最短 path 成本
```

這個 state definition 比程式碼重要，因為 recurrence 與 correctness 都從它長出來。Base layer 不准用 edge：

```text
d^(0)[s] = 0
d^(0)[v] = ∞，v ≠ s
```

要算第 k 層，任一符合限制的最佳 s→v path 只有兩種情況。它可以根本沒用滿 k 條 edges，此時答案已在 `d^(k-1)[v]`；也可以把最後一條 edge `(u,v)` 拿掉，剩下的是最多 k−1 條 edges 的 s→u path。因此：

```text
d^(k)[v] = min(
  d^(k-1)[v],
  min over (u,v) in E of d^(k-1)[u] + w(u,v)
)
```

實作時，每 round 先複製 previous array，再掃過所有 edges：

```text
previous[s] = 0; previous[v != s] = infinity

for k = 1 to n - 1:
    current = copy(previous)
    for each edge (u, v):
        current[v] = min(current[v], previous[u] + w(u, v))
    previous = current
```

這個版本故意讓右側全讀 previous layer。它和「原地反覆 relax」可能得到同樣的最終結果，但分層版本的 state meaning 最乾淨，也直接提供 induction proof。對 k 做歸納：base case 正確；第 k 層的最佳 path 若少於 k 條 edges，就由第一項涵蓋，若正好新增最後一條 `(u,v)`，其 prefix 必須是該限制下的最佳 subpath，否則替換 prefix 便能得到更便宜的整條 path，和最佳性矛盾。

若 source 可達範圍內沒有 negative cycle，最短 path 可以取成 simple path；重複 vertex 形成的非負 cycle 可刪除而不變差。Simple path 最多 `n-1` 條 edges，所以 `d^(n-1)` 已是所有 shortest distances。每一層掃 m 條 edges，共 n−1 層，時間為 `O(nm)`；recurrence 只依賴相鄰兩層，若只求 distances，兩個長度 n 的 arrays 即可把額外空間壓到 `O(n)`。

再做一個 round 便能檢查負環：若第 n 輪仍有值變小，就存在 source 可達的 negative cycle。限制很重要：它不會報告 source 根本到不了的負環；而只要可達負環存在，沿著該 cycle 多繞幾次便能讓成本無限下降，「有限的 shortest distance」也就不存在。

## 什麼才叫動態規劃

投影片從 Bellman–Ford 抽出兩個條件。第一是 **optimal substructure**：大問題的最佳解能由較小問題的最佳解組成。第二是 **overlapping subproblems**：不同大問題反覆需要同一批小問題。如果只有前者而沒有後者，recurrence 仍可能正確，卻不一定值得建 table；DP 的效率正來自「每個 state 只算一次，之後重用」。

課堂給出的實作 recipe 可整理成三步：

1. 定義 subproblems，精確說清楚每個 state 代表什麼，以及 optimal solution 為何能拆成這些 state。
2. 寫出 recurrence 與 base cases，涵蓋最佳解所有互斥可能。
3. 按 dependencies 已經算好的順序填表；或用 memoized recursion，只在第一次遇到 state 時展開。

這裡不能把「先寫一個看起來像 recurrence 的公式」當成第一步。Bellman–Ford 的 k 是 edge 數限制；稍後 Floyd–Warshall 的 k 是允許的 intermediate vertex label。兩個表都以 k 分層，但 state 不同，證明也不可以混用。

## Fibonacci：重複子問題為何會爆炸

Slides 用 Fibonacci 做最小示範：

```text
Fib(n) = Fib(n-1) + Fib(n-2)
Fib(0) = 0, Fib(1) = 1
```

直接遞迴會在 `Fib(n-1)` 與 `Fib(n-2)` 的兩棵子樹中重算大量相同 state，例如 `Fib(n-2)`、`Fib(n-3)`。呼叫樹的成長至少具有 Fibonacci 式的指數成長，因此不是「公式短就有效率」。Bottom-up 版本從 base cases 向上填：

```text
F[0] = 0; F[1] = 1
for i = 2 to n:
    F[i] = F[i-1] + F[i-2]
```

每個 index 做一次 constant work，時間 `O(n)`、table 空間 `O(n)`。若只要最後數值，因為每格只讀前兩格，還能壓成常數個 slots；不過官方 deck 使用完整 array 來凸顯 tabulation。

Top-down memoization 則保留原本遞迴形狀：進入 `Fib(i)` 先查 memo，只有尚未計算時才遞迴並保存。就可計算的 state 與漸進時間而言，兩者等價；工程上仍有差別：top-down 可能只訪問真正需要的 states，但有 recursion stack 與函式呼叫成本；bottom-up 沒有遞迴深度問題，卻可能填到不會被查詢的 cells。課堂的核心不是偏好其中一派，而是 dependencies 必須清楚。

## 從 SSSP 轉向 APSP

Floyd–Warshall 解的是 all-pairs shortest paths（APSP）：對每個 ordered pair `(u,v)` 求最短距離，而不是固定單一 source。演算法允許 negative edges，但前提仍是沒有 negative cycles；否則受影響 pair 的最佳成本可無限下降。

先把 vertices 編號 `1,2,...,n`，定義：

```text
D^(k)[u,v] = 從 u 到 v、所有 intermediate vertices
             都只能來自 {1,...,k} 的最短 path 成本
```

`u`、`v` 是 endpoints，不受集合限制；intermediate vertex 是 path 內部、排除兩端的 vertex。Base layer `k=0` 不允許任何中繼點：

```text
D^(0)[u,u] = 0
D^(0)[u,v] = w(u,v)  if (u,v) is an edge
D^(0)[u,v] = ∞       otherwise
```

若有平行 edges，初始化應取其中最小 weight。第 k 層問一個二選一問題：最佳 u→v path 是否使用 vertex k 作為中繼點？若不用，答案是 `D^(k-1)[u,v]`；若使用，在沒有負環時可選 simple optimal path，k 不必重複出現，於是能在 k 切成 u→k 與 k→v 兩段，兩段的內部 vertices 都只來自 `{1,...,k-1}`：

```text
D^(k)[u,v] = min(
  D^(k-1)[u,v],
  D^(k-1)[u,k] + D^(k-1)[k,v]
)
```

注意右側三格全是 `k-1` 層。寫成 `D^(k)[u,k] + D^(k)[k,v]` 就不再是課堂證明所依賴的 clean previous-layer recurrence；若要做 in-place update，必須另外論證更新順序安全，不能只憑「通常程式都這樣寫」跳過理由。

## Floyd–Warshall 的正確性

對 k induction。`k=0` 時，沒有 intermediate vertex 的 u→v path 只能是空 path（u=v）或一條 direct edge，初始化正確。假設第 k−1 層都符合定義，考慮第 k 層的一條最佳 path P：

- 若 P 不含 k，所有中繼點皆在 `{1,...,k-1}`，其成本由第一項完整代表。
- 若 P 含 k，把 P 在 k 切開。u→k 與 k→v 的中繼點都在 `{1,...,k-1}`；依 optimal substructure，兩段可各自取對應 state 的最佳解，成本由第二項代表。

Recurrence 在兩個互斥情況取較小者，正好得到 state definition 所要求的最佳成本。當 `k=n`，所有 vertices 都可當中繼點，`D^(n)` 就覆蓋所有 pair。

這個 proof 借用了「可取 simple optimal path」。若有 negative cycle，path 可以反覆繞行而沒有最小值，切一次 k 的描述便不再對應 well-defined shortest path。Floyd–Warshall 仍可偵測這種情況：若某個 `D^(n)[v,v] < 0`，表示存在從 v 回到 v 的負成本 closed walk，其中必含 negative cycle；反過來，若有 negative cycle，cycle 上某個 v 的 diagonal 也會變負。

## 複雜度、空間與選擇界線

Floyd–Warshall 有 n 個 layers，每層計算 n² 個 ordered pairs，每格只做一次加法與比較，所以時間 `O(n³)`。完整概念表有 n³ cells，但 recurrence 只讀前一層，保存兩個 `n×n` matrices 即可，空間 `O(n²)`。若還要還原 paths，可另存 predecessor 或 split-point matrix；距離表本身不會自動告訴你實際路徑。

這不表示 APSP 一律該用 Floyd–Warshall。對 nonnegative weights，可以從每個 source 跑一次 Dijkstra；使用合適 priority queue 時，總成本可寫成 `O(nm+n² log n)`，sparse graph 往往更合適。Floyd–Warshall 的優點是 recurrence 簡潔、dense worst case 為 cubic，且能處理 negative edges；Bellman–Ford 則是 single-source、`O(nm)`，並能辨識 source 可達負環。演算法名稱相近的「shortest paths」問題，仍要先分清 single-source/all-pairs、sparse/dense、是否有負權與是否需要還原 path。

## 為什麼不能照抄成 longest simple path

官方 notes 用 longest simple path 提醒：有 recurrence 的外形，不代表 optimal substructure 真成立。若整體 longest simple s→t path 經過 k，不能獨立挑「最長的 s→k simple path」與「最長的 k→t simple path」再串起來，因為兩段可能重複使用同一 vertex，串接後便不是 simple path。局部最長選擇甚至可能堵住後半段必經的 vertex。

因此 shortest-path proof 能切開 path，是因兩段最佳解相接仍保持可行，且負環排除後可選 simple representative；longest simple path 沒有同一封閉性。Notes 進一步指出一般 longest path 問題是 NP-hard。這不是本講要求我們解出的新演算法，而是用反例檢查 DP 建模：先證明 subproblem 能合法組合，再談 caching。

## 這一講在課程裡的位置

Lecture 11 的核心對比是 greedy finalization：Dijkstra 挑目前 estimate 最小者並永久確定，需要 nonnegative weights；Bellman–Ford 不做這個 greedy 承諾，而以 rounds 掃 edges。Lecture 12 把 rounds 重新解讀為 DP layers，讓「限制最多 k 條 edges」成為 proof invariant，再把 layer index 改成「允許哪些 intermediate vertices」，得到 Floyd–Warshall。

真正可遷移的能力不是背兩條公式，而是遇到新最佳化問題時依序追問：state 的每一維限制什麼？最佳解最後一步或關鍵分岔有哪些情況？子解能否在不破壞 feasibility 的前提下組回去？不同 state 是否大量重疊？依賴方向允許哪種填表順序？這五個問題答得清楚，程式通常只是 proof 的翻譯。

## 延伸

講義引用 Richard Bellman 對「dynamic programming」名稱的回憶：在政治環境下，他選了聽來難以反對的詞來描述 multistage decision process。這段歷史有助理解名稱，但不是演算法定義；判斷一個方法是不是 DP，仍應回到 state、recurrence、overlap 與 evaluation order。

Slides 也提到 APSP 存在漸進上更快的研究結果。那不是本講 required knowledge，也不改變 Floyd–Warshall 作為標準 DP 範例的價值；本篇不把研究型界線混進課堂演算法保證。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 12: Dynamic Programming: Bellman-Ford and Floyd-Warshall](https://stanford-cs161.github.io/winter2026/lectures/#lecture-12-dynamic-programming-bellman-ford-and-floyd-warshall)
- [Lecture 12 notes (PDF)](https://stanford-cs161.github.io/winter2026/assets/files/lecture12-notes.pdf)
- [Lecture 12 slides (PDF)](https://stanford-cs161.github.io/winter2026/assets/files/Lecture12.pdf)
- [Lecture 12 課程 metadata 與資源清單（官方 component）](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture12.md)
