---
title: "Harvard CS50 AI Week 3：Optimization——局部搜尋、模擬退火、約束滿足問題與填字遊戲"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, optimization, local-search, simulated-annealing, csp, ac-3, backtracking, crossword, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 4
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 4
tldr: "Week 3 探討優化問題：爬山算法、模擬退火逃離局部最優、CSP 框架與 AC-3 弧一致性、回溯搜尋，專案 Crossword 實作填字遊戲生成器。"
description: "詳細導讀 Harvard CS50 AI Week 3 Optimization：講課重點、影片時間軸、局部搜尋與模擬退火、CSP 變數/域/約束、AC-3 演算法、回溯搜尋與 MRV/degree 啟發式、Crossword 專案規格與 check50 指令。影片為 2020 年錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-17-harvard-cs50ai-w03-optimization-en)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

Week 3 解決優化問題：局部搜尋（爬山、隨機重啟）、模擬退火接受劣解、CSP 建模變數/域/約束、AC-3 過濾域、回溯搜尋配合 MRV 與 degree 啟發式。專案 Crossword 生成合法填字遊戲。

## 課程影片與時間軸

YouTube：[Week 3 Optimization (2020 錄製)](https://www.youtube.com/watch?v=8M8vLzl4p5M)

| 時間區段 | 內容 |
|---|---|
| 00:00–08:00 | 優化問題定義：目標函數、狀態空間、鄰居 |
| 08:00–22:00 | 局部搜尋：Hill Climbing、Sideways moves、Random Restart、Local Beam Search |
| 22:00–38:00 | 模擬退火：溫度參數、接受劣解機率、退火排程、收斂保證 |
| 38:00–52:00 | 線性規劃簡介：目標函數、約束、單形法概念 |
| 52:00–1:08:00 | 約束滿足問題 CSP：變數、域、約束、一致性、解 |
| 1:08:00–1:22:00 | AC-3 弧一致性算法、回溯搜尋、MRV 最少剩餘值、Degree 啟發式、最小衝突值 |
| 1:22:00–1:30:00 | 專案介紹：Crossword（CSP + 回溯生成填字遊戲） |

> 完整逐字稿：[Week 3 Notes](https://cs50.harvard.edu/ai/2020/notes/3/)

## 核心概念速覽

### 局部搜尋家族

| 算法 | 核心思想 | 缺點 |
|---|---|---|
| Hill Climbing | 每步選最佳鄰居 | 卡在局部最優、平台、山脊 |
| Sideways Moves | 允許平移相同分數 | 可能在平台循環 |
| Random Restart | 多次隨機初始化 | 需多次試驗 |
| Local Beam Search | 保留 k 個最佳狀態 | 多樣性不足 |
| **Simulated Annealing** | **溫度高時接受劣解，逐漸降溫** | **參數敏感、需精心調排程** |

**模擬退火接受機率**：
```
P(accept) = 1                    if ΔE > 0 (更好)
P(accept) = exp(ΔE / T)          if ΔE ≤ 0 (更差)
```
其中 ΔE = 新狀態目標值 - 當前目標值，T 為溫度。T → 0 時退化為 Hill Climbing。

### 約束滿足問題 CSP

**CSP 三要素**：
1. **變數** X = {X₁, X₂, ..., Xₙ}
2. **域** D = {D₁, D₂, ..., Dₙ}，每個變數可能取值
3. **約束** C：指定允許的取值組合

**節點一致性**：單一變數滿足一元約束  
**弧一致性**：對每個弧 (Xᵢ, Xⱼ)，Xᵢ 的每個值在 Xⱼ 中都有支撐

### AC-3 算法

```python
# ac3.py 核心實作
from collections import deque

def ac3(csp, queue=None):
    """強制弧一致性，回傳是否可能（無空域）"""
    if queue is None:
        queue = deque([(Xi, Xj) for Xi in csp.variables for Xj in csp.neighbors[Xi]])
    
    while queue:
        Xi, Xj = queue.popleft()
        if revise(csp, Xi, Xj):
            if not csp.domains[Xi]:  # 域變空 → 不一致
                return False
            for Xk in csp.neighbors[Xi] - {Xj}:
                queue.append((Xk, Xi))
    return True

def revise(csp, Xi, Xj):
    """移除 Xi 中在 Xj 無支撐的值，回傳是否有修改"""
    revised = False
    for x in csp.domains[Xi][:]:  # 複製迭代
        # 檢查是否存在 y ∈ D(Xj) 滿足約束
        if not any(csp.constraints(Xi, x, Xj, y) for y in csp.domains[Xj]):
            csp.domains[Xi].remove(x)
            revised = True
    return revised
```

### 回溯搜尋 + 啟發式

```python
# backtracking.py 核心骨架
def backtrack(assignment, csp):
    if len(assignment) == len(csp.variables):
        return assignment  # 完整指派
    
    var = select_unassigned_variable(assignment, csp)  # MRV + Degree
    for value in order_domain_values(var, assignment, csp):  # LCV
        if is_consistent(var, value, assignment, csp):
            assignment[var] = value
            # 可選：前向檢查或維持弧一致性
            inferences = {}
            if inference(var, value, assignment, csp, inferences):
                result = backtrack(assignment, csp)
                if result is not None:
                    return result
            del assignment[var]
    return None

# MRV: 最少剩餘值
def select_unassigned_variable(assignment, csp):
    unassigned = [v for v in csp.variables if v not in assignment]
    return min(unassigned, key=lambda v: (len(csp.domains[v]), -len(csp.neighbors[v])))  # MRV, tie-break: Degree

# LCV: 最小衝突值
def order_domain_values(var, assignment, csp):
    return sorted(csp.domains[var], 
                  key=lambda v: count_conflicts(var, v, assignment, csp))
```

---

## 專案 3：Crossword —— CSP 生成填字遊戲

### 任務

給定結構檔（`structure.txt` 定義橫/直槽位）與單字表（`words.txt`），將單字填入所有槽位，使交叉處字母一致。每個單字只能用一次。

### Distribution Code 重點

```python
# crossword.py 提供的核心類別
class Variable:
    def __init__(self, i, j, direction, length):
        self.i = i          # 起始列
        self.j = j          # 起始行
        self.direction = direction  # 'across' 或 'down'
        self.length = length
        self.cells = []     # [(i,j), ...] 所有格子座標

class CrosswordCreator:
    def __init__(self, crossword, words):
        self.crossword = crossword  # Crossword 物件含 variables、overlaps
        self.words = words          # 可用單字集合
        self.domains = {var: set(words) for var in crossword.variables}
    
    def solve(self):
        """回傳完整指派 {var: word} 或 None"""
        assignment = {}
        return self.backtrack(assignment)
```

### 重疊檢測（已提供）

```python
# crossword.py 中已建立的 overlaps 字典
# self.crossword.overlaps[var1][var2] = (i, j) 表示 var1 第 i 字元 = var2 第 j 字元
# 例如：var1[3] == var2[1]
```

### 參考實作核心：`add_constraints` + 回溯

```python
# crossword.py 片段
def add_constraints(self):
    """建立所有二元約束：重疊位置字母必須相同"""
    for var1 in self.crossword.variables:
        for var2 in self.crossword.variables:
            if var1 == var2:
                continue
            overlap = self.crossword.overlaps[var1].get(var2)
            if overlap:
                i, j = overlap
                # 約束函數：word1[i] == word2[j]
                def constraint(w1, w2, i=i, j=j):
                    return w1[i] == w2[j]
                self.constraints[(var1, var2)] = constraint

def backtrack(self, assignment):
    if len(assignment) == len(self.crossword.variables):
        return assignment
    
    # MRV 啟發式
    unassigned = [v for v in self.crossword.variables if v not in assignment]
    var = min(unassigned, key=lambda v: len(self.domains[v]))
    
    # LCV 排序
    for word in sorted(self.domains[var], 
                       key=lambda w: self.count_conflicts(var, w, assignment)):
        if self.is_consistent(var, word, assignment):
            assignment[var] = word
            
            # 前向檢查：更新鄰居域
            inferences = {}
            if self.forward_check(var, word, assignment, inferences):
                result = self.backtrack(assignment)
                if result:
                    return result
            
            # 復原域
            for v, removed in inferences.items():
                self.domains[v].update(removed)
            del assignment[var]
    
    return None

def forward_check(self, var, word, assignment, inferences):
    """將 word 指派給 var 後，過濾鄰居域"""
    for neighbor in self.crossword.neighbors[var]:
        if neighbor in assignment:
            continue
        overlap = self.crossword.overlaps[var][neighbor]
        i, j = overlap
        required_char = word[i]
        
        # 只保留第 j 字元 = required_char 的單字
        removed = set()
        for w in self.domains[neighbor]:
            if w[j] != required_char:
                removed.add(w)
        if removed:
            inferences[neighbor] = removed
            self.domains[neighbor] -= removed
            if not self.domains[neighbor]:
                return False
    return True

def count_conflicts(self, var, word, assignment):
    """LCV：計算選 word 會讓多少鄰居失去合法值"""
    conflicts = 0
    for neighbor in self.crossword.neighbors[var]:
        if neighbor in assignment:
            continue
        overlap = self.crossword.overlaps[var][neighbor]
        i, j = overlap
        for w in self.domains[neighbor]:
            if w[j] != word[i]:
                conflicts += 1
    return conflicts
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/3/crossword.zip
unzip crossword.zip && cd crossword

# 測試小型結構
python generate.py data/structure1.txt data/words1.txt output.png

# 自動評分
check50 ai50/projects/2024/x/crossword

style50 generate.py
```

> **注意**：Crossword 專案只有一個專案（非 A/B 分割），但難度較高，需正確實作 AC-3 / 前向檢查 / MRV / LCV 組合才能在合理時間內解出大型填字遊戲。

---

## 學習檢核清單

- [ ] 能比較 Hill Climbing、Simulated Annealing、Local Beam Search 三者在逃離局部最優的策略差異
- [ ] 能手寫 AC-3 算法並解釋 `revise` 何時回傳 True
- [ ] 理解 MRV（最少剩餘值）與 Degree 啟發式的選變數順序邏輯
- [ ] 理解 LCV（最小衝突值）為何能減少回溯
- [ ] 能解釋 Crossword 中 `overlaps` 字典如何編碼二元約束
- [ ] Crossword 專案 `check50` 全綠（大型測資也能在時限內解出）

## 參考資料

- [Week 3 Optimization 講課頁](https://cs50.harvard.edu/ai/weeks/3/) — 影片、投影片、逐字稿、Quiz
- [Week 3 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/3/) — 本文內容主要來源
- [Crossword 專案規格](https://cs50.harvard.edu/ai/projects/3/crossword/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/crossword`
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義