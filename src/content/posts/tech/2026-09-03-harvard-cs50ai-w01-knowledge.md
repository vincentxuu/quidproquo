---
title: "Harvard CS50 AI Week 1：Knowledge——命題邏輯、模型檢查、推理規則與知識表示"
date: 2026-08-30
category: tech
tags: [harvard-cs50ai, ai, logic, knowledge, model-checking, resolution, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 2
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 2
tldr: "Week 1 進入知識表示與推理：命題邏輯連結詞、模型檢查算法、Modus Ponens/Resolution 推理規則、CNF 轉換，專案 Knights 與 Minesweeper 實作邏輯謎題與掃雷 AI。"
description: "詳細導讀 Harvard CS50 AI Week 1 Knowledge：講課重點、影片時間軸、命題邏輯語法、模型檢查與 Resolution 推理、知識工程實例、兩個專案 Knights 與 Minesweeper 的規格與 check50 指令。影片為 2020 年錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-03-harvard-cs50ai-w01-knowledge-en)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

Week 1 從搜尋轉向知識表示：用命題邏輯編碼世界、用模型檢查驗證推論、用 Resolution 做高效推理。兩專案分別對應邏輯謎題求解與掃雷機率推斷。

## 課程影片與時間軸

YouTube 播放列表：[CS50 AI 2020 全列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)（Week 1 為列表第 2 支影片）

| 時間區段 | 內容 |
|---|---|
| 00:00–06:00 | 知識型 Agent 簡介、Harry Potter 推理範例 |
| 06:00–18:00 | 命題邏輯語法：符號、連結詞、真值表 |
| 18:00–28:00 | 模型、知識庫、語意蘊含 |
| 28:00–42:00 | 模型檢查算法：遞迴枚舉所有模型、Python 實作 |
| 42:00–52:00 | 知識工程實例：Clue 推理、Mastermind |
| 52:00–1:04:00 | 推理規則：Modus Ponens、And Elimination、Double Negation、Implication Elimination、De Morgan、Distributive |
| 1:04:00–1:14:00 | Resolution：互補字面值、子句、CNF 轉換步驟、反證法 |
| 1:14:00–1:22:00 | 一階邏輯：常數、謂詞、全稱/存在量化 |

> 完整逐字稿：[Week 1 Notes](https://cs50.harvard.edu/ai/2020/notes/1/)

## 核心概念速覽

### 命題邏輯連結詞真值表

| 連結詞 | 符號 | P | Q | 結果 |
|---|---|---|---|---|
| Not | ¬ | F | — | T |
|  |  | T | — | F |
| And | ∧ | F | F | F |
|  |  | F | T | F |
|  |  | T | F | F |
|  |  | T | T | T |
| Or | ∨ | F | F | F |
|  |  | F | T | T |
|  |  | T | F | T |
|  |  | T | T | T |
| Implication | → | F | F | T |
|  |  | F | T | T |
|  |  | T | F | F |
|  |  | T | T | T |
| Biconditional | ↔ | F | F | T |
|  |  | F | T | F |
|  |  | T | F | F |
|  |  | T | T | T |

> **關鍵**：Implication 前件為假時永真；Biconditional 要求雙向同真假。

### 模型檢查算法

```python
# 邏輯模組關鍵類別（lecture 提供 logic.py）
class Symbol:
    def __init__(self, name): self.name = name
    def evaluate(self, model): return model[self]

class Not:
    def __init__(self, operand): self.operand = operand
    def evaluate(self, model): return not self.operand.evaluate(model)

class And:
    def __init__(self, *operands): self.operands = operands
    def evaluate(self, model): return all(op.evaluate(model) for op in self.operands)

# ... Or, Implication, Biconditional 類似

def model_check(knowledge, query):
    """回傳 KB 是否蘊含 query"""
    symbols = list({s for s in knowledge.symbols()} | {s for s in query.symbols()})
    return check_all(knowledge, query, symbols, {})

def check_all(knowledge, query, symbols, model):
    if not symbols:
        if knowledge.evaluate(model):
            return query.evaluate(model)
        return True
    else:
        remaining = symbols.copy()
        p = remaining.pop()
        model_true = model.copy(); model_true[p] = True
        model_false = model.copy(); model_false[p] = False
        return (check_all(knowledge, query, remaining, model_true) and
                check_all(knowledge, query, remaining, model_false))
```

> **複雜度**：n 個符號 → 2^n 個模型。只適用小規模 KB。

### 推理規則速查

| 規則 | 前提 | 結論 |
|---|---|---|
| Modus Ponens | α → β, α | β |
| And Elimination | α ∧ β | α（或 β） |
| Double Negation | ¬¬α | α |
| Implication Elimination | α → β | ¬α ∨ β |
| Biconditional Elimination | α ↔ β | (α → β) ∧ (β → α) |
| De Morgan 1 | ¬(α ∧ β) | ¬α ∨ ¬β |
| De Morgan 2 | ¬(α ∨ β) | ¬α ∧ ¬β |
| Distributive | α ∧ (β ∨ γ) | (α ∧ β) ∨ (α ∧ γ) |

### Resolution 與 CNF

**Resolution 規則**：若子句含互補字面值 (P, ¬P)，可消去產生新子句

```
   P ∨ Q        ¬P ∨ R
   ────────────────────
          Q ∨ R
```

**CNF 轉換三步驟**：
1. 消除雙向蕴含：α ↔ β → (α → β) ∧ (β → α)
2. 消除單向蕴含：α → β → ¬α ∨ β
3. 否定內推：用 De Morgan 將 ¬ 推到字面值層級

**反證法算法**：檢查 KB ⊨ α
1. 建構 (KB ∧ ¬α)
2. 轉 CNF
3. 反覆應用 Resolution
4. 產生空子句 → 矛盾 → KB ⊨ α
5. 無新子句且無空子句 → 不蘊含

---

## 專案 1A：Knights —— 邏輯謎題求解器

### 任務

在 `puzzle.py` 中為四個 Knights and Knaves 謎題構建知識庫 `knowledge0`–`knowledge3`，使用 `logic.py` 的 `model_check` 自動推理。

### 謎題規則編碼

每角色恰好是 Knight 或 Knave：
- `Or(AKnight, AKnave)`
- `Not(And(AKnight, AKnave))`  # 不能同時為真

Knight 說話為真，Knave 說話為假：
- `Implication(AKnight, statement)`  # 若 A 是 Knight，statement 為真
- `Implication(AKnave, Not(statement))`  # 若 A 是 Knave，statement 為假

### 四謎題知識庫參考

```python
# puzzle.py 片段
from logic import *

# 符號定義
AKnight = Symbol("A is a Knight")
AKnave = Symbol("A is a Knave")
BKnight = Symbol("B is a Knight")
BKnave = Symbol("B is a Knave")
CKnight = Symbol("C is a Knight")
CKnave = Symbol("C is a Knave")

# Puzzle 0: A says "I am both a knight and a knave"
knowledge0 = And(
    Or(AKnight, AKnave),
    Not(And(AKnight, AKnave)),
    Implication(AKnight, And(AKnight, AKnave)),
    Implication(AKnave, Not(And(AKnight, AKnave)))
)

# Puzzle 1: A says "We are both knaves", B says nothing
knowledge1 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, And(AKnave, BKnave)),
    Implication(AKnave, Not(And(AKnave, BKnave)))
)

# Puzzle 2: A says "We are the same kind", B says "We are different kinds"
knowledge2 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Implication(AKnight, Or(And(AKnight, BKnight), And(AKnave, BKnave))),
    Implication(AKnave, Not(Or(And(AKnight, BKnight), And(AKnave, BKnave)))),
    Implication(BKnight, Or(And(AKnight, BKnave), And(AKnave, BKnight))),
    Implication(BKnave, Not(Or(And(AKnight, BKnave), And(AKnave, BKnight))))
)

# Puzzle 3: A says "I am a knight" or "I am a knave" (unknown which)
# B says "A said 'I am a knave'", B says "C is a knave"
# C says "A is a knight"
knowledge3 = And(
    Or(AKnight, AKnave), Not(And(AKnight, AKnave)),
    Or(BKnight, BKnave), Not(And(BKnight, BKnave)),
    Or(CKnight, CKnave), Not(And(CKnight, CKnave)),
    # A 的發言：若 A 是 Knight，則 A 說 "I am a Knight"；若 A 是 Knave，則 A 說 "I am a Knight" 也是謊話
    # 簡化處理：A 的發言等價於 "A is a Knight"（因為 Knight 說真、Knave 說假都會說這句）
    Implication(AKnight, AKnight),
    Implication(AKnave, Not(AKnight)),
    # B 的第一句："A said 'I am a knave'"
    Implication(BKnight, Implication(AKnight, AKnave)),  # 若 B 是 Knight，則 A 說過 "I am a knave"
    Implication(BKnave, Not(Implication(AKnight, AKnave))),
    # B 的第二句："C is a knave"
    Implication(BKnight, CKnave),
    Implication(BKnave, Not(CKnave)),
    # C 的發言："A is a knight"
    Implication(CKnight, AKnight),
    Implication(CKnave, Not(AKnight))
)
```

> **提示**：Puzzle 3 最棘手，關鍵在於 A 的發言內容不確定，但無論 A 說哪句，其真假值都受限於 A 的身分。

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/knights.zip
unzip knights.zip && cd knights

python puzzle.py
# 預期輸出每謎題的騎士/騙子判定

check50 ai50/projects/2024/x/knights
# 注意：Knights 專案需 100% 通過才算過關（非 70%）

style50 puzzle.py
```

---

## 專案 1B：Minesweeper —— 掃雷 AI

### 任務

在 `minesweeper.py` 完成 `Sentence` 類與 `MinesweeperAI` 類，實作基於邏輯推理的掃雷玩家。

### 知識表示：`Sentence` 類

```python
# minesweeper.py 片段
class Sentence:
    def __init__(self, cells, count):
        self.cells = set(cells)  # set of (i, j)
        self.count = count       # int: 其中地雷數

    def known_mines(self):
        """若 cells 數 == count，全部是地雷"""
        if len(self.cells) == self.count and self.count > 0:
            return self.cells.copy()
        return set()

    def known_safes(self):
        """若 count == 0，全部安全"""
        if self.count == 0:
            return self.cells.copy()
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            # count 不變，因為安全格不貢獻地雷數
```

### AI 推理核心：`add_knowledge`

```python
class MinesweeperAI:
    def __init__(self, height=8, width=8):
        self.height = height
        self.width = width
        self.moves_made = set()
        self.mines = set()
        self.safes = set()
        self.knowledge = []

    def add_knowledge(self, cell, count):
        # 1. 標記已點擊
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # 2. 建立新句子：鄰居中未知格子 = count
        neighbors = set()
        for i in range(cell[0]-1, cell[0]+2):
            for j in range(cell[1]-1, cell[1]+2):
                if (i, j) == cell: continue
                if 0 <= i < self.height and 0 <= j < self.width:
                    if (i, j) not in self.safes and (i, j) not in self.mines:
                        neighbors.add((i, j))
        if neighbors:
            self.knowledge.append(Sentence(neighbors, count))

        # 3. 迭代推理直到無新推論
        inferred = True
        while inferred:
            inferred = False
            new_knowledge = []
            new_mines = set()
            new_safes = set()

            # 3a. 從現有句子推論地雷/安全
            for sentence in self.knowledge:
                new_mines |= sentence.known_mines()
                new_safes |= sentence.known_safes()

            for mine in new_mines:
                if mine not in self.mines:
                    self.mark_mine(mine)
                    inferred = True
            for safe in new_safes:
                if safe not in self.safes:
                    self.mark_safe(safe)
                    inferred = True

            # 3b. 子集推論：S1 ⊂ S2 → S2 - S1 = c2 - c1
            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1 is s2: continue
                    if s1.cells.issubset(s2.cells):
                        diff_cells = s2.cells - s1.cells
                        diff_count = s2.count - s1.count
                        if diff_cells and diff_count >= 0:
                            new_sentence = Sentence(diff_cells, diff_count)
                            if new_sentence not in self.knowledge:
                                new_knowledge.append(new_sentence)
                                inferred = True

            self.knowledge.extend(new_knowledge)

            # 3c. 清理空句子
            self.knowledge = [s for s in self.knowledge if s.cells]

    def make_safe_move(self):
        safe_moves = self.safes - self.moves_made
        return safe_moves.pop() if safe_moves else None

    def make_random_move(self):
        choices = [(i, j) for i in range(self.height) for j in range(self.width)
                   if (i, j) not in self.moves_made and (i, j) not in self.mines]
        return random.choice(choices) if choices else None
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/1/minesweeper.zip
unzip minesweeper.zip && cd minesweeper
pip3 install -r requirements.txt  # pygame

# 人機對戰或 AI 自動玩
python runner.py

check50 ai50/projects/2024/x/minesweeper

style50 minesweeper.py
```

---

## 學習檢核清單

- [ ] 能寫出任意命題公式的真值表
- [ ] 能手動執行模型檢查（小規模 KB）
- [ ] 能列舉 8 種推理規則並給出例子
- [ ] 能將公式轉為 CNF 並應用 Resolution 反證
- [ ] 理解 Knights 專案中「身分約束」與「發言約束」的邏輯編碼差異
- [ ] 理解 Minesweeper 中 `Sentence` 的 `mark_mine`/`mark_safe` 為何要調整 `count`
- [ ] 兩專案 `check50` 全綠

## 參考資料

- [Week 1 Knowledge 講課頁](https://cs50.harvard.edu/ai/weeks/1/) — 影片、投影片、逐字稿、Quiz
- [Week 1 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/1/) — 本文內容主要來源
- [Knights 專案規格](https://cs50.harvard.edu/ai/projects/1/knights/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/knights`（需 100%）
- [Minesweeper 專案規格](https://cs50.harvard.edu/ai/projects/1/minesweeper/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/minesweeper`
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義