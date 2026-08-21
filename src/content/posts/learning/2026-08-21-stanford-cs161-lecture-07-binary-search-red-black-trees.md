---
title: "Stanford CS161 Lecture 7：二元搜尋樹、紅黑樹與最壞 O(log n) 的來源"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, binary-search-tree, red-black-tree]
lang: zh-TW
type: deep-dive
description: "逐段拆解 Stanford CS161 Winter 2026 第 7 講：BST 的搜尋、插入、刪除，樹高失控的問題，以及紅黑樹如何靠不變量與旋轉守住對數高度。"
tldr: "一般 BST 的操作成本是 O(h)，偏斜時會退化成 O(n)；紅黑樹用五條顏色不變量把高度限制在 2 log₂(n+1)，因此搜尋、插入與刪除都有最壞 O(log n) 保證。"
draft: false
series:
  name: "Stanford CS161 導讀"
  order: 8
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-07-binary-search-red-black-trees-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)第 8 篇，對應 **Stanford CS161, Winter 2026, Lecture 7**。官方課名是 **Binary Search Trees and Red-Black Trees**，上課日期是 2026 年 1 月 28 日，講師為 Moses Charikar。

這篇依照[官方 Lecture 7 頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-7-binary-search-trees-and-red-black-trees)、公開 notes 與 slides 整理。slides 的課堂主線是二元搜尋樹（BST）與紅黑樹；notes 另外完整放入 heap。本篇會把 heap 標成講義補充，不假裝它和投影片有相同篇幅。Canvas-only 錄影沒有作為來源。

這堂課真正要解的問題不是「什麼是樹」，而是：如果一個集合會持續插入與刪除，能不能同時保留快速搜尋？排序陣列搜尋快，修改慢；鏈結串列修改快，搜尋慢。BST 想取兩者之長，但它的速度取決於形狀。紅黑樹則把「形狀不能太糟」寫成可維護的不變量。

## 從操作需求看資料結構

假設集合中的 key 互不相同，我們想支援幾種操作：搜尋某個 key、插入、刪除、找前驅或後繼，以及依排序順序走訪。排序陣列能用二分搜尋在 `Θ(log n)` 找到元素，也能在 `Θ(1)` 取得固定排名的元素；可是插入或刪除通常得搬動一段陣列，成本是 `Θ(n)`。未排序鏈結串列剛好相反：已知位置時插入或刪除可以是 `Θ(1)`，搜尋卻得一路掃到尾端。

BST 的賭注是：不要把排序關係壓成一條陣列，而是把它展開成樹。每個節點 `x` 都維持同一條規則：

- `x` 左子樹的所有 key 都小於 `key(x)`。
- `x` 右子樹的所有 key 都大於 `key(x)`。
- 本講假設 key 唯一，所以不必決定重複值放哪一側。

這條規則同時帶來搜尋方向與排序順序。搜尋時，每比較一次就能排除一整棵子樹；做中序走訪時，依「左子樹、目前節點、右子樹」輸出，就會得到由小到大的序列。

把 BST 和 QuickSort 放在一起看也很有用：每個節點像一個 pivot，左子樹是較小元素，右子樹是較大元素。不同之處是 QuickSort 最後留下陣列順序，BST 則保留可繼續更新的樹結構。

## BST 的搜尋、插入與刪除

### 搜尋其實是在找一條路

搜尋 `i` 從 root 開始。若目前 key 等於 `i` 就完成；若 `i` 較小就往左，較大就往右。若下一個 child 已是 `NIL`，便知道 `i` 不在樹裡；同一個位置也正是未來插入 `i` 時該使用的位置。

例如有這棵樹：

```text
        4
      /   \
     2     6
    / \   / \
   1   3 5   8
            /
           7
```

搜尋 `5` 的路徑是 `4 → 6 → 5`。搜尋不存在的 `5.5` 也是先走 `4 → 6 → 5`，接著發現 5 的右 child 是 `NIL`。這裡很容易誤會：演算法停下來的節點是插入位置的 parent，不保證是數值上最接近 `5.5` 的 key。官方 notes 特別用反例提醒這件事。

### 插入沿用搜尋結果

插入 `i` 先跑搜尋，找到應當成為 parent 的節點 `p`。若 `i < key(p)` 就掛在左側，否則掛在右側。搜尋已經證明對應 child 是 `NIL`，所以這一步不必再找位置。新節點的兩個 children 都從 `NIL` 開始。

若依序把已排序的 `1,2,3,4,5` 插入空 BST，每次都只會往右走，最後得到一條長鏈。它仍完全符合 BST 規則，卻失去了二分的效果。這個例子埋下紅黑樹的動機：BST invariant 只管順序，不管平衡。

### 刪除要分三種結構

刪除節點 `x` 時，不能只把它抹掉，否則其子樹會失去連接。三種情況要分開處理：

1. `x` 沒有 child：讓 parent 原本指向 `x` 的 pointer 改成 `NIL`。
2. `x` 只有一個 child `c`：讓 `c` 頂替 `x`，並修正 `c` 的 parent pointer。
3. `x` 有兩個 children：找 `x` 的 immediate successor `z`，也就是右子樹的最小節點，讓 `z` 頂替 `x`。

第三種最值得慢下來。Successor `z` 不可能有左 child，否則那個左 child 會比 `z` 更小，`z` 就不是 successor。因此把 `z` 從原位置抽出時，只需處理它可能存在的右 child；接著把 `x` 原本的左右子樹接到 `z`。也可以對稱地使用左子樹最大值，也就是 predecessor。

搜尋、插入與刪除都只沿少數 root-to-leaf paths 移動，額外 pointer 操作是常數次。因此三者的時間都是 `O(h)`，其中 `h` 是樹高。問題也正在這裡：平衡樹的 `h=O(log n)`，偏斜樹的 `h=O(n)`。

## 講義補充：heap 解的是較窄的問題

Lecture 7 notes 的前半還介紹 binary min-heap；投影片主線沒有這段。Heap 儲存在 complete binary tree 中：除了最後一層外每層填滿，最後一層從左往右填。每個節點的 key 不大於其 children，因此 minimum 一定在 root。

Heap 主要支援兩個動作：

- `insert(i)`：先把新 key 放到 complete tree 的下一個位置，再和 parent 比較；若較小就交換並往上，直到 heap property 恢復。
- `extract-min`：保存 root key，以最後節點的 key 覆蓋 root，刪掉最後節點；再反覆和較小的 child 交換並往下。

Complete tree 的高度是 `Θ(log n)`，兩個動作都只走一條 path，所以是 `O(log n)`。但 heap 沒有 BST 的全域左右順序，搜尋任意 key 仍可能要看 `Θ(n)` 個節點。它不是「比較差的 BST」，而是針對 priority queue 的 `insert` 與 `extract-min` 做更簡單的設計。

## 為什麼 rotation 不會破壞排序

要平衡 BST，得在不改變中序順序的前提下調整形狀。Rotation 是最基本的局部操作。考慮一個以 `x` 為 root、左 child 為 `y` 的局部結構：

```text
        x                 y
       / \               / \
      y   γ   --右旋-->  α   x
     / \                   / \
    α   β                 β   γ
```

在原樹裡，`α < y < β < x < γ`。右旋後，`α` 留在 `y` 左側，`β` 移到 `x` 左側，`γ` 不動；所有相對順序仍相同。因此 rotation 保留 BST invariant。需要改的只是固定數量的 child / parent pointers，時間是 `O(1)`。反方向就是對 `y` 做左旋。

只有 rotation 還不夠，因為「看起來歪就轉一下」不是可驗證的演算法。我們需要一組能判定何時失衡、也能在更新後修復的規則。紅黑樹的顏色就是這組 bookkeeping。

## 紅黑樹的五條不變量

紅黑樹首先是一棵 BST，再額外滿足：

1. 每個節點不是紅色就是黑色。
2. Root 是黑色。
3. 所有 `NIL` leaves 都視為黑色。
4. 紅色節點的 children 必須是黑色，也就是不能有連續紅節點。
5. 對任一節點 `x`，從 `x` 到任何後代 `NIL` 的 paths 都含相同數量的黑節點。

第五條控制黑色骨架的平衡，第四條則限制紅節點能在黑色骨架之間插入多少層。紅色節點不是「壞節點」；比較接近的直覺是，它允許局部 path 多一層，但不能連續累積。

定義 `b(x)` 為從 `x` 到任一 `NIL` path 上的黑節點數，不計 `x` 本身。先證明：以 `x` 為 root 的非 `NIL` descendants 至少有

```text
2^{b(x)} - 1
```

個。Base case 是 `NIL`：`b(x)=0`，非 `NIL` descendants 為零。Inductive step 中，`x` 的兩個 children 各自至少有 `2^{b(x)-1}-1` 個 descendants，再加上 `x` 自己，得到 `2^{b(x)}-1`。

另一方面，因為紅節點不能連續，任何長度為 `h` 的 root-to-NIL path 至少一半是黑節點，所以 `b(root) ≥ h/2`。若樹有 `n` 個非 `NIL` 節點：

```text
n ≥ 2^{b(root)} - 1 ≥ 2^{h/2} - 1
```

整理後得到：

```text
h ≤ 2 log₂(n + 1)
```

這就是最壞 `O(log n)` 的來源。紅黑樹不保證完美平衡，而是保證最長 path 不會比對數高度更糟。

## 插入後如何修復紅黑性質

先照普通 BST 插入新節點 `x`，再把 `x` 塗紅。選紅色有明確理由：新節點下方接兩個黑色 `NIL`，塗紅不會增加任何 path 的 black count，所以第五條先保持不變。可能壞掉的是第四條：若 parent `p` 也是紅色，就出現 red-red 衝突。

修復依 parent 與 uncle `u` 的顏色分類：

- **Parent 是黑色**：沒有 red-red 衝突，直接完成。
- **Parent 與 uncle 都是紅色**：把兩者塗黑，grandparent 塗紅。每條受影響 path 都是一個紅轉黑、一個黑轉紅，black count 不變。衝突可能被往上推到 grandparent，所以遞迴修復。
- **Parent 紅、uncle 黑**：靠 recoloring 加 rotation 把較長的一側轉回平衡，同時維持中序順序與 black count。

投影片用插入 `0` 與 `6` 展示不同形狀；notes 詳寫一個左右方向的 case，再說明鏡像情況類似。這裡的正確性不是「轉完看起來比較平衡」，而是逐條檢查：BST order 是否保留、root / NIL 顏色是否合規、是否消除 red-red，以及每條 path 的 black count 是否相同。

修復每一層只做常數次 recoloring 或 rotation，最壞一路向 root 前進，所以成本是 `O(h)`。結合高度界，紅黑樹 search 與 insert 是最壞 `O(log n)`；完整 deletion fix-up 也能達到同一界。

## 本講證明到哪裡，沒有證明什麼

官方 slides 明說，這堂課不要求背紅黑樹所有瑣碎 case；notes 也把它定位成資料結構設計的 case study，完整內容指向 CLRS Chapter 13。公開材料證明了高度界，並展示 insertion repair 的代表性 case，但沒有完整展開 deletion fix-up，也沒有逐一列完左右鏡像與折線形狀。

因此讀完這講應該能回答：五條 invariants 如何推出高度界、rotation 為何保留 BST order、插入新節點為何先塗紅，以及 recolor / rotate 在修復什麼。若要從零實作 production-ready red-black tree，只靠這堂的精簡 pseudocode 還不夠。

## 複雜度與成立條件

| 結構／操作 | 時間 | 成立條件 |
| --- | ---: | --- |
| 一般 BST search / insert / delete | `O(h)` | `h` 可能是 `n` |
| BST in-order traversal | `Θ(n)` | 每個節點恰好輸出一次 |
| Rotation | `O(1)` | 只改固定數量 pointers |
| Red-black search / insert / delete | `O(log n)` worst case | 更新後完整維持五條 invariants |
| Heap insert / extract-min | `O(log n)` | Complete binary tree + heap property |
| Heap search 任意 key | `Θ(n)` worst case | 沒有 BST 的全域順序 |

最常見的誤用，是看到「binary tree」就自動寫 `O(log n)`。二元只限制每個節點最多兩個 children，不限制高度；只有平衡條件或隨機模型能給對數界。另一個誤用是把紅黑樹稱為 complete tree；它不需要每層填滿，只需滿足顏色規則。

## 這一講在整門課的位置

前六講主要在設計與分析排序、分治與隨機演算法，常把「插入一個元素」當成抽象操作。Lecture 7 暫時往下一層，問這些操作實際怎麼由資料結構支撐。它也提前準備 Lecture 11：Dijkstra 的效率會依 priority queue 使用 array、red-black tree 或 Fibonacci heap 而改變。

下一講改問更窄的需求：若只在乎 membership、insert 與 delete，不需要排序順序，能否從紅黑樹的最壞 `O(log n)` 再往 expected `O(1)` 前進？答案是 hashing，但代價是隨機性、碰撞與不同的保證語意。

## 延伸

若要把本講變成可操作的練習，可以拿同一串 keys 做三次：依排序順序插入普通 BST、手動選一個近似中位數順序插入、再依紅黑樹規則插入。每一步都寫下樹高與搜尋 path。這會直接看見「相同 keys、不同形狀、不同成本」。

第二個練習是只實作 rotation，不急著做整棵紅黑樹。對每次旋轉前後跑 in-order traversal；輸出序列若改變，pointer 就接錯了。接著再為每個節點計算所有到 `NIL` paths 的 black count，才開始寫 insertion fix-up。這些是本站的實作建議，不是 Winter 2026 投影片新增的課程要求。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 7 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-7-binary-search-trees-and-red-black-trees)
- [Lecture 7 notes: Heaps and Binary Search Trees](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-notes.pdf)
- [Lecture 7 slides: Binary Search Trees and Red-Black Trees](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-slides.pdf)
- [Lecture 7 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-pre.pdf)

