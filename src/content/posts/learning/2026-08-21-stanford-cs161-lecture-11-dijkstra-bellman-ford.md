---
title: "Stanford CS161 Lecture 11：Dijkstra、Bellman–Ford 與鬆弛的兩種秩序"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, shortest-path, graph-algorithms]
lang: zh-TW
type: deep-dive
description: "逐段拆解 Stanford CS161 Winter 2026 第 11 講：weighted SSSP、relaxation、Dijkstra 正確性與 priority queue 成本、Bellman–Ford、負權與負環。"
tldr: "Dijkstra 每次確定最小 estimate，正確性依賴非負 edge weights；Bellman–Ford 不挑 vertex、反覆鬆弛所有 edges，以 O(nm) 換取負權支援並能偵測 source 可達的負環。"
draft: false
series:
  name: "Stanford CS161 導讀"
  order: 12
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-11-dijkstra-bellman-ford-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)第 12 篇，對應 **Stanford CS161, Winter 2026, Lecture 11**。官方課名是 **Dijkstra and Bellman-Ford**，上課日期為 2026 年 2 月 11 日，講師是 Moses Charikar。

本文依照[官方 Lecture 11 頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-11-dijkstra-and-bellman-ford)、公開 notes 與 slides PDF 整理。Slides 明說 Dijkstra 會佔大部分時間，Bellman–Ford 只是快速導入，Lecture 12 會再完整處理；notes 則補上 BF 與 amortized analysis 的完整論證。本篇維持這個比重。Canvas-only 錄影未作為來源。官方 component 所列 `lecture11-slides.pptx` 目前缺檔，本文沒有引用它。

Lecture 9 的 BFS 已能算 unweighted shortest paths，因為每條 edge 都讓距離增加一。Weighted graph 改變了順序：edge 少的 path 可能更貴。Dijkstra 與 Bellman–Ford 都使用同一個核心動作——鬆弛（relaxation）——差別是「下一條該鬆弛誰」的秩序，以及那個秩序需要哪些權重前提。

## 問題、符號與鬆弛

給 weighted directed graph `G=(V,E)`、source `s` 與 edge weight `w(u,v)`，single-source shortest paths（SSSP）要找每個 v 的最短距離 `dist(s,v)`。一條 path 的成本是所有 edge weights 相加。最短 path 的任何 subpath 也必須是最短：若 prefix 可換成更便宜的 path，整條 path 就不是最短。

兩個演算法都保存 estimate `d[v]`。初始化：

```text
d[s] = 0
d[v] = ∞, v ≠ s
```

對 edge `(u,v)` 做 relaxation：

```text
d[v] = min(d[v], d[u] + w(u,v))
```

若 estimate 改善，設 predecessor `π(v)=u`，最後可沿 predecessors 還原 path。Relaxation 不會憑空創造數字；每個 finite estimate 都對應某條實際 s→v path。因此永遠有：

```text
d[v] ≥ dist(s,v)
```

Estimate 是 upper bound，演算法的工作是把它向真正最短距離往下收緊。

## Dijkstra：每次確定最小 estimate

Dijkstra 把 vertices 分成尚未確定的 F 與已確定的 D：

```text
while F is not empty:
  x = vertex in F with minimum d[x]
  for each outgoing edge (x,y):
    relax(x,y)
  move x from F to D
```

Slides 用 Stanford 校園建築圖與「拉繩子」直覺：source 先固定，最短 estimate 的 vertex 下一個被拉起；它的 distance 成為確定值，再拉動 neighbors。視覺直覺很好，但 proof 不能只說「最近的當然先確定」。需要證明尚未處理的 path 不可能日後把它降得更低。

### Claim 1：estimate 永遠不低估

初始化時只有 `d[s]=0`，其他是 infinity。每次 `d[v]` 改成 `d[u]+w(u,v)`，它代表某條已知 s→u path 再接 `(u,v)`。任何實際 path 的成本都不會低於 shortest path，所以 `d[v]≥dist(s,v)`。這個 induction 不需要非負權。

### Claim 2：移入 D 時 estimate 已正確

對 vertices 進入 D 的順序 induction。令 x 是 F 中 estimate 最小者，P 是 s→x 的 shortest path。沿 P 找最靠近 x、且 estimate 已正確的 vertex z；至少 s 符合。

若 z=x，完成。否則令 z' 是 P 上 z 的下一點。因 P 的 prefix 也是 shortest path，且 weights 非負：

```text
d[z] = dist(s,z) ≤ dist(s,x) ≤ d[x]
```

若 `d[z]<d[x]`，z 不可能還在 F，否則 x 不是 minimum；所以 z 已在 D，edge `(z,z')` 早已被鬆弛。這會讓 z' 也取得正確 estimate，和「z 是最靠近 x 的正確點」矛盾。故 `d[x]=dist(s,x)`。

非負權出現在關鍵 inequality。X finalized 後，F 中任何 y 都有 `d[y]≥d[x]`，再加 `w(y,x)≥0`，不可能用 y 改善 x。若有負 edge，這個不可回頭的承諾失去依據。

## 一個負 edge 反例

考慮：

```text
s --2--> x
s --5--> y --(-10)--> x
```

Dijkstra 先看到 `d[x]=2`、`d[y]=5`，會先 finalize x。但真正最短 path `s→y→x` 成本是 `-5`。等 y 被處理時已太晚。不是每張含負 edge 的圖都恰好算錯，而是 correctness guarantee 不再成立。

負 edge 和負環也要分開。若有 source 可達的 cycle 總權重小於零，就能多繞一次再降低成本；對 cycle 與其後方 vertices，有限 shortest distance 不存在，可視為趨向 `-∞`。沒有負環時，負 edge 本身仍可有定義良好的 shortest paths。

## Priority queue 決定 Dijkstra 的成本

F 需要三個操作：找最小 estimate、移除最小、estimate 降低時 update key。演算法層的呼叫次數是 n 次 minimum / removal，以及至多 m 次 decrease-key。不同資料結構代入後：

| F 的實作 | Find／Remove min | Decrease key | 總時間 |
| --- | ---: | ---: | ---: |
| Unsorted array | `O(n)` | `O(1)` | `O(n²+m)=O(n²)` |
| Red-black tree | `O(log n)` | `O(log n)` | `O((n+m)log n)` |
| Fibonacci heap | amortized `O(log n)` removal | amortized `O(1)` | `O(m+n log n)` amortized |

Sparse graph 中 `m` 接近 n，tree / heap 版本較能顯出優勢；dense graph 中 `m=Θ(n²)`，簡單 array 的 `O(n²)` 未必較差。Lecture 7 的資料結構不是插曲，它直接改寫這裡的 runtime。

## Notes 補充：amortized 不等於 expected

Fibonacci heap 的 bound 是 amortized。意思是從空結構開始，一串操作的總成本受界；個別操作仍可能昂貴。Notes 用 binary counter 說明：`0111+1` 會連續翻轉多個 bits，但 n 次 increments 的總 bit flips 是 `O(n)`。

Accounting method 為每次 increment 收兩個 credits。每個 1-bit 保留一個 credit，日後 1→0 的 carry 由舊 credit 支付；新 carry 帶著 credits 繼續。昂貴操作被許多先前便宜操作預付，所以平均每次 `O(1)`。

這和 Lecture 8 的 expected hashing 不同。Expected 對隨機選擇取平均；amortized 對操作序列總成本取平均，不需要隨機性。

## Bellman–Ford：不挑最小，全部反覆鬆弛

Bellman–Ford 放棄 Dijkstra 的 greedy finalization。最常見版本做 n−1 rounds，每 round 掃所有 m edges：

```text
for i = 1 to n-1:
  for each edge (u,v):
    relax(u,v)
```

最後再掃一次。若仍有 edge 可改善 estimate，回報 source 可達的負環；否則回傳 distances。

為銜接下一講，slides 另用 arrays `d^(0),…,d^(n-1)`，讓 `d^(k)[v]` 只由前一 round 計算，語意是「最多 k 條 edges 的最短 s→v path」。Notes 明確提醒這和課堂某些 pseudocode 版本略有不同。兩者 runtime 都是 `O(nm)`，但 proof state 不能混用：若宣稱使用 previous-round recurrence，就不能悄悄用同一 round 已更新值。

## Bellman–Ford 正確性

在無 source-reachable 負環時，最短 path 可取 simple path。若 path 有正 cycle，刪掉會更短；若有零 cycle，刪掉不改成本。Simple path 最多 n−1 edges。

對 k induction：round k 後，`d^(k)[v]` 等於（或在 in-place proof 中不高於）最多 k edges 的最短 path 成本。任一最多 k edges 的 path，要嘛已有最多 k−1 edges，要嘛最後一條是 `(u,v)`，prefix 最多 k−1 edges。Recurrence 取兩者最小。到 k=n−1，已涵蓋所有 simple shortest paths；再結合 estimates 始終是實際 path 成本，得到真正 distances。

負環偵測也有簡潔反證。假設 source 可達負環 `v₁→…→vₖ→v₁`，最後掃描卻沒有 edge 可鬆弛，則每條 cycle edge 都滿足：

```text
d[vᵢ₊₁] ≤ d[vᵢ] + w(vᵢ,vᵢ₊₁)
```

把所有 inequalities 相加，左、右的 d terms 完全抵消，得到 `0≤Σw`，和 cycle 總權重為負矛盾。因此至少一條 edge 還能改善。

只有 source 可達的負環會先得到 finite estimates 並被這個 SSSP 版本偵測。若要找全圖任意負環，可加 super-source 以零權 edges 連到所有 vertices，這不是本講 pseudocode 的預設。

## Dijkstra 與 Bellman–Ford 的真正差異

| 面向 | Dijkstra | Bellman–Ford |
| --- | --- | --- |
| 選擇順序 | 每次取 minimum estimate | 每 round 掃所有 edges |
| Finalization | 有，進 D 後不回頭 | 無，estimate 可持續改善 |
| 權重前提 | 所有 edges 非負 | 可含負 edge |
| 負環 | 不處理 | 偵測 source 可達負環 |
| 典型時間 | `O(m+n log n)` amortized with Fibonacci heap | `O(nm)` |

兩者都靠 relaxation；差別是 Dijkstra 用較強前提換取一次性決定，Bellman–Ford 用較多 rounds 換取彈性。把 BF 說成「比較慢的 Dijkstra」會漏掉它的 state meaning 與 negative-cycle certificate。

## 容易誤用的限制

第一，Dijkstra 不是只能處理正權；零權 edges 也可以，前提是 nonnegative。

第二，負 edge 不等於負環。前者破壞 Dijkstra proof，後者讓某些 shortest distances 根本沒有有限答案。

第三，Dijkstra 的 `d[v]` 是 upper bound；把 inequality 寫反會讓 proof 全部失效。

第四，Fibonacci heap 的單次 decrease-key / delete-min guarantees 要標 amortized，不是每次 worst-case。

第五，Lecture 11 slides 只快速 preview Bellman–Ford。完整 DP state 與 Floyd–Warshall 屬 Lecture 12；兩篇應有刻意重疊，但不可複製成同一篇。

## 這一講在整門課的位置

Lecture 9 的 BFS 是「所有 edge cost 都是 1」的 shortest-path algorithm。Lecture 11 先用 Dijkstra 處理 nonnegative weights，再用 Bellman–Ford 打開負權。它同時把 Lecture 7 的 priority queue 與 Lecture 8 的 expected／amortized 保證語意拉回來。

下一講會重新解讀 Bellman–Ford：`d^(k)[v]` 不只是一批 estimates，而是一張由小子問題建起來的 table。從那個 recurrence，課程正式進入 dynamic programming，並推到 all-pairs 的 Floyd–Warshall。

## 延伸

可用同一張五點 weighted graph 同時手算兩個演算法。每次 Dijkstra finalization 後記錄「為什麼它不會再變」；每次 BF round 後記錄「已保證正確到幾條 edges」。再加入一條負 edge 與一個負環，分別觀察 guarantee 消失與 distance 不存在。

實作時回傳 distances 之外，也保留 predecessors；若偵測負環，沿 predecessor pointers 回走 n 步再繞一圈，可萃取 cycle certificate。這是本站的延伸練習，不是 Winter 2026 投影片額外要求。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 11 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-11-dijkstra-and-bellman-ford)
- [Lecture 11 notes: Dijkstra and Bellman-Ford](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-notes.pdf)
- [Lecture 11 slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-slides.pdf)
- [Lecture 11 課程 metadata 與資源清單（官方 component）](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture11.md)
