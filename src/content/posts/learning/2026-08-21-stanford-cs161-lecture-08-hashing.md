---
title: "Stanford CS161 Lecture 8：雜湊、碰撞與期望 O(1) 到底保證什麼"
date: 2026-08-21
category: learning
tags: [cs161, algorithms, stanford, hashing, randomized-algorithms]
lang: zh-TW
type: deep-dive
description: "逐段拆解 Stanford CS161 Winter 2026 第 8 講：chaining 雜湊表、固定函數的最壞輸入、universal hashing 的碰撞界，以及生日問題帶來的容量直覺。"
tldr: "Universal hash family 只需讓任意兩個不同 key 的碰撞機率不超過 1/n，就能把某個 key 所在 bucket 的期望長度壓到 2 以下；這給的是 expected O(1)，不是每次操作的最壞 O(1)。"
draft: false
series:
  name: "Stanford CS161 導讀"
  order: 9
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-08-hashing-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)第 9 篇，對應 **Stanford CS161, Winter 2026, Lecture 8**。官方課名是 **Hashing**，上課日期為 2026 年 2 月 2 日，講師是 Ellen Vitercik。

本篇依照[官方 Lecture 8 頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-8-hashing)、公開 notes 與 slides 整理。投影片的主線走到 universal hashing；notes 還延伸到 balls-and-bins 與 birthday paradox，我會明確標成講義延伸。官方頁另連到沿用 `winter2025-extra` 的 Colab notebook，但本文沒有把它當成 Winter 2026 新製教材。Canvas-only 錄影未作為來源。

Lecture 7 的紅黑樹已把搜尋、插入、刪除壓到最壞 `O(log n)`。Lecture 8 進一步問：若我們不需要排序順序，只想做 membership，能不能接近期望常數時間？雜湊表的答案不是「找到一個永遠均勻的神奇公式」，而是把隨機性放進演算法，對任何預先固定的 key 集合控制碰撞機率。

## 為什麼 direct addressing 不夠

若所有 key 都來自小集合 `{0,1,…,9}`，最簡單的方法是配置十格陣列，讓 key `k` 直接放在第 `k` 格。搜尋、插入與刪除都只需一次索引，的確是 `O(1)`。這叫 direct addressing。

問題是 universe `U` 往往極大。假設 key 是 64-bit 字串，可能值有 `2^64` 種；實際同時儲存的 key 也許只有幾千個。為每個可能 key 留一格，空間遠超過資料本身。

因此我們配置較小的 `n` 個 buckets，再用函數

```text
h : U → {0, 1, …, n-1}
```

把 key 映到 bucket。因為 `|U|` 遠大於 `n`，不同 keys 一定可能得到相同輸出，這就是碰撞（collision）。本講採用 chaining：每個 bucket 放一條鏈結串列，所有映到同一位置的 keys 都串在那裡。

對 key `k` 做操作時，先算 `h(k)`，再掃對應 chain。Insert 可以把新節點放在串列開頭，但若集合不允許重複 key，仍得先搜尋一次。Lookup 與 Delete 也都和 chain 長度成正比。因此問題被轉換成：如何避免某些 buckets 太長？

## 一個具體的 chaining 例子

官方 notes 使用五個 buckets 與

```text
h(x) = (13x + 2) mod 5
```

插入 `{1,2,4,7,8}`。結果是：

```text
B0 → 1
B1 → 8
B2 → NIL
B3 → 2 → 7
B4 → 4
```

`2` 和 `7` 都映到 bucket 3，形成碰撞。這沒有破壞正確性；chaining 仍保留兩個 keys。它只影響成本：查 `7` 得先進入 `B3` 再沿串列找。

課堂分析假設同時儲存的 keys 不超過 buckets 數量，也就是 load factor 不超過 1。真實實作若持續超過容量，通常會擴大 table 並 rehash 全部 keys。官方 notes 明確把 resizing 排除在這次模型外，所以本講的 expected bound 不能直接當成完整雜湊表實作的所有成本。

## 固定雜湊函數擋不住最壞輸入

直覺上可以挑一個「看起來很亂」的 deterministic function，希望 keys 均勻散開。但對任何固定 `h`，universe 中一定有許多 keys 映到同一 bucket。若對手知道 `h`，便能從那個 preimage 挑出整組 keys，讓一條 chain 長到 `n`。

這是量詞順序的問題。以下目標不可能達成：

```text
存在固定 h，使所有大小為 n 的 key 集合都均勻分散。
```

因為 `h` 把 `|U|` 個可能值塞進 `n` 個 buckets，至少一格接收約 `|U|/n` 個 universe keys。對手只需從那一格選輸入。

課堂提出兩條繞路：假設輸入 keys 隨機，或讓 hash function 隨機。前者難以辯護；使用者 ID、網址、字典字串都可能有結構。後者較能控制：先固定任意 key 集合，再由演算法私下隨機選 `h`。分析對每個固定集合都成立。

## 完全隨機函數為何能給常數期望

先做一個理想化假設：從所有 `U→{0,…,n-1}` 函數中均勻選 `h`。目前 table 裡有 `x₁,…,xₙ`，考慮操作 key `xᵢ`。令 `X` 是 `xᵢ` 所在 bucket 的大小。

把 `X` 寫成 indicator variables 的總和：每個 `xⱼ` 若和 `xᵢ` 碰撞就貢獻 1。線性期望值給出：

```text
E[X] = Σⱼ Pr[h(xᵢ)=h(xⱼ)]
     = 1 + Σⱼ≠ᵢ Pr[h(xᵢ)=h(xⱼ)]
     = 1 + (n-1)/n
     < 2
```

第一個 1 是 `xᵢ` 一定和自己同 bucket。完全隨機函數讓任意另一個 key 撞進同一格的機率是 `1/n`。因此操作掃過的 chain 期望長度小於 2，若計算 `h(k)` 是 `O(1)`，Insert、Lookup、Delete 都有 expected `O(1)` 成本。

這裡有三個不能省略的字：

- **Expected**：平均是對選擇 hash function 的隨機性取期望，不是每一次都只看兩個節點。
- **固定輸入**：key 集合要在隨機函數選出前決定；能看到 `h` 再自適應挑 key 的對手不在這份簡化證明裡。
- **Load 假設**：表中至多 `n` 個 keys；若放進遠多於 `n` 個元素，平均 chain 當然會長。

## 完全隨機函數好分析，卻無法保存

所有 `U→{0,…,n-1}` 函數共有 `n^{|U|}` 個。要指明其中一個，資訊量約為

```text
log₂(n^{|U|}) = |U| log₂ n
```

bits。實際上等於為 universe 每個 `x` 記錄 `h(x)`。這比只儲存目前集合還昂貴。

也不能「第一次看到 x 才隨機生成 h(x)，之後記住」。下一次要知道 x 是否看過，仍需要一個能查 x 的資料結構；這正是原本想用雜湊表解的問題。完全隨機函數是一個分析基準，不是可接受的實作。

關鍵觀察是：前一節的證明沒有使用完整隨機性。它只用到任意不同 `xᵢ,xⱼ` 的碰撞機率不超過 `1/n`。只要找一個小型函數族滿足這一條，就能沿用期望成本證明。

## Universal hash family 的合約

函數族 `F` 若滿足下列條件，就稱為 universal：對任意 `xᵢ≠xⱼ`，從 `F` 均勻隨機選 `h` 時，

```text
Pr[h(xᵢ)=h(xⱼ)] ≤ 1/n
```

這是 pairwise collision guarantee，不是說每個函數都很均勻，也不是要求所有 keys 的輸出彼此完全獨立。把這條 bound 放回 indicator proof，仍得到 `E[X]<2`。

課堂建構的 family 如下。把 universe keys 編碼為 `0,…,|U|-1`，選 prime `p≥|U|`，並令

```text
hₐ,ᵦ(x) = ((ax+b) mod p) mod n
```

其中 `a∈{1,…,p-1}`，`b∈{0,…,p-1}`。實作只需隨機選並保存 `(a,b)`，而不是保存一張涵蓋整個 universe 的表。`a` 不能為 0，否則所有輸入都會被送到同一個常數 `b`。

## 為什麼這個 family 是 universal

先暫時拿掉最後的 `mod n`，定義

```text
fₐ,ᵦ(x) = (ax+b) mod p
```

固定不同的 `x₁,x₂` 與不同的目標輸出 `y₁,y₂`。方程

```text
ax₁+b ≡ y₁ (mod p)
ax₂+b ≡ y₂ (mod p)
```

相減後得到

```text
a(x₁-x₂) ≡ y₁-y₂ (mod p)
```

因為 `p` 是 prime 且 `x₁-x₂` 非零，它在 modulo `p` 下有乘法反元素，所以 `a` 唯一；代回第一式後 `b` 也唯一。換句話說，每一組不同 outputs `(y₁,y₂)` 對應 family 中恰好一個 `(a,b)`。

接著問：經過最後的 `mod n`，哪些不同 `y₁,y₂` 會掉進同一 bucket？固定 `y₁` 後，最多約 `(p-1)/n` 個 `y₂` 和它 modulo `n` 同餘。共有 `p` 種 `y₁`，所以造成碰撞的 functions 至多 `p(p-1)/n` 個。Family size 是 `p(p-1)`，因此：

```text
Pr[hₐ,ᵦ(x₁)=hₐ,ᵦ(x₂)] ≤ [p(p-1)/n] / [p(p-1)] = 1/n
```

證明完成。這個論證也解釋了每個條件的用途：prime 讓非零差可逆，排除 `a=0` 避免 constant function，最後 `mod n` 才把 prime field 的結果收進實際 bucket 範圍。

## 講義延伸：balls-and-bins 與生日問題

Notes 把 random hashing 抽象成 `m` 顆 balls 隨機丟進 `n` 個 bins。Keys 是 balls，buckets 是 bins。這個模型先問：要多少 balls，才很可能至少有一對碰撞？

完全沒有碰撞的機率是：

```text
Pr[no collision] = ∏ᵢ₌₁^{m-1}(1-i/n)
```

用 `1-x≤e^{-x}`：

```text
Pr[no collision] ≤ exp(-m(m-1)/(2n))
```

當 `m` 約為 `√(2 ln 2)√n≈1.18√n` 時，無碰撞機率低於二分之一。這就是生日問題的尺度：不是接近 `n` 個 items 才開始撞，而是約 `√n` 就有顯著機率出現至少一對。

但「至少一次碰撞」和「操作很慢」不是同一事件。Chaining 可以容許少量碰撞，期望 chain 仍是常數。若堅持完全零碰撞，table size 得比 items 數的平方還大，空間非常浪費。

Notes 也把相同計算用到 random IDs。若給 `m` 位使用者隨機 `b`-bit ID，collision probability 的 union bound 約為 `m²/2^{b+1}`。要讓它不超過 `δ`，可選：

```text
b ≥ 2 log₂ m - 1 + log₂(1/δ)
```

這是官方 notes 的延伸，不是投影片主線。

## 複雜度與保證語意

| 情況 | Insert / Lookup / Delete | 說明 |
| --- | ---: | --- |
| 固定 deterministic `h` 的最壞輸入 | `Θ(n)` | 所有 keys 可進同一 chain |
| 完全隨機 `h` | expected `O(1)` | 好分析但函數無法有效保存 |
| 從 universal family 隨機選 `h` | expected `O(1)` | 對固定 key 集合，pair collision ≤ `1/n` |
| 超過容量且不 resize | 隨 load factor 增加 | 本講模型不涵蓋完整 resizing 成本 |

空間方面，chaining table 本身有 `n` 個 bucket heads，加上實際 keys，為 `O(n)`（在 keys 數也不超過 n 的模型下）。完全隨機函數的描述要 `Θ(|U|log n)` bits；universal family 只需保存兩個 modulo-p 參數，描述短得多。這裡仍假設 word arithmetic 與 `h(x)` 計算可視為常數時間。

## 最容易誤用的四件事

第一，expected `O(1)` 不等於 amortized `O(1)`。Expected 是對隨機選擇取平均；amortized 是對一串操作總成本取平均，即使完全沒有隨機性也可能成立。這兩種分析會在 Lecture 11 再同場出現。

第二，universal 不代表 cryptographic。這堂課控制資料結構碰撞的期望成本，沒有主張抗 preimage、抗偽造或密碼學安全。

第三，固定一個 universal family 成員永久公開後，不能繼續把每個惡意輸入都當成 oblivious input。證明的量詞是先固定 keys，再隨機選 h。

第四，本講用 chaining，不是 open addressing。投影片明確說 open addressing 不在課程要求內；兩者的 load、collision resolution 與 deletion 細節不同。

## 這一講在整門課的位置

Lecture 7 用紅黑樹換到 deterministic worst-case `O(log n)`，同時保留排序。Lecture 8 放棄排序查詢，改用 randomized guarantee 換 expected `O(1)` membership。兩堂課擺在一起，重點不是背兩張 operation table，而是學會讀保證的條件：worst-case、expected、資料結構 invariant、input model 都不可省略。

Lecture 9 開始進入 graph algorithms。Adjacency list 中「某 vertex 的 neighbors」本身就是一個資料結構選擇；之後 Dijkstra 的 priority queue 也會再次提醒我們，演算法的總成本會被底層操作的實作改寫。

## 延伸

要把 universal hashing 的證明變成自己的，可以固定一個小 prime，例如 `p=11`、`n=5`，列出幾組 `(a,b)`，手算兩個不同 keys 碰撞的比例。重點不是得到漂亮分布，而是核對比例不超過 `1/n`。

若在寫實作，另做一張觀測表：每次插入後記錄 load factor、最大 chain 長度與平均成功 lookup 掃描數。當 load factor 超過門檻時才實作 resize / rehash，並另外分析那串操作的 amortized cost。這些是本站的練習建議，不是 Winter 2026 課堂新增結論。

## 參考資料

- [Stanford CS161 Winter 2026 — Lecture 8 official anchor](https://stanford-cs161.github.io/winter2026/lectures/#lecture-8-hashing)
- [Lecture 8 notes: Hashing](https://stanford-cs161.github.io/winter2026/assets/files/lecture8-notes.pdf)
- [Lecture 8 slides: Hashing](https://stanford-cs161.github.io/winter2026/assets/files/Lecture8.pdf)
- [Lecture 8 課程 metadata 與資源清單（官方 component）](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture8.md)
