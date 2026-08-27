# CS161 Winter 2026 逐講寫作契約

## 文章身份

- 一篇只對應一個官方 lecture，不把其他講次的內容搬來填篇幅。
- 中文檔與英文檔必須維持同一組命題、例子、公式、正確性結論、複雜度與限制。
- 發布日使用實際製作日 `2026-08-21`；官方上課日期只寫在正文，不冒充發布日。
- 中文 series：`Stanford CS161 導讀`；英文 series：`Reading Stanford CS161`。
- Lecture 1–18 的 reading order 是 2–19；總覽已佔 order 1。
- 主系列只掛 CS161。Stanford CS 主線總系列只收總覽，不收逐講文章。

## Frontmatter

- `category: learning`
- `type: deep-dive`
- `tags` 以 `[cs161, algorithms, stanford, <topic>]` 為基線，維持小寫 kebab-case。
- `lang` 分別為 `zh-TW` 與 `en`。
- `description` 描述覆蓋範圍；`tldr` 給出本講最重要的推理結果。
- `draft: false`

## 固定開場

1. 第一行放另一語言版本連結。
2. 說明這是系列第幾篇，連回 `/series/stanford-cs161` 或 `/en/series/stanford-cs161`。
3. 明列 `Stanford CS161, Winter 2026`、官方 lecture number、上課日期、講師。
4. 說明實際讀到的公開材料；Canvas-only 錄影一律明說未作為來源。

## 正文最低覆蓋

每篇依該講 agenda 調整標題，但必須交代：

1. 問題或資料結構要解決什麼。
2. 定義與符號。
3. 演算法或推導的關鍵步驟。
4. 至少一個可手算或可追蹤的例子。
5. 正確性為什麼成立；若本講未給完整證明，誠實標明證明範圍。
6. 時間與空間複雜度，以及成立條件。
7. 最容易誤用的限制或反例。
8. 本講在 18 講路線中的前後關係。

課外比較、實作建議或現代工具補充只能放在中文 `## 延伸`／英文 `## Beyond the lecture`，不能混成 Stanford 課堂內容。

## 雙語術語

| English | zh-TW |
|---|---|
| asymptotic analysis | 漸近分析 |
| worst-case analysis | 最壞情況分析 |
| recurrence | 遞迴式 |
| loop invariant | 迴圈不變量 |
| divide and conquer | 分治法 |
| comparison model | 比較模型 |
| lower bound | 下界 |
| binary search tree | 二元搜尋樹 |
| red-black tree | 紅黑樹 |
| hashing / hash table | 雜湊／雜湊表 |
| collision | 碰撞 |
| breadth-first search | 廣度優先搜尋（BFS） |
| depth-first search | 深度優先搜尋（DFS） |
| strongly connected component | 強連通分量（SCC） |
| relaxation | 鬆弛 |
| shortest path | 最短路徑 |
| dynamic programming | 動態規劃 |
| greedy algorithm | 貪婪演算法 |
| exchange argument | 交換論證 |
| minimum spanning tree | 最小生成樹（MST） |
| disjoint-set union | 不相交集合併（union-find） |
| residual graph | 殘餘圖 |
| augmenting path | 增廣路徑 |
| maximum flow / minimum cut | 最大流／最小割 |
| stable matching | 穩定配對 |
| deferred acceptance | 延遲接受 |

## 來源

- 文末 `## 參考資料`／`## References` 至少包含官方 lecture page、實際使用的 notes 或 slides、以及正文真的引用的輔助材料。
- 不引用未讀的 Canvas 錄影，不把 Winter 2025 notebook 或 concept-check bank 寫成 Winter 2026 新製教材；若使用，明列沿用來源。
- 直接可驗證的外部主張使用行內連結；不要只在文末堆一串沒在正文用到的連結。
