---
title: "Harvard CS50 AI Week 6：Language——N-gram 語言模型、TF-IDF 問答系統、Parser 與 Attention"
date: 2026-10-08
category: tech
tags: [harvard-cs50ai, ai, nlp, n-gram, tf-idf, parser, attention, language-model, questions, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 7
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 7
tldr: "Week 6 處理自然語言：N-gram 語言模型平滑、CFG 句法解析、TF-IDF 文檢索、注意力機制、Transformer 概念，專案 Parser 生成句子、Questions 實作問答系統。"
description: "詳細導讀 Harvard CS50 AI Week 6 Language：講課重點、影片時間軸、N-gram 模型與平滑技術、CFG 與 CYK 算法、TF-IDF 向量空間模型、注意力與 Self-Attention、Parser 專案（句法生成）、Questions 專案（TF-IDF 問答），規格與 check50 指令。影片為 2023 年重錄版；規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-08-harvard-cs50ai-w06-language-en)

> ⚠️ **版本提醒**：本週講課影片為 **2023 年重錄版**（前六週為 2020 年）；專案規格、distribution code、check50 slug 均以 2026 年 OCW 官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

Week 6 處理自然語言：N-gram 條件機率與平滑、CFG 句法結構與 CYK 解析、TF-IDF 向量檢索、注意力機制與 Transformer 基礎。兩專案分別實作句法生成器與問答系統。

## 課程影片與時間軸

YouTube：[Week 6 Language (2023 重錄版)](https://www.youtube.com/watch?v=Q7K9Q9Q9Q9Q)

| 時間區段 | 內容 |
|---|---|
| 00:00–10:00 | NLP 簡介、語言模型目標、N-gram、馬可夫假設 |
| 10:00–25:00 | N-gram 機率估計、最大似然、平滑：Laplace、Add-k、Good-Turing、Kneser-Ney |
| 25:00–40:00 | 語法分析：CFG、生成規則、歧義、CYK 算法、CKY 表填充 |
| 40:00–55:00 | 資訊檢索：倒排索引、TF-IDF、向量空間模型、餘弦相似度 |
| 55:00–1:10:00 | 問答系統：文檔檢索、段落排序、答案抽取 |
| 1:10:00–1:25:00 | 注意力機制：Seq2Seq、Attention、Self-Attention、Multi-Head、Transformer 架構 |
| 1:25:00–1:35:00 | 專案介紹：Parser（CFG 句子生成）、Questions（TF-IDF 問答） |

> 完整逐字稿：[Week 6 Notes](https://cs50.harvard.edu/ai/2020/notes/6/)（注意：notes 頁面仍為 2020 版，但影片為 2023 版）

## 核心概念速覽

### N-gram 語言模型

**馬可夫假設**：第 n 個詞僅依賴前 n-1 個詞
```
P(w₁...wₙ) ≈ Π P(wᵢ | wᵢ₋ₙ₊₁...wᵢ₋₁)
```

**最大似然估計**：
```
P(wₙ | w₁...wₙ₋₁) = Count(w₁...wₙ) / Count(w₁...wₙ₋₁)
```

**平滑技術比較**：

| 方法 | 公式核心 | 優點 | 缺點 |
|---|---|---|---|
| Laplace (Add-1) | (C+1)/(N+V) | 簡單、無零機率 | 低計數過度平滑、高計數不足 |
| Add-k | (C+k)/(N+kV) | k 可調 | 同 Laplace |
| Good-Turing | 重新分配低計數質量 | 理論紮實 | 複雜、需插值 |
| Kneser-Ney | 絕對折扣 + 續詞分佈 | 狀態最優、業界標準 | 實作最複雜 |

### 文法與句法解析

**CFG (Context-Free Grammar)**：四元組 (N, Σ, R, S)
- N：非終結符、Σ：終結符、R：生成規則、S：起始符

**CYK 算法**（Cocke-Younger-Kasami）：
- 僅適用 Chomsky Normal Form (CNF) 文法
- 動態規劃填表：`table[i][j]` 存放生成子串 wᵢ...wⱼ 的非終結符集合
- 複雜度 O(n³|G|)

```python
# CYK 核心邏輯
def cyk_parse(words, grammar):
    n = len(words)
    table = [[set() for _ in range(n)] for _ in range(n)]
    
    # 基底：長度 1 子串
    for i, word in enumerate(words):
        for lhs, rhs_list in grammar.productions():
            if len(rhs_list) == 1 and rhs_list[0] == word:
                table[i][i].add(lhs)
    
    # 遞推：長度 l 子串
    for l in range(2, n+1):
        for i in range(n-l+1):
            j = i + l - 1
            for k in range(i, j):
                for B in table[i][k]:
                    for C in table[k+1][j]:
                        for lhs, rhs_list in grammar.productions():
                            if len(rhs_list) == 2 and rhs_list == [B, C]:
                                table[i][j].add(lhs)
    
    return grammar.start() in table[0][n-1]
```

### TF-IDF 向量空間模型

**TF (Term Frequency)**：詞在文件中出現頻率
**IDF (Inverse Document Frequency)**：`log(N / df_t)`，N=總文件數、df_t=包含詞 t 的文件數
**TF-IDF**：`tf_{t,d} × idf_t`

**餘弦相似度**：
```
sim(d, q) = (Σ tfidf_{t,d} × tfidf_{t,q}) / (‖d‖ × ‖q‖)
```

### 注意力機制與 Transformer

**Scaled Dot-Product Attention**：
```
Attention(Q, K, V) = softmax(QKᵀ/√dₖ) V
```
- Q (Query)、K (Key)、V (Value) 均為輸入投影
- √dₖ 縮放防止梯度消失

**Multi-Head Attention**：
```
MultiHead(Q, K, V) = Concat(head₁...headₕ) Wᴼ
headᵢ = Attention(QWᵢᴼ, KWᵢᴷ, VWᵢⱽ)
```

**Transformer Encoder Block**：
```
x → LayerNorm → MultiHeadAttention → + (residual) → LayerNorm → FFN → + (residual) → output
```

---

## 專案 6A：Parser —— CFG 句法生成器

### 任務

給定 CFG 文法檔（`grammar.cfg`），實作：
1. `parse(sentence)`：CYK 算法判斷句子是否合法
2. `generate(symbol)`：從起始符遞迴生成合法句子

### Distribution Code 結構

```python
# parser.py 提供的類別
class Grammar:
    def __init__(self, rules):
        self.rules = rules  # list of (lhs, [rhs...])
    
    def productions(self):
        return self.rules
    
    def start(self):
        return 'S'  # 起始符號
```

### 參考實作核心

```python
# parser.py 片段
from collections import defaultdict
import random

class Parser:
    def __init__(self, grammar):
        self.grammar = grammar
        # 建立反向索引：RHS tuple -> set of LHS
        self.rhs_to_lhs = defaultdict(set)
        for lhs, rhs in grammar.productions():
            self.rhs_to_lhs[tuple(rhs)].add(lhs)
    
    def parse(self, sentence):
        """CYK 算法回傳是否可由文法生成"""
        words = sentence.split()
        n = len(words)
        if n == 0:
            return False
        
        table = [[set() for _ in range(n)] for _ in range(n)]
        
        # 長度 1：終結符匹配
        for i, word in enumerate(words):
            for lhs in self.rhs_to_lhs.get((word,), set()):
                table[i][i].add(lhs)
        
        # 長度 >= 2
        for length in range(2, n+1):
            for i in range(n - length + 1):
                j = i + length - 1
                for k in range(i, j):
                    for B in table[i][k]:
                        for C in table[k+1][j]:
                            for lhs in self.rhs_to_lhs.get((B, C), set()):
                                table[i][j].add(lhs)
        
        return self.grammar.start() in table[0][n-1]
    
    def generate(self, symbol=None):
        """從 symbol 遞迴生成句子"""
        if symbol is None:
            symbol = self.grammar.start()
        
        # 找所有以 symbol 為 LHS 的規則
        productions = [rhs for lhs, rhs in self.grammar.productions() if lhs == symbol]
        if not productions:
            return [symbol]  # 終結符
        
        # 隨機選一條規則
        rhs = random.choice(productions)
        result = []
        for sym in rhs:
            result.extend(self.generate(sym))
        return result
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/parser.zip
unzip parser.zip && cd parser

python parser.py sentences.txt
# 輸出每句是否合法

check50 ai50/projects/2024/x/parser
style50 parser.py
```

---

## 專案 6B：Questions —— TF-IDF 問答系統

### 任務

給定語料庫目錄（`corpus/` 含多個 `.txt` 檔案）與問題檔（`questions.txt`），對每個問題：
1. 計算 TF-IDF 向量
2. 找最相關文件（餘弦相似度）
3. 在文件中找最相關句子
4. 從句子抽取答案片段

### Distribution Code 重點

```python
# questions.py 提供的資料結構
def load_files(directory):
    """回傳 {filename: content}"""
    ...

def tokenize(document):
    """回傳詞列表（小寫、去標點、去停用詞）"""
    ...
```

### 參考實作核心

```python
# questions.py 完整實作
import os
import math
import re
from collections import Counter

def tokenize(document):
    """簡單分詞：小寫、保留字母數字、去停用詞"""
    stopwords = set(["a", "an", "the", "and", "or", "but", "if", "then", "else",
                     "when", "at", "from", "by", "on", "off", "for", "in", "out",
                     "over", "under", "again", "further", "then", "once", "here",
                     "there", "when", "where", "why", "how", "all", "each", "few",
                     "more", "most", "other", "some", "such", "no", "nor", "not",
                     "only", "own", "same", "so", "than", "too", "very", "can",
                     "will", "just", "don", "should", "now"])
    
    words = re.findall(r'\b\w+\b', document.lower())
    return [w for w in words if w not in stopwords and len(w) > 1]

def compute_tfidf(documents):
    """documents: {doc_id: [tokens]} -> {doc_id: {term: tfidf}}"""
    N = len(documents)
    # 文件頻率
    df = Counter()
    for tokens in documents.values():
        df.update(set(tokens))
    
    # IDF
    idf = {term: math.log(N / freq) for term, freq in df.items()}
    
    # TF-IDF per document
    tfidf = {}
    for doc_id, tokens in documents.items():
        tf = Counter(tokens)
        max_tf = max(tf.values()) if tf else 1
        tfidf[doc_id] = {term: (count/max_tf) * idf[term] for term, count in tf.items()}
    return tfidf, idf

def cosine_similarity(vec1, vec2):
    """兩稀疏向量餘弦相似度"""
    dot = sum(vec1.get(t, 0) * vec2.get(t, 0) for t in set(vec1) | set(vec2))
    norm1 = math.sqrt(sum(v*v for v in vec1.values()))
    norm2 = math.sqrt(sum(v*v for v in vec2.values()))
    return dot / (norm1 * norm2) if norm1 and norm2 else 0

def top_files(query, files_tfidf, idf, n=1):
    """找前 n 個最相關文件"""
    query_tokens = tokenize(query)
    query_vec = {t: query_tokens.count(t) * idf.get(t, 0) for t in set(query_tokens)}
    
    scores = [(doc_id, cosine_similarity(query_vec, doc_vec)) 
              for doc_id, doc_vec in files_tfidf.items()]
    scores.sort(key=lambda x: x[1], reverse=True)
    return [doc_id for doc_id, _ in scores[:n]]

def top_sentences(query, sentences, idf, n=1):
    """在句子層級找最相關"""
    query_tokens = set(tokenize(query))
    scored = []
    for sent, tokens in sentences.items():
        # 計算查詢詞在句子中的 TF-IDF 加權密度
        score = sum(idf.get(t, 0) for t in query_tokens if t in tokens)
        # 密度：匹配詞數 / 句子長度
        density = sum(1 for t in query_tokens if t in tokens) / len(tokens) if tokens else 0
        scored.append((sent, score, density))
    
    scored.sort(key=lambda x: (x[1], x[2]), reverse=True)
    return [s for s, _, _ in scored[:n]]

def main():
    import sys
    if len(sys.argv) != 3:
        sys.exit("Usage: python questions.py corpus questions.txt")
    
    corpus_dir = sys.argv[1]
    questions_file = sys.argv[2]
    
    # 載入語料庫
    files = load_files(corpus_dir)
    file_tokens = {fid: tokenize(text) for fid, text in files.items()}
    files_tfidf, idf = compute_tfidf(file_tokens)
    
    # 載入問題
    with open(questions_file) as f:
        questions = [line.strip() for line in f if line.strip()]
    
    for question in questions:
        # 1. 找最相關文件
        top_file_ids = top_files(question, files_tfidf, idf, n=1)
        if not top_file_ids:
            print("No matching documents")
            continue
        
        top_file = top_file_ids[0]
        
        # 2. 將文件切句
        sentences = {}
        for sent in re.split(r'[.!?]+', files[top_file]):
            sent = sent.strip()
            if sent:
                sentences[sent] = tokenize(sent)
        
        # 3. 找最相關句子
        top_sents = top_sentences(question, sentences, idf, n=1)
        if top_sents:
            print(top_sents[0])
        else:
            print("No matching sentences")
```

### 執行與驗證

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/questions.zip
unzip questions.zip && cd questions

python questions.py corpus questions.txt
# 輸出每個問題的最佳答案句子

check50 ai50/projects/2024/x/questions
style50 questions.py
```

---

## 學習檢核清單

- [ ] 能手寫 N-gram 條件機率公式並解釋平滑必要性
- [ ] 能比較 Laplace、Add-k、Good-Turing、Kneser-Ney 四種平滑優缺點
- [ ] 理解 CFG 定義與 CNF 限制，能手寫 CYK 表填充邏輯
- [ ] 能推導 TF-IDF 公式並解釋 IDF 為何用 log
- [ ] 理解 Attention Q/K/V 投影與 scaled dot-product 注意力機制
- [ ] 理解 Multi-Head Attention 為何需要多頭（捕捉不同關係類型）
- [ ] 兩專案 `check50` 全綠

## 參考資料

- [Week 6 Language 講課頁](https://cs50.harvard.edu/ai/weeks/6/) — 影片、投影片、逐字稿、Quiz
- [Week 6 Notes](https://cs50.harvard.edu/ai/2020/notes/6/) — 2020 版筆記，影片為 2023 版
- [Parser 專案規格](https://cs50.harvard.edu/ai/projects/6/parser/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/parser`
- [Questions 專案規格](https://cs50.harvard.edu/ai/projects/6/questions/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/questions`
- [CS50 AI YouTube 播放列表](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義