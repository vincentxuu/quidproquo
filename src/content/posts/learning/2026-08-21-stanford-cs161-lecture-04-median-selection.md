---
title: "Stanford CS161 Lecture 4：Median of Medians 如何保證線性 Selection"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, selection, median-of-medians]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 5
tldr: "Selection 不必先排序。Median of medians 每 5 個元素取中位數，再取這些中位數的中位數作 pivot，保證較大的遞迴側至多 7n/10+5；用 substitution 可證 worst-case O(n)。"
description: "導讀 Stanford CS161 Winter 2026 第四講：k-th selection、pivot、median of medians、平衡引理、線性時間 recurrence 與強歸納正確性證明。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-04-median-selection-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)的第 5 篇，對應 **Stanford CS161, Winter 2026, Lecture 4**。Moses Charikar 在 2026 年 1 月 14 日主講，官方題目是 [Median and Selection](https://stanford-cs161.github.io/winter2026/lectures/#lecture-4-median-and-selection)。本文使用一頁課前練習、九頁講義與 66 頁投影片；Canvas 錄影未使用，notebook 與概念檢核也未列為已讀。

Selection 的輸入是含 `n` 個數的陣列 `A` 與 `k∈{1,...,n}`，輸出第 `k` 小元素。最直接的做法是先用 MergeSort 排序，再取第 `k` 個，時間 `O(n log n)`。但只要一個順位，真的需要知道其他所有元素的完整順序嗎？第四講的答案是不用，而且 deterministic worst-case 可以做到 `O(n)`。

## 從最小值看出 Ω(n) 下界

`k=1` 時，selection 就是找最小值。線性掃描維護目前最小值，花 `O(n)`。這已經最佳：若 deterministic 演算法沒有看某個 `A[i]`，把那格改成比輸出更小的數，演算法執行完全相同，仍回傳舊答案，於是出錯。任何正確算法在某種意義上都得讓每個元素有機會被排除，所以下界是 `Ω(n)`。

一般 selection 也至少需要線性資訊。問題因此變成：能否達到下界，而不是能否比排序快一點。

## Select 的骨架：partition 後只走一邊

暫時假設元素互異，並採 1-indexed 的 `k`：

```text
Select(A, k):
  if |A| = 1: return A[1]
  p = ChoosePivot(A)
  L = {x in A | x < p}
  R = {x in A | x > p}
  if |L| = k-1: return p
  if |L| > k-1: return Select(L, k)
  return Select(R, k-|L|-1)
```

Pivot `p` 把陣列分成小於與大於兩側。和 QuickSort 不同，Select 只遞迴答案所在的一側。若左側有 `k-1` 個元素，`p` 正是第 `k` 小；若左側太大，順位不變；若答案在右側，新的順位要扣掉左側全部元素與 pivot 本身。

以 `[6,4,8,9,5,2,1]` 找第 3 小為例，選 `p=5`，`L={4,2,1}`。左側有 3 個，超過 `k-1=2`，所以答案是 `L` 的第 3 小，即 4。若原本找第 6 小，則進右側 `{6,8,9}`，新順位是 `6-3-1=2`。

## Pivot 不影響正確性，只影響速度

強歸納命題是：對任意長度 `n` 的互異元素陣列與合法 `k`，`Select(A,k)` 回傳第 `k` 小。

基底 `n=1` 只有一個合法順位。歸納步依 `|L|` 分三種情況。`|L|=k-1` 時，恰有 `k-1` 個元素比 `p` 小；`|L|>k-1` 時，第 `k` 小仍在 `L`，且 `L` 較短，可套歸納假設；`|L|<k-1` 時，答案在 `R`，其右側順位為 `k-|L|-1`，同樣落在合法範圍。三種情況都不需要 pivot 接近中位數。

這個分離很重要：**任何 pivot 都正確，好 pivot 才快。** 正確性證明與時間證明用的是不同性質，不能把「平衡」寫進正確性必要條件。

## 最差、理想與隨機 pivot

若每次選到最小或最大值，只排除一個元素。本層 partition 是線性，遞迴式為：

```text
T(n)=T(n-1)+Θ(n)=Θ(n²)
```

若每次能選到真正 median，較大一側至多一半：

```text
T(n)≤T(n/2)+cn
```

展開為 `cn+cn/2+cn/4+...<2cn`，是 `O(n)`。但「先在線性時間找到 median」正是原問題，直接把 median 當免費 pivot 是循環論證。

Random pivot 的期望時間也可達 `O(n)`，而且實務常數通常較小；本講 notes 只陳述結果，沒有證明。課堂要追求的是 deterministic worst-case 保證，因此需要一個能在線性時間找到「夠接近 median」的 pivot。

## Median of medians 的五個步驟

Blum、Floyd、Pratt、Rivest、Tarjan 的做法是：

1. 把 `A` 分成 `ceil(n/5)` 組，每組最多 5 個。
2. 各組排序並取中位數。組大小固定，所以每組是常數時間，全部合計 `O(n)`。
3. 把所有組內中位數放入集合 `C`。
4. 遞迴呼叫 Select，找 `C` 的中位數 `p`。
5. 用 `p` partition 原陣列，再只遞迴答案所在側。

它不是先求原陣列的 median，而是求約 `n/5` 個代表值的 median。這個 surrogate 比真正 median 便宜，卻保證不會靠近極端。

## 為什麼較大側至多 7n/10+5

`p` 是組內中位數集合的中位數。因此約一半組的中位數小於 `p`。在每個完整五元素組中，若組中位數小於 `p`，至少有三個元素小於 `p`：中位數本身與更小的兩個。扣掉含 `p` 的組與可能不滿五個的尾組，講義給出 `p` 至少大於：

```text
3(ceil(g/2)-2),  g=ceil(n/5)
```

個元素。對大於 `p` 的方向完全對稱。因此：

```text
|L| ≤ 7n/10 + 5
|R| ≤ 7n/10 + 5
```

這不是說 pivot 恰好切成 30/70；它是帶尾組修正的 worst-case 上界。真正需要的只是每次都能丟掉固定比例，而不是找到精確 median。

可以把「三成淘汰」拆成兩層數數。第一層在 `g=ceil(n/5)` 個組中，因 `p` 是組中位數集合的 median，至少約 `g/2` 個組中位數不大於 `p`。第二層回到每個完整五元素組：組中位數以下至少有三個元素。理想化忽略例外時，保證量就是 `(g/2)·3≈3n/10`。證明中的 `-2` 並非神祕常數，而是在保守扣掉含 pivot 的組與可能不足五個的尾組；再把 ceiling 展開，便吸收到 `+5`。

分組大小五也不是只為方便畫圖。若每組三個，類似計數只能保證約 `n/3` 在兩側，而 recurrence 的兩個遞迴比例會逼近 `1/3+2/3=1`，沒有留下線性工作的餘裕。五個一組讓「找代表值」約為 `n/5`，較大答案側約為 `7n/10`，兩者相加 `9n/10<1`；這個嚴格小於 1 的空隙，正是 substitution 能吸收本層 `cn` 的原因。

若想具體看見保證，可取 25 個互異元素，排成五組。五個組中位數的 median 是 `p`。至少兩個完整組的中位數嚴格小於 `p`，每組各帶來三個不大於該中位數的元素；大於側對稱。實際淘汰量常比這更多，但分析只使用無論輸入如何排列都一定存在的數量。Worst-case proof 的藝術，是只承諾 adversary 拿不走的部分。

## 為什麼 recurrence 是線性的

找組中位數的中位數，要遞迴處理約 `n/5` 個元素。Partition 後較大遞迴側至多 `7n/10+5`。其餘分組、固定大小排序與掃描都在線性時間內：

```text
T(n) ≤ T(n/5+1) + T(7n/10+5) + cn
```

Master Theorem 不適用，因兩個子問題大小不同。講義先忽略加法常數，分析：

```text
T(n) ≤ T(n/5)+T(7n/10)+cn
```

用 substitution 猜 `T(n)≤dn`。若較小輸入都成立：

```text
T(n) ≤ dn/5 + 7dn/10 + cn
     = (9d/10+c)n
```

只要 `d≥10c`，右式至多 `dn`。所以簡化 recurrence 為 `O(n)`。精確式裡的 `+1,+5` 需要調整 base threshold、平移函數或更強命題；slides 提示這個技術點，沒有把完整代數當主線。本文不把簡化證明冒充成已處理所有取整常數的完整版本。

兩個遞迴呼叫扮演不同角色：`T(n/5+1)` 是為了**選 pivot**，`T(7n/10+5)` 才是為了**找原問題答案**。它們不像 MergeSort 那樣各自產出一半答案再合併。若漏掉前者，就把 median of medians 當成免費；若 partition 後把兩側都遞迴，又會把 selection 錯算成 sorting。

精確常數為何麻煩，也可從線性猜測看出。直接把 `T(m)≤dm` 套進含 `+1,+5` 的式子，會多出約 `6d` 的常數，不能靠 `cn` 的係數比較自動消失。一種修法是只對 `n≥n₀` 證明，讓固定誤差被更有餘裕的假設吸收；另一種是猜 `T(n)≤dn-e` 或平移輸入。課堂只要求理解修證方向，不是把簡化式假裝成 exact recurrence。

最後，線性上界與正確性仍是兩條獨立鏈。即使 balance lemma 算錯，任意 pivot 的 Select 仍會回傳正確順位，只是可能變慢；反之，即使每次切分漂亮，右側順位若忘了減 `|L|+1`，答案仍會錯。把「排序關係證答案」與「淘汰比例證時間」分兩段，能避免彼此偷渡前提。

這也提供實作測試的分層方式：先用小陣列窮舉不同 `k`，確認每次都回傳排序後的第 `k` 個值；再另外記錄每層子問題大小，檢查 median-of-medians 是否達成淘汰保證。答案測試不能證明 worst-case 線性，遞迴比例漂亮也不能證明順位更新無誤。

空間取決於 partition 是否複製陣列。講義偽程式建立 `L`、`R`，自然會有線性額外儲存；原地 partition 可降低配置，但 median-of-medians 的實作仍需管理組與遞迴。官方本講的保證重點是時間，不是未指定實作的精確空間界。

## 最容易寫錯的三個地方

第一，右側順位少減 pivot。公式必須是 `k-|L|-1`，因為移除的不只左側，還有 pivot。

第二，把每組排序錯算成 `O(log n)` 或 `O(n log n)`。每組永遠最多五個，成本是常數；有 `O(n)` 組元素總量，所以合計線性。

第三，把 `7n/10+5` 寫成 exact 70/30 split。這只是兩側大小的保證上界，`+5` 正在吸收不完整組等邊界。

另有一個材料假設：元素互異。若有重複值，應做 `<p`、`=p`、`>p` 三向 partition，並依等值區間判斷順位。Winter 2026 notes 說想法容易推廣，但沒有寫出完整版本，因此本文不把重複值處理混進課堂偽程式。

## 這一講在十八講裡的位置

Lecture 4 同時完成兩件事。它給出第一個看似不可能、卻達到 `Ω(n)` 下界的演算法；也立刻展示 Master Theorem 的邊界，迫使讀者使用上一講的 substitution method。

下一講會保留 pivot 與 partition，卻把「只走一側」改成「兩側都排序」，得到 QuickSort。Median-of-medians 提供 deterministic worst-case，random pivot 則引出 expected runtime。兩講放在一起讀，能清楚分辨算法正確性、pivot 品質與隨機性是三個不同問題。

自我檢查可以做一組 25 個互異數：每五個分組、圈出組中位數、再圈出 median of medians。不要先算完整排序，只數能保證在 pivot 兩側的元素。若能從「半數的組，每組至少三個」推回 30% 淘汰比例，balance lemma 就不再只是 `7/10` 的記憶題。

## 延伸

工程實作常選 random pivot，因為程式短、常數小；需要敵對輸入保證時，才更重視 deterministic selection。這不是說理論算法沒有用，而是保證也有成本。應先寫清楚威脅模型：輸入能否被攻擊者安排？延遲尾端是否比平均吞吐重要？再決定 pivot 策略。

還可以比較「先排序」與「只 selection」的輸出價值。若後續還會問許多不同順位，先排序的 `n log n` 可能被多次查詢攤平；若只問一次 median，線性 selection 才完整發揮。複雜度永遠要連著整個工作負載，而不是只看一個函式名稱。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 4](https://stanford-cs161.github.io/winter2026/lectures/#lecture-4-median-and-selection)
- [Lecture 4 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-pre.pdf)
- [Lecture 4 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-notes.pdf)
- [Lecture 4 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture4-slides.pdf)
