---
title: "Stanford CS161 Lecture 5：Randomized QuickSort 的期望時間怎麼證"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, quicksort, randomized-algorithms]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 6
tldr: "Randomized QuickSort 對每個固定輸入都有 O(n log n) 期望時間，但最壞仍是 Θ(n²)；正確證明不是把期望子問題大小代入 recurrence，而是計算每對元素被比較的機率。"
description: "導讀 Stanford CS161 Winter 2026 第五講：Las Vegas 演算法、QuickSort、錯誤的平均切半論證、indicator variables、線性期望與 in-place partition。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-05-randomized-algorithms-quicksort-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161)的第 6 篇，對應 **Stanford CS161, Winter 2026, Lecture 5**。Moses Charikar 在 2026 年 1 月 21 日主講，官方題目是 [Randomized Algorithms and QuickSort](https://stanford-cs161.github.io/winter2026/lectures/#lecture-5-randomized-algorithms-and-quicksort)。本文使用課前練習、講義與投影片；Canvas 錄影未使用，notebook 也未列為已讀。

上一講的 Select 用 pivot 做 partition，然後只走答案所在的一側。QuickSort 保留同一個骨架，卻遞迴排序兩側。這個小改動讓 pivot 的品質更敏感：每次近乎切半是 `O(n log n)`，每次切成 `0` 與 `n-1` 則是 `Θ(n²)`。第五講要回答的不是「random pivot 通常不錯」這句直覺，而是：對任意固定輸入，只對演算法自己的亂數取期望時，如何嚴格證出 `O(n log n)`？

## 隨機化保證到底在保證什麼

Randomized algorithm 在執行中做隨機選擇。同一輸入可能走不同路徑，執行時間因此也是 random variable。課堂使用 **Las Vegas algorithm** 這個分類：輸出永遠正確，速度則依亂數而變，可概括為「always works, probably fast」。Randomized QuickSort 屬於這一型；它不會因抽到壞 pivot 而輸出錯誤排序，只會變慢。

這裡有三個容易混在一起的量：

1. **Expected runtime**：先讓 adversary 固定輸入，再只對演算法的隨機選擇取平均。
2. **Worst-case input 的期望時間**：每個固定輸入各自取亂數期望，再找其中最大者。QuickSort 的分析對所有固定排列都給 `O(n log n)`。
3. **Worst-case runtime**：連亂數結果也取最壞。若每層剛好選到極端元素，randomized QuickSort 仍是 `Θ(n²)`。

Expected analysis 也不是 average-case input analysis。前者不必假設現實資料均勻隨機；即使輸入是刻意安排的，pivot 亂數仍提供期望保證。這種量詞順序正是隨機化能抵抗輸入排列的原因。

## BogoSort：有期望值不等於有好演算法

課堂先用 BogoSort 校準直覺：反覆把陣列均勻隨機洗牌，檢查是否已排序。若 `n` 個元素互異，唯一正確排列在每輪出現的機率為 `1/n!`，所以期望輪數是 `n!`。每次洗牌加檢查要 `O(n)`，期望時間為：

```text
O(n · n!)
```

更糟的是 worst-case runtime 無限：存在永遠沒洗出正確排列的隨機結果序列。BogoSort 的用途不是實作，而是迫使我們在每一句複雜度旁標註「期望」或「最壞」，並確認期望究竟對哪個隨機來源計算。

## QuickSort 的 partition-and-recurse 骨架

暫時假設元素互異，概念版演算法如下：

```text
QuickSort(A):
  if |A| <= 1: return A
  uniformly choose pivot x from A
  L = [a in A where a < x]
  R = [a in A where a > x]
  return QuickSort(L) ++ [x] ++ QuickSort(R)
```

正確性與 pivot 品質應分開證。對長度做強歸納：基底 `|A|≤1` 已排序；歸納步中，兩個較短的遞迴結果依假設各自有序，`L` 的每個元素小於 `x`，`R` 的每個元素大於 `x`，所以串接後整體有序。官方 notes 把正式正確性證明留作練習，因此這裡呈現的是依提示補出的證明骨架，不聲稱講義已逐行給完。

Pivot 選擇不影響上述正確性，卻決定 recursion tree。若永遠取最小值，partition 的工作量依序是 `n-1,n-2,...,1`，總和 `Θ(n²)`。若每層都取精確 median，樹高 `O(log n)`、每層總 partition 成本 `O(n)`，於是 `O(n log n)`；但先找精確 median 有額外成本，並不是免費策略。Random pivot 的魅力，是程式簡單而且能得到期望 `O(n log n)`。

## 一個非常合理、但錯誤的證明

Random pivot 的 rank 均勻分布，所以左右子問題大小都滿足：

```text
E[|L|] = E[|R|] = (n-1)/2
```

誘惑是把 `(n-1)/2` 直接代入遞迴式，寫成 `E[T(n)]≈2E[T(n/2)]+O(n)`，再套 Master Theorem。問題在於時間是子問題大小的非線性函數，一般沒有：

```text
E[f(X)] = f(E[X])
```

Slides 用 SlowSort 拆穿這個推理。假想每次只在最小值與最大值中隨機選 pivot。左右側的期望大小仍各是 `(n-1)/2`，看起來「平均切半」；但每一次實際執行都必有一側大小 `n-1`、另一側為 0。因此它以機率 1 沿長鏈遞迴，時間是 `Θ(n²)`。

這個反例的價值比 QuickSort 結論更廣：知道 random variable 的平均值，不足以把它塞進任意成本函數。要分析期望總成本，必須找能合法交換求和與期望的表示法，或直接建立正確的期望 recurrence。

換句話說，「平均輸入規模」不是「平均工作量」的代理變數；分析必須對真正的成本 random variable 取期望。

## 改問「哪兩個元素會比較」

把輸入排序後命名為：

```text
z_1 < z_2 < ... < z_n
```

定義 indicator random variable `X_{i,j}`：若 `z_i` 與 `z_j` 在 QuickSort 中曾直接比較，值為 1，否則為 0。兩個元素最多直接比較一次，因為比較發生在其中一個是 pivot 時；之後 pivot 便不進入任何子問題。

`z_i,z_j` 何時會比較？只看連續 rank 區間 `{z_i,...,z_j}`。如果這個區間第一個被選為 pivot 的元素是某個內部元素，它會先把兩端分到不同子問題，兩者永遠不再相遇。反之，若第一個 pivot 正是 `z_i` 或 `z_j`，兩端會直接比較。區間共有 `j-i+1` 個元素，各自最先被選到的機率相同，因此：

```text
P[X_{i,j}=1] = E[X_{i,j}] = 2/(j-i+1)
```

例如 `z_2` 與 `z_6` 之間共有五個元素。只有 `z_2` 或 `z_6` 最先成為 pivot 時它們才比較，所以機率是 `2/5`，而不是因兩者距離四就寫成 `1/4`。

## 線性期望把全域問題拆成 pair

令總比較次數為：

```text
C = Σ_{1≤i<j≤n} X_{i,j}
```

Linearity of expectation 給出 `E[ΣX]=ΣE[X]`，不要求這些 indicators 彼此獨立。這點很關鍵，因為一個 pivot 明顯會同時影響許多 pair；我們不需要證明不存在這種相依性。

```text
E[C]
  = Σ_{i<j} 2/(j-i+1)
  = Σ_i Σ_{k=2}^{n-i+1} 2/k
  ≤ 2n Σ_{k=2}^{n} 1/k
  ≤ 2n ln n
  = O(n log n)
```

調和級數帶來 `log n`，`n` 個起點帶來另一個 `n`。這個證明沒有聲稱每次 partition 平衡；它允許壞 pivot，卻精確計算每一對 rank 相隔多遠的元素相遇機率。距離越遠，兩端在被內部 pivot 分開前先相遇的機率越低。

## 從比較次數到總執行時間

只證 `E[C]=O(n log n)` 還要連回程式成本。大小為 `k` 的一次 partition 對 pivot 與其他 `k-1` 個元素比較，並做 `O(k)` 掃描／交換工作。把所有非平凡呼叫加總，partition 工作可由比較次數常數倍控制；另外至多有 `n` 個單元素基底呼叫。因此總時間是：

```text
O(C+n)
```

取期望後得到 `O(n log n)`。這是對每個固定的互異元素輸入成立；不是只對隨機排列成立，也不是 high-probability bound。課程本講只證期望界，不能把它自動升級成「幾乎必然」或尾機率保證。

Notes 另給一條替代路線。若 `T(n)` 是期望比較次數，pivot rank 在 `1,...,n` 均勻：

```text
T(n) = n-1 + (2/n) Σ_{i=1}^{n-1} T(i)
```

再以強歸納猜 `T(i)≤2i ln i`，用遞增函數的和式積分上界與 `∫2x ln x dx=x²ln x-x²/2+C` 收尾。它是合法的 expected recurrence；和錯證明的差異在於先對所有可能 rank 的遞迴成本取平均，而不是先把 rank 換成平均值。

## In-place partition 與實作邊界

概念偽程式配置 `L`、`R`，容易證明但要額外空間。Slides 展示原地 partition 的想法：先把隨機 pivot 換到尾端，用界標掃描其餘元素；遇到小於 pivot 的值，就交換到左區，最後把 pivot 放到兩區交界，再對兩段遞迴。這把 partition 的額外配置降下來，但遞迴 stack 仍取決於切分形狀。

QuickSort 通常不穩定：交換可能改變相同 key 元素的相對順序。本文分析也先假設元素互異；有重複值時，若只用二向 partition，大量等值元素可能造成不佳切分，實作常改用 `<`、`=`、`>` 三向 partition。這些工程變體不改本講 pairwise proof 的主線，但不能假裝材料已對每個版本給相同證明。

Slides 比較 QuickSort 與 MergeSort：前者容易原地 partition、期望快但最壞二次；後者有 deterministic `O(n log n)` worst-case 且容易做穩定排序，但陣列版通常需額外合併空間。這是設計取捨，不是「哪個永遠比較快」的排名。特定語言標準函式目前採哪種混合算法也會隨版本變動，本文不把投影片的實務例示寫成永久事實。

## 這一講在十八講裡的位置

Lecture 4 與 Lecture 5 共用 pivot、partition、recursion，卻展示兩種完全不同的分析。Select 只走一側，median of medians 用 deterministic balance lemma 得到 worst-case 線性；QuickSort 走兩側，random pivot 用 pairwise probability 得到 expected `n log n`。演算法外形相似，不代表 recurrence 或保證種類相同。

這一講也第一次把 indicator variables 與 linearity of expectation 變成演算法分析工具。之後看到「總共發生多少次某事件」，可嘗試為每個局部事件設 0/1 變數，再把總數寫成它們的和。技巧的威力不在假設獨立，而在期望可以穿過加總。

一個有效的紙筆練習，是固定 `z_1,...,z_6`，列出 `z_2,z_6` 會與不會比較的第一個 pivot；接著分別算相鄰 pair 與相距很遠 pair 的機率。若你能解釋「內部 pivot 為何永久分開兩端」，就掌握了證明的結構，而不是只背 `2/(j-i+1)`。

## 延伸

期望時間回答平均亂數成本，卻沒有告訴我們慢到某個門檻的機率。若系統在意 tail latency，可進一步研究 high-probability analysis，或採取限制遞迴深度、超過門檻後切換到 worst-case `O(n log n)` sorter 的混合策略。這些不是 Winter 2026 第五講已證的內容，所以與正文分開。

隨機性也有實作前提：pivot 必須足夠接近均勻，亂數產生與選取本身要計入系統模型。面對可觀察或可預測亂數的敵對環境，「隨機 pivot」未必提供想像中的防護。數學定理的輸入 adversary、亂數來源與成本模型，都應在套用到工程前重新寫清楚。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 5](https://stanford-cs161.github.io/winter2026/lectures/#lecture-5-randomized-algorithms-and-quicksort)
- [Lecture 5 pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-pre.pdf)
- [Lecture 5 notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-notes.pdf)
- [Lecture 5 slides](https://stanford-cs161.github.io/winter2026/assets/files/lecture5-slides.pdf)
