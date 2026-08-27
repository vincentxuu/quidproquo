---
title: "Harvard CS50 AI Week 0：Search——從 DFS、BFS、A* 到 Minimax 與 Alpha-Beta 剪枝"
date: 2026-08-27
category: tech
tags: [harvard-cs50ai, ai, search, bfs, minimax, alpha-beta, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 1
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 1
tldr: "Week 0 以搜尋算法為起點，涵蓋 BFS 最短路徑、Minimax 對弈、Alpha-Beta 剪枝優化，附 Degrees 與 Tic-Tac-Toe 兩專案完整實作。"
description: "詳細導讀 Harvard CS50 AI Week 0 Search：講課重點、影片時間軸、BFS 圖搜尋與 Minimax 程式碼範例、兩個專案 Degrees 與 Tic-Tac-Toe 的規格與 check50 指令。影片為 2020 年錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

Week 0 以搜尋為切入點，建立 AI 最基礎的解題框架：從無資訊搜尋到有資訊搜尋，再到對弈搜尋。兩個專案分別對應 BFS（Degrees）與 Minimax（Tic-Tac-Toe）。

## 課程影片與時間軸

YouTube：[Week 0 Search (2020 錄製)](https://www.youtube.com/watch?v=6CDPTq0C98U)

| 時間區段 | 內容 |
|---|---|
| 00:00–08:00 | 課程簡介、AI 定義、七週大綱 |
| 08:00–18:00 | 搜尋問題形式化：Agent、State、Actions、Transition Model、Goal Test、Path Cost |
| 18:00–32:00 | 無資訊搜尋：DFS（Stack）、BFS（Queue）、節點資料結構、Frontier 擴展流程 |
| 32:00–42:00 | 有資訊搜尋：Greedy Best-First、啟發式函數 h(n)、曼哈頓距離 |
| 42:00–52:00 | A* 搜尋：f(n) = g(n) + h(n)、Admissible 與 Consistent 啟發式 |
| 52:00–1:10:00 | 對弈搜尋：Minimax、Utility、Terminal State、Max-Value/Min-Value 遞迴 |
| 1:10:00–1:18:00 | Alpha-Beta Pruning：α、β 界限、剪枝原理 |
| 1:18:00–1:22:00 | Depth-Limited Minimax、Evaluation Function |

> 完整逐字稿與投影片：[Week 0 Notes](https://cs50.harvard.edu/ai/2020/notes/0/)

## 核心概念速覽

### 搜尋問題五要素

| 要素 | 說明 |
|---|---|
| Initial State | 起始狀態（如：當前位置、空棋盤） |
| Actions(s) | 狀態 s 可執行的動作集合 |
| Transition Model | Result(s, a) 回傳執行 a 後的新狀態 |
| Goal Test | 判斷是否達到目標 |
| Path Cost | 路徑代價函數（導航最短時間、棋局最少步數） |

### Frontier 與節點

每個節點包含：`state`、`parent`、`action`、`path_cost`。Frontier 決定搜尋策略：

- **Stack (LIFO)** → DFS：深度優先，可能非最優、記憶體省
- **Queue (FIFO)** → BFS：廣度優先，保證最短路徑、記憶體耗大
- **Priority Queue** → Greedy / A*：依 f(n) 排序

### 啟發式函數條件（A* 最優保證）

1. **Admissible**：h(n) ≤ 真實代價，永不高估
2. **Consistent**：h(n) ≤ c(n, n') + h(n')，局部最優推廣全域

### Minimax 雙人零和博弈

- Maximizer（X）追求最高 utility（+1），Minimizer（O）追求最低（-1）
- 遞迴定義：
  - `Max-Value(s) = max_{a∈Actions(s)} Min-Value(Result(s,a))`
  - `Min-Value(s) = min_{a∈Actions(s)} Max-Value(Result(s,a))`
- Terminal state 回傳 `Utility(s) ∈ {−1, 0, +1}`

### Alpha-Beta Pruning

- α = Maximizer 目前最佳下界；β = Minimizer 目前最佳上界
- 若 α ≥ β，後續分支無須展開
- **不影響結果**，僅減少展開節點數

## 專案 0A：Degrees —— BFS 找演員六度人脈

### 任務

給定 IMDb 資料集（`people.csv`、`movies.csv`、`stars.csv`），實作 `shortest_path(source, target)` 回傳最短合作路徑，格式為 `[(movie_id, person_id), ...]`。

### Distribution Code 重點（`util.py` 已提供）

```python
# util.py 關鍵類別（已內建，可直接 import）
class Node:
    def __init__(self, state, parent, action, path_cost):
        self.state = state
        self.parent = parent
        self.action = action
        self.path_cost = path_cost

class QueueFrontier:
    def __init__(self):
        self.frontier = []
    def add(self, node):
        self.frontier.append(node)
    def remove(self):
        if self.empty():
            raise Exception("empty frontier")
        node = self.frontier[0]
        self.frontier = self.frontier[1:]
        return node
    # ... empty(), contains_state()
```

### 參考實作：`shortest_path`（BFS）

```python
# degrees.py 片段
from util import QueueFrontier

def shortest_path(source, target):
    """BFS 找最短路徑，回傳 [(movie_id, person_id), ...] 或 None"""
    if source == target:
        return []

    start = Node(state=source, parent=None, action=None, path_cost=0)
    frontier = QueueFrontier()
    frontier.add(start)
    explored = set()

    while not frontier.empty():
        node = frontier.remove()
        explored.add(node.state)

        for movie_id, person_id in neighbors_for_person(node.state):
            if person_id == target:
                # 重建路徑
                path = [(movie_id, person_id)]
                while node.parent is not None:
                    path.append(node.action)
                    node = node.parent
                path.reverse()
                return path

            if not frontier.contains_state(person_id) and person_id not in explored:
                child = Node(state=person_id, parent=node, action=(movie_id, person_id), path_cost=node.path_cost + 1)
                frontier.add(child)
    return None
```

> **關鍵優化**：在加入 frontier 前檢查 `person_id == target`，直接回傳，避免多一次 dequeue。

### 執行與驗證

```bash
# 下載 distribution（2023/x 版）
wget https://cdn.cs50.net/ai/2023/x/projects/0/degrees.zip
unzip degrees.zip && cd degrees

# 執行（預設 small 資料集）
python degrees.py small

# 自動評分
check50 ai50/projects/2024/x/degrees

# 代碼風格
style50 degrees.py
```

---

## 專案 0B：Tic-Tac-Toe —— Minimax 最佳策略

### 任務

在 `tictactoe.py` 實作七個函數，完成一個永不輸的井字棋 AI。

### 需實作函數簽名

| 函數 | 輸入 | 輸出 | 備註 |
|---|---|---|---|
| `player(board)` | board | `X` 或 `O` | X 先手，交替 |
| `actions(board)` | board | `set((i,j))` | 所有空格位置 |
| `result(board, action)` | board, (i,j) | new board | **深拷貝**，不修改原 board |
| `winner(board)` | board | `X`/`O`/`None` | 檢查列、行、對角線 |
| `terminal(board)` | board | `bool` | 勝負或平手 |
| `utility(board)` | terminal board | `1`/`0`/`-1` | X勝=1、平手=0、O勝=-1 |
| `minimax(board)` | board | `(i,j)` 或 `None` | 回傳最佳動作 |

### 參考實作核心：`minimax` + Alpha-Beta

```python
# tictactoe.py 片段
import copy

def minimax(board):
    if terminal(board):
        return None

    current = player(board)
    best_action = None

    if current == X:  # Maximizer
        best_val = float('-inf')
        for action in actions(board):
            val = min_value(result(board, action), best_val, float('inf'))
            if val > best_val:
                best_val = val
                best_action = action
    else:  # Minimizer
        best_val = float('inf')
        for action in actions(board):
            val = max_value(result(board, action), float('-inf'), best_val)
            if val < best_val:
                best_val = val
                best_action = action
    return best_action

def max_value(board, alpha, beta):
    if terminal(board):
        return utility(board)
    v = float('-inf')
    for action in actions(board):
        v = max(v, min_value(result(board, action), alpha, beta))
        if v >= beta:
            return v
        alpha = max(alpha, v)
    return v

def min_value(board, alpha, beta):
    if terminal(board):
        return utility(board)
    v = float('inf')
    for action in actions(board):
        v = min(v, max_value(result(board, action), alpha, beta))
        if v <= alpha:
            return v
        beta = min(beta, v)
    return v
```

### `result` 深拷貝關鍵

```python
def result(board, action):
    i, j = action
    if board[i][j] != EMPTY:
        raise Exception("Invalid action")
    new_board = copy.deepcopy(board)
    new_board[i][j] = player(board)
    return new_board
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/0/tictactoe.zip
unzip tictactoe.zip && cd tictactoe
pip3 install -r requirements.txt  # pygame

# 人機對戰
python runner.py

# 自動評分（需 100% 通過）
check50 ai50/projects/2024/x/tictactoe

style50 tictactoe.py
```

---

## 學習檢核清單

- [ ] 能口述 DFS/BFS/A* 三者在最優性、完整性、時空複雜度的差異
- [ ] 能手寫 BFS 找最短路徑（含路徑重建）
- [ ] 能寫出 Minimax 遞迴骨架與 Alpha-Beta 剪枝條件
- [ ] 理解 `result` 必須深拷貝的原因（Minimax 會並行探索多棋盤狀態）
- [ ] 兩個專案 `check50` 全綠

## 參考資料

- [Week 0 Search 講課頁](https://cs50.harvard.edu/ai/weeks/0/) — 影片、投影片、逐字稿、Quiz
- [Week 0 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/0/) — 本文內容主要來源
- [Degrees 專案規格](https://cs50.harvard.edu/ai/projects/0/degrees/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/degrees`
- [Tic-Tac-Toe 專案規格](https://cs50.harvard.edu/ai/projects/0/tictactoe/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/tictactoe`
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm) — 含 Week 0 完整影片
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義