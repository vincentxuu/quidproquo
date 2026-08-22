---
title: "Stanford CS161 Lecture 6：Sorting 下界與線性時間 Radix Sort"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, sorting, radix-sort]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 7
tldr: "Ω(n log n) 只限制 comparison sorting。若整數 key 可直接索引 bucket，stable Counting Sort 可作為 Radix Sort 的內層；在 M≤n^c 等條件下能達 O(n)。"
description: "導讀 Stanford CS161 Winter 2026 第六講：comparison decision tree 下界、Counting Sort、穩定性、LSD Radix Sort 與 radix/位數取捨。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-06-bucketsort-sorting-lower-bounds-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)的第 7 篇，對應 **Stanford CS161, Winter 2026, Lecture 6**。Moses Charikar 在 2026 年 1 月 26 日主講，官方 component 題目是 [BucketSort and Lower Bounds for Sorting](https://stanford-cs161.github.io/winter2026/lectures/#lecture-6-bucketsort-and-lower-bounds-for-sorting)。Notes 題名則是 *Sorting Lower Bounds, Counting Sort, and Radix Sort*，slides 寫 *Sorting lower bounds and O(n)-time sorting*。本文沿用官方頁的 BucketSort 名稱，也明確指出材料實際講的 bucket 演算法叫 Counting Sort。使用來源為課前練習、notes 與 slides；Canvas 錄影未使用。

前五講一直用比較決定順序：問 `a<b`，再依答案分支。MergeSort 已做到 worst-case `O(n log n)`，那能不能繼續改到 `O(n)`？答案不是單純的可以或不可以，而是先問：**演算法被允許對 key 做什麼？** 第六講先在 comparison model 證明 `Ω(n log n)`，再讓演算法直接讀整數 key，用 Counting Sort 與 Radix Sort 繞出比較模型。兩者並不矛盾。

## Lower bound 永遠依賴計算模型

Comparison-based sorting 只能透過兩元素比較取得次序資訊，不能把 key 當陣列索引、不能讀某一位數字，也不能根據數值做算術分桶。在此模型裡，演算法可能很複雜，卻仍只能以比較答案逐步區分輸入排列。

Lower bound 的句子因此必須帶模型：任何 deterministic comparison sorter 都有某個輸入需要 `Ω(n log n)` 次比較。它不是說「宇宙中任何排序都至少 `n log n`」，也不是針對某一支程式碼。若後面允許直接利用有限 key 範圍，問題的資訊介面已改變，下界自然不再直接適用。

## 把比較排序畫成 decision tree

固定一個 deterministic comparison algorithm 與 `n` 個互異元素。可把所有可能執行畫成二元 decision tree：

- 每個內部節點是一個 yes/no 比較，例如「`a_i<a_j` 嗎？」
- 左右分支代表兩種答案。
- 每個葉節點給出演算法最後認定的排列。
- 一個具體輸入從根走到一個葉；路徑長度就是該輸入做的比較數。

`n` 個互異物件共有 `n!` 種可能相對次序。正確演算法必須區分它們，所以樹至少要有 `n!` 個對應輸出的葉。深度小於 `h` 的二元樹最多有 `2^h` 個葉；若最大深度是 `h`，便需：

```text
2^h ≥ n!
h ≥ log₂(n!)
```

再用 Stirling 近似的漸近資訊：

```text
log(n!) = Θ(n log n)
```

便得出某條根到葉路徑至少 `Ω(n log n)`，也就是 deterministic comparison sorting 的 worst-case 下界。更粗略也可只取乘積後半：`n! ≥ (n/2)^(n/2)`，立刻得到 `log₂(n!) ≥ (n/2)log₂(n/2)=Ω(n log n)`，不必依賴 Stirling 的精確常數。

這也解釋 MergeSort 的地位：它的 worst-case 上界 `O(n log n)` 與模型下界相合，因此在 comparison model 中漸近最優。最優不代表常數最小，也不代表每個資料型態都該用 MergeSort；它只表示比較次數的成長階無法再降。

Slides 另陳述 randomized comparison sorting 的 expected lower bound 仍是 `Ω(n log n)`，但明確略過正式證明。上面的 deterministic decision-tree 計數不能原封不動就宣稱證完 randomized 版本；隨機算法相當於對多棵 deterministic trees 的分布，完整處理需要額外論證。本篇只保留課堂結論，不替材料補一個未提供的證明。

## 生日月份透露的出口

課前練習用生日月份排序。若學生 key 只有 1 月到 12 月，沒必要一直比較兩位學生誰較早；建立 12 個 bucket，掃過每位學生，把他放進對應月份，再依 1 月到 12 月串起來即可。這一步直接讀月份 key，已不在純 comparison model。

這個例子揭示 lower bound 的正確閱讀方式：不是找「反例推翻定理」，而是確認新演算法使用了定理禁止的操作。有限整數 key 帶來額外結構；代價則是 bucket 數量與 key 表示方式會進入時間、空間分析。

## Counting Sort：key 直接對應 bucket

假設輸入有 `n` 個物件，每個 key 屬於 `{0,...,r-1}`。課堂版本的 Counting Sort 可以寫成：

```text
CountingSort(A, key, r):
  create FIFO buckets B[0], ..., B[r-1]
  for x in A, in input order:
    append x to B[key(x)]
  return B[0] ++ B[1] ++ ... ++ B[r-1]
```

「Counting Sort」有時指先計數、做 prefix sums、再寫入輸出陣列的教科書實作；本講用 FIFO linked-list buckets 表達同一個按有限 key 分組並依序輸出的核心。官方 component 把整堂稱 BucketSort，notes 則將具體程序稱 Counting Sort，這是命名層級差異，不應擅自統一成材料沒有用過的名稱。

正確性很直接。若 `key(x)<key(y)`，`x` 所在 bucket 先被輸出，所以 `x` 在 `y` 前。相同 key 的物件進入同一 bucket；因為按輸入順序 append 到尾端，它們離開 bucket 時相對順序不變，所以演算法是 **stable**。

建立 `r` 個 bucket 要 `O(r)`，分配 `n` 個元素要 `O(n)`，串接或掃過 buckets 也要 `O(n+r)`，總時間為：

```text
O(n+r)
```

空間也會受 `n+r` 影響。若 `r=O(n)`，時間是 `O(n)`；若只有十個輸入，key 卻可能到十億，先建立十億個 bucket 就不合理。Counting Sort 的線性不是無條件，它把比較成本換成與 key universe 大小相關的初始化和儲存成本。

## 為什麼 stability 不是裝飾

只做一次 Counting Sort 時，若輸出只要求按 key 排序，相同 key 的順序可以任意。但 Radix Sort 要連做多輪：後一輪處理高位時，必須保留前一輪已排好的低位關係。這時 stability 變成正確性條件。

例如兩個數的十位相同、個位不同。處理個位後已決定誰在前；下一輪按十位分入同一 bucket，若 bucket 內任意重排，個位成果就被破壞。FIFO append 正好保留它。若把 append 改成 push-to-front，單輪仍按 key 分組，卻不再 stable，也不能直接用在本講的 LSD Radix Sort 證明。

## Radix Sort：從最低位開始

把每個非負整數看成 `d` 位 base-`r` 數，較短者在高位補零。LSD Radix Sort 依序對最低有效位、第二低位，直到最高位，各做一次 stable Counting Sort：

```text
for position = 0 to d-1:
  stable-CountingSort(A, digit(position), r)
```

Slides 使用：

```text
21, 345, 13, 101, 50, 234, 1
```

補成三位數後，先依個位、再十位、最後百位排序，結果是：

```text
1, 13, 21, 50, 101, 234, 345
```

第一輪後只保證個位順序；第二輪把十位不同者分組，同十位者因 stable 保留個位順序；第三輪同理完成三位數的字典式數值順序。

為何不能直接從最高位開始，仍對整個陣列一輪輪 stable sort？處理完最高位後，下一輪若按較低位重排不同高位群組，會破壞高位優先級。MSD Radix Sort 可以成立，但需要在各高位 bucket 內遞迴等不同結構；它不是把這段 LSD 迴圈反向就完成。

## Radix Sort 的歸納正確性

正式命題是：第 `k` 輪結束後，陣列依最低 `k` 位所代表的數值有序。

基底可取 `k=0`，沒有位數時命題 vacuously true；或取 `k=1`，由 Counting Sort 對最低位正確。歸納步考慮任意兩數：若第 `k` 位不同，本輪 bucket 順序依該位決定；若第 `k` 位相同，stable inner sort 保留它們進入本輪前的相對順序，而依歸納假設，那個順序已由低 `k-1` 位正確決定。因此本輪後按低 `k` 位有序。當 `k=d`，全部位都已納入，整個數值順序完成。

這份證明同時指出兩個必要條件：處理順序是 LSD-first，而且每輪 sorter 必須 stable。只背「Radix Sort 是線性」卻忘記這兩個不變量，就無法解釋演算法為何正確。

## `r`、`d` 與最大值 `M` 的取捨

每一輪 Counting Sort 花 `O(n+r)`，共有 `d` 輪：

```text
T(n)=O(d(n+r))
```

若最大 key 為 `M`，base `r` 所需位數是：

```text
d = floor(log_r M)+1
```

`+1` 不能隨意刪掉。當 `M<r` 時，`log_r M<1`，資料仍至少要一位、做一輪。選大 radix 會降低位數，卻增加每輪 bucket 數；選小 radix 則 buckets 少但輪數多。

Slides 把十進位例子改成 base 100：只需較少輪，卻要 100 個 buckets。一般取 `r=n`，讓掃描輸入與初始化 buckets 同階，可得：

```text
O(n(floor(log_n M)+1))
```

若 `M≤n^c`，其中 `c` 是常數，則 `log_n M≤c`，輪數為常數，總時間 `O(n)`。這就是本講「線性時間 sorting」的精確前提。若 `M=2^n`，則 `log_n M=n/log₂n`，時間約為：

```text
O(n²/log n)
```

它甚至比 `n log n` 差，提醒我們 key 大小不是可忽略的旁註。此外，直接取位、算 bucket index 被視為什麼成本，也依賴 word-operation model；若任意精度整數的一位操作並非常數時間，分析還要把表示成本算進去。

## 沒有推翻下界，只是換了問題介面

Decision-tree proof 說，每次只能得到一個二元比較答案時，要區分 `n!` 種排列需 `Ω(n log n)` 深度。Counting Sort 一次讀 key 就能選擇 `r` 個位置之一，得到的資訊介面不同；Radix Sort 又把 key 拆成可直接索引的 digits。它們沒有在同一模型內打敗 lower bound。

反過來，非比較排序也不必然更快。若 key 範圍太大、位數太多、bucket 初始化昂貴，`O(d(n+r))` 可能輸給 comparison sorter。選演算法前要問：key 是否為有限整數？範圍 `M` 與 `n` 如何成長？記憶體是否容得下 `r` 個 buckets？是否要求 stability？只看 `O(n)` 標籤會漏掉真正的限制。

本講也假設輸入能轉成固定長度、非負的 base-`r` 表示。Signed integers、變長字串或複合 key 都能設計對應 radix 方法，但符號、終止符與字典序需要額外規則；Winter 2026 這一講沒有展開，本篇不把它們混入課內算法。

## 這一講在十八講裡的位置

Lecture 6 把前半段的漸近分析推到「模型」層次。前面問某算法多快；這裡先問一整類算法最快可能多快，再展示改變允許操作後能發生什麼。這種思路會反覆出現在演算法設計：lower bound 與 upper bound 只有放在同一問題、同一模型、同一保證類型下才可比較。

紙筆自我檢查可以選 `21,345,13,101,50,234,1`，把每輪輸出完整寫下，並在相同 digit 的元素間畫箭頭追蹤原相對順序。再故意把 bucket 改成從前端插入，找出哪一輪開始錯。這會把 stability 從名詞變成歸納證明的必要機械條件。

## 延伸

Randomized comparison lower bound 的正式證明通常要處理「對 deterministic trees 的分布」，常見工具會連到 distributional reasoning。官方 slides 只陳述結論並略過證明，因此若要補上，應另選一手教材並獨立標示，不能把 deterministic 葉節點計數偷偷改名。

工程上的 radix 實作也常用固定機器字寬、陣列式 counting 與多 pass buffer，而不是 linked-list buckets。這可能改善 cache locality 與常數，但不改核心取捨：每 pass 處理 `n` 個項目，radix 決定 bucket 工作，位寬決定 pass 數。理論式 `d(n+r)` 是評估這些選擇的骨架，不是替硬體量測下結論。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 6](https://stanford-cs161.github.io/winter2026/lectures/#lecture-6-bucketsort-and-lower-bounds-for-sorting)
- [Lecture 6 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-pre.pdf)
- [Lecture 6 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-notes.pdf)
- [Lecture 6 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture6-slides.pdf)
