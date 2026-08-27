# Stanford CS161 Winter 2026：Lecture 13–18 官方材料事實底稿

> 用途：供後續逐課寫作使用的事實層，不是文章草稿。研究日期：2026-08-21。

## 研究範圍與完整性

- 已逐字讀取 Lecture 13–18 的官方 `_components/lectureNN.md`；它們是課程網站 lecture component 的原始 Markdown。
- 已完整讀取官方 component 直接連結的所有 lecture notes／slides PDF：Lecture 13–17 各 1 份 notes + 1 份 slides；Lecture 18 只有 1 份 slides，共 11 份 PDF、587 頁。
- 沒有開啟或引用 Canvas／Panopto 錄影。也沒有把錄影視為「已讀來源」。
- 未把 pre-lecture exercise、concept check、Colab notebook、課本章節與 additional reading 當成本底稿的已讀內容；若下文提到它們，只是在「官方資源清單」中忠實記錄 component 所列項目。
- 「完整 agenda」以 slides 的 `Today`／`Agenda` 和 notes 的一級、二級章節交叉整理；不把行政公告算進課程 agenda。
- Lecture 18 的官方 component **沒有 lecture notes 連結，只有 slides**。因此該講所有內容都只以 slides 為依據；下文不補寫不存在的 notes、形式化證明或複雜度。

| Lecture | Component | Notes | Slides | 已讀頁數 | 材料完整性判定 |
|---|---:|---:|---:|---:|---|
| 13 | 已讀 | 已讀 | 已讀 | 9 + 116 | 完整；slides 含大量逐步動畫頁 |
| 14 | 已讀 | 已讀 | 已讀 | 8 + 91 | 完整 |
| 15 | 已讀 | 已讀 | 已讀 | 12 + 121 | 完整；component 的標題仍寫 `Lecture resources (coming)`，但檔案可用 |
| 16 | 已讀 | 已讀 | 已讀 | 11 + 86 | 完整；notes 的第 7 節明說未在課堂詳講 |
| 17 | 已讀 | 已讀 | 已讀 | 6 + 75 | 完整；incentive compatibility 的正式證明超出 notes 範圍 |
| 18 | 已讀 | **不存在** | 已讀 | 52 | **只有 slides；內容是回顧與前瞻，不是完整技術講義** |

---

## Lecture 13 — More Dynamic Programming: LCS, Knapsack, Independent Set

### 官方識別

- 日期／時間：2026-02-23（一）13:30–14:50（Stanford 當地時間）
- 講師標籤：Ellen（Ellen Vitercik）
- 官方 component 標題：`More Dynamic Programming: LCS, Knapsack, Independent Set`
- Notes 內頁標題：`More Dynamic Programming`

### 完整 agenda

1. 回顧動態規劃：最佳子結構、重疊子問題、表格化。
2. 一般 DP recipe：辨認最佳子結構 → 寫最佳值 recurrence → 計算最佳值 → 回復實際解 → 視需要優化實作。
3. Longest Common Subsequence（LCS）：定義、prefix 子問題、recurrence、bottom-up table、回溯實際 LCS、時間與空間。
4. Knapsack：Unbounded Knapsack 與 0-1 Knapsack；為何兩者需要不同 state。
5. 樹上的 Maximum Weight Independent Set（MWIS）：rooted subtree state、兩個 DP 陣列、post-order 計算。

### 核心定義與 state

- 子序列：可從原序列刪除若干符號而得到、但保留相對次序的序列。
- LCS：同時為 `X`、`Y` 子序列，且不存在更長共同子序列的序列。令 `C[i,j] = len(LCS(X[1:i], Y[1:j]))`。
- Unbounded Knapsack：每種 item 可取任意份；item `i` 有正重量 `w_i`、價值 `v_i`，容量 `W`。令 `K[x]` 為容量 `x` 的最大價值。
- 0-1 Knapsack：每個 item 最多取一次。令 `K[x,j]` 為容量 `x`、只允許前 `j` 個 items 時的最大價值。
- Independent set：無任兩個入選頂點之間有邊的頂點集合。一般圖的最大權重 independent set 是 NP-hard；樹上可線性求解。
- 樹上 MWIS：任選根 `r`；`T_u` 是以 `u` 為根的 subtree。`A(u)` 是 `T_u` 的 MWIS 權重；`B(u)` 是 `T_u \ {u}` 的 MWIS 權重，等價於所有 child subtree 的 `A` 值總和。

### 演算法、例子、正確性與複雜度

#### 1. LCS

Recurrence：

```text
C[i,j] = 0                                      if i = 0 or j = 0
C[i,j] = C[i-1,j-1] + 1                        if X[i] = Y[j]
C[i,j] = max(C[i-1,j], C[i,j-1])               otherwise
```

步驟：先將第 0 row／column 設為 0；按 `i=1..m`、`j=1..n` 填表；`C[m,n]` 是長度。要回復字串，從 `(m,n)` 往回走：字元相同就把該字元前置到答案並同時遞減 `i,j`；否則沿相同最佳值往左或往上；平手可任選，因此可能得到不同但同長的 LCS。

正確性骨架：

- 若末字元相同，任一 LCS 可包含該共同末字元，前段必是兩個縮短 prefix 的 LCS。
- 若末字元不同，至少一個末字元不在某個最佳解中，因此最佳值是刪 `X` 末字元或刪 `Y` 末字元兩種子問題的最大值。
- Notes 將 recurrence 的完整 induction proof 留作練習／指向 CLRS；材料提供的是最佳子結構論證，不是逐行完整歸納證明。

例子：notes 用 `abracadabra` 與 `bxqrabry`，給出 LCS `brabr`；slides 另用 DNA 序列、`ABCDEFGH`／`ABDFGHI`，並逐格示範 `X=ACGGA`、`Y=ACTG` 的 DP 表與回溯。

複雜度：`mn` 個 entries、每格 `O(1)`，填表 `O(mn)` 時間與 `O(mn)` 空間；只求長度時 slides 指出可只保留兩 rows，降為 `O(n)` 空間（令較短維度為 `n`）。回溯至多遞減 `i+j` 共 `m+n` 次，`O(m+n)`，被填表時間涵蓋。

#### 2. Unbounded Knapsack

Recurrence：`K[x] = max_{i:w_i≤x}(K[x-w_i] + v_i)`；若沒有 item 放得下則為 0。

步驟：`K[0]=0`；對 `x=1..W`，掃過所有 items，若 `w_i≤x` 就更新 `K[x]`。要回復 items，slides 增加 `ITEMS[x]`，在某 item 改善 `K[x]` 時複製 `ITEMS[x-w_i]` 並加入 item `i`。

正確性骨架：若容量 `x` 的最佳解包含 item `i`，拿掉它後的剩餘組合必須是容量 `x-w_i` 的最佳解；否則以更好子解替換即可改善原最佳解。

例子：notes 的 `W=10`、`(w,v)={(6,25),(3,13),(4,15),(2,8)}`，取兩個 B、兩個 D，重量 10、價值 42。Slides 的主例是 `(6,20),(2,8),(4,14),(3,13),(11,35)`，同樣得到 unbounded 最佳值 42；另逐格填 `W=4`、items `(1,1),(2,4),(3,6)`，最後 `K[0..4]=[0,1,4,6,8]`。

複雜度：`O(nW)` 時間、表格 `O(W)`；這是 pseudo-polynomial，因輸入只需 `log W` bits 表示 `W`。Notes 稱 Knapsack NP-hard，slides 把真正 polynomial-in-input-size 的演算法列為可能導致 `P=NP` 的未解方向。

#### 3. 0-1 Knapsack

Recurrence（`w_j≤x` 時）：`K[x,j] = max(K[x,j-1], K[x-w_j,j-1] + v_j)`；放不下時只取 `K[x,j-1]`。

步驟：初始化 `K[x,0]=0`、`K[0,j]=0`；逐 item `j=1..n`、逐容量 `x=1..W`，先繼承不取 item `j` 的值，再視容量比較取 item 的值；回傳 `K[W,n]`。

正確性骨架：最佳解不是不含 item `j`，就是含它。前者化為前 `j-1` items 的同容量最佳解；後者剩餘部分必是前 `j-1` items、容量 `x-w_j` 的最佳解。`j-1` 是避免重複拿同一 item 的關鍵。

例子：notes 的四 items 最佳解取 A+C，重量 10、價值 40。Slides 的五-item 例最佳重量 9、價值 35。

複雜度：`O(nW)` 時間、直觀二維表 `O(nW)` 空間；材料沒有正式展開一維壓縮版本。

#### 4. 樹上的 Maximum Weight Independent Set

Recurrence：

```text
B(u) = Σ_{v child of u} A(v)
A(u) = max(Σ A(v), w_u + Σ B(v))
```

步驟：任選 root；post-order／recursive traversal。Leaf 設 `A(u)=w_u, B(u)=0`；先解所有 children，再用上式計算；回傳 `A(r)`。

正確性骨架：最佳解若不含 `u`，各 child subtree 可各自取 `A(v)`；若含 `u`，不能含 children，但每個 `T_v\{v}` 可取 `B(v)`。不同 child subtrees 無交叉邊，故可相加並取兩 case 最大值。

複雜度：每個 vertex 一次、每條 parent-child 關係常數次，`O(|V|)`。一般圖版本仍是 NP-hard。

### 易錯點／材料缺口

- 「subsequence」不是 substring，不要求連續。
- LCS 的相同末字元 case 同時縮短兩邊；不同才比較「上／左」。平手代表答案不唯一，不代表 recurrence 錯。
- Notes 的 LCS 回溯文字一處寫成 `i=m, j=m`，但 Algorithm 2 正確初始化是 `i=m, j=n`；這是講義 typo。
- Notes 的 Algorithm 1 說 `n+1 × m+1` table，但隨後 indexing 用 `C[i,j]`、`i≤m,j≤n`；維度順序只是排版命名，實作要和 indexing 一致。
- `O(nW)` 不是對 bit-length 的 polynomial time，不能把 pseudo-polynomial 說成一般 polynomial。
- Unbounded 的 state 不記 item index；0-1 必須記 `j`（或用正確倒序一維更新）才能防止重複使用。
- 樹上問題是 **maximum weight** independent set。Slides 多頁誤寫 `maximal independent set`；兩者不同，本底稿以 notes 的正式問題定義為準。
- Notes／slides 都主要求 MWIS 的最佳權重，未給回復實際頂點集合的完整 pseudocode。

### 一手來源 URL

- 官方 rendered lecture entry：https://stanford-cs161.github.io/winter2026/lectures/#lecture-13-more-dynamic-programming-lcs-knapsack-independent-set
- 官方 component markdown：https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture13.md
- 官方 notes：https://stanford-cs161.github.io/winter2026/assets/files/lecture13-notes.pdf
- 官方 slides：https://stanford-cs161.github.io/winter2026/assets/files/Lecture13.pdf

---

## Lecture 14 — Greedy Algorithms

### 官方識別

- 日期／時間：2026-02-25（三）13:30–14:50
- 講師標籤：Ellen（Ellen Vitercik）
- 官方標題／Notes 標題：`Greedy Algorithms`

### 完整 agenda

1. Greedy paradigm 與失敗反例：Knapsack 的直覺 greedy choice 不保證最佳。
2. Activity Selection：最佳子結構、earliest-finish greedy、exchange argument。
3. Weighted completion-time Scheduling：相鄰交換推導排序準則。
4. Optimal prefix-free codes：tree representation、成本、Huffman algorithm、正確性證明骨架。
5. Greedy 與 DP／divide-and-conquer 的 subproblem graph 對照，以及常見的「greedy choice 不排除某個最佳解」歸納證明策略。

### 核心定義

- Greedy algorithm：逐步只採用一個局部選擇、不展開所有可能子問題；正確性要求證明每一步的選擇仍保留至少一個全域最佳解。
- Activity Selection：activity `a_i` 有 start `s_i`、finish `f_i`；求最大互不衝突子集合。
- Scheduling：job `j` 有 weight／importance `w_j` 與 length `l_j`；completion time `c_j` 是排在它之前（含自己）的總長度；目標最小化 `Σ w_j c_j`。
- Prefix-free code：任何 codeword 都不是另一 codeword 的 prefix；以 binary tree 表示時，characters 在 leaves，root-to-leaf 左／右邊分別給 0／1。
- Coding tree 成本：`B(T)=Σ_{c∈C} f(c)d_T(c)`，也就是隨機字元的期望碼長。

### 演算法、例子、正確性與複雜度

#### 1. Activity Selection

步驟：先按 finish time 非遞減排序；選第一個 activity；由左到右掃描，只要下一個 `s_m ≥ f_k`（`k` 是上次選取者）便加入。

正確性：對任一可行子問題，取 finish 最早的 `a_k`。若某最佳解的第一個 activity 是 `a_l≠a_k`，以 `a_k` 交換 `a_l`；因 `f_k≤f_l`，後續原本不與 `a_l` 衝突的 activities 也不會與 `a_k` 衝突，集合大小不變。故存在包含 greedy choice 的最佳解；歸納套用剩餘子問題。

複雜度：已排序時單次掃描 `O(n)`；含排序 `O(n log n)`。Notes 另指出直觀 DP 有 `n²` states、每格最多掃 `n`，為 `O(n³)`。

#### 2. Weighted completion-time Scheduling

步驟：按 `l_i/w_i` 遞增排序；等價地，slides 用「delay cost / processing time」`w_i/l_i` 遞減排序。

正確性：考慮相鄰 jobs `i,j`。交換只影響兩者；由 `ij` 換成 `ji` 的目標變化為 `w_i l_j - w_j l_i`。最佳順序必滿足 `w_i l_j ≥ w_j l_i`，即 `l_j/w_j ≥ l_i/w_i`。任何 inversion 都可用相鄰交換消除而不改善錯誤方向，得到 ratio 排序。

例子：等 weight 時，長度 `1,2,3` 的順序 weighted completion sum 為 `1+3+6=10`，反向則 `3+5+6=14`。

複雜度：已依 ratio 排序後 `O(n)` 輸出；含排序 `O(n log n)`。

#### 3. Huffman Coding

步驟：每個 character 建 leaf node，key 是 frequency；反覆取 current 中 key 最小的兩個 nodes，建 parent、key 為兩者之和，刪兩子並加入 parent；剩下唯一 root 時回傳 tree。

正確性骨架：

1. 任何最佳 full binary coding tree 中，可把最低頻的 `x,y` 與最深的一對 sibling leaves 交換而不增加成本，因此存在讓 `x,y` 成 siblings 的最佳樹。
2. 把某 subtree 壓成 frequency 等於其 leaves 總頻率的一個 meta-character，原樹與壓縮樹的成本差只由該 subtree 決定；最佳性可在壓縮／展開之間傳遞。
3. 以 current 中 subtrees 為 induction state，可證明每次合併兩個最低 key 都不排除最佳 completion；最後唯一 tree 即最佳。

例子：材料用 `{a:.45,b:.13,c:.12,d:.16,e:.05,f:.09}`，逐步合併低頻 nodes，得到平均碼長較固定長度 code 好的 prefix-free tree。

複雜度：官方 notes／slides **沒有給 Huffman 的資料結構實作或漸近 runtime**，不可把常見的 heap `O(n log n)` 當成該講明示結論。

### 易錯點／材料缺口

- Greedy「看起來合理」不等於正確；Knapsack 是明示反例。必須有 exchange／induction 等證明。
- Activity Selection 要選最早 finish，不是最早 start、最短 duration 或最高密度。
- Scheduling 的 `l/w` 遞增與 `w/l` 遞減是同一規則；不要誤寫成兩個不同算法。ratio 相等可任意排序。
- Prefix-free 不是「所有碼長相同」；核心條件是無 codeword 為另一個 prefix。
- Huffman 完整嚴謹 proof 被 notes 指向 CLRS；課堂材料自稱 sketch，但 notes 已提供兩個 proposition 的主要代數。
- Slides 說完整 Huffman proof 不列入課程責任範圍；寫作時應區分「直覺／proof idea」與正式 theorem proof。

### 一手來源 URL

- 官方 rendered lecture entry：https://stanford-cs161.github.io/winter2026/lectures/#lecture-14-greedy-algorithms
- 官方 component markdown：https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture14.md
- 官方 notes：https://stanford-cs161.github.io/winter2026/assets/files/lecture14-notes.pdf
- 官方 slides：https://stanford-cs161.github.io/winter2026/assets/files/Lecture14.pdf

---

## Lecture 15 — Minimum Spanning Trees

### 官方識別

- 日期／時間：2026-03-02（一）13:30–14:50
- 講師標籤：Moses（Moses Charikar）
- 官方標題／Notes 標題：`Minimum Spanning Trees`

### 完整 agenda

1. Minimum Spanning Tree 定義、成本、應用。
2. MST greedy template 與 safe edge invariant。
3. 圖論工具：cut、crossing edge、respect、light edge；cut property／safe-edge theorem 與 exchange proof。
4. Prim’s algorithm：growing one tree、priority-queue implementation、正確性、runtime、逐步例子。
5. Kruskal’s algorithm：growing a forest、union-find、正確性、runtime、逐步例子。
6. Prim／Kruskal 對照與講義列出的更快 MST 結果。

### 核心定義

- 輸入：connected undirected graph `G=(V,E)`，edge weight `w(e)∈R`。
- Spanning tree：連接所有 vertices 的 tree；MST 最小化 `w(T)=Σ_{e∈T}w(e)`。
- Cut `(S,V-S)`：vertices 的二分 partition。Edge 一端在兩側各一端時 crosses cut。
- Cut respects edge set `A`：`A` 中沒有 edge crosses 該 cut。
- Light edge：crossing 該 cut 的 edges 中 weight 最小者；可不唯一。
- Safe edge：加入 `A` 後仍維持「存在某個 MST 包含 `A`」的 invariant。
- Union-find／disjoint set：`makeSet(u)`、`find(u)`、`union(u,v)`。

### 演算法、例子、正確性與複雜度

#### Safe-edge theorem

若某 MST 包含 `A`、cut respects `A`，且 `(u,v)` 是 crossing cut 的 light edge，則存在 MST 包含 `A∪{(u,v)}`。

Exchange proof：取包含 `A` 的 MST `T`。若 `(u,v)` 不在 `T`，加入後形成 cycle；`T` 上 `u→v` path 必有另一 crossing edge `(x,y)∉A`。因 `(u,v)` 是 light edge，`w(u,v)≤w(x,y)`；以 `(u,v)` 換掉 `(x,y)` 仍是 spanning tree、不增加成本，且保留 `A`。若嚴格變小則原 `T` 不可能是 MST；因此新樹也是 MST。

#### Prim

步驟：任選 root `r`；所有 `key=∞`，但 `key(r)=0`；priority queue `Q` 放所有 vertices，`p(v)=NIL`。反覆 `ExtractMin` 得 `u`，非 root 時加入 `(p(u),u)`；對仍在 `Q` 的 neighbor `v`，若 `w(u,v)<key(v)`，更新 key 與 parent。

正確性：已取出的 vertices 是 growing tree；cut `(Q,V-Q)` respects 已選 edges。每個 active vertex 的 key 是它連回 tree 的最輕 edge，`ExtractMin` 選的是該 cut 的 light edge，所以由 safe-edge theorem 每一步仍可擴成某 MST。

例子：標準九點圖 `a..i`；從 `a` 開始，slides／notes 逐步更新 key/parent。`c` 與 `h` key 都為 8 時任選；結果可能不同但仍是 MST。Slides 展示 spanning tree cost 67、另一棵與 MST cost 37。

複雜度：binary heap 或 red-black tree：`O(n log n + m log n)=O(m log n)`（connected graph）；Fibonacci heap：`O(n log n + m)` amortized。

#### Kruskal

步驟：edge 依 weight 非遞減排序；每個 vertex `makeSet`；依序掃 edge `(u,v)`，若 `find(u)≠find(v)` 就加入並 `union(u,v)`；最後形成一棵 spanning tree。

正確性：已選 `A` 是 forest。下一條被加入的 edge 連接兩個 components；取其中一個 component `T_1` 與其餘 vertices 的 cut，該 cut respects `A`，且因 edges 全域按 weight 掃描，下一條跨 component edge 是 light edge；safe-edge theorem 保證不排除 MST。

例子：同一九點圖，依序加入 `(g,h)`、在 `(c,i)`／`(f,g)` 等同權 edges 間任選；遇到 endpoints 已在同一 set（例如當時的 `(i,g)`）便略過以避免 cycle，最後所有 vertices 合成一 set。

複雜度：comparison sorting edges 為主，寫作 `O(m log n)`（簡單圖下 `log m=O(log n)`）；若 integer weights polynomially bounded，可 radix sort `O(m)`。Union-find 最佳實作的 amortized operation time 為 `O(α(n))`，所以非排序部分 `O((m+n)α(n))`，實務近線性。

#### Notes 列出的延伸結果

- Karger–Klein–Tarjan（1995）：randomized `O(E+V)`。
- Chazelle（2000）：deterministic `O(Eα(V))`，使用 soft heaps。
- 這是 2026 官方 notes／slides 的課堂陳述；若文章要寫「目前最快」應另做當代文獻查證。

### 易錯點／材料缺口

- 本講限制 connected graph；非連通圖得到 minimum spanning forest，不是單一 MST。
- Cut partition 的是 vertices，不是 edges；兩側本身不必 connected。
- Light edge 可以有多條；MST 也可不唯一。Tie 任選不破壞 theorem 條件。
- Prim 的 key 是「一條 edge 連到目前 tree 的最小 weight」，不是 source 到 vertex 的 path distance；這是和 Dijkstra 的主要差別。
- Kruskal 不是盲目加入每條最輕 edge；若會形成 cycle 必須跳過。
- Component 原始文字仍寫 `Lecture resources (coming)`，但 notes／slides assets 實際存在且可讀，不能據該小標誤判材料缺失。
- Notes 把 comparison sorting 寫作需要 `Ω(m log n)`；精確敘述依 model 與 `m,n` 關係而定，寫作最好說標準 comparison sort `O(m log m)`，簡單圖可化為 `O(m log n)`。

### 一手來源 URL

- 官方 rendered lecture entry：https://stanford-cs161.github.io/winter2026/lectures/#lecture-15-minimum-spanning-trees
- 官方 component markdown：https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture15.md
- 官方 notes：https://stanford-cs161.github.io/winter2026/assets/files/lecture15-notes.pdf
- 官方 slides：https://stanford-cs161.github.io/winter2026/assets/files/lecture15-slides.pdf

---

## Lecture 16 — Max-Flow and the Ford-Fulkerson Algorithm

### 官方識別

- 日期／時間：2026-03-04（三）13:30–14:50
- 講師標籤：Moses（Moses Charikar）
- Component 標題：`Max-Flow and the Ford-Fulkerson Algorithm`
- Notes 內頁標題：`Max Flow, Min Cut and Ford-Fulkerson`

### 完整 agenda

1. Flow／cut 的歷史動機：冷戰鐵路網與現代網路資訊流。
2. Directed capacitated graph、flow constraints、flow value、maximum flow。
3. `s-t` cut、cut capacity、minimum cut。
4. Max-flow min-cut theorem：任意 flow ≤ 任意 cut；等值 certificate。
5. Residual capacity／residual network／augmenting path。
6. Ford-Fulkerson：沿 augmenting path 推流、正反向 residual edges、終止時取 reachable cut 的正確性。
7. 路徑選擇與 runtime：任意路徑、fattest path、shortest path；notes 第 7 節的額外分析。
8. 應用：bipartite perfect／maximum matching、一般 assignment／capacity routing。

### 核心定義

- 輸入 `G=(V,E)` 為 directed graph，capacity `c:E→R_{≥0}`，source `s`、sink `t`。
- Flow `f:E→R_{≥0}`：滿足 `0≤f(u,v)≤c(u,v)`；除 `s,t` 外，每點 inflow=outflow。
- Flow value：一般為 `|f| = Σ_out(s)f(s,x) - Σ_in(s)f(y,s)`；在 `s` 無入邊時就是總 outflow。
- `s-t` cut：`V=S∪T`、不交、`s∈S,t∈T`；`c(S,T)=Σ_{x∈S,y∈T}c(x,y)`，只加 `S→T` 方向。
- Residual capacity（notes 先假設不會同時有 `(u,v)`、`(v,u)`）：forward 為 `c(u,v)-f(u,v)`，reverse 為 `f(v,u)`，否則 0。正 residual capacity 的 edges 組成 `G_f`。
- Augmenting path：`G_f` 中 `s→t` path；bottleneck `F=min_{e∈P}c_f(e)`。

### 演算法、例子、正確性與複雜度

#### Ford-Fulkerson

步驟：從 zero flow 開始；建立 residual graph；只要 `t` 從 `s` reachable（DFS/BFS 等），取一條 path `P`，令 `F` 為 bottleneck；對原圖同向 edge 加 `F`，對 residual reverse edge 對應的原 edge 減 `F`；更新 residual graph；無 path 時回傳 flow。

正確性分三層：

1. 對任意 flow 與任意 cut，將 `S` 內所有 vertex 的 net outflow 相加，內部 edges 相消，只剩 `S→T` flow 減 `T→S` flow，故 `|f|≤c(S,T)`。
2. 若有 augmenting path，按 bottleneck 調整不違反 capacity；path 內部每點的 inflow/outflow 同增、同減或互相抵銷，仍守 conservation；source net outflow 增加 `F>0`。
3. 若無 augmenting path，令 `S` 為 `G_f` 中從 `s` reachable 的 vertices。所有原圖 `S→T` edges 都 saturated，所有 `T→S` edges flow 為 0，因此 `|f|=c(S,T)`。配合第 1 點，該 flow 與 cut 分別是 max flow／min cut，並證明兩值相等。

例子：notes 的圖先給 flow value 16；residual path `s→a→c→b→t` bottleneck 2，推流後達 18，而 cut `{s,a,c}`／`{b,t}` capacity 亦為 18。Slides 另用多步例子示範 reverse edges 如何撤回先前錯誤推流。

#### Runtime 與 path variants

- 任意 Ford-Fulkerson、integer capacities：每次至少增加 1，若最大 flow value 為 `|f*|`，notes 給 `O(|f*|m)`；是 pseudo-polynomial。Rational capacities 可整體放大為 integers，但 runtime 也隨比例放大；irrational capacities 時任意選 path 不保證終止。
- Fattest path：選最大化 path bottleneck 的 path。Notes 稱可在 `O(m+n)` 找到；每次使 residual max-flow value 至少按 `1/m` 比例下降，integer capacities 下總 runtime `O(m(m+n)log|f*|)`；rational 放大 `N` 後為 `O(m(m+n)(log|f*|+log N))`。
- Shortest augmenting path：BFS 選最少 edges 的 path。Notes 以 residual distance 單調不減、同一 directed edge 每兩次消失間 distance 至少增 2，推出最多 `mn/2` iterations、runtime `O((m+n)mn)`。
- Slides 沒展開上述第 7 節證明；notes 明示「未在課堂討論細節，供有興趣者」。

#### Bipartite matching reduction

給 bipartite graph `V_1∪V_2`：將 edges 定向 `V_1→V_2`，加 source 到每個 `V_1`、每個 `V_2` 到 sink，所有 capacity=1。若 perfect matching 存在，對 matching edges 與相鄰 source/sink edges 送 1 得 flow value `n`；反之 Ford-Fulkerson 保持 integer flows，value `n` 時 unit-flow 的中間 edges 每點恰有一條，形成 perfect matching。

Slides 再把相同 network 擴成有供需 capacities 的 assignment 例（學生與 ice cream／swag），說明不只是一對一 perfect matching。

### 易錯點／材料缺口

- Cut capacity 只算 `S→T`，不算反方向；這和 undirected MST cut 不同。
- Residual reverse edge 不是原圖新增運輸能力，而是「可撤回既有 flow」的額度。
- 無 augmenting path 才是 max-flow certificate；「目前找不到我偏好的 path」不夠，必須在完整 residual graph 做 reachability。
- 任意 path 版 correctness 與 efficiency 要分開：若終止就正確，但可能極慢，irrational case 甚至不保證終止。
- Multiple sources/sinks 可加 super-source／super-sink 與 infinite-capacity edges；這是 notes remark，實作時 infinity 必須用足夠大的有限 upper bound 或符號處理。
- Notes 將「BFS shortest-path method」同句稱作 Edmonds–Karp／Dinic；標準文獻中兩者不是同一演算法。若後續文章要命名，應另核官方教材／原始文獻，不要直接把兩名當同義詞。
- Notes 的 perfect matching 小節只完整證明 balanced、unit-capacity 情況；slides 的較一般 assignment network 是直覺示例，沒有同等完整 theorem proof。
- component 連結的 Schrijver 歷史論文與 concept checks 未納入本次已讀範圍。

### 一手來源 URL

- 官方 rendered lecture entry：https://stanford-cs161.github.io/winter2026/lectures/#lecture-16-max-flow-and-the-ford-fulkerson-algorithm
- 官方 component markdown：https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture16.md
- 官方 notes：https://stanford-cs161.github.io/winter2026/assets/files/lecture16-notes.pdf
- 官方 slides：https://stanford-cs161.github.io/winter2026/assets/files/lecture16-slides.pdf

---

## Lecture 17 — Stable Matchings and Gale-Shapley

### 官方識別

- 日期／時間：2026-03-09（一）13:30–14:50
- 講師標籤：Ellen（Ellen Vitercik）
- Component 標題：`Stable Matchings and Gale-Shapley`
- Notes 內頁標題：`Stable Matching and Gale-Shapley`

### 完整 agenda

1. Hospitals/residents 問題、偏好作為輸入及兩種誘因風險：誤報與私下繞過機制。
2. Matching、blocking pair、stable matching 定義與例子。
3. Naive greedy attempts 的問題；可撤銷 greedy choice 的 Deferred Acceptance（Gale–Shapley）。
4. 演算法逐步例子、termination／complete matching／stability proof、`O(n²)`。
5. Doctor-optimal 與 hospital-worst stable matching。
6. Incentive compatibility：doctor side truthful；hospital side 可操弄；證明範圍限制。
7. 延伸應用：NRMP、學校／軍隊／大學 admissions；slides 也提 Stanford Marriage Pact。

### 核心定義與模型假設

- 基本模型：`n` doctors、`n` hospitals，每 hospital 一個 position；雙方各有 strict preference ranking。
- 多 position 可把每個 hospital position 視為獨立節點；兩側人數不同可補低順位 fake participants，把配到 fake 視為 unmatched。
- Blocking pair `(doctor i, hospital j)`：兩者都嚴格偏好彼此勝過自己在 matching 中的對象。
- Stable matching：沒有 blocking pair；notes 的等價逐 pair 定義是：`i,j` 已互配，或 hospital `j` 更喜歡現任，或 doctor `i` 更喜歡現任，至少一者成立。
- Doctor-optimal：相對任何其他 stable matching，每位 doctor 都 weakly prefer 此 matching 中的 hospital。
- Feasible hospital `h*(d)`：doctor `d` 在某個 stable matching 中可能配到者裡最偏好的 hospital。

### 演算法、例子、正確性與複雜度

#### Deferred Acceptance／Gale–Shapley（doctor-proposing）

輸入：doctor preference lists `D`；`H[h][d]` 是 hospital `h` 對 doctor `d` 的 rank，數字越小越好。

步驟：每位 doctor 的 proposal index 設 0；每 hospital 暫配 `NIL`；所有 doctors 放入 `freeDoctors`。反覆選 free doctor `d`，向其尚未嘗試的最高順位 hospital `h` proposal；若 `h` 偏好 `d` 勝過目前暫配者，舊暫配者回 free set、`d` 離開 free set、`h` 改暫配 `d`；否則 `d` 仍 free 並在下輪試下一家。暫配可撤銷，最終才定案。

正確性：

1. Hospital 一旦非空就不再變回空，只會換成自己更偏好的 doctor。
2. Doctor 不會耗盡所有 hospitals：若某 doctor 已被全部拒絕，則每 hospital 在拒絕當時已有暫配且永不再空；`n` hospitals 會需要由其餘 `n-1` doctors 同時佔據，矛盾。
3. 每 iteration 某 doctor 的 index 加 1，每 doctor 最多 proposal `n` 次，所以至多 `n²` iterations；終止時得到 complete matching。
4. 假設最終有 blocking pair `(i,j)`。因 doctor `i` 最終配到比 `j` 更低順位的 hospital，過程中必曾向 `j` proposal；`j` 當時拒絕或後來替換 `i`，且 hospital 的暫配只會改善，故最終不可能比 `i` 更差，與 blocking pair 矛盾。

例子：Alice／Bob／Charlie 與 X／Y／Z。Materials 列兩個 stable matchings：`(Alice-X),(Bob-Z),(Charlie-Y)` 與 `(Alice-Y),(Bob-Z),(Charlie-X)`；`(Alice-Z),(Bob-X),(Charlie-Y)` 不穩定，因 Alice 與 X 是 blocking pair。Slides 另逐 iteration 跑兩組三對三偏好。

複雜度：最多 `n²` proposals／iterations。要達 `O(n²)`，hospital rankings 應預處理為 `H[h][d]` 常數時間比較；只存 preference list 而每次線性搜尋會破壞此界。

#### Doctor-optimality 與 incentives

Doctor-optimality proof：假設演算法第一次發生某 doctor `d` 被其 best feasible hospital `h*(d)` 拒絕，拒絕是因 hospital 更喜歡新 doctor `d'`。若兩者 best feasible hospital 相同，`d'` 與該 hospital 會阻止任何把它配給 `d` 的 stable matching；若不同，`d'` 在來此之前必先被自己的 best feasible hospital 拒絕，違反「第一次」。故不會發生，輸出為 doctor-optimal；slides 同時陳述它是 hospital-worst stable matching。

Incentive compatibility：notes 的 theorem 陳述 doctor 誤報不會改善自己的配對，但特別指出「直接套 doctor-optimality」的直覺 proof 有漏洞，因誤報後 stability 是相對假偏好，而 theorem 比較的是真偏好下 stable matchings。正式 proof 超出 notes，另指 Dubins–Freedman paper。Hospitals 不具相同 truthful guarantee；例子中 X 調換回報順位可使自己得到更喜歡的 match。

### 易錯點／材料缺口

- Stable 不等於最大總分／每個人都拿第一志願；它只排除雙方共同想偏離的 blocking pair。
- Doctor-proposing 與 hospital-proposing 的偏向會反轉；本講分析的是 doctor-proposing，因此才是 doctor-optimal、hospital-worst。
- Matches 在過程中只是 tentative；把第一次接受當永久配對會得到 naive greedy 的錯誤算法。
- Pseudocode 比較 `H[h][d] < H[h][h.doctor]`，但 `h.doctor=NIL` 的 rank 沒明寫；實作要把 `NIL` 視為最差／`+∞`。
- Notes 的 Proposition 4／5 排版不順：Proposition 4 是「doctor 不會耗盡 hospitals」，緊接的 Proposition 5 文字實際承擔反證論述；不要把它們誤讀為兩個無關 theorem。
- Doctor-optimality 的正式 proof sketch 在 notes；incentive compatibility 的正式 proof **不在** notes。不可用那個已被 notes 自己指出有漏洞的直覺論證代替。
- 偏好 ties、不完整 preference lists、couples、hospital capacities 的真實 NRMP 細節未在本講形式化處理；「拆 position」只是 notes 的簡化說法。

### 一手來源 URL

- 官方 rendered lecture entry：https://stanford-cs161.github.io/winter2026/lectures/#lecture-17-stable-matchings-and-gale-shapley
- 官方 component markdown：https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture17.md
- 官方 notes：https://stanford-cs161.github.io/winter2026/assets/files/lecture17-notes.pdf
- 官方 slides：https://stanford-cs161.github.io/winter2026/assets/files/Lecture17.pdf

---

## Lecture 18 — What's next?

### 官方識別與材料限制

- 日期／時間：2026-03-11（三）13:30–14:50
- 講師標籤：Ellen（Ellen Vitercik）
- Component 標題：`What's next?`
- Slides 封面：`What we’ve done and what’s to come`
- **官方 component 只列 Slides；沒有 Lecture notes。下列 agenda、定義、例子與論證全部只來自 52 頁 slides。**

### 完整 agenda

1. `What just happened?`：用 13 張主題 slides 回顧前 17 講。
2. Algorithm design／analysis 總結：rigor + intuition、correctness、worst-case、big-O。
3. 課程 toolbox 回顧：divide-and-conquer、randomized QuickSort、sorting lower bound／RadixSort、BST、hashing、graphs、shortest paths、DP、greedy、flows、Embedded EthiCS。
4. `What's next?`：Stanford theory／algorithms 後續課程地圖。
5. 三個 future gems：Linear Programming 與 duality；low-degree polynomial interpolation／Reed–Solomon；ML for algorithm selection／design。
6. Theory group／Theory Lunch 與課程收尾致謝。

### 核心定義與主張

- Big-O：slides 明寫 `T(n)=O(f(n))` iff 存在 `c,n₀>0`，使所有 `n≥n₀` 都有 `0≤T(n)≤c f(n)`。
- Linear Program（LP）：在線性 constraints 下最佳化 linear objective；constraints 定義 polytope，objective 定義方向，幾何上找該方向最遠的 vertex。
- Primal／dual：slides 以「maximize 某物、subject to constraints」對應另一個「minimize 另一物」；optimal values 相同。Dual solution 可作 primal optimality certificate。
- Polynomial interpolation：足夠多 evaluation points 決定 low-degree polynomial（2 點定 line、3 點定 parabola）；slides 主張可用 divide-and-conquer 很快復原，甚至部分 points 錯誤時仍可復原。
- Reed–Solomon encoding：把 message coefficients 編成 polynomial evaluations，讓 receiver 經 noisy channel 後用 interpolation／error correction 復原。
- ML for algorithm selection：同一 NP-hard problem 的最佳 heuristic 依 instance domain 而異；先抽 graph features，再用 ML 選 algorithm。
- ML for algorithm design：可用 ML／coding agent 產生或改良演算法，但仍需回答「does it work?」「is it fast?」並提供 formal guarantees。

### 演算法步驟、例子、正確性與複雜度

#### 1. 課程方法論回顧

- Divide-and-conquer：拆 smaller problems；MergeSort、Karatsuba、SELECT；以 recursion tree、substitution、Master Method 分析。
- Randomized QuickSort：input 固定後才使用 randomness；always correct、usually fast。
- DP：辨認 optimal substructure、寫 value recurrence、填 table；例 Bellman–Ford、Floyd–Warshall、LCS、Knapsack。
- Greedy：逐步 commit；用 induction 證明 choice 不排除 success；例 Activity Selection、Job Scheduling、Huffman、MST。
- Ford–Fulkerson：沿 residual augmenting paths 增加 flow；max `s-t` flow = min `s-t` cut。

這一段只是 recap，slides 沒重新提供完整 pseudocode／proof／runtime；技術細節應回到前面各 lecture，不能把 Lecture 18 當新的完整證明來源。

#### 2. LP 與 duality

Primal 例：maximize `x+y` subject to `x≥0, y≥0, 4x+y≤2, x+2y≤1`。Slides 用 constraints 的非負線性組合證明任一 feasible solution `x+y≤5/7`，並指出存在 value `5/7` 的 feasible point，故 optimum 是 `5/7`。

對應 dual：minimize `2w+z` subject to `w,z≥0, 4w+z≥1, w+2z≥1`；示範權重 `w=1/7,z=3/7` 產生上述 upper-bound certificate。Slides 再把 max-flow 視為 primal、min-cut 視為 dual：同值 cut／flow 就同時證明兩者最佳。

演算法層級只說 LP 可快速求解，例如「intelligently bouncing around feasible region 的 vertices」；**沒有命名具體 LP algorithm、pseudocode 或 asymptotic bound**。

#### 3. Polynomial interpolation／Reed–Solomon

步驟概念：把 message symbols `H,I,B,O,B` 當 coefficients，形成 `f(x)=H+Ix+Bx²+Ox³+Bx⁴`；Alice 傳 evaluation values；即使 channel 使部分 values 出錯，Bob 以快速 interpolation／error correction 復原 polynomial 與 message。

Slides 只陳述「很快的 divide-and-conquer algorithm」與可容錯，**沒有給 interpolation recurrence、可容忍錯誤數條件、field 假設、proof 或 runtime**。

#### 4. ML for algorithm selection／design

Selection 步驟明示為：對輸入 graph 計算 features（density、vertex count 等）→ 用 ML 選 `A₁...A₈` 中適合的 algorithm。例子是 graph coloring 與 2016–17 FCC spectrum auction；slides 稱 cited simulations 中 ML approach 相對最佳 non-ML 方法替政府節省 billions。

Design 例是 AlphaEvolve（slides 標 `Science ’25`），作為用 coding agent 設計 advanced algorithms 的例子。材料的結論不是「ML output 自動正確」，而是仍需 formal correctness／speed guarantees。

Slides **沒有**給 training objective、model architecture 的一般規範、selection regret bound、AlphaEvolve 技術細節或複雜度。

### 易錯點／材料缺口

- **本講沒有 notes。** 不可用其他年份 notes、Canvas 錄影、自己的背景知識補成「Lecture 18 notes 說」。
- `17 lectures in 13 slides` 是回顧段落的修辭／版面說法，不是漏掉 Lecture 18 或資料錯誤。
- LP 例只示範幾何與 dual certificate；不能從 slides 推導課堂教了 simplex、interior-point 的完整算法或 polynomial-time theorem。
- 「最優解在 vertex」是 slides 的幾何直覺；退化、unbounded、infeasible 等情形未處理。
- Polynomial interpolation 段是 teaser；沒有 Reed–Solomon 的 distance／error threshold 或 finite-field 細節。
- FCC 節省 billions 是 slides 對 simulations 的摘要，且 citation 只在 slide 上簡寫；若正式文章要引用金額與因果，必須另讀其列出的研究，不能只靠本底稿擴張。
- Slides 的課程清單、theory lunch、exam announcements 都可能隨時間改變；它們是 Winter 2026 當時資訊，不應寫成永久現況。
- AlphaEvolve／ML 段強調仍需 formal guarantees；不要把它改寫成以 empirical performance 取代 correctness proof。

### 一手來源 URL

- 官方 rendered lecture entry：https://stanford-cs161.github.io/winter2026/lectures/#lecture-18-what-s-next
- 官方 component markdown：https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture18.md
- 官方 slides（唯一 lecture material PDF）：https://stanford-cs161.github.io/winter2026/assets/files/Lecture18.pdf
- **Lecture notes：官方 component 未提供，無 URL。**

---

## 跨課銜接（供後續逐課寫作時維持敘事一致）

1. Lecture 13 把 DP 從 shortest paths 擴到 sequence、capacity、tree；核心是「多個重疊子問題都要保留」。
2. Lecture 14 把 greedy 描述為 DP 的特殊收斂：若能證明只需保留一個選擇，就不必展開其他 states；但 proof burden 更高。
3. Lecture 15 用 cut property 把「greedy choice 不排除最佳解」具體化，統一證明 Prim 與 Kruskal。
4. Lecture 16 的 cut 換成 directed `s-t` cut；不再是選 light edge，而是以 residual graph 同時建構 primal flow 與 dual-like cut certificate。
5. Lecture 17 再換一種 greedy：choices 可撤銷（deferred acceptance），正確性靠 proposal 單調性與 blocking-pair contradiction。
6. Lecture 18 把前述方法收進 toolbox，再以 LP duality、coding、ML-assisted algorithms 指向後續課程；它是 roadmap／teaser，不是新增一套可直接實作的完整演算法講義。

## 共用官方入口

- Winter 2026 lectures page：https://stanford-cs161.github.io/winter2026/lectures/
- Winter 2026 schedule：https://stanford-cs161.github.io/winter2026/schedule/
- 官方課程 source repository：https://github.com/stanford-cs161/winter2026
