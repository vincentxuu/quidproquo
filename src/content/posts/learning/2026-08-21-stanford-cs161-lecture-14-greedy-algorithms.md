---
title: "Stanford CS161 Lecture 14：貪婪演算法何時能從局部最佳走到全域最佳"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, algorithms, stanford, greedy-algorithms, exchange-argument, huffman-coding]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 15
tldr: "貪婪演算法不是『每次挑看起來最好的』，而是每次只保留一個選擇，並用交換論證證明它不會排除最佳解。Lecture 14 以 activity selection、weighted completion time 與 Huffman coding 展示三種證明。"
description: "完整導讀 Stanford CS161 Winter 2026 Lecture 14：活動選擇、加權完成時間排程、Huffman prefix-free code，以及貪婪選擇正確性所需的交換論證與歸納結構。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-lecture-14-greedy-algorithms-en)

這是 [Stanford CS161 導讀](/series/stanford-cs161) 的第十五篇，對應 **Stanford CS161, Winter 2026, Lecture 14**。Ellen Vitercik 在 2026 年 2 月 25 日主講，官方題名就是 *Greedy Algorithms*。

本文使用該講公開的 [lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture14-notes.pdf)、[slides](https://stanford-cs161.github.io/winter2026/assets/files/Lecture14.pdf) 與[官方 lecture component](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture14.md)。官方頁面的 Canvas 錄影需要 Stanford 權限；我沒有觀看，也不將它列為已讀來源。Component 另連到 Winter 2025 的 notebook 與 concept-check bank，本文沒有拿那些舊版輔助材料補充 Winter 2026 的主張。

上一講的動態規劃會保留多個子問題，因為還不知道哪個選擇最後能接成最佳解。這一講問得更激進：如果能證明每次只追一條路就夠，能不能把整張表丟掉？答案是可以，但代價不是少寫程式，而是多做證明。貪婪演算法通常很短；真正困難的是證明局部選擇從未把所有全域最佳解一起排除。

## 貪婪不是直覺，而是一個需要證明的結構

Slides 用一句故意粗糙的話描述 greedy：一次做一個選擇、永不回頭、祈禱結果最好。Notes 隨即補上正式版本。假設某問題已有最佳子結構，本來可以寫成比較多個子問題的動態規劃；若能證明其中一個特定子問題總是足以延伸成最佳解，就只需沿那一條走。

這裡要分清楚兩件事：

- **Greedy choice property**：目前的局部選擇至少與某個全域最佳解相容。
- **Optimal substructure**：做完選擇後，剩下部分仍是同類型子問題的最佳解。

常見證明策略是維持不變量：「做完第 `t` 個 greedy choice 後，仍存在一個最佳解包含目前所有選擇。」Base case 是尚未選任何東西時，當然存在最佳解。Inductive step 要做的工作，通常是從一個符合舊選擇的最佳解出發，把它的一部分換成新的 greedy choice，且不讓目標值變差。這就是交換論證。

Knapsack 是本講先拿來踩煞車的反例。依價值、重量或價值密度做局部選擇，都可能因容量無法切割而卡住。`O(nW)` 的動態規劃之所以保留多個 state，正是因為沒有一個自然的單一路徑保證不排除最佳解。Greedy 不是所有最佳化問題的加速開關。

## Activity Selection：選最早結束，而不是最早開始

輸入有 `n` 個 activities。Activity `a_i` 從 `s_i` 開始、在 `f_i` 結束；同一時間只能參加一個。目標是找出數量最大的互不衝突集合。

若先用動態規劃思考，可以定義 `S_{i,j}` 為在 `a_i` 結束後開始、並在 `a_j` 開始前結束的 activities，`A_{i,j}` 是其中最大相容集合。如果選了某個 `a_k`，問題拆成它之前與之後：

```text
|A_{i,j}| = max_{a_k ∈ S_{i,j}} (1 + |A_{i,k}| + |A_{k,j}|)
```

這個直接 DP 有 `Θ(n²)` 個子問題，每格可能嘗試 `Θ(n)` 個 `k`，因此 notes 給 `O(n³)`。但 activities 有一個更強的性質：只需考慮 `S_{i,j}` 中 finish time 最早的那一個。

演算法先按 finish time 非遞減排序，選第一個 activity；之後單向掃描，只要 `s_m≥f_k`，其中 `k` 是最近一次選入者，就加入 `a_m` 並更新 `k`。

```text
Greedy-AS(a[1...n]):
    先依 finish time 排序
    A = {a[1]}
    k = 1
    for m = 2 ... n:
        if s[m] ≥ f[k]:
            A = A ∪ {a[m]}
            k = m
    return A
```

### 為什麼 earliest finish 正確

令 `a_k` 是目前可選 activities 中最早結束者。取任意最佳解 `A*`，令 `a_l` 是 `A*` 的第一個 activity。若 `a_l=a_k`，greedy choice 已在最佳解中。否則把 `a_l` 換成 `a_k`。

因為 `f_k≤f_l`，所有原本在 `a_l` 之後、與它不衝突的 activities，也都在 `a_k` 結束後才開始。交換後仍合法，集合大小不變，因此仍是最佳解。這證明「存在」一個包含 `a_k` 的最佳解，不必證明每個最佳解都包含它。接著對 `a_k` 之後的 activities 重複同一論證。

已排序時只掃一次，時間 `O(n)`；若排序也算在內，總時間 `O(n log n)`。這個結果也說明為何 greedy proof 能替代 DP 表格：選 earliest finish 後，它前面的子問題是空的，只剩後面一個子問題。

最常見誤用是把規則換成 earliest start、shortest duration 或「當下塞得進去就選價值最高」。那些規則也很像在替未來留空間，但本講的交換論證只支援 earliest finish。Greedy 規則與 proof 是一組，不能保留演算法外觀卻換掉排序 key。

## Weighted completion time：相鄰交換推出 ratio 排序

第二個問題有 `n` 個 jobs，共用一個 resource。Job `j` 的長度是 `l_j`，重要性權重是 `w_j`。在某個順序中，completion time `c_j` 是從開頭到 job `j` 結束的總長度；目標最小化：

```text
Σ_j w_j c_j
```

直覺很清楚但不完整：若 lengths 都相同，應把 weight 大的放前面；若 weights 都相同，應把短 job 放前面。兩者都不同時，應該怎麼合併？

考慮某順序中相鄰的 jobs `i`、`j`。把 `ij` 換成 `ji` 不影響其他 jobs 的 completion time，只改這兩個。交換造成的目標變化是：

```text
Δ = w_i l_j - w_j l_i
```

如果原順序 `ij` 是最佳的一部分，交換不能讓目標更小，因此 `Δ≥0`：

```text
w_i l_j ≥ w_j l_i
l_i / w_i ≤ l_j / w_j
```

所以 jobs 應按 `l_i/w_i` 遞增排序。Slides 用 `w_i/l_i` 遞減表示同一規則：單位處理時間造成的 delay cost 越高，越早做。兩個 ratio 方向相反但完全等價，不是兩種演算法。

交換論證的全域版本是：只要順序裡存在違反 ratio 的相鄰 inversion，就交換它而不增加成本。反覆消除 inversions，最後得到 ratio 排序。因此至少有一個最佳順序符合 greedy order。

Notes 用等權重、長度 `1,2,3` 做最小例子。短到長的 completion times 是 `1,3,6`，總和 10；長到短則是 `3,5,6`，總和 14。它不只說「短 job 應該先做」，也讓 `Σw_jc_j` 的累積方式可以手算。

排序後輸出順序只需 `O(n)`；若從未排序輸入開始，總時間 `O(n log n)`。Ratio 相等時任意順序都不改變兩者貢獻。實作比較 `l_i/w_i` 時不一定要做浮點除法，可比較 cross products `l_iw_j` 與 `l_jw_i`；這是實作延伸，不是 notes 的必要步驟。

## Prefix-free code：為什麼編碼要長成一棵樹

第三個例子來自資訊理論。固定長度編碼對每個字元使用相同 bits；若字元頻率差異很大，可以讓常見字元用短 codeword、少見字元用長 codeword。但 codeword 不能任意縮短。若 `a→0`、`b→1`、`c→01`，收到 `01` 時可能是 `ab`，也可能是 `c`。

因此需要 **prefix-free code**：沒有任何 codeword 是另一個 codeword 的 prefix。Binary tree 提供自然表示：左 edge 為 0、右 edge 為 1，characters 只放在 leaves。因 leaf 不可能是另一個 leaf 的 ancestor，root-to-leaf strings 自動 prefix-free。

令 alphabet 為 `C`，frequency `f(c)` 加總為 1。Character `c` 的碼長是它在 tree `T` 中的 depth `d_T(c)`；平均成本為：

```text
B(T) = Σ_{c∈C} f(c)d_T(c)
```

目標是找讓 `B(T)` 最小的 full binary tree。Lecture 使用 `{a:.45,b:.13,c:.12,d:.16,e:.05,f:.09}` 的例子，tree 中高頻的 `a` 深度最小，低頻的 `e`、`f` 較深。

## Huffman coding：從最低頻 leaves 往上合併

Huffman algorithm 不從 root 往下猜 bitstrings，而是從 leaves 往上建 tree：

1. 每個 character 建一個 node，key 為 frequency。
2. 從 `current` 中取 key 最小的兩個 nodes `N_i,N_j`。
3. 建 parent `I`，兩者成為 children，`I.key=N_i.key+N_j.key`。
4. 從 `current` 移除兩個 nodes，加入 `I`。
5. 重複到只剩一個 root。

```text
Huffman(C, f):
    current = 每個 character 對應的 leaf nodes
    while |current| > 1:
        x, y = current 中 key 最小的兩個 nodes
        z = Node(key=x.key+y.key, children=(x,y))
        current 移除 x,y，加入 z
    return current 中唯一的 root
```

### 第一個交換：兩個最低頻字元可以成為 siblings

取任一最佳 full binary coding tree。最深層一定有一對 sibling leaves，記為 `a,b`。令 `x,y` 是全 alphabet 中頻率最低的兩個字元。把 `x` 與 `a` 交換時，成本變化為：

```text
(f(x)-f(a))(d_T(a)-d_T(x)) ≤ 0
```

因 `f(x)≤f(a)`，而最深的 `a` 滿足 `d_T(a)≥d_T(x)`。交換不增加成本；對 `y,b` 同理。因此存在一棵最佳樹，讓兩個最低頻字元成為 sibling leaves。這只證明第一次合併安全，還不夠證明後續合併 meta-nodes 也安全。

### 第二個交換：subtree 可以壓成一個 meta-character

把某個 subtree 的全部 characters 壓成單一 character `c'`，frequency 等於 subtree 內頻率總和。Notes 展開成本差後指出，原 tree 與壓縮 tree 的成本差只依賴被壓縮 subtree 的內部成本，與外部 tree 形狀無關。

這使 induction 成立：Huffman 每輪的 `current` 可以包含 leaves，也可以包含已合併 subtrees；把每個 subtree 當成一個新 alphabet symbol，最低 key 的兩個 nodes 仍可套用 sibling argument。Inductive invariant 是「完成 `t` 次合併後，仍存在把 current 中 subtrees 合成最佳 tree 的方式」。最後 `current` 只剩一棵 tree，它就必須最佳。

Notes 說完整嚴謹版本可看 CLRS，並把自己的證明稱為 sketch；slides 也明說學生不需對完整 proof 負責。材料仍給了兩個關鍵 propositions 與主要代數，但寫作時應保留這個證明範圍。

官方 notes 與 slides 沒有分析 Huffman 的資料結構或 runtime。因此本文不把教科書常見的 priority queue `O(n log n)` 寫成 Lecture 14 的明示結論。演算法步驟說「找兩個最小值」，但怎麼找會決定實作成本；這正是課堂留白。

## 三個正確 greedy algorithms，共用什麼證明骨架

三個問題的局部選擇完全不同：

| 問題 | Greedy choice | 交換對象 | 主要複雜度 |
|---|---|---|---:|
| Activity Selection | 最早 finish 的相容 activity | 最佳解的第一個 activity | `O(n log n)` 含排序 |
| Weighted Completion Time | `l_i/w_i` 遞增 | 一對相鄰 inversion | `O(n log n)` 含排序 |
| Huffman Coding | 最低 frequency 的兩個 nodes | 最深 sibling leaves，再壓縮 subtree | 本講未給 runtime |

共同點不是「挑最小」。Scheduling 可能挑最大 `w/l`，Huffman 一次挑兩個，Activity Selection 則挑最早 finish。共同點是都能回答：假設目前還有一個最佳解符合舊選擇，如何局部改造它，使新的 greedy choice 也被包含，而且目標不變差？

Slides 用 subproblem graph 對照三種設計法。Divide-and-conquer 展開互不重疊的子問題；dynamic programming 展開多個會重疊的子問題並記表；greedy 在每一步只選一個子問題。這個圖像很好用，但不能反過來當 proof。只追一條路是演算法行為；為什麼那條路足夠，仍要靠問題特有的交換或歸納論證。

## 最容易誤用的限制

第一，Activity Selection 最大化的是 activity **數量**。若每個 activity 有不同 value，earliest-finish 不一定最佳，問題可能需要 weighted interval scheduling 的 DP。第二，Scheduling 的 objective 是 `Σw_jc_j`；若目標換成最大 lateness、deadline violations 或其他成本，ratio rule 不會自動沿用。

第三，prefix-free 不是「每個 codeword 長度不同」，也不是固定長度。它只禁止一個 codeword 成為另一個的 prefix。第四，Huffman 的 proof 假設以 frequency 加權期望碼長為 objective；換成不同成本模型要重新證明。

第五，也是整講最重要的一點：交換論證只需證明存在某個最佳解可以被改造成包含 greedy choice，不必證明所有最佳解都這樣選。反過來，只展示某一個例子成功也不夠；proof 必須涵蓋任意輸入與每一輪選擇。

## 在十八講路線中的位置

Lecture 13 用 state 與 transition 保留多條可能性；Lecture 14 展示什麼額外結構能讓演算法只保留一個決策。下一講的 Minimum Spanning Tree 會把這套「不排除最佳解」證明變成更具體的 cut property：只要選的是某個 cut 上的 light edge，就能交換進一棵 MST。

所以本講不只是三個經典題。它建立後半段 greedy lectures 的閱讀方式：先找 candidate rule，再找它背後的最佳子結構，最後提出能跨過每一步的 proof invariant。若 proof 寫不出來，就回到 DP 或承認只能得到 approximation；不要用「直覺上會替未來留最多空間」冒充定理。

## 延伸

以下不屬於 Winter 2026 Lecture 14 的正式內容。

實作 Activity Selection 時，若 input 已按 finish time 排好，不要再排序；這會讓 `O(n)` 與 `O(n log n)` 的條件說清楚。實作 ratio scheduling 時，使用 cross multiplication 可避開浮點誤差，但要注意整數乘法 overflow。實作 Huffman 時，常見做法是用 min-priority queue 管理 `current`；若要宣稱 runtime，必須連同 queue operations 一起分析，而不是只數 while loop 次數。

更一般地，遇到一個「每次挑最好」的構想，可以先做兩個動作：用小型反例搜尋打掉錯誤排序規則，再嘗試把任一最佳解的第一個不同選擇交換成 greedy choice。第一步不能證明正確，卻能很快阻止錯誤；第二步才是從直覺走到演算法的門檻。

## 參考資料

- [Stanford CS161 Winter 2026 Lecture 14 官方頁面](https://stanford-cs161.github.io/winter2026/lectures/#lecture-14-greedy-algorithms)
- [Lecture 14 notes — Greedy Algorithms](https://stanford-cs161.github.io/winter2026/assets/files/lecture14-notes.pdf)
- [Lecture 14 slides — Greedy Algorithms](https://stanford-cs161.github.io/winter2026/assets/files/Lecture14.pdf)
- [Lecture 14 官方 component metadata](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture14.md)
