---
title: "Stanford CS161 Lecture 16：Ford–Fulkerson、殘餘網路與最大流最小割"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, max-flow, ford-fulkerson, min-cut]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 17
tldr: "Ford–Fulkerson 在殘餘網路沿 augmenting path 推流；找不到路時，可達集合形成與 flow 同值的 cut，同時證明最大流、最小割與兩者相等。"
description: "完整導讀 Stanford CS161 Winter 2026 Lecture 16：flow、cut、residual graph、Ford–Fulkerson、正確性、複雜度與 bipartite matching。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-16-max-flow-ford-fulkerson-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161) 的第十七篇，對應 **Stanford CS161, Winter 2026, Lecture 16**。Moses Charikar 在 2026 年 3 月 4 日主講；component 題名是 *Max-Flow and the Ford-Fulkerson Algorithm*，notes 內頁題名是 *Max Flow, Min Cut and Ford-Fulkerson*。

本文使用公開的 [notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-notes.pdf)、[slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-slides.pdf) 與[官方 component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture16.md)。我沒有觀看 Canvas 錄影，也沒有使用 component 連出的歷史論文與 concept checks。

上一講的 cut 幫 greedy 選出安全邊；這一講的 directed `s-t` cut 則提供 upper bound。Ford–Fulkerson 一面建構 flow，一面更新 residual graph。當 residual graph 再也沒有 `s→t` path，演算法不只停下，還從 reachability 直接讀出一個同值 cut。答案和證明一起出現，是這講最漂亮的地方。

## Flow 與 cut

輸入是 directed graph `G=(V,E)`、非負 capacity `c:E→R_{≥0}`、source `s` 與 sink `t`。Flow `f` 必須滿足：

```text
0 ≤ f(u,v) ≤ c(u,v)
Σ_u f(u,v) = Σ_w f(v,w)    for v not in {s,t}
```

第一條是 capacity constraint；第二條是 flow conservation。Flow value 是 source 的 net outflow：

```text
|f| = Σ_x f(s,x) - Σ_y f(y,s)
```

若 `s` 沒有入邊，就是總 outflow。Maximum-flow 問題要最大化 `|f|`。

一個 `s-t` cut 將 vertices 分為不交的 `S,T`，其中 `s∈S,t∈T`。Capacity 只計從 `S` 指向 `T` 的原圖 edges：

```text
c(S,T) = Σ_{x∈S,y∈T} c(x,y)
```

不能把 `T→S` 也加進去。對任意合法 flow，把 `S` 中各 vertex 的 net outflow 相加，內部 edges 抵消，剩 `S→T` flow 減 `T→S` flow。因此 `|f|≤c(S,T)`。每個 cut 都是 max-flow 的 upper bound；若找到 flow 與 cut 同值，兩者就各自最佳。

## Residual graph：允許演算法反悔

只沿尚未用滿的原圖 edges 向前推是不夠的。早期選錯路可能佔掉關鍵容量，因此 residual graph 同時表示「還能多送多少」與「能撤回多少」。在 notes 暫設原圖不含相反方向平行 edge 時：

```text
c_f(u,v) = c(u,v)-f(u,v)   if (u,v) is an original edge
c_f(u,v) = f(v,u)          if (v,u) is an original edge
```

正 residual capacity 的 directed edges 組成 `G_f`。Reverse residual edge 不是憑空新增運輸管道，而是允許減少原 edge 上既有 flow。Augmenting path 是 `G_f` 中的 `s→t` path，其 bottleneck `F` 是 path 上最小 residual capacity。

沿 path 更新時，forward residual edge 對原 flow 加 `F`；reverse residual edge則對對應原 flow 減 `F`。Path 內部每個 vertex 的增減互相抵銷，capacity 也因 `F` 不超過 bottleneck 而保持合法，source net outflow 恰增 `F>0`。

## Ford–Fulkerson

```text
f = zero flow
while residual graph G_f has an s-to-t path P:
    F = min residual capacity on P
    for each edge on P:
        add F on a forward original edge
        subtract F when using a reverse residual edge
return f
```

找 path 可用 DFS 或 BFS，但「Ford–Fulkerson」本身未固定選擇規則。這會影響是否終止與多快，卻不改變終止時的正確性。

官方 notes 的例子先有 value 16 的 flow；residual path `s→a→c→b→t` bottleneck 為 2，augment 後 value 18。此時 cut `{s,a,c}`／`{b,t}` capacity 也等於 18，立即證明 flow 最大、cut 最小。Slides 另以多步圖示範 reverse edges 如何撤銷先前推流；若把 reverse edge 刪掉，演算法可能卡在非最大解。

## 為什麼停下就是最佳

證明有三層。第一，剛才的 flow-versus-cut inequality 給所有 flow 一個上界。第二，每次 augmentation 保持 flow 合法且 value 嚴格增加。第三，若 residual graph 已無 `s→t` path，令 `S` 是從 `s` 仍 reachable 的 vertices，`T=V-S`。

每條原圖 `S→T` edge 必已 saturated，否則它會是正 residual edge並讓終點也 reachable。每條原圖 `T→S` edge 的 flow 必為 0，否則它在 residual graph 會產生 `S→T` reverse edge。於是跨 cut 的 net flow 正好等於全部 `S→T` capacity：

```text
|f| = c(S,T)
```

再配合任何 flow 都不超過任何 cut，便有 max-flow = min-cut。這個 reachable cut 是可檢查的 optimality certificate，而非只靠「演算法看起來沒路」的直覺。

## 路徑選擇與複雜度

若 capacities 是 integers，任意 path 每次至少把 value 增加 1。令最佳值為 `|f*|`，最多 `|f*|` 次 augmentation；每次找路與更新花 `O(m)`，notes 給 `O(|f*|m)`。這是 pseudo-polynomial：數值以 binary 編碼時，`|f*|` 可能對輸入 bit-length 呈指數級。

Rational capacities 可乘共同分母變成 integers，但放大比例也進入 runtime。Irrational capacities 下，任意 path 選擇甚至不保證終止。因此「若終止就正確」與「保證有效率地終止」是不同命題。

Notes 另分析兩個 variants。Fattest path 每次選 bottleneck 最大的 augmenting path；材料稱可在 `O(m+n)` 找到，並給 integer case 總時間 `O(m(m+n)log|f*|)`。若 rational capacities 放大 `N`，log 項成為 `log|f*|+log N`。

Shortest augmenting path 用 BFS 選 edge 數最少的路。Residual distance 單調不減，同一 directed edge 每兩次消失之間 distance 至少增 2，推出至多 `mn/2` iterations，notes 寫總時間 `O((m+n)mn)`。第 7 節明說細節未在課堂討論，只供有興趣者；本文因此不把它當現場完整講授內容。Notes 同句把 BFS method 稱為 Edmonds–Karp／Dinic，但標準用語中兩者不同；本文不沿用這個等號。

## Bipartite matching reduction

對 bipartite graph `V₁∪V₂`，把中間 edges 定向 `V₁→V₂`，加 source 到每個左側點、每個右側點到 sink，所有 capacities 設 1。Matching 會產生同值 integer flow；反之 value `n` 的 integer flow 中，每個 vertex 恰使用一條 unit-flow middle edge，形成 perfect matching。

Ford–Fulkerson 從 integer zero flow 開始，每次 bottleneck 也是 integer，所以保持 integrality。這是 reduction 成立的重要橋樑，不只是把圖畫成 network。Slides 再以學生與 ice cream／swag 的 capacities 展示一般 assignment，但沒有提供與 balanced unit-capacity perfect matching 同等完整的 theorem proof。

## 材料限制與常見錯誤

Cut capacity 只算 `S→T`；residual reverse edge 表示撤回；必須在完整 residual graph 做 reachability；任意 path 的 correctness、termination 與 efficiency 必須分開。Multiple sources/sinks 可依 notes 加 super-source/sink，但程式中的「infinite」capacity 應以可證明足夠大的有限上界或符號處理。

Notes 的 perfect-matching proof限於 balanced unit-capacity 模型；slides 的一般 assignment 是直覺延伸。Component 的 Schrijver 歷史論文未在本次已讀範圍。這些界線避免把一堂課擴寫成材料沒有支持的廣泛網路最佳化理論。

## 正確性、終止與效率是三個命題

Flow-versus-cut inequality 與終止後的 reachable cut 證明：**只要停在沒有 augmenting path 的狀態，輸出必為最佳**。Integer capacities 另外保證每次 value 至少增 1，配合有限 `|f*|` 才證明任意選路終究會停。`O(|f*|m)` 是否有效率又是第三題，因 `|f*|` 對輸入 bit-length 可能很大，所以只是 pseudo-polynomial。

Residual graph 同時承擔執行與證明：過程中列出 forward 增流及 reverse 反悔的所有局部修正；結束時，其 reachability partition 把「無改善路徑」轉成同值 cut certificate。只查原圖未滿的 forward edges，會同時破壞兩個角色。

## 延伸

工程實作可在每輪保留 parent edge 以重建 path，並以 64-bit integer 防止容量總和溢位。測試應檢查 capacity、conservation、reported value，以及終止後 residual reachable cut 是否同值。若輸入允許 antiparallel edges，應用明確的 edge identity 或反向索引，不能直接套 notes 為簡化定義的公式。這些是實作建議，不是講義額外 theorem。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 16 anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-16-max-flow-and-the-ford-fulkerson-algorithm)
- [Lecture 16 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-notes.pdf)
- [Lecture 16 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture16-slides.pdf)
- [Lecture 16 official component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture16.md)
