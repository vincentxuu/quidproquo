---
title: "Stanford CS161 Lecture 13：從 LCS、背包到樹上獨立集的動態規劃設計法"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, dynamic-programming, lcs, knapsack]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 14
tldr: "Lecture 13 把動態規劃整理成五步：選 state、寫 transition、填表、回復解、再優化實作。LCS 是 O(mn)，兩種背包都是 O(nW) 的擬多項式時間，樹上最大權重獨立集則能在 O(|V|) 完成。"
description: "逐段導讀 Stanford CS161 Winter 2026 Lecture 13：LCS 的二維表與回溯、unbounded／0-1 knapsack 的 state 差異，以及樹上 maximum-weight independent set 的線性時間 DP。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-13-dynamic-programming-lcs-knapsack-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161) 的第十四篇，對應 **Stanford CS161, Winter 2026, Lecture 13**。這堂課在 2026 年 2 月 23 日由 Ellen Vitercik 主講，官方題名是 *More Dynamic Programming: LCS, Knapsack, Independent Set*。

這篇只依據該講公開的 [lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture13-notes.pdf)、[slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture13.pdf) 與[官方 lecture component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture13.md)。課程頁另有需要 Stanford 權限的 Canvas 錄影；我沒有觀看，也不把它當成來源。Slides 有 116 頁，很多是同一張表逐格出現的動畫，因此本文整理的是完整推導，不用頁數假裝內容比較多。

Lecture 12 才剛用 Bellman–Ford 與 Floyd–Warshall 建立動態規劃的語言，Lecture 13 馬上把那套語言搬到三種外觀完全不同的問題：字串、容量限制、樹。真正要學的不是三條公式，而是如何判斷「子問題到底要記哪些資訊」。如果 state 少記一個條件，演算法可能重複使用同一個物品；如果 state 選得剛好，原本在一般圖上 NP-hard 的問題，限制在樹上後可以線性解完。

## 本講的五步動態規劃 recipe

Notes 一開始把設計動態規劃整理成五步。這個清單也是整堂課的主脊：

1. **找最佳子結構**：一個最佳解能否拆成較小問題的最佳解？
2. **寫最佳值的遞迴式**：先不要急著寫迴圈，先說清楚大問題如何依賴小問題。
3. **算出最佳值**：利用重疊子問題，只算每個 state 一次，再按依賴順序填表。
4. **回復實際解**：最佳值不一定等於答案本身；必要時保留決策資訊，或從表格反向追蹤。
5. **調整實作**：檢查是否存了不需要的 state、能否壓縮空間、填表順序是否合理。

CS161 主要要求前三步，偶爾展示第四步，對第五步只點到為止。這個取捨很重要：動態規劃不是「看見題目就畫表格」，而是先證明 recurrence 正確，再把 recurrence 實作成表格。表格只是避免重算的工具，不是正確性的來源。

三個例子恰好把 state 設計的難度一層層往上推。LCS 要記兩個 prefix 長度；unbounded knapsack 只記剩餘容量；0-1 knapsack 還要記允許使用到第幾個物品；樹上獨立集則要同時記「根可不可以選」造成的兩種條件。

## LCS：兩個 prefix 決定一個子問題

給兩個序列 `X=x₁x₂…x_m` 與 `Y=y₁y₂…y_n`。**子序列**可以刪除字元，但不能改變剩下字元的相對次序；它不要求連續。Longest Common Subsequence（LCS）要找同時出現在兩個序列中的最長子序列。

Notes 的例子是 `abracadabra` 與 `bxqrabry`，其中一個 LCS 是 `brabr`。Slides 用 DNA 說明用途，也提到 `diff` 與版本控制合併。這些應用只是動機；演算法真正看的，是兩個序列的 prefix。

定義：

```text
C[i,j] = X[1:i] 與 Y[1:j] 的 LCS 長度
```

現在只要檢查兩個 prefix 的最後一個字元。

### 最後字元相同

若 `X[i]=Y[j]`，這個共同字元可以接在較短 prefixes 的 LCS 後面：

```text
C[i,j] = C[i-1,j-1] + 1
```

為什麼不是只縮短其中一邊？因為這個末字元已經被選進共同子序列，兩個序列都必須越過它。若前段不是 `X[1:i-1]`、`Y[1:j-1]` 的最佳解，用更長的共同子序列替換前段，就能讓原答案更長，與最佳性矛盾。

### 最後字元不同

若 `X[i]≠Y[j]`，它們不可能同時成為共同子序列的最後一個字元。因此至少有一個末字元不在某個最佳解中：

```text
C[i,j] = max(C[i-1,j], C[i,j-1])
```

這裡的「至少一個」不是互斥。兩個末字元都可能沒被使用；`max` 仍會涵蓋那種情況。Base case 則是任何序列和空序列的 LCS 長度都為 0：

```text
C[i,j] = 0                              if i = 0 or j = 0
C[i,j] = C[i-1,j-1] + 1                if X[i] = Y[j]
C[i,j] = max(C[i-1,j], C[i,j-1])       otherwise
```

## 從 recurrence 到表格，再從表格走回答案

填表時先把第 0 列與第 0 欄設成 0，再依 `i=1…m`、`j=1…n` 的順序前進。每格只依賴左邊、上面與左上角，所以輪到 `C[i,j]` 時需要的值都已經算好。

```text
lenLCS(X, Y):
    建立 (m+1) × (n+1) 的 C，初值為 0
    for i = 1 ... m:
        for j = 1 ... n:
            if X[i] = Y[j]:
                C[i,j] = C[i-1,j-1] + 1
            else:
                C[i,j] = max(C[i-1,j], C[i,j-1])
    return C[m,n]
```

這只回傳長度。要取得實際 LCS，從 `(m,n)` 反向走：

- 若 `X[i]=Y[j]`，把該字元放到答案最前面，令 `i←i-1`、`j←j-1`。
- 否則若 `C[i,j]=C[i,j-1]`，往左走，令 `j←j-1`。
- 其他情況往上走，令 `i←i-1`。

如果往左與往上都維持相同值，任選一邊都可以。這代表 LCS 可能不唯一，不是演算法不確定。Slides 用 `X=ACGGA`、`Y=ACTG` 逐格填表，再從右下角反向標出一條路；那條路就是第四步「回復解」最具體的示範。

表格有 `(m+1)(n+1)` 格，每格做常數次比較與加法，因此時間為 `O(mn)`，完整表格空間也是 `O(mn)`。回溯時每一步至少讓 `i+j` 減一，最多 `m+n` 步，所以是 `O(m+n)`，不改變總時間。若只要長度，下一列只依賴目前列與上一列，slides 指出可把空間壓到兩列，也就是 `O(n)`；實作時通常讓 `n` 代表較短序列長度。

Notes 沒把 recurrence correctness 的完整歸納證明逐行寫完，而是把它留作練習並指向 CLRS。這堂課實際提供的是兩個末字元 case 的最佳子結構論證。寫成「課堂完整證明了 LCS recurrence」會超過材料範圍。

## Unbounded Knapsack：容量一個維度就夠

背包問題有 `n` 種物品。第 `i` 種物品重量為正數 `w_i`、價值為 `v_i`，背包容量為 `W`。Unbounded 版本允許每種物品拿任意多份；目標是在總重量不超過 `W` 下最大化總價值。

令 `K[x]` 為容量 `x` 能得到的最大價值。假設某個最佳解包含物品 `i`。拿掉它後，剩下組合必須是容量 `x-w_i` 的最佳解；否則可以把剩餘部分換成更好的組合，再把物品 `i` 放回去，原解就不是最佳。

因此：

```text
K[x] = max_{i : w_i ≤ x} (K[x-w_i] + v_i)
K[0] = 0
```

Bottom-up 實作按容量由小到大填：

```text
UnboundedKnapsack(W, w, v):
    K[0] = 0
    for x = 1 ... W:
        K[x] = 0
        for i = 1 ... n:
            if w[i] ≤ x:
                K[x] = max(K[x], K[x-w[i]] + v[i])
    return K[W]
```

Notes 的手算例有四種物品 `(重量,價值)`：`(6,25)`、`(3,13)`、`(4,15)`、`(2,8)`，容量 10。拿兩份重量 3 的物品與兩份重量 2 的物品，總重量是 10、總價值是 42。Slides 的主例使用另一組價值，但同樣得到 42；另外用容量 4、物品 `(1,1)`、`(2,4)`、`(3,6)` 逐格得到 `K=[0,1,4,6,8]`。最後一格的 8 來自兩份 `(2,4)`，正好顯示 unbounded 版本可以重複使用。

如果要回傳物品而不只是價值，slides 另設 `ITEMS[x]`。當物品 `i` 改善 `K[x]` 時，把 `ITEMS[x-w_i]` 複製後加入 `i`。這個做法直觀，但若每次真的複製整個集合，實作成本不一定還是單純的 `O(nW)`；較節省的方式是只記最後選了哪個物品，最後再反向重建。這個改寫屬於實作延伸，不是本講正式分析的內容。

價值表的計算時間是 `O(nW)`，空間 `O(W)`。但這不是一般意義的 polynomial time：數字 `W` 在輸入中只占 `log W` bits，演算法卻跑 `W` 輪。Notes 把這類時間稱為 **pseudo-polynomial**，也明說 Knapsack 是 NP-hard。不能看到兩層迴圈就直接說「背包有多項式時間演算法」；要問多項式是相對數值本身，還是相對輸入的 bit-length。

## 0-1 Knapsack：state 必須再記「哪些物品可用」

0-1 版本每個物品最多拿一次。如果沿用 `K[x]`，transition `K[x-w_i]+v_i` 可能建立在已經用過物品 `i` 的子解上，等於偷偷把 0-1 做回 unbounded。缺的資訊不是容量，而是目前允許使用哪些物品。

令：

```text
K[x,j] = 容量 x、只考慮物品 1...j 時的最大價值
```

最佳解只有兩種 case：

1. 不取物品 `j`，價值為 `K[x,j-1]`。
2. 取物品 `j`，前提是 `w_j≤x`；剩餘部分只能使用前 `j-1` 個物品，價值為 `K[x-w_j,j-1]+v_j`。

所以：

```text
K[x,j] = K[x,j-1]                                      if w_j > x
K[x,j] = max(K[x,j-1], K[x-w_j,j-1] + v_j)             otherwise
```

初始化 `K[x,0]=0` 與 `K[0,j]=0`，逐個增加 `j`，最後回傳 `K[W,n]`。每個 state 做常數工作，共 `nW` 個 states，時間與直觀空間都是 `O(nW)`。它仍是擬多項式時間。

Notes 沿用四物品例，0-1 最佳解改成拿 A 與 C，重量 `6+4=10`、價值 `25+15=40`。Slides 的五物品例中，最佳解總重量 9、價值 35。兩個版本的差異不在 transition 長得是否像 `max`，而在子問題能不能合法接上目前選擇。`j-1` 就是合法性的保險絲。

本講沒有正式展開一維 0-1 knapsack。如果實作時把二維表壓成一維，容量必須由大到小更新，才能確保本輪讀到的是尚未使用物品 `j` 的舊值；由小到大會再次變成 unbounded。這個技巧放在延伸，不應冒充 slides 的內容。

## 樹上最大權重獨立集：多留一個條件，避免看孫節點

在無向圖 `G=(V,E)` 中，independent set 是一組彼此沒有 edge 相連的 vertices。每個 vertex `u` 有權重 `w_u`，Maximum Weight Independent Set（MWIS）要最大化入選權重總和。一般圖上的問題是 NP-hard；若 `G` 是 tree，本講給出 `O(|V|)` 的動態規劃。

先任選一個 root `r`，令 `T_u` 為以 `u` 為根的 subtree。最直覺的 case 是：

- 不選 `u`：每個 child subtree 都可取自己的最佳解。
- 選 `u`：所有 children 都不能選，只能從 grandchildren 以下取最佳解。

若只定義 `A(u)` 為 `T_u` 的最佳權重，第二個 case 會一直跳到 grandchildren，重複問同一 subtree 的不同版本。Notes 因此增加：

```text
A(u) = T_u 的最大權重獨立集權重
B(u) = T_u 去掉 u 後的最大權重獨立集權重
```

對每個 child `v`：不選 `u` 時可以拿 `A(v)`；選 `u` 時 `v` 必須被排除，因此拿 `B(v)`。得到：

```text
B(u) = Σ_{v child of u} A(v)
A(u) = max(Σ A(v), w_u + Σ B(v))
```

演算法做一次 post-order traversal。Leaf 的 `A(u)=w_u`、`B(u)=0`；內部 vertex 先解完所有 children，再算兩個總和，最後回傳 `A(r)`。Tree 的不同 child subtrees 之間沒有交叉 edge，所以各自最佳解可以直接相加；而「選／不選 `u`」涵蓋所有可能，這就是 recurrence 的正確性核心。

每個 vertex 被處理一次，每條 parent-child edge 只參與常數次加總，因此時間 `O(|V|)`，表格空間 `O(|V|)`，recursive call stack 最壞為 tree height。Notes 與 slides 主要回傳最佳權重，沒有給出實際 vertex set 的完整重建 pseudocode。

這裡還有一個官方材料內部的用詞陷阱：notes 正式定義的是 **maximum weight independent set**，但 slides 多頁寫成 `maximal independent set`。Maximum 是全域權重最佳；maximal 只表示已不能再加入 vertex，可能離最佳很遠。本文依正式問題與 recurrence 採用 maximum weight，不沿用 slides 的誤字。

## 三個問題，其實都在問 state 夠不夠

把本講放在一起看，最值得保留的是這張對照：

| 問題 | State | 必要資訊為何不能再少 | 時間 | 空間（本講直接版本） |
|---|---|---|---:|---:|
| LCS | `C[i,j]` | 兩個 prefix 都會改變 | `O(mn)` | `O(mn)` |
| Unbounded Knapsack | `K[x]` | 物品可重複，只需容量 | `O(nW)` | `O(W)` |
| 0-1 Knapsack | `K[x,j]` | 要限制每個物品只用一次 | `O(nW)` | `O(nW)` |
| Tree MWIS | `A(u),B(u)` | 要區分 subtree root 可選／不可選 | `O(|V|)` | `O(|V|)` |

State 太大，表格浪費時間與空間；state 太小，transition 會把不合法的解接起來。設計動態規劃時，先用一句完整中文定義每個 state，比先畫矩陣有效。那句定義必須讓 recurrence 的每個索引變化都有理由。

本講也把「算最佳值」與「找最佳解」切開。LCS 明確示範從表格回溯；背包只在 slides 示範額外保存 items；tree MWIS 沒給完整重建。看到 `return C` 或 `return K[W]` 時，要問題目到底只要數值，還是要實際序列、物品集合、vertex set。這是很多正確 recurrence 最後仍交錯答案的地方。

## 最容易寫錯的地方

第一，subsequence 不是 substring。LCS 可以跳過字元，不能重排。第二，LCS 末字元相同時走左上；不同時才比較上與左。Notes 的回溯說明有一處把初始位置寫成 `i=m,j=m`，但 pseudocode 正確的是 `i=m,j=n`，因兩序列長度不必相同。

第三，`O(nW)` 要標成擬多項式。輸入若把 `W` 寫成二進位，`W` 本身可能相對輸入長度呈指數成長。第四，0-1 state 的 `j-1` 不能省；少了它就可能重複取物品。第五，tree MWIS 的線性時間依賴輸入真的是 tree；一般圖不能直接任選 root 後照抄 recurrence，因 child subtrees 之間可能有 edge，分開最佳化後無法安全合併。

最後，DP table 的方向不是數學內容。Notes 一處把 array 寫成 `n+1 × m+1`，但索引仍是 `C[i,j]`、`i≤m,j≤n`；實作只要維度與索引一致即可。真正不能換的是依賴順序：計算一格前，它讀到的子問題必須已完成。

## 在十八講路線中的位置

Lecture 12 用最短路徑第一次完整介紹 recurrence、重疊子問題與表格化；Lecture 13 讓同一套方法跨過字串、背包與樹，證明 DP 不是某一類圖演算法的別名。它也替下一講鋪路：如果 recurrence 看似需要比較多個選擇，但能證明只保留一個局部選擇仍有最佳解，就可以把 DP 收斂成貪婪演算法。

因此 Lecture 13 的停止點不是「背完四條 recurrence」，而是能在新問題上回答三句話：我的 state 精確代表什麼？最佳解依最後一個決策分成哪些完整 case？填表順序如何保證所讀子問題已經算好？三句都能回答，表格通常只是剩下的機械工作。

## 延伸

以下不是 Winter 2026 Lecture 13 的正式授課內容，而是實作時可採用的下一步。

LCS 若只要長度，可用兩列；若還要重建而不想保留完整 `mn` table，需要更進階的 divide-and-conquer reconstruction。0-1 knapsack 可壓成一維，但必須讓 `x` 從 `W` 往下走；unbounded 則通常從小往大，因為同一物品可在同輪重用。兩者看似只是迴圈方向不同，背後其實是在控制 transition 讀到「本輪新值」還是「上一輪舊值」。

樹上 MWIS 若要回傳 vertices，可在每個 `u` 記錄 `A(u)` 是由「選 u」還是「不選 u」取得，再從 root 往下重建。Tie 時可任選，或同時保留多個最佳解。這些做法都不改變本講的 correctness argument，但會把第四步「找實際解」補完整。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 13 官方頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-13-more-dynamic-programming-lcs-knapsack-independent-set)
- [Lecture 13 notes — More Dynamic Programming](https://stanford-cs161.github.io/winter2026/assets/files/lecture13-notes.pdf)
- [Lecture 13 slides — More Dynamic Programming](https://stanford-cs161.github.io/winter2026/assets/files/Lecture13.pdf)
- [Lecture 13 官方 component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture13.md)
