---
title: "Harvard CS50 AI Week 2：Uncertainty——機率、貝氏網路、馬可夫模型與遺傳推斷"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, probability, bayesian-network, markov-model, heredity, pagerank, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 3
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 3
tldr: "Week 2 從確定性轉向機率：貝氏法則、貝氏網路 D-separation、馬可夫模型、PageRank 隨機漫步，專案 Heredity 算基因型、PageRank 算網頁權重。"
description: "詳細導讀 Harvard CS50 AI Week 2 Uncertainty：講課重點、影片時間軸、貝氏網路建構與推論、馬可夫鏈穩態分佈、PageRank 迭代與取樣實作、Heredity 與 PageRank 兩專案規格與 check50 指令。影片為 2020 年錄製；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-10-harvard-cs50ai-w02-uncertainty-en)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

Week 2 引入機率處理不確定性：貝氏網路編碼條件獨立、馬可夫模型建模序列、PageRank 用隨機漫步排序網頁。兩專案分別實作遺傳推斷與網頁排名。

## 課程影片與時間軸

YouTube：[Week 2 Uncertainty (2020 錄製)](https://www.youtube.com/watch?v=qYl8k3K6t1M)

| 時間區段 | 內容 |
|---|---|
| 00:00–08:00 | 不確定性動機、機率公理、條件機率、貝氏法則 |
| 08:00–22:00 | 貝氏網路：節點、有向邊、條件機率表 CPT、D-separation 判定條件獨立 |
| 22:00–38:00 | 貝氏網路推論：Enumeration、Variable Elimination、取樣近似 |
| 38:00–52:00 | 馬可夫模型：馬可夫假設、轉移矩陣、穩態分佈、PageRank 隨機漫步 |
| 52:00–1:05:00 | 隱馬可夫模型 HMM：觀測、前向算法、維特比算法 |
| 1:05:00–1:15:00 | 專案介紹：Heredity（貝氏網路取樣）、PageRank（迭代與取樣） |

> 完整逐字稿：[Week 2 Notes](https://cs50.harvard.edu/ai/2020/notes/2/)

## 核心概念速覽

### 貝氏法則與條件獨立

```
P(A|B) = P(B|A) P(A) / P(B)
```

**條件獨立**：X ⊥ Y | Z ⇔ P(X, Y | Z) = P(X | Z) P(Y | Z)
- 貝氏網路用有向無環圖 (DAG) 編碼條件獨立
- **D-separation**：路徑被「阻斷」的三種情況
  1. 鏈/共同原因：中間節點在觀測集 Z 中
  2. 共同效應：中間節點不在 Z 中，且其子孫也不在 Z 中

### 貝氏網路推論三種策略

| 策略 | 適用場景 | 複雜度 |
|---|---|---|
| Enumeration (全域聯合分佈) | 變數極少 (<10) | O(2^n) |
| Variable Elimination | 中等規模、需精確答案 | 指數級但實際較好 |
| Approximate Inference (取樣) | 大型網路、可容忍誤差 | 線性於樣本數 |

**拒絕取樣** 基本流程：
```python
# rejection_sampling.py 核心邏輯
def rejection_sampling(query_var, evidence, network, N=10000):
    counts = {True: 0, False: 0}
    for _ in range(N):
        sample = {}
        # 按拓撲序取樣每個變數
        for var in network.topological_order():
            parents_vals = {p: sample[p] for p in network.parents(var)}
            prob = network.cpt(var)[tuple(parents_vals.values())]
            sample[var] = random.random() < prob
        if all(sample[e] == v for e, v in evidence.items()):
            counts[sample[query_var]] += 1
    total = sum(counts.values())
    return {k: v/total for k, v in counts.items()} if total > 0 else {True: 0.5, False: 0.5}
```

**似然權重取樣** 修正拒絕取樣低效：固定證據變數，只取樣非證據變數，權重 = ∏ P(evidence | parents)。

### 馬可夫模型與 PageRank

**馬可夫鏈**：狀態集 S、轉移矩陣 T、初始分佈 π₀
- **平穩分佈** π：π = π T（若存在且唯一）
- **PageRank** 解釋：隨機漫步者以機率 d 跟隨連結，以 1-d 隨機跳轉
  ```
  PR(p) = (1-d)/N + d Σ_{q→p} PR(q) / OutDegree(q)
  ```
  d 通常取 0.85，N 為網頁總數。

### 隱馬可夫模型 HMM

- 狀態不可觀測，只能觀測發射
- **前向算法**：計算 P(observations | model) —— 動態規劃避免指數爆炸
- **維特比算法**：找最可能狀態序列 argmax P(states | observations)

---

## 專案 2A：Heredity —— 貝氏網路取樣推斷基因型

### 任務

給定家系圖與部分基因型觀測，使用**似然權重取樣**推斷每個人擁有特定基因的機率。輸入 CSV 含 `name, mother, father, trait`（trait: 0/1/空）。

### Distribution Code 重點

```python
# heredity.py 已提供的核心結構
PROBS = {
    "gene": {2: 0.01, 1: 0.03, 0: 0.96},  # 先驗機率：2/1/0 份基因
    "trait": {
        2: {True: 0.65, False: 0.35},  # 2 份基因表現特徵機率
        1: {True: 0.56, False: 0.44},
        0: {True: 0.01, False: 0.99}
    },
    "mutation": 0.01  # 傳遞突變率
}

class Person:
    def __init__(self, name, mother, father):
        self.name = name
        self.mother = mother
        self.father = father
        self.trait = None  # True/False/None
```

### 參考實作核心：`joint_probability` + `update`

```python
# heredity.py 片段
import random

def joint_probability(people, one_gene, two_genes, have_trait):
    """計算特定基因分配與特徵觀測的聯合機率"""
    prob = 1.0
    for person in people.values():
        gene_count = (2 if person.name in two_genes else
                      1 if person.name in one_gene else 0)
        
        # 先驗或遺傳機率
        if person.mother is None and person.father is None:
            prob *= PROBS["gene"][gene_count]
        else:
            prob *= inheritance_prob(person, one_gene, two_genes)
        
        # 特徵機率
        has_trait = person.name in have_trait
        prob *= PROBS["trait"][gene_count][has_trait]
    return prob

def inheritance_prob(person, one_gene, two_genes):
    """計算從父母遺傳到 gene_count 的機率"""
    def prob_from_parent(parent_name):
        if parent_name in two_genes:
            return 1 - PROBS["mutation"]  # 傳遞 1 份
        elif parent_name in one_gene:
            return 0.5  # 50% 傳遞
        else:
            return PROBS["mutation"]  # 突變產生 1 份
    
    pm = prob_from_parent(person.mother)
    pf = prob_from_parent(person.father)
    # 組合：0份=(1-pm)(1-pf), 1份=pm(1-pf)+(1-pm)pf, 2份=pm*pf
    # 實際在 update() 中會針對特定 gene_count 計算
    ...

def update(probabilities, one_gene, two_genes, have_trait, p):
    """累加取樣權重"""
    for person in probabilities:
        if person in two_genes:
            probabilities[person]["gene"][2] += p
        elif person in one_gene:
            probabilities[person]["gene"][1] += p
        else:
            probabilities[person]["gene"][0] += p
        probabilities[person]["trait"][person in have_trait] += p
```

### 似然權重取樣主循環

```python
def main():
    # ... 讀取 CSV 建立 people dict ...
    probabilities = {name: {"gene": {2:0,1:0,0:0}, "trait": {True:0, False:0}} 
                     for name in people}
    
    N = 10000
    for _ in range(N):
        # 1. 取樣非證據變數
        one_gene, two_genes, have_trait = set(), set(), set()
        for person in people.values():
            if person.trait is not None:
                have_trait.add(person.name) if person.trait else None
                continue  # 證據變數固定
            
            # 取樣基因數
            if person.mother is None:
                # 先驗取樣
                r = random.random()
                if r < PROBS["gene"][2]: two_genes.add(person.name)
                elif r < PROBS["gene"][2] + PROBS["gene"][1]: one_gene.add(person.name)
            else:
                # 遺傳取樣
                gene = sample_from_parents(person, one_gene, two_genes)
                if gene == 2: two_genes.add(person.name)
                elif gene == 1: one_gene.add(person.name)
        
        # 2. 計算權重：證據變數的似然
        weight = 1.0
        for person in people.values():
            if person.trait is not None:
                gene = (2 if person.name in two_genes else
                        1 if person.name in one_gene else 0)
                weight *= PROBS["trait"][gene][person.trait]
        
        # 3. 累加
        update(probabilities, one_gene, two_genes, have_trait, weight)
    
    # 4. 正規化輸出
    for person in probabilities:
        normalize(probabilities[person]["gene"])
        normalize(probabilities[person]["trait"])
        print(person, probabilities[person])
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/2/heredity.zip
unzip heredity.zip && cd heredity

python heredity.py data/family0.csv
# 預期輸出：每人 gene/trait 機率分佈

check50 ai50/projects/2024/x/heredity
style50 heredity.py
```

---

## 專案 2B：PageRank —— 迭代與取樣兩種算法

### 任務

實作兩種 PageRank 計算方式：
1. **Iterative**：反覆套用公式直到收斂（|PR_new - PR_old| < 0.001）
2. **Sampling**：隨機漫步取樣 N 次，統計訪問頻率

輸入：`corpus` 目錄下的 HTML 檔案，解析 `<a href>` 建立連結圖。

### 參考實作：Iterative PageRank

```python
# pagerank.py 片段
def iterate_pagerank(corpus, damping_factor=0.85):
    N = len(corpus)
    pr = {page: 1/N for page in corpus}
    threshold = 0.001
    
    while True:
        new_pr = {}
        for page in corpus:
            # 基礎機率：隨機跳轉
            rank = (1 - damping_factor) / N
            
            # 加上來自所有指向 page 的頁面貢獻
            for possible in corpus:
                if page in corpus[possible]:
                    rank += damping_factor * pr[possible] / len(corpus[possible])
                elif not corpus[possible]:  # 沒有外鏈 → 視為連向所有頁面
                    rank += damping_factor * pr[possible] / N
            new_pr[page] = rank
        
        # 檢查收斂
        if all(abs(new_pr[p] - pr[p]) < threshold for p in corpus):
            break
        pr = new_pr
    
    # 正規化（浮點誤差修正）
    total = sum(pr.values())
    return {p: v/total for p, v in pr.items()}
```

### 參考實作：Sampling PageRank

```python
def sample_pagerank(corpus, damping_factor=0.85, n=10000):
    N = len(corpus)
    counts = {page: 0 for page in corpus}
    page = random.choice(list(corpus.keys()))
    
    for _ in range(n):
        counts[page] += 1
        
        # 隨機漫步下一步
        if not corpus[page] or random.random() > damping_factor:
            # 無外鏈或隨機跳轉：均勻選擇
            page = random.choice(list(corpus.keys()))
        else:
            # 跟隨外鏈
            page = random.choice(list(corpus[page]))
    
    return {p: c/n for p, c in counts.items()}
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/2/pagerank.zip
unzip pagerank.zip && cd pagerank

python pagerank.py corpus0
# 預期：Iterative 和 Sampling 結果接近

check50 ai50/projects/2024/x/pagerank
style50 pagerank.py
```

---

## 學習檢核清單

- [ ] 能口述貝氏網路如何編碼條件獨立（D-separation 三規則）
- [ ] 能手寫 Variable Elimination 推導邊際機率
- [ ] 理解拒絕取樣 vs 似然權重取樣的權重來源差異
- [ ] 能推導 PageRank 公式並解釋 damping factor 作用
- [ ] 理解 Heredity 中「先驗 vs 遺傳」機率的切換邏輯
- [ ] 兩專案 `check50` 全綠

## 參考資料

- [Week 2 Uncertainty 講課頁](https://cs50.harvard.edu/ai/weeks/2/) — 影片、投影片、逐字稿、Quiz
- [Week 2 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/2/) — 本文內容主要來源
- [Heredity 專案規格](https://cs50.harvard.edu/ai/projects/2/heredity/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/heredity`
- [PageRank 專案規格](https://cs50.harvard.edu/ai/projects/2/pagerank/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/pagerank`
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義