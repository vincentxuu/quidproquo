---
title: "Stanford CS161 Lecture 10：兩次 DFS 為什麼能找出強連通分量"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, graph-algorithms, strongly-connected-components]
lang: zh-TW
type: deep-dive
description: "逐段拆解 Stanford CS161 Winter 2026 第 10 講：SCC、condensation DAG、transpose graph、finish times、兩趟 DFS 演算法與線性時間正確性證明。"
tldr: "把每個 SCC 壓成一點後一定得到 DAG；第一趟 DFS 的 finish times 排出這些分量，第二趟在轉置圖按遞減順序搜尋，每棵 DFS tree 恰好是一個 SCC，總時間 O(n+m)。"
draft: false
series:
  name: "Stanford CS161 導讀"
  order: 11
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-10-strongly-connected-components-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)第 11 篇，對應 **Stanford CS161, Winter 2026, Lecture 10**。官方課名是 **Strongly Connected Components**，上課日期為 2026 年 2 月 9 日，講師是 Moses Charikar。

本文依照[官方 Lecture 10 頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-10-strongly-connected-components)、公開 notes 與 slides 整理。Slides 採「先跑原圖、再反轉」；notes 採等價的「先跑轉置圖、再回原圖」。本篇會把兩種版本並列，但完整 proof 固定採 notes 方向，避免把 pass 混接。Canvas-only 錄影未作為來源；官方頁連到的 `winter2025-extra` notebook 也未被冒充為 Winter 2026 新材料。

Lecture 9 已經知道：在 undirected graph 中，從任一 vertex 跑 DFS，就能走完整個 connected component。Directed graph 麻煩得多。從 u 能到 v，不表示 v 能回 u；一次 DFS 找到的是 reachable set，不是 mutual reachability。Lecture 10 的巧思，是先把 SCC 之間的關係看成 DAG，再用 finish times 決定「下一次 DFS 從哪個分量開始才不會漏出去」。

## Directed graph 需要兩種 connected 概念

Undirected graph 中，定義 `u~v` 當且僅當存在 u 到 v 的 path。因 edges 可雙向走，這個 relation 具有 reflexive、symmetric、transitive 三個性質；每個 equivalence class 就是一個 connected component。

Directed graph 中要把方向寫清楚：

- **Strongly connected component（SCC）**：maximal vertex set S，使任意 `u,v∈S` 都同時存在 u→v 與 v→u paths。
- **Weakly connected component**：忽略所有 edge 方向後，在所得 undirected graph 中的 connected component。

「Maximal」表示不能再加入任何外部 vertex 而保留 mutual reachability。SCC 不是任意 strongly connected subset；一張 directed cycle 的三個 vertices 中，任取兩點可能互達，但真正 SCC 是三點全體。

最直覺的錯誤做法，是從某個 source 跑 DFS，把 reachable vertices 當成一個 SCC。若 SCC `A` 有 edge 指向 SCC `B`，從 A 出發會同時走到 A、B，卻沒有 B 回 A 的 path。Reachability 只有一個方向。

## 把每個 SCC 壓成一個點

將每個 SCC `C₁,…,Cₖ` 各自縮成 meta-node；若原圖有跨分量 edge，就在 meta-nodes 之間連 directed edge。所得圖稱為 SCC graph 或 condensation graph。

這張 meta-graph 必為 DAG。反證很短：若不同 SCCs 形成 directed cycle，沿著每個 SCC 內部的 mutual paths 與跨分量 edges，cycle 上任意兩個 vertices 都能互相到達。它們原本就應屬同一 SCC，與「不同分量」矛盾。

這個結構是整堂 proof 的視角。原圖內部可以很複雜，但把 SCC 壓縮後，只剩一張 DAG。若第二趟 DFS 每次都從剩餘 DAG 的 sink component 開始，它就走不出那個 SCC；同時 SCC 內部 mutual reachability 保證它會走完整個 SCC。

真正的問題變成：如何在不知道 SCCs 的前提下找到這種順序？答案是第一趟 DFS 的 finish times。

## 演算法有兩個等價方向

先定義 transpose graph `G^T`：保留 vertices，把每條 `(u,v)` 反轉成 `(v,u)`。反轉不會改變 SCC partition，因為一組 vertices 若在 G 中雙向互達，在 `G^T` 中仍雙向互達，只是每條 path 的方向整體翻轉。

官方材料出現兩個版本：

### Notes 版本：`G^T → G`

1. 在 `G^T` 上以任意 vertex order 跑完整 DFS forest，記每個 vertex 的 finish time `f(v)`。
2. 回到原圖 G，按 `f(v)` 遞減選尚未探索的 vertex 作 DFS source。
3. 第二趟中每棵 DFS tree、也就是共用同一 leader 的 vertices，恰好是一個 SCC。

### Slides／CLRS 版本：`G → G^T`

1. 在原圖 G 任意順序跑 DFS forest並記 finish times。
2. 反轉所有 edges 得 `G^T`。
3. 在 `G^T` 按第一趟 finish time 遞減跑 DFS；每棵 tree 是一個 SCC。

兩個版本都對，因 G 與 `G^T` 有相同 SCCs。最危險的寫法不是選錯版本，而是第一步照 slides、proof 卻直接抄 notes 的 edge 方向。以下固定用 notes 版本。

## 一個三分量例子

假設 condensation graph 有三個 SCC：

```text
C1 → C2 → C3
```

在原圖 G 中，C3 是 sink；在 `G^T` 中方向變成：

```text
C3 → C2 → C1
```

第一趟在 `G^T` 跑 DFS。無論實際從哪個 vertex 開始，finish-time ordering 會讓原圖 G 的 sink-side component 取得較大的候選順序。第二趟回 G，先從最大 finish 的未探索 vertex 開始；它所在的 SCC 沒有通往任何尚未處理 SCC 的 outgoing path，因此 DFS 只留在該 SCC。移除後，剩餘 condensation DAG 又有新的 sink，重複即可。

官方 notes 用九個 vertices 完整演示：第一趟得到 `f=1,…,9`，第二趟依 decreasing f 建出三棵 trees，leaders 分別是 9、6、4。不同 neighbor tie-breaking 可能改變個別 f 值，卻不會改變最後 SCC partition。

## Key lemma：finish times 如何排序 SCC

採 notes 方向。假設原圖 G 的 condensation graph 有 edge `C₁→C₂`。第一趟在 `G^T` 上跑 DFS，定義一個分量的 finish value 為其中最大的 vertex finish time。要證：

```text
max_{v∈C₁} f(v) < max_{v∈C₂} f(v)
```

在 `G^T` 中，跨分量 edge 方向是 `C₂→C₁`。觀察 DFS-loop 第一次碰到 `C₁∪C₂` 的 vertex，分兩種情況。

### 先碰到 C₁

在 `G^T` 中不可能有 C₁ 到 C₂ 的 path；若有，配上 C₂→C₁ 就形成 condensation cycle，兩者應是同一 SCC。因此從 C₁ 開始的 DFS 會完成 C₁，卻不會進 C₂。C₂ 之後才被探索，其最大 finish time更大。

### 先碰到 C₂

從 C₂ 可沿 `G^T` 的跨 edge 進 C₁，且每個 SCC 內部 strongly connected。這次 DFS 會在起點完成前探索兩個分量；起點所在 C₂ 的某個 vertex 最後完成，所以 C₂ 的最大 finish time仍大於 C₁。

兩種情況都得到同一 strict inequality。DFS 的細部順序會改值，不會改分量之間的方向關係。

## 第二趟為什麼一棵 tree 恰好是一個 SCC

在原圖 G 上按 finish time 遞減開始第二趟。用 induction 維持：先前 DFS calls 探索的集合 S 是若干完整 SCCs 的 union。

下一個 source v 不在 S，令 C 是 v 所在 SCC。因 C 內任意兩點互達，而且 C 尚未有 vertex 在 S，本次 DFS 至少會走遍整個 C。

還要證它不會跑到另一個未探索 SCC。假設 C 有 outgoing edge 到 `C'`。Key lemma 告訴我們 `C'` 中有 vertex 的 finish time大於 C 的最大值。第二趟按 decreasing f 處理，所以 `C'` 已在較早 DFS call 中完成；依 induction hypothesis，整個 `C'` 都在 S。換句話說，C 的每條 outgoing edge 不是留在 C，就是指向已標記 explored 的分量。本次 DFS 無法越界到尚未探索分量。

因此這次 call 探索「至少 C、至多 C」，恰好得到 C。把 C 加入 S 後 induction 繼續，直到所有 vertices 被分組。

這個 proof 比「把 edge 反過來就會神奇分開」多出兩個必要部件：condensation graph 無 cycle，以及 finish-time key lemma 排定跨分量方向。

## Pseudocode 與 leader bookkeeping

```text
SCC(G):
  GT = transpose(G)
  f = DFS-Forest(GT, arbitrary order)
  clear visited
  for v in vertices ordered by decreasing f(v):
    if v is unvisited:
      leader = v
      DFS(G, v), assigning this leader
  group vertices by leader
```

`leader` 只是第二趟某棵 DFS tree 的 root label。演算法不必先知道 SCC 邊界；DFS 自然把同一 tree 中的 vertices 標成同 leader。若只需要 component IDs，可用連續編號取代 source vertex。

Transpose adjacency lists 只需掃一次所有 vertices 與 edges。兩趟完整 DFS 各是 `O(n+m)`；排序 finish times 也不必用比較排序，因 DFS times 是 1 到 n 的唯一整數，可直接在第一趟完成順序的 stack 上反向取出。總時間 `O(n+m)`，空間 `O(n+m)` 包含 graph representation、transpose、visited、finish 與 recursion／explicit stack。

## 容易寫錯的地方

第一，第二趟必須依第一趟 finish time 遞減，不是任意 vertex order。任意順序會從非 sink component 出發，一次吞掉多個 SCCs。

第二，兩趟不能都在同一方向的圖上。可以先 G 再 `G^T`，也可以先 `G^T` 再 G；一定要有一次 transpose，proof 方向要跟版本一致。

第三，SCC condensation 是 DAG，不代表 SCC 內部是一個 cycle。單一 SCC 可以包含大量 cycles、branches 與任意 strongly connected 結構。

第四，weakly connected component 只是在忽略方向後連通，不能替代 SCC。兩個 vertices 可能位於同一 weak component，卻完全無法互達。

第五，recursion depth 在實作上可能達 n。漸近總時間仍是線性，但語言 call stack 可能溢位；iterative DFS 是工程上的替代，不改演算法 proof。

## 這一講在整門課的位置

Lecture 9 先建立 DFS forest 與 finish-time intervals；Lecture 10 沒有另發明全新 traversal，而是把相同 metadata 放到 transpose graph 上，再利用 SCC DAG 的方向。這是典型演算法設計：先找出輸入隱藏的簡化結構，再重用已會的 primitive。

下一講開始 weighted shortest paths。SCC 本身不是 shortest-path algorithm，但把圖壓成 condensation DAG 常是其他分析的前置步驟；更重要的是，Lecture 10 訓練了「演算法很短、證明靠全域 invariant」的讀法，Dijkstra 的 finalized set 也會採類似形式。

## 延伸

要自己驗證兩個官方版本，可畫一張有三個 SCC 的 directed graph，同時跑 `G→G^T` 與 `G^T→G`。逐 pass 寫下 finish order 與第二趟 trees；vertex 級 times 可能不同，component partition 必須相同。

實作時建議回傳兩份結果：每個 vertex 的 component ID，以及 condensation DAG。後者可把每條原 edge `(u,v)` 轉成 `(comp[u],comp[v])`，去掉 self-loops 與重複 edge。這是本站的延伸練習，不是 Winter 2026 投影片要求。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 10 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-10-strongly-connected-components)
- [Lecture 10 notes: Strongly Connected Components](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-notes.pdf)
- [Lecture 10 slides: Finding Strongly Connected Components](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-slides.pdf)
- [Lecture 10 課程 metadata 與資源清單（官方 component）](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture10.md)
