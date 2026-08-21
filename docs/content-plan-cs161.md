# 內容規劃：Stanford CS161 逐講系列

- 來源：Stanford CS161, **Winter 2026**（18 lectures）
- Canonical manifest：[官方 lecture index](https://stanford-cs161.github.io/winter2026/lectures/) 與 [course-site source](https://github.com/stanford-cs161/winter2026/tree/main/_components)
- 規模：**18 篇 × zh-TW/en = 36 個新 Markdown 檔**；既有雙語總覽另作 series order 1，不改 slug／date
- 資料成熟度：L3；錄影需 Canvas，但 18 講皆有公開 notes 或 slides，L1–17 另有多數 pre-lecture exercise、notebook 或 concept checks
- 狀態：**已完成**。使用者已明確核准 `>20 files` 批次；18 講共 36 個雙語 Markdown 於 2026-08-21 完成並通過品質閘門

## 交付契約

這個系列比照 `docs/content-plan-cs230.md`，不是把整門課再摘要一次：

1. 一篇對應一個官方 lecture，照該講 notes／slides 的 agenda 完整覆蓋，不用自選主題取代原課內容。
2. 每篇開頭標明 `Stanford CS161, Winter 2026`、官方講次、日期、講者與可取得的課堂材料。
3. 課程正文與站方觀點分離；補充、實作建議與不同教材的比較集中在文末 `## 延伸`。
4. 中文稿目標 6,000–9,500 字元；英文稿保持相同命題、例子、公式、限制與來源，不做縮水翻譯。
5. 公式至少交代符號、推導關鍵步與結論能做什麼；演算法至少涵蓋問題、想法、正確性與時間／空間複雜度。
6. 只使用可明確歸屬 Winter 2026 的課程材料。`winter2025-extra` notebooks 與 `winter2025-bank` concept checks 可作官方頁直接連結的輔助材料，但必須標明其來源版本。
7. Canvas-only 錄影不得假裝已讀；文章以公開 notes／slides 為主，材料缺口在文中說明。
8. 每篇文末至少列官方 lecture page、直接使用的 notes／slides，以及實際引用的教科書章節或外部來源。

## 系列與檔名契約

- Series zh-TW：`Stanford CS161 導讀`
- Series en：`Reading Stanford CS161`
- Series slug：`stanford-cs161`
- 既有總覽：`series.order: 1`
- Lectures：reading order 2–19；官方 lecture number 保留在標題與本文，不拿缺號表達停課
- Category：`learning`
- Tags 基線：`[stanford, cs161, algorithms]`，再依講次增加 1–3 個主題 tag
- 中文 slug 格式：`YYYY-MM-DD-stanford-cs161-lecture-NN-<topic>.md`
- 英文檔：同 slug 加 `-en.md`

發布日期在實際寫作批次開始時決定；不得為了讓 36 篇同日上線而回填不實日期。

## 十八篇 manifest

`材料` 欄只列公開且可直接支撐正文的核心來源；錄影全數在 Canvas，不列為已讀證據。

| Reading order | Official lecture | Date | Instructor | Official title | Planned topic slug | Public material | Writing focus |
|---:|---:|---|---|---|---|---|---|
| 2 | 1 | 2026-01-05 | Ellen Vitercik | Why are you here? | `why-algorithm-analysis` | notes, slides, Karatsuba notebook, concept checks | 三個課程目標；乘法、分治與 Karatsuba；為什麼實測時間不能取代漸近分析 |
| 3 | 2 | 2026-01-07 | Ellen Vitercik | Asymptotics, Worst-Case Analysis, and MergeSort | `asymptotics-worst-case-mergesort` | pre-lecture, notes, slides, insertion-sort proof, notebook, concept checks | 漸近符號、worst case、InsertionSort 正確性、MergeSort 與遞迴式 |
| 4 | 3 | 2026-01-12 | Moses Charikar | Solving Recurrences and the Master Theorem | `recurrences-master-theorem` | pre-lecture, notes, slides, concept checks | substitution、recursion tree、Master Theorem 的三種情況與適用邊界 |
| 5 | 4 | 2026-01-14 | Moses Charikar | Median and Selection | `median-selection` | pre-lecture, notes, slides, notebook, concept checks | selection 問題、pivot、median-of-medians、線性時間保證 |
| 6 | 5 | 2026-01-21 | Moses Charikar | Randomized Algorithms and QuickSort | `randomized-algorithms-quicksort` | pre-lecture, notes, slides, notebook, concept checks | 隨機化、期望分析、QuickSort partition 與 worst-case／expected-case 差異 |
| 7 | 6 | 2026-01-26 | Moses Charikar | BucketSort and Lower Bounds for Sorting | `bucketsort-sorting-lower-bounds` | pre-lecture, notes, slides, notebook, concept checks | 線性時間排序的假設；comparison model；決策樹與 Ω(n log n) lower bound |
| 8 | 7 | 2026-01-28 | Moses Charikar | Binary Search Trees and Red-Black Trees | `binary-search-red-black-trees` | pre-lecture＋solution, notes, slides, concept checks | BST 操作、失衡問題、red-black invariants、旋轉與高度界限 |
| 9 | 8 | 2026-02-02 | Ellen Vitercik | Hashing | `hashing` | pre-lecture, notes, slides, notebook, concept checks | hash table、collision、universal hashing 與 expected performance |
| 10 | 9 | 2026-02-04 | Ellen Vitercik | Graphs and BFS and DFS | `graphs-bfs-dfs` | pre-lecture, notes, slides, notebook, concept checks | 圖表示、BFS／DFS、reachability、layer／tree 結構與正確性 |
| 11 | 10 | 2026-02-09 | Moses Charikar | Strongly Connected Components | `strongly-connected-components` | pre-lecture, notes, slides, notebook, concept checks | directed graph、finish times、transpose graph 與 SCC 分解 |
| 12 | 11 | 2026-02-11 | Moses Charikar | Dijkstra and Bellman-Ford | `dijkstra-bellman-ford` | pre-lecture, notes, slides, notebook, concept checks | shortest paths、relaxation、Dijkstra 的非負權限制、Bellman–Ford 與負環 |
| 13 | 12 | 2026-02-18 | Ellen Vitercik | Dynamic Programming: Bellman-Ford and Floyd-Warshall | `dynamic-programming-shortest-paths` | pre-lecture, notes, slides, notebook, concept checks | 從 recurrence 到 DP；Bellman–Ford 的 DP 視角；Floyd–Warshall 狀態設計 |
| 14 | 13 | 2026-02-23 | Ellen Vitercik | More Dynamic Programming: LCS, Knapsack, Independent Set | `dynamic-programming-lcs-knapsack` | notes, slides, concept checks | state、transition、base case、reconstruction；LCS、Knapsack、Independent Set |
| 15 | 14 | 2026-02-25 | Ellen Vitercik | Greedy Algorithms | `greedy-algorithms` | pre-lecture, notes, slides, notebook, concept checks | greedy choice、exchange argument、何時局部最優能推出全域最優 |
| 16 | 15 | 2026-03-02 | Moses Charikar | Minimum Spanning Trees | `minimum-spanning-trees` | pre-lecture, notes, slides, notebook, concept checks | cut property、Kruskal、Prim、union-find 與正確性證明 |
| 17 | 16 | 2026-03-04 | Moses Charikar | Max-Flow and the Ford-Fulkerson Algorithm | `max-flow-ford-fulkerson` | pre-lecture, notes, slides, concept checks | residual graph、augmenting path、Ford–Fulkerson、max-flow min-cut |
| 18 | 17 | 2026-03-09 | Ellen Vitercik | Stable Matchings and Gale-Shapley | `stable-matching-gale-shapley` | notes, slides, concept checks | stability、deferred acceptance、終止與正確性、提案方最優性 |
| 19 | 18 | 2026-03-11 | Ellen Vitercik | What's next? | `whats-next` | slides | 課程收束與後續演算法路線；只寫投影片實際涵蓋內容，不用別年 notes 補齊 |

## 寫作順序與批次

內容具有依賴性，研究與發布順序保持 1→18。若取得 36 檔整體核准，實作仍切成小批次驗證：

1. [x] Pilot：Lecture 1 zh/en（2 檔），先驗證格式、公式、來源與中英 parity。
2. [x] Batch A：Lectures 2–6 zh/en（10 檔）。
3. [x] Batch B：Lectures 7–11 zh/en（10 檔）。
4. [x] Batch C：Lectures 12–15 zh/en（8 檔）。
5. [x] Batch D：Lectures 16–18 zh/en（6 檔）。

每一批都要先完成 source notes，再依序跑 `post-review`、`post-verify`、`pnpm check:references`、`pnpm check:lang-parity` 與 `pnpm verify`。前一批未通過，不開始下一批。

## 不納入十八篇的項目

- EthiCS session：是額外週五課，不在官方 1–18 lecture sequence；可另寫延伸，但不算系列完成條件。
- Review sessions、sections、CS161A／ACE：屬支援課程，不冒充主課 lecture。
- Canvas recordings：存在但需 Stanford 權限，不能當公開研究證據。
- Summer CS161：同課號但教材與教學路線不同，不混入 Winter 2026 系列。

## 完成定義

- 既有總覽＋18 講在 zh-TW/en 各形成 order 1–19 的連續系列。
- 每講一對文章，標題、命題、公式、例子、限制、lecture metadata 與來源中英一致。
- 18 講 agenda 均被覆蓋；材料不足之處誠實標記，沒有跨學期偷補。
- Course series 顯示 19 篇；Stanford master series 只顯示 CS161 總覽代表卡，不收 18 篇 lectures。
- 所有 targeted tests、內容檢查與 `pnpm verify` 通過。
