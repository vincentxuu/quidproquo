---
title: "Stanford CS161 Lecture 9：圖的表示、DFS、BFS 與兩種搜尋順序的證明"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, graph-algorithms, graph-traversal]
lang: zh-TW
type: deep-dive
description: "逐段拆解 Stanford CS161 Winter 2026 第 9 講：adjacency list／matrix、DFS timestamps、拓撲排序、BFS layers、無權最短路徑與二分圖測試。"
tldr: "DFS 與 BFS 都在 adjacency list 上以 O(n+m) 掃完整張圖；DFS finish times 能為 DAG 產生拓撲順序，BFS layers 則精確等於無權圖的最短距離。"
draft: false
series:
  name: "Stanford CS161 導讀"
  order: 10
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-09-graphs-bfs-dfs-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)第 10 篇，對應 **Stanford CS161, Winter 2026, Lecture 9**。官方課名是 **Graphs and BFS and DFS**，上課日期為 2026 年 2 月 4 日，講師是 Ellen Vitercik。

本篇依照[官方 Lecture 9 頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-9-graphs-and-bfs-and-dfs)、公開 notes 與 slides 整理。Notes 詳寫 graph representation、DFS 與 BFS；slides 還把 DFS 用到 topological sorting、把 BFS 用到 bipartiteness，兩者都屬本講 agenda，不能因 notes 沒展開就漏掉。官方 Colab 沿用 `winter2025-extra`，本文未用它支撐 Winter 2026 的新主張。Canvas-only 錄影未作為來源。

這堂課的核心不是背兩份走訪 pseudocode，而是看見「探索順序」會留下不同證據。DFS 的 discovery / finish times 把巢狀結構編碼下來；BFS 的 layers 則直接對應 edge 數最少的距離。相同的 `O(n+m)` 掃描框架，因容器與 bookkeeping 不同，能解不同問題。

## 先決定圖怎麼放進記憶體

圖寫成 `G=(V,E)`，令 `n=|V|`、`m=|E|`。Undirected graph 的 edge 雙向；directed graph 的 `(u,v)` 只表示 u 指向 v。Sparse graph 的 edges 接近 `Θ(n)`，dense graph 則可能接近 `Θ(n²)`。

兩種標準表示法有不同成本：

| 表示法 | 空間 | 查 `(u,v)` | 列出 u 的 neighbors |
| --- | ---: | ---: | ---: |
| Adjacency matrix | `Θ(n²)` | `Θ(1)` | `Θ(n)` |
| Adjacency list | `Θ(n+m)` | 最壞 `Θ(deg(u))` | `Θ(deg(u))` |

Matrix 用一個 `n×n` 的 0/1 表格；list 則為每個 vertex 保存一份 neighbors。Directed graph 常把 out-neighbors 與 in-neighbors 分開，因為演算法可能只需要其中一種方向。

後面說 DFS / BFS 是 `O(n+m)` 時，預設使用 adjacency list。若用 matrix，每 visit 一個 vertex 都掃完整列，即使圖很 sparse 也要 `Θ(n²)`。Big-O 不只屬於 pseudocode，也屬於 representation。

## DFS：走到底再回頭

Depth-first search（DFS）從 source `s` 出發，每次優先沿尚未探索的 neighbor 繼續深入，直到無路可走才 backtrack。官方 slides 用迷宮、粉筆與繩子的比喻；pseudocode 用三種顏色：

- White：尚未發現。
- Gray：已發現，但仍在遞迴 stack 上，尚未完成所有 neighbors。
- Black：已完成，之後不再展開。

每個 vertex 還記錄 parent `p(v)`、discovery time `d(v)` 與 finish time `f(v)`。流程是：

```text
DFS(s, t):
  color(s) = gray
  d(s) = t; t++
  for v in out-neighbors(s):
    if color(v) == white:
      p(v) = s
      t = DFS(v, t); t++
  f(s) = t
  color(s) = black
  return t
```

若只從一個 source 跑，結果是它可到達的 vertices。要探索整張可能 disconnected 的圖，就用外層 loop：每遇到仍 white 的 vertex，開一棵新的 DFS tree。所有 trees 合起來是 DFS forest；在 undirected graph 中，每棵 tree 對應一個 connected component。

### 一個 timestamps 例子

假設從 `a` 開始，依序深入 `a→b→c→d`，完成 d 後逐層回退；另一個 component 是 `e→f`。可能得到：

```text
a: (1,8)   b: (2,7)   c: (3,6)   d: (4,5)
e: (9,12)  f: (10,11)
```

Descendant 的 interval 完整嵌在 ancestor interval 內。這不是裝飾資訊；finish times 會支撐 topological sorting，也會在 Lecture 10 成為 SCC 演算法的核心。

## DFS 為什麼是 O(n+m)

每個 vertex 只會從 white 變成 gray 一次，再變 black；因此 node visits 至多 n 次。掃 `u` 的 adjacency list 時，每個 directed edge `(u,v)` 被看一次；undirected edge 在兩端 list 各出現一次，所以至多兩次。每次 visit 與 edge scan 只做常數工作，總成本是 `O(n+m)`。

同一個計數也說明 DFS 不會漏掉 reachable vertex。若 v 從 source 可達，取一條 path；DFS 掃到 path 上每個已發現 vertex 時，都會檢查下一條 edge。尚未發現的下一點會被遞迴進入，已發現則早已在 traversal 中。DFS 只沿真實 edges 移動，也不會憑空到達不可達點。

## 投影片應用一：拓撲排序

在 package dependencies 或課程先修關係中，我們想找一個順序，使每條 directed edge `A→B` 都把 A 放在 B 前。這叫 topological order，而且只有 directed acyclic graph（DAG）保證存在。

演算法很短：

1. 對整張 DAG 跑 DFS forest並記 finish time。
2. 按 finish time 遞減輸出 vertices。

正確性集中在一個命題：若 DAG 有 edge `A→B`，則 `f(B)<f(A)`。

- 若 B 是 A 的 DFS descendant，B 必須先完成，遞迴才回到 A，所以 `f(B)<f(A)`。
- 若 B 不是 A 的 descendant，A 也不可能是 B 的 descendant；否則 B 到 A 的 DFS-tree path 加 edge `A→B` 會形成 cycle。於是 B 必須在 A 開始前已完成，仍有 `f(B)<f(A)`。

所以 decreasing finish time 一定把 A 放在 B 前。若圖有 cycle，finish times 仍存在，卻不能產生合法 topological order；課程中的 proof 明確使用 DAG 前提。

## BFS：一層一層推進 frontier

Breadth-first search（BFS）不是先走到底，而是先完成距 source 一步的 vertices，再完成兩步、三步。定義 `L_i` 為從 `s` 出發、距離 i 的 layer：

```text
L₀ = {s}
```

處理 `L_i` 時，掃其中每個 u 的 neighbors。第一次看到 x，就標記 visited、設 `p(x)=u`，並把 x 放進 `L_{i+1}`。實作上可用 queue：從 front 取最早發現的 vertex，把新 neighbors 放到 back。DFS 的 iterative 版本則使用 stack；兩份 skeleton 的主要差異就是 FIFO 與 LIFO。

對 unweighted graph，path 長度是 edge 數。BFS 不只找 reachable set，還計算 source 到每個 reachable vertex 的最短距離。Parent pointers 形成 BFS tree，從目標沿 parents 回走就能還原一條 shortest path。

## 為什麼 BFS layers 就是最短距離

要證明的命題是：

```text
L_i = {x | dist(s,x)=i}
```

用 strong induction。Base case `L₀={s}`。假設到 i 為止每層都正確，考慮 `L_{i+1}`。

先證「被放進來的不會太遠或太近」。若 y 被放入 `L_{i+1}`，它是掃某個 `x∈L_i` 的 edge `(x,y)` 時發現，所以有一條長度 i+1 的 path，`dist(s,y)≤i+1`。Y 沒出現在任何較早 layer；依 induction hypothesis，它的距離也不可能 ≤i，因此恰為 i+1。

再證「真正距離 i+1 的不會漏掉」。取 y 的 shortest path，令 x 是 y 前一個 vertex。該 prefix 也是 shortest path，所以 `dist(s,x)=i`，由 induction hypothesis 得 `x∈L_i`。掃 x 時一定檢查 `(x,y)`；若 y 尚未 visited 就放進 `L_{i+1}`，若已 visited，必是同一輪由另一個 `L_i` vertex 放入。

兩個方向合起來，layer 和最短距離完全相等。這份 proof 也指出限制：weighted graph 的 edge 代價不同，「多一條 edge」不代表「成本加一」，所以 BFS 不能直接解 weighted shortest paths。

## 投影片應用二：測試二分圖

Bipartite graph 能把 vertices 分成兩色，讓每條 edge 的兩端顏色不同。Slides 用兩個魚缸建模：會打架的兩條魚之間連 edge，問能否分缸避免同缸衝突。

BFS 提供線性時間測試：每個 component 各跑一次 BFS，偶數 layer 塗一色、奇數 layer 塗另一色。掃 edge 時若發現兩端同色，就回報不是 bipartite；若所有 edges 都跨色，現有 coloring 本身就是合法 certificate。

為什麼一次同色 edge 足以否定所有可能 coloring，而不只是說「這次塗得不好」？設同色 neighbors 為 u、v。它們在 BFS tree 中與共同 ancestry 的 paths 有相同 parity，再加上 edge `(u,v)`，構成 odd cycle。Odd cycle 不可能用兩色讓相鄰 vertices 全部異色：沿 cycle 交替上色，走完奇數條 edges 回到起點時顏色衝突。因此圖不可能 bipartite。

## DFS 與 BFS 的共同骨架與差異

| 面向 | DFS | BFS |
| --- | --- | --- |
| Frontier 容器 | Stack／recursion | Queue／layers |
| 優先順序 | 最新發現的先深入 | 最早發現的先展開 |
| 主要結構 | DFS tree、discovery / finish times | BFS tree、distance layers |
| 本講應用 | Topological sorting | Unweighted shortest paths、bipartiteness |
| Adjacency-list 時間 | `O(n+m)` | `O(n+m)` |

兩者都能找 reachable vertices 與 undirected connected components。差別不在「誰比較快」，而在 traversal order 產生什麼 invariant。把 BFS 寫成 stack 或把 DFS 寫成 queue，名稱改了不算，行為與 proof 也跟著換掉。

## 容易誤用的限制

第一，只從一個 source 跑不代表探索全圖。Disconnected graph 需要外層 loop；directed graph 中，從 s 可到達 v 也不代表 v 可回到 s。

第二，`O(n+m)` 依賴 adjacency list。Matrix representation 會讓 neighbor enumeration 固定掃 n 格，dense graph 時合理，sparse graph 時則多做大量空檢查。

第三，BFS shortest path 僅限 unweighted 或每條 edge 等權。若有非負不同權重，要用 Lecture 11 的 Dijkstra；若有負權，還要換 Bellman–Ford。

第四，slides 某處把 connected graph 的 BFS 簡寫成 `O(m)`。完整一般式應保留 `O(n+m)`；只有 undirected connected graph 因 `m≥n-1`，才能把 n 吸收進 m。

第五，topological sorting 需要 DAG；bipartite testing 要對每個 component 做 BFS。這些前提都是正確性的一部分，不是實作註腳。

## 這一講在整門課的位置

Lecture 9 是課程從排序與資料結構轉進 graph algorithms 的入口。它先建立 representation 與 traversal primitives，後面幾講幾乎都在改造這兩個 primitives：Lecture 10 用 DFS finish times 分解 SCC；Lecture 11 把 BFS 的無權 shortest path 推向 weighted graph；Lecture 12 再用動態規劃處理負權與 all-pairs shortest paths。

因此這一講最值得帶走的不是兩段 pseudocode，而是三個 proof habits：先說 state 代表什麼、再用每個 vertex / edge 被處理幾次做時間分析、最後把 traversal order 寫成可 induction 的 invariant。

## 延伸

可用同一張小圖做三次手算。第一次依不同 neighbor order 跑 DFS，比較 timestamps；第二次把 vertices 按 decreasing finish time 排出，檢查每條 DAG edge；第三次跑 BFS，逐層寫 `L_i` 並沿 parent 還原 shortest path。Neighbor order 會改變 tree 形狀，卻不會破壞三個核心結論。

實作 bipartite test 時，不要只回傳 boolean。遇到同色 edge 時，沿 parent pointers 找共同 ancestor，輸出那條 odd cycle。成功時回傳 coloring，失敗時回傳反例，會讓正確性從抽象宣告變成可檢查 certificate。這是本站的延伸建議，不是 Winter 2026 額外要求。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 9 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-9-graphs-and-bfs-and-dfs)
- [Lecture 9 notes: Graphs, DFS, and BFS](https://stanford-cs161.github.io/winter2026/assets/files/lecture9-notes.pdf)
- [Lecture 9 slides: Graphs, BFS and DFS](https://stanford-cs161.github.io/winter2026/assets/files/Lecture9.pdf)
- [Lecture 9 課程 metadata 與資源清單（官方 component）](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture9.md)
