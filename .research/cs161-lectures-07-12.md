# Stanford CS161 Winter 2026 Lectures 7–12：官方材料事實底稿

整理日期：2026-08-21  
用途：支撐 CS161 逐課中英文導讀；這是事實層與課程範圍底稿，不是文章草稿。  
範圍原則：以 Winter 2026 官方 lecture component、lecture notes 與 slides 為準；未把 Canvas 錄影當成已讀來源。component 中的 pre-lecture exercise、concept checks、notebook、延伸閱讀只記錄入口；除另有註記外，沒有把它們的內容混入下列 agenda。

## 讀取與完整性紀錄

六個 component 均全文讀取：`_components/lecture7.md` 至 `_components/lecture12.md`。十二份 PDF 均下載後以 `pdftotext -layout` 全文擷取，並逐份檢查章節、演算法、證明與投影片頁面順序：

| Lecture | Notes | Slides | PDF 頁數（notes / slides） | 交叉比對重點 |
| --- | --- | --- | ---: | --- |
| 7 | `lecture7-notes.pdf` | `lecture7-slides.pdf` | 14 / 87 | component 與 slides 主題是 BST / red-black tree；notes 額外完整涵蓋 heap |
| 8 | `lecture8-notes.pdf` | `Lecture8.pdf` | 7 / 67 | slides 主線止於 universal hashing；notes 額外涵蓋 balls-and-bins / birthday bound |
| 9 | `lecture9-notes.pdf` | `Lecture9.pdf` | 9 / 121 | notes 詳述 DFS/BFS；slides 額外涵蓋 topological sort 與 bipartiteness |
| 10 | `lecture10-notes.pdf` | `lecture10-slides.pdf` | 8 / 105 | 兩種等價 SCC 執行方向需避免混寫 |
| 11 | `lecture11-notes.pdf` | `lecture11-slides.pdf` | 9 / 90 | slides 以 Dijkstra 為主、Bellman–Ford 是快速導入；notes 額外給完整 BF 證明與 amortized analysis |
| 12 | `lecture12-notes.pdf` | `Lecture12.pdf` | 6 / 80 | slides 以 Fibonacci 補足 DP 直覺，notes 補 longest-path 反例與命名背景 |

PDF SHA-256 前 12 碼（供未來偵測來源是否換版）：L7 notes `3a8129c2edac`、slides `24ed5c789908`；L8 notes `a2b6a3c2d122`、slides `a086eac18523`；L9 notes `c034b541cdfd`、slides `b94f3366c936`；L10 notes `a52160e10f10`、slides `53d8c97ea3f0`；L11 notes `84fd7e9da87e`、slides `edbb6760711e`；L12 notes `1d92052368c8`、slides `ea80a6436813`。

## Lecture 7 — Binary Search Trees and Red-Black Trees

### 官方識別

- 日期：2026-01-28，13:30–14:50
- 講師：Moses
- component 標題：**Binary Search Trees and Red-Black Trees**
- notes 內頁標題：**Heaps and Binary Search Trees**。這不是另一堂課，而是同堂官方 notes 額外納入 heap；文章需清楚區分課堂 deck 主線與 notes 補充。

### 完整 agenda（component + slides + notes）

1. 簡短收束 divide-and-conquer 的設計方法：辨識自然子問題、假設子問題已解後組合、用小例子找規律；不是本課資料結構主題的核心。
2. 為何需要資料結構：比較 sorted array、unsorted linked list 在 search、select、rank、predecessor/successor、insert、delete 上的取捨。
3. notes 補充 binary min-heap：complete binary tree、heap property、`insert` 的 bubble-up、`extract-min` 的 bubble-down，以及 priority queue 動機。
4. BST 定義與 invariant；和 QuickSort pivot 的類比；in-order traversal 產生排序序列。
5. BST 的 `search`、`insert`、`delete`，尤其 delete 的 0/1/2 子節點三種情形。
6. 一般 BST 的操作時間取決於樹高；偏斜樹最壞可到 `O(n)`，平衡才有 `O(log n)`。
7. rotation：局部重整但保留 BST 順序，單次 `O(1)`。
8. red-black tree 五個 invariant、為何它保證高度至多 `2 log2(n+1)`。
9. red-black insertion 的 recoloring / rotation 案例；deck 明示本課不要求背誦所有細節，notes 也說 coverage 詳細但不完整。
10. 結論：red-black tree 的 search / insert / delete 最壞 `O(log n)`；下一課若只需 membership，可用 hashing 朝期望常數時間前進。

### 核心定義與不變量

- **Complete binary tree**：除最後一層外每層全滿，最後一層的節點盡量靠左。
- **Binary min-heap**：以 complete binary tree 儲存全序 key；每個節點 key 不大於所有後代 key。注意它只保證 parent–child 的局部偏序，不提供全域搜尋順序。
- **BST**：對每個節點 `x`，左子樹所有 key `< key(x)`，右子樹所有 key `> key(x)`；本課假設 key 唯一。
- **Successor / predecessor**：對目前元素，下一個更大 / 前一個更小的元素。
- **Red-black tree 五條規則**：每節點紅或黑；root 黑；NIL 黑；紅節點的孩子必為黑；從任一節點到任一 NIL 的所有路徑黑節點數相同。
- **Black height `b(x)`**：由 `x` 到 NIL 的任一路徑上、排除 `x` 的黑節點數。

### 演算法步驟與例子

#### Heap insert / extract-min（notes 補充）

- `insert(i)`：把新節點放入 complete tree 的下一個位置；只要 parent key 較大就交換，最多走一條 root path。
- `extract-min`：保存 root key；以最後節點 key 覆蓋 root 並刪除最後節點；反覆與較小的 child 交換直到 heap property 恢復。
- 兩者走的路徑長度都受 complete tree 高度控制，因此是 `O(log n)`。Heap 不適合一般 `search(i)` / `delete(i)`，那些可到 `Θ(n)`。

#### BST search / insert / delete

- `search(i)` 從 root 開始：相等則回傳；`i` 較小往左、較大往右；若下一個 child 是 NIL，回傳將來插入時的 parent。
- slides 以搜尋 `4` / `4.5`、插入 `4.5` 做逐步圖示；notes 例子指出搜尋不存在的 `5.5` 會停在 key 5。
- `insert(i)`：先 search 找 parent，再按大小掛到左或右。
- `delete(i)`：leaf 直接移除；一個 child 時讓 child 頂替；兩個 child 時以 immediate successor（右子樹最小值，無左 child）頂替，並修正 successor 原位置與 parent/child pointers。也可對稱使用 predecessor。
- In-order traversal 順序是 left subtree → node → right subtree，故輸出有序 keys。

#### Red-black insertion

- 先按 BST 規則插入並將新節點塗紅；如此不增加任何 root-to-NIL path 的 black count，可能破壞的主要是 red parent–red child。
- parent 黑：直接完成。
- parent 與 uncle 都紅：parent、uncle 變黑，grandparent 變紅，再從 grandparent 遞迴修復。
- parent 紅、uncle 黑：用 recolor 加 rotation 修復；notes 詳列一種左右方向，其他鏡像／折線情形類似。slides 以插入 `0`、後續插入 `6` 圖示多個 case。
- root 若在向上修復後被染紅，實作仍須把 root 恢復為黑；官方 notes 的精簡 pseudocode 沒有把所有工程 case 展開。

### 正確性論證

- BST search 正確性來自 invariant：若 `i < key(x)`，右子樹不可能包含 `i`，反之亦然；走到 NIL 即排除所有可能位置。
- Rotation 保留 BST 的理由：右旋時只把原本介於 `key(y)` 與 `key(x)` 的 `β` 子樹移到 `x` 左側，其 key 範圍仍合法；左旋對稱。
- Red-black 高度定理：以 induction 證明以 `x` 為根的非 NIL descendants 至少 `2^{b(x)}-1`；又因紅節點不可連續，任一路徑黑節點至少佔一半，故 `b(root) ≥ h/2`。因此 `n ≥ 2^{h/2}-1`，得到 `h ≤ 2 log2(n+1)`。
- 插入修復每個 case 都維持 BST order；recolor case 在每條相關路徑上一紅一黑互換，不改 black height；rotation case 重新安排局部結構並配色，使 red-red 衝突消失且各路徑黑數不變。

### 複雜度

- 一般 BST：search / insert / delete 都是 `O(h)`；`h` 最好 `O(log n)`、最壞 `O(n)`。
- Rotation：`O(1)`。
- Red-black tree：`h = O(log n)`，故 search / insert / delete 最壞 `O(log n)`；修復每層只做常數工作，最多向 root 走 `O(h)`。
- Heap insert / extract-min：`O(log n)`；一般 search / delete 可為 `Θ(n)`。

### 易錯點與材料缺口

- 不可把 heap property 說成 BST order；heap 只能保證 minimum 在 root 與祖先不大於後代。
- notes 的 `search(i)` 回傳「包含 i 的節點，或插入 parent」，不保證是數值上最接近 i 的節點。
- BST delete 的 successor 不一定是右 child，而是整個右子樹的最小值。
- red-black tree 是近似平衡，不是 perfect / complete balance；保證是 root-to-leaf 高度上界。
- slides 說本課不要求 red-black insert/delete 的 nitty-gritty；notes 明示只是 case study，完整版本要看 CLRS Ch.13。後續文章不應假裝官方材料完整教完 deletion fix-up。
- component 標題沒有 heap，slides 也沒有 heap 主段；heap 是官方 notes 的額外內容，宜放「講義補充」而不是課堂主線。

### 一手來源

- [Official lecture index](https://stanford-cs161.github.io/winter2026/lectures/)
- [Component source](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture7.md)
- [Lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-notes.pdf)
- [Slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-slides.pdf)
- [Slides PPTX](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-slides.pptx)
- [Pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture7-pre.pdf)（僅記錄入口，未納入已讀內容）
- [Pre-lecture solutions（repository copy）](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_site/assets/files/lecture7-pre-sol.pdf)（component 使用 `filelink`；公開網站同名 asset 回傳 404，因此保留官方 repository copy；未納入已讀內容）

## Lecture 8 — Hashing

### 官方識別

- 日期：2026-02-02，13:30–14:50
- 講師：Ellen
- 官方標題：**Hashing**

### 完整 agenda

1. 從上一課的 red-black tree `O(log n)` deterministic operations 出發，問能否得到 `O(1)`。
2. Direct addressing 可常數時間，但當 universe `U` 遠大於實際集合時空間不可接受。
3. Chaining hash table：`n` 個 buckets，各 bucket 是 linked list；`Insert`、`Lookup`、`Delete` 的時間取決於 chain 長度。
4. 固定 deterministic hash function 無法抵抗 worst-case input：總有許多 universe keys 落入同一 bucket。
5. 將隨機性放在 hash function，而不是假設輸入 keys 隨機；adversary 先選 keys，演算法再從 family 隨機選 `h`。
6. 完全隨機 hash function 可使某個 key 所在 bucket 的 expected size ≤ 2，故操作 expected `O(1)`，但函數描述需 `|U| log n` bits，不可實作。
7. Universal hash family：只需 pairwise collision probability `≤ 1/n`，即可重用同一份期望成本證明。
8. 建構小型 universal family：`h_{a,b}(x)=((ax+b) mod p) mod n`，`p ≥ |U|` prime，隨機選非零 `a` 與任意 `b`。
9. notes 延伸 balls-and-bins / birthday paradox：何時開始高機率碰撞，以及 random ID bit-width 設計。

### 核心定義

- **Universe `U`**：所有可能 keys；實際儲存集合 `S ⊂ U`，且假設同時最多 `n` 個 keys。
- **Hash function**：`h: U → {0,…,n-1}`，把 key 指派到 bucket。
- **Chaining**：每個 bucket 存一條 linked list，以處理 collisions。
- **Universal family `F`**：對任意不同 `x_i,x_j`，從 `F` 均勻隨機選 `h` 時，`Pr[h(x_i)=h(x_j)] ≤ 1/n`。
- **Balls-and-bins**：keys 對應 balls、buckets 對應 bins 的隨機配置抽象。

### 演算法／資料結構步驟與例子

- Chaining operations：先算 `h(k)` 定位 bucket，再在 chain 查找；insert 可插 head，但若 keys 要唯一，仍須先 lookup。
- notes 例子：`n=5`、`h(x)=(13x+2) mod 5`，插入 `{1,2,4,7,8}`；bucket 3 出現 `2→7` collision。
- 表大小通常至少是最大同時儲存 key 數；超過時需 resize / rehash。官方分析刻意忽略 resizing，固定假設 keys 數不超過 buckets 數。
- Universal family 實作只需隨機保存 `(a,b)`，比保存完整 lookup table 小很多。

### 正確性／期望成本論證

- 對目前 key `x_i` 所在 bucket 大小 `X`，寫成與每個 `x_j` 是否 collision 的 indicator sum：`E[X]=Σ_j Pr[h(x_i)=h(x_j)] = 1 + Σ_{j≠i} Pr[collision] ≤ 1+(n-1)/n ≤ 2`。因此沿 chain 的期望工作為常數。
- 完全隨機函數不是必要條件；上式只用到 pairwise collision probability，這正是 universal family 的 contract。
- `h_{a,b}` family 的 universal proof：先考慮 `f_{a,b}(x)=ax+b mod p`。對不同 `x1,x2` 與不同輸出 `y1,y2`，模 prime `p` 的兩條線性方程唯一決定 `(a,b)`；再計數 `y1≠y2` 且 `y1≡y2 (mod n)` 的 pairs，至多 `p(p-1)/n` 個。除以 family size `p(p-1)` 得 collision probability `≤1/n`。
- Birthday bound：`m` balls 入 `n` bins，`Pr[no collision]=∏_{i=1}^{m-1}(1-i/n) ≤ exp(-m(m-1)/(2n))`。當 `m≈sqrt(2 ln 2) sqrt(n)≈1.18 sqrt(n)`，碰撞機率超過 `1/2`。
- 另一方向用 union bound / expected collision pairs：碰撞機率至多 `m(m-1)/(2n)`。若給 `m` users 隨機 `b`-bit IDs，要 collision probability ≤ `δ`，可取 `b ≥ 2 log m - 1 + log(1/δ)`。

### 複雜度

- 在 random / universal hashing 假設與 load 不超過 1 的模型下，Insert / Lookup / Delete expected `O(1)`。
- 任何固定 hash function 都存在 worst-case set 讓所有 keys collision，操作退化為 `Θ(n)`。
- 完全隨機函數的表示空間是 `Θ(|U| log n)` bits；`h_{a,b}` 只需記錄兩個 mod-`p` 參數，約 `O(log |U|)` bits（忽略 arithmetic word-cost 細節）。

### 易錯點與材料缺口

- 「expected O(1)」不是每次操作的 deterministic worst-case O(1)，也不是說每個 bucket 都一定大小 ≤2。
- adversary / keys 必須在隨機 `h` 選出前固定；若輸入能看到 `h` 後自適應挑 key，這份簡化分析不直接成立。
- `a` 不能為 0，否則 `f_{a,b}` 把所有 key 映到同一值；`p` 必須 prime 才能對非零差做 modular inverse。
- slides 明示 open addressing 不在本課要求內；本課分析是 chaining。
- resizing 與 rehash 的 amortized cost 被 notes 明確排除，文章不應把完整 production hash table 性能歸功於此單一分析。
- balls-and-bins / birthday paradox 出現在 notes，不在 slides 的主線；可列為官方講義延伸。

### 一手來源

- [Official lecture index](https://stanford-cs161.github.io/winter2026/lectures/)
- [Component source](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture8.md)
- [Lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture8-notes.pdf)
- [Slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/Lecture8.pdf)
- [Slides PPTX source](https://stanford-cs161.github.io/winter2026/assets/files/lecture8-slides.pptx)
- [Official Colab notebook](https://colab.research.google.com/github/stanford-cs161/winter2025-extra/blob/colab/lecture8_hashing.ipynb)（component 的 `extra_repo` 仍指向 winter2025-extra；僅記錄入口，未納入已讀內容）
- [Pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture8-pre.pdf)（僅記錄入口）

## Lecture 9 — Graphs and BFS and DFS

### 官方識別

- 日期：2026-02-04，13:30–14:50
- 講師：Ellen
- component 標題：**Graphs and BFS and DFS**
- notes 標題：**Graphs, DFS, and BFS**；只是順序用字不同。

### 完整 agenda

1. Graph applications 與基本術語：directed / undirected、connected、sparse / dense、degree。
2. Adjacency matrix 與 adjacency list 的 space、edge lookup、neighbor enumeration 取捨。
3. DFS：white/gray/black 狀態、parent、discovery / finish timestamps；單一 source 與全圖 DFS forest。
4. DFS 正確走遍 reachable vertices、時間 `O(n+m)`，並以圖例逐步標出 timestamps。
5. slides 應用一：DAG topological sorting，以 decreasing DFS finish time 排序。
6. BFS：以 levels `L_i` 一層層探索、parent pointer 還原路徑；queue 與 DFS stack 的對照。
7. BFS shortest-path correctness：在 unweighted graph，`L_i` 恰為距 source 距離 `i` 的 vertices。
8. slides 應用二：以 BFS level parity 測 bipartiteness；若相鄰 vertices 被同色，構成 odd cycle certificate。

### 核心定義

- Graph `G=(V,E)`；常用 `n=|V|`、`m=|E|`。Undirected edge 對稱；directed edge 有方向。
- Connected graph：任意兩點間存在 path（notes 此句針對 undirected 語境）。Sparse 常指 `m=Θ(n)`，dense 可達 `Θ(n²)`。
- Adjacency matrix：`n×n` binary matrix；adjacency list：每 vertex 一個 neighbor list。Directed graph 可分 out-neighbors / in-neighbors。
- DFS colors：white 未發現、gray 已發現但尚未完成、black 已完成；slides 用淺綠／橘／深綠取代。
- DFS discovery time `d(v)` 與 finish time `f(v)`；parent pointers 形成 DFS tree / forest。
- BFS distance `d(u,v)`：unweighted graph 上最短 path 的 edge 數；`L_i={v | d(s,v)=i}`。
- DAG：directed acyclic graph。Topological order 保證每條 edge 都從較前方指向較後方。
- Bipartite graph：vertices 可二著色，使每條 edge 兩端顏色不同。

### 演算法步驟與例子

#### DFS

- 初始化每個 vertex 為 white，times 為 infinity、parent NIL。
- `DFS(s,t)`：把 `s` 改 gray、記 discovery time；依序掃 neighbors，遇 white vertex 就設 parent 並遞迴；完成所有 neighbors 後記 finish time、改 black。
- 單 source 版本只取得從 `s` reachable 的部分；全圖版依 vertex 順序，對每個仍 white 的 vertex 開一棵新 DFS tree。
- slides 用 labyrinth 的 chalk/string 隱喻「一路深入、死路才回退」，並展示 package dependency graph。

#### Topological sort（slides 補足）

- 在 DAG 上跑完整 DFS forest，記每個 vertex finish time。
- 按 finish time 遞減輸出 vertices。
- package dependency 例子把 edge 視為先後需求；輸出順序不會產生 backward dependency edge。

#### BFS

- `L0={s}` 並標 visited；依 `i=0…n-1` 處理 `L_i`，掃每個 `u` 的 neighbors；首次看到 `x` 時標 visited、放入 `L_{i+1}`、設 `p(x)=u`。
- 等價 queue 版：從 front pop，將未訪 neighbors push 到 back。DFS 的等價 iterative 版則用 stack。
- shortest path 可沿 parent pointers 反向還原。

#### Bipartiteness（slides 補足）

- 每個 connected component 各跑一次 BFS，以 level parity 交替著色。
- 掃 edge 時若兩端同 parity / 同色，回報非 bipartite；否則所有 edges 跨色即得到合法二著色。
- slides 用「兩個魚缸，會打架的魚之間有 edge」作建模例子。

### 正確性論證

- DFS reachable coverage：對離 source 的最短距離作 induction；若所有 level `i` vertices 會到達，每個 level `i+1` vertex 都鄰接某個 level `i` vertex，掃 edge 時也會被發現。搜尋不會跨到 unreachable vertex。
- Topological sort：對 DAG 中 edge `A→B`，證 `f(B)<f(A)`。若 B 是 A 的 DFS descendant，parentheses nesting 直接得到；若不是，A 也不能是 B descendant（否則 edge `A→B` 形成 cycle），且必須先完成 B 再探索 A，所以仍有 `f(B)<f(A)`。因此 decreasing finish time 對每條 edge 都把 A 放在 B 前。
- BFS proposition：以 strong induction 證 `L_i={x|d(s,x)=i}`。加入 `L_{i+1}` 的 y 由某 `x∈L_i` 經一 edge 到達，距離至多 i+1，且先前未在較小 level，故恰為 i+1；反向取任一距離 i+1 的 y，在 shortest path 上前一點 x 距離 i，掃 x 時必把 y 放入 `L_{i+1}`（或它已被同層另一 edge 放入）。
- Bipartiteness：若 BFS 發現同色相鄰點，兩點各自到其 BFS ancestry 分岔點的 paths 加上該 edge 形成 odd cycle；odd cycle 不可能二著色，因此不是 bipartite。若沒有同色 edge，BFS parity coloring 本身就是 certificate。

### 複雜度

- Matrix：space `Θ(n²)`、edge lookup `Θ(1)`、列舉 v neighbors `Θ(n)`。
- Adjacency list：space `Θ(n+m)`、列舉 v neighbors `Θ(deg(v))`、單一 edge lookup 最壞需掃 `deg(v)`。
- DFS / BFS：每 vertex 至多 visit 一次、每 directed edge 掃一次（undirected 至多兩次），`O(n+m)`；需 adjacency-list representation 才有此界。
- Topological sort 與 bipartiteness 都是在 DFS/BFS 外加線性 bookkeeping，仍為 `O(n+m)`。

### 易錯點與材料缺口

- BFS 的 shortest path 結論以 **unweighted** graph 或每 edge 等重為前提；weighted shortest paths 要到 Lecture 11。
- 若只從一個 source 跑 DFS/BFS，不會自動覆蓋 disconnected graph；需外層 loop 建 forest / 逐 component 跑。
- Directed graph 的 traversal 要掃 out-neighbors；undirected 的 connected component 直覺不能直接替代 SCC。
- `O(n+m)` 依賴 adjacency list；用 matrix 掃 neighbors 會變成 `Θ(n²)`。
- Topological order 只在 DAG 存在；有 cycle 時 decreasing finish time 仍可算，但不是合法 topological order。
- slides 說 shortest path 可在 `O(m)`，更穩妥的完整表述是 `O(n+m)`；只有 connected graph（`m≥n-1`）才可吸收成 `O(m)`。
- Topological sorting 與 bipartiteness 不在 notes 主文，卻明確在 slides outline / recap；逐課文章若以完整官方課堂 agenda 為準，必須納入。

### 一手來源

- [Official lecture index](https://stanford-cs161.github.io/winter2026/lectures/)
- [Component source](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture9.md)
- [Lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture9-notes.pdf)
- [Slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/Lecture9.pdf)
- [Slides PPTX source](https://stanford-cs161.github.io/winter2026/assets/files/lecture9-slides.pptx)
- [Official Colab notebook](https://colab.research.google.com/github/stanford-cs161/winter2025-extra/blob/colab/lecture9_graphs.ipynb)（僅記錄入口）
- [Pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture9-pre.pdf)（僅記錄入口）

## Lecture 10 — Strongly Connected Components

### 官方識別

- 日期：2026-02-09，13:30–14:50
- 講師：Moses
- 官方標題：**Strongly Connected Components**（slides 封面作 **Finding strongly connected components**）

### 完整 agenda

1. 複習 DFS tree / forest、start / finish times，以及 undirected connected components。
2. Directed graph 中 strong connectivity、SCC、weak connectivity。
3. SCC condensation / meta-graph 必為 DAG。
4. 線性時間 SCC 演算法：兩次 DFS，一次取得 finishing times，另一次按 reverse finishing order 建 DFS forest；forest 中每棵 tree 是一個 SCC。
5. 九節點例子完整跑兩 pass，標示 finish values 與 leaders。
6. Key lemma：沿原圖 SCC edge，第一 pass 的 SCC 最大 finish time 有嚴格順序。
7. 用 induction 證第二 pass 每次 DFS 恰好剝下一個 SCC；總時間 `O(n+m)`。

### 核心定義

- Undirected connected component：relation `u~v` iff 有 path u 到 v 的 equivalence class，且是 maximal connected vertex set。
- SCC：directed graph 中 maximal set S，使任意 `u,v∈S` 都有 `u→v` 與 `v→u` paths。
- Weakly connected component：忽略 directed edge 方向後的 undirected connected component。
- SCC meta-graph / condensation DAG：每個 SCC 壓成一個 meta-node；不同 SCC 間只要原圖存在 edge 就連 meta-edge。
- Leader：第二 pass 某次 DFS 的 source；被該 DFS 發現的 vertices 共用 leader。

### 演算法步驟與例子

有兩個完全等價、但方向相反的官方版本，文章必須選一個完整講清楚，不能把兩者的 pass 混接：

- **Notes 版本**：先在 `G^rev` 以任意 vertex order 跑 DFS-loop，取得每個 vertex 的 finish `f(v)`；再在原圖 `G` 按 `f(v)` 遞減跑 DFS-loop，每棵 DFS tree / 同 leader vertices 即一個 SCC。
- **Slides / CLRS 版本**：先在原圖 `G` 任意 order 跑 DFS forest；reverse 所有 edges；再在 `G^rev` 按第一 pass finish time 遞減跑 DFS。所得 trees 是 SCC。
- 兩者都正確，因 `G` 與 `G^rev` 的 SCC partition 完全相同。notes 也專門用 Remark 4 提醒這個差異。
- Notes 九節點例子：第一 pass 在 reversed graph 從 9 開始，依 traversal choice 取得 `f=1…9`；第二 pass 回原圖、按 decreasing f，三棵 DFS trees 的 leaders 是 9、6、4，分別找出三個 SCC。

### 正確性論證

- Condensation graph 無 cycle：若 SCCs 形成 directed cycle，沿 SCC 內 mutual reachability 加上跨 SCC edges，cycle 上任意兩點都能互達，原本那些 SCC 應合併成單一 SCC，矛盾。
- Key lemma（採 notes 方向）：若原圖有 SCC edge `C1→C2`，第一 pass 在 `G^rev` 的最大 finish 值滿足 `max_{C1} f < max_{C2} f`。
  - 若 DFS 首先碰到 `C1`，在 reversed graph 沒有從 C1 回 C2 的 path（否則 condensation 有 cycle），所以先完成 C1，C2 的最大 finish 更晚。
  - 若先碰到 `C2`，該 DFS 可沿 reversed edge / SCC paths 探索 C1；起點所在 C2 中某 vertex 最後完成，故其 finish 大於 C1 所有 finish。
- Final induction：第二 pass 在 G 按 decreasing f 選尚未探索 vertex v。假設先前探索集合 S 是若干完整 SCC 的 union。v 所在 SCC C 內全互達，所以本次 DFS 至少探索完整 C；C 的任何 outgoing edge 指向 C'，key lemma 保證 C' 有更大 finish，已在較早 pass 被探索且整個屬於 S，所以 DFS 不會越界到未探索 SCC。故本次恰探索 C。
- Slides 用相反方向陳述相同結構：先在 G 得 finish、reverse 後，最大 finish 所在 SCC 在剩餘 condensation graph 中沒有 outgoing edge，因此第二 pass 一棵 tree 不會漏出 SCC。

### 複雜度

- Reverse adjacency lists：`O(n+m)`。
- 每次完整 DFS-loop：`O(n+m)`；兩次仍為 `O(n+m)`。
- finishing times、leader bookkeeping：每 vertex 常數額外工作，不改線性界。

### 易錯點與材料缺口

- 最常見錯誤是第一 pass 在 G、第二 pass 卻也在 G，或把 notes 的 `G^rev→G` 證明套到 slides 的 `G→G^rev` 卻不翻轉 lemma。
- 第二 pass 不是隨意順序，必須是第一 pass finish time 遞減。
- 一次從任意 source 的 DFS 只找 reachable set，通常不等於 SCC；mutual reachability 才是 SCC。
- SCC meta-graph 是 DAG，不代表每個 SCC 內部是 tree 或 cycle；內部可有任意 strongly connected 結構。
- DFS neighbor tie-breaking 會改變個別 finish values，但不破壞 SCC ordering lemma，結果 partition 不變。
- component 連結 notebook 與 concept checks，但本底稿未讀 notebook；所有演算法事實均由 notes/slides 支撐。

### 一手來源

- [Official lecture index](https://stanford-cs161.github.io/winter2026/lectures/)
- [Component source](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture10.md)
- [Lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-notes.pdf)
- [Slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-slides.pdf)
- [Slides PPTX](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-slides.pptx)
- [Official Colab notebook](https://colab.research.google.com/github/stanford-cs161/winter2025-extra/blob/colab/lecture10_scc.ipynb)（僅記錄入口）
- [Pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture10-pre.pdf)（僅記錄入口）

## Lecture 11 — Dijkstra and Bellman-Ford

### 官方識別

- 日期：2026-02-11，13:30–14:50
- 講師：Moses
- 官方標題：**Dijkstra and Bellman-Ford**
- slides 封面：**Weighted Graphs: Dijkstra and Bellman-Ford**，並明示「may not get to Bellman-Ford；next time spend more」。因此 Dijkstra 是實際 deck 主體，Bellman–Ford 是快速導入；Lecture 12 再正式重講。

### 完整 agenda

1. Weighted directed graph、path cost、single-source shortest paths（SSSP）；shortest path 的 subpath 仍是 shortest path。
2. Dijkstra 的「拉緊繩子」直覺與 Gates / Packard / CS161 / Union / Dish 校園圖逐步例子。
3. Distance estimates `d[v]`、finished set D / unfinished set F、edge relaxation。
4. Dijkstra correctness 兩個 invariants：estimate 是 upper bound；vertex finalized 時 estimate 正確。
5. Priority queue 實作：array、red-black tree、Fibonacci heap；dense / sparse graph 的 runtime 取捨。
6. Dijkstra 限制：negative edge weights 與 edge-weight updates。
7. Negative cycle 為何令 shortest distance 不再 well-defined。
8. Bellman–Ford 快速導入：所有 edges 反覆 relax、最多 n−1 rounds、再一 round 偵測 reachable negative cycle；完整 DP 解讀留到 Lecture 12。
9. notes 額外完整給 Bellman–Ford correctness proof，以及以 binary counter / accounting method 講 amortized time，支撐 Fibonacci heap 的術語。

### 核心定義與 invariant

- Weighted path cost：path 上 edge weights 的總和。
- SSSP：給 source s，求每個 v 的 `d(s,v)`。
- Relaxation：`d[y] ← min(d[y], d[x]+w(x,y))`；若更新，要設 predecessor `π(y)=x`。
- Dijkstra invariant：任意時刻 `d[t]≥d(s,t)`；t 被 finalized 時 `d[t]=d(s,t)`。
- Negative cycle：cycle edge-weight sum <0；若從 source reachable，可反覆繞行讓相關 distances 趨向 `−∞`。
- Amortized `t(n)`：由空資料結構開始，L 次操作的總成本 `O(L·t(n))`；不是每一次的 worst-case bound。

### 演算法步驟與例子

#### Dijkstra

1. 所有 estimates 設 infinity，`d[s]=0`；F 放所有 vertices，D 為空。
2. 從 F 取 estimate 最小的 x。
3. Relax x 的每條 outgoing edge `(x,y)`；若改善則更新 predecessor。
4. 把 x 從 F 移至 D，永不重新插入；重複到 F 空。
5. slides 以 Stanford 建築圖逐步顯示「不確定」estimate 如何縮小並 finalized，並用 string / gravity 隱喻先被拉起的 vertex 已確定最短距離。

#### Bellman–Ford

- Notes Algorithm 2 是 in-place edge relaxation 版：做 n−1 rounds，每 round 掃所有 edges；最後再掃一次，若還能 relax 則回報 reachable negative cycle。
- Slides 為銜接 DP，改用 arrays `d^(0)…d^(n−1)`：`d^(i)[v]` 代表最多 i edges 的 shortest path；每 round 從前一 array 更新下一 array。官方明示這和某些 BF 版本不同但方便下一課。
- 若要 paths，同樣在 estimate 改善時更新 predecessor `π(v)`。

#### Amortized binary counter（notes 補充）

- 單次 increment 可能翻轉 Θ(b) bits，如 `11111111+1`；但 n 次 increments 的總工作是 `O(n)`。
- Accounting method：每次 increment 收兩個 credits；每個 1-bit 保留一 credit，carry 帶兩 credits。1→0 的翻轉由先前存下的 credit 支付，新 carry 繼承 credits。因此所有長 carry propagation 已預付，平均每次 `O(1)`。

### 正確性論證

#### Dijkstra

- Upper-bound claim：每個 finite `d[u]` 都是某條 s→u path 的實際重量；初始化成立，每次 relaxation 只是把已有 s→x path 接 edge `(x,u)`，所以不可能低於真正 shortest distance。
- Finalization claim：以加入 D 的順序 induction。令 x 是 F 中 estimate 最小者，P 是 s→x shortest path，取 P 上靠近 x、已知 estimate 正確的最遠節點 z。若 z=x 已完成；否則取下一節點 z'。由 nonnegative weights 與 upper-bound 得 `d[z]=d(s,z)≤d(s,x)≤d[x]`。若嚴格 `d[z]<d[x]`，z 必早已在 D，故 edge `(z,z')` 已 relax，會令 z' estimate 正確，和 z 的選法矛盾；故 `d[x]=d(s,x)`。
- Nonnegative weights 是關鍵：finalized x 之後，任何 F 中 y 都有 `d[y]≥d[x]`，加上 `w(y,x)≥0` 不可能再改善 x。

#### Bellman–Ford

- 無 reachable negative cycle 時，對 round k induction：`d_k(v)` 不大於任何最多 k edges 的 s→v path cost；反向配合 estimate 永遠是某 path cost，得到 round n−1 的值恰為 shortest distance。最短 path 可取 simple path，因 positive cycle 可刪除變短，zero cycle 可刪除不變；故最多 n−1 edges。
- Negative-cycle detection：若 reachable negative cycle `v1→…→vk→v1` 存在且最後一掃沒有任何 edge 可 relax，就有每條 `d[v_{i+1}]≤d[v_i]+w_i`；把 k 條不等式相加，distance terms 抵消，推出 `0≤Σw_i`，和 cycle weight <0 矛盾。

### 複雜度

- Dijkstra 用 array：FindMin / DeleteMin `O(n)`、DecreaseKey `O(1)`，總 `O(n²+m)=O(n²)`。
- 用 red-black tree：三操作 `O(log n)`，總 `O((n+m)log n)`。
- 用 Fibonacci heap（amortized）：FindMin / DecreaseKey `O(1)`、DeleteMin `O(log n)`，總 `O(m+n log n)`。
- Bellman–Ford：n−1 rounds 各掃 m edges，再掃 m 偵測 cycle，`O(nm)`；兩-array DP 版 storage 可降到 `O(n)`（若另存 predecessors 仍線性）。

### 易錯點與材料缺口

- Dijkstra 不是「遇到任何 negative edge 必定輸出錯誤」，而是 correctness guarantee 不再成立；不可用於一般含負邊圖。
- Negative edge 不等於 negative cycle；Bellman–Ford 可處理前者，後者使 reachable shortest distances 不 well-defined。
- 只有 source reachable 的 negative cycle 會被 SSSP 版 BF 從 finite estimates 偵測；不可誇大成無條件找全圖任意 negative cycle。
- Dijkstra estimate 是 upper bound，不是 lower bound；relaxation 只會往下縮。
- `O(m+n log n)` 是 Fibonacci heap 的 amortized aggregate guarantee，不代表每次 DeleteMin 都 constant。
- slides 明示 Bellman–Ford 只快速帶過、Lecture 12 再嚴謹展開。若逐課文章追隨課堂主線，Lecture 11 應以 Dijkstra 為中心，BF 與 amortized proof 標成 preview / notes supplement。
- Notes 的 BF pseudocode 與 lecture DP arrays 版本不同，但語義與 `O(nm)` 結論相容；文章需先選定 state definition，不能在同一 proof 中混用 in-place 與 previous-round-only recurrence。

### 一手來源

- [Official lecture index](https://stanford-cs161.github.io/winter2026/lectures/)
- [Component source](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture11.md)
- [Lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-notes.pdf)
- [Slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-slides.pdf)
- component 列出 `lecture11-slides.pptx`，但 2026-08-21 檢查公開 asset 為 404，repository tree 也沒有該檔；因此只把有效 PDF 列為已讀來源。
- [Official Colab notebook](https://colab.research.google.com/github/stanford-cs161/winter2025-extra/blob/colab/lecture11_dijkstra.ipynb)（僅記錄入口）
- [Pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture11-pre.pdf)（僅記錄入口）

## Lecture 12 — Dynamic Programming: Bellman-Ford and Floyd-Warshall

### 官方識別

- 日期：2026-02-18，13:30–14:50
- 講師：Ellen
- component / notes 標題：**Dynamic Programming: Bellman-Ford and Floyd-Warshall**
- slides 封面：**Bellman-Ford, Floyd-Warshall, and Dynamic Programming!**

### 完整 agenda

1. 快速複習 Dijkstra，重新用 previous-round arrays 形式完整講 Bellman–Ford。
2. Bellman–Ford state meaning：`d^(k)[v]` 是最多 k edges 的 shortest s→v path；negative-cycle detection。
3. 由 BF recurrence 引出 dynamic programming：optimal substructure + overlapping subproblems。
4. Fibonacci warm-up：naive recursion 的 repeated work 與 exponential growth；bottom-up table 降到 linear time；top-down memoization 等價。
5. DP 三步 recipe：定義 subproblems / optimal substructure；寫 recurrence；按 dependency order 填表。
6. Floyd–Warshall 解 APSP：以允許的 intermediate vertex set `{1,…,k}` 定義 `D^(k)[u,v]`。
7. Floyd–Warshall recurrence、correctness induction、`O(n³)` runtime、two-layer storage，以及 `D^(n)[v,v]<0` 偵測 negative cycle。
8. notes 延伸：longest simple path 缺乏同樣 optimal substructure、是 NP-hard；dynamic programming 名稱的 Bellman 自述背景。

### 核心定義

- Dynamic programming：保存 subproblem solutions，依 dependencies 填表，讓重疊子問題只求一次。
- Optimal substructure：完整 optimal solution 可由較小 subproblems 的 optimal solutions 組成。
- Overlapping subproblems：同一 subproblem 會被多個較大問題重用，值得 memoize / tabulate。
- Bottom-up：從 base cases 依 dependency order迭代填表；top-down：遞迴求大問題，已算過的 subproblem 用 memo lookup。
- APSP：求所有 ordered vertex pairs `(u,v)` 的 shortest distances（以及若需要，predecessor `π(u,v)`）。
- Floyd–Warshall state `D^(k)[u,v]`：內部 vertices 只能來自 `{1,…,k}` 的 u→v 最短 path cost；u、v 本身不受此限制。

### 演算法步驟與例子

#### Bellman–Ford 的 DP 版

- Base：`d^(0)[s]=0`，其餘 infinity。
- 對 `k=1…n−1`，先複製 `d^(k−1)`，再用每條 edge `(u,v)` 計算 `d^(k)[v]=min(d^(k)[v],d^(k−1)[u]+w(u,v))`。
- State interpretation 使 proof 幾乎直接成為對 k 的 induction；實作只需保留 previous/current arrays。

#### Fibonacci warm-up（slides）

- Naive `Fib(n)=Fib(n−1)+Fib(n−2)` recursion 重算大量相同 nodes，recurrence 至少像 Fibonacci 數成長，為 exponential time。
- Bottom-up array 先填 `F[0],F[1]`，再依序 `F[i]=F[i−1]+F[i−2]`，時間 `O(n)`。
- Top-down memoization：遞迴前查 `F[n]`，只有 None 才計算並保存；每個 state 只展開一次。

#### Floyd–Warshall

- Base `D^(0)[u,u]=0`；若 `(u,v)∈E` 則 `D^(0)[u,v]=w(u,v)`，否則 infinity。
- 對 k=1…n、所有 `(u,v)`：
  `D^(k)[u,v]=min(D^(k−1)[u,v], D^(k−1)[u,k]+D^(k−1)[k,v])`。
- 第一項代表 optimal path 不用 vertex k；第二項代表會用 k，拆成 u→k 與 k→v，兩段內部 vertices 都只到 k−1。
- 回傳 `D^(n)`；若任一 diagonal `D^(n)[v,v]<0`，存在 negative cycle。

### 正確性論證

- Bellman–Ford：對 k induction，state 恰為最多 k edges 的 shortest path。任何 such optimal path要嘛已有 ≤k−1 edges，要嘛最後一 edge 是 `(u,v)`，前綴是最多 k−1 edges 的 optimal path；recurrence 完整覆蓋兩種情況。無 negative cycle 時 shortest path 可 simple，至多 n−1 edges。
- DP 與 divide-and-conquer 差別不是有無 recurrence，而是 DP 把 overlapping subproblems 的答案保存並重用；若 subproblems 不重疊，table 不一定帶來好處。
- Floyd–Warshall：對 k induction。取內部 vertices 限於 1…k 的 simple optimal path P；若 P 不含 k，成本是 `D^(k−1)[u,v]`；若含 k，無 negative cycle 時可取 simple path，因此 k 只需出現一次，拆成兩段，各自的內部 vertices 均 ≤k−1，成本相加。recurrence 取兩者較小，正好得到 state 定義。
- Negative-cycle test：若有經 v 的 negative closed path / cycle，`D^(n)[v,v]` 至多其負成本；反之 diagonal 為負即代表從 v 回 v 的負成本 walk，其中包含 negative cycle。
- Longest simple path 反例：即使整體 longest path 經 k，s→k 與 k→t 不能獨立各取 longest，因兩段可能重用 vertex 而破壞 simple constraint；故相同 shortest-path recurrence 不成立。

### 複雜度與空間

- Bellman–Ford：`O(nm)`；只保留相鄰兩個 rounds 時 distance storage `O(n)`。
- Naive Fibonacci recursion：exponential；bottom-up / memoized：`O(n)` time、`O(n)` table（若只需數值，bottom-up 可再壓成常數 slots，但官方 deck 用 array 說明 DP）。
- Floyd–Warshall：n layers × n² ordered pairs、每 cell constant work，`O(n³)`。
- Floyd–Warshall full conceptual table 是 `O(n³)`，但 recurrence 只依 previous layer，可保留兩個 `n×n` arrays，`O(n²)`；若做 safe in-place update，需要另外證明 update order 不破壞 recurrence，官方 pseudocode 沒有在此展開。
- 對 nonnegative weights，n 次 Dijkstra 可達 `O(nm+n²log n)`；Floyd–Warshall 在 dense worst case 同為 cubic 級，但較簡單且支援 negative edges（無 negative cycles時給 distances）。

### 易錯點與材料缺口

- Floyd–Warshall 的 k 是「可用的最大 intermediate vertex label」，不是 path edge 數；Bellman–Ford 的 k 才是最多 edges 數。
- `D^(k)[u,k]+D^(k)[k,v]` 會破壞 clean previous-layer recurrence；官方公式兩項都用 `k−1`。
- Negative edges 可以處理，negative cycles 則使 shortest distances 不 well-defined；演算法仍可用 diagonal 做偵測。
- Optimal substructure 與 overlapping subproblems 是兩個不同條件；前者給 recurrence，後者使 memoization / table 有效率。
- Top-down 與 bottom-up 在可計算 state 上等價，但實際訪問的 state 數、recursion overhead、space pattern 可能不同；官方「completely equivalent」是演算法表達層面的說法。
- notes 的 Floyd–Warshall pseudocode 初始化行有排版上的 `k∈{1,…,n}` 等細節，最穩妥解讀仍是標準 base layer `D^0` 加逐 k recurrence，和 slides 完全一致。
- slides 標註更快 APSP 研究結果那頁不屬本課 required knowledge；若文章提及，應放 `## 延伸`，不可混成學習目標。
- Longest path 與 Bellman 命名故事只在 notes，屬官方講義延伸，不是 slides 主線。

### 一手來源

- [Official lecture index](https://stanford-cs161.github.io/winter2026/lectures/)
- [Component source](https://raw.githubusercontent.com/stanford-cs161/winter2026/main/_components/lecture12.md)
- [Lecture notes](https://stanford-cs161.github.io/winter2026/assets/files/lecture12-notes.pdf)
- [Slides PDF](https://stanford-cs161.github.io/winter2026/assets/files/Lecture12.pdf)
- [Slides PPTX source](https://stanford-cs161.github.io/winter2026/assets/files/lecture12-slides.pptx)
- [Official Colab notebook](https://colab.research.google.com/github/stanford-cs161/winter2025-extra/blob/colab/lecture12_dp.ipynb)（僅記錄入口）
- [Pre-lecture exercise](https://stanford-cs161.github.io/winter2026/assets/files/lecture12-pre.pdf)（僅記錄入口）

## 跨課寫作約束（供後續文章作者）

1. Lecture 7–8 是資料結構橋段：BST / RBT 提供 deterministic worst-case `O(log n)`；hashing 在隨機函數與 load 模型下提供 expected `O(1)`，兩者保證不可互換。
2. Lecture 9–10 是 traversal bridge：先理解 DFS forest 與 finish times，SCC 的兩-pass 正確性才有基礎。
3. Lecture 9 的 BFS shortest path 只適用 unweighted；Lecture 11 才進入 weighted SSSP。
4. Lecture 11 與 12 有刻意重疊：11 以 Dijkstra 為主並 preview Bellman–Ford；12 重新用 DP state 正式講 BF，再推 Floyd–Warshall。雙篇不可複製同一篇內容，應分別聚焦「greedy finalization / priority queue」與「state recurrence / DP paradigm」。
5. 所有 runtime 都應同時寫 representation / weight / randomness 前提；不可只列大 O 而省略 model。
6. 若引用 notes-only 或 slides-only 段落，正文應標示「講義補充」或「投影片中的應用」，避免假稱兩份材料完全一致。
