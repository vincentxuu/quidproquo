---
title: "Stanford CS161 Lecture 15：用 cut property 證明 Prim 與 Kruskal"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, minimum-spanning-tree, prim, kruskal]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 16
tldr: "MST 的核心不是背兩支演算法，而是維持『目前選邊仍包含於某棵 MST』，再用 cut property 證明 Prim 與 Kruskal 每一步都安全。"
description: "完整導讀 Stanford CS161 Winter 2026 Lecture 15：MST、safe-edge theorem、cut property、Prim、Kruskal、union-find 與複雜度。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-15-minimum-spanning-trees-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161) 的第十六篇，對應 **Stanford CS161, Winter 2026, Lecture 15**。Moses Charikar 在 2026 年 3 月 2 日主講，官方題名是 *Minimum Spanning Trees*。

本文實際閱讀了公開的 [lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-notes.pdf)、[slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-slides.pdf) 與[官方 lecture component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture15.md)。官方頁面仍把資源區標成 `coming`，但 notes 與 slides 檔案確實存在。Canvas 錄影需要 Stanford 權限，我沒有觀看，也未使用 prelecture、notebook 或 concept-check bank 補寫正文。

上一講用 exchange argument 證明 greedy choice 不會排除最佳解。這一講把同一思想濃縮成一個可重複使用的定理：只要找到一個尊重目前選邊的 cut，跨越它的最輕邊就是安全的。Prim 與 Kruskal 外觀看來很不一樣，一個長出單棵樹，一個合併森林；證明卻是同一個模板。

## 問題與不變量

輸入是 connected undirected graph `G=(V,E)`，每條邊有實數權重 `w(e)`。Spanning tree 連接所有 vertices、沒有 cycle，並有 `|V|-1` 條邊。目標找使

```text
w(T) = Σ_{e∈T} w(e)
```

最小的 spanning tree。權重可重複，所以最輕邊或 MST 都未必唯一；演算法只需回傳其中一棵。

兩支演算法都維持集合 `A`，不變量是：**存在某棵 MST 包含 `A`**。起初 `A=∅`，顯然成立。每一步要加入 safe edge，也就是加入後仍有某棵 MST 包含新集合。這比聲稱「這條邊出現在每棵 MST」弱，也正是處理 ties 所需要的精確說法。

Cut `(S,V-S)` 是對 vertices 的二分，不是把 edges 分兩堆。端點分居兩側的 edge crosses cut。若 `A` 沒有任何 edge 跨越此 cut，便說 cut respects `A`。所有 crossing edges 中權重最小者叫 light edge；若同權，可以有多條。

## Safe-edge theorem：MST 的交換論證

定理說：若某棵 MST 包含 `A`，一個 cut respects `A`，而 `(u,v)` 是跨越此 cut 的 light edge，那麼存在某棵 MST 包含 `A∪{(u,v)}`。

證明從包含 `A` 的 MST `T` 出發。若 `(u,v)` 已在 `T`，結論直接成立。否則把它加入 `T`，會形成唯一 cycle。因 `u,v` 在 cut 兩側，`T` 中原本的 `u→v` path 必定另有一條 crossing edge `(x,y)`。Cut respects `A`，所以 `(x,y)∉A`，可以安全移除而不丟掉先前承諾。

由 light edge 定義，`w(u,v)≤w(x,y)`。令

```text
T' = T - {(x,y)} + {(u,v)}
```

`T'` 仍連通、無 cycle，是 spanning tree；其成本不高於 `T`。但 `T` 已是 MST，因此 `T'` 不可能更便宜，只能同樣最佳，而且包含 `A∪{(u,v)}`。這個論證同時處理正、負與重複權重，不需要假設所有 weights 不同。

要注意 theorem 並非說「任選全圖最輕邊」；它要求 cut respects 當前 `A`，而候選邊必須是跨越該 cut 的 light edge。Prim 與 Kruskal 的差異，就在每輪用哪一個 cut 來滿足條件。

## Prim：從一個 root 長出一棵樹

Prim 任選 root `r`。對每個 vertex 保存 `key(v)` 與 `p(v)`：`key(v)` 是從目前 tree 連到 `v` 的最輕 edge weight，`p(v)` 是該 edge 的 tree 端點。初始化 `key(r)=0`，其餘為 `∞`，所有 vertices 放進 min-priority queue `Q`。

```text
Prim(G, r):
    for v in V: key[v] = ∞; parent[v] = NIL
    key[r] = 0
    Q = V
    A = ∅
    while Q is not empty:
        u = ExtractMin(Q)
        if parent[u] != NIL: A.add((parent[u], u))
        for each neighbor v of u with v in Q:
            if w(u,v) < key[v]:
                key[v] = w(u,v)
                parent[v] = u
    return A
```

已離開 `Q` 的 vertices 形成 growing tree。考慮 cut `(Q,V-Q)`：既有 tree edges 都在 `V-Q` 內，因此它 respects `A`。每個 `Q` 中 vertex 的 key 是連回 tree 的最輕邊；全域最小 key 對應整個 cut 的 light edge。`ExtractMin` 每次加入的因此都是 safe edge。

官方九點圖 `a...i` 從 `a` 開始，逐輪更新 key 與 parent。當 `c` 與 `h` 的 key 都是 8，任選一個都合法；不同 tie-breaking 可能畫出不同樹，但不影響成本最佳。Slides 先展示成本 67 的一般 spanning tree，再展示成本 37 的 MST，提醒「能連起來」與「總成本最低」是兩個條件。

若用 binary heap 或 red-black tree，初始化與 `n` 次取最小共 `O(n log n)`，至多 `m` 次 key update 共 `O(m log n)`。Connected graph 有 `m≥n-1`，總計寫成 `O(m log n)`。Fibonacci heap 將 decrease-key 降為 amortized constant，得到 `O(m+n log n)`。

Prim 的 `key` 不是從 root 到 vertex 的 path distance。Dijkstra 更新的是 `dist(u)+w(u,v)`；Prim 只比較單邊 `w(u,v)`。兩者都用 priority queue、程式外形相近，最佳化目標卻不同。

## Kruskal：讓一片森林逐步合併

Kruskal 先將所有 edges 依 weight 非遞減排序，每個 vertex 自成一個 disjoint set。依序掃描 `(u,v)`；若兩端目前在不同 components，就把邊加入 `A` 並 union；若已在同一 component，加入會形成 cycle，必須跳過。

```text
Kruskal(G):
    A = ∅
    for v in V: MakeSet(v)
    for (u,v) in edges sorted by nondecreasing weight:
        if Find(u) != Find(v):
            A.add((u,v))
            Union(u,v)
    return A
```

證明仍用同一 theorem。`A` 始終是一座 forest。下一條真正加入的 edge 連接兩個 components；取其中一個 component 的 vertices 作 `S`，其餘作 `V-S`。既有邊都留在各 component 內，所以 cut respects `A`。因所有更輕且能跨 component 的 edges 早已處理，當前邊是此 cut 的 light edge，故安全。

九點圖例先加入 `(g,h)`，在 `(c,i)` 與 `(f,g)` 等同權 edges 間可依排序順序選擇；遇到 endpoints 已同 set 的 `(i,g)` 時跳過。Union-find 不負責找最輕邊，而是快速回答「加入是否成 cycle」。排序負責 greedy 次序，disjoint set 負責可行性。

標準 comparison sort 是 `O(m log m)`；簡單圖有 `m≤n²`，所以常化成 `O(m log n)`。若 weights 是 polynomially bounded integers，notes 指出可用 radix sort 做到 `O(m)`。最佳 union-find 的 `make/find/union` amortized cost 為 `O(α(n))`，非排序部分是 `O((m+n)α(n))`；`α` 成長極慢，但不是字面上的常數。

## 兩支演算法怎麼選

| 面向 | Prim | Kruskal |
|---|---|---|
| 中間狀態 | 一棵 growing tree | 多棵 trees 組成 forest |
| 每輪 cut | tree 與未加入 vertices | 某 component 與其餘 vertices |
| 主要結構 | min-priority queue | edge sorting + union-find |
| 避免 cycle | 新 vertex 才被納入 | `Find(u) != Find(v)` |
| 證明核心 | cut 上最小 key 是 light edge | 排序後下一條跨 component 邊是 light edge |

稠密圖、鄰接矩陣或希望從某 root 漸進擴張時，Prim 很自然；edges 已排序、圖稀疏或需要 minimum spanning forest 時，Kruskal 很直接。但這些是實作選擇，不改變共同的 safe-edge invariant。

本講輸入明訂 connected graph。若圖不連通，不存在覆蓋全圖的單一 spanning tree；Kruskal 會自然得到每個 component 的 minimum spanning tree，合稱 minimum spanning forest。這是合理延伸，但不能把它誤稱原問題的 MST。

## 複雜度與材料邊界

Notes 另列 Karger–Klein–Tarjan 1995 randomized `O(E+V)`，以及 Chazelle 2000 使用 soft heaps 的 deterministic `O(Eα(V))`。本文把它們記為 **Winter 2026 官方材料列出的結果**，不把它們改寫成「截至今天最快」；那種現況主張需要另查當代文獻。

同樣地，notes 將 comparison sorting 的需求簡寫為 `Ω(m log n)`。精確 lower bound 取決於 computation model 與 `m,n` 關係；本篇只主張一般 comparison sort 為 `O(m log m)`，在簡單圖可化為 `O(m log n)`。這樣足以解釋課堂演算法，不過度擴張。

幾個容易出錯的地方值得一起記：cut 的兩側本身不必 connected；light edge 和 MST 都可不唯一；Prim 不應把 key 當 shortest-path distance；Kruskal 不能盲目加入每條下一輕的邊；官方 component 的 `resources coming` 也不能凌駕於實際存在的 PDF。

## 從 Lecture 14 到 Lecture 16

Lecture 14 說 greedy choice 需要 exchange proof；Lecture 15 把它封裝成 cut property，再讓 Prim 與 Kruskal共用。下一講 Max Flow 仍會使用 cut，但意思改成 directed `s-t` partition，cut capacity 只加 `S→T`，而 residual graph 會提供最佳性 certificate。看到同一個「cut」字眼時，必須重新核對問題定義。

## 延伸

實作 Kruskal 時，通常用 parent forest 加 union by rank/size 與 path compression；這能實現講義提到的近 `α(n)` amortized bound。工程上也應明確定義 tie-breaking，讓輸出可重現；它不影響最佳成本，卻會影響測試預期的 edge list。

若要驗證實作，不只檢查總權重。還應檢查輸出恰有 `n-1` 邊、連通、無 cycle，並在小圖上與 brute-force spanning trees 比較。對不連通輸入，API 應選擇報錯或明確回傳 forest，不要悄悄宣稱得到 MST。這些是工程延伸，不是本講新增的 theorem。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 15 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-15-minimum-spanning-trees)
- [Lecture 15 notes: Minimum Spanning Trees](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-notes.pdf)
- [Lecture 15 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture15-slides.pdf)
- [Lecture 15 official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture15.md)
