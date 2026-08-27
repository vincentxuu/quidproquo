---
title: "Harvard CS50 AI Week 0: Search — From DFS, BFS, A* to Minimax and Alpha-Beta Pruning"
date: 2026-08-27
category: tech
tags: [harvard-cs50ai, ai, search, bfs, minimax, alpha-beta, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 1
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 1
tldr: "Week 0 opens with search algorithms: BFS for shortest paths, Minimax for adversarial play, Alpha-Beta for pruning. Two projects: Degrees (BFS) and Tic-Tac-Toe (Minimax)."
description: "Detailed guide to Harvard CS50 AI Week 0 Search: lecture highlights, video timestamps, BFS graph search and Minimax code examples, plus Degrees and Tic-Tac-Toe project specs and check50 commands. Videos recorded 2020; specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)

> ⚠️ **Version note**: This week's lecture videos were **recorded in Spring 2020**; project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 0 introduces search as the foundational problem-solving framework in AI: from uninformed to informed search, then adversarial search. Two projects map directly to BFS (Degrees) and Minimax (Tic-Tac-Toe).

## Lecture Video & Timestamps

YouTube: [Week 0 Search (2020 recording)](https://www.youtube.com/watch?v=6CDPTq0C98U)

| Timestamp | Content |
|---|---|
| 00:00–08:00 | Course intro, AI definition, seven-week syllabus |
| 08:00–18:00 | Search problem formalization: Agent, State, Actions, Transition Model, Goal Test, Path Cost |
| 18:00–32:00 | Uninformed search: DFS (Stack), BFS (Queue), Node data structure, Frontier expansion loop |
| 32:00–42:00 | Informed search: Greedy Best-First, heuristic h(n), Manhattan distance |
| 42:00–52:00 | A* search: f(n) = g(n) + h(n), Admissible & Consistent heuristics |
| 52:00–1:10:00 | Adversarial search: Minimax, Utility, Terminal State, Max-Value/Min-Value recursion |
| 1:10:00–1:18:00 | Alpha-Beta Pruning: α/β bounds, pruning principle |
| 1:18:00–1:22:00 | Depth-Limited Minimax, Evaluation Function |

> Full transcript & slides: [Week 0 Notes](https://cs50.harvard.edu/ai/2020/notes/0/)

## Core Concepts Cheat Sheet

### Five Elements of a Search Problem

| Element | Description |
|---|---|
| Initial State | Starting configuration (e.g., current location, empty board) |
| Actions(s) | Set of legal actions in state s |
| Transition Model | Result(s, a) returns successor state |
| Goal Test | Predicate checking goal satisfaction |
| Path Cost | Numeric cost of a path (time, moves, etc.) |

### Frontier & Node Structure

Each node holds: `state`, `parent`, `action`, `path_cost`. Frontier choice determines strategy:

- **Stack (LIFO)** → DFS: deep-first, may be suboptimal, low memory
- **Queue (FIFO)** → BFS: breadth-first, guarantees shortest path, high memory
- **Priority Queue** → Greedy / A*: ordered by f(n)

### Heuristic Conditions (A* Optimality)

1. **Admissible**: h(n) ≤ true cost, never overestimates
2. **Consistent**: h(n) ≤ c(n, n') + h(n'), local optimality implies global

### Minimax for Two-Player Zero-Sum Games

- Maximizer (X) seeks max utility (+1), Minimizer (O) seeks min (-1)
- Recursive definition:
  - `Max-Value(s) = max_{a∈Actions(s)} Min-Value(Result(s,a))`
  - `Min-Value(s) = min_{a∈Actions(s)} Max-Value(Result(s,a))`
- Terminal state returns `Utility(s) ∈ {−1, 0, +1}`

### Alpha-Beta Pruning

- α = Maximizer's best lower bound; β = Minimizer's best upper bound
- If α ≥ β, prune remaining branches
- **Preserves exact result**, only reduces nodes expanded

---

## Project 0A: Degrees — BFS for Actor Degrees of Separation

### Task

Given IMDb datasets (`people.csv`, `movies.csv`, `stars.csv`), implement `shortest_path(source, target)` returning the shortest co-starring path as `[(movie_id, person_id), ...]`.

### Distribution Code Highlights (`util.py` provided)

```python
# util.py key classes (built-in, import directly)
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

### Reference Implementation: `shortest_path` (BFS)

```python
# degrees.py snippet
from util import QueueFrontier

def shortest_path(source, target):
    """BFS for shortest path; returns [(movie_id, person_id), ...] or None"""
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
                # Reconstruct path
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

> **Key optimization**: Check `person_id == target` before enqueueing; return immediately to avoid an extra dequeue.

### Run & Verify

```bash
# Download distribution (2023/x version)
wget https://cdn.cs50.net/ai/2023/x/projects/0/degrees.zip
unzip degrees.zip && cd degrees

# Run (defaults to small dataset)
python degrees.py small

# Autograde
check50 ai50/projects/2024/x/degrees

# Style check
style50 degrees.py
```

---

## Project 0B: Tic-Tac-Toe — Minimax Optimal Play

### Task

Implement seven functions in `tictactoe.py` to build an unbeatable Tic-Tac-Toe AI.

### Required Function Signatures

| Function | Input | Output | Notes |
|---|---|---|---|
| `player(board)` | board | `X` or `O` | X goes first, alternates |
| `actions(board)` | board | `set((i,j))` | All empty cells |
| `result(board, action)` | board, (i,j) | new board | **Deep copy**, don't mutate original |
| `winner(board)` | board | `X`/`O`/`None` | Check rows, cols, diagonals |
| `terminal(board)` | board | `bool` | Win, loss, or tie |
| `utility(board)` | terminal board | `1`/`0`/`-1` | X win=1, tie=0, O win=-1 |
| `minimax(board)` | board | `(i,j)` or `None` | Return optimal move |

### Reference Core: `minimax` + Alpha-Beta

```python
# tictactoe.py snippet
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

### `result` Deep Copy is Critical

```python
def result(board, action):
    i, j = action
    if board[i][j] != EMPTY:
        raise Exception("Invalid action")
    new_board = copy.deepcopy(board)
    new_board[i][j] = player(board)
    return new_board
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/0/tictactoe.zip
unzip tictactoe.zip && cd tictactoe
pip3 install -r requirements.txt  # pygame

# Play vs AI
python runner.py

# Autograde (must pass 100%)
check50 ai50/projects/2024/x/tictactoe

style50 tictactoe.py
```

---

## Learning Checklist

- [ ] Can articulate differences among DFS/BFS/A* in optimality, completeness, time/space complexity
- [ ] Can hand-write BFS shortest path with path reconstruction
- [ ] Can write Minimax recursion skeleton and Alpha-Beta pruning condition
- [ ] Understand why `result` must deep copy (Minimax explores many board states in parallel)
- [ ] Both projects pass `check50` clean

## References

- [Week 0 Search lecture page](https://cs50.harvard.edu/ai/weeks/0/) — video, slides, transcript, quiz
- [Week 0 Notes (2020 edition)](https://cs50.harvard.edu/ai/2020/notes/0/) — primary source for this post
- [Degrees project spec](https://cs50.harvard.edu/ai/projects/0/degrees/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/degrees`
- [Tic-Tac-Toe project spec](https://cs50.harvard.edu/ai/projects/0/tictactoe/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/tictactoe`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm) — includes full Week 0 video
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition