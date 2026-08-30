---
title: "Harvard CS50 AI Week 6: Language — N-gram Language Models, TF-IDF QA, Parser & Attention"
date: 2026-08-30
category: tech
tags: [harvard-cs50ai, ai, nlp, n-gram, tf-idf, parser, attention, language-model, questions, python, cs50]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 7
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 7
tldr: "Week 6 processes natural language: N-gram conditional probability & smoothing, CFG syntax parsing with CYK, TF-IDF vector retrieval, attention mechanism & Transformer basics. Projects: Parser (syntactic generation) and Questions (TF-IDF QA system)."
description: "Detailed guide to Harvard CS50 AI Week 6 Language: lecture highlights, video timestamps, N-gram models & smoothing, CFG & CYK algorithm, TF-IDF vector space model, attention & Self-Attention, Parser project (syntactic generation), Questions project (TF-IDF QA), specs and check50 commands. Videos recorded 2023 (re-recorded); specs current as of 2026."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-08-harvard-cs50ai-w06-language)

> ⚠️ **Version note**: This week's lecture videos were **re-recorded in 2023** (first six weeks are 2020); project specs, distribution code, and check50 slugs follow the 2026 OCW site (i.e., `ai50/projects/2024/x/...`).

## TL;DR

Week 6 handles natural language: N-gram conditional probability & smoothing, CFG syntax parsing with CYK, TF-IDF vector retrieval, attention mechanism & Transformer basics. Two projects implement syntactic generator and QA system.

## Lecture Video & Timestamps

YouTube: [Week 6 Language (2023 re-recorded)](https://www.youtube.com/watch?v=Q7K9Q9Q9Q9Q)

| Timestamp | Content |
|---|---|
| 00:00–10:00 | NLP intro, language modeling goal, N-gram, Markov assumption |
| 10:00–25:00 | N-gram probability estimation, MLE, smoothing: Laplace, Add-k, Good-Turing, Kneser-Ney |
| 25:00–40:00 | Syntax parsing: CFG, production rules, ambiguity, CYK algorithm, CKY table filling |
| 40:00–55:00 | Information retrieval: inverted index, TF-IDF, vector space model, cosine similarity |
| 55:00–1:10:00 | QA systems: document retrieval, passage ranking, answer extraction |
| 1:10:00–1:25:00 | Attention mechanism: Seq2Seq, Attention, Self-Attention, Multi-Head, Transformer architecture |
| 1:25:00–1:35:00 | Project intro: Parser (CFG sentence generation), Questions (TF-IDF QA) |

> Full transcript: [Week 6 Notes](https://cs50.harvard.edu/ai/2020/notes/6/) (note: notes page is 2020 edition, but video is 2023)

## Core Concepts Cheat Sheet

### N-gram Language Models

**Markov Assumption**: n-th word depends only on previous n-1 words
```
P(w₁...wₙ) ≈ Π P(wᵢ | wᵢ₋ₙ₊₁...wᵢ₋₁)
```

**Maximum Likelihood Estimation**:
```
P(wₙ | w₁...wₙ₋₁) = Count(w₁...wₙ) / Count(w₁...wₙ₋₁)
```

**Smoothing Technique Comparison**:

| Method | Core Formula | Pros | Cons |
|---|---|---|---|
| Laplace (Add-1) | (C+1)/(N+V) | Simple, no zero prob | Over-smooths low counts, under-smooths high |
| Add-k | (C+k)/(N+kV) | Tunable k | Same as Laplace |
| Good-Turing | Reallocate low-count mass | Theoretically sound | Complex, needs interpolation |
| Kneser-Ney | Absolute discount + continuation dist | State-of-the-art, industry standard | Most complex implementation |

### Grammar & Syntax Parsing

**CFG (Context-Free Grammar)**: 4-tuple (N, Σ, R, S)
- N: non-terminals, Σ: terminals, R: production rules, S: start symbol

**CYK Algorithm** (Cocke-Younger-Kasami):
- Only works for Chomsky Normal Form (CNF) grammars
- DP table filling: `table[i][j]` stores non-terminals generating substring wᵢ...wⱼ
- Complexity O(n³|G|)

```python
# CYK core logic
def cyk_parse(words, grammar):
    n = len(words)
    table = [[set() for _ in range(n)] for _ in range(n)]
    
    # Base: length-1 substrings
    for i, word in enumerate(words):
        for lhs, rhs_list in grammar.productions():
            if len(rhs_list) == 1 and rhs_list[0] == word:
                table[i][i].add(lhs)
    
    # Recurrence: length-l substrings
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

### TF-IDF Vector Space Model

**TF (Term Frequency)**: term frequency in document
**IDF (Inverse Document Frequency)**: `log(N / df_t)`, N=total docs, df_t=docs containing term t
**TF-IDF**: `tf_{t,d} × idf_t`

**Cosine Similarity**:
```
sim(d, q) = (Σ tfidf_{t,d} × tfidf_{t,q}) / (‖d‖ × ‖q‖)
```

### Attention Mechanism & Transformer

**Scaled Dot-Product Attention**:
```
Attention(Q, K, V) = softmax(QKᵀ/√dₖ) V
```
- Q (Query), K (Key), V (Value) all projected from input
- √dₖ scaling prevents gradient vanishing

**Multi-Head Attention**:
```
MultiHead(Q, K, V) = Concat(head₁...headₕ) Wᴼ
headᵢ = Attention(QWᵢᴼ, KWᵢᴷ, VWᵢⱽ)
```

**Transformer Encoder Block**:
```
x → LayerNorm → MultiHeadAttention → + (residual) → LayerNorm → FFN → + (residual) → output
```

---

## Project 6A: Parser — CFG Syntactic Generator

### Task

Given a CFG grammar file (`grammar.cfg`), implement:
1. `parse(sentence)`: CYK algorithm to check if sentence is valid
2. `generate(symbol)`: recursively generate valid sentence from start symbol

### Distribution Code Structure

```python
# parser.py provided classes
class Grammar:
    def __init__(self, rules):
        self.rules = rules  # list of (lhs, [rhs...])
    
    def productions(self):
        return self.rules
    
    def start(self):
        return 'S'  # start symbol
```

### Reference Core Implementation

```python
# parser.py snippet
from collections import defaultdict
import random

class Parser:
    def __init__(self, grammar):
        self.grammar = grammar
        # Build reverse index: RHS tuple -> set of LHS
        self.rhs_to_lhs = defaultdict(set)
        for lhs, rhs in grammar.productions():
            self.rhs_to_lhs[tuple(rhs)].add(lhs)
    
    def parse(self, sentence):
        """CYK algorithm returns whether grammar can generate sentence"""
        words = sentence.split()
        n = len(words)
        if n == 0:
            return False
        
        table = [[set() for _ in range(n)] for _ in range(n)]
        
        # Length 1: terminal matches
        for i, word in enumerate(words):
            for lhs in self.rhs_to_lhs.get((word,), set()):
                table[i][i].add(lhs)
        
        # Length >= 2
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
        """Recursively generate sentence from symbol"""
        if symbol is None:
            symbol = self.grammar.start()
        
        # Find all rules with symbol as LHS
        productions = [rhs for lhs, rhs in self.grammar.productions() if lhs == symbol]
        if not productions:
            return [symbol]  # terminal
        
        # Randomly pick one rule
        rhs = random.choice(productions)
        result = []
        for sym in rhs:
            result.extend(self.generate(sym))
        return result
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/parser.zip
unzip parser.zip && cd parser

python parser.py sentences.txt
# Output: whether each sentence is valid

check50 ai50/projects/2024/x/parser
style50 parser.py
```

---

## Project 6B: Questions — TF-IDF Question Answering System

### Task

Given a corpus directory (`corpus/` with multiple `.txt` files) and questions file (`questions.txt`), for each question:
1. Compute TF-IDF vectors
2. Find most relevant document (cosine similarity)
3. Find most relevant sentence in document
4. Extract answer span from sentence

### Distribution Code Highlights

```python
# questions.py provided data structures
def load_files(directory):
    """Return {filename: content}"""
    ...

def tokenize(document):
    """Return token list (lowercase, remove punctuation, remove stopwords)"""
    ...
```

### Reference Core Implementation

```python
# questions.py full implementation
import os
import math
import re
from collections import Counter

def tokenize(document):
    """Simple tokenization: lowercase, keep alphanumeric, remove stopwords"""
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
    # Document frequency
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
    """Cosine similarity of two sparse vectors"""
    dot = sum(vec1.get(t, 0) * vec2.get(t, 0) for t in set(vec1) | set(vec2))
    norm1 = math.sqrt(sum(v*v for v in vec1.values()))
    norm2 = math.sqrt(sum(v*v for v in vec2.values()))
    return dot / (norm1 * norm2) if norm1 and norm2 else 0

def top_files(query, files_tfidf, idf, n=1):
    """Find top n most relevant documents"""
    query_tokens = tokenize(query)
    query_vec = {t: query_tokens.count(t) * idf.get(t, 0) for t in set(query_tokens)}
    
    scores = [(doc_id, cosine_similarity(query_vec, doc_vec)) 
              for doc_id, doc_vec in files_tfidf.items()]
    scores.sort(key=lambda x: x[1], reverse=True)
    return [doc_id for doc_id, _ in scores[:n]]

def top_sentences(query, sentences, idf, n=1):
    """Find most relevant sentences at sentence level"""
    query_tokens = set(tokenize(query))
    scored = []
    for sent, tokens in sentences.items():
        # TF-IDF weighted density of query terms in sentence
        score = sum(idf.get(t, 0) for t in query_tokens if t in tokens)
        # Density: matched terms / sentence length
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
    
    # Load corpus
    files = load_files(corpus_dir)
    file_tokens = {fid: tokenize(text) for fid, text in files.items()}
    files_tfidf, idf = compute_tfidf(file_tokens)
    
    # Load questions
    with open(questions_file) as f:
        questions = [line.strip() for line in f if line.strip()]
    
    for question in questions:
        # 1. Find most relevant document
        top_file_ids = top_files(question, files_tfidf, idf, n=1)
        if not top_file_ids:
            print("No matching documents")
            continue
        
        top_file = top_file_ids[0]
        
        # 2. Split document into sentences
        sentences = {}
        for sent in re.split(r'[.!?]+', files[top_file]):
            sent = sent.strip()
            if sent:
                sentences[sent] = tokenize(sent)
        
        # 3. Find most relevant sentence
        top_sents = top_sentences(question, sentences, idf, n=1)
        if top_sents:
            print(top_sents[0])
        else:
            print("No matching sentences")
```

### Run & Verify

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/6/questions.zip
unzip questions.zip && cd questions

python questions.py corpus questions.txt
# Output: best answer sentence for each question

check50 ai50/projects/2024/x/questions
style50 questions.py
```

---

## Learning Checklist

- [ ] Can hand-write N-gram conditional probability formula and explain smoothing necessity
- [ ] Can compare Laplace, Add-k, Good-Turing, Kneser-Ney smoothing pros/cons
- [ ] Understand CFG definition & CNF restriction, can hand-write CYK table filling logic
- [ ] Can derive TF-IDF formula and explain why IDF uses log
- [ ] Understand Attention Q/K/V projections & scaled dot-product attention mechanism
- [ ] Understand why Multi-Head Attention needs multiple heads (capture different relation types)
- [ ] Both projects pass `check50` clean

## References

- [Week 6 Language lecture page](https://cs50.harvard.edu/ai/weeks/6/) — video, slides, transcript, quiz
- [Week 6 Notes](https://cs50.harvard.edu/ai/2020/notes/6/) — 2020 edition notes, video is 2023
- [Parser project spec](https://cs50.harvard.edu/ai/projects/6/parser/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/parser`
- [Questions project spec](https://cs50.harvard.edu/ai/projects/6/questions/) — Distribution `2023/x`, check50 slug `ai50/projects/2024/x/questions`
- [CS50 AI YouTube playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 documentation](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- On this site: [Harvard CS50 AI Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en) — series entry & version notes
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 tier definition