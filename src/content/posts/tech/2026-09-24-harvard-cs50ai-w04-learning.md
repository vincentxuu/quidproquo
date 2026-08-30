---
title: "Harvard CS50 AI Week 4：Learning——監督式學習、k-NN、SVM、強化學習 Q-learning 與 Nim"
date: 2026-08-30
category: tech
tags: [harvard-cs50ai, ai, machine-learning, supervised-learning, knn, svm, reinforcement-learning, q-learning, nim, shopping, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 5
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 5
tldr: "Week 4 進入機器學習：監督式分類（k-NN、SVM、Perceptron）、模型評估、強化學習基礎（MDP、Q-learning、ε-greedy），專案 Shopping 預測購買意願、Nim 學會玩遊戲。"
description: "詳細導讀 Harvard CS50 AI Week 4 Learning：講課重點、影片時間軸、監督式學習分類算法、k-NN 與 SVM 實作、強化學習 MDP 與 Q-learning 收斂、Shopping 專案（k-NN 分類）、Nim 專案（Q-learning），規格與 check50 指令。影片為 2020 年錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-24-harvard-cs50ai-w04-learning-en)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

Week 4 進入機器學習：監督式分類（k-NN、SVM、Perceptron、模型評估）、強化學習（MDP、Q-learning、ε-greedy 探索）。兩專案分別實作購買意願預測（k-NN）與學會玩 Nim 遊戲（Q-learning）。

## 課程影片與時間軸

YouTube：[Week 4 Learning (2020 錄製)](https://www.youtube.com/watch?v=6hL1QJ5V1K0)

| 時間區段 | 內容 |
|---|---|
| 00:00–10:00 | 機器學習定義、監督式/非監督式/強化學習三大類、資料集切分 |
| 10:00–28:00 | k-近鄰算法：距離度量、k 選擇、歸一化、scikit-learn 介面 |
| 28:00–42:00 | 支援向量機 SVM：超平面、間隔最大化、核技巧、軟間隔 |
| 42:00–55:00 | 感知機 Perceptron：線性可分、更新規則、多層感知機預告 |
| 55:00–1:10:00 | 模型評估：準確率、精確率、召回率、F1、混淆矩陣、交叉驗證 |
| 1:10:00–1:25:00 | 強化學習：Agent、Environment、State、Action、Reward、MDP、貝爾曼方程 |
| 1:25:00–1:40:00 | Q-learning：Q-table、更新規則、ε-greedy、收斂條件 |
| 1:40:00–1:50:00 | 專案介紹：Shopping（k-NN）、Nim（Q-learning） |

> 完整逐字稿：[Week 4 Notes](https://cs50.harvard.edu/ai/2020/notes/4/)

## 核心概念速覽

### 監督式學習分類算法比較

| 算法 | 模型類型 | 適用場景 | 優點 | 缺點 |
|---|---|---|---|---|
| **k-NN** | 實例基礎、無參數 | 小資料、低維、基線 | 簡單、無訓練階段 | 預測慢 O(n)、維度災難、需歸一化 |
| **SVM** | 參數化、最大間隔 | 中高維、非線性（核） | 泛化好、核技巧強 | 訓練慢 O(n²~n³)、參數敏感 |
| **Perceptron** | 線性分類器、在線學習 | 線性可分、串流資料 | 簡單、在線更新 | 僅線性可分、不收斂於噪聲資料 |

### k-NN 關鍵細節

```python
# shopping.py 參考實作核心
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import pandas as pd

def load_data(filename):
    df = pd.read_csv(filename)
    # 特徵工程：月份、瀏覽器、地區等 one-hot 或 ordinal 編碼
    evidence = df.drop('Revenue', axis=1)
    labels = df['Revenue'].astype(int)
    return evidence, labels

def train_model(evidence, labels):
    # 關鍵：標準化距離度量
    scaler = StandardScaler()
    evidence_scaled = scaler.fit_transform(evidence)
    
    # k=1 通常足夠（OCW spec 建議），但可用 CV 調整
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence_scaled, labels)
    return model, scaler

def evaluate(labels, predictions):
    # 計算 sensitivity (recall) 和 specificity
    tp = sum((l == 1 and p == 1) for l, p in zip(labels, predictions))
    tn = sum((l == 0 and p == 0) for l, p in zip(labels, predictions))
    fp = sum((l == 0 and p == 1) for l, p in zip(labels, predictions))
    fn = sum((l == 1 and p == 0) for l, p in zip(labels, predictions))
    
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    return sensitivity, specificity
```

> **關鍵**：Shopping 專案要求實作 `load_data`、`train_model`、`evaluate` 三個函數。`evaluate` 必須回傳 sensitivity（真陽性率）和 specificity（真陰性率），而非單純 accuracy。

### SVM 核心概念

- **硬間隔**：資料線性可分，最大化幾何間隔 2/‖w‖
- **軟間隔**：引入鬆弛變數 ξᵢ，允許誤分類，目標 min ½‖w‖² + C Σ ξᵢ
- **核技巧**：隱式映射到高維空間，常用核：RBF `K(x,y)=exp(-γ‖x-y‖²)`、多項式、Sigmoid

### 強化學習基礎：MDP 與 Q-learning

**馬可夫決策過程 MDP**：
- 狀態集 S、動作集 A、轉移機率 P(s'|s,a)、獎勵 R(s,a,s')、折扣因子 γ ∈ [0,1]

**貝爾曼最優方程**：
```
Q*(s,a) = E[R + γ max_{a'} Q*(s',a') | s,a]
```

**Q-learning 更新規則**（離線策略、模型自由）：
```
Q(s,a) ← Q(s,a) + α [R + γ max_{a'} Q(s',a') - Q(s,a)]
```

- α：學習率，γ：折扣因子
- **ε-greedy**：以 ε 機率隨機探索，1-ε 機率貪婪選擇 max Q
- 收斂條件：所有狀態-動作對無限被訪問、α 遞減滿足羅賓遜-門羅條件

---

## 專案 4A：Shopping —— k-NN 預測購買意願

### 任務

使用 `shopping.csv`（含 Administrative、Informational、ProductRelated 等數值特徵、Month、Browser、Region 等類別特徵、Revenue 標籤），訓練 k-NN 分類器預測訪客是否購買。

### Distribution Code 結構

```python
# shopping.py 需實作三個函數
def load_data(filename):
    """回傳 (evidence, labels)；evidence 為 list of lists，labels 為 list of 0/1"""
    ...

def train_model(evidence, labels):
    """回傳訓練好的模型（需包含 scaler 以便預測時同樣標準化）"""
    ...

def evaluate(labels, predictions):
    """回傳 (sensitivity, specificity)"""
    ...
```

### 完整參考實作

```python
# shopping.py 完整實作
import csv
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

def load_data(filename):
    evidence = []
    labels = []
    
    month_map = {"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "June": 5,
                 "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11}
    
    with open(filename) as f:
        reader = csv.DictReader(f)
        for row in reader:
            ev = [
                int(row["Administrative"]),
                float(row["Administrative_Duration"]),
                int(row["Informational"]),
                float(row["Informational_Duration"]),
                int(row["ProductRelated"]),
                float(row["ProductRelated_Duration"]),
                float(row["BounceRates"]),
                float(row["ExitRates"]),
                float(row["PageValues"]),
                float(row["SpecialDay"]),
                month_map[row["Month"]],
                int(row["OperatingSystems"]),
                int(row["Browser"]),
                int(row["Region"]),
                int(row["TrafficType"]),
                1 if row["VisitorType"] == "Returning_Visitor" else 0,
                1 if row["Weekend"] == "TRUE" else 0
            ]
            evidence.append(ev)
            labels.append(1 if row["Revenue"] == "TRUE" else 0)
    
    return evidence, labels

def train_model(evidence, labels):
    scaler = StandardScaler()
    evidence_scaled = scaler.fit_transform(evidence)
    
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence_scaled, labels)
    
    # 回傳 tuple 以便 predict 時使用相同 scaler
    return (model, scaler)

def predict(model, scaler, evidence):
    model_obj, scaler_obj = model
    return model_obj.predict(scaler_obj.transform(evidence))

def evaluate(labels, predictions):
    tp = sum((l == 1 and p == 1) for l, p in zip(labels, predictions))
    tn = sum((l == 0 and p == 0) for l, p in zip(labels, predictions))
    fp = sum((l == 0 and p == 1) for l, p in zip(labels, predictions))
    fn = sum((l == 1 and p == 0) for l, p in zip(labels, predictions))
    
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    return sensitivity, specificity
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/shopping.zip
unzip shopping.zip && cd shopping

python shopping.py shopping.csv
# 預期輸出：Correct, Incorrect, True Positive Rate, True Negative Rate

check50 ai50/projects/2024/x/shopping
style50 shopping.py
```

---

## 專案 4B：Nim —— Q-learning 學會玩遊戲

### 任務

實作 Q-learning agent 學會玩 Nim 遊戲：數堆石子，雙方輪流從單一堆拿走任意數量石子，拿走最後一顆者獲勝。Agent 需透過自我對弈學習最優策略。

### 遊戲規則與狀態表示

```python
# nim.py 核心結構
class Nim:
    def __init__(self, piles=[1, 3, 5, 7]):
        self.piles = piles[:]  # list of int
    
    def available_actions(self):
        """回傳所有合法動作 (pile_index, count)"""
        actions = set()
        for i, count in enumerate(self.piles):
            for take in range(1, count + 1):
                actions.add((i, take))
        return actions
    
    def move(self, action):
        """執行動作，回傳 (new_piles, reward, done)"""
        i, take = action
        self.piles[i] -= take
        reward = 1 if all(p == 0 for p in self.piles) else 0
        done = all(p == 0 for p in self.piles)
        return self.piles[:], reward, done
```

### Q-learning 核心實作

```python
# nim.py 參考實作
import random
from collections import defaultdict

class NimAI:
    def __init__(self, alpha=0.5, epsilon=0.1):
        self.q = defaultdict(float)  # Q-table: (state_tuple, action) -> value
        self.alpha = alpha           # 學習率
        self.epsilon = epsilon       # 探索率
    
    def get_q(self, state, action):
        return self.q[(tuple(state), action)]
    
    def choose_action(self, state, actions, training=True):
        if training and random.random() < self.epsilon:
            return random.choice(list(actions))
        
        # 貪婪選擇：最大 Q 值
        q_values = {a: self.get_q(state, a) for a in actions}
        max_q = max(q_values.values())
        best_actions = [a for a, q in q_values.items() if q == max_q]
        return random.choice(best_actions)
    
    def update(self, state, action, reward, next_state, next_actions):
        """Q-learning 更新規則"""
        old_q = self.get_q(state, action)
        
        if next_actions:
            max_next_q = max(self.get_q(next_state, a) for a in next_actions)
        else:
            max_next_q = 0  # 終局
        
        # Q(s,a) ← Q(s,a) + α [R + γ max Q(s',a') - Q(s,a)]
        # γ=1 因為 Nim 是有限步遊戲
        self.q[(tuple(state), action)] = old_q + self.alpha * (
            reward + max_next_q - old_q
        )

def train(n_episodes=10000):
    ai = NimAI()
    for _ in range(n_episodes):
        game = Nim()
        state = game.piles[:]
        
        while True:
            actions = game.available_actions()
            action = ai.choose_action(state, actions, training=True)
            next_state, reward, done = game.move(action)
            next_actions = game.available_actions() if not done else set()
            
            ai.update(state, action, reward, next_state, next_actions)
            
            state = next_state
            if done:
                break
    return ai
```

### 對戰與驗證

```python
def play(ai, human_first=False):
    game = Nim()
    state = game.piles[:]
    player = 0 if human_first else 1  # 0=human, 1=AI
    
    while True:
        actions = game.available_actions()
        if player == 0:
            # 人類輸入
            print(f"Piles: {state}")
            pile = int(input("Choose pile: "))
            count = int(input("Choose count: "))
            action = (pile, count)
        else:
            action = ai.choose_action(state, actions, training=False)
            print(f"AI chooses: {action}")
        
        next_state, reward, done = game.move(action)
        state = next_state
        
        if done:
            print(f"{'Human' if player == 0 else 'AI'} wins!")
            break
        player = 1 - player
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/nim.zip
unzip nim.zip && cd nim

python play.py  # 與訓練好的 AI 對戰
# 或直接跑測試
python nim.py

check50 ai50/projects/2024/x/nim
style50 nim.py
```

---

## 學習檢核清單

- [ ] 能解釋 k-NN 為何需要特徵標準化（距離度量敏感度）
- [ ] 能手寫 Q-learning 更新公式並說明 α、γ、ε 各自角色
- [ ] 理解 sensitivity vs specificity 的業務含義差異（Shopping 專案）
- [ ] 理解 Nim 中狀態表示為何用 tuple（Q-table 鍵需可哈希）
- [ ] 理解 ε-greedy 在訓練 vs 推論階段的不同行為
- [ ] 兩專案 `check50` 全綠

## 參考資料

- [Week 4 Learning 講課頁](https://cs50.harvard.edu/ai/weeks/4/) — 影片、投影片、逐字稿、Quiz
- [Week 4 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/4/) — 本文內容主要來源
- [Shopping 專案規格](https://cs50.harvard.edu/ai/projects/4/shopping/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/shopping`
- [Nim 專案規格](https://cs50.harvard.edu/ai/projects/4/nim/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/nim`
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義